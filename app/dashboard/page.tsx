"use client";

import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock, FileCheck, FilePlus, FileX, Upload } from "lucide-react";

// Mock data - This would come from API in a real implementation
const recentDocuments = [
  {
    id: "doc-001",
    name: "Passport.pdf",
    status: "verified",
    date: "2023-10-15",
  },
  {
    id: "doc-002",
    name: "DriverLicense.jpg",
    status: "pending",
    date: "2023-10-14",
  },
  {
    id: "doc-003",
    name: "BirthCertificate.pdf",
    status: "rejected",
    date: "2023-10-12",
  },
  {
    id: "doc-004",
    name: "IDCard.jpg",
    status: "verified",
    date: "2023-10-10",
  },
];

export default function DashboardPage() {
  // Function to get status icon based on document status
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "verified":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "pending":
        return <Clock className="h-5 w-5 text-amber-500" />;
      case "rejected":
        return <FileX className="h-5 w-5 text-red-500" />;
      default:
        return <FileCheck className="h-5 w-5 text-blue-500" />;
    }
  };

  // Function to get status text with proper formatting
  const getStatusText = (status: string) => {
    switch (status) {
      case "verified":
        return <span className="text-green-500 font-medium">Verified</span>;
      case "pending":
        return <span className="text-amber-500 font-medium">Pending</span>;
      case "rejected":
        return <span className="text-red-500 font-medium">Rejected</span>;
      default:
        return <span className="text-blue-500 font-medium">Unknown</span>;
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <Link href="/dashboard/upload">
          <Button>
            <Upload className="mr-2 h-4 w-4" />
            Upload Document
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Documents
            </CardTitle>
            <FileCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              +2 from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Verified Documents
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7</div>
            <p className="text-xs text-muted-foreground">
              +1 from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Verification
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">
              +1 from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Rejected Documents
            </CardTitle>
            <FileX className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">
              No change from last month
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Documents</TabsTrigger>
          <TabsTrigger value="verified">Verified</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Documents</CardTitle>
              <CardDescription>
                You have {recentDocuments.length} documents in your account.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentDocuments.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="rounded-full bg-primary/10 p-2">
                        <FileCheck className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{doc.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Uploaded on {doc.date}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(doc.status)}
                      {getStatusText(doc.status)}
                    </div>
                  </div>
                ))}
              </div>
              {recentDocuments.length > 4 && (
                <div className="mt-4 flex justify-center">
                  <Button variant="outline">View All Documents</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="verified" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Verified Documents</CardTitle>
              <CardDescription>
                Documents that have been successfully verified.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentDocuments
                  .filter((doc) => doc.status === "verified")
                  .map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="rounded-full bg-primary/10 p-2">
                          <FileCheck className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{doc.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Uploaded on {doc.date}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(doc.status)}
                        {getStatusText(doc.status)}
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="pending" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pending Documents</CardTitle>
              <CardDescription>
                Documents awaiting verification.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentDocuments
                  .filter((doc) => doc.status === "pending")
                  .map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="rounded-full bg-primary/10 p-2">
                          <FileCheck className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{doc.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Uploaded on {doc.date}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(doc.status)}
                        {getStatusText(doc.status)}
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="rejected" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Rejected Documents</CardTitle>
              <CardDescription>
                Documents that could not be verified.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentDocuments
                  .filter((doc) => doc.status === "rejected")
                  .map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="rounded-full bg-primary/10 p-2">
                          <FileCheck className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{doc.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Uploaded on {doc.date}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(doc.status)}
                        {getStatusText(doc.status)}
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 