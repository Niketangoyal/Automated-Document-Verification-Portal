import { processDocument } from './document-extractor';

/**
 * Extract text from an image URL or Buffer
 */
import Tesseract from 'tesseract.js';
import path from 'path';

export async function extractTextFromImage(imageUrl: string): Promise<string> {
  try {
    // We must manually resolve the worker path for Node.js environments in Next.js
    const workerPath = path.resolve(process.cwd(), 'node_modules/tesseract.js/src/worker-script/node/index.js');
console.log("image url ",imageUrl)
    const { data: { text } } = await Tesseract.recognize(
      imageUrl,
      'eng',
      {
        // Force Tesseract to use the absolute path we just resolved
        workerPath: workerPath,
        errorHandler: (err) => console.error("Tesseract Internal Error:", err),
      }
    );
console.log("extracted text",text)
    return text.trim();
  } catch (error) {
    console.error('Error extracting text from image:', error);

    // Fallback: If URL fails, try fetching to Buffer first
    try {
      const response = await fetch(imageUrl);
      const buffer = Buffer.from(await response.arrayBuffer());
      const { data: { text } } = await Tesseract.recognize(buffer, 'eng');
      return text.trim();
    } catch {
      throw new Error('Failed to extract text from image after fallback');
    }
  }
}

/**
 * Verify document text based on document type
 */
export function verifyDocumentText(docType: 'PAN' | 'Aadhar' | 'DrivingLicense', text: string) {
  if (!text || text.trim().length === 0) {
    return {
      isVerified: false,
      details: 'No text extracted from document'
    };
  }

  // Process document using specialized extractors
  const extractedInfo = processDocument(docType, text);
console.log("extractedINfo",extractedInfo)
  return {
    isVerified: extractedInfo.isValid,
    details: extractedInfo
  };
}

/**
 * Process and verify a document image
 */
export async function processAndVerifyDocument(
  docType: 'PAN' | 'Aadhar' | 'DrivingLicense',
  imageUrl: string
) {
  try {
    const extractedText = await extractTextFromImage(imageUrl);
    const verificationResult = verifyDocumentText(docType, extractedText);

    return {
      extractedText,
      ...verificationResult
    };
  } catch (error) {
    console.error('Error processing and verifying document:', error);
    throw error; // Throw original error for better debugging
  }
}