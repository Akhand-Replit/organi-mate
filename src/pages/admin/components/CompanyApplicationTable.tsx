
import React from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { CompanyApplicationTableRow } from './CompanyApplicationTableRow';

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
  applications: CompanyApplication[] | undefined;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onDelete: (id: string) => void;
  onShowDetails: (application: CompanyApplication) => void;
};

const CompanyApplicationTable: React.FC<Props> = ({
  applications,
  onApprove,
  onReject,
  onDelete,
  onShowDetails,
}) => {
  return (
    <Table>
      <TableCaption>List of all company applications.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Company Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Submitted</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {applications && applications.length > 0 ? (
          applications.map((application) => (
            <CompanyApplicationTableRow
              key={application.id}
              application={application}
              onApprove={onApprove}
              onReject={onReject}
              onDelete={onDelete}
              onShowDetails={onShowDetails}
            />
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={5} className="text-center py-6">
              <div>
                No company applications found.<br />
                <span className="text-xs text-muted-foreground">
                  If you recently submitted an application and it is not visible, ensure that you are logged in as an admin and that new applications are being submitted to Supabase.
                </span>
              </div>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default CompanyApplicationTable;

