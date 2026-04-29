import { NextRequest } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createErrorResponse, createSuccessResponse } from '@/lib/api-utils';
import connectDB from '@/lib/db';
import User from '@/models/User';
import Document from '@/models/Document';
import { uploadToCloudinary } from '@/lib/cloudinary';

/**
 * POST /api/documents/upload
 * Upload and process a document
 */
export async function POST(req: NextRequest) {
  try {
    // Get the current authenticated user
    const { userId: clerkId } = await auth();
    
    if (!clerkId) {
      return createErrorResponse({ 
        message: 'Unauthorized', 
        status: 401 
      });
    }

    // Connect to the database
    await connectDB();

    // Find the user in our database
    const user = await User.findOne({ clerkId });
    
    if (!user) {
      return createErrorResponse({
        message: 'User not found in database. Please sync your account first.',
        status: 404
      });
    }

    const formData = await req.formData();
    const files = formData.getAll("files") as File[]; // Get all files as an array
    const documentType = formData.get("documentType") as string || "Other"; // Get document type

    if (!files || files.length === 0) {
      return createErrorResponse({ message: "No files uploaded", status: 400 });
    }

    // Upload all files to Cloudinary
    const uploadedFiles = await Promise.all(
      files.map(async (file) => {
        
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const base64String = buffer.toString("base64"); // Convert to base64
    
        // We use the documentType provided by the frontend as the primary fileType
        const fileType = documentType; 

        const { url, public_id } = await uploadToCloudinary(`data:image/png;base64,${base64String}`, `${user._id}/documents`);

        return { fileName: file.name, fileUrl: url, publicId: public_id,fileType };
      })
    );
    // Create a document record in the database (without text extraction at first)
    await Document.insertMany(
      uploadedFiles.map((file) => ({
        userId: user._id,
        fileName: file.fileName,
        fileUrl: file.fileUrl,
        fileType: file.fileType, // Now this will be 'PAN', 'Aadhar', or 'DrivingLicense'
        publicId: file.publicId,
        isVerified: false,
      }))
    );
    // Start the text extraction process asynchronously
    // Note: In a production environment, you might want to use a queue system 
    // like Bull or a serverless function for this processing
    // await Promise.all(
    //   documents.map(async (doc) => {
    //     await processDocument(doc._id.toString(), doc.fileUrl, doc.fileType);
    //   })
    // );
    
    return createSuccessResponse({
      message: 'Document uploaded successfully. Processing has begun.',
     
    }, 201);
    
  } catch (error) {
    return createErrorResponse(error);
  }
}