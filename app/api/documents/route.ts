import { NextRequest } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createErrorResponse, createSuccessResponse } from '@/lib/api-utils';
import connectDB from '@/lib/db';
import User from '@/models/User';
import Document from '@/models/Document';
import { documentQuerySchema } from '@/lib/validations';

/**
 * GET /api/documents
 * Get all documents for a user with filtering and pagination
 */
export async function GET(req: NextRequest) {
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

    // Get query parameters
    const url = new URL(req.url);
    const queryParams = {
      isVerified: url.searchParams.get('isVerified') === 'true' ? true : 
                  url.searchParams.get('isVerified') === 'false' ? false : undefined,
      fileType: url.searchParams.get('fileType') as any || undefined,
      limit: url.searchParams.get('limit') ? parseInt(url.searchParams.get('limit') as string) : 10,
      page: url.searchParams.get('page') ? parseInt(url.searchParams.get('page') as string) : 1,
    };

    // Validate query parameters
    const validatedQuery = documentQuerySchema.parse(queryParams);

    // Calculate pagination values
    const skip = (validatedQuery.page - 1) * validatedQuery.limit;
    
    // Create query filters
    const filters: any = { userId: user._id };
    
    if (validatedQuery.isVerified !== undefined) {
      filters.isVerified = validatedQuery.isVerified;
    }
    
    if (validatedQuery.fileType) {
      filters.fileType = validatedQuery.fileType;
    }

    // Get total count and documents
    const total = await Document.countDocuments(filters);
    const documents = await Document.find(filters)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(validatedQuery.limit);

    // Calculate pagination metadata
    const totalPages = Math.ceil(total / validatedQuery.limit);
    const hasNextPage = validatedQuery.page < totalPages;
    const hasPrevPage = validatedQuery.page > 1;

    return createSuccessResponse({
      documents,
      pagination: {
        total,
        page: validatedQuery.page,
        limit: validatedQuery.limit,
        totalPages,
        hasNextPage,
        hasPrevPage,
      }
    });
    
  } catch (error) {
    return createErrorResponse(error);
  }
} 