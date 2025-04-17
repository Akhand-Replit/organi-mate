
import React from 'react';
import AssistantLayout from '@/components/layout/AssistantLayout';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { FileText, BarChart, LineChart, PieChart, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

const AssistantReports: React.FC = () => {
  // Mock reports data
  const myReports = [
    {
      id: '1',
      title: 'Monthly Activity Summary',
      description: 'My activities and achievements for May 2025',
      date: '2025-05-01',
      type: 'Activity'
    },
    {
      id: '2',
      title: 'Team Performance Overview',
      description: 'Performance metrics for my team members',
      date: '2025-05-01',
      type: 'Performance'
    }
  ];
  
  const employeeReports = [
    {
      id: '3',
      title: 'Sales Associate Weekly Report',
      description: 'Weekly activities from John Smith',
      date: '2025-05-05',
      type: 'Activity',
      employee: 'John Smith'
    },
    {
      id: '4',
      title: 'Customer Service Metrics',
      description: 'Customer service KPIs for April 2025',
      date: '2025-05-03',
      type: 'Performance',
      employee: 'Maria Garcia'
    },
    {
      id: '5',
      title: 'Inventory Management Report',
      description: 'Stock levels and movement analysis',
      date: '2025-05-02',
      type: 'Inventory',
      employee: 'David Lee'
    }
  ];

  const getReportIcon = (type: string) => {
    switch (type) {
      case 'Activity':
        return <LineChart className="h-5 w-5 text-blue-500" />;
      case 'Performance':
        return <BarChart className="h-5 w-5 text-green-500" />;
      case 'Inventory':
        return <PieChart className="h-5 w-5 text-purple-500" />;
      default:
        return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <AssistantLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Create Report
          </Button>
        </div>
        
        <Tabs defaultValue="my-reports" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="my-reports">My Reports</TabsTrigger>
            <TabsTrigger value="employee-reports">Employee Reports</TabsTrigger>
          </TabsList>
          
          <TabsContent value="my-reports" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  My Reports
                </CardTitle>
                <CardDescription>
                  Reports you have created and submitted
                </CardDescription>
              </CardHeader>
              <CardContent>
                {myReports.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {myReports.map((report) => (
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
                              Edit
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    You haven't created any reports yet.
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="employee-reports" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Employee Reports
                </CardTitle>
                <CardDescription>
                  Reports from general employees in your branch
                </CardDescription>
              </CardHeader>
              <CardContent>
                {employeeReports.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {employeeReports.map((report) => (
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
                          <p className="text-sm font-medium mt-1">By: {report.employee}</p>
                        </CardHeader>
                        <CardContent>
                          <div className="flex justify-between">
                            <Button variant="outline" size="sm">
                              View
                            </Button>
                            <Button variant="ghost" size="sm">
                              Comment
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No employee reports available.
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AssistantLayout>
  );
};

export default AssistantReports;
