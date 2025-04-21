
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
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
  open: boolean;
  onOpenChange: (open: boolean) => void;
  application: CompanyApplication;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
};

export function CompanyApplicationDialog({
  open,
  onOpenChange,
  application,
  onApprove,
  onReject,
}: Props) {
  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString();
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{application.company_name}</DialogTitle>
          <DialogDescription>Application Details</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <h4 className="text-sm font-medium">Status</h4>
            <p>
              <CompanyStatusBadge status={application.status} />
            </p>
          </div>
          <div>
            <h4 className="text-sm font-medium">Email</h4>
            <p>{application.email}</p>
          </div>
          {application.phone && (
            <div>
              <h4 className="text-sm font-medium">Phone</h4>
              <p>{application.phone}</p>
            </div>
          )}
          {application.address && (
            <div>
              <h4 className="text-sm font-medium">Address</h4>
              <p>{application.address}</p>
            </div>
          )}
          {application.description && (
            <div>
              <h4 className="text-sm font-medium">Description</h4>
              <p className="whitespace-pre-wrap">{application.description}</p>
            </div>
          )}
          <div>
            <h4 className="text-sm font-medium">Submitted</h4>
            <p>{formatDate(application.created_at)}</p>
          </div>
        </div>
        <DialogFooter>
          {application.status === "pending" && (
            <>
              <Button
                variant="outline"
                className="border-red-500 text-red-500 hover:bg-red-50"
                onClick={() => {
                  onReject(application.id);
                  onOpenChange(false);
                }}
              >
                Reject
              </Button>
              <Button
                className="bg-green-500 hover:bg-green-600"
                onClick={() => {
                  onApprove(application.id);
                  onOpenChange(false);
                }}
              >
                Approve
              </Button>
            </>
          )}
          <DialogClose asChild>
            <Button variant="secondary">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
