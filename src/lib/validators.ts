export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function isValidPhone(value: string): boolean {
  return /^(\+?\d{1,4})?[\s-]?\d{7,15}$/.test(value.replace(/[\s()-]/g, ""));
}

export function isValidBDPhone(value: string): boolean {
  return /^01[3-9]\d{8}$/.test(value.replace(/[\s()-]/g, ""));
}