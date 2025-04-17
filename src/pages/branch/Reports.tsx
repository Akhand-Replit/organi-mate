
import React from 'react';
import BranchLayout from '@/components/layout/BranchLayout';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { FileText, BarChart, LineChart, PieChart } from 'lucide-react';
import { Button } from '@/components/ui/button';

const BranchReports: React.FC = () => {
  // This is a placeholder for when we implement reporting functionality
  const mockReports = [
    {
      id: '1',
      title: 'Monthly Sales Report',
      description: 'Sales data for the current month',
      date: '2025-04-01',
      type: 'Sales'
    },
    {
      id: '2',
      title: 'Employee Performance',
      description: 'Performance metrics for branch employees',
      date: '2025-04-01',
      type: 'HR'
    },
    {
      id: '3',
      title: 'Inventory Status',
      description: 'Current inventory levels and movement',
      date: '2025-04-01',
      type: 'Inventory'
    }
  ];

  const getReportIcon = (type: string) => {
    switch (type) {
      case 'Sales':
        return <BarChart className="h-5 w-5 text-green-500" />;
      case 'HR':
        return <PieChart className="h-5 w-5 text-blue-500" />;
      case 'Inventory':
        return <LineChart className="h-5 w-5 text-purple-500" />;
      default:
        return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <BranchLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Branch Reports</h1>
          <Button className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Create Report
          </Button>
        </div>
        
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Available Reports
              </CardTitle>
              <CardDescription>
                View and generate reports for your branch
              </CardDescription>
            </CardHeader>
            <CardContent>
              {mockReports.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {mockReports.map((report) => (
                    <Card key={report.id} className="hover:shadow-md transition-shadow">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          {getReportIcon(report.type)}
                          <span className="text-xs text-muted-foreground">
                            {new Date(report.date).toLocaleDateString()}
                          </span>
                        </div>
                        <CardTitle className="text-lg mt-2">{report.title}</CardTitle>
                        <CardDescription>{report.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex justify-between">
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                          <Button variant="ghost" size="sm">
                            Download
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No reports available for your branch yet.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </BranchLayout>
  );
};

export default BranchReports;
