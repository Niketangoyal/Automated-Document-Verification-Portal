"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileUp, Loader2, UploadCloud } from "lucide-react";
import { toast } from "sonner";

export default function UploadPage() {
  const [isUploading, setIsUploading] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles((prevFiles) => [...prevFiles, ...newFiles]);
    }
  };

  // Handle drag events
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // Handle drop event
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files);
      setFiles((prevFiles) => [...prevFiles, ...newFiles]);
    }
  };

  // Handle file removal
  const handleRemoveFile = (index: number) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  // Trigger file input click
  const onButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Handle document upload
  const handleUpload = async () => {
    if (files.length === 0) {
      toast.error("Please select at least one file to upload.");
      return;
    }

    setIsUploading(true);

    try {
      // Simulate upload - This would call an API in a real implementation
      await new Promise((resolve) => setTimeout(resolve, 2000));
      toast.success("Documents uploaded successfully!");
      setFiles([]);
      // Navigate to dashboard after successful upload
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 1500);
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error("Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Upload Documents</h1>
        <Link href="/dashboard">
          <Button variant="outline">Back to Dashboard</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Document Upload</CardTitle>
          <CardDescription>
            Upload your documents for verification. We accept PDF, JPG, and PNG
            files.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Drag and Drop Area */}
          <div
            onDragEnter={handleDrag}
            className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
              dragActive
                ? "border-primary bg-primary/10"
                : "border-muted-foreground/25"
            }`}
          >
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className="flex flex-col items-center justify-center space-y-4"
            >
              <UploadCloud className="h-16 w-16 text-muted-foreground" />
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Drag and drop your files</h3>
                <p className="text-sm text-muted-foreground">
                  or click to browse files
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={onButtonClick}
                >
                  Browse Files
                </Button>
                <input
                  ref={fileInputRef}
                  className="hidden"
                  type="file"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Maximum file size: 10MB
              </p>
            </div>
          </div>

          {/* File List */}
          {files.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Selected Files</h3>
              <div className="space-y-2">
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between border rounded-md p-3"
                  >
                    <div className="flex items-center space-x-3">
                      <FileUp className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium text-sm">{file.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatFileSize(file.size)}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveFile(index)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => setFiles([])}>
            Clear All
          </Button>
          <Button onClick={handleUpload} disabled={isUploading || files.length === 0}>
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <UploadCloud className="mr-2 h-4 w-4" />
                Upload Documents
              </>
            )}
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Guidelines for Document Upload</CardTitle>
          <CardDescription>
            Follow these guidelines to ensure successful document verification.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-5 space-y-2">
            <li>Upload clear and legible documents</li>
            <li>Ensure all information is visible and not cut off</li>
            <li>File formats accepted: PDF, JPG, JPEG, PNG</li>
            <li>Maximum file size: 10MB per document</li>
            <li>Do not upload password-protected or encrypted documents</li>
            <li>Document should not have any watermark or overlay</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
} 