import React, { useState } from 'react';
import EmployeeLayout from '@/components/layout/EmployeeLayout';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { FileText, BarChart, LineChart, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const EmployeeReports: React.FC = () => {
  const [open, setOpen] = useState(false);
  
  const myReports: any[] = [];

  return (
    <EmployeeLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold tracking-tight">My Reports</h1>
          
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Create Report
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
              <DialogHeader>
                <DialogTitle>Create New Report</DialogTitle>
                <DialogDescription>
                  Submit a new activity or performance report
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Report Title</Label>
                  <Input id="title" placeholder="Enter report title" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="type">Report Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily Activity</SelectItem>
                        <SelectItem value="weekly">Weekly Performance</SelectItem>
                        <SelectItem value="custom">Custom Report</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="date">Report Date</Label>
                    <Input id="date" type="date" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" placeholder="Brief description of this report" rows={2} />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="content">Report Content</Label>
                  <Textarea id="content" placeholder="Enter the details of your report..." rows={5} />
                </div>
              </div>
              <DialogFooter className="flex space-x-2 justify-end">
                <Button variant="outline" onClick={() => setOpen(false)}>Save as Draft</Button>
                <Button onClick={() => setOpen(false)}>Submit Report</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        
        <div className="grid gap-6">
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
                ""
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  You haven't created any reports yet.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </EmployeeLayout>
  );
};

export default EmployeeReports;
