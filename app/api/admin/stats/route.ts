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
 * GET /api/admin/stats
 * Get system-wide statistics for the admin dashboard
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

    // Get total user count
    const totalUsers = await User.countDocuments();

    // Get document statistics
    const totalDocuments = await Document.countDocuments();
    const verifiedDocuments = await Document.countDocuments({ isVerified: true });
    const unverifiedDocuments = await Document.countDocuments({ isVerified: false });
    const pendingDocuments = await Document.countDocuments({ status: 'pending' });
    const processingDocuments = await Document.countDocuments({ status: 'processing' });
    const failedDocuments = await Document.countDocuments({ status: 'failed' });
    const completedDocuments = await Document.countDocuments({ status: 'completed' });

    // Get document type statistics
    const panDocuments = await Document.countDocuments({ fileType: 'PAN' });
    const aadharDocuments = await Document.countDocuments({ fileType: 'Aadhar' });
    const drivingLicenseDocuments = await Document.countDocuments({ fileType: 'DrivingLicense' });
    const otherDocuments = await Document.countDocuments({ 
      fileType: { $nin: ['PAN', 'Aadhar', 'DrivingLicense'] } 
    });

    // Get recent activity (last 10 documents added)
    const recentDocuments = await Document.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('userId', 'name email')
      .select('title status fileType isVerified createdAt');

    // Get recent users (last 5 users joined)
    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name email createdAt');

    return createSuccessResponse({
      stats: {
        users: {
          total: totalUsers
        },
        documents: {
          total: totalDocuments,
          verified: verifiedDocuments,
          unverified: unverifiedDocuments,
          byStatus: {
            pending: pendingDocuments,
            processing: processingDocuments,
            completed: completedDocuments,
            failed: failedDocuments
          },
          byType: {
            pan: panDocuments,
            aadhar: aadharDocuments,
            drivingLicense: drivingLicenseDocuments,
            other: otherDocuments
          }
        },
        recentActivity: {
          documents: recentDocuments,
          users: recentUsers
        }
      }
    });
    
  } catch (error) {
    return createErrorResponse(error);
  }
} 