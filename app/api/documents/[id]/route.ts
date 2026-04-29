import { NextRequest } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createErrorResponse, createSuccessResponse } from '@/lib/api-utils';
import connectDB from '@/lib/db';
import User from '@/models/User';
import Document from '@/models/Document';
import { deleteFromCloudinary } from '@/lib/cloudinary';
import { documentUpdateSchema } from '@/lib/validations';
import mongoose from 'mongoose';

/**
 * GET /api/documents/[id]
 * Get a document by ID
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Get the document ID from the URL params
    const { id } = await params;
    
    // Validate document ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return createErrorResponse({
        message: 'Invalid document ID format',
        status: 400
      });
    }

    // Get the current authenticated user
    const { userId: clerkId } =await  auth();
    
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
        message: 'User not found in database',
        status: 404
      });
    }

    // Find the document
    const document = await Document.findById(id);
    
    if (!document) {
      return createErrorResponse({
        message: 'Document not found',
        status: 404
      });
    }

    // Check if the user owns the document
    if (document.userId.toString() !== user._id.toString()) {
      return createErrorResponse({
        message: 'You do not have permission to access this document',
        status: 403
      });
    }

    return createSuccessResponse({ document });
    
  } catch (error) {
    return createErrorResponse(error);
  }
}

/**
 * DELETE /api/documents/[id]
 * Delete a document by ID
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Get the document ID from the URL params
    const { id } = await params;
    
    // Validate document ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return createErrorResponse({
        message: 'Invalid document ID format',
        status: 400
      });
    }

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
        message: 'User not found in database',
        status: 404
      });
    }

    // Find the document
    const document = await Document.findById(id);
    
    if (!document) {
      return createErrorResponse({
        message: 'Document not found',
        status: 404
      });
    }

    // Check if the user owns the document
    if (document.userId.toString() !== user._id.toString()) {
      return createErrorResponse({
        message: 'You do not have permission to delete this document',
        status: 403
      });
    }

    // Delete the document image from Cloudinary
    if (document.publicId) {
      await deleteFromCloudinary(document.publicId);
    }

    // Delete the document from the database
    await Document.findByIdAndDelete(id);

    return createSuccessResponse({ 
      message: 'Document deleted successfully' 
    });
    
  } catch (error) {
    return createErrorResponse(error);
  }
}

/**
 * PATCH /api/documents/[id]
 * Update a document by ID
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Get the document ID from the URL params
    const { id } = await params;
    
    // Validate document ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return createErrorResponse({
        message: 'Invalid document ID format',
        status: 400
      });
    }

    // Get the current authenticated user
    const { userId: clerkId } = await auth();
    
    if (!clerkId) {
      return createErrorResponse({ 
        message: 'Unauthorized', 
        status: 401 
      });
    }

    // Parse request body
    const requestData = await req.json();
    
    // Validate the update data
    const validatedData = documentUpdateSchema.parse({
      ...requestData,
      id
    });

    // Connect to the database
    await connectDB();

    // Find the user in our database
    const user = await User.findOne({ clerkId });
    
    if (!user) {
      return createErrorResponse({
        message: 'User not found in database',
        status: 404
      });
    }

    // Find the document
    const document = await Document.findById(id);
    
    if (!document) {
      return createErrorResponse({
        message: 'Document not found',
        status: 404
      });
    }

    // Check if the user owns the document
    if (document.userId.toString() !== user._id.toString()) {
      return createErrorResponse({
        message: 'You do not have permission to update this document',
        status: 403
      });
    }

    // Update only the fields that are provided
    const updateData: any = {};
    
    if (validatedData.isVerified !== undefined) {
      updateData.isVerified = validatedData.isVerified;
    }
    
    if (validatedData.extractedText !== undefined) {
      updateData.extractedText = validatedData.extractedText;
    }

    // Update the document
    const updatedDocument = await Document.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    return createSuccessResponse({ 
      message: 'Document updated successfully',
      document: updatedDocument 
    });
    
  } catch (error) {
    return createErrorResponse(error);
  }
} 