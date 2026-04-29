import { NextRequest } from 'next/server';
import { clerkClient } from '@clerk/nextjs/server';
import { auth } from '@clerk/nextjs/server';
import { createErrorResponse, createSuccessResponse } from '@/lib/api-utils';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { userSchema } from '@/lib/validations';

/**
 * POST /api/users/sync
 * Syncs the current authenticated user from Clerk to our MongoDB database
 */
export async function POST(req: NextRequest) {
  try {
    // Get the current authenticated user
    const { userId } = await auth();
    console.log("Authenticated User ID:", userId);

    if (!userId) {
      return createErrorResponse({ 
        message: 'Unauthorized', 
        status: 401 
      });
    }

    // Connect to the database
    await connectDB();

    // Check if user already exists in our database
    const existingUser = await User.findOne({ clerkId: userId });
    
    if (existingUser) {
      return createSuccessResponse({ 
        message: 'User already synced', 
        user: existingUser 
      });
    }

    // Fetch user data from Clerk
    const client = await clerkClient()

    const clerkUser = await client.users.getUser(userId);
    
    if (!clerkUser) {
      return createErrorResponse({
        message: 'User not found in Clerk',
        status: 404
      });
    }

    // Extract user data
    const userData = {
      clerkId: userId,
      name: `${clerkUser.firstName} ${clerkUser.lastName || ''}`.trim(),
      email: clerkUser.emailAddresses[0]?.emailAddress || '',
      role: 'user',
    };

    // Validate user data
    const validatedData = userSchema.parse(userData);

    // Create the user in our database
    const newUser = await User.create(validatedData);

    return createSuccessResponse({ 
      message: 'User synced successfully', 
      user: newUser 
    }, 201);
    
  } catch (error) {
    return createErrorResponse(error);
  }
}

/**
 * GET /api/users/sync
 * Gets the current authenticated user from our MongoDB database
 */
export async function GET(req: NextRequest) {
  try {
    // Get the current authenticated user
    const { userId } =await auth();
    
    if (!userId) {
      return createErrorResponse({ 
        message: 'Unauthorized', 
        status: 401 
      });
    }

    // Connect to the database
    await connectDB();

    // Find the user in our database
    const user = await User.findOne({ clerkId: userId });
    
    if (!user) {
      return createErrorResponse({
        message: 'User not found in database',
        status: 404
      });
    }

    return createSuccessResponse({ user });
    
  } catch (error) {
    return createErrorResponse(error);
  }
} 