import { NextRequest } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createErrorResponse, createSuccessResponse } from '@/lib/api-utils';
import connectDB from '@/lib/db';
import User from '@/models/User';
import Document from '@/models/Document';

// Helper function to check if a user is an admin
async function isAdmin(clerkId: string) {
  try {
    const user = await User.findOne({ clerkId });
    return user?.role === 'admin';
  } catch (error) {
    return false;
  }
}

/**
 * GET /api/admin/documents
 * Get all documents with filtering options
 */
export async function GET(req: NextRequest) {
  try {
    // Authenticate the user
    const { userId: clerkId } = await auth();
    
    if (!clerkId) {
      return createErrorResponse({
        message: 'Unauthorized',
        status: 401
      });
    }

    // Connect to the database
    await connectDB();

    // Check if the user is an admin
    const adminStatus = await isAdmin(clerkId);
    
    if (!adminStatus) {
      return createErrorResponse({
        message: 'Forbidden: Admin access required',
        status: 403
      });
    }

    // Get query parameters
    const url = new URL(req.url);
    
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const sortBy = url.searchParams.get('sortBy') || 'createdAt';
    const sortOrder = url.searchParams.get('sortOrder') || 'desc';
    const status = url.searchParams.get('status');
    const fileType = url.searchParams.get('fileType');
    const isVerified = url.searchParams.get('isVerified');
    const search = url.searchParams.get('search');
    const userId = url.searchParams.get('userId');
    
    // Build filter
    const filter: any = {};
    
    if (status) {
      filter.status = status;
    }
    
    if (fileType) {
      filter.fileType = fileType;
    }
    
    if (isVerified === 'true') {
      filter.isVerified = true;
    } else if (isVerified === 'false') {
      filter.isVerified = false;
    }
    
    if (userId) {
      filter.userId = userId;
    }
    
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Calculate pagination
    const skip = (page - 1) * limit;
    
    // Build sort
    const sort: any = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;
    
    // Get total count for pagination
    const totalDocuments = await Document.countDocuments(filter);
    
    // Fetch documents
    const documents = await Document.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate('userId', 'name email')
      .select('-extractedText');
    
    return createSuccessResponse({
      documents,
      pagination: {
        total: totalDocuments,
        page,
        limit,
        pages: Math.ceil(totalDocuments / limit)
      }
    });
    
  } catch (error) {
    return createErrorResponse(error);
  }
} 