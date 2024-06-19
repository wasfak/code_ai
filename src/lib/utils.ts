import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import jsPDF from "jspdf";
import * as XLSX from "xlsx";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const handleError = (error: unknown) => {
  if (error instanceof Error) {
    // This is a native JavaScript error (e.g., TypeError, RangeError)
    console.error(error.message);
    throw new Error(`Error: ${error.message}`);
  } else if (typeof error === "string") {
    // This is a string error message
    console.error(error);
    throw new Error(`Error: ${error}`);
  } else {
    // This is an unknown type of error
    console.error(error);
    throw new Error(`Unknown error: ${JSON.stringify(error)}`);
  }
};

export const downloadAsExcel = (outPut: String) => {
  const worksheet = XLSX.utils.json_to_sheet([{ transcription: outPut }]);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Transcription");
  XLSX.writeFile(workbook, "transcription.xlsx");
};

export const downloadAsPDF = (outPut: string) => {
  const doc = new jsPDF();
  doc.text(outPut, 10, 10);
  doc.save("transcription.pdf");
};

// Define a type for the function parameters
type CopyToClipboardProps = {
  outPut: string;
  isCopied: boolean;
  setIsCopied: (value: boolean) => void;
};

// Rename the function to avoid conflict with the type
export const copyToClipboardFunction = async ({
  outPut,
  isCopied,
  setIsCopied,
}: CopyToClipboardProps) => {
  if (!isCopied) {
    if (outPut) {
      try {
        await navigator.clipboard.writeText(outPut);
        setIsCopied(true);
        // Optional: Reset after 2 seconds
        // setTimeout(() => setIsCopied(false), 2000);
      } catch (error) {
        console.error("Copy failed", error);
      }
    }
  } else {
    setIsCopied(false); // Allow users to manually toggle "Copied" back to "Copy"
  }
};
