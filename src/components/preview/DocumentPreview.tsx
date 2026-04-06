/* eslint-disable @next/next/no-img-element */
"use client";

import { DocumentData, ACCENT_COLORS, AccentColor } from "@/types/document";
import { formatCurrency, formatDate } from "@/lib/utils";

// Premium color palette - refined for professional documents
const colors = {
    white: "#ffffff",
    gray50: "#fafafa",
    gray100: "#f4f4f5",
    gray200: "#e4e4e7",
    gray300: "#d4d4d8",
    gray400: "#a1a1aa",
    gray500: "#71717a",
    gray600: "#52525b",
    gray700: "#3f3f46",
    gray800: "#27272a",
    gray900: "#18181b",
    red500: "#ef4444",
    green600: "#16a34a",
};

// Shared font stack
const fontStack = "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif";

interface DocumentPreviewProps {
    document: DocumentData;
}

export function DocumentPreview({ document }: DocumentPreviewProps) {
    const { items, template, accentColor } = document;

    // Debug: Log which template is being used
    console.log("DocumentPreview rendering with template:", template);

    // Get the actual hex color
    const color = ACCENT_COLORS[accentColor as AccentColor] || accentColor;

    // Calculate totals
    let subtotal = 0;
    let totalDiscount = 0;
    let totalTax = 0;
    const taxRates = new Set<number>();

    items.forEach((item) => {
        const lineTotal = item.quantity * item.unitPrice;
        const discount = lineTotal * (item.discountPercent / 100);
        const afterDiscount = lineTotal - discount;
        const tax = afterDiscount * (item.taxRate / 100);

        subtotal += lineTotal;
        totalDiscount += discount;
        totalTax += tax;
        if (item.taxRate > 0) taxRates.add(item.taxRate);
    });

    const grandTotal = subtotal - totalDiscount + totalTax;
    // Get display tax rate (show percentage only if all items have same rate)
    const taxRateDisplay = taxRates.size === 1 ? Array.from(taxRates)[0] : null;

    // Render based on template
    if (template === "modern") {
        return <ModernTemplate document={document} color={color} subtotal={subtotal} totalDiscount={totalDiscount} totalTax={totalTax} grandTotal={grandTotal} taxRateDisplay={taxRateDisplay} />;
    }

    if (template === "minimalist") {
        return <MinimalistTemplate document={document} color={color} subtotal={subtotal} totalDiscount={totalDiscount} totalTax={totalTax} grandTotal={grandTotal} taxRateDisplay={taxRateDisplay} />;
    }

    if (template === "corporate") {
        return <CorporateTemplate document={document} color={color} subtotal={subtotal} totalDiscount={totalDiscount} totalTax={totalTax} grandTotal={grandTotal} taxRateDisplay={taxRateDisplay} />;
    }

    if (template === "creative") {
        return <CreativeTemplate document={document} color={color} subtotal={subtotal} totalDiscount={totalDiscount} totalTax={totalTax} grandTotal={grandTotal} taxRateDisplay={taxRateDisplay} />;
    }

    if (template === "simple-clean") {
        return <SimpleCleanTemplate document={document} color={color} subtotal={subtotal} totalDiscount={totalDiscount} totalTax={totalTax} grandTotal={grandTotal} taxRateDisplay={taxRateDisplay} />;
    }

    if (template === "signature") {
        return <SignatureTemplate document={document} color={color} subtotal={subtotal} totalDiscount={totalDiscount} totalTax={totalTax} grandTotal={grandTotal} taxRateDisplay={taxRateDisplay} />;
    }

    if (template === "total-highlight") {
        return <TotalHighlightTemplate document={document} color={color} subtotal={subtotal} totalDiscount={totalDiscount} totalTax={totalTax} grandTotal={grandTotal} taxRateDisplay={taxRateDisplay} />;
    }

    if (template === "blue-banner") {
        return <BlueBannerTemplate document={document} color={color} subtotal={subtotal} totalDiscount={totalDiscount} totalTax={totalTax} grandTotal={grandTotal} taxRateDisplay={taxRateDisplay} />;
    }

    if (template === "watercolor") {
        return <WatercolorTemplate document={document} color={color} subtotal={subtotal} totalDiscount={totalDiscount} totalTax={totalTax} grandTotal={grandTotal} taxRateDisplay={taxRateDisplay} />;
    }

    if (template === "sidebar") {
        return <SidebarTemplate document={document} color={color} subtotal={subtotal} totalDiscount={totalDiscount} totalTax={totalTax} grandTotal={grandTotal} taxRateDisplay={taxRateDisplay} />;
    }

    if (template === "blue-accent") {
        return <BlueAccentTemplate document={document} color={color} subtotal={subtotal} totalDiscount={totalDiscount} totalTax={totalTax} grandTotal={grandTotal} taxRateDisplay={taxRateDisplay} />;
    }

    if (template === "two-column") {
        return <TwoColumnTemplate document={document} color={color} subtotal={subtotal} totalDiscount={totalDiscount} totalTax={totalTax} grandTotal={grandTotal} taxRateDisplay={taxRateDisplay} />;
    }

    if (template === "lowercase-minimal") {
        return <LowercaseMinimalTemplate document={document} color={color} subtotal={subtotal} totalDiscount={totalDiscount} totalTax={totalTax} grandTotal={grandTotal} taxRateDisplay={taxRateDisplay} />;
    }

    if (template === "beach-wave") {
        return <BeachWaveTemplate document={document} color={color} subtotal={subtotal} totalDiscount={totalDiscount} totalTax={totalTax} grandTotal={grandTotal} taxRateDisplay={taxRateDisplay} />;
    }

    if (template === "blue-header-bar") {
        return <BlueHeaderBarTemplate document={document} color={color} subtotal={subtotal} totalDiscount={totalDiscount} totalTax={totalTax} grandTotal={grandTotal} taxRateDisplay={taxRateDisplay} />;
    }

    if (template === "circular-modern") {
        return <CircularModernTemplate document={document} color={color} subtotal={subtotal} totalDiscount={totalDiscount} totalTax={totalTax} grandTotal={grandTotal} taxRateDisplay={taxRateDisplay} />;
    }

    // Default: Classic template
    return <ClassicTemplate document={document} color={color} subtotal={subtotal} totalDiscount={totalDiscount} totalTax={totalTax} grandTotal={grandTotal} taxRateDisplay={taxRateDisplay} />;
}

interface TemplateProps {
    document: DocumentData;
    color: string;
    subtotal: number;
    totalDiscount: number;
    totalTax: number;
    grandTotal: number;
    taxRateDisplay: number | null;
}

// Helper: Lighten a hex color
function lightenColor(hex: string, percent: number): string {
    const num = parseInt(hex.replace('#', ''), 16);
    const r = Math.min(255, Math.floor((num >> 16) + (255 - (num >> 16)) * percent));
    const g = Math.min(255, Math.floor(((num >> 8) & 0x00FF) + (255 - ((num >> 8) & 0x00FF)) * percent));
    const b = Math.min(255, Math.floor((num & 0x0000FF) + (255 - (num & 0x0000FF)) * percent));
    return `#${(1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1)}`;
}

