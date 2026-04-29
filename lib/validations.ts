import { z } from 'zod';

// User schema for registration and update
export const userSchema = z.object({
  clerkId:z.string(),
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  role: z.enum(['user', 'admin']).default('user'),
  image: z.string().url().optional(),
});

// Schema for document creation
export const documentSchema = z.object({
  title: z.string().min(3, { message: 'Title must be at least 3 characters' }),
  description: z.string().optional(),
  fileName:z.string(),
  fileUrl: z.string().url({ message: 'Please provide a valid file URL' }),
  fileType: z.enum(['PAN', 'Aadhar', 'DrivingLicense', 'Other'], {
    message: 'Please select a valid document type',
  }),
  publicId: z.string().optional(),
});

// Schema for document update
export const documentUpdateSchema = z.object({
  title: z.string().min(3, { message: 'Title must be at least 3 characters' }).optional(),
  description: z.string().optional(),
  fileType: z.enum(['PAN', 'Aadhar', 'DrivingLicense', 'Other'], {
    message: 'Please select a valid document type',
  }).optional(),
  isVerified: z.boolean().optional(),
  extractedText: z.string().optional(),
});

// Schema for document extraction without saving
export const extractDocumentInfoSchema = z.object({
  imageUrl: z.string().url({ message: 'Please provide a valid image URL' }),
  documentType: z.enum(['PAN', 'Aadhar', 'DrivingLicense'], {
    message: 'Please select a valid document type',
  }),
});

// Schema for document verification
export const documentVerificationSchema = z.object({
  documentId: z.string(),
  manualReview: z.boolean().optional(),
  reviewerNotes: z.string().optional(),
  overrideVerification: z.boolean().optional(),
});

// Schema for document search/filter
export const documentFilterSchema = z.object({
  status: z.enum(['pending', 'processing', 'completed', 'failed']).optional(),
  fileType: z.enum(['PAN', 'Aadhar', 'DrivingLicense', 'Other']).optional(),
  isVerified: z.boolean().optional(),
  searchTerm: z.string().optional(),
  page: z.number().int().positive().optional(),
  limit: z.number().int().positive().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});

// Query params for documents
export const documentQuerySchema = z.object({
  userId: z.string().optional(),
  isVerified: z.boolean().optional(),
  fileType: z.enum(["PAN", "Aadhar", "DrivingLicense"]).optional(),
  limit: z.number().int().min(1).max(100).optional().default(10),
  page: z.number().int().min(1).optional().default(1),
});

// General error response schema
export const errorResponseSchema = z.object({
  message: z.string(),
  errors: z.array(z.string()).optional(),
}); 