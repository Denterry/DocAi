import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function convertToAscii(inputString: string) {
  // удаляем из file_key все не ascii символы
  const asciiString = inputString.replace(/[^ -~]+/g, '');
  return asciiString;
}