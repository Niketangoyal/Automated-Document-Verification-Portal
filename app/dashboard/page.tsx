"use client";

import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock, FileCheck, FileX, Upload } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
export interface DocumentType {
  _id: string;
  userId: string;
  fileName: string;
  fileUrl: string;
  fileType: "PAN" | "Aadhar" | "DrivingLicense" | "PDF";
  publicId: string;
  extractedText?: string;
  isVerified: boolean;
  status: "pending" | "processing" | "completed" | "failed";
  verificationDetails?: string;
  uploadedAt: string; // Date as string (ISO format)
  createdAt: string;
  updatedAt: string;
}
interface DocumentResponse {
  documents: DocumentType[];
  pagination: {
    total: number;
    currentPage: number;
    pageSize: number;
  };
}

export default function DashboardPage() {
  const [recentDocuments, setRecentDocuments] = useState<DocumentType[]>([]);
  const [showAll, setShowAll] = useState(false);
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const res = await fetch("/api/documents?limit=100", { cache: "no-store" });

        if (!res.ok) {
          throw new Error("Failed to fetch documents");
        }

        const data: DocumentResponse = await res.json();
        setRecentDocuments(data.documents || []);
        
      } catch {
        toast.error("Upload failed. Please try again.");
      } 
    };

    fetchDocuments();
  }, []);

  const [verifyingId, setVerifyingId] = useState<string | null>(null);

  const handleVerify = async (docId: string) => {
    setVerifyingId(docId);
    try {
      const res = await fetch(`/api/documents/verify/${docId}`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || "Verification failed");
      toast.success("Document verification completed!");
      
      // Update the document in state
      setRecentDocuments(prev => prev.map(doc => {
        if (doc._id === docId) {
          return {
            ...doc,
            status: data.document?.status || "completed",
            isVerified: data.verificationResult?.isVerified || false,
            verificationDetails: data.document?.verificationDetails || ""
          };
        }
        return doc;
      }));
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Failed to verify document");
      // Update state to failed if it failed
      setRecentDocuments(prev => prev.map(doc => {
        if (doc._id === docId) {
          return { ...doc, status: "failed" };
        }
        return doc;
      }));
    } finally {
      setVerifyingId(null);
    }
  };

  const getDocStatus = (doc: DocumentType) => {
    if (doc.status === "completed" && doc.isVerified) return "verified";
    if (doc.status === "completed" && !doc.isVerified) return "rejected";
    if (doc.status === "failed") return "rejected";
    if (doc.status === "processing") return "processing";
    return "pending";
  };

  // Get current date
const now = new Date();

// Get last month
const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

// Function to count docs uploaded in last month
const countLastMonth = (status?: string) => {
  return recentDocuments.filter(doc => {
    const uploaded = new Date(doc.createdAt);
    const isLastMonth = uploaded >= lastMonth && uploaded < thisMonth;
    if (status) {
      return isLastMonth && getDocStatus(doc) === status;
    }
    return isLastMonth;
  }).length;
};

// Counts for cards
const totalLastMonth = countLastMonth();
const verifiedLastMonth = countLastMonth("verified");
const pendingLastMonth = countLastMonth("pending");
const rejectedLastMonth = countLastMonth("rejected");

const verifiedCount = recentDocuments.filter(doc => getDocStatus(doc) === "verified").length;
const pendingCount = recentDocuments.filter(doc => getDocStatus(doc) === "pending" || getDocStatus(doc) === "processing").length;
const rejectedCount = recentDocuments.filter(doc => getDocStatus(doc) === "rejected").length;

  // Function to get status icon based on document status
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "verified":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "pending":
      case "processing":
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
      case "processing":
        return <span className="text-amber-500 font-medium">Processing</span>;
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
            <div className="text-2xl font-bold">{recentDocuments.length}</div>
            <p className="text-xs text-muted-foreground">
              {totalLastMonth} from last month
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
            <div className="text-2xl font-bold">{verifiedCount}</div>
            <p className="text-xs text-muted-foreground">
              {verifiedLastMonth} from last month
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
            <div className="text-2xl font-bold">{pendingCount}</div>
            <p className="text-xs text-muted-foreground">
              {pendingLastMonth} from last month
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
            <div className="text-2xl font-bold">{rejectedCount}</div>
            <p className="text-xs text-muted-foreground">
              {rejectedLastMonth} from last month
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
                {recentDocuments.length>0  &&(showAll ? recentDocuments : recentDocuments.slice(0, 5)).map((doc) => (
                  <div
                    key={doc._id}
                    className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="rounded-full bg-primary/10 p-2">
                        <FileCheck className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{doc.fileName}</p>
                        <p className="text-sm text-muted-foreground">
                          Uploaded on {doc.createdAt}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getDocStatus(doc) === "pending" || getDocStatus(doc) === "processing" ? (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleVerify(doc._id)}
                          disabled={verifyingId === doc._id}
                        >
                          {verifyingId === doc._id ? "Verifying..." : "Verify"}
                        </Button>
                      ) : null}
                      {getStatusIcon(getDocStatus(doc))}
                      {getStatusText(getDocStatus(doc))}
                    </div>
                  </div>
                ))}
              </div>
              {recentDocuments.length > 5 && (
                <div className="mt-4 flex justify-center">
                  {!showAll ? (
                    <Button variant="outline" onClick={() => setShowAll(true)}>View All Documents</Button>
                  ) : (
                    <Button variant="outline" onClick={() => setShowAll(false)}>Show Less</Button>
                  )}
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
                  .filter((doc) => getDocStatus(doc) === "verified")
                  .map((doc) => (
                    <div
                      key={doc._id}
                      className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="rounded-full bg-primary/10 p-2">
                          <FileCheck className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{doc.fileName}</p>
                          <p className="text-sm text-muted-foreground">
                            Uploaded on {doc.createdAt}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(getDocStatus(doc))}
                        {getStatusText(getDocStatus(doc))}
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
                  .filter((doc) => getDocStatus(doc) === "pending" || getDocStatus(doc) === "processing")
                  .map((doc) => (
                    <div
                      key={doc._id}
                      className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="rounded-full bg-primary/10 p-2">
                          <FileCheck className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{doc.fileName}</p>
                          <p className="text-sm text-muted-foreground">
                            Uploaded on {doc.createdAt}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleVerify(doc._id)}
                          disabled={verifyingId === doc._id}
                        >
                          {verifyingId === doc._id ? "Verifying..." : "Verify"}
                        </Button>
                        {getStatusIcon(getDocStatus(doc))}
                        {getStatusText(getDocStatus(doc))}
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
                  .filter((doc) => getDocStatus(doc) === "rejected")
                  .map((doc) => (
                    <div
                      key={doc._id}
                      className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="rounded-full bg-primary/10 p-2">
                          <FileCheck className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{doc.fileName}</p>
                          <p className="text-sm text-muted-foreground">
                            Uploaded on {doc.createdAt}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(getDocStatus(doc))}
                        {getStatusText(getDocStatus(doc))}
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