// ============================================================================
// CLASSIC TEMPLATE - Clean, timeless professional design
// ============================================================================
function ClassicTemplate({ document, color, subtotal, totalDiscount, totalTax, grandTotal, taxRateDisplay }: TemplateProps) {
    const { type, business, client, details, items, customTemplate } = document;

    return (
        <div
            id="document-preview"
            style={{
                position: "relative",
                backgroundColor: colors.white,
                boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                width: "595px",
                minHeight: "800px",
                fontFamily: fontStack,
            }}
        >
            {/* Watermark */}
            {customTemplate && (
                <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "55%", maxHeight: "45%", zIndex: 0, pointerEvents: "none" }}>
                    <img src={customTemplate} alt="" style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", opacity: 0.05, filter: "grayscale(50%)" }} />
                </div>
            )}

            <div style={{ position: "relative", zIndex: 10, padding: "28px 20px" }}>
                {/* Header */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                        {business.logo && (
                            <img src={business.logo} alt="" style={{ width: "50px", height: "50px", objectFit: "contain" }} />
                        )}
                        <div>
                            <h1 style={{ margin: 0, fontSize: "18px", fontWeight: 600, color: colors.gray900, letterSpacing: "-0.02em", lineHeight: 1.2 }}>
                                {business.name || "Your Business"}
                            </h1>
                            <div style={{ marginTop: "4px", fontSize: "11px", color: colors.gray500, lineHeight: 1.4 }}>
                                {business.address && <p style={{ margin: 0 }}>{business.address}</p>}
                                {business.email && <p style={{ margin: 0 }}>{business.email}</p>}
                                {business.phone && <p style={{ margin: 0 }}>{business.phone}</p>}
                            </div>
                        </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                        <p style={{ margin: 0, fontSize: "10px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: colors.gray400 }}>
                            {type === "invoice" ? "Invoice" : "Quotation"}
                        </p>
                        <p style={{ margin: "2px 0 0", fontSize: "20px", fontWeight: 700, color: colors.gray900, letterSpacing: "-0.02em" }}>
                            #{details.documentNumber}
                        </p>
                    </div>
                </div>

                {/* Accent Line */}
                <div style={{ height: "3px", backgroundColor: color, marginBottom: "16px" }} />

                {/* Bill To + Details */}
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
                    <div>
                        <p style={{ margin: "0 0 6px", fontSize: "10px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: colors.gray400 }}>Bill To</p>
                        <p style={{ margin: 0, fontSize: "14px", fontWeight: 600, color: colors.gray900 }}>{client.name || "Client Name"}</p>
                        {client.company && <p style={{ margin: "2px 0 0", fontSize: "12px", color: colors.gray600 }}>{client.company}</p>}
                        {client.address && <p style={{ margin: "4px 0 0", fontSize: "11px", color: colors.gray500 }}>{client.address}</p>}
                        {client.email && <p style={{ margin: "2px 0 0", fontSize: "11px", color: colors.gray500 }}>{client.email}</p>}
                        {client.phone && <p style={{ margin: "2px 0 0", fontSize: "11px", color: colors.gray500 }}>{client.phone}</p>}
                    </div>
                    <div style={{ textAlign: "right" }}>
                        <div style={{ marginBottom: "8px" }}>
                            <p style={{ margin: 0, fontSize: "10px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: colors.gray400 }}>Issue Date</p>
                            <p style={{ margin: "2px 0 0", fontSize: "13px", fontWeight: 500, color: colors.gray800 }}>{formatDate(details.issueDate)}</p>
                        </div>
                        {type === "invoice" && details.dueDate && (
                            <div style={{ marginBottom: "8px" }}>
                                <p style={{ margin: 0, fontSize: "10px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: colors.gray400 }}>Due Date</p>
                                <p style={{ margin: "2px 0 0", fontSize: "13px", fontWeight: 500, color: colors.gray800 }}>{formatDate(details.dueDate)}</p>
                            </div>
                        )}
                        {type === "quotation" && details.validUntil && (
                            <div style={{ marginBottom: "8px" }}>
                                <p style={{ margin: 0, fontSize: "10px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: colors.gray400 }}>Valid Until</p>
                                <p style={{ margin: "2px 0 0", fontSize: "13px", fontWeight: 500, color: colors.gray800 }}>{formatDate(details.validUntil)}</p>
                            </div>
                        )}
                        {details.poNumber && (
                            <div>
                                <p style={{ margin: 0, fontSize: "10px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: colors.gray400 }}>PO Number</p>
                                <p style={{ margin: "2px 0 0", fontSize: "13px", fontWeight: 500, color: colors.gray800 }}>{details.poNumber}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Items Table */}
                <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "16px" }}>
                    <thead>
                        <tr style={{ borderBottom: `2px solid ${colors.gray200}` }}>
                            <th style={{ padding: "8px 0", textAlign: "left", fontSize: "10px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: colors.gray500 }}>Description</th>
                            <th style={{ padding: "8px 0", textAlign: "center", fontSize: "10px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: colors.gray500, width: "60px" }}>Qty</th>
                            <th style={{ padding: "8px 0", textAlign: "right", fontSize: "10px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: colors.gray500, width: "100px" }}>Rate</th>
                            <th style={{ padding: "8px 0", textAlign: "right", fontSize: "10px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: colors.gray500, width: "100px" }}>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item) => (
                            <tr key={item.id} style={{ borderBottom: `1px solid ${colors.gray100}` }}>
                                <td style={{ padding: "10px 0" }}>
                                    <span style={{ fontSize: "13px", color: colors.gray800 }}>{item.description || "Item"}</span>
                                    {item.discountPercent > 0 && (
                                        <span style={{ marginLeft: "8px", fontSize: "11px", color: colors.gray400 }}>
                                            {item.discountPercent}% off
                                        </span>
                                    )}
                                </td>
                                <td style={{ padding: "10px 0", textAlign: "center", fontSize: "13px", color: colors.gray600 }}>{item.quantity}</td>
                                <td style={{ padding: "10px 0", textAlign: "right", fontSize: "13px", color: colors.gray600 }}>{formatCurrency(item.unitPrice, details.currency)}</td>
                                <td style={{ padding: "10px 0", textAlign: "right", fontSize: "13px", fontWeight: 600, color: colors.gray800 }}>{formatCurrency(item.quantity * item.unitPrice, details.currency)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Totals */}
                <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "50px" }}>
                    <div style={{ width: "220px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: "4px", fontSize: "13px" }}>
                            <span style={{ color: colors.gray500 }}>Subtotal</span>
                            <span style={{ color: colors.gray800 }}>{formatCurrency(subtotal, details.currency)}</span>
                        </div>
                        {totalDiscount > 0 && (
                            <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: "4px", fontSize: "13px" }}>
                                <span style={{ color: colors.gray500 }}>Discount</span>
                                <span style={{ color: colors.green600 }}>-{formatCurrency(totalDiscount, details.currency)}</span>
                            </div>
                        )}
                        {totalTax > 0 && (
                            <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: "6px 0", fontSize: "13px" }}>
                                <span style={{ color: colors.gray500 }}>{taxRateDisplay ? `VAT (${taxRateDisplay}%)` : "VAT"}</span>
                                <span style={{ color: colors.gray800 }}>{formatCurrency(totalTax, details.currency)}</span>
                            </div>
                        )}
                        <div style={{ paddingTop: "8px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <span style={{ fontSize: "12px", fontWeight: 600, color: colors.gray600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                                    {type === "invoice" ? "Amount Due" : "Total"}
                                </span>
                                <span style={{ fontSize: "18px", fontWeight: 700, color: colors.gray900 }}>{formatCurrency(grandTotal, details.currency)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Notes & Terms */}
                {(details.notes || details.terms) && (
                    <div>
                        {details.notes && (
                            <p style={{ margin: "0 0 12px", fontSize: "12px", color: colors.gray600, lineHeight: 1.6, letterSpacing: "0.01em", wordSpacing: "0.1em", whiteSpace: "pre-line" }}>{details.notes}</p>
                        )}
                        {details.terms && (
                            <div style={{ marginTop: "12px" }}>
                                <p style={{ margin: "0 0 8px", fontSize: "10px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: colors.gray400 }}>Terms & Conditions</p>
                                <p style={{ margin: 0, fontSize: "11px", color: colors.gray500, lineHeight: 1.8, letterSpacing: "0.05em", wordSpacing: "0.10em", whiteSpace: "pre-line" }}>{details.terms}</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

// ============================================================================
// MODERN TEMPLATE - Contemporary with bold header
// ============================================================================
function ModernTemplate({ document, color, subtotal, totalDiscount, totalTax, grandTotal, taxRateDisplay }: TemplateProps) {
    const { type, business, client, details, items, customTemplate } = document;
    const lightBg = lightenColor(color, 0.94);

    return (
        <div
            id="document-preview"
            style={{
                position: "relative",
                backgroundColor: colors.white,
                boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                overflow: "hidden",
                width: "595px",
                minHeight: "842px",
                fontFamily: fontStack,
            }}
        >
            {/* Watermark */}
            {customTemplate && (
                <div style={{ position: "absolute", top: "55%", left: "50%", transform: "translate(-50%, -50%)", width: "50%", maxHeight: "40%", zIndex: 1, pointerEvents: "none" }}>
                    <img src={customTemplate} alt="" style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", opacity: 0.04, filter: "grayscale(50%)" }} />
                </div>
            )}

            {/* Header */}
            <div style={{ position: "relative", zIndex: 10, padding: "48px 52px 36px", backgroundColor: color }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
                        {business.logo && (
                            <div style={{ width: "54px", height: "54px", backgroundColor: "rgba(255,255,255,0.15)", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <img src={business.logo} alt="" style={{ width: "40px", height: "40px", objectFit: "contain" }} />
                            </div>
                        )}
                        <div>
                            <h1 style={{ margin: 0, fontSize: "20px", fontWeight: 600, color: colors.white, letterSpacing: "-0.01em" }}>{business.name || "Your Business"}</h1>
                            {business.email && <p style={{ margin: "6px 0 0", fontSize: "13px", color: "rgba(255,255,255,0.75)" }}>{business.email}</p>}
                        </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                        <p style={{ margin: 0, fontSize: "34px", fontWeight: 700, color: colors.white, letterSpacing: "-0.02em" }}>
                            {type === "invoice" ? "INVOICE" : "QUOTE"}
                        </p>
                        <p style={{ margin: "6px 0 0", fontSize: "15px", color: "rgba(255,255,255,0.85)" }}>#{details.documentNumber}</p>
                    </div>
                </div>
            </div>

            <div style={{ position: "relative", zIndex: 10, padding: "44px 52px" }}>
                {/* Info Cards */}
                <div style={{ display: "flex", gap: "28px", marginBottom: "44px" }}>
                    <div style={{ flex: 1, padding: "26px 24px", backgroundColor: lightBg, borderRadius: "14px" }}>
                        <p style={{ margin: "0 0 16px", fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color }}>Bill To</p>
                        <p style={{ margin: 0, fontSize: "16px", fontWeight: 600, color: colors.gray900, lineHeight: 1.4 }}>{client.name || "Client Name"}</p>
                        {client.company && <p style={{ margin: "6px 0 0", fontSize: "14px", color: colors.gray600, lineHeight: 1.5 }}>{client.company}</p>}
                        {client.address && <p style={{ margin: "12px 0 0", fontSize: "13px", color: colors.gray500, whiteSpace: "pre-line", lineHeight: 1.7 }}>{client.address}</p>}
                        {client.email && <p style={{ margin: "6px 0 0", fontSize: "13px", color: colors.gray500 }}>{client.email}</p>}
                    </div>
                    <div style={{ width: "200px", padding: "26px 24px", backgroundColor: colors.gray50, borderRadius: "14px" }}>
                        <p style={{ margin: "0 0 16px", fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: colors.gray400 }}>Details</p>
                        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                            <div>
                                <p style={{ margin: 0, fontSize: "11px", color: colors.gray400, fontWeight: 500 }}>Issue Date</p>
                                <p style={{ margin: "4px 0 0", fontSize: "14px", fontWeight: 500, color: colors.gray800 }}>{formatDate(details.issueDate)}</p>
                            </div>
                            {type === "invoice" && details.dueDate && (
                                <div>
                                    <p style={{ margin: 0, fontSize: "11px", color: colors.gray400, fontWeight: 500 }}>Due Date</p>
                                    <p style={{ margin: "4px 0 0", fontSize: "14px", fontWeight: 500, color: colors.gray800 }}>{formatDate(details.dueDate)}</p>
                                </div>
                            )}
                            {type === "quotation" && details.validUntil && (
                                <div>
                                    <p style={{ margin: 0, fontSize: "11px", color: colors.gray400, fontWeight: 500 }}>Valid Until</p>
                                    <p style={{ margin: "4px 0 0", fontSize: "14px", fontWeight: 500, color: colors.gray800 }}>{formatDate(details.validUntil)}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Table */}
                <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "40px" }}>
                    <thead>
                        <tr>
                            <th style={{ padding: "16px 18px", textAlign: "left", fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color, backgroundColor: lightBg, borderRadius: "10px 0 0 10px" }}>Description</th>
                            <th style={{ padding: "16px 18px", textAlign: "center", fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color, backgroundColor: lightBg, width: "70px" }}>Qty</th>
                            <th style={{ padding: "16px 18px", textAlign: "right", fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color, backgroundColor: lightBg, width: "110px" }}>Rate</th>
                            <th style={{ padding: "16px 18px", textAlign: "right", fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color, backgroundColor: lightBg, borderRadius: "0 10px 10px 0", width: "110px" }}>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item, i) => (
                            <tr key={item.id}>
                                <td style={{ padding: "20px 18px", fontSize: "14px", color: colors.gray800, borderBottom: i < items.length - 1 ? `1px solid ${colors.gray100}` : "none", lineHeight: 1.5 }}>{item.description || "Item"}</td>
                                <td style={{ padding: "20px 18px", textAlign: "center", fontSize: "14px", color: colors.gray600, borderBottom: i < items.length - 1 ? `1px solid ${colors.gray100}` : "none" }}>{item.quantity}</td>
                                <td style={{ padding: "20px 18px", textAlign: "right", fontSize: "14px", color: colors.gray600, borderBottom: i < items.length - 1 ? `1px solid ${colors.gray100}` : "none" }}>{formatCurrency(item.unitPrice, details.currency)}</td>
                                <td style={{ padding: "20px 18px", textAlign: "right", fontSize: "14px", fontWeight: 600, color: colors.gray800, borderBottom: i < items.length - 1 ? `1px solid ${colors.gray100}` : "none" }}>{formatCurrency(item.quantity * item.unitPrice, details.currency)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Totals */}
                <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "48px" }}>
                    <div style={{ width: "300px", overflow: "hidden", borderRadius: "14px", backgroundColor: colors.gray50 }}>
                        <div style={{ padding: "22px 24px", display: "flex", flexDirection: "column", gap: "14px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px" }}>
                                <span style={{ color: colors.gray500 }}>Subtotal</span>
                                <span style={{ color: colors.gray800, fontWeight: 500 }}>{formatCurrency(subtotal, details.currency)}</span>
                            </div>
                            {totalDiscount > 0 && (
                                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px" }}>
                                    <span style={{ color: colors.gray500 }}>Discount</span>
                                    <span style={{ color: colors.green600, fontWeight: 500 }}>-{formatCurrency(totalDiscount, details.currency)}</span>
                                </div>
                            )}
                            {totalTax > 0 && (
                                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px" }}>
                                    <span style={{ color: colors.gray500 }}>{taxRateDisplay ? `VAT (${taxRateDisplay}%)` : "VAT"}</span>
                                    <span style={{ color: colors.gray800, fontWeight: 500 }}>{formatCurrency(totalTax, details.currency)}</span>
                                </div>
                            )}
                        </div>
                        <div style={{ padding: "20px 24px", borderTop: `2px solid ${colors.gray200}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <span style={{ fontSize: "13px", fontWeight: 600, color: colors.gray600, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                                {type === "invoice" ? "Total Due" : "Total"}
                            </span>
                            <span style={{ fontSize: "24px", fontWeight: 700, color: colors.gray900 }}>{formatCurrency(grandTotal, details.currency)}</span>
                        </div>
                    </div>
                </div>

                {/* Notes */}
                {(details.notes || details.terms) && (
                    <div style={{ marginBottom: "36px" }}>
                        {details.notes && <p style={{ margin: "0 0 20px", fontSize: "13px", color: colors.gray600, lineHeight: 1.7, whiteSpace: "pre-line" }}>{details.notes}</p>}
                        {details.terms && (
                            <div style={{ padding: "20px", backgroundColor: colors.gray50, borderRadius: "10px" }}>
                                <p style={{ margin: "0 0 10px", fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: colors.gray400 }}>Terms</p>
                                <p style={{ margin: 0, fontSize: "12px", color: colors.gray500, lineHeight: 1.7, whiteSpace: "pre-line" }}>{details.terms}</p>
                            </div>
                        )}
                    </div>
                )}

            </div>
        </div>
    );
}

// ============================================================================
// MINIMALIST TEMPLATE - Clean and elegant with generous whitespace
// ============================================================================
function MinimalistTemplate({ document, color, subtotal, totalDiscount, totalTax, grandTotal, taxRateDisplay }: TemplateProps) {
    const { type, business, client, details, items, customTemplate } = document;

    return (
        <div
            id="document-preview"
            style={{
                position: "relative",
                backgroundColor: colors.white,
                boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                width: "595px",
                minHeight: "842px",
                fontFamily: fontStack,
            }}
        >
            {/* Watermark */}
            {customTemplate && (
                <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "45%", maxHeight: "40%", zIndex: 0, pointerEvents: "none" }}>
                    <img src={customTemplate} alt="" style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", opacity: 0.04, filter: "grayscale(60%)" }} />
                </div>
            )}

            <div style={{ position: "relative", zIndex: 10, padding: "64px 60px 52px" }}>
                {/* Header - Ultra minimal */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "56px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                        {business.logo && <img src={business.logo} alt="" style={{ width: "44px", height: "44px", objectFit: "contain" }} />}
                        <span style={{ fontSize: "18px", fontWeight: 500, color: colors.gray800, letterSpacing: "-0.01em" }}>{business.name || "Your Business"}</span>
                    </div>
                    <div style={{ textAlign: "right" }}>
                        <span style={{ fontSize: "11px", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.15em", color }}>
                            {type === "invoice" ? "Invoice" : "Quotation"}
                        </span>
                        <p style={{ margin: "8px 0 0", fontSize: "15px", fontWeight: 500, color: colors.gray600 }}>{details.documentNumber}</p>
                    </div>
                </div>

                {/* Single accent line */}
                <div style={{ height: "2px", backgroundColor: color, marginBottom: "52px" }} />

                {/* Two column info */}
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "52px" }}>
                    <div style={{ maxWidth: "260px" }}>
                        <p style={{ margin: "0 0 14px", fontSize: "10px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.14em", color }}>Billed To</p>
                        <p style={{ margin: 0, fontSize: "16px", fontWeight: 500, color: colors.gray800, lineHeight: 1.4 }}>{client.name || "Client Name"}</p>
                        {client.company && <p style={{ margin: "6px 0 0", fontSize: "14px", color: colors.gray500, lineHeight: 1.5 }}>{client.company}</p>}
                        {client.address && <p style={{ margin: "12px 0 0", fontSize: "13px", color: colors.gray400, whiteSpace: "pre-line", lineHeight: 1.8 }}>{client.address}</p>}
                        {client.email && <p style={{ margin: "8px 0 0", fontSize: "13px", color: colors.gray400 }}>{client.email}</p>}
                        {client.phone && <p style={{ margin: "4px 0 0", fontSize: "13px", color: colors.gray400 }}>{client.phone}</p>}
                    </div>
                    <div style={{ textAlign: "right" }}>
                        <div style={{ marginBottom: "24px" }}>
                            <p style={{ margin: 0, fontSize: "10px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.14em", color }}>Date</p>
                            <p style={{ margin: "8px 0 0", fontSize: "15px", fontWeight: 500, color: colors.gray700 }}>{formatDate(details.issueDate)}</p>
                        </div>
                        {type === "invoice" && details.dueDate && (
                            <div>
                                <p style={{ margin: 0, fontSize: "10px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.14em", color }}>Due</p>
                                <p style={{ margin: "8px 0 0", fontSize: "15px", fontWeight: 500, color: colors.gray700 }}>{formatDate(details.dueDate)}</p>
                            </div>
                        )}
                        {type === "quotation" && details.validUntil && (
                            <div>
                                <p style={{ margin: 0, fontSize: "10px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.14em", color }}>Valid Until</p>
                                <p style={{ margin: "8px 0 0", fontSize: "15px", fontWeight: 500, color: colors.gray700 }}>{formatDate(details.validUntil)}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Clean table */}
                <div style={{ marginBottom: "48px" }}>
                    <div style={{ display: "flex", padding: "0 0 16px", borderBottom: `2px solid ${color}` }}>
                        <span style={{ flex: 1, fontSize: "10px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.14em", color }}>Description</span>
                        <span style={{ width: "70px", fontSize: "10px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.14em", color, textAlign: "center" }}>Qty</span>
                        <span style={{ width: "100px", fontSize: "10px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.14em", color, textAlign: "right" }}>Rate</span>
                        <span style={{ width: "100px", fontSize: "10px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.14em", color, textAlign: "right" }}>Amount</span>
                    </div>
                    {items.map((item, i) => (
                        <div key={item.id} style={{ display: "flex", padding: "20px 0", borderBottom: i < items.length - 1 ? `1px solid ${colors.gray100}` : "none", alignItems: "center" }}>
                            <span style={{ flex: 1, fontSize: "14px", color: colors.gray700, lineHeight: 1.5 }}>{item.description || "Item"}</span>
                            <span style={{ width: "70px", fontSize: "14px", color: colors.gray500, textAlign: "center" }}>{item.quantity}</span>
                            <span style={{ width: "100px", fontSize: "14px", color: colors.gray500, textAlign: "right" }}>{formatCurrency(item.unitPrice, details.currency)}</span>
                            <span style={{ width: "100px", fontSize: "14px", fontWeight: 500, color: colors.gray800, textAlign: "right" }}>{formatCurrency(item.quantity * item.unitPrice, details.currency)}</span>
                        </div>
                    ))}
                </div>

                {/* Totals */}
                <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "52px" }}>
                    <div style={{ width: "260px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", fontSize: "14px" }}>
                            <span style={{ color: colors.gray500 }}>Subtotal</span>
                            <span style={{ color: colors.gray700, fontWeight: 500 }}>{formatCurrency(subtotal, details.currency)}</span>
                        </div>
                        {totalDiscount > 0 && (
                            <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", fontSize: "14px" }}>
                                <span style={{ color: colors.gray500 }}>Discount</span>
                                <span style={{ color: colors.green600, fontWeight: 500 }}>-{formatCurrency(totalDiscount, details.currency)}</span>
                            </div>
                        )}
                        {totalTax > 0 && (
                            <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", fontSize: "14px" }}>
                                <span style={{ color: colors.gray500 }}>{taxRateDisplay ? `VAT (${taxRateDisplay}%)` : "VAT"}</span>
                                <span style={{ color: colors.gray700, fontWeight: 500 }}>{formatCurrency(totalTax, details.currency)}</span>
                            </div>
                        )}
                        <div style={{ height: "2px", backgroundColor: colors.gray200, margin: "16px 0" }} />
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <span style={{ fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: colors.gray600 }}>{type === "invoice" ? "Total Due" : "Total"}</span>
                            <span style={{ fontSize: "24px", fontWeight: 600, color: colors.gray900, letterSpacing: "-0.02em" }}>{formatCurrency(grandTotal, details.currency)}</span>
                        </div>
                    </div>
                </div>

                {/* Notes & Terms */}
                {(details.notes || details.terms) && (
                    <div style={{ paddingTop: "36px", borderTop: `1px solid ${colors.gray100}`, marginBottom: "36px" }}>
                        {details.notes && <p style={{ margin: "0 0 20px", fontSize: "13px", color: colors.gray500, lineHeight: 1.8, whiteSpace: "pre-line" }}>{details.notes}</p>}
                        {details.terms && (
                            <div>
                                <p style={{ margin: "0 0 10px", fontSize: "10px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.14em", color }}>Terms</p>
                                <p style={{ margin: 0, fontSize: "12px", color: colors.gray400, lineHeight: 1.8, whiteSpace: "pre-line" }}>{details.terms}</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

// ============================================================================
// CORPORATE TEMPLATE - Professional sidebar layout with generous spacing
// ============================================================================
function CorporateTemplate({ document, color, subtotal, totalDiscount, totalTax, grandTotal, taxRateDisplay }: TemplateProps) {
    const { type, business, client, details, items, customTemplate } = document;

    return (
        <div
            id="document-preview"
            style={{
                position: "relative",
                backgroundColor: colors.white,
                boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                display: "flex",
                overflow: "hidden",
                width: "595px",
                minHeight: "842px",
                fontFamily: fontStack,
            }}
        >
            {/* Watermark - positioned in content area */}
            {customTemplate && (
                <div style={{ position: "absolute", top: "50%", left: "62%", transform: "translate(-50%, -50%)", width: "40%", maxHeight: "38%", zIndex: 0, pointerEvents: "none" }}>
                    <img src={customTemplate} alt="" style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", opacity: 0.04, filter: "grayscale(50%)" }} />
                </div>
            )}

            {/* Sidebar - Wider for better spacing */}
            <div style={{ position: "relative", zIndex: 10, width: "190px", padding: "44px 24px", color: colors.white, backgroundColor: color }}>
                <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
                    {/* Logo */}
                    {business.logo && (
                        <div style={{ marginBottom: "24px", width: "56px", height: "56px", backgroundColor: "rgba(255,255,255,0.12)", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <img src={business.logo} alt="" style={{ width: "40px", height: "40px", objectFit: "contain" }} />
                        </div>
                    )}

                    {/* Business Name */}
                    <h1 style={{ margin: 0, fontSize: "16px", fontWeight: 600, lineHeight: 1.4, letterSpacing: "-0.01em" }}>{business.name || "Your Business"}</h1>

                    {/* Business Info */}
                    <div style={{ marginTop: "20px", display: "flex", flexDirection: "column", gap: "10px", fontSize: "11px", opacity: 0.9, lineHeight: 1.5 }}>
                        {business.address && <p style={{ margin: 0, whiteSpace: "pre-line" }}>{business.address}</p>}
                        {business.email && <p style={{ margin: 0, wordBreak: "break-word", overflowWrap: "break-word" }}>{business.email}</p>}
                        {business.phone && <p style={{ margin: 0 }}>{business.phone}</p>}
                        {business.website && <p style={{ margin: 0, wordBreak: "break-word", overflowWrap: "break-word" }}>{business.website}</p>}
                        {business.taxId && <p style={{ margin: 0 }}>Tax: {business.taxId}</p>}
                    </div>

                    {/* Document Type */}
                    <div style={{ marginTop: "auto", paddingTop: "32px" }}>
                        <p style={{ margin: 0, fontSize: "9px", textTransform: "uppercase", letterSpacing: "0.12em", opacity: 0.6 }}>Document</p>
                        <p style={{ margin: "8px 0 0", fontSize: "22px", fontWeight: 700, letterSpacing: "-0.02em" }}>{type === "invoice" ? "Invoice" : "Quote"}</p>
                        <p style={{ margin: "4px 0 0", fontSize: "12px", opacity: 0.85 }}>{details.documentNumber}</p>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div style={{ position: "relative", zIndex: 10, flex: 1, padding: "44px 36px" }}>
                {/* Client & Dates - Side by side */}
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "40px" }}>
                    <div style={{ maxWidth: "220px" }}>
                        <p style={{ margin: "0 0 12px", fontSize: "10px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.12em", color }}>Bill To</p>
                        <p style={{ margin: 0, fontSize: "15px", fontWeight: 600, color: colors.gray900, lineHeight: 1.4 }}>{client.name || "Client Name"}</p>
                        {client.company && <p style={{ margin: "4px 0 0", fontSize: "13px", color: colors.gray600, lineHeight: 1.5 }}>{client.company}</p>}
                        {client.address && <p style={{ margin: "10px 0 0", fontSize: "12px", color: colors.gray500, whiteSpace: "pre-line", lineHeight: 1.6 }}>{client.address}</p>}
                        {client.email && <p style={{ margin: "6px 0 0", fontSize: "12px", color: colors.gray500 }}>{client.email}</p>}
                    </div>
                    <div style={{ textAlign: "right" }}>
                        <div style={{ marginBottom: "14px" }}>
                            <p style={{ margin: 0, fontSize: "9px", color: colors.gray400, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.08em" }}>Issue Date</p>
                            <p style={{ margin: "3px 0 0", fontSize: "13px", fontWeight: 500, color: colors.gray800 }}>{formatDate(details.issueDate)}</p>
                        </div>
                        {type === "invoice" && details.dueDate && (
                            <div style={{ marginBottom: "14px" }}>
                                <p style={{ margin: 0, fontSize: "9px", color: colors.gray400, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.08em" }}>Due Date</p>
                                <p style={{ margin: "3px 0 0", fontSize: "13px", fontWeight: 500, color: colors.gray800 }}>{formatDate(details.dueDate)}</p>
                            </div>
                        )}
                        {type === "quotation" && details.validUntil && (
                            <div>
                                <p style={{ margin: 0, fontSize: "9px", color: colors.gray400, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.08em" }}>Valid Until</p>
                                <p style={{ margin: "3px 0 0", fontSize: "13px", fontWeight: 500, color: colors.gray800 }}>{formatDate(details.validUntil)}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Table */}
                <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "32px" }}>
                    <thead>
                        <tr style={{ borderBottom: `2px solid ${color}` }}>
                            <th style={{ padding: "12px 0", textAlign: "left", fontSize: "9px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color }}>Item</th>
                            <th style={{ padding: "12px 0", textAlign: "center", fontSize: "9px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color, width: "50px" }}>Qty</th>
                            <th style={{ padding: "12px 0", textAlign: "right", fontSize: "9px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color, width: "85px" }}>Rate</th>
                            <th style={{ padding: "12px 0", textAlign: "right", fontSize: "9px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color, width: "85px" }}>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item, i) => (
                            <tr key={item.id} style={{ borderBottom: i < items.length - 1 ? `1px solid ${colors.gray100}` : "none" }}>
                                <td style={{ padding: "14px 0", fontSize: "13px", color: colors.gray700, lineHeight: 1.5 }}>{item.description || "Item"}</td>
                                <td style={{ padding: "14px 0", textAlign: "center", fontSize: "13px", color: colors.gray500 }}>{item.quantity}</td>
                                <td style={{ padding: "14px 0", textAlign: "right", fontSize: "13px", color: colors.gray500 }}>{formatCurrency(item.unitPrice, details.currency)}</td>
                                <td style={{ padding: "14px 0", textAlign: "right", fontSize: "13px", fontWeight: 600, color: colors.gray800 }}>{formatCurrency(item.quantity * item.unitPrice, details.currency)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Totals */}
                <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "36px" }}>
                    <div style={{ width: "200px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", fontSize: "13px" }}>
                            <span style={{ color: colors.gray500 }}>Subtotal</span>
                            <span style={{ color: colors.gray800, fontWeight: 500 }}>{formatCurrency(subtotal, details.currency)}</span>
                        </div>
                        {totalDiscount > 0 && (
                            <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", fontSize: "13px" }}>
                                <span style={{ color: colors.gray500 }}>Discount</span>
                                <span style={{ color: colors.green600, fontWeight: 500 }}>-{formatCurrency(totalDiscount, details.currency)}</span>
                            </div>
                        )}
                        {totalTax > 0 && (
                            <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", fontSize: "13px" }}>
                                <span style={{ color: colors.gray500 }}>{taxRateDisplay ? `VAT (${taxRateDisplay}%)` : "VAT"}</span>
                                <span style={{ color: colors.gray800, fontWeight: 500 }}>{formatCurrency(totalTax, details.currency)}</span>
                            </div>
                        )}
                        <div style={{ marginTop: "10px", paddingTop: "12px", borderTop: `2px solid ${colors.gray200}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <span style={{ fontSize: "10px", fontWeight: 600, color: colors.gray600, textTransform: "uppercase", letterSpacing: "0.06em" }}>Total</span>
                            <span style={{ fontSize: "20px", fontWeight: 700, color: colors.gray900, letterSpacing: "-0.02em" }}>{formatCurrency(grandTotal, details.currency)}</span>
                        </div>
                    </div>
                </div>

                {/* Notes & Terms */}
                {(details.notes || details.terms) && (
                    <div style={{ paddingTop: "24px", borderTop: `1px solid ${colors.gray100}` }}>
                        {details.notes && <p style={{ margin: "0 0 14px", fontSize: "12px", color: colors.gray600, lineHeight: 1.6, whiteSpace: "pre-line" }}>{details.notes}</p>}
                        {details.terms && (
                            <div>
                                <p style={{ margin: "0 0 6px", fontSize: "9px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color }}>Terms</p>
                                <p style={{ margin: 0, fontSize: "11px", color: colors.gray500, lineHeight: 1.6, whiteSpace: "pre-line" }}>{details.terms}</p>
                            </div>
                        )}
                    </div>
                )}

            </div>
        </div>
    );
}

// ============================================================================
// CREATIVE TEMPLATE - Bold, expressive design with refined spacing
// ============================================================================
function CreativeTemplate({ document, color, subtotal, totalDiscount, totalTax, grandTotal, taxRateDisplay }: TemplateProps) {
    const { type, business, client, details, items, customTemplate } = document;
    const lightBg = lightenColor(color, 0.95);

    return (
        <div
            id="document-preview"
            style={{
                position: "relative",
                backgroundColor: colors.white,
                boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                overflow: "hidden",
                width: "595px",
                minHeight: "842px",
                fontFamily: fontStack,
            }}
        >
            {/* Large watermark text or custom image */}
            {customTemplate ? (
                <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%) rotate(-12deg)", width: "50%", maxHeight: "40%", zIndex: 1, pointerEvents: "none" }}>
                    <img src={customTemplate} alt="" style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", opacity: 0.04, filter: "grayscale(30%)" }} />
                </div>
            ) : (
                <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%) rotate(-12deg)", pointerEvents: "none", zIndex: 1 }}>
                    <span style={{ fontSize: "120px", fontWeight: 900, textTransform: "uppercase", color, opacity: 0.03, letterSpacing: "-0.02em" }}>
                        {type === "invoice" ? "INVOICE" : "QUOTE"}
                    </span>
                </div>
            )}

            <div style={{ position: "relative", zIndex: 10, padding: "56px 52px" }}>
                {/* Header */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "48px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
                        {business.logo && (
                            <div style={{ width: "58px", height: "58px", borderRadius: "50%", backgroundColor: lightBg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <img src={business.logo} alt="" style={{ width: "40px", height: "40px", objectFit: "contain" }} />
                            </div>
                        )}
                        <div>
                            <h1 style={{ margin: 0, fontSize: "20px", fontWeight: 700, color: colors.gray900, letterSpacing: "-0.02em", lineHeight: 1.3 }}>{business.name || "Your Business"}</h1>
                            {business.email && <p style={{ margin: "6px 0 0", fontSize: "13px", color: colors.gray500 }}>{business.email}</p>}
                        </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                        <div style={{ display: "inline-block", padding: "12px 24px", borderRadius: "28px", backgroundColor: color }}>
                            <span style={{ fontSize: "14px", fontWeight: 700, color: colors.white, textTransform: "uppercase", letterSpacing: "0.1em" }}>
                                {type === "invoice" ? "Invoice" : "Quote"}
                            </span>
                        </div>
                        <p style={{ margin: "14px 0 0", fontSize: "16px", fontWeight: 600, color: colors.gray700, fontFamily: "monospace" }}>{details.documentNumber}</p>
                    </div>
                </div>

                {/* Info panels with accent borders */}
                <div style={{ display: "flex", gap: "32px", marginBottom: "48px" }}>
                    <div style={{ flex: 1, paddingLeft: "20px", borderLeft: `4px solid ${color}` }}>
                        <p style={{ margin: "0 0 14px", fontSize: "10px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.14em", color }}>Bill To</p>
                        <p style={{ margin: 0, fontSize: "16px", fontWeight: 600, color: colors.gray900, lineHeight: 1.4 }}>{client.name || "Client Name"}</p>
                        {client.company && <p style={{ margin: "6px 0 0", fontSize: "14px", color: colors.gray600, lineHeight: 1.5 }}>{client.company}</p>}
                        {client.address && <p style={{ margin: "12px 0 0", fontSize: "13px", color: colors.gray500, whiteSpace: "pre-line", lineHeight: 1.7 }}>{client.address}</p>}
                    </div>
                    <div style={{ width: "180px", paddingLeft: "20px", borderLeft: `4px solid ${color}` }}>
                        <p style={{ margin: "0 0 14px", fontSize: "10px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.14em", color }}>Details</p>
                        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                            <p style={{ margin: 0, fontSize: "13px", lineHeight: 1.6 }}>
                                <span style={{ color: colors.gray400 }}>Issued: </span>
                                <span style={{ fontWeight: 500, color: colors.gray700 }}>{formatDate(details.issueDate)}</span>
                            </p>
                            {type === "invoice" && details.dueDate && (
                                <p style={{ margin: 0, fontSize: "13px", lineHeight: 1.6 }}>
                                    <span style={{ color: colors.gray400 }}>Due: </span>
                                    <span style={{ fontWeight: 500, color: colors.gray700 }}>{formatDate(details.dueDate)}</span>
                                </p>
                            )}
                            {type === "quotation" && details.validUntil && (
                                <p style={{ margin: 0, fontSize: "13px", lineHeight: 1.6 }}>
                                    <span style={{ color: colors.gray400 }}>Valid: </span>
                                    <span style={{ fontWeight: 500, color: colors.gray700 }}>{formatDate(details.validUntil)}</span>
                                </p>
                            )}
                            {details.poNumber && (
                                <p style={{ margin: 0, fontSize: "13px", lineHeight: 1.6 }}>
                                    <span style={{ color: colors.gray400 }}>PO: </span>
                                    <span style={{ fontWeight: 500, color: colors.gray700 }}>{details.poNumber}</span>
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Table with subtle rounded border */}
                <div style={{ marginBottom: "40px", borderRadius: "14px", overflow: "hidden", border: `1px solid ${colors.gray200}` }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                            <tr style={{ backgroundColor: color }}>
                                <th style={{ padding: "18px 20px", textAlign: "left", fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: colors.white }}>Description</th>
                                <th style={{ padding: "18px 20px", textAlign: "center", fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: colors.white, width: "70px" }}>Qty</th>
                                <th style={{ padding: "18px 20px", textAlign: "right", fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: colors.white, width: "100px" }}>Rate</th>
                                <th style={{ padding: "18px 20px", textAlign: "right", fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: colors.white, width: "100px" }}>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item, i) => (
                                <tr key={item.id} style={{ backgroundColor: i % 2 === 0 ? colors.white : colors.gray50 }}>
                                    <td style={{ padding: "18px 20px", fontSize: "14px", color: colors.gray700, lineHeight: 1.5 }}>{item.description || "Item"}</td>
                                    <td style={{ padding: "18px 20px", textAlign: "center", fontSize: "14px", color: colors.gray500 }}>{item.quantity}</td>
                                    <td style={{ padding: "18px 20px", textAlign: "right", fontSize: "14px", color: colors.gray500 }}>{formatCurrency(item.unitPrice, details.currency)}</td>
                                    <td style={{ padding: "18px 20px", textAlign: "right", fontSize: "14px", fontWeight: 600, color }}>{formatCurrency(item.quantity * item.unitPrice, details.currency)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Totals card */}
                <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "48px" }}>
                    <div style={{ width: "280px", borderRadius: "14px", overflow: "hidden", backgroundColor: colors.gray50 }}>
                        <div style={{ padding: "22px 24px", display: "flex", flexDirection: "column", gap: "14px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px" }}>
                                <span style={{ color: colors.gray500 }}>Subtotal</span>
                                <span style={{ fontWeight: 500, color: colors.gray800 }}>{formatCurrency(subtotal, details.currency)}</span>
                            </div>
                            {totalDiscount > 0 && (
                                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px" }}>
                                    <span style={{ color: colors.gray500 }}>Discount</span>
                                    <span style={{ fontWeight: 500, color: colors.green600 }}>-{formatCurrency(totalDiscount, details.currency)}</span>
                                </div>
                            )}
                            {totalTax > 0 && (
                                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px" }}>
                                    <span style={{ color: colors.gray500 }}>{taxRateDisplay ? `VAT (${taxRateDisplay}%)` : "VAT"}</span>
                                    <span style={{ fontWeight: 500, color: colors.gray800 }}>{formatCurrency(totalTax, details.currency)}</span>
                                </div>
                            )}
                        </div>
                        <div style={{ padding: "20px 24px", borderTop: `2px solid ${colors.gray200}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <span style={{ fontSize: "12px", fontWeight: 600, color: colors.gray600, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                                {type === "invoice" ? "Total Due" : "Total"}
                            </span>
                            <span style={{ fontSize: "24px", fontWeight: 800, color: colors.gray900, letterSpacing: "-0.02em" }}>{formatCurrency(grandTotal, details.currency)}</span>
                        </div>
                    </div>
                </div>

                {/* Notes & Terms */}
                {(details.notes || details.terms) && (
                    <div style={{ marginBottom: "40px" }}>
                        {details.notes && <p style={{ margin: "0 0 20px", fontSize: "13px", color: colors.gray600, lineHeight: 1.8, whiteSpace: "pre-line" }}>{details.notes}</p>}
                        {details.terms && (
                            <div style={{ paddingLeft: "16px", borderLeft: `3px solid ${color}` }}>
                                <p style={{ margin: "0 0 8px", fontSize: "10px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.12em", color }}>Terms</p>
                                <p style={{ margin: 0, fontSize: "12px", color: colors.gray500, lineHeight: 1.8, whiteSpace: "pre-line" }}>{details.terms}</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

// ==================== SIMPLE CLEAN TEMPLATE ====================
function SimpleCleanTemplate({ document, color, subtotal, totalDiscount, totalTax, grandTotal, taxRateDisplay }: TemplateProps) {
    const { type, business, client, details, items } = document;
    const docLabel = type === "invoice" ? "INVOICE" : "QUOTATION";

    return (
        <div id="document-preview" style={{ fontFamily: fontStack, width: "595px", minHeight: "800px", backgroundColor: colors.white, padding: "40px 48px", boxSizing: "border-box" }}>
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "40px" }}>
                <div>
                    <h1 style={{ margin: 0, fontSize: "36px", fontWeight: 700, color, letterSpacing: "0.05em" }}>{docLabel}</h1>
                    <p style={{ margin: "8px 0 0", fontSize: "13px", color: colors.gray500 }}>#{details.documentNumber}</p>
                </div>
                <div style={{ textAlign: "right" }}>
                    {business.name && <p style={{ margin: 0, fontSize: "16px", fontWeight: 600, color: colors.gray800 }}>{business.name}</p>}
                    {business.address && <p style={{ margin: "4px 0 0", fontSize: "12px", color: colors.gray500, whiteSpace: "pre-line" }}>{business.address}</p>}
                    {business.email && <p style={{ margin: "4px 0 0", fontSize: "12px", color: colors.gray500 }}>{business.email}</p>}
                </div>
            </div>

            {/* Bill To & Dates */}
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "32px", paddingBottom: "24px", borderBottom: `1px solid ${colors.gray200}` }}>
                <div>
                    <p style={{ margin: "0 0 8px", fontSize: "11px", fontWeight: 600, color: colors.gray400, textTransform: "uppercase", letterSpacing: "0.1em" }}>Bill To</p>
                    {client.name && <p style={{ margin: 0, fontSize: "14px", fontWeight: 600, color: colors.gray800 }}>{client.name}</p>}
                    {client.address && <p style={{ margin: "4px 0 0", fontSize: "12px", color: colors.gray500, whiteSpace: "pre-line" }}>{client.address}</p>}
                    {client.email && <p style={{ margin: "4px 0 0", fontSize: "12px", color: colors.gray500 }}>{client.email}</p>}
                </div>
                <div style={{ textAlign: "right" }}>
                    <div style={{ marginBottom: "12px" }}>
                        <p style={{ margin: 0, fontSize: "11px", fontWeight: 600, color: colors.gray400, textTransform: "uppercase" }}>Date</p>
                        <p style={{ margin: "4px 0 0", fontSize: "13px", color: colors.gray700 }}>{details.issueDate}</p>
                    </div>
                    <div>
                        <p style={{ margin: 0, fontSize: "11px", fontWeight: 600, color: colors.gray400, textTransform: "uppercase" }}>Due Date</p>
                        <p style={{ margin: "4px 0 0", fontSize: "13px", color: colors.gray700 }}>{details.dueDate}</p>
                    </div>
                </div>
            </div>

            {/* Items Table */}
            <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "32px" }}>
                <thead>
                    <tr>
                        <th style={{ textAlign: "left", padding: "12px 0", fontSize: "11px", fontWeight: 600, color: colors.gray400, textTransform: "uppercase", borderBottom: `2px solid ${color}` }}>Description</th>
                        <th style={{ textAlign: "center", padding: "12px 0", fontSize: "11px", fontWeight: 600, color: colors.gray400, textTransform: "uppercase", borderBottom: `2px solid ${color}` }}>Qty</th>
                        <th style={{ textAlign: "right", padding: "12px 0", fontSize: "11px", fontWeight: 600, color: colors.gray400, textTransform: "uppercase", borderBottom: `2px solid ${color}` }}>Rate</th>
                        <th style={{ textAlign: "right", padding: "12px 0", fontSize: "11px", fontWeight: 600, color: colors.gray400, textTransform: "uppercase", borderBottom: `2px solid ${color}` }}>Amount</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item, i) => (
                        <tr key={item.id}>
                            <td style={{ padding: "14px 0", fontSize: "13px", color: colors.gray700, borderBottom: `1px solid ${colors.gray100}` }}>{item.description || "Item"}</td>
                            <td style={{ padding: "14px 0", textAlign: "center", fontSize: "13px", color: colors.gray500, borderBottom: `1px solid ${colors.gray100}` }}>{item.quantity}</td>
                            <td style={{ padding: "14px 0", textAlign: "right", fontSize: "13px", color: colors.gray500, borderBottom: `1px solid ${colors.gray100}` }}>{formatCurrency(item.unitPrice, details.currency)}</td>
                            <td style={{ padding: "14px 0", textAlign: "right", fontSize: "13px", fontWeight: 600, color: colors.gray800, borderBottom: `1px solid ${colors.gray100}` }}>{formatCurrency(item.quantity * item.unitPrice, details.currency)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Totals */}
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "40px" }}>
                <div style={{ width: "240px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", fontSize: "13px" }}>
                        <span style={{ color: colors.gray500 }}>Subtotal</span>
                        <span style={{ color: colors.gray700 }}>{formatCurrency(subtotal, details.currency)}</span>
                    </div>
                    {totalDiscount > 0 && (
                        <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", fontSize: "13px" }}>
                            <span style={{ color: colors.gray500 }}>Discount</span>
                            <span style={{ color: colors.green600 }}>-{formatCurrency(totalDiscount, details.currency)}</span>
                        </div>
                    )}
                    {totalTax > 0 && (
                        <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", fontSize: "13px" }}>
                            <span style={{ color: colors.gray500 }}>{taxRateDisplay ? `VAT (${taxRateDisplay}%)` : "VAT"}</span>
                            <span style={{ color: colors.gray700 }}>{formatCurrency(totalTax, details.currency)}</span>
                        </div>
                    )}
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "16px 0", marginTop: "8px", borderTop: `2px solid ${color}` }}>
                        <span style={{ fontSize: "14px", fontWeight: 600, color: colors.gray800 }}>Total</span>
                        <span style={{ fontSize: "18px", fontWeight: 700, color }}>{formatCurrency(grandTotal, details.currency)}</span>
                    </div>
                </div>
            </div>

            {/* Notes & Terms */}
            {(details.notes || details.terms) && (
                <div style={{ paddingTop: "24px", borderTop: `1px solid ${colors.gray200}` }}>
                    {details.notes && <p style={{ margin: "0 0 12px", fontSize: "12px", color: colors.gray600, lineHeight: 1.7, whiteSpace: "pre-line" }}>{details.notes}</p>}
                    {details.terms && <p style={{ margin: 0, fontSize: "11px", color: colors.gray400, lineHeight: 1.7, whiteSpace: "pre-line" }}>{details.terms}</p>}
                </div>
            )}
        </div>
    );
}

// ==================== SIGNATURE TEMPLATE ====================
function SignatureTemplate({ document, color, subtotal, totalDiscount, totalTax, grandTotal, taxRateDisplay }: TemplateProps) {
    const { type, business, client, details, items } = document;
    const docLabel = type === "invoice" ? "Invoice" : "Quotation";

    return (
        <div id="document-preview" style={{ fontFamily: fontStack, width: "595px", minHeight: "800px", backgroundColor: colors.white, padding: "48px", boxSizing: "border-box" }}>
            {/* Header with elegant styling */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "48px" }}>
                <div>
                    {business.name && <p style={{ margin: "0 0 4px", fontSize: "20px", fontWeight: 600, color: colors.gray800 }}>{business.name}</p>}
                    {business.address && <p style={{ margin: 0, fontSize: "11px", color: colors.gray500, whiteSpace: "pre-line" }}>{business.address}</p>}
                </div>
                <div style={{ textAlign: "right" }}>
                    <h1 style={{ margin: 0, fontSize: "28px", fontWeight: 300, color: colors.gray800, letterSpacing: "0.15em", textTransform: "uppercase" }}>{docLabel}</h1>
                    <p style={{ margin: "8px 0 0", fontSize: "12px", color: colors.gray500 }}>#{details.documentNumber}</p>
                </div>
            </div>

            {/* Client & Dates */}
            <div style={{ display: "flex", gap: "48px", marginBottom: "36px" }}>
                <div style={{ flex: 1 }}>
                    <p style={{ margin: "0 0 8px", fontSize: "10px", fontWeight: 600, color, textTransform: "uppercase", letterSpacing: "0.15em" }}>Billed To</p>
                    {client.name && <p style={{ margin: 0, fontSize: "14px", fontWeight: 500, color: colors.gray800 }}>{client.name}</p>}
                    {client.address && <p style={{ margin: "4px 0 0", fontSize: "12px", color: colors.gray500, whiteSpace: "pre-line" }}>{client.address}</p>}
                </div>
                <div>
                    <p style={{ margin: "0 0 4px", fontSize: "11px", color: colors.gray400 }}>Date: <span style={{ color: colors.gray700 }}>{details.issueDate}</span></p>
                    <p style={{ margin: 0, fontSize: "11px", color: colors.gray400 }}>Due: <span style={{ color: colors.gray700 }}>{details.dueDate}</span></p>
                </div>
            </div>

            {/* Items */}
            <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "32px" }}>
                <thead>
                    <tr style={{ borderBottom: `1px solid ${colors.gray200}` }}>
                        <th style={{ textAlign: "left", padding: "12px 0", fontSize: "10px", fontWeight: 600, color: colors.gray400, textTransform: "uppercase", letterSpacing: "0.1em" }}>Item</th>
                        <th style={{ textAlign: "center", padding: "12px 0", fontSize: "10px", fontWeight: 600, color: colors.gray400, textTransform: "uppercase", letterSpacing: "0.1em" }}>Qty</th>
                        <th style={{ textAlign: "right", padding: "12px 0", fontSize: "10px", fontWeight: 600, color: colors.gray400, textTransform: "uppercase", letterSpacing: "0.1em" }}>Price</th>
                        <th style={{ textAlign: "right", padding: "12px 0", fontSize: "10px", fontWeight: 600, color: colors.gray400, textTransform: "uppercase", letterSpacing: "0.1em" }}>Total</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item) => (
                        <tr key={item.id} style={{ borderBottom: `1px solid ${colors.gray100}` }}>
                            <td style={{ padding: "14px 0", fontSize: "13px", color: colors.gray700 }}>{item.description || "Item"}</td>
                            <td style={{ padding: "14px 0", textAlign: "center", fontSize: "13px", color: colors.gray500 }}>{item.quantity}</td>
                            <td style={{ padding: "14px 0", textAlign: "right", fontSize: "13px", color: colors.gray500 }}>{formatCurrency(item.unitPrice, details.currency)}</td>
                            <td style={{ padding: "14px 0", textAlign: "right", fontSize: "13px", fontWeight: 500, color: colors.gray800 }}>{formatCurrency(item.quantity * item.unitPrice, details.currency)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Totals */}
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "48px" }}>
                <div style={{ width: "220px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", fontSize: "12px", color: colors.gray500 }}>
                        <span>Subtotal</span>
                        <span>{formatCurrency(subtotal, details.currency)}</span>
                    </div>
                    {totalDiscount > 0 && (
                        <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", fontSize: "12px" }}>
                            <span style={{ color: colors.gray500 }}>Discount</span>
                            <span style={{ color: colors.green600 }}>-{formatCurrency(totalDiscount, details.currency)}</span>
                        </div>
                    )}
                    {totalTax > 0 && (
                        <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", fontSize: "12px" }}>
                            <span style={{ color: colors.gray500 }}>{taxRateDisplay ? `VAT (${taxRateDisplay}%)` : "VAT"}</span>
                            <span style={{ color: colors.gray700 }}>{formatCurrency(totalTax, details.currency)}</span>
                        </div>
                    )}
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "14px 0", marginTop: "8px", borderTop: `1px solid ${colors.gray300}` }}>
                        <span style={{ fontSize: "13px", fontWeight: 600, color: colors.gray700 }}>Total Due</span>
                        <span style={{ fontSize: "16px", fontWeight: 600, color: colors.gray900 }}>{formatCurrency(grandTotal, details.currency)}</span>
                    </div>
                </div>
            </div>

            {/* Signature area */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: "auto", paddingTop: "32px" }}>
                <div>
                    {details.notes && <p style={{ margin: "0 0 16px", fontSize: "12px", color: colors.gray500, lineHeight: 1.7, maxWidth: "280px", whiteSpace: "pre-line" }}>{details.notes}</p>}
                    {details.terms && <p style={{ margin: 0, fontSize: "10px", color: colors.gray400, lineHeight: 1.6, maxWidth: "280px", whiteSpace: "pre-line" }}>{details.terms}</p>}
                </div>
                <div style={{ textAlign: "center" }}>
                    <div style={{ width: "180px", borderBottom: `1px solid ${colors.gray300}`, marginBottom: "8px", paddingBottom: "40px" }}></div>
                    <p style={{ margin: 0, fontSize: "10px", color: colors.gray400, textTransform: "uppercase", letterSpacing: "0.1em" }}>Authorized Signature</p>
                </div>
            </div>
        </div>
    );
}

// ==================== TOTAL HIGHLIGHT TEMPLATE ====================
function TotalHighlightTemplate({ document, color, subtotal, totalDiscount, totalTax, grandTotal, taxRateDisplay }: TemplateProps) {
    const { type, business, client, details, items } = document;
    const docLabel = type === "invoice" ? "INVOICE" : "QUOTATION";

    return (
        <div id="document-preview" style={{ fontFamily: fontStack, width: "595px", minHeight: "800px", backgroundColor: colors.white, padding: "40px", boxSizing: "border-box" }}>
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "32px" }}>
                <div>
                    {business.name && <h2 style={{ margin: 0, fontSize: "22px", fontWeight: 700, color: colors.gray800 }}>{business.name}</h2>}
                    {business.address && <p style={{ margin: "8px 0 0", fontSize: "11px", color: colors.gray500, whiteSpace: "pre-line" }}>{business.address}</p>}
                </div>
                {/* Total highlight box */}
                <div style={{ backgroundColor: color, padding: "20px 28px", borderRadius: "8px", textAlign: "center" }}>
                    <p style={{ margin: 0, fontSize: "10px", color: colors.white, textTransform: "uppercase", letterSpacing: "0.1em", opacity: 0.9 }}>{docLabel} Total</p>
                    <p style={{ margin: "8px 0 0", fontSize: "26px", fontWeight: 700, color: colors.white }}>{formatCurrency(grandTotal, details.currency)}</p>
                </div>
            </div>

            {/* Doc info line */}
            <div style={{ display: "flex", gap: "32px", marginBottom: "28px", paddingBottom: "20px", borderBottom: `1px solid ${colors.gray200}` }}>
                <div>
                    <p style={{ margin: 0, fontSize: "10px", color: colors.gray400, textTransform: "uppercase" }}>{docLabel} #</p>
                    <p style={{ margin: "4px 0 0", fontSize: "13px", fontWeight: 600, color: colors.gray700 }}>{details.documentNumber}</p>
                </div>
                <div>
                    <p style={{ margin: 0, fontSize: "10px", color: colors.gray400, textTransform: "uppercase" }}>Issue Date</p>
                    <p style={{ margin: "4px 0 0", fontSize: "13px", color: colors.gray700 }}>{details.issueDate}</p>
                </div>
                <div>
                    <p style={{ margin: 0, fontSize: "10px", color: colors.gray400, textTransform: "uppercase" }}>Due Date</p>
                    <p style={{ margin: "4px 0 0", fontSize: "13px", color: colors.gray700 }}>{details.dueDate}</p>
                </div>
            </div>

            {/* Bill To */}
            <div style={{ marginBottom: "28px" }}>
                <p style={{ margin: "0 0 8px", fontSize: "10px", fontWeight: 600, color, textTransform: "uppercase", letterSpacing: "0.1em" }}>Bill To</p>
                {client.name && <p style={{ margin: 0, fontSize: "14px", fontWeight: 600, color: colors.gray800 }}>{client.name}</p>}
                {client.address && <p style={{ margin: "4px 0 0", fontSize: "12px", color: colors.gray500, whiteSpace: "pre-line" }}>{client.address}</p>}
                {client.email && <p style={{ margin: "4px 0 0", fontSize: "12px", color: colors.gray500 }}>{client.email}</p>}
            </div>

            {/* Items */}
            <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "28px" }}>
                <thead>
                    <tr style={{ backgroundColor: colors.gray50 }}>
                        <th style={{ textAlign: "left", padding: "12px 16px", fontSize: "10px", fontWeight: 600, color: colors.gray500, textTransform: "uppercase" }}>Description</th>
                        <th style={{ textAlign: "center", padding: "12px 16px", fontSize: "10px", fontWeight: 600, color: colors.gray500, textTransform: "uppercase" }}>Qty</th>
                        <th style={{ textAlign: "right", padding: "12px 16px", fontSize: "10px", fontWeight: 600, color: colors.gray500, textTransform: "uppercase" }}>Rate</th>
                        <th style={{ textAlign: "right", padding: "12px 16px", fontSize: "10px", fontWeight: 600, color: colors.gray500, textTransform: "uppercase" }}>Amount</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item) => (
                        <tr key={item.id} style={{ borderBottom: `1px solid ${colors.gray100}` }}>
                            <td style={{ padding: "14px 16px", fontSize: "13px", color: colors.gray700 }}>{item.description || "Item"}</td>
                            <td style={{ padding: "14px 16px", textAlign: "center", fontSize: "13px", color: colors.gray500 }}>{item.quantity}</td>
                            <td style={{ padding: "14px 16px", textAlign: "right", fontSize: "13px", color: colors.gray500 }}>{formatCurrency(item.unitPrice, details.currency)}</td>
                            <td style={{ padding: "14px 16px", textAlign: "right", fontSize: "13px", fontWeight: 600, color: colors.gray800 }}>{formatCurrency(item.quantity * item.unitPrice, details.currency)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Totals */}
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "32px" }}>
                <div style={{ width: "220px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", fontSize: "12px" }}>
                        <span style={{ color: colors.gray500 }}>Subtotal</span>
                        <span style={{ color: colors.gray700 }}>{formatCurrency(subtotal, details.currency)}</span>
                    </div>
                    {totalDiscount > 0 && (
                        <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", fontSize: "12px" }}>
                            <span style={{ color: colors.gray500 }}>Discount</span>
                            <span style={{ color: colors.green600 }}>-{formatCurrency(totalDiscount, details.currency)}</span>
                        </div>
                    )}
                    {totalTax > 0 && (
                        <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", fontSize: "12px" }}>
                            <span style={{ color: colors.gray500 }}>{taxRateDisplay ? `VAT (${taxRateDisplay}%)` : "VAT"}</span>
                            <span style={{ color: colors.gray700 }}>{formatCurrency(totalTax, details.currency)}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Notes & Terms */}
            {(details.notes || details.terms) && (
                <div style={{ paddingTop: "20px", borderTop: `1px solid ${colors.gray200}` }}>
                    {details.notes && <p style={{ margin: "0 0 12px", fontSize: "12px", color: colors.gray600, lineHeight: 1.7, whiteSpace: "pre-line" }}>{details.notes}</p>}
                    {details.terms && <p style={{ margin: 0, fontSize: "10px", color: colors.gray400, lineHeight: 1.6, whiteSpace: "pre-line" }}>{details.terms}</p>}
                </div>
            )}
        </div>
    );
}

// ==================== BLUE BANNER TEMPLATE ====================
function BlueBannerTemplate({ document, color, subtotal, totalDiscount, totalTax, grandTotal, taxRateDisplay }: TemplateProps) {
    const { type, business, client, details, items } = document;
    const docLabel = type === "invoice" ? "INVOICE" : "QUOTATION";

    return (
        <div id="document-preview" style={{ fontFamily: fontStack, width: "595px", minHeight: "800px", backgroundColor: colors.white, boxSizing: "border-box" }}>
            {/* Top banner */}
            <div style={{ backgroundColor: color, padding: "28px 40px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                    {business.name && <h2 style={{ margin: 0, fontSize: "20px", fontWeight: 600, color: colors.white }}>{business.name}</h2>}
                </div>
                <h1 style={{ margin: 0, fontSize: "24px", fontWeight: 700, color: colors.white, letterSpacing: "0.1em" }}>{docLabel}</h1>
            </div>

            <div style={{ padding: "32px 40px" }}>
                {/* Info row */}
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "32px" }}>
                    <div>
                        <p style={{ margin: "0 0 8px", fontSize: "10px", fontWeight: 600, color: colors.gray400, textTransform: "uppercase" }}>Bill To</p>
                        {client.name && <p style={{ margin: 0, fontSize: "14px", fontWeight: 600, color: colors.gray800 }}>{client.name}</p>}
                        {client.address && <p style={{ margin: "4px 0 0", fontSize: "12px", color: colors.gray500, whiteSpace: "pre-line" }}>{client.address}</p>}
                    </div>
                    <div style={{ textAlign: "right" }}>
                        <p style={{ margin: "0 0 4px", fontSize: "12px", color: colors.gray500 }}>{docLabel} #: <span style={{ fontWeight: 600, color: colors.gray700 }}>{details.documentNumber}</span></p>
                        <p style={{ margin: "0 0 4px", fontSize: "12px", color: colors.gray500 }}>Date: <span style={{ color: colors.gray700 }}>{details.issueDate}</span></p>
                        <p style={{ margin: 0, fontSize: "12px", color: colors.gray500 }}>Due: <span style={{ color: colors.gray700 }}>{details.dueDate}</span></p>
                    </div>
                </div>

                {/* Items */}
                <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "28px" }}>
                    <thead>
                        <tr style={{ borderBottom: `2px solid ${color}` }}>
                            <th style={{ textAlign: "left", padding: "12px 0", fontSize: "11px", fontWeight: 600, color: colors.gray600, textTransform: "uppercase" }}>Item</th>
                            <th style={{ textAlign: "center", padding: "12px 0", fontSize: "11px", fontWeight: 600, color: colors.gray600, textTransform: "uppercase" }}>Qty</th>
                            <th style={{ textAlign: "right", padding: "12px 0", fontSize: "11px", fontWeight: 600, color: colors.gray600, textTransform: "uppercase" }}>Rate</th>
                            <th style={{ textAlign: "right", padding: "12px 0", fontSize: "11px", fontWeight: 600, color: colors.gray600, textTransform: "uppercase" }}>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item, i) => (
                            <tr key={item.id} style={{ backgroundColor: i % 2 === 1 ? colors.gray50 : "transparent" }}>
                                <td style={{ padding: "14px 0", fontSize: "13px", color: colors.gray700 }}>{item.description || "Item"}</td>
                                <td style={{ padding: "14px 0", textAlign: "center", fontSize: "13px", color: colors.gray500 }}>{item.quantity}</td>
                                <td style={{ padding: "14px 0", textAlign: "right", fontSize: "13px", color: colors.gray500 }}>{formatCurrency(item.unitPrice, details.currency)}</td>
                                <td style={{ padding: "14px 0", textAlign: "right", fontSize: "13px", fontWeight: 600, color: colors.gray800 }}>{formatCurrency(item.quantity * item.unitPrice, details.currency)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Totals */}
                <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "32px" }}>
                    <div style={{ width: "240px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", fontSize: "13px" }}>
                            <span style={{ color: colors.gray500 }}>Subtotal</span>
                            <span style={{ color: colors.gray700 }}>{formatCurrency(subtotal, details.currency)}</span>
                        </div>
                        {totalDiscount > 0 && (
                            <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", fontSize: "13px" }}>
                                <span style={{ color: colors.gray500 }}>Discount</span>
                                <span style={{ color: colors.green600 }}>-{formatCurrency(totalDiscount, details.currency)}</span>
                            </div>
                        )}
                        {totalTax > 0 && (
                            <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", fontSize: "13px" }}>
                                <span style={{ color: colors.gray500 }}>{taxRateDisplay ? `VAT (${taxRateDisplay}%)` : "VAT"}</span>
                                <span style={{ color: colors.gray700 }}>{formatCurrency(totalTax, details.currency)}</span>
                            </div>
                        )}
                        <div style={{ display: "flex", justifyContent: "space-between", padding: "14px 16px", marginTop: "8px", backgroundColor: color, borderRadius: "6px" }}>
                            <span style={{ fontSize: "13px", fontWeight: 600, color: colors.white }}>Total Due</span>
                            <span style={{ fontSize: "18px", fontWeight: 700, color: colors.white }}>{formatCurrency(grandTotal, details.currency)}</span>
                        </div>
                    </div>
                </div>

                {/* Thank you message */}
                <div style={{ textAlign: "center", padding: "24px 0", borderTop: `1px solid ${colors.gray200}` }}>
                    <p style={{ margin: 0, fontSize: "16px", fontWeight: 500, color }}>Thank you for your business!</p>
                </div>

                {/* Notes & Terms */}
                {(details.notes || details.terms) && (
                    <div style={{ paddingTop: "16px" }}>
                        {details.notes && <p style={{ margin: "0 0 12px", fontSize: "12px", color: colors.gray600, lineHeight: 1.7, whiteSpace: "pre-line" }}>{details.notes}</p>}
                        {details.terms && <p style={{ margin: 0, fontSize: "10px", color: colors.gray400, lineHeight: 1.6, whiteSpace: "pre-line" }}>{details.terms}</p>}
                    </div>
                )}
            </div>
        </div>
    );
}

// ==================== WATERCOLOR TEMPLATE ====================
function WatercolorTemplate({ document, color, subtotal, totalDiscount, totalTax, grandTotal, taxRateDisplay }: TemplateProps) {
    const { type, business, client, details, items } = document;
    const docLabel = type === "invoice" ? "Invoice" : "Quotation";
    const lightColor = lightenColor(color, 0.85);

    return (
        <div id="document-preview" style={{ fontFamily: fontStack, width: "595px", minHeight: "800px", backgroundColor: colors.white, padding: "40px", boxSizing: "border-box", position: "relative" }}>
            {/* Watercolor effect header */}
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "120px", background: `linear-gradient(180deg, ${lightColor} 0%, transparent 100%)`, opacity: 0.7 }}></div>

            <div style={{ position: "relative", zIndex: 1 }}>
                {/* Header */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "48px" }}>
                    <div>
                        <h1 style={{ margin: 0, fontSize: "32px", fontWeight: 300, color, fontStyle: "italic" }}>{docLabel}</h1>
                        <p style={{ margin: "8px 0 0", fontSize: "12px", color: colors.gray500 }}>#{details.documentNumber}</p>
                    </div>
                    <div style={{ textAlign: "right" }}>
                        {business.name && <p style={{ margin: 0, fontSize: "18px", fontWeight: 600, color: colors.gray800 }}>{business.name}</p>}
                        {business.email && <p style={{ margin: "4px 0 0", fontSize: "11px", color: colors.gray500 }}>{business.email}</p>}
                    </div>
                </div>

                {/* Info */}
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "36px" }}>
                    <div>
                        <p style={{ margin: "0 0 8px", fontSize: "10px", fontWeight: 600, color, textTransform: "uppercase", letterSpacing: "0.15em" }}>Bill To</p>
                        {client.name && <p style={{ margin: 0, fontSize: "14px", fontWeight: 500, color: colors.gray800 }}>{client.name}</p>}
                        {client.address && <p style={{ margin: "4px 0 0", fontSize: "12px", color: colors.gray500, whiteSpace: "pre-line" }}>{client.address}</p>}
                    </div>
                    <div style={{ textAlign: "right" }}>
                        <p style={{ margin: "0 0 4px", fontSize: "11px", color: colors.gray400 }}>Date: {details.issueDate}</p>
                        <p style={{ margin: 0, fontSize: "11px", color: colors.gray400 }}>Due: {details.dueDate}</p>
                    </div>
                </div>

                {/* Items */}
                <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "32px" }}>
                    <thead>
                        <tr>
                            <th style={{ textAlign: "left", padding: "14px 0", fontSize: "10px", fontWeight: 600, color, textTransform: "uppercase", letterSpacing: "0.1em", borderBottom: `2px solid ${lightColor}` }}>Description</th>
                            <th style={{ textAlign: "center", padding: "14px 0", fontSize: "10px", fontWeight: 600, color, textTransform: "uppercase", letterSpacing: "0.1em", borderBottom: `2px solid ${lightColor}` }}>Qty</th>
                            <th style={{ textAlign: "right", padding: "14px 0", fontSize: "10px", fontWeight: 600, color, textTransform: "uppercase", letterSpacing: "0.1em", borderBottom: `2px solid ${lightColor}` }}>Price</th>
                            <th style={{ textAlign: "right", padding: "14px 0", fontSize: "10px", fontWeight: 600, color, textTransform: "uppercase", letterSpacing: "0.1em", borderBottom: `2px solid ${lightColor}` }}>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item) => (
                            <tr key={item.id}>
                                <td style={{ padding: "14px 0", fontSize: "13px", color: colors.gray700, borderBottom: `1px solid ${colors.gray100}` }}>{item.description || "Item"}</td>
                                <td style={{ padding: "14px 0", textAlign: "center", fontSize: "13px", color: colors.gray500, borderBottom: `1px solid ${colors.gray100}` }}>{item.quantity}</td>
                                <td style={{ padding: "14px 0", textAlign: "right", fontSize: "13px", color: colors.gray500, borderBottom: `1px solid ${colors.gray100}` }}>{formatCurrency(item.unitPrice, details.currency)}</td>
                                <td style={{ padding: "14px 0", textAlign: "right", fontSize: "13px", fontWeight: 500, color: colors.gray800, borderBottom: `1px solid ${colors.gray100}` }}>{formatCurrency(item.quantity * item.unitPrice, details.currency)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Totals */}
                <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "40px" }}>
                    <div style={{ width: "220px", backgroundColor: lightColor, padding: "20px", borderRadius: "12px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", fontSize: "12px" }}>
                            <span style={{ color: colors.gray600 }}>Subtotal</span>
                            <span style={{ color: colors.gray700 }}>{formatCurrency(subtotal, details.currency)}</span>
                        </div>
                        {totalDiscount > 0 && (
                            <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", fontSize: "12px" }}>
                                <span style={{ color: colors.gray600 }}>Discount</span>
                                <span style={{ color: colors.green600 }}>-{formatCurrency(totalDiscount, details.currency)}</span>
                            </div>
                        )}
                        {totalTax > 0 && (
                            <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", fontSize: "12px" }}>
                                <span style={{ color: colors.gray600 }}>{taxRateDisplay ? `VAT (${taxRateDisplay}%)` : "VAT"}</span>
                                <span style={{ color: colors.gray700 }}>{formatCurrency(totalTax, details.currency)}</span>
                            </div>
                        )}
                        <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", marginTop: "8px", borderTop: `1px solid ${color}` }}>
                            <span style={{ fontSize: "13px", fontWeight: 600, color }}>Total</span>
                            <span style={{ fontSize: "18px", fontWeight: 700, color }}>{formatCurrency(grandTotal, details.currency)}</span>
                        </div>
                    </div>
                </div>

                {/* Notes & Terms */}
                {(details.notes || details.terms) && (
                    <div>
                        {details.notes && <p style={{ margin: "0 0 16px", fontSize: "12px", color: colors.gray600, lineHeight: 1.7, fontStyle: "italic", whiteSpace: "pre-line" }}>{details.notes}</p>}
                        {details.terms && <p style={{ margin: 0, fontSize: "10px", color: colors.gray400, lineHeight: 1.6, whiteSpace: "pre-line" }}>{details.terms}</p>}
                    </div>
                )}
            </div>
        </div>
    );
}

// ==================== SIDEBAR TEMPLATE ====================
function SidebarTemplate({ document, color, subtotal, totalDiscount, totalTax, grandTotal, taxRateDisplay }: TemplateProps) {
    const { type, business, client, details, items } = document;
    const docLabel = type === "invoice" ? "INVOICE" : "QUOTATION";

    return (
        <div id="document-preview" style={{ fontFamily: fontStack, width: "595px", minHeight: "800px", backgroundColor: colors.white, display: "flex", boxSizing: "border-box" }}>
            {/* Left sidebar */}
            <div style={{ width: "50px", backgroundColor: color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <p style={{ margin: 0, fontSize: "14px", fontWeight: 700, color: colors.white, letterSpacing: "0.2em", writingMode: "vertical-rl", textOrientation: "mixed", transform: "rotate(180deg)" }}>
                    {docLabel} #{details.documentNumber}
                </p>
            </div>

            {/* Main content */}
            <div style={{ flex: 1, padding: "40px" }}>
                {/* Header */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "36px" }}>
                    <div>
                        {business.name && <h2 style={{ margin: 0, fontSize: "20px", fontWeight: 700, color: colors.gray800 }}>{business.name}</h2>}
                        {business.address && <p style={{ margin: "8px 0 0", fontSize: "11px", color: colors.gray500, whiteSpace: "pre-line" }}>{business.address}</p>}
                        {business.email && <p style={{ margin: "4px 0 0", fontSize: "11px", color: colors.gray500 }}>{business.email}</p>}
                    </div>
                    <div style={{ textAlign: "right" }}>
                        <p style={{ margin: 0, fontSize: "11px", color: colors.gray400 }}>Date: <span style={{ color: colors.gray700 }}>{details.issueDate}</span></p>
                        <p style={{ margin: "4px 0 0", fontSize: "11px", color: colors.gray400 }}>Due: <span style={{ color: colors.gray700 }}>{details.dueDate}</span></p>
                    </div>
                </div>

                {/* Bill To */}
                <div style={{ marginBottom: "28px", paddingBottom: "20px", borderBottom: `1px solid ${colors.gray200}` }}>
                    <p style={{ margin: "0 0 8px", fontSize: "10px", fontWeight: 600, color, textTransform: "uppercase", letterSpacing: "0.1em" }}>Bill To</p>
                    {client.name && <p style={{ margin: 0, fontSize: "14px", fontWeight: 600, color: colors.gray800 }}>{client.name}</p>}
                    {client.address && <p style={{ margin: "4px 0 0", fontSize: "12px", color: colors.gray500, whiteSpace: "pre-line" }}>{client.address}</p>}
                </div>

                {/* Items */}
                <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "28px" }}>
                    <thead>
                        <tr style={{ borderBottom: `2px solid ${colors.gray200}` }}>
                            <th style={{ textAlign: "left", padding: "10px 0", fontSize: "10px", fontWeight: 600, color: colors.gray500, textTransform: "uppercase" }}>Description</th>
                            <th style={{ textAlign: "center", padding: "10px 0", fontSize: "10px", fontWeight: 600, color: colors.gray500, textTransform: "uppercase" }}>Qty</th>
                            <th style={{ textAlign: "right", padding: "10px 0", fontSize: "10px", fontWeight: 600, color: colors.gray500, textTransform: "uppercase" }}>Rate</th>
                            <th style={{ textAlign: "right", padding: "10px 0", fontSize: "10px", fontWeight: 600, color: colors.gray500, textTransform: "uppercase" }}>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item) => (
                            <tr key={item.id} style={{ borderBottom: `1px solid ${colors.gray100}` }}>
                                <td style={{ padding: "12px 0", fontSize: "12px", color: colors.gray700 }}>{item.description || "Item"}</td>
                                <td style={{ padding: "12px 0", textAlign: "center", fontSize: "12px", color: colors.gray500 }}>{item.quantity}</td>
                                <td style={{ padding: "12px 0", textAlign: "right", fontSize: "12px", color: colors.gray500 }}>{formatCurrency(item.unitPrice, details.currency)}</td>
                                <td style={{ padding: "12px 0", textAlign: "right", fontSize: "12px", fontWeight: 600, color: colors.gray800 }}>{formatCurrency(item.quantity * item.unitPrice, details.currency)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Totals */}
                <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "32px" }}>
                    <div style={{ width: "200px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", fontSize: "12px" }}>
                            <span style={{ color: colors.gray500 }}>Subtotal</span>
                            <span style={{ color: colors.gray700 }}>{formatCurrency(subtotal, details.currency)}</span>
                        </div>
                        {totalDiscount > 0 && (
                            <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", fontSize: "12px" }}>
                                <span style={{ color: colors.gray500 }}>Discount</span>
                                <span style={{ color: colors.green600 }}>-{formatCurrency(totalDiscount, details.currency)}</span>
                            </div>
                        )}
                        {totalTax > 0 && (
                            <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", fontSize: "12px" }}>
                                <span style={{ color: colors.gray500 }}>{taxRateDisplay ? `VAT (${taxRateDisplay}%)` : "VAT"}</span>
                                <span style={{ color: colors.gray700 }}>{formatCurrency(totalTax, details.currency)}</span>
                            </div>
                        )}
                        <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", marginTop: "8px", borderTop: `2px solid ${color}` }}>
                            <span style={{ fontSize: "12px", fontWeight: 600, color: colors.gray700 }}>Total</span>
                            <span style={{ fontSize: "16px", fontWeight: 700, color }}>{formatCurrency(grandTotal, details.currency)}</span>
                        </div>
                    </div>
                </div>

                {/* Notes & Terms */}
                {(details.notes || details.terms) && (
                    <div style={{ paddingTop: "16px", borderTop: `1px solid ${colors.gray200}` }}>
                        {details.notes && <p style={{ margin: "0 0 12px", fontSize: "11px", color: colors.gray600, lineHeight: 1.7, whiteSpace: "pre-line" }}>{details.notes}</p>}
                        {details.terms && <p style={{ margin: 0, fontSize: "10px", color: colors.gray400, lineHeight: 1.6, whiteSpace: "pre-line" }}>{details.terms}</p>}
                    </div>
                )}
            </div>
        </div>
    );
}

// ==================== BLUE ACCENT TEMPLATE ====================
function BlueAccentTemplate({ document, color, subtotal, totalDiscount, totalTax, grandTotal, taxRateDisplay }: TemplateProps) {
    const { type, business, client, details, items } = document;
    const docLabel = type === "invoice" ? "Invoice" : "Quotation";

    return (
        <div id="document-preview" style={{ fontFamily: fontStack, width: "595px", minHeight: "800px", backgroundColor: colors.white, padding: "40px 48px", boxSizing: "border-box" }}>
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "40px", paddingBottom: "20px", borderBottom: `3px solid ${color}` }}>
                <div>
                    {business.name && <h2 style={{ margin: 0, fontSize: "22px", fontWeight: 700, color: colors.gray800 }}>{business.name}</h2>}
                    {business.address && <p style={{ margin: "8px 0 0", fontSize: "11px", color: colors.gray500, whiteSpace: "pre-line" }}>{business.address}</p>}
                </div>
                <div style={{ textAlign: "right" }}>
                    <h1 style={{ margin: 0, fontSize: "28px", fontWeight: 700, color }}>{docLabel}</h1>
                    <p style={{ margin: "4px 0 0", fontSize: "13px", color: colors.gray500 }}>#{details.documentNumber}</p>
                </div>
            </div>

            {/* Info boxes */}
            <div style={{ display: "flex", gap: "24px", marginBottom: "32px" }}>
                <div style={{ flex: 1, padding: "16px", backgroundColor: colors.gray50, borderRadius: "8px", borderLeft: `4px solid ${color}` }}>
                    <p style={{ margin: "0 0 6px", fontSize: "10px", fontWeight: 600, color: colors.gray400, textTransform: "uppercase" }}>Bill To</p>
                    {client.name && <p style={{ margin: 0, fontSize: "13px", fontWeight: 600, color: colors.gray800 }}>{client.name}</p>}
                    {client.address && <p style={{ margin: "4px 0 0", fontSize: "11px", color: colors.gray500, whiteSpace: "pre-line" }}>{client.address}</p>}
                </div>
                <div style={{ padding: "16px", backgroundColor: colors.gray50, borderRadius: "8px" }}>
                    <div style={{ marginBottom: "10px" }}>
                        <p style={{ margin: 0, fontSize: "10px", fontWeight: 600, color: colors.gray400, textTransform: "uppercase" }}>Date</p>
                        <p style={{ margin: "2px 0 0", fontSize: "13px", color: colors.gray700 }}>{details.issueDate}</p>
                    </div>
                    <div>
                        <p style={{ margin: 0, fontSize: "10px", fontWeight: 600, color: colors.gray400, textTransform: "uppercase" }}>Due Date</p>
                        <p style={{ margin: "2px 0 0", fontSize: "13px", color: colors.gray700 }}>{details.dueDate}</p>
                    </div>
                </div>
            </div>

            {/* Items */}
            <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "28px" }}>
                <thead>
                    <tr style={{ backgroundColor: color }}>
                        <th style={{ textAlign: "left", padding: "12px 16px", fontSize: "11px", fontWeight: 600, color: colors.white, textTransform: "uppercase" }}>Description</th>
                        <th style={{ textAlign: "center", padding: "12px 16px", fontSize: "11px", fontWeight: 600, color: colors.white, textTransform: "uppercase" }}>Qty</th>
                        <th style={{ textAlign: "right", padding: "12px 16px", fontSize: "11px", fontWeight: 600, color: colors.white, textTransform: "uppercase" }}>Rate</th>
                        <th style={{ textAlign: "right", padding: "12px 16px", fontSize: "11px", fontWeight: 600, color: colors.white, textTransform: "uppercase" }}>Amount</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item, i) => (
                        <tr key={item.id} style={{ backgroundColor: i % 2 === 0 ? colors.white : colors.gray50 }}>
                            <td style={{ padding: "14px 16px", fontSize: "13px", color: colors.gray700 }}>{item.description || "Item"}</td>
                            <td style={{ padding: "14px 16px", textAlign: "center", fontSize: "13px", color: colors.gray500 }}>{item.quantity}</td>
                            <td style={{ padding: "14px 16px", textAlign: "right", fontSize: "13px", color: colors.gray500 }}>{formatCurrency(item.unitPrice, details.currency)}</td>
                            <td style={{ padding: "14px 16px", textAlign: "right", fontSize: "13px", fontWeight: 600, color: colors.gray800 }}>{formatCurrency(item.quantity * item.unitPrice, details.currency)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Totals */}
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "36px" }}>
                <div style={{ width: "240px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", fontSize: "13px" }}>
                        <span style={{ color: colors.gray500 }}>Subtotal</span>
                        <span style={{ color: colors.gray700 }}>{formatCurrency(subtotal, details.currency)}</span>
                    </div>
                    {totalDiscount > 0 && (
                        <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", fontSize: "13px" }}>
                            <span style={{ color: colors.gray500 }}>Discount</span>
                            <span style={{ color: colors.green600 }}>-{formatCurrency(totalDiscount, details.currency)}</span>
                        </div>
                    )}
                    {totalTax > 0 && (
                        <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", fontSize: "13px" }}>
                            <span style={{ color: colors.gray500 }}>{taxRateDisplay ? `VAT (${taxRateDisplay}%)` : "VAT"}</span>
                            <span style={{ color: colors.gray700 }}>{formatCurrency(totalTax, details.currency)}</span>
                        </div>
                    )}
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "14px", marginTop: "8px", backgroundColor: color, borderRadius: "6px" }}>
                        <span style={{ fontSize: "14px", fontWeight: 600, color: colors.white }}>Total</span>
                        <span style={{ fontSize: "18px", fontWeight: 700, color: colors.white }}>{formatCurrency(grandTotal, details.currency)}</span>
                    </div>
                </div>
            </div>

            {/* Notes & Terms */}
            {(details.notes || details.terms) && (
                <div style={{ paddingTop: "20px", borderTop: `1px solid ${colors.gray200}` }}>
                    {details.notes && <p style={{ margin: "0 0 12px", fontSize: "12px", color: colors.gray600, lineHeight: 1.7, whiteSpace: "pre-line" }}>{details.notes}</p>}
                    {details.terms && <p style={{ margin: 0, fontSize: "10px", color: colors.gray400, lineHeight: 1.6, whiteSpace: "pre-line" }}>{details.terms}</p>}
                </div>
            )}
        </div>
    );
}

// ==================== TWO COLUMN TEMPLATE ====================
function TwoColumnTemplate({ document, color, subtotal, totalDiscount, totalTax, grandTotal, taxRateDisplay }: TemplateProps) {
    const { type, business, client, details, items } = document;
    const docLabel = type === "invoice" ? "INVOICE" : "QUOTATION";

    return (
        <div id="document-preview" style={{ fontFamily: fontStack, width: "595px", minHeight: "800px", backgroundColor: colors.white, boxSizing: "border-box" }}>
            {/* Split header */}
            <div style={{ display: "flex" }}>
                <div style={{ flex: 1, padding: "32px", backgroundColor: colors.gray50 }}>
                    {business.name && <h2 style={{ margin: "0 0 12px", fontSize: "18px", fontWeight: 700, color: colors.gray800 }}>{business.name}</h2>}
                    {business.address && <p style={{ margin: "0 0 4px", fontSize: "11px", color: colors.gray500, whiteSpace: "pre-line" }}>{business.address}</p>}
                    {business.email && <p style={{ margin: 0, fontSize: "11px", color: colors.gray500 }}>{business.email}</p>}
                </div>
                <div style={{ flex: 1, padding: "32px", backgroundColor: color }}>
                    <h1 style={{ margin: "0 0 12px", fontSize: "24px", fontWeight: 700, color: colors.white, letterSpacing: "0.1em" }}>{docLabel}</h1>
                    <p style={{ margin: "0 0 4px", fontSize: "12px", color: colors.white, opacity: 0.9 }}>#{details.documentNumber}</p>
                    <p style={{ margin: "0 0 2px", fontSize: "11px", color: colors.white, opacity: 0.8 }}>Date: {details.issueDate}</p>
                    <p style={{ margin: 0, fontSize: "11px", color: colors.white, opacity: 0.8 }}>Due: {details.dueDate}</p>
                </div>
            </div>

            <div style={{ padding: "32px" }}>
                {/* Bill To */}
                <div style={{ marginBottom: "28px" }}>
                    <p style={{ margin: "0 0 8px", fontSize: "10px", fontWeight: 600, color, textTransform: "uppercase", letterSpacing: "0.1em" }}>Bill To</p>
                    {client.name && <p style={{ margin: 0, fontSize: "14px", fontWeight: 600, color: colors.gray800 }}>{client.name}</p>}
                    {client.address && <p style={{ margin: "4px 0 0", fontSize: "12px", color: colors.gray500, whiteSpace: "pre-line" }}>{client.address}</p>}
                    {client.email && <p style={{ margin: "4px 0 0", fontSize: "12px", color: colors.gray500 }}>{client.email}</p>}
                </div>

                {/* Items */}
                <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "28px" }}>
                    <thead>
                        <tr style={{ borderBottom: `2px solid ${colors.gray200}` }}>
                            <th style={{ textAlign: "left", padding: "12px 0", fontSize: "10px", fontWeight: 600, color: colors.gray500, textTransform: "uppercase" }}>Description</th>
                            <th style={{ textAlign: "center", padding: "12px 0", fontSize: "10px", fontWeight: 600, color: colors.gray500, textTransform: "uppercase" }}>Qty</th>
                            <th style={{ textAlign: "right", padding: "12px 0", fontSize: "10px", fontWeight: 600, color: colors.gray500, textTransform: "uppercase" }}>Rate</th>
                            <th style={{ textAlign: "right", padding: "12px 0", fontSize: "10px", fontWeight: 600, color: colors.gray500, textTransform: "uppercase" }}>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item) => (
                            <tr key={item.id} style={{ borderBottom: `1px solid ${colors.gray100}` }}>
                                <td style={{ padding: "14px 0", fontSize: "13px", color: colors.gray700 }}>{item.description || "Item"}</td>
                                <td style={{ padding: "14px 0", textAlign: "center", fontSize: "13px", color: colors.gray500 }}>{item.quantity}</td>
                                <td style={{ padding: "14px 0", textAlign: "right", fontSize: "13px", color: colors.gray500 }}>{formatCurrency(item.unitPrice, details.currency)}</td>
                                <td style={{ padding: "14px 0", textAlign: "right", fontSize: "13px", fontWeight: 600, color: colors.gray800 }}>{formatCurrency(item.quantity * item.unitPrice, details.currency)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Totals */}
                <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "32px" }}>
                    <div style={{ width: "240px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", fontSize: "13px" }}>
                            <span style={{ color: colors.gray500 }}>Subtotal</span>
                            <span style={{ color: colors.gray700 }}>{formatCurrency(subtotal, details.currency)}</span>
                        </div>
                        {totalDiscount > 0 && (
                            <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", fontSize: "13px" }}>
                                <span style={{ color: colors.gray500 }}>Discount</span>
                                <span style={{ color: colors.green600 }}>-{formatCurrency(totalDiscount, details.currency)}</span>
                            </div>
                        )}
                        {totalTax > 0 && (
                            <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", fontSize: "13px" }}>
                                <span style={{ color: colors.gray500 }}>{taxRateDisplay ? `VAT (${taxRateDisplay}%)` : "VAT"}</span>
                                <span style={{ color: colors.gray700 }}>{formatCurrency(totalTax, details.currency)}</span>
                            </div>
                        )}
                        <div style={{ display: "flex", justifyContent: "space-between", padding: "14px 0", marginTop: "8px", borderTop: `2px solid ${color}` }}>
                            <span style={{ fontSize: "14px", fontWeight: 600, color: colors.gray800 }}>Total</span>
                            <span style={{ fontSize: "20px", fontWeight: 700, color }}>{formatCurrency(grandTotal, details.currency)}</span>
                        </div>
                    </div>
                </div>

                {/* Notes & Terms */}
                {(details.notes || details.terms) && (
                    <div style={{ paddingTop: "20px", borderTop: `1px solid ${colors.gray200}` }}>
                        {details.notes && <p style={{ margin: "0 0 12px", fontSize: "12px", color: colors.gray600, lineHeight: 1.7, whiteSpace: "pre-line" }}>{details.notes}</p>}
                        {details.terms && <p style={{ margin: 0, fontSize: "10px", color: colors.gray400, lineHeight: 1.6, whiteSpace: "pre-line" }}>{details.terms}</p>}
                    </div>
                )}
            </div>
        </div>
    );
}

// ==================== LOWERCASE MINIMAL TEMPLATE ====================
function LowercaseMinimalTemplate({ document, color, subtotal, totalDiscount, totalTax, grandTotal, taxRateDisplay }: TemplateProps) {
    const { type, business, client, details, items } = document;
    const docLabel = type === "invoice" ? "invoice" : "quotation";

    return (
        <div id="document-preview" style={{ fontFamily: fontStack, width: "595px", minHeight: "800px", backgroundColor: colors.white, padding: "48px", boxSizing: "border-box" }}>
            {/* Simple header */}
            <div style={{ marginBottom: "48px" }}>
                <h1 style={{ margin: 0, fontSize: "36px", fontWeight: 300, color: colors.gray800 }}>{docLabel}</h1>
            </div>

            {/* Info row */}
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "36px", paddingBottom: "24px", borderBottom: `1px solid ${colors.gray200}` }}>
                <div>
                    <p style={{ margin: "0 0 4px", fontSize: "10px", color: colors.gray400, textTransform: "lowercase" }}>from</p>
                    {business.name && <p style={{ margin: 0, fontSize: "14px", fontWeight: 500, color: colors.gray800 }}>{business.name}</p>}
                    {business.address && <p style={{ margin: "4px 0 0", fontSize: "11px", color: colors.gray500, whiteSpace: "pre-line" }}>{business.address}</p>}
                </div>
                <div>
                    <p style={{ margin: "0 0 4px", fontSize: "10px", color: colors.gray400, textTransform: "lowercase" }}>to</p>
                    {client.name && <p style={{ margin: 0, fontSize: "14px", fontWeight: 500, color: colors.gray800 }}>{client.name}</p>}
                    {client.address && <p style={{ margin: "4px 0 0", fontSize: "11px", color: colors.gray500, whiteSpace: "pre-line" }}>{client.address}</p>}
                </div>
                <div style={{ textAlign: "right" }}>
                    <p style={{ margin: "0 0 8px", fontSize: "11px", color: colors.gray500 }}>#{details.documentNumber}</p>
                    <p style={{ margin: "0 0 4px", fontSize: "11px", color: colors.gray400 }}>{details.issueDate}</p>
                    <p style={{ margin: 0, fontSize: "11px", color: colors.gray400 }}>due {details.dueDate}</p>
                </div>
            </div>

            {/* Items - minimal */}
            <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "32px" }}>
                <thead>
                    <tr>
                        <th style={{ textAlign: "left", padding: "12px 0", fontSize: "10px", color: colors.gray400, fontWeight: 400, textTransform: "lowercase", borderBottom: `1px solid ${colors.gray200}` }}>item</th>
                        <th style={{ textAlign: "center", padding: "12px 0", fontSize: "10px", color: colors.gray400, fontWeight: 400, textTransform: "lowercase", borderBottom: `1px solid ${colors.gray200}` }}>qty</th>
                        <th style={{ textAlign: "right", padding: "12px 0", fontSize: "10px", color: colors.gray400, fontWeight: 400, textTransform: "lowercase", borderBottom: `1px solid ${colors.gray200}` }}>price</th>
                        <th style={{ textAlign: "right", padding: "12px 0", fontSize: "10px", color: colors.gray400, fontWeight: 400, textTransform: "lowercase", borderBottom: `1px solid ${colors.gray200}` }}>total</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item) => (
                        <tr key={item.id}>
                            <td style={{ padding: "14px 0", fontSize: "13px", color: colors.gray700, borderBottom: `1px solid ${colors.gray100}` }}>{item.description || "Item"}</td>
                            <td style={{ padding: "14px 0", textAlign: "center", fontSize: "13px", color: colors.gray500, borderBottom: `1px solid ${colors.gray100}` }}>{item.quantity}</td>
                            <td style={{ padding: "14px 0", textAlign: "right", fontSize: "13px", color: colors.gray500, borderBottom: `1px solid ${colors.gray100}` }}>{formatCurrency(item.unitPrice, details.currency)}</td>
                            <td style={{ padding: "14px 0", textAlign: "right", fontSize: "13px", color: colors.gray800, borderBottom: `1px solid ${colors.gray100}` }}>{formatCurrency(item.quantity * item.unitPrice, details.currency)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Totals */}
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "40px" }}>
                <div style={{ width: "200px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", fontSize: "12px" }}>
                        <span style={{ color: colors.gray400 }}>subtotal</span>
                        <span style={{ color: colors.gray600 }}>{formatCurrency(subtotal, details.currency)}</span>
                    </div>
                    {totalDiscount > 0 && (
                        <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", fontSize: "12px" }}>
                            <span style={{ color: colors.gray400 }}>discount</span>
                            <span style={{ color: colors.green600 }}>-{formatCurrency(totalDiscount, details.currency)}</span>
                        </div>
                    )}
                    {totalTax > 0 && (
                        <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", fontSize: "12px" }}>
                            <span style={{ color: colors.gray400 }}>{taxRateDisplay ? `vat (${taxRateDisplay}%)` : "vat"}</span>
                            <span style={{ color: colors.gray600 }}>{formatCurrency(totalTax, details.currency)}</span>
                        </div>
                    )}
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "16px 0", marginTop: "8px", borderTop: `1px solid ${colors.gray300}` }}>
                        <span style={{ fontSize: "14px", color: colors.gray600 }}>total</span>
                        <span style={{ fontSize: "20px", fontWeight: 600, color: colors.gray900 }}>{formatCurrency(grandTotal, details.currency)}</span>
                    </div>
                </div>
            </div>

            {/* Notes & Terms */}
            {(details.notes || details.terms) && (
                <div>
                    {details.notes && <p style={{ margin: "0 0 16px", fontSize: "12px", color: colors.gray500, lineHeight: 1.7, whiteSpace: "pre-line" }}>{details.notes}</p>}
                    {details.terms && <p style={{ margin: 0, fontSize: "10px", color: colors.gray400, lineHeight: 1.6, whiteSpace: "pre-line" }}>{details.terms}</p>}
                </div>
            )}
        </div>
    );
}

// ==================== BEACH WAVE TEMPLATE ====================
function BeachWaveTemplate({ document, color, subtotal, totalDiscount, totalTax, grandTotal, taxRateDisplay }: TemplateProps) {
    const { type, business, client, details, items } = document;
    const docLabel = type === "invoice" ? "Invoice" : "Quotation";
    const lightColor = lightenColor(color, 0.9);

    return (
        <div id="document-preview" style={{ fontFamily: fontStack, width: "595px", minHeight: "800px", backgroundColor: colors.white, position: "relative", boxSizing: "border-box" }}>
            <div style={{ padding: "40px 48px", paddingBottom: "100px" }}>
                {/* Header */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "36px" }}>
                    <div>
                        {business.name && <h2 style={{ margin: 0, fontSize: "22px", fontWeight: 700, color: colors.gray800 }}>{business.name}</h2>}
                        {business.address && <p style={{ margin: "8px 0 0", fontSize: "11px", color: colors.gray500, whiteSpace: "pre-line" }}>{business.address}</p>}
                    </div>
                    <div style={{ textAlign: "right" }}>
                        <h1 style={{ margin: 0, fontSize: "28px", fontWeight: 600, color }}>{docLabel}</h1>
                        <p style={{ margin: "4px 0 0", fontSize: "12px", color: colors.gray500 }}>#{details.documentNumber}</p>
                    </div>
                </div>

                {/* Info */}
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "32px" }}>
                    <div>
                        <p style={{ margin: "0 0 8px", fontSize: "10px", fontWeight: 600, color, textTransform: "uppercase" }}>Bill To</p>
                        {client.name && <p style={{ margin: 0, fontSize: "14px", fontWeight: 600, color: colors.gray800 }}>{client.name}</p>}
                        {client.address && <p style={{ margin: "4px 0 0", fontSize: "12px", color: colors.gray500, whiteSpace: "pre-line" }}>{client.address}</p>}
                    </div>
                    <div style={{ textAlign: "right" }}>
                        <p style={{ margin: "0 0 4px", fontSize: "11px", color: colors.gray500 }}>Date: {details.issueDate}</p>
                        <p style={{ margin: 0, fontSize: "11px", color: colors.gray500 }}>Due: {details.dueDate}</p>
                    </div>
                </div>

                {/* Items */}
                <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "28px" }}>
                    <thead>
                        <tr style={{ backgroundColor: lightColor }}>
                            <th style={{ textAlign: "left", padding: "12px 16px", fontSize: "10px", fontWeight: 600, color, textTransform: "uppercase" }}>Description</th>
                            <th style={{ textAlign: "center", padding: "12px 16px", fontSize: "10px", fontWeight: 600, color, textTransform: "uppercase" }}>Qty</th>
                            <th style={{ textAlign: "right", padding: "12px 16px", fontSize: "10px", fontWeight: 600, color, textTransform: "uppercase" }}>Rate</th>
                            <th style={{ textAlign: "right", padding: "12px 16px", fontSize: "10px", fontWeight: 600, color, textTransform: "uppercase" }}>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item) => (
                            <tr key={item.id} style={{ borderBottom: `1px solid ${colors.gray100}` }}>
                                <td style={{ padding: "14px 16px", fontSize: "13px", color: colors.gray700 }}>{item.description || "Item"}</td>
                                <td style={{ padding: "14px 16px", textAlign: "center", fontSize: "13px", color: colors.gray500 }}>{item.quantity}</td>
                                <td style={{ padding: "14px 16px", textAlign: "right", fontSize: "13px", color: colors.gray500 }}>{formatCurrency(item.unitPrice, details.currency)}</td>
                                <td style={{ padding: "14px 16px", textAlign: "right", fontSize: "13px", fontWeight: 600, color: colors.gray800 }}>{formatCurrency(item.quantity * item.unitPrice, details.currency)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Totals */}
                <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "32px" }}>
                    <div style={{ width: "220px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", fontSize: "12px" }}>
                            <span style={{ color: colors.gray500 }}>Subtotal</span>
                            <span style={{ color: colors.gray700 }}>{formatCurrency(subtotal, details.currency)}</span>
                        </div>
                        {totalDiscount > 0 && (
                            <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", fontSize: "12px" }}>
                                <span style={{ color: colors.gray500 }}>Discount</span>
                                <span style={{ color: colors.green600 }}>-{formatCurrency(totalDiscount, details.currency)}</span>
                            </div>
                        )}
                        {totalTax > 0 && (
                            <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", fontSize: "12px" }}>
                                <span style={{ color: colors.gray500 }}>{taxRateDisplay ? `VAT (${taxRateDisplay}%)` : "VAT"}</span>
                                <span style={{ color: colors.gray700 }}>{formatCurrency(totalTax, details.currency)}</span>
                            </div>
                        )}
                        <div style={{ display: "flex", justifyContent: "space-between", padding: "14px 0", marginTop: "8px", borderTop: `2px solid ${color}` }}>
                            <span style={{ fontSize: "13px", fontWeight: 600, color: colors.gray700 }}>Total</span>
                            <span style={{ fontSize: "18px", fontWeight: 700, color }}>{formatCurrency(grandTotal, details.currency)}</span>
                        </div>
                    </div>
                </div>

                {/* Notes & Terms */}
                {(details.notes || details.terms) && (
                    <div>
                        {details.notes && <p style={{ margin: "0 0 12px", fontSize: "12px", color: colors.gray600, lineHeight: 1.7, whiteSpace: "pre-line" }}>{details.notes}</p>}
                        {details.terms && <p style={{ margin: 0, fontSize: "10px", color: colors.gray400, lineHeight: 1.6, whiteSpace: "pre-line" }}>{details.terms}</p>}
                    </div>
                )}
            </div>

            {/* Wave decoration at bottom */}
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "60px", overflow: "hidden" }}>
                <svg viewBox="0 0 595 60" preserveAspectRatio="none" style={{ width: "100%", height: "100%" }}>
                    <path d="M0,30 Q150,0 297.5,30 T595,30 L595,60 L0,60 Z" fill={lightColor} opacity="0.6" />
                    <path d="M0,40 Q150,15 297.5,40 T595,40 L595,60 L0,60 Z" fill={color} opacity="0.4" />
                </svg>
            </div>
        </div>
    );
}

// ==================== BLUE HEADER BAR TEMPLATE ====================
function BlueHeaderBarTemplate({ document, color, subtotal, totalDiscount, totalTax, grandTotal, taxRateDisplay }: TemplateProps) {
    const { type, business, client, details, items } = document;
    const docLabel = type === "invoice" ? "INVOICE" : "QUOTATION";

    return (
        <div id="document-preview" style={{ fontFamily: fontStack, width: "595px", minHeight: "800px", backgroundColor: colors.white, boxSizing: "border-box" }}>
            {/* Full width header bar */}
            <div style={{ backgroundColor: color, padding: "32px 48px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                    {business.name && <h2 style={{ margin: 0, fontSize: "24px", fontWeight: 700, color: colors.white }}>{business.name}</h2>}
                    {business.email && <p style={{ margin: "8px 0 0", fontSize: "12px", color: colors.white, opacity: 0.85 }}>{business.email}</p>}
                </div>
                <div style={{ textAlign: "right" }}>
                    <h1 style={{ margin: 0, fontSize: "32px", fontWeight: 800, color: colors.white, letterSpacing: "0.08em" }}>{docLabel}</h1>
                </div>
            </div>

            <div style={{ padding: "32px 48px" }}>
                {/* Info row */}
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "28px", paddingBottom: "20px", borderBottom: `1px solid ${colors.gray200}` }}>
                    <div>
                        <p style={{ margin: "0 0 8px", fontSize: "10px", fontWeight: 600, color: colors.gray400, textTransform: "uppercase" }}>Bill To</p>
                        {client.name && <p style={{ margin: 0, fontSize: "15px", fontWeight: 600, color: colors.gray800 }}>{client.name}</p>}
                        {client.address && <p style={{ margin: "4px 0 0", fontSize: "12px", color: colors.gray500, whiteSpace: "pre-line" }}>{client.address}</p>}
                    </div>
                    <div style={{ textAlign: "right" }}>
                        <p style={{ margin: "0 0 4px", fontSize: "12px", color: colors.gray600 }}><span style={{ color: colors.gray400 }}>{docLabel} #:</span> {details.documentNumber}</p>
                        <p style={{ margin: "0 0 4px", fontSize: "12px", color: colors.gray600 }}><span style={{ color: colors.gray400 }}>Date:</span> {details.issueDate}</p>
                        <p style={{ margin: 0, fontSize: "12px", color: colors.gray600 }}><span style={{ color: colors.gray400 }}>Due:</span> {details.dueDate}</p>
                    </div>
                </div>

                {/* Items */}
                <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "28px" }}>
                    <thead>
                        <tr style={{ backgroundColor: colors.gray100 }}>
                            <th style={{ textAlign: "left", padding: "14px 16px", fontSize: "11px", fontWeight: 600, color: colors.gray600, textTransform: "uppercase" }}>Description</th>
                            <th style={{ textAlign: "center", padding: "14px 16px", fontSize: "11px", fontWeight: 600, color: colors.gray600, textTransform: "uppercase" }}>Qty</th>
                            <th style={{ textAlign: "right", padding: "14px 16px", fontSize: "11px", fontWeight: 600, color: colors.gray600, textTransform: "uppercase" }}>Rate</th>
                            <th style={{ textAlign: "right", padding: "14px 16px", fontSize: "11px", fontWeight: 600, color: colors.gray600, textTransform: "uppercase" }}>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item) => (
                            <tr key={item.id} style={{ borderBottom: `1px solid ${colors.gray100}` }}>
                                <td style={{ padding: "14px 16px", fontSize: "13px", color: colors.gray700 }}>{item.description || "Item"}</td>
                                <td style={{ padding: "14px 16px", textAlign: "center", fontSize: "13px", color: colors.gray500 }}>{item.quantity}</td>
                                <td style={{ padding: "14px 16px", textAlign: "right", fontSize: "13px", color: colors.gray500 }}>{formatCurrency(item.unitPrice, details.currency)}</td>
                                <td style={{ padding: "14px 16px", textAlign: "right", fontSize: "13px", fontWeight: 600, color: colors.gray800 }}>{formatCurrency(item.quantity * item.unitPrice, details.currency)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Totals */}
                <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "32px" }}>
                    <div style={{ width: "260px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", fontSize: "13px" }}>
                            <span style={{ color: colors.gray500 }}>Subtotal</span>
                            <span style={{ color: colors.gray700 }}>{formatCurrency(subtotal, details.currency)}</span>
                        </div>
                        {totalDiscount > 0 && (
                            <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", fontSize: "13px" }}>
                                <span style={{ color: colors.gray500 }}>Discount</span>
                                <span style={{ color: colors.green600 }}>-{formatCurrency(totalDiscount, details.currency)}</span>
                            </div>
                        )}
                        {totalTax > 0 && (
                            <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", fontSize: "13px" }}>
                                <span style={{ color: colors.gray500 }}>{taxRateDisplay ? `VAT (${taxRateDisplay}%)` : "VAT"}</span>
                                <span style={{ color: colors.gray700 }}>{formatCurrency(totalTax, details.currency)}</span>
                            </div>
                        )}
                        <div style={{ display: "flex", justifyContent: "space-between", padding: "16px 20px", marginTop: "12px", backgroundColor: color, borderRadius: "8px" }}>
                            <span style={{ fontSize: "14px", fontWeight: 600, color: colors.white }}>Total Due</span>
                            <span style={{ fontSize: "20px", fontWeight: 700, color: colors.white }}>{formatCurrency(grandTotal, details.currency)}</span>
                        </div>
                    </div>
                </div>

                {/* Notes & Terms */}
                {(details.notes || details.terms) && (
                    <div style={{ paddingTop: "20px", borderTop: `1px solid ${colors.gray200}` }}>
                        {details.notes && <p style={{ margin: "0 0 12px", fontSize: "12px", color: colors.gray600, lineHeight: 1.7, whiteSpace: "pre-line" }}>{details.notes}</p>}
                        {details.terms && <p style={{ margin: 0, fontSize: "10px", color: colors.gray400, lineHeight: 1.6, whiteSpace: "pre-line" }}>{details.terms}</p>}
                    </div>
                )}
            </div>
        </div>
    );
}

// ==================== CIRCULAR MODERN TEMPLATE ====================
function CircularModernTemplate({ document, color, subtotal, totalDiscount, totalTax, grandTotal, taxRateDisplay }: TemplateProps) {
    const { type, business, client, details, items } = document;
    const docLabel = type === "invoice" ? "INVOICE" : "QUOTATION";

    return (
        <div id="document-preview" style={{ fontFamily: fontStack, width: "595px", minHeight: "800px", backgroundColor: colors.white, padding: "40px 48px", boxSizing: "border-box", position: "relative" }}>
            {/* Circle accent */}
            <div style={{ position: "absolute", top: "-60px", right: "-60px", width: "200px", height: "200px", borderRadius: "50%", backgroundColor: color, opacity: 0.1 }}></div>
            <div style={{ position: "absolute", top: "20px", right: "20px", width: "80px", height: "80px", borderRadius: "50%", backgroundColor: color, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: "10px", fontWeight: 700, color: colors.white, textAlign: "center", lineHeight: 1.2 }}>{docLabel}</span>
            </div>

            <div style={{ position: "relative", zIndex: 1 }}>
                {/* Header */}
                <div style={{ marginBottom: "36px", paddingRight: "100px" }}>
                    {business.name && <h2 style={{ margin: 0, fontSize: "24px", fontWeight: 700, color: colors.gray800 }}>{business.name}</h2>}
                    {business.address && <p style={{ margin: "8px 0 0", fontSize: "11px", color: colors.gray500, whiteSpace: "pre-line" }}>{business.address}</p>}
                    {business.email && <p style={{ margin: "4px 0 0", fontSize: "11px", color: colors.gray500 }}>{business.email}</p>}
                </div>

                {/* Info row */}
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "28px", paddingBottom: "20px", borderBottom: `1px solid ${colors.gray200}` }}>
                    <div>
                        <p style={{ margin: "0 0 8px", fontSize: "10px", fontWeight: 600, color, textTransform: "uppercase", letterSpacing: "0.1em" }}>Bill To</p>
                        {client.name && <p style={{ margin: 0, fontSize: "14px", fontWeight: 600, color: colors.gray800 }}>{client.name}</p>}
                        {client.address && <p style={{ margin: "4px 0 0", fontSize: "12px", color: colors.gray500, whiteSpace: "pre-line" }}>{client.address}</p>}
                    </div>
                    <div style={{ textAlign: "right" }}>
                        <p style={{ margin: "0 0 6px", fontSize: "12px", color: colors.gray500 }}>#{details.documentNumber}</p>
                        <p style={{ margin: "0 0 4px", fontSize: "11px", color: colors.gray400 }}>Date: {details.issueDate}</p>
                        <p style={{ margin: 0, fontSize: "11px", color: colors.gray400 }}>Due: {details.dueDate}</p>
                    </div>
                </div>

                {/* Items */}
                <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "28px" }}>
                    <thead>
                        <tr>
                            <th style={{ textAlign: "left", padding: "12px 0", fontSize: "10px", fontWeight: 600, color: colors.gray500, textTransform: "uppercase", borderBottom: `2px solid ${color}` }}>Description</th>
                            <th style={{ textAlign: "center", padding: "12px 0", fontSize: "10px", fontWeight: 600, color: colors.gray500, textTransform: "uppercase", borderBottom: `2px solid ${color}` }}>Qty</th>
                            <th style={{ textAlign: "right", padding: "12px 0", fontSize: "10px", fontWeight: 600, color: colors.gray500, textTransform: "uppercase", borderBottom: `2px solid ${color}` }}>Rate</th>
                            <th style={{ textAlign: "right", padding: "12px 0", fontSize: "10px", fontWeight: 600, color: colors.gray500, textTransform: "uppercase", borderBottom: `2px solid ${color}` }}>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item) => (
                            <tr key={item.id} style={{ borderBottom: `1px solid ${colors.gray100}` }}>
                                <td style={{ padding: "14px 0", fontSize: "13px", color: colors.gray700 }}>{item.description || "Item"}</td>
                                <td style={{ padding: "14px 0", textAlign: "center", fontSize: "13px", color: colors.gray500 }}>{item.quantity}</td>
                                <td style={{ padding: "14px 0", textAlign: "right", fontSize: "13px", color: colors.gray500 }}>{formatCurrency(item.unitPrice, details.currency)}</td>
                                <td style={{ padding: "14px 0", textAlign: "right", fontSize: "13px", fontWeight: 600, color: colors.gray800 }}>{formatCurrency(item.quantity * item.unitPrice, details.currency)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Totals */}
                <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "36px" }}>
                    <div style={{ width: "240px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", fontSize: "13px" }}>
                            <span style={{ color: colors.gray500 }}>Subtotal</span>
                            <span style={{ color: colors.gray700 }}>{formatCurrency(subtotal, details.currency)}</span>
                        </div>
                        {totalDiscount > 0 && (
                            <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", fontSize: "13px" }}>
                                <span style={{ color: colors.gray500 }}>Discount</span>
                                <span style={{ color: colors.green600 }}>-{formatCurrency(totalDiscount, details.currency)}</span>
                            </div>
                        )}
                        {totalTax > 0 && (
                            <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", fontSize: "13px" }}>
                                <span style={{ color: colors.gray500 }}>{taxRateDisplay ? `VAT (${taxRateDisplay}%)` : "VAT"}</span>
                                <span style={{ color: colors.gray700 }}>{formatCurrency(totalTax, details.currency)}</span>
                            </div>
                        )}
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 0", marginTop: "8px", borderTop: `2px solid ${colors.gray200}` }}>
                            <span style={{ fontSize: "14px", fontWeight: 600, color: colors.gray700 }}>Total</span>
                            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                <span style={{ fontSize: "22px", fontWeight: 700, color }}>{formatCurrency(grandTotal, details.currency)}</span>
                                <div style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: color }}></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Notes & Terms */}
                {(details.notes || details.terms) && (
                    <div style={{ paddingTop: "20px", borderTop: `1px solid ${colors.gray200}` }}>
                        {details.notes && <p style={{ margin: "0 0 12px", fontSize: "12px", color: colors.gray600, lineHeight: 1.7, whiteSpace: "pre-line" }}>{details.notes}</p>}
                        {details.terms && <p style={{ margin: 0, fontSize: "10px", color: colors.gray400, lineHeight: 1.6, whiteSpace: "pre-line" }}>{details.terms}</p>}
                    </div>
                )}
            </div>
        </div>
    );
}

