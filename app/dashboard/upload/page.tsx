"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FileUp, Loader2, UploadCloud } from "lucide-react";
import { toast } from "sonner";

export default function UploadPage() {
  const [isUploading, setIsUploading] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [documentType, setDocumentType] = useState<string>("PAN");
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file input change
 const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  if (e.target.files && e.target.files.length > 0) {
    const selectedFiles = Array.from(e.target.files);

    // Filter logic: Only allow common image formats
    const validFiles = selectedFiles.filter((file) => {
      const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
      const isImage = file.type.startsWith('image/') || 
                      /\.(jpg|jpeg|png|webp)$/i.test(file.name);

      if (isPdf) {
        toast.error(`"${file.name}" is a PDF. Only images (JPG, PNG) are allowed.`);
        return false;
      }

      if (!isImage) {
        toast.error(`"${file.name}" is not a supported image format.`);
        return false;
      }

      return true;
    });

    // Only update state if there are valid files
    if (validFiles.length > 0) {
      setFiles((prevFiles) => [...prevFiles, ...validFiles]);
    }

    // Reset the input value so the same file can be selected again if deleted
    e.target.value = '';
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
    const droppedFiles = Array.from(e.dataTransfer.files);
    
    // Filter out PDFs and identify if any were found
    const hasPdf = droppedFiles.some(file => file.type === 'application/pdf' || file.name.endsWith('.pdf'));
    
    if (hasPdf) {
      toast.error("PDF files are not supported. Please upload images (JPG/PNG).");
    }

    // Only add files that are NOT PDFs
    const validFiles = droppedFiles.filter(file => file.type !== 'application/pdf' && !file.name.endsWith('.pdf'));

    if (validFiles.length > 0) {
      setFiles((prevFiles) => [...prevFiles, ...validFiles]);
    }
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
      const formData = new FormData();
      files.forEach((file) => formData.append("files", file)); // Append each file
      formData.append("documentType", documentType); // Append selected document type
      const res = await fetch("/api/documents/upload", {
        method: "POST",
        body: formData,
      });
    
      const data = await res.json();
      
      toast.success("Documents uploaded successfully!");
      setFiles([]);
      // Navigate to dashboard after successful upload
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 1500);
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error("Upload failed. Please try again.3");
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
          <div className="space-y-2">
            <Label htmlFor="documentType">Document Type</Label>
            <select
              id="documentType"
              value={documentType}
              onChange={(e) => setDocumentType(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="PAN">PAN Card</option>
              <option value="Aadhar">Aadhar Card</option>
              <option value="DrivingLicense">Driving License</option>
            </select>
          </div>

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
                  accept=".jpg,.jpeg,.png"
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
            <li>File formats accepted:  JPG, JPEG, PNG</li>
            <li>Maximum file size: 10MB per document</li>
            <li>Do not upload password-protected or encrypted documents</li>
            <li>Document should not have any watermark or overlay</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
} 