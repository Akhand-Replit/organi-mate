
import React from "react";
import { Badge } from "@/components/ui/badge";

export function CompanyStatusBadge({ status }: { status: string }) {
  switch (status) {
    case "approved":
      return <Badge className="bg-green-500">Approved</Badge>;
    case "rejected":
      return <Badge className="bg-red-500">Rejected</Badge>;
    case "pending":
    default:
      return <Badge className="bg-yellow-500">Pending</Badge>;
  }
}
