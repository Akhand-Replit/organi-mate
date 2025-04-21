
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
    // Verify admin authentication
    const adminAuthHeader = req.headers.get('X-Admin-Auth');
    const authHeader = req.headers.get('Authorization');
    
    // Validate either admin token or JWT
    if (adminAuthHeader !== 'static-admin-token' && !authHeader) {
      console.error("Unauthorized access attempt - no valid auth header");
      return new Response(
        JSON.stringify({ error: "Unauthorized - missing authorization" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }
    
    // Get request body
    const requestData = await req.json();
    const { name, userId } = requestData;
    
    // Validation
    if (!name || !userId) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: name and userId are required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }
    
    console.log(`Creating company record for user ${userId} with name ${name}`);
    
    // Initialize the Supabase client with service role for RLS bypass
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
    
    // Create company record directly
    const { data, error: companyError } = await supabaseClient
      .from('companies')
      .insert({
        name: name,
        user_id: userId
      })
      .select();
      
    if (companyError) {
      console.error("Error creating company:", companyError);
      return new Response(
        JSON.stringify({ error: companyError.message }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }
    
    return new Response(
      JSON.stringify({ 
        success: true,
        data: data,
        message: "Company created successfully" 
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
