import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

// Type for API error responses
export type ApiError = {
  message: string;
  errors?: string[];
  status: number;
};

// Function to handle validation errors
export const handleValidationError = (error: ZodError): ApiError => {
  const errors = error.errors.map((err) => `${err.path.join('.')}: ${err.message}`);
  
  return {
    message: 'Validation failed',
    errors,
    status: 400,
  };
};

// Function to create API error responses
export const createErrorResponse = (error: Error | ApiError | unknown, status = 500): NextResponse => {
  console.error('API Error:', error);
  
  // Handle known error types
  if (error instanceof ZodError) {
    const validationError = handleValidationError(error);
    return NextResponse.json({
      message: validationError.message,
      errors: validationError.errors,
    }, { status: validationError.status });
  }
  
  // If it's our ApiError type
  if (error && typeof error === 'object' && 'message' in error && 'status' in error) {
    const apiError = error as ApiError;
    return NextResponse.json({
      message: apiError.message,
      errors: apiError.errors,
    }, { status: apiError.status });
  }
  
  // Generic error handling
  const message = error instanceof Error ? error.message : 'An unexpected error occurred';
  
  return NextResponse.json({
    message,
  }, { status });
};

// Function to create API success responses
export const createSuccessResponse = <T>(data: T, status = 200): NextResponse => {
  return NextResponse.json(data, { status });
}; 