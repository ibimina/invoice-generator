"use client";

import { useState, useCallback } from "react";
import { useDocument } from "@/context/DocumentContext";
import { ACCENT_COLORS, AccentColor } from "@/types/document";
import { formatCurrency, formatDate } from "@/lib/utils";
import { pdf } from "@react-pdf/renderer";
import { getPDFTemplate } from "@/components/pdf/PDFTemplates";

export type ExportType = "pdf" | "png" | "html" | null;

// CountAPI integration for tracking downloads
async function incrementDownloadCount() {
  try {
    await fetch("https://api.countapi.xyz/hit/invoice-generator-app/downloads");
  } catch (error) {
    // Silently fail - analytics shouldn't break the app
    console.warn("Failed to track download:", error);
  }
}

// Create an isolated rendering of the preview element
// This avoids Tailwind CSS v4 lab() color parsing issues with html2canvas
async function capturePreviewElement(
  element: HTMLElement,
  scale: number = 2,
): Promise<HTMLCanvasElement> {
  const html2canvas = (await import("html2canvas")).default;

  // Create an iframe to isolate from Tailwind CSS
  const iframe = window.document.createElement("iframe");
  iframe.style.cssText =
    "position:fixed;left:-9999px;top:-9999px;width:800px;height:1200px;border:none;";
  window.document.body.appendChild(iframe);

  const iframeDoc = iframe.contentDocument!;

  // Write minimal HTML with no external styles
  iframeDoc.open();
  iframeDoc.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { background: #ffffff; }
        /* Fix word spacing for html2canvas */
        p, span, div, td, th, li { 
          word-spacing: 0.25em !important;
          white-space: pre-wrap !important;
        }
      </style>
    </head>
    <body></body>
    </html>
  `);
  iframeDoc.close();

  // Clone the preview element with all inline styles preserved
  const clone = element.cloneNode(true) as HTMLElement;

  // Copy computed styles to inline for the clone and all descendants
  const copyStyles = (source: HTMLElement, target: HTMLElement) => {
    const computed = window.getComputedStyle(source);
    const importantProps = [
      "display",
      "position",
      "top",
      "right",
      "bottom",
      "left",
      "z-index",
      "width",
      "height",
      "min-width",
      "max-width",
      "min-height",
      "max-height",
      "margin",
      "margin-top",
      "margin-right",
      "margin-bottom",
      "margin-left",
      "padding",
      "padding-top",
      "padding-right",
      "padding-bottom",
      "padding-left",
      "border",
      "border-width",
      "border-style",
      "border-color",
      "border-radius",
      "border-top-width",
      "border-right-width",
      "border-bottom-width",
      "border-left-width",
      "border-top-style",
      "border-right-style",
      "border-bottom-style",
      "border-left-style",
      "border-top-color",
      "border-right-color",
      "border-bottom-color",
      "border-left-color",
      "border-top-left-radius",
      "border-top-right-radius",
      "border-bottom-left-radius",
      "border-bottom-right-radius",
      "font-family",
      "font-size",
      "font-weight",
      "font-style",
      "line-height",
      "text-align",
      "text-transform",
      "letter-spacing",
      "word-spacing",
      "white-space",
      "text-decoration",
      "color",
      "background-color",
      "background-image",
      "background-size",
      "background-position",
      "background-repeat",
      "flex",
      "flex-direction",
      "flex-wrap",
      "justify-content",
      "align-items",
      "align-content",
      "gap",
      "grid-template-columns",
      "grid-template-rows",
      "grid-gap",
      "overflow",
      "overflow-x",
      "overflow-y",
      "opacity",
      "visibility",
      "box-shadow",
      "transform",
      "transition",
    ];

    importantProps.forEach((prop) => {
      let value = computed.getPropertyValue(prop);
      if (
        value &&
        value !== "" &&
        value !== "none" &&
        value !== "normal" &&
        value !== "auto" &&
        value !== "0px"
      ) {
        // Replace lab() colors with hex equivalents
        if (value.includes("lab(")) {
          // Map to approximate hex value
          if (value.includes("98.5")) value = "#f8fafc";
          else if (value.includes("96.0") || value.includes("96.08"))
            value = "#f1f5f9";
          else if (value.includes("91.6") || value.includes("91.79"))
            value = "#e2e8f0";
          else if (value.includes("86.9") || value.includes("86.91"))
            value = "#cbd5e1";
          else if (value.includes("64.9") || value.includes("64.81"))
            value = "#94a3b8";
          else if (value.includes("48.1") || value.includes("48.19"))
            value = "#64748b";
          else if (value.includes("37.9") || value.includes("37.91"))
            value = "#475569";
          else if (value.includes("29.3") || value.includes("29.35"))
            value = "#334155";
          else if (value.includes("20.9") || value.includes("20.91"))
            value = "#1e293b";
          else if (value.includes("13.2") || value.includes("13.28"))
            value = "#0f172a";
          else if (value.includes("100%")) value = "#ffffff";
          else value = "#64748b"; // Default gray fallback
        }
        target.style.setProperty(prop, value);
      }
    });

    // Process children
    const sourceChildren = source.children;
    const targetChildren = target.children;
    for (let i = 0; i < sourceChildren.length; i++) {
      if (
        sourceChildren[i] instanceof HTMLElement &&
        targetChildren[i] instanceof HTMLElement
      ) {
        copyStyles(
          sourceChildren[i] as HTMLElement,
          targetChildren[i] as HTMLElement,
        );
      }
    }
  };

  copyStyles(element, clone);
  iframeDoc.body.appendChild(clone);

  // Wait for images to load
  await new Promise((resolve) => setTimeout(resolve, 100));

  // Capture with html2canvas
  const canvas = await html2canvas(clone, {
    scale,
    useCORS: true,
    logging: false,
    backgroundColor: "#ffffff",
  });

  // Cleanup
  window.document.body.removeChild(iframe);

  return canvas;
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

  const exportToPNG = useCallback(async () => {
    setIsExporting(true);
    setExportType("png");

    try {
      const { saveAs } = await import("file-saver");

      const element = window.document.getElementById("document-preview");
      if (!element) {
        throw new Error("Preview element not found");
      }

      // Use isolated capture to avoid Tailwind lab() color issues
      const canvas = await capturePreviewElement(element as HTMLElement, 2);

      canvas.toBlob((blob) => {
        if (blob) {
          saveAs(blob, `${getFileName()}.png`);
          incrementDownloadCount();
        }
      }, "image/png");
    } catch (error) {
      console.error("Failed to export PNG:", error);
      alert("Failed to export PNG. Please try again.");
    } finally {
      setIsExporting(false);
      setExportType(null);
    }
  }, [getFileName]);

  const exportToHTML = useCallback(async () => {
    setIsExporting(true);
    setExportType("html");

    try {
      // Dynamic import for browser-only library
      const { saveAs } = await import("file-saver");

      const color =
        ACCENT_COLORS[document.accentColor as AccentColor] ||
        document.accentColor;

      // Calculate totals
      let subtotal = 0;
      let totalDiscount = 0;
      let totalTax = 0;

      document.items.forEach((item) => {
        const lineTotal = item.quantity * item.unitPrice;
        const discount = lineTotal * (item.discountPercent / 100);
        const afterDiscount = lineTotal - discount;
        const tax = afterDiscount * (item.taxRate / 100);

        subtotal += lineTotal;
        totalDiscount += discount;
        totalTax += tax;
      });

      const grandTotal = subtotal - totalDiscount + totalTax;

      const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${document.type === "invoice" ? "Invoice" : "Quotation"} - ${document.details.documentNumber}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: system-ui, -apple-system, sans-serif;
      background: #f1f5f9;
      padding: 20px;
    }
    .container {
      max-width: 800px;
      margin: 0 auto;
      background: white;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      padding: 40px;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }
    .logo-section {
      display: flex;
      gap: 16px;
      align-items: flex-start;
    }
    .logo-section img {
      width: 64px;
      height: 64px;
      object-fit: contain;
    }
    .business-name {
      font-size: 20px;
      font-weight: bold;
      color: #1e293b;
    }
    .business-info {
      font-size: 14px;
      color: #64748b;
      margin-top: 4px;
    }
    .document-title {
      text-align: right;
    }
    .document-title h1 {
      font-size: 28px;
      font-weight: bold;
      text-transform: uppercase;
      color: ${color};
    }
    .document-number {
      font-size: 18px;
      font-weight: 600;
      color: #475569;
    }
    .accent-bar {
      height: 4px;
      background: ${color};
      border-radius: 2px;
      margin: 24px 0;
    }
    .details-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 32px;
    }
    .section-label {
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      color: #64748b;
    }
    .client-name {
      font-weight: 600;
      color: #1e293b;
      margin-top: 8px;
    }
    .detail-text {
      font-size: 14px;
      color: #64748b;
    }
    .detail-item {
      display: flex;
      justify-content: flex-end;
      gap: 16px;
      margin-bottom: 4px;
    }
    .detail-label {
      font-size: 14px;
      color: #64748b;
    }
    .detail-value {
      font-size: 14px;
      font-weight: 500;
      color: #1e293b;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 24px;
    }
    th {
      background: ${color};
      color: white;
      padding: 12px 16px;
      font-size: 14px;
      font-weight: 600;
      text-align: left;
    }
    th:nth-child(2) { text-align: center; }
    th:nth-child(3), th:nth-child(4) { text-align: right; }
    td {
      padding: 12px 16px;
      font-size: 14px;
      color: #1e293b;
    }
    td:nth-child(2) { text-align: center; }
    td:nth-child(3), td:nth-child(4) { text-align: right; }
    tr:nth-child(even) { background: #f8fafc; }
    .totals {
      display: flex;
      justify-content: flex-end;
      margin-top: 24px;
    }
    .totals-box {
      width: 280px;
    }
    .total-row {
      display: flex;
      justify-content: space-between;
      padding: 4px 0;
      font-size: 14px;
    }
    .total-label { color: #64748b; }
    .total-value { font-weight: 500; color: #1e293b; }
    .total-value.discount { color: #dc2626; }
    .grand-total {
      background: ${color};
      color: white;
      padding: 12px 16px;
      border-radius: 8px;
      display: flex;
      justify-content: space-between;
      margin-top: 8px;
    }
    .grand-total-label {
      font-size: 16px;
      font-weight: 600;
    }
    .grand-total-value {
      font-size: 16px;
      font-weight: bold;
    }
    .notes-section {
      margin-top: 40px;
    }
    .notes-title {
      font-size: 14px;
      font-weight: 600;
      color: #475569;
      margin-bottom: 4px;
    }
    .notes-text {
      font-size: 14px;
      color: #64748b;
      white-space: pre-line;
    }
    .footer {
      margin-top: 40px;
      padding-top: 24px;
      border-top: 1px solid #e2e8f0;
      text-align: center;
      color: #64748b;
      font-size: 14px;
    }
    @media print {
      body { background: white; padding: 0; }
      .container { box-shadow: none; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo-section">
        ${document.business.logo ? `<img src="${document.business.logo}" alt="Logo">` : ""}
        <div>
          <div class="business-name">${document.business.name || "Your Business"}</div>
          <div class="business-info">${document.business.address?.replace(/\n/g, "<br>") || ""}</div>
          ${document.business.email ? `<div class="business-info">${document.business.email}</div>` : ""}
          ${document.business.phone ? `<div class="business-info">${document.business.phone}</div>` : ""}
        </div>
      </div>
      <div class="document-title">
        <h1>${document.type === "invoice" ? "Invoice" : "Quotation"}</h1>
        <div class="document-number">#${document.details.documentNumber}</div>
      </div>
    </div>

    <div class="accent-bar"></div>

    <div class="details-row">
      <div>
        <div class="section-label">Bill To</div>
        <div class="client-name">${document.client.name || "Client Name"}</div>
        ${document.client.company ? `<div class="detail-text">${document.client.company}</div>` : ""}
        ${document.client.address ? `<div class="detail-text">${document.client.address.replace(/\n/g, "<br>")}</div>` : ""}
        ${document.client.email ? `<div class="detail-text">${document.client.email}</div>` : ""}
      </div>
      <div>
        <div class="detail-item">
          <span class="detail-label">Issue Date:</span>
          <span class="detail-value">${formatDate(document.details.issueDate)}</span>
        </div>
        ${
          document.type === "invoice" && document.details.dueDate
            ? `
        <div class="detail-item">
          <span class="detail-label">Due Date:</span>
          <span class="detail-value">${formatDate(document.details.dueDate)}</span>
        </div>`
            : ""
        }
        ${
          document.type === "quotation" && document.details.validUntil
            ? `
        <div class="detail-item">
          <span class="detail-label">Valid Until:</span>
          <span class="detail-value">${formatDate(document.details.validUntil)}</span>
        </div>`
            : ""
        }
        ${
          document.details.poNumber
            ? `
        <div class="detail-item">
          <span class="detail-label">PO Number:</span>
          <span class="detail-value">${document.details.poNumber}</span>
        </div>`
            : ""
        }
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th>Description</th>
          <th>Qty</th>
          <th>Rate</th>
          <th>Amount</th>
        </tr>
      </thead>
      <tbody>
        ${document.items
          .map(
            (item) => `
        <tr>
          <td>
            ${item.description || "Item description"}
            ${item.taxRate > 0 ? `<span style="color: #64748b; font-size: 12px;"> (Tax: ${item.taxRate}%)</span>` : ""}
            ${item.discountPercent > 0 ? `<span style="color: #64748b; font-size: 12px;"> (Disc: ${item.discountPercent}%)</span>` : ""}
          </td>
          <td>${item.quantity}</td>
          <td>${formatCurrency(item.unitPrice, document.details.currency)}</td>
          <td>${formatCurrency(item.quantity * item.unitPrice, document.details.currency)}</td>
        </tr>`,
          )
          .join("")}
      </tbody>
    </table>

    <div class="totals">
      <div class="totals-box">
        <div class="total-row">
          <span class="total-label">Subtotal</span>
          <span class="total-value">${formatCurrency(subtotal, document.details.currency)}</span>
        </div>
        ${
          totalDiscount > 0
            ? `
        <div class="total-row">
          <span class="total-label">Discount</span>
          <span class="total-value discount">-${formatCurrency(totalDiscount, document.details.currency)}</span>
        </div>`
            : ""
        }
        ${
          totalTax > 0
            ? `
        <div class="total-row">
          <span class="total-label">Tax</span>
          <span class="total-value">${formatCurrency(totalTax, document.details.currency)}</span>
        </div>`
            : ""
        }
        <div class="grand-total">
          <span class="grand-total-label">${document.type === "invoice" ? "Amount Due" : "Quote Total"}</span>
          <span class="grand-total-value">${formatCurrency(grandTotal, document.details.currency)}</span>
        </div>
      </div>
    </div>

    ${
      document.details.notes || document.details.terms
        ? `
    <div class="notes-section">
      ${
        document.details.notes
          ? `
      <div style="margin-bottom: 16px;">
        <div class="notes-title">Notes</div>
        <div class="notes-text">${document.details.notes}</div>
      </div>`
          : ""
      }
      ${
        document.details.terms
          ? `
      <div>
        <div class="notes-title">Terms & Conditions</div>
        <div class="notes-text">${document.details.terms}</div>
      </div>`
          : ""
      }
    </div>`
        : ""
    }

    <div class="footer">
      <p>Thank you for your business!</p>
      ${document.business.website ? `<p style="margin-top: 4px;">${document.business.website}</p>` : ""}
    </div>
  </div>
</body>
</html>`;

      const blob = new Blob([html], { type: "text/html" });
      saveAs(blob, `${getFileName()}.html`);
      await incrementDownloadCount();
    } catch (error) {
      console.error("Failed to export HTML:", error);
      alert("Failed to export HTML. Please try again.");
    } finally {
      setIsExporting(false);
      setExportType(null);
    }
  }, [document, getFileName]);

  return {
    exportToPDF,
    exportToPNG,
    exportToHTML,
    isExporting,
    exportType,
  };
}
