"use client";

import { useState, useCallback } from "react";
import { useDocument } from "@/context/DocumentContext";
import { pdf } from "@react-pdf/renderer";
import { getPDFTemplate } from "@/components/pdf/PDFTemplates";

export type ExportType = "pdf" | null;

// CountAPI integration for tracking downloads
async function incrementDownloadCount() {
  try {
    await fetch("https://api.countapi.xyz/hit/invoice-generator-app/downloads");
  } catch (error) {
    // Silently fail - analytics shouldn't break the app
    console.warn("Failed to track download:", error);
  }
}

export function useExport() {
  const { state } = useDocument();
  const { document } = state;
  const [isExporting, setIsExporting] = useState(false);
  const [exportType, setExportType] = useState<ExportType>(null);

  const getFileName = useCallback(() => {
    const type = document.type === "invoice" ? "Invoice" : "Quotation";
    const number = document.details.documentNumber.replace(
      /[^a-zA-Z0-9]/g,
      "-",
    );
    const date = document.details.issueDate;
    return `${type}-${number}-${date}`;
  }, [document]);

  const exportToPDF = useCallback(async () => {
    setIsExporting(true);
    setExportType("pdf");

    try {
      // Get the PDF document using @react-pdf/renderer
      const pdfTemplate = getPDFTemplate(document);
      const blob = await pdf(pdfTemplate).toBlob();

      // Download the PDF
      const { saveAs } = await import("file-saver");
      saveAs(blob, `${getFileName()}.pdf`);

      await incrementDownloadCount();
    } catch (error) {
      console.error("Failed to export PDF:", error);
      alert("Failed to export PDF. Please try again.");
    } finally {
      setIsExporting(false);
      setExportType(null);
    }
  }, [document, getFileName]);

  return {
    exportToPDF,
    isExporting,
    exportType,
  };
}
