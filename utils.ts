
/**
 * Generates the sequential counter for the report ID: A to Z, then A1 to Z9.
 * Format:
 * 0-25: A-Z
 * 26-259: A1-Z9
 */
export const getCounterString = (index: number): string | null => {
  if (index < 26) {
    return String.fromCharCode(65 + index);
  }
  
  const shiftedIndex = index - 26;
  const letterIndex = shiftedIndex % 26;
  const numberSuffix = Math.floor(shiftedIndex / 26) + 1;
  
  if (numberSuffix > 9) {
    return null; // Limit reached (Z9)
  }
  
  return String.fromCharCode(65 + letterIndex) + numberSuffix;
};

export const generateUserHex = (username: string): string => {
  let hash = 0;
  for (let i = 0; i < username.length; i++) {
    hash = username.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hex = (hash & 0xFFFFFF).toString(16).toUpperCase().padStart(6, '0');
  return hex;
};

export const formatReportCode = (userHex: string, counter: string): string => {
  return `CI-${userHex}-${counter}`;
};
