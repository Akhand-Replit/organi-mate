
import React from "react";
import { TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Check, X, Trash2 } from "lucide-react";
import { CompanyStatusBadge } from "./CompanyStatusBadge";

type CompanyApplication = {
  id: string;
  company_name: string;
  email: string;
  phone: string | null;
  address: string | null;
  description: string | null;
  status: string;
  created_at: string;
  updated_at: string;
};

type Props = {
  application: CompanyApplication;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onDelete: (id: string) => void;
  onShowDetails: (application: CompanyApplication) => void;
};

export function CompanyApplicationTableRow({
  application,
  onApprove,
  onReject,
  onDelete,
  onShowDetails,
}: Props) {
  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString();
  return (
    <TableRow>
      <TableCell
        className="font-medium cursor-pointer hover:underline"
        onClick={() => onShowDetails(application)}
      >
        {application.company_name}
      </TableCell>
      <TableCell>{application.email}</TableCell>
      <TableCell>
        <CompanyStatusBadge status={application.status} />
      </TableCell>
      <TableCell>{formatDate(application.created_at)}</TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-2">
          {application.status === "pending" && (
            <>
              <Button
                variant="outline"
                size="icon"
                onClick={() => onApprove(application.id)}
                title="Approve"
              >
                <Check className="h-4 w-4 text-green-500" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => onReject(application.id)}
                title="Reject"
              >
                <X className="h-4 w-4 text-red-500" />
              </Button>
            </>
          )}
          <Button
            variant="outline"
            size="icon"
            onClick={() => onDelete(application.id)}
            title="Delete"
          >
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
