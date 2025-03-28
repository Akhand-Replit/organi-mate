import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders,
    });
  }

  try {
    // Create a Supabase client with the Auth context of the function
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    console.log("Supabase client created");

    // Get the authorization header from the request
    const authorizationHeader = req.headers.get('Authorization')?.split(' ')[1];
    
    if (!authorizationHeader) {
      console.log("Missing authorization header");
      return new Response(
        JSON.stringify({ error: "Missing authorization header" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    console.log("Getting user from auth header");
    // Get the user from the auth header
    const { data: { user: authUser }, error: authError } = await supabaseClient.auth.getUser(authorizationHeader);

    if (authError) {
      console.log("Auth error:", authError);
    }

    if (!authUser) {
      console.log("No user found");
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    console.log("Getting user profile");
    // Get the user's role from profiles
    const { data: profile, error: profileError } = await supabaseClient
      .from('profiles')
      .select('role, company_id')
      .eq('id', authUser.id)
      .single();

    if (profileError) {
      console.log("Profile error:", profileError);
      return new Response(
        JSON.stringify({ error: "Failed to get user profile: " + profileError.message }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    if (!profile) {
      console.log("No profile found");
      return new Response(
        JSON.stringify({ error: "User profile not found" }),
        {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    console.log("User role:", profile.role);

    // Parse the request body
    const requestData = await req.json();
    const { email, password, userData } = requestData;

    console.log("Request data received:", {
      email,
      userData: { ...userData, password: "[REDACTED]" }
    });

    // Validate request body
    if (!email || !password || !userData.name || !userData.role) {
      console.log("Missing required fields");
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Check if the user has permission to create users with the requested role
    if (profile.role === 'admin') {
      // Admin can only create company users
      if (userData.role !== 'company') {
        console.log("Admin can only create company users");
        return new Response(
          JSON.stringify({ error: "Admin can only create company users" }),
          {
            status: 403,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
    } else if (profile.role === 'company') {
      // Company can only create employee users for their own company
      const allowedRoles = ['branch_manager', 'assistant_manager', 'employee'];
      
      if (!allowedRoles.includes(userData.role)) {
        console.log("Company can only create employee-type users");
        return new Response(
          JSON.stringify({ error: "Company can only create employee-type users" }),
          {
            status: 403,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      
      // Set company_id to the creator's company_id
      userData.company_id = profile.company_id;
    } else {
      // Other roles cannot create users
      console.log("User does not have permission to create users");
      return new Response(
        JSON.stringify({ error: "You do not have permission to create users" }),
        {
          status: 403,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    console.log("Creating user with role:", userData.role);
    
    // Create the user 
    const { data: newUser, error: createError } = await supabaseClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,  // No email verification needed
      user_metadata: userData
    });

    if (createError) {
      console.log("Error creating user:", createError);
      return new Response(
        JSON.stringify({ error: createError.message }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    console.log("User created successfully, now handling additional operations based on role");

    // If company user is created, create a company record
    if (userData.role === 'company' && newUser.user) {
      console.log("Creating company record for:", userData.name);
      const { error: companyError } = await supabaseClient
        .from('companies')
        .insert({
          name: userData.name,
          user_id: newUser.user.id
        });

      if (companyError) {
        console.error("Error creating company:", companyError);
        // We don't fail the whole operation if company creation fails
      }
    }

    // If employee user is created, create an employee record
    if (['branch_manager', 'assistant_manager', 'employee'].includes(userData.role) && newUser.user) {
      console.log("Creating employee record for:", userData.name);
      const { error: employeeError } = await supabaseClient
        .from('employees')
        .insert({
          user_id: newUser.user.id,
          name: userData.name,
          company_id: userData.company_id,
          branch_id: userData.branch_id || null,
          role: userData.role
        });

      if (employeeError) {
        console.error("Error creating employee:", employeeError);
        // We don't fail the whole operation if employee creation fails
      }
    }

    console.log("All operations completed successfully");
    return new Response(
      JSON.stringify({ 
        message: "User created successfully", 
        user: newUser.user 
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Unexpected error:", error.message);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
