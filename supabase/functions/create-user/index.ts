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

    // Get the authorization header from the request
    const authorizationHeader = req.headers.get('Authorization')?.split(' ')[1];
    
    if (!authorizationHeader) {
      return new Response(
        JSON.stringify({ error: "Missing authorization header" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Get the user from the auth header
    const { data: { user: authUser }, error: authError } = await supabaseClient.auth.getUser(authorizationHeader);

    if (authError || !authUser) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Get the user's role from profiles
    const { data: profile, error: profileError } = await supabaseClient
      .from('profiles')
      .select('role, company_id')
      .eq('id', authUser.id)
      .single();

    if (profileError || !profile) {
      return new Response(
        JSON.stringify({ error: "Failed to get user profile" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Parse the request body
    const { email, password, userData } = await req.json();

    // Validate request body
    if (!email || !password || !userData.name || !userData.role) {
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
      return new Response(
        JSON.stringify({ error: "You do not have permission to create users" }),
        {
          status: 403,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Create the user 
    const { data: newUser, error: createError } = await supabaseClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,  // No email verification needed
      user_metadata: userData
    });

    if (createError) {
      return new Response(
        JSON.stringify({ error: createError.message }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // If company user is created, create a company record
    if (userData.role === 'company' && newUser.user) {
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
    console.error("Error:", error.message);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
