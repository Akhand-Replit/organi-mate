
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-admin-auth",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }
  
  try {
    // Get request body
    const requestData = await req.json();
    const { email, password, userData } = requestData;
    
    // Validation
    if (!email || !password || !userData) {
      console.log("Missing required fields:", { email: !!email, password: !!password, userData: !!userData });
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { 
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }
    
    // Extract user data
    const { name, role, company_id, branch_id } = userData;
    
    // Validate role
    const validRoles = ['admin', 'company', 'branch_manager', 'assistant_manager', 'employee', 'job_seeker'];
    if (!role || !validRoles.includes(role)) {
      console.log("Invalid role:", role);
      return new Response(
        JSON.stringify({ error: "Invalid user role" }),
        { 
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }
    
    console.log(`Creating user with role: ${role}, name: ${name}`);
    
    // Initialize the Supabase client with the Deno runtime
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    // Get the authorization header from the request
    const authorizationHeader = req.headers.get('Authorization')?.split(' ')[1];
    const adminAuthHeader = req.headers.get('X-Admin-Auth');
    
    // Check if we're creating a company through the public application form
    // In this case, we won't have a valid auth token
    const isPublicCompanyCreation = userData.role === 'company' && !authorizationHeader;
    // Check if it's a static admin request
    const isStaticAdminRequest = adminAuthHeader === 'static-admin-token';
    
    if (!authorizationHeader && !isPublicCompanyCreation && !isStaticAdminRequest) {
      console.log("Missing authorization header");
      return new Response(
        JSON.stringify({ error: "Missing authorization header" }),
        { 
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }
    
    // Placeholders for user details
    let authUser = null;
    let profile = null;

    // Only verify auth for non-public company creation and non-static admin requests
    if (!isPublicCompanyCreation && !isStaticAdminRequest) {
      console.log("Getting user from auth header");
      // Get the user from the auth header
      const { data: authData, error: authError } = await supabaseClient.auth.getUser(authorizationHeader);
      
      if (authError) {
        console.error("Auth error:", authError);
        return new Response(
          JSON.stringify({ error: authError.message }),
          { 
            status: 401,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          }
        );
      }
      
      if (!authData.user) {
        console.log("No authenticated user found");
        return new Response(
          JSON.stringify({ error: "Unauthorized" }),
          { 
            status: 401,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          }
        );
      }
      
      authUser = authData.user;
      
      // Get the user's profile
      const { data: profileData, error: profileError } = await supabaseClient
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single();
        
      if (profileError && profileError.code !== 'PGRST116') {
        console.error("Profile error:", profileError);
        return new Response(
          JSON.stringify({ error: profileError.message }),
          { 
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          }
        );
      }
      
      profile = profileData;
      
      // Check permissions based on the requester's role and the user role being created
      // Admin can create any user type
      // Company can create branch managers and employees for their own company
      // Branch managers can create employees for their own branch
      if (profile?.role === 'admin') {
        // Admin can create any user
        console.log("Admin user creating new user");
      } else if (profile?.role === 'company' && ['branch_manager', 'assistant_manager', 'employee'].includes(role)) {
        // Company can create branch managers and employees, but only for their own company
        if (company_id && company_id !== profile.company_id) {
          console.log("Company user trying to create user for different company");
          return new Response(
            JSON.stringify({ error: "You can only create users for your own company" }),
            { 
              status: 403,
              headers: { ...corsHeaders, "Content-Type": "application/json" }
            }
          );
        }
        
        // Set company_id to the company user's company_id
        userData.company_id = profile.company_id;
        
        console.log("Company user creating new user for their company");
      } else if (profile?.role === 'branch_manager' && role === 'employee') {
        // Branch manager can create employees, but only for their own branch
        if (branch_id && branch_id !== profile.branch_id) {
          console.log("Branch manager trying to create user for different branch");
          return new Response(
            JSON.stringify({ error: "You can only create users for your own branch" }),
            { 
              status: 403,
              headers: { ...corsHeaders, "Content-Type": "application/json" }
            }
          );
        }
        
        // Set company_id and branch_id to the branch manager's values
        userData.company_id = profile.company_id;
        userData.branch_id = profile.branch_id;
        
        console.log("Branch manager creating new employee for their branch");
      } else if (isStaticAdminRequest) {
        // Static admin can create any user
        console.log("Static admin creating new user");
      } else {
        console.log("Unauthorized user creation attempt", { userRole: profile?.role, creatingRole: role });
        return new Response(
          JSON.stringify({ error: "You don't have permission to create this type of user" }),
          { 
            status: 403,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          }
        );
      }
    }
    
    // Create the new user
    console.log("Creating new user account:", { email, role, name });
    
    const { data: newUser, error: userError } = await supabaseClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: userData
    });
    
    if (userError) {
      console.error("User creation error:", userError);
      return new Response(
        JSON.stringify({ error: userError.message }),
        { 
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    console.log("User created successfully, now handling additional operations based on role");

    // Add credentials to user_credentials table
    try {
      // Hash the password before storing
      const { data: functions } = await supabaseClient.rpc('hash_password', { 
        pass: password 
      });
      
      const password_hash = functions || password; // Fallback to raw password if hashing fails
      
      const { error: credError } = await supabaseClient
        .from('user_credentials')
        .insert({
          user_id: newUser.user?.id,
          username: email,
          password_hash
        });
        
      if (credError) {
        console.warn("Error storing credentials:", credError);
        // Non-fatal error, continue
      }
    } catch (credError) {
      console.warn("Failed to store credentials:", credError);
      // Non-fatal error, continue
    }

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
        console.error("Company creation error:", companyError);
        
        // Attempt to clean up the user if company creation fails
        try {
          await supabaseClient.auth.admin.deleteUser(newUser.user.id);
        } catch (deleteError) {
          console.error("Failed to clean up user after company creation error:", deleteError);
        }
        
        return new Response(
          JSON.stringify({ error: companyError.message }),
          { 
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          }
        );
      }
    }
    
    // If employee user is created, create an employee record
    if (['branch_manager', 'assistant_manager', 'employee'].includes(userData.role) && newUser.user) {
      console.log("Creating employee record for:", userData.name);
      
      if (!userData.company_id) {
        console.error("Missing company_id for employee creation");
        
        // Attempt to clean up the user if validation fails
        try {
          await supabaseClient.auth.admin.deleteUser(newUser.user.id);
        } catch (deleteError) {
          console.error("Failed to clean up user after employee validation error:", deleteError);
        }
        
        return new Response(
          JSON.stringify({ error: "Company ID is required for employee creation" }),
          { 
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          }
        );
      }
      
      const { error: employeeError } = await supabaseClient
        .from('employees')
        .insert({
          user_id: newUser.user.id,
          company_id: userData.company_id,
          branch_id: userData.branch_id,
          name: userData.name,
          role: userData.role
        });
        
      if (employeeError) {
        console.error("Employee creation error:", employeeError);
        
        // Attempt to clean up the user if employee creation fails
        try {
          await supabaseClient.auth.admin.deleteUser(newUser.user.id);
        } catch (deleteError) {
          console.error("Failed to clean up user after employee creation error:", deleteError);
        }
        
        return new Response(
          JSON.stringify({ error: employeeError.message }),
          { 
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          }
        );
      }
    }
    
    return new Response(
      JSON.stringify({ 
        user: newUser.user,
        message: "User created successfully" 
      }),
      { 
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
    
  } catch (error) {
    console.error("Unhandled error:", error);
    
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { 
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
});
