export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const isValidEmail = (email: string): boolean => EMAIL_REGEX.test(email.trim());

export const isValidIndianPhone = (digitsOnly: string): boolean => /^\d{10}$/.test(digitsOnly);

// Strips everything except digits and caps the result at 10 digits
// (used while the user is typing, so the field can never exceed a valid length)
export const sanitizePhoneDigits = (raw: string): string => raw.replace(/\D/g, "").slice(0, 10);
