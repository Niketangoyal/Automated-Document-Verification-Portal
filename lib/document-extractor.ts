/**
 * document-extractor.ts
 * Utilities for extracting and validating information from different document types
 */

type DocumentField = {
  name: string;
  value: string | null;
  confidence: number;
  valid: boolean;
};

type ExtractedDocumentInfo = {
  documentType: string;
  fields: DocumentField[];
  isComplete: boolean;
  isValid: boolean;
};

/**
 * Extract PAN card information from OCR text
 */
export function extractPANCardInfo(text: string): ExtractedDocumentInfo {
  // Prepare result object
  const result: ExtractedDocumentInfo = {
    documentType: 'PAN',
    fields: [],
    isComplete: false,
    isValid: false
  };

  // Regular expressions for PAN card fields
  const patterns = {
    panNumber: /[A-Z]{5}[0-9]{4}[A-Z]{1}/g,
    name: /Name\s*[:\s]\s*([A-Z\s]+)/i,
    fatherName: /Father('s)?\s*Name\s*[:\s]\s*([A-Z\s]+)/i,
    dateOfBirth: /(Date|DOB|D\.O\.B).*?(\d{2}\/\d{2}\/\d{4}|\d{2}\-\d{2}\-\d{4})/i
  };

  // Extract PAN number
  const panNumber = text.match(patterns.panNumber);
  result.fields.push({
    name: 'PAN Number',
    value: panNumber ? panNumber[0] : null,
    confidence: panNumber ? 0.9 : 0,
    valid: panNumber ? validatePANNumber(panNumber[0]) : false
  });

  // Extract name
  const nameMatch = text.match(patterns.name);
  result.fields.push({
    name: 'Name',
    value: nameMatch ? nameMatch[1].trim() : null,
    confidence: nameMatch ? 0.8 : 0,
    valid: nameMatch ? nameMatch[1].trim().length > 2 : false
  });

  // Extract father's name
  const fatherNameMatch = text.match(patterns.fatherName);
  result.fields.push({
    name: "Father's Name",
    value: fatherNameMatch ? fatherNameMatch[2].trim() : null,
    confidence: fatherNameMatch ? 0.7 : 0,
    valid: fatherNameMatch ? fatherNameMatch[2].trim().length > 2 : false
  });

  // Extract date of birth
  const dobMatch = text.match(patterns.dateOfBirth);
  let dobValue = null;
  if (dobMatch && dobMatch[2]) {
    dobValue = dobMatch[2];
  }
  result.fields.push({
    name: 'Date of Birth',
    value: dobValue,
    confidence: dobValue ? 0.8 : 0,
    valid: dobValue ? validateDate(dobValue) : false
  });

  // Check if document is complete and valid
  const validFields = result.fields.filter(field => field.valid);
  result.isComplete = validFields.length === result.fields.length;
  result.isValid = result.isComplete && result.fields[0].valid; // PAN number must be valid

  return result;
}

/**
 * Extract Aadhar card information from OCR text
 */
export function extractAadharCardInfo(text: string): ExtractedDocumentInfo {
  // Prepare result object
  const result: ExtractedDocumentInfo = {
    documentType: 'Aadhar',
    fields: [],
    isComplete: false,
    isValid: false
  };

  // Regular expressions for Aadhar card fields
  const patterns = {
    aadharNumber: /\d{4}\s\d{4}\s\d{4}|\d{12}/g,
    name: /(?:name|नाम)[:\s]*([A-Za-z\s]+)/i,
    dateOfBirth: /(?:DOB|Date\sof\sBirth|जन्म\sतिथि|Birth)[:\s]*(\d{2}\/\d{2}\/\d{4}|\d{2}\-\d{2}\-\d{4})/i,
    gender: /(?:MALE|FEMALE|पुरुष|महिला|Male|Female)/i,
    address: /(?:Address|पता)[:\s]*([\s\S]+?)(?:\d{6}|$)/i
  };

  // Extract Aadhar number
  const aadharNumber = text.match(patterns.aadharNumber);
  let formattedAadhar = null;
  if (aadharNumber) {
    // Format to standard 12 digits (remove spaces)
    formattedAadhar = aadharNumber[0].replace(/\s/g, '');
  }
  result.fields.push({
    name: 'Aadhar Number',
    value: formattedAadhar,
    confidence: formattedAadhar ? 0.9 : 0,
    valid: formattedAadhar ? validateAadharNumber(formattedAadhar) : false
  });

  // Extract name
  const nameMatch = text.match(patterns.name);
  result.fields.push({
    name: 'Name',
    value: nameMatch ? nameMatch[1].trim() : null,
    confidence: nameMatch ? 0.8 : 0,
    valid: nameMatch ? nameMatch[1].trim().length > 2 : false
  });

  // Extract date of birth
  const dobMatch = text.match(patterns.dateOfBirth);
  let dobValue = null;
  if (dobMatch && dobMatch[1]) {
    dobValue = dobMatch[1];
  }
  result.fields.push({
    name: 'Date of Birth',
    value: dobValue,
    confidence: dobValue ? 0.8 : 0,
    valid: dobValue ? validateDate(dobValue) : false
  });

  // Extract gender
  const genderMatch = text.match(patterns.gender);
  result.fields.push({
    name: 'Gender',
    value: genderMatch ? genderMatch[0] : null,
    confidence: genderMatch ? 0.7 : 0,
    valid: genderMatch !== null
  });

  // Extract address
  const addressMatch = text.match(patterns.address);
  result.fields.push({
    name: 'Address',
    value: addressMatch ? addressMatch[1].trim() : null,
    confidence: addressMatch ? 0.6 : 0,
    valid: addressMatch ? addressMatch[1].trim().length > 10 : false
  });

  // Check if document is complete and valid
  const validFields = result.fields.filter(field => field.valid);
  result.isComplete = validFields.length >= 3; // At least 3 valid fields
  result.isValid = result.isComplete && result.fields[0].valid; // Aadhar number must be valid

  return result;
}

/**
 * Extract Driving License information from OCR text
 */
export function extractDrivingLicenseInfo(text: string): ExtractedDocumentInfo {
  // Prepare result object
  const result: ExtractedDocumentInfo = {
    documentType: 'DrivingLicense',
    fields: [],
    isComplete: false,
    isValid: false
  };

  // Regular expressions for Driving License fields
  const patterns = {
    dlNumber: /([A-Z]{2})(\d{2})(\d{4})(\d{7})/,
    name: /(?:name|नाम)[:\s]*([A-Za-z\s]+)/i,
    dateOfBirth: /(?:DOB|Date\sof\sBirth|जन्म\sतिथि|Birth)[:\s]*(\d{2}\/\d{2}\/\d{4}|\d{2}\-\d{2}\-\d{4})/i,
    validFrom: /(?:valid from|से मान्य)[:\s]*(\d{2}\/\d{2}\/\d{4}|\d{2}\-\d{2}\-\d{4})/i,
    validTo: /(?:valid till|valid to|तक मान्य)[:\s]*(\d{2}\/\d{2}\/\d{4}|\d{2}\-\d{2}\-\d{4})/i,
    address: /(?:Address|पता)[:\s]*([\s\S]+?)(?:\d{6}|$)/i
  };

  // Extract DL number
  const dlMatch = text.match(patterns.dlNumber);
  result.fields.push({
    name: 'DL Number',
    value: dlMatch ? dlMatch[0] : null,
    confidence: dlMatch ? 0.9 : 0,
    valid: dlMatch !== null
  });

  // Extract name
  const nameMatch = text.match(patterns.name);
  result.fields.push({
    name: 'Name',
    value: nameMatch ? nameMatch[1].trim() : null,
    confidence: nameMatch ? 0.8 : 0,
    valid: nameMatch ? nameMatch[1].trim().length > 2 : false
  });

  // Extract date of birth
  const dobMatch = text.match(patterns.dateOfBirth);
  let dobValue = null;
  if (dobMatch && dobMatch[1]) {
    dobValue = dobMatch[1];
  }
  result.fields.push({
    name: 'Date of Birth',
    value: dobValue,
    confidence: dobValue ? 0.8 : 0,
    valid: dobValue ? validateDate(dobValue) : false
  });

  // Extract valid from date
  const validFromMatch = text.match(patterns.validFrom);
  let validFromValue = null;
  if (validFromMatch && validFromMatch[1]) {
    validFromValue = validFromMatch[1];
  }
  result.fields.push({
    name: 'Valid From',
    value: validFromValue,
    confidence: validFromValue ? 0.7 : 0,
    valid: validFromValue ? validateDate(validFromValue) : false
  });

  // Extract valid to date
  const validToMatch = text.match(patterns.validTo);
  let validToValue = null;
  if (validToMatch && validToMatch[1]) {
    validToValue = validToMatch[1];
  }
  result.fields.push({
    name: 'Valid To',
    value: validToValue,
    confidence: validToValue ? 0.7 : 0,
    valid: validToValue ? validateDate(validToValue) : false
  });

  // Extract address
  const addressMatch = text.match(patterns.address);
  result.fields.push({
    name: 'Address',
    value: addressMatch ? addressMatch[1].trim() : null,
    confidence: addressMatch ? 0.6 : 0,
    valid: addressMatch ? addressMatch[1].trim().length > 10 : false
  });

  // Check if document is complete and valid
  const validFields = result.fields.filter(field => field.valid);
  result.isComplete = validFields.length >= 4; // At least 4 valid fields
  result.isValid = result.isComplete && result.fields[0].valid; // DL number must be valid

  return result;
}

/**
 * Process OCR text based on document type
 */
export function processDocument(documentType: string, text: string): ExtractedDocumentInfo {
  switch (documentType.toLowerCase()) {
    case 'pan':
      return extractPANCardInfo(text);
    case 'aadhar':
      return extractAadharCardInfo(text);
    case 'drivinglicense':
      return extractDrivingLicenseInfo(text);
    default:
      return {
        documentType: 'Unknown',
        fields: [],
        isComplete: false,
        isValid: false
      };
  }
}

// Validation helpers

/**
 * Validate PAN card number
 */
function validatePANNumber(pan: string): boolean {
  // Check format: AAAAA0000A
  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  return panRegex.test(pan);
}

/**
 * Validate Aadhar number
 * Note: This is a simplified validation that only checks format
 */
function validateAadharNumber(aadhar: string): boolean {
  // Check if it's 12 digits
  return /^\d{12}$/.test(aadhar);
}

/**
 * Validate date format
 */
function validateDate(date: string): boolean {
  // Support both DD/MM/YYYY and DD-MM-YYYY formats
  const dateRegex = /^(\d{2})[\/\-](\d{2})[\/\-](\d{4})$/;
  
  if (!dateRegex.test(date)) {
    return false;
  }
  
  const match = date.match(dateRegex);
  if (!match) return false;
  
  const day = parseInt(match[1], 10);
  const month = parseInt(match[2], 10);
  const year = parseInt(match[3], 10);
  
  // Basic date validation
  if (month < 1 || month > 12) return false;
  if (day < 1 || day > 31) return false;
  if (year < 1900 || year > new Date().getFullYear()) return false;
  
  // Check for valid day in month
  if (month === 2) {
    // February
    const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
    if (day > (isLeapYear ? 29 : 28)) return false;
  } else if ([4, 6, 9, 11].includes(month)) {
    // April, June, September, November have 30 days
    if (day > 30) return false;
  }
  
  return true;
} 