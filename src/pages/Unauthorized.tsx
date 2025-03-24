
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";
import { ShieldAlert, ArrowLeft } from "lucide-react";

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <Layout hideFooter>
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center max-w-md animate-fade-in">
          <ShieldAlert className="h-16 w-16 text-destructive mx-auto mb-6" />
          <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
          <p className="text-lg text-muted-foreground mb-8">
            You don't have permission to access this page. If you believe this is an error, please contact your administrator.
          </p>
          <div className="flex flex-col space-y-4">
            <Button 
              onClick={() => navigate(-1)} 
              variant="outline" 
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Go Back
            </Button>
            <Button 
              onClick={() => navigate('/dashboard')}
              className="gap-2"
            >
              Go to Dashboard
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Unauthorized;
