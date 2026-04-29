import { NextRequest } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { extractDocumentInfoSchema } from '@/lib/validations';
import { createErrorResponse, createSuccessResponse } from '@/lib/api-utils';
import { processAndVerifyDocument } from '@/lib/tesseract';
import connectDB from '@/lib/db';
import User from '@/models/User';

/**
 * POST /api/documents/extract
 * Extract information from a document without saving it to the database
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
        message: 'User not found in database',
        status: 404
      });
    }

    // Parse and validate the request body
    const body = await req.json();
    const validatedData = extractDocumentInfoSchema.safeParse(body);
    
    if (!validatedData.success) {
      return createErrorResponse({
        message: 'Invalid request data',
        errors: validatedData.error.format(),
        status: 400
      });
    }

    const { imageUrl, documentType } = validatedData.data;

    // Process the document
    const result = await processAndVerifyDocument(
      documentType as 'PAN' | 'Aadhar' | 'DrivingLicense',
      imageUrl
    );

    return createSuccessResponse({
      message: 'Document information extracted successfully',
      result
    });
    
  } catch (error) {
    return createErrorResponse(error);
  }
} 