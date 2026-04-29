import { NextRequest } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createErrorResponse, createSuccessResponse } from '@/lib/api-utils';
import connectDB from '@/lib/db';
import User from '@/models/User';
import Document from '@/models/Document';
import { extractTextFromImage, verifyDocumentText } from '@/lib/tesseract';
import mongoose from 'mongoose';

/**
 * POST /api/documents/verify/[id]
 */
export async function POST(
  req: NextRequest,
  // Ensure context is handled correctly for Next.js 15
  context: { params: Promise<{ id: string }> }
) {
  // Extract ID outside the try block so the catch block can see it
  const { id } = await context.params;

  try {
    // 1. Validate ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return createErrorResponse({
        message: 'Invalid document ID format',
        status: 400
      });
    }

    // 2. Authentication (Note: Clerk auth() is async in v5+)
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return createErrorResponse({
        message: 'Unauthorized',
        status: 401
      });
    }

    await connectDB();

    // 3. User & Document Ownership
    const user = await User.findOne({ clerkId });
    if (!user) {
      return createErrorResponse({ message: 'User not found', status: 404 });
    }

    const document = await Document.findById(id);
    if (!document) {
      return createErrorResponse({ message: 'Document not found', status: 404 });
    }

    if (document.userId.toString() !== user._id.toString()) {
      return createErrorResponse({ message: 'Forbidden', status: 403 });
    }

    // 4. Processing
    await Document.findByIdAndUpdate(id, { status: 'processing' });

    let extractedText = document.extractedText;
    if (!extractedText) {
      extractedText = await extractTextFromImage(document.fileUrl);
    }

    // 5. Verification Logic
    const { isVerified, details } = verifyDocumentText(
      document.fileType as 'PAN' | 'Aadhar' | 'DrivingLicense',
      extractedText
    );

    // Update the document with verification results
    const updatedDocument = await Document.findByIdAndUpdate(
      id,
      {
        extractedText,
        isVerified,
        // Convert the object to a string so Mongoose accepts it
        verificationDetails: JSON.stringify(details),
        status: 'completed'
      },
      { new: true }
    );
    return createSuccessResponse({
      message: 'Document verification completed',
      document: updatedDocument,
      verificationResult: { isVerified, details }
    });

  } catch (error) {
    // Since 'id' was awaited at the top, it is reliably available here
    if (mongoose.Types.ObjectId.isValid(id)) {
      await Document.findByIdAndUpdate(id, {
        status: 'failed',
        verificationDetails: error instanceof Error ? error.message : 'Unknown error'
      });
    }

    return createErrorResponse(error);
  }
}