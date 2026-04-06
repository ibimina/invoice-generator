"use client";
/* eslint-disable jsx-a11y/alt-text */

import React from "react";
import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
    Image,
    Svg,
    Path,
    Defs,
    LinearGradient,
    Stop,
    Rect,
} from "@react-pdf/renderer";
import { DocumentData, ACCENT_COLORS, AccentColor } from "@/types/document";
import { formatCurrency, formatDate } from "@/lib/utils";

// Color palette - matching HTML preview exactly
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

// Helper to lighten a hex color
function lightenColor(hex: string, percent: number): string {
    const num = parseInt(hex.replace("#", ""), 16);
    const r = Math.min(255, Math.floor((num >> 16) + (255 - (num >> 16)) * percent));
    const g = Math.min(255, Math.floor(((num >> 8) & 0x00ff) + (255 - ((num >> 8) & 0x00ff)) * percent));
    const b = Math.min(255, Math.floor((num & 0x0000ff) + (255 - (num & 0x0000ff)) * percent));
    return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`;
}

// Base styles - matching HTML preview (4 columns: Description, Qty, Rate, Amount)
const baseStyles = StyleSheet.create({
    page: {
        fontFamily: "Helvetica",
        fontSize: 10,
        paddingTop: 28,
        paddingBottom: 60,
        paddingHorizontal: 20,
        backgroundColor: colors.white,
    },
    row: {
        flexDirection: "row",
    },
    spaceBetween: {
        justifyContent: "space-between",
    },
    table: {
        marginTop: 16,
        marginBottom: 16,
    },
    tableHeader: {
        flexDirection: "row",
        borderBottomWidth: 2,
        borderBottomColor: colors.gray200,
        paddingBottom: 8,
        marginBottom: 0,
    },
    tableRow: {
        flexDirection: "row",
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: colors.gray100,
        wrap: false,
    },
    // 4 Column layout matching HTML: Description (flex), Qty (60px), Rate (100px), Amount (100px)
    colDesc: { flex: 1 },
    colQty: { width: 60, textAlign: "center" },
    colRate: { width: 100, textAlign: "right" },
    colAmount: { width: 100, textAlign: "right" },
    // Aliases for templates that use alternate names
    colPrice: { width: 100, textAlign: "right" },
    colTotal: { width: 100, textAlign: "right" },
    totalsSection: {
        marginTop: 0,
        marginBottom: 50,
        alignItems: "flex-end",
    },
    totalRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: 220,
        paddingBottom: 4,
    },
    totalLabel: {
        fontSize: 13,
        color: colors.gray500,
    },
    totalValue: {
        fontSize: 13,
        color: colors.gray800,
    },
    terms: {
        marginTop: 40,
        wrap: false,
    },
    termsTitle: {
        fontSize: 10,
        fontWeight: 600,
        textTransform: "uppercase",
        letterSpacing: 0.5,
        marginBottom: 8,
        color: colors.gray400,
    },
    termsText: {
        fontSize: 11,
        color: colors.gray500,
        lineHeight: 1.8,
    },
    footer: {
        position: "absolute",
        bottom: 20,
        left: 20,
        right: 20,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    footerText: {
        fontSize: 9,
        color: colors.gray400,
    },
});

// Reusable footer component with page numbers
interface PDFFooterProps {
    businessName: string;
    accentColor?: string;
}

function PDFFooter({ businessName, accentColor }: PDFFooterProps) {
    return (
        <View style={baseStyles.footer} fixed>
            <Text style={baseStyles.footerText}>{businessName}</Text>
            <Text
                style={baseStyles.footerText}
                render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`}
            />
        </View>
    );
}

interface PDFTemplateProps {
    document: DocumentData;
}

// Calculate totals helper
function calculateTotals(document: DocumentData) {
    let subtotal = 0;
    let totalDiscount = 0;
    let totalTax = 0;
    const taxRates = new Set<number>();

    document.items.forEach((item) => {
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
    const taxRateDisplay = taxRates.size === 1 ? Array.from(taxRates)[0] : null;

    return { subtotal, totalDiscount, totalTax, grandTotal, taxRateDisplay };
}

// ============================================================================
// CLASSIC TEMPLATE - Matches HTML preview exactly
// ============================================================================
export function ClassicPDF({ document }: PDFTemplateProps) {
    const { type, business, client, details, items, customTemplate } = document;
    const { terms, notes, currency = "USD" } = details;
    const color = ACCENT_COLORS[document.accentColor as AccentColor] || document.accentColor;
    const { subtotal, totalDiscount, totalTax, grandTotal, taxRateDisplay } = calculateTotals(document);
    const docLabel = type === "invoice" ? "Invoice" : "Quotation";

    return (
        <Document>
            <Page size="A4" style={baseStyles.page}>
                {/* Custom Letterhead Background */}
                {customTemplate && (
                    <Image
                        src={customTemplate}
                        style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                        }}
                    />
                )}
                {/* Header - Logo+Business left, Invoice title right */}
                <View style={[baseStyles.row, baseStyles.spaceBetween, { marginBottom: 16 }]}>
                    <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 12 }}>
                        {business.logo && (
                            <Image src={business.logo} style={{ width: 50, height: 50, objectFit: "contain" }} />
                        )}
                        <View>
                            <Text style={{ fontSize: 18, fontWeight: 600, color: colors.gray900, letterSpacing: -0.3 }}>{business.name || "Your Business"}</Text>
                            <View style={{ marginTop: 4 }}>
                                {business.address && <Text style={{ fontSize: 11, color: colors.gray500 }}>{business.address}</Text>}
                                {business.email && <Text style={{ fontSize: 11, color: colors.gray500 }}>{business.email}</Text>}
                                {business.phone && <Text style={{ fontSize: 11, color: colors.gray500 }}>{business.phone}</Text>}
                            </View>
                        </View>
                    </View>
                    <View style={{ alignItems: "flex-end" }}>
                        <Text style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1, color: colors.gray400 }}>{docLabel}</Text>
                        <Text style={{ fontSize: 20, fontWeight: 700, color: colors.gray900, marginTop: 2 }}>#{details.documentNumber}</Text>
                    </View>
                </View>

                {/* Accent Line */}
                <View style={{ height: 3, backgroundColor: color, marginBottom: 16 }} />

                {/* Bill To + Details */}
                <View style={[baseStyles.row, baseStyles.spaceBetween, { marginBottom: 16 }]}>
                    <View>
                        <Text style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1, color: colors.gray400, marginBottom: 6 }}>Bill To</Text>
                        <Text style={{ fontSize: 14, fontWeight: 600, color: colors.gray900 }}>{client.name || "Client Name"}</Text>
                        {client.company && <Text style={{ fontSize: 12, color: colors.gray600, marginTop: 2 }}>{client.company}</Text>}
                        {client.address && <Text style={{ fontSize: 11, color: colors.gray500, marginTop: 4 }}>{client.address}</Text>}
                        {client.email && <Text style={{ fontSize: 11, color: colors.gray500, marginTop: 2 }}>{client.email}</Text>}
                        {client.phone && <Text style={{ fontSize: 11, color: colors.gray500, marginTop: 2 }}>{client.phone}</Text>}
                    </View>
                    <View style={{ alignItems: "flex-end" }}>
                        <View style={{ marginBottom: 8 }}>
                            <Text style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1, color: colors.gray400 }}>Issue Date</Text>
                            <Text style={{ fontSize: 13, fontWeight: 500, color: colors.gray800, marginTop: 2 }}>{formatDate(details.issueDate)}</Text>
                        </View>
                        {type === "invoice" && details.dueDate ? (
                            <View style={{ marginBottom: 8 }}>
                                <Text style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1, color: colors.gray400 }}>Due Date</Text>
                                <Text style={{ fontSize: 13, fontWeight: 500, color: colors.gray800, marginTop: 2 }}>{formatDate(details.dueDate)}</Text>
                            </View>
                        ) : null}
                        {type === "quotation" && details.validUntil ? (
                            <View style={{ marginBottom: 8 }}>
                                <Text style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1, color: colors.gray400 }}>Valid Until</Text>
                                <Text style={{ fontSize: 13, fontWeight: 500, color: colors.gray800, marginTop: 2 }}>{formatDate(details.validUntil)}</Text>
                            </View>
                        ) : null}
                        {details.poNumber && (
                            <View>
                                <Text style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1, color: colors.gray400 }}>PO Number</Text>
                                <Text style={{ fontSize: 13, fontWeight: 500, color: colors.gray800, marginTop: 2 }}>{details.poNumber}</Text>
                            </View>
                        )}
                    </View>
                </View>

                {/* Items Table - 4 columns matching HTML */}
                <View style={baseStyles.table}>
                    <View style={baseStyles.tableHeader}>
                        <Text style={[baseStyles.colDesc, { fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5, color: colors.gray500 }]}>Description</Text>
                        <Text style={[baseStyles.colQty, { fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5, color: colors.gray500 }]}>Qty</Text>
                        <Text style={[baseStyles.colRate, { fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5, color: colors.gray500 }]}>Rate</Text>
                        <Text style={[baseStyles.colAmount, { fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5, color: colors.gray500 }]}>Amount</Text>
                    </View>
                    {items.map((item, index) => {
                        const lineTotal = item.quantity * item.unitPrice;
                        return (
                            <View key={index} style={baseStyles.tableRow}>
                                <View style={[baseStyles.colDesc, { flexDirection: "row", alignItems: "center" }]}>
                                    <Text style={{ fontSize: 13, color: colors.gray800 }}>{item.description || "Item"}</Text>
                                    {item.discountPercent > 0 && (
                                        <Text style={{ marginLeft: 8, fontSize: 11, color: colors.gray400 }}>{item.discountPercent}% off</Text>
                                    )}
                                </View>
                                <Text style={[baseStyles.colQty, { fontSize: 13, color: colors.gray600 }]}>{item.quantity}</Text>
                                <Text style={[baseStyles.colRate, { fontSize: 13, color: colors.gray600 }]}>{formatCurrency(item.unitPrice, currency)}</Text>
                                <Text style={[baseStyles.colAmount, { fontSize: 13, fontWeight: 600, color: colors.gray800 }]}>{formatCurrency(lineTotal, currency)}</Text>
                            </View>
                        );
                    })}
                </View>

                {/* Totals */}
                <View style={baseStyles.totalsSection}>
                    <View style={baseStyles.totalRow}>
                        <Text style={baseStyles.totalLabel}>Subtotal</Text>
                        <Text style={baseStyles.totalValue}>{formatCurrency(subtotal, currency)}</Text>
                    </View>
                    {totalDiscount > 0 && (
                        <View style={baseStyles.totalRow}>
                            <Text style={baseStyles.totalLabel}>Discount</Text>
                            <Text style={[baseStyles.totalValue, { color: colors.green600 }]}>-{formatCurrency(totalDiscount, currency)}</Text>
                        </View>
                    )}
                    {totalTax > 0 && (
                        <View style={[baseStyles.totalRow, { paddingBottom: 6 }]}>
                            <Text style={baseStyles.totalLabel}>{taxRateDisplay ? `VAT (${taxRateDisplay}%)` : "VAT"}</Text>
                            <Text style={baseStyles.totalValue}>{formatCurrency(totalTax, currency)}</Text>
                        </View>
                    )}
                    <View style={[baseStyles.totalRow, { paddingTop: 8, alignItems: "center" }]}>
                        <Text style={{ fontSize: 12, fontWeight: 600, color: colors.gray600, textTransform: "uppercase", letterSpacing: 0.5 }}>{type === "invoice" ? "Amount Due" : "Total"}</Text>
                        <Text style={{ fontSize: 18, fontWeight: 700, color: colors.gray900 }}>{formatCurrency(grandTotal, currency)}</Text>
                    </View>
                </View>

                {/* Notes & Terms */}
                {notes && (
                    <Text style={{ fontSize: 12, color: colors.gray600, lineHeight: 1.6, marginBottom: 12 }}>{notes}</Text>
                )}
                {terms && (
                    <View style={baseStyles.terms} wrap={false}>
                        <Text style={baseStyles.termsTitle}>Terms & Conditions</Text>
                        <Text style={baseStyles.termsText}>{terms}</Text>
                    </View>
                )}

                {/* Footer with page numbers */}
                <PDFFooter businessName={business.name || "Your Business"} />
            </Page>
        </Document>
    );
}

// ============================================================================
// MODERN TEMPLATE - Matches HTML preview exactly
// ============================================================================
export function ModernPDF({ document }: PDFTemplateProps) {
    const { type, business, client, details, items, customTemplate } = document;
    const { terms, notes, currency = "USD" } = details;
    const color = ACCENT_COLORS[document.accentColor as AccentColor] || document.accentColor;
    const { subtotal, totalDiscount, totalTax, grandTotal, taxRateDisplay } = calculateTotals(document);
    const docLabel = type === "invoice" ? "INVOICE" : "QUOTE";
    const lightBg = lightenColor(color, 0.94);

    return (
        <Document>
            <Page size="A4" style={{ fontFamily: "Helvetica", fontSize: 10, padding: 0, backgroundColor: colors.white }}>
                {/* Custom Letterhead Background */}
                {customTemplate && (
                    <Image
                        src={customTemplate}
                        style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                        }}
                    />
                )}
                {/* Header Banner */}
                <View style={{ backgroundColor: color, padding: "48 52 36 52" }}>
                    <View style={[baseStyles.row, baseStyles.spaceBetween, { alignItems: "center" }]}>
                        <View style={{ flexDirection: "row", alignItems: "center", gap: 18 }}>
                            {business.logo && (
                                <View style={{ width: 54, height: 54, backgroundColor: "rgba(255,255,255,0.15)", borderRadius: 12, justifyContent: "center", alignItems: "center" }}>
                                    <Image src={business.logo} style={{ width: 40, height: 40, objectFit: "contain" }} />
                                </View>
                            )}
                            <View>
                                <Text style={{ fontSize: 20, fontWeight: 600, color: colors.white }}>{business.name || "Your Business"}</Text>
                                {business.email && <Text style={{ fontSize: 13, color: "rgba(255,255,255,0.75)", marginTop: 6 }}>{business.email}</Text>}
                            </View>
                        </View>
                        <View style={{ alignItems: "flex-end" }}>
                            <Text style={{ fontSize: 34, fontWeight: 700, color: colors.white }}>{docLabel}</Text>
                            <Text style={{ fontSize: 15, color: "rgba(255,255,255,0.85)", marginTop: 6 }}>#{details.documentNumber}</Text>
                        </View>
                    </View>
                </View>

                <View style={{ padding: "44 52" }}>
                    {/* Info Cards */}
                    <View style={[baseStyles.row, { gap: 28, marginBottom: 44 }]}>
                        <View style={{ flex: 1, padding: "26 24", backgroundColor: lightBg, borderRadius: 14 }}>
                            <Text style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1, color: color, marginBottom: 16 }}>Bill To</Text>
                            <Text style={{ fontSize: 16, fontWeight: 600, color: colors.gray900, lineHeight: 1.4 }}>{client.name || "Client Name"}</Text>
                            {client.company && <Text style={{ fontSize: 14, color: colors.gray600, marginTop: 6, lineHeight: 1.5 }}>{client.company}</Text>}
                            {client.address && <Text style={{ fontSize: 13, color: colors.gray500, marginTop: 12, lineHeight: 1.7 }}>{client.address}</Text>}
                            {client.email && <Text style={{ fontSize: 13, color: colors.gray500, marginTop: 6 }}>{client.email}</Text>}
                        </View>
                        <View style={{ width: 200, padding: "26 24", backgroundColor: colors.gray50, borderRadius: 14 }}>
                            <Text style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1, color: colors.gray400, marginBottom: 16 }}>Details</Text>
                            <View style={{ gap: 14 }}>
                                <View>
                                    <Text style={{ fontSize: 11, color: colors.gray400, fontWeight: 500 }}>Issue Date</Text>
                                    <Text style={{ fontSize: 14, fontWeight: 500, color: colors.gray800, marginTop: 4 }}>{formatDate(details.issueDate)}</Text>
                                </View>
                                {type === "invoice" && details.dueDate ? (
                                    <View>
                                        <Text style={{ fontSize: 11, color: colors.gray400, fontWeight: 500 }}>Due Date</Text>
                                        <Text style={{ fontSize: 14, fontWeight: 500, color: colors.gray800, marginTop: 4 }}>{formatDate(details.dueDate)}</Text>
                                    </View>
                                ) : null}
                                {type === "quotation" && details.validUntil ? (
                                    <View>
                                        <Text style={{ fontSize: 11, color: colors.gray400, fontWeight: 500 }}>Valid Until</Text>
                                        <Text style={{ fontSize: 14, fontWeight: 500, color: colors.gray800, marginTop: 4 }}>{formatDate(details.validUntil)}</Text>
                                    </View>
                                ) : null}
                            </View>
                        </View>
                    </View>

                    {/* Items Table */}
                    <View style={{ marginBottom: 30 }}>
                        <View style={{ flexDirection: "row", borderBottomWidth: 2, borderBottomColor: colors.gray200, paddingBottom: 12 }}>
                            <Text style={[baseStyles.colDesc, { fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5, color: colors.gray500 }]}>Description</Text>
                            <Text style={[baseStyles.colQty, { fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5, color: colors.gray500 }]}>Qty</Text>
                            <Text style={[baseStyles.colRate, { fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5, color: colors.gray500 }]}>Rate</Text>
                            <Text style={[baseStyles.colAmount, { fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5, color: colors.gray500 }]}>Amount</Text>
                        </View>
                        {items.map((item, index) => {
                            const lineTotal = item.quantity * item.unitPrice;
                            return (
                                <View key={index} wrap={false} style={{ flexDirection: "row", paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: colors.gray100 }}>
                                    <View style={[baseStyles.colDesc]}>
                                        <Text style={{ fontSize: 14, fontWeight: 500, color: colors.gray800 }}>{item.description || "Item"}</Text>
                                        {item.discountPercent > 0 && (
                                            <Text style={{ fontSize: 12, color: colors.gray400, marginTop: 2 }}>{item.discountPercent}% discount</Text>
                                        )}
                                    </View>
                                    <Text style={[baseStyles.colQty, { fontSize: 14, color: colors.gray600 }]}>{item.quantity}</Text>
                                    <Text style={[baseStyles.colRate, { fontSize: 14, color: colors.gray600 }]}>{formatCurrency(item.unitPrice, currency)}</Text>
                                    <Text style={[baseStyles.colAmount, { fontSize: 14, fontWeight: 600, color: colors.gray800 }]}>{formatCurrency(lineTotal, currency)}</Text>
                                </View>
                            );
                        })}
                    </View>

                    {/* Totals */}
                    <View style={{ alignItems: "flex-end", marginBottom: 40 }}>
                        <View style={{ width: 260 }}>
                            <View style={{ flexDirection: "row", justifyContent: "space-between", paddingBottom: 8 }}>
                                <Text style={{ fontSize: 14, color: colors.gray500 }}>Subtotal</Text>
                                <Text style={{ fontSize: 14, color: colors.gray800 }}>{formatCurrency(subtotal, currency)}</Text>
                            </View>
                            {totalDiscount > 0 && (
                                <View style={{ flexDirection: "row", justifyContent: "space-between", paddingBottom: 8 }}>
                                    <Text style={{ fontSize: 14, color: colors.gray500 }}>Discount</Text>
                                    <Text style={{ fontSize: 14, color: colors.green600 }}>-{formatCurrency(totalDiscount, currency)}</Text>
                                </View>
                            )}
                            {totalTax > 0 && (
                                <View style={{ flexDirection: "row", justifyContent: "space-between", paddingBottom: 8 }}>
                                    <Text style={{ fontSize: 14, color: colors.gray500 }}>{taxRateDisplay ? `VAT (${taxRateDisplay}%)` : "VAT"}</Text>
                                    <Text style={{ fontSize: 14, color: colors.gray800 }}>{formatCurrency(totalTax, currency)}</Text>
                                </View>
                            )}
                            <View style={{ flexDirection: "row", justifyContent: "space-between", paddingTop: 12, marginTop: 8, borderTopWidth: 2, borderTopColor: color }}>
                                <Text style={{ fontSize: 14, fontWeight: 600, color: colors.gray800 }}>{type === "invoice" ? "Total Due" : "Total"}</Text>
                                <Text style={{ fontSize: 18, fontWeight: 700, color: color }}>{formatCurrency(grandTotal, currency)}</Text>
                            </View>
                        </View>
                    </View>

                    {/* Notes & Terms */}
                    {notes && (
                        <View style={{ marginBottom: 20 }}>
                            <Text style={{ fontSize: 13, color: colors.gray600, lineHeight: 1.6 }}>{notes}</Text>
                        </View>
                    )}
                    {terms && (
                        <View wrap={false} style={{ paddingTop: 20, borderTopWidth: 1, borderTopColor: colors.gray200 }}>
                            <Text style={{ fontSize: 11, fontWeight: 600, color: colors.gray700, marginBottom: 8 }}>Terms & Conditions</Text>
                            <Text style={{ fontSize: 12, color: colors.gray500, lineHeight: 1.7 }}>{terms}</Text>
                        </View>
                    )}
                </View>

                {/* Footer with page numbers */}
                <PDFFooter businessName={business.name || "Your Business"} />
            </Page>
        </Document>
    );
}

// ============================================================================
// MINIMALIST TEMPLATE - Matches HTML preview exactly
// ============================================================================
export function MinimalistPDF({ document }: PDFTemplateProps) {
    const { type, business, client, details, items, customTemplate } = document;
    const { terms, notes, currency = "USD" } = details;
    const color = ACCENT_COLORS[document.accentColor as AccentColor] || document.accentColor;
    const { subtotal, totalDiscount, totalTax, grandTotal, taxRateDisplay } = calculateTotals(document);
    const docLabel = type === "invoice" ? "INVOICE" : "QUOTATION";

    return (
        <Document>
            <Page size="A4" style={[baseStyles.page, { paddingHorizontal: 50 }]}>
                {/* Custom Letterhead Background */}
                {customTemplate && (
                    <Image
                        src={customTemplate}
                        style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                        }}
                    />
                )}
                {/* Header */}
                <View style={[baseStyles.row, baseStyles.spaceBetween, { marginBottom: 15 }]}>
                    <View>
                        {business.name && <Text style={{ fontSize: 14, fontWeight: 400, color: colors.gray800, letterSpacing: 1 }}>{business.name}</Text>}
                        {business.address && <Text style={{ fontSize: 9, color: colors.gray500, marginTop: 4 }}>{business.address}</Text>}
                    </View>
                    <View style={{ alignItems: "flex-end" }}>
                        <Text style={{ fontSize: 24, fontWeight: 400, color: color, letterSpacing: 4, textTransform: "uppercase" }}>{docLabel}</Text>
                        <Text style={{ fontSize: 9, color: colors.gray400, marginTop: 6 }}>{details.documentNumber}</Text>
                    </View>
                </View>

                <View style={{ height: 2, backgroundColor: color, marginVertical: 20 }} />

                {/* Billed To & Dates */}
                <View style={[baseStyles.row, baseStyles.spaceBetween, { marginBottom: 52 }]}>
                    <View style={{ maxWidth: 260 }}>
                        <Text style={{ fontSize: 10, fontWeight: 600, color: color, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 14 }}>Billed To</Text>
                        {client.name && <Text style={{ fontSize: 16, fontWeight: 500, color: colors.gray800, lineHeight: 1.4 }}>{client.name}</Text>}
                        {client.company && <Text style={{ fontSize: 14, color: colors.gray500, marginTop: 6, lineHeight: 1.5 }}>{client.company}</Text>}
                        {client.address && <Text style={{ fontSize: 13, color: colors.gray400, marginTop: 12, lineHeight: 1.8 }}>{client.address}</Text>}
                        {client.email && <Text style={{ fontSize: 13, color: colors.gray400, marginTop: 8 }}>{client.email}</Text>}
                    </View>
                    <View style={{ alignItems: "flex-end" }}>
                        <View style={{ marginBottom: 24 }}>
                            <Text style={{ fontSize: 10, fontWeight: 600, color: color, textTransform: "uppercase", letterSpacing: 1.5 }}>Date</Text>
                            <Text style={{ fontSize: 15, fontWeight: 500, color: colors.gray700, marginTop: 8 }}>{formatDate(details.issueDate)}</Text>
                        </View>
                        {details.dueDate && <View>
                            <Text style={{ fontSize: 10, fontWeight: 600, color: color, textTransform: "uppercase", letterSpacing: 1.5 }}>{type === "invoice" ? "Due" : "Valid Until"}</Text>
                            <Text style={{ fontSize: 15, fontWeight: 500, color: colors.gray700, marginTop: 8 }}>{formatDate(details.dueDate)}</Text>
                        </View>}
                    </View>
                </View>

                {/* Items Table - 4 columns */}
                <View style={{ marginBottom: 48 }}>
                    <View style={{ flexDirection: "row", borderBottomWidth: 2, borderBottomColor: color, paddingBottom: 16 }}>
                        <Text style={[baseStyles.colDesc, { fontWeight: 600, color: color, fontSize: 10, textTransform: "uppercase", letterSpacing: 1.5 }]}>Description</Text>
                        <Text style={[baseStyles.colQty, { fontWeight: 600, color: color, fontSize: 10, textTransform: "uppercase", letterSpacing: 1.5 }]}>Qty</Text>
                        <Text style={[baseStyles.colRate, { fontWeight: 600, color: color, fontSize: 10, textTransform: "uppercase", letterSpacing: 1.5 }]}>Rate</Text>
                        <Text style={[baseStyles.colAmount, { fontWeight: 600, color: color, fontSize: 10, textTransform: "uppercase", letterSpacing: 1.5 }]}>Amount</Text>
                    </View>
                    {items.map((item, index) => {
                        const lineTotal = item.quantity * item.unitPrice;
                        return (
                            <View key={index} wrap={false} style={{ flexDirection: "row", paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: colors.gray100 }}>
                                <View style={[baseStyles.colDesc, { flexDirection: "row", alignItems: "center" }]}>
                                    <Text style={{ fontSize: 10, color: colors.gray700 }}>{item.description}</Text>
                                    {item.discountPercent > 0 && <Text style={{ marginLeft: 6, fontSize: 9, color: colors.gray400 }}>{item.discountPercent}% off</Text>}
                                </View>
                                <Text style={[baseStyles.colQty, { fontSize: 10, color: colors.gray500 }]}>{item.quantity}</Text>
                                <Text style={[baseStyles.colRate, { fontSize: 10, color: colors.gray500 }]}>{formatCurrency(item.unitPrice, currency)}</Text>
                                <Text style={[baseStyles.colAmount, { fontSize: 10, color: colors.gray700 }]}>{formatCurrency(lineTotal, currency)}</Text>
                            </View>
                        );
                    })}
                </View>

                <View style={{ height: 1, backgroundColor: colors.gray200, marginVertical: 20 }} />

                {/* Totals */}
                <View style={baseStyles.totalsSection}>
                    <View style={baseStyles.totalRow}>
                        <Text style={{ fontSize: 13, color: colors.gray500 }}>Subtotal</Text>
                        <Text style={{ fontSize: 13, color: colors.gray800 }}>{formatCurrency(subtotal, currency)}</Text>
                    </View>
                    {totalDiscount > 0 && (
                        <View style={baseStyles.totalRow}>
                            <Text style={{ fontSize: 13, color: colors.gray500 }}>Discount</Text>
                            <Text style={{ fontSize: 13, color: colors.green600 }}>-{formatCurrency(totalDiscount, currency)}</Text>
                        </View>
                    )}
                    {totalTax > 0 && (
                        <View style={baseStyles.totalRow}>
                            <Text style={{ fontSize: 13, color: colors.gray500 }}>{taxRateDisplay ? `VAT (${taxRateDisplay}%)` : "VAT"}</Text>
                            <Text style={{ fontSize: 13, color: colors.gray800 }}>{formatCurrency(totalTax, currency)}</Text>
                        </View>
                    )}
                    <View style={[baseStyles.totalRow, { marginTop: 10, paddingTop: 8 }]}>
                        <Text style={{ fontSize: 13, fontWeight: 700, color: colors.gray700 }}>Total</Text>
                        <Text style={{ fontSize: 16, fontWeight: 700, color: colors.gray800 }}>{formatCurrency(grandTotal, currency)}</Text>
                    </View>
                </View>

                {/* Notes & Terms */}
                {notes && (
                    <View style={{ marginTop: 40 }}>
                        <Text style={{ fontSize: 9, color: colors.gray500, lineHeight: 1.6 }}>{notes}</Text>
                    </View>
                )}
                {terms && (
                    <View wrap={false} style={{ marginTop: 20, paddingTop: 20, borderTopWidth: 1, borderTopColor: colors.gray200 }}>
                        <Text style={{ fontSize: 10, fontWeight: 600, color: color, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 10 }}>Terms</Text>
                        <Text style={{ fontSize: 12, color: colors.gray400, lineHeight: 1.8 }}>{terms}</Text>
                    </View>
                )}

                {/* Footer with page numbers */}
                <PDFFooter businessName={business.name || "Your Business"} />
            </Page>
        </Document>
    );
}

// ============================================================================
// CORPORATE TEMPLATE
// ============================================================================
export function CorporatePDF({ document }: PDFTemplateProps) {
    const { type, business, client, details, items, customTemplate } = document;
    const { terms, notes, currency = "USD" } = details;
    const color = ACCENT_COLORS[document.accentColor as AccentColor] || document.accentColor;
    const { subtotal, totalDiscount, totalTax, grandTotal, taxRateDisplay } = calculateTotals(document);
    const docLabel = type === "invoice" ? "INVOICE" : "QUOTATION";

    return (
        <Document>
            <Page size="A4" style={[baseStyles.page, { paddingLeft: 0, paddingTop: 0, paddingBottom: 0 }]}>
                {/* Custom Letterhead Background */}
                {customTemplate && (
                    <Image
                        src={customTemplate}
                        style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                        }}
                    />
                )}
                <View style={{ flexDirection: "row", minHeight: "100%" }}>
                    {/* Sidebar */}
                    <View style={{ width: 190, backgroundColor: color, padding: 24, paddingTop: 44, justifyContent: "space-between", minHeight: "100%" }}>
                        <View>
                            {business.logo && (
                                <View style={{ width: 56, height: 56, backgroundColor: "rgba(255,255,255,0.12)", borderRadius: 12, alignItems: "center", justifyContent: "center", marginBottom: 24 }}>
                                    <Image src={business.logo} style={{ width: 40, height: 40 }} />
                                </View>
                            )}
                            {business.name && <Text style={{ fontSize: 16, fontWeight: 600, color: colors.white, marginBottom: 20, lineHeight: 1.4 }}>{business.name}</Text>}
                            <View style={{ gap: 10 }}>
                                {business.address && <Text style={{ fontSize: 11, color: colors.white, opacity: 0.9, lineHeight: 1.5 }}>{business.address}</Text>}
                                {business.email && <Text style={{ fontSize: 11, color: colors.white, opacity: 0.9 }}>{business.email}</Text>}
                                {business.phone && <Text style={{ fontSize: 11, color: colors.white, opacity: 0.9 }}>{business.phone}</Text>}
                            </View>
                        </View>
                        {/* Document Type at bottom */}
                        <View style={{ paddingTop: 32 }}>
                            <Text style={{ fontSize: 9, color: colors.white, opacity: 0.6, textTransform: "uppercase", letterSpacing: 1.5 }}>Document</Text>
                            <Text style={{ fontSize: 22, fontWeight: 700, color: colors.white, marginTop: 8 }}>{type === "invoice" ? "Invoice" : "Quote"}</Text>
                            <Text style={{ fontSize: 12, color: colors.white, opacity: 0.85, marginTop: 4 }}>{details.documentNumber}</Text>
                        </View>
                    </View>

                    {/* Main Content */}
                    <View style={{ flex: 1, padding: 40 }}>
                        {/* Client & Dates */}
                        <View style={[baseStyles.row, baseStyles.spaceBetween, { marginBottom: 40 }]}>
                            <View style={{ maxWidth: 220 }}>
                                <Text style={{ fontSize: 10, fontWeight: 600, color: color, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 12 }}>Bill To</Text>
                                {client.name && <Text style={{ fontSize: 15, fontWeight: 600, color: colors.gray900, lineHeight: 1.4 }}>{client.name}</Text>}
                                {client.company && <Text style={{ fontSize: 13, color: colors.gray600, marginTop: 4, lineHeight: 1.5 }}>{client.company}</Text>}
                                {client.address && <Text style={{ fontSize: 12, color: colors.gray500, marginTop: 10, lineHeight: 1.6 }}>{client.address}</Text>}
                                {client.email && <Text style={{ fontSize: 12, color: colors.gray500, marginTop: 6 }}>{client.email}</Text>}
                            </View>
                            <View style={{ alignItems: "flex-end" }}>
                                <View style={{ marginBottom: 14 }}>
                                    <Text style={{ fontSize: 9, color: colors.gray400, fontWeight: 500, textTransform: "uppercase", letterSpacing: 1 }}>Issue Date</Text>
                                    <Text style={{ fontSize: 13, fontWeight: 500, color: colors.gray800, marginTop: 3 }}>{formatDate(details.issueDate)}</Text>
                                </View>
                                {details.dueDate && <View style={{ marginBottom: 14 }}>
                                    <Text style={{ fontSize: 9, color: colors.gray400, fontWeight: 500, textTransform: "uppercase", letterSpacing: 1 }}>Due Date</Text>
                                    <Text style={{ fontSize: 13, fontWeight: 500, color: colors.gray800, marginTop: 3 }}>{formatDate(details.dueDate)}</Text>
                                </View>}
                            </View>
                        </View>

                        {/* Items Table - 4 columns */}
                        <View style={{ marginBottom: 20 }}>
                            <View style={{ flexDirection: "row", borderBottomWidth: 2, borderBottomColor: color, paddingBottom: 8 }}>
                                <Text style={[baseStyles.colDesc, { fontWeight: 600, color: color, fontSize: 9, textTransform: "uppercase", letterSpacing: 0.5 }]}>Item</Text>
                                <Text style={[baseStyles.colQty, { fontWeight: 600, color: color, fontSize: 9, textTransform: "uppercase", letterSpacing: 0.5 }]}>Qty</Text>
                                <Text style={[baseStyles.colRate, { fontWeight: 600, color: color, fontSize: 9, textTransform: "uppercase", letterSpacing: 0.5 }]}>Rate</Text>
                                <Text style={[baseStyles.colAmount, { fontWeight: 600, color: color, fontSize: 9, textTransform: "uppercase", letterSpacing: 0.5 }]}>Total</Text>
                            </View>
                            {items.map((item, index) => {
                                const lineTotal = item.quantity * item.unitPrice;
                                return (
                                    <View key={index} wrap={false} style={{ flexDirection: "row", paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: colors.gray100 }}>
                                        <View style={[baseStyles.colDesc, { flexDirection: "row", alignItems: "center" }]}>
                                            <Text style={{ fontSize: 10, color: colors.gray800 }}>{item.description}</Text>
                                            {item.discountPercent > 0 && <Text style={{ marginLeft: 6, fontSize: 9, color: colors.gray400 }}>{item.discountPercent}% off</Text>}
                                        </View>
                                        <Text style={[baseStyles.colQty, { fontSize: 10, color: colors.gray600 }]}>{item.quantity}</Text>
                                        <Text style={[baseStyles.colRate, { fontSize: 10, color: colors.gray600 }]}>{formatCurrency(item.unitPrice, currency)}</Text>
                                        <Text style={[baseStyles.colAmount, { fontSize: 10, fontWeight: 700, color: colors.gray800 }]}>{formatCurrency(lineTotal, currency)}</Text>
                                    </View>
                                );
                            })}
                        </View>

                        {/* Totals */}
                        <View style={baseStyles.totalsSection}>
                            <View style={baseStyles.totalRow}>
                                <Text style={baseStyles.totalLabel}>Subtotal</Text>
                                <Text style={baseStyles.totalValue}>{formatCurrency(subtotal, currency)}</Text>
                            </View>
                            {totalDiscount > 0 && (
                                <View style={baseStyles.totalRow}>
                                    <Text style={baseStyles.totalLabel}>Discount</Text>
                                    <Text style={[baseStyles.totalValue, { color: colors.green600 }]}>-{formatCurrency(totalDiscount, currency)}</Text>
                                </View>
                            )}
                            {totalTax > 0 && (
                                <View style={baseStyles.totalRow}>
                                    <Text style={baseStyles.totalLabel}>{taxRateDisplay ? `VAT (${taxRateDisplay}%)` : "VAT"}</Text>
                                    <Text style={baseStyles.totalValue}>{formatCurrency(totalTax, currency)}</Text>
                                </View>
                            )}
                            <View style={[baseStyles.totalRow, { marginTop: 8, paddingTop: 8, borderTopWidth: 2, borderTopColor: color }]}>
                                <Text style={{ fontSize: 12, fontWeight: 600, color: colors.gray800 }}>Total</Text>
                                <Text style={{ fontSize: 14, fontWeight: 700, color: color }}>{formatCurrency(grandTotal, currency)}</Text>
                            </View>
                        </View>

                        {/* Notes & Terms */}
                        {notes && (
                            <View style={{ marginTop: 20 }}>
                                <Text style={baseStyles.termsText}>{notes}</Text>
                            </View>
                        )}
                        {terms && (
                            <View style={baseStyles.terms} wrap={false}>
                                <Text style={baseStyles.termsTitle}>Terms & Conditions</Text>
                                <Text style={baseStyles.termsText}>{terms}</Text>
                            </View>
                        )}
                    </View>
                </View>

                {/* Footer with page numbers */}
                <View style={[baseStyles.footer, { left: 140 }]} fixed>
                    <Text style={baseStyles.footerText}>{business.name || "Your Business"}</Text>
                    <Text style={baseStyles.footerText} render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`} />
                </View>
            </Page>
        </Document>
    );
}

// ============================================================================
// CREATIVE TEMPLATE - 4 columns
// ============================================================================
export function CreativePDF({ document }: PDFTemplateProps) {
    const { type, business, client, details, items, customTemplate } = document;
    const { terms, notes, currency = "USD" } = details;
    const color = ACCENT_COLORS[document.accentColor as AccentColor] || document.accentColor;
    const { subtotal, totalDiscount, totalTax, grandTotal, taxRateDisplay } = calculateTotals(document);
    const docLabel = type === "invoice" ? "INVOICE" : "QUOTATION";
    const lightColor = lightenColor(color, 0.85);

    return (
        <Document>
            <Page size="A4" style={baseStyles.page}>
                {/* Custom Letterhead Background */}
                {customTemplate && (
                    <Image
                        src={customTemplate}
                        style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                        }}
                    />
                )}
                {/* Header */}
                <View style={[baseStyles.row, baseStyles.spaceBetween, { marginBottom: 20 }]}>
                    <View>
                        {business.logo && (
                            <View style={{ width: 58, height: 58, borderRadius: 29, backgroundColor: lightColor, alignItems: "center", justifyContent: "center", marginBottom: 10 }}>
                                <Image src={business.logo} style={{ width: 40, height: 40 }} />
                            </View>
                        )}
                        {business.name && <Text style={{ fontSize: 18, fontWeight: 700, color: colors.gray800 }}>{business.name}</Text>}
                        {business.address && <Text style={{ fontSize: 9, color: colors.gray500, marginTop: 4 }}>{business.address}</Text>}
                    </View>
                    <View style={{ alignItems: "flex-end" }}>
                        <Text style={{ fontSize: 32, fontWeight: 700, color: color, letterSpacing: 2 }}>{docLabel}</Text>
                        <View style={{ backgroundColor: lightColor, paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12, marginTop: 8 }}>
                            <Text style={{ fontSize: 10, color: color }}>#{details.documentNumber}</Text>
                        </View>
                    </View>
                </View>

                {/* Accent Bar */}
                <View style={{ height: 4, backgroundColor: color, borderRadius: 2, marginBottom: 20 }} />

                {/* Bill To & Dates */}
                <View style={[baseStyles.row, baseStyles.spaceBetween, { marginBottom: 30 }]}>
                    <View style={{ borderLeftWidth: 3, borderLeftColor: color, paddingLeft: 12 }}>
                        <Text style={{ fontSize: 9, fontWeight: 600, color: colors.gray500, marginBottom: 6 }}>Bill To</Text>
                        {client.name && <Text style={{ fontSize: 12, fontWeight: 600, color: colors.gray800 }}>{client.name}</Text>}
                        {client.company && <Text style={{ fontSize: 9, color: colors.gray600, marginTop: 2 }}>{client.company}</Text>}
                        {client.address && <Text style={{ fontSize: 9, color: colors.gray600, marginTop: 2 }}>{client.address}</Text>}
                    </View>
                    <View style={{ alignItems: "flex-end" }}>
                        <Text style={{ fontSize: 9, color: colors.gray600 }}>Issued: {formatDate(details.issueDate)}</Text>
                        {details.dueDate ? (
                            <Text style={{ fontSize: 9, color: colors.gray600, marginTop: 4 }}>
                                {type === "invoice" ? "Due" : "Valid"}: {formatDate(details.dueDate)}
                            </Text>
                        ) : null}
                    </View>
                </View>

                {/* Items Table - 4 columns */}
                <View style={{ marginBottom: 20 }}>
                    <View style={{ flexDirection: "row", backgroundColor: color, padding: 10, borderRadius: 4 }}>
                        <Text style={[baseStyles.colDesc, { fontWeight: 600, color: colors.white, fontSize: 10, textTransform: "uppercase", letterSpacing: 0.5 }]}>Description</Text>
                        <Text style={[baseStyles.colQty, { fontWeight: 600, color: colors.white, fontSize: 10, textTransform: "uppercase", letterSpacing: 0.5 }]}>Qty</Text>
                        <Text style={[baseStyles.colRate, { fontWeight: 600, color: colors.white, fontSize: 10, textTransform: "uppercase", letterSpacing: 0.5 }]}>Rate</Text>
                        <Text style={[baseStyles.colAmount, { fontWeight: 600, color: colors.white, fontSize: 10, textTransform: "uppercase", letterSpacing: 0.5 }]}>Amount</Text>
                    </View>
                    {items.map((item, index) => {
                        const lineTotal = item.quantity * item.unitPrice;
                        return (
                            <View key={index} wrap={false} style={{ flexDirection: "row", paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: colors.gray100 }}>
                                <View style={[baseStyles.colDesc, { flexDirection: "row", alignItems: "center" }]}>
                                    <Text style={{ fontSize: 11, color: colors.gray800 }}>{item.description}</Text>
                                    {item.discountPercent > 0 && <Text style={{ marginLeft: 6, fontSize: 10, color: colors.gray400 }}>{item.discountPercent}% off</Text>}
                                </View>
                                <Text style={[baseStyles.colQty, { fontSize: 11, color: colors.gray600 }]}>{item.quantity}</Text>
                                <Text style={[baseStyles.colRate, { fontSize: 11, color: colors.gray600 }]}>{formatCurrency(item.unitPrice, currency)}</Text>
                                <Text style={[baseStyles.colAmount, { fontSize: 11, fontWeight: 700, color: colors.gray800 }]}>{formatCurrency(lineTotal, currency)}</Text>
                            </View>
                        );
                    })}
                </View>

                {/* Totals */}
                <View style={baseStyles.totalsSection}>
                    <View style={[{ backgroundColor: lightColor, padding: 15, borderRadius: 8 }]}>
                        <View style={baseStyles.totalRow}>
                            <Text style={baseStyles.totalLabel}>Subtotal</Text>
                            <Text style={baseStyles.totalValue}>{formatCurrency(subtotal, currency)}</Text>
                        </View>
                        {totalDiscount > 0 && (
                            <View style={baseStyles.totalRow}>
                                <Text style={baseStyles.totalLabel}>Discount</Text>
                                <Text style={[baseStyles.totalValue, { color: colors.green600 }]}>-{formatCurrency(totalDiscount, currency)}</Text>
                            </View>
                        )}
                        {totalTax > 0 && (
                            <View style={baseStyles.totalRow}>
                                <Text style={baseStyles.totalLabel}>{taxRateDisplay ? `VAT (${taxRateDisplay}%)` : "VAT"}</Text>
                                <Text style={baseStyles.totalValue}>{formatCurrency(totalTax, currency)}</Text>
                            </View>
                        )}
                        <View style={[baseStyles.totalRow, { marginTop: 10, paddingTop: 10, borderTopWidth: 2, borderTopColor: color }]}>
                            <Text style={{ fontSize: 12, fontWeight: 600, color: colors.gray800 }}>Total</Text>
                            <Text style={{ fontSize: 16, fontWeight: 700, color: color }}>{formatCurrency(grandTotal, currency)}</Text>
                        </View>
                    </View>
                </View>

                {/* Notes & Terms */}
                {notes && (
                    <View style={{ marginTop: 20 }}>
                        <Text style={baseStyles.termsText}>{notes}</Text>
                    </View>
                )}
                {terms && (
                    <View style={baseStyles.terms} wrap={false}>
                        <Text style={baseStyles.termsTitle}>Terms & Conditions</Text>
                        <Text style={baseStyles.termsText}>{terms}</Text>
                    </View>
                )}

                {/* Footer with page numbers */}
                <PDFFooter businessName={business.name || "Your Business"} />
            </Page>
        </Document>
    );
}

// ============================================================================
// SIMPLE CLEAN TEMPLATE - 4 columns
// ============================================================================
export function SimpleCleanPDF({ document }: PDFTemplateProps) {
    const { type, business, client, details, items, customTemplate } = document;
    const { terms, notes, currency = "USD" } = details;
    const color = ACCENT_COLORS[document.accentColor as AccentColor] || document.accentColor;
    const { subtotal, totalDiscount, totalTax, grandTotal, taxRateDisplay } = calculateTotals(document);
    const docLabel = type === "invoice" ? "INVOICE" : "QUOTATION";

    return (
        <Document>
            <Page size="A4" style={baseStyles.page}>
                {/* Custom Letterhead Background */}
                {customTemplate && (
                    <Image
                        src={customTemplate}
                        style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                        }}
                    />
                )}
                {/* Header */}
                <View style={[baseStyles.row, baseStyles.spaceBetween, { marginBottom: 40 }]}>
                    <View>
                        <Text style={{ fontSize: 36, fontWeight: 700, color: color, letterSpacing: 2 }}>{docLabel}</Text>
                        <Text style={{ fontSize: 12, color: colors.gray500, marginTop: 8 }}>#{details.documentNumber}</Text>
                    </View>
                    <View style={{ alignItems: "flex-end" }}>
                        {business.name && <Text style={{ fontSize: 14, fontWeight: 600, color: colors.gray800 }}>{business.name}</Text>}
                        {business.address && <Text style={{ fontSize: 10, color: colors.gray500, marginTop: 4 }}>{business.address}</Text>}
                        {business.email && <Text style={{ fontSize: 10, color: colors.gray500, marginTop: 2 }}>{business.email}</Text>}
                    </View>
                </View>

                {/* Bill To & Dates */}
                <View style={[baseStyles.row, baseStyles.spaceBetween, { marginBottom: 30, paddingBottom: 20, borderBottomWidth: 1, borderBottomColor: colors.gray200 }]}>
                    <View>
                        <Text style={{ fontSize: 9, fontWeight: 600, color: colors.gray500, marginBottom: 6, textTransform: "uppercase" }}>Bill To</Text>
                        {client.name && <Text style={{ fontSize: 11, fontWeight: 700, color: colors.gray800 }}>{client.name}</Text>}
                        {client.company && <Text style={{ fontSize: 9, color: colors.gray600, marginTop: 2 }}>{client.company}</Text>}
                        {client.address && <Text style={{ fontSize: 9, color: colors.gray600, marginTop: 2 }}>{client.address}</Text>}
                    </View>
                    <View style={{ alignItems: "flex-end" }}>
                        <View style={{ marginBottom: 12, alignItems: "flex-end" }}>
                            <Text style={{ fontSize: 9, fontWeight: 600, color: colors.gray400, textTransform: "uppercase" }}>Date</Text>
                            <Text style={{ fontSize: 11, color: colors.gray700, marginTop: 4 }}>{formatDate(details.issueDate)}</Text>
                        </View>
                        {details.dueDate ? (
                            <View style={{ alignItems: "flex-end" }}>
                                <Text style={{ fontSize: 9, fontWeight: 600, color: colors.gray400, textTransform: "uppercase" }}>Due Date</Text>
                                <Text style={{ fontSize: 11, color: colors.gray700, marginTop: 4 }}>{formatDate(details.dueDate)}</Text>
                            </View>
                        ) : null}
                    </View>
                </View>

                {/* Items Table - 4 columns */}
                <View style={{ marginBottom: 20 }}>
                    <View style={{ flexDirection: "row", borderBottomWidth: 2, borderBottomColor: color, paddingBottom: 8 }}>
                        <Text style={[baseStyles.colDesc, { fontWeight: 600, color: colors.gray400, fontSize: 11, textTransform: "uppercase" }]}>Description</Text>
                        <Text style={[baseStyles.colQty, { fontWeight: 600, color: colors.gray400, fontSize: 11, textTransform: "uppercase" }]}>Qty</Text>
                        <Text style={[baseStyles.colRate, { fontWeight: 600, color: colors.gray400, fontSize: 11, textTransform: "uppercase" }]}>Rate</Text>
                        <Text style={[baseStyles.colAmount, { fontWeight: 600, color: colors.gray400, fontSize: 11, textTransform: "uppercase" }]}>Amount</Text>
                    </View>
                    {items.map((item, index) => {
                        const lineTotal = item.quantity * item.unitPrice;
                        return (
                            <View key={index} wrap={false} style={{ flexDirection: "row", paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: colors.gray100 }}>
                                <View style={[baseStyles.colDesc, { flexDirection: "row", alignItems: "center" }]}>
                                    <Text style={{ fontSize: 11, color: colors.gray800 }}>{item.description}</Text>
                                    {item.discountPercent > 0 && <Text style={{ marginLeft: 6, fontSize: 10, color: colors.gray400 }}>{item.discountPercent}% off</Text>}
                                </View>
                                <Text style={[baseStyles.colQty, { fontSize: 11, color: colors.gray600 }]}>{item.quantity}</Text>
                                <Text style={[baseStyles.colRate, { fontSize: 11, color: colors.gray600 }]}>{formatCurrency(item.unitPrice, currency)}</Text>
                                <Text style={[baseStyles.colAmount, { fontSize: 11, fontWeight: 700, color: colors.gray800 }]}>{formatCurrency(lineTotal, currency)}</Text>
                            </View>
                        );
                    })}
                </View>

                {/* Totals */}
                <View style={baseStyles.totalsSection}>
                    <View style={baseStyles.totalRow}>
                        <Text style={baseStyles.totalLabel}>Subtotal</Text>
                        <Text style={baseStyles.totalValue}>{formatCurrency(subtotal, currency)}</Text>
                    </View>
                    {totalDiscount > 0 && (
                        <View style={baseStyles.totalRow}>
                            <Text style={baseStyles.totalLabel}>Discount</Text>
                            <Text style={[baseStyles.totalValue, { color: colors.green600 }]}>-{formatCurrency(totalDiscount, currency)}</Text>
                        </View>
                    )}
                    {totalTax > 0 && (
                        <View style={baseStyles.totalRow}>
                            <Text style={baseStyles.totalLabel}>{taxRateDisplay ? `VAT (${taxRateDisplay}%)` : "VAT"}</Text>
                            <Text style={baseStyles.totalValue}>{formatCurrency(totalTax, currency)}</Text>
                        </View>
                    )}
                    <View style={[baseStyles.totalRow, { marginTop: 10, paddingTop: 10, borderTopWidth: 2, borderTopColor: color }]}>
                        <Text style={{ fontSize: 14, fontWeight: 600, color: colors.gray800 }}>Total</Text>
                        <Text style={{ fontSize: 18, fontWeight: 700, color: color }}>{formatCurrency(grandTotal, currency)}</Text>
                    </View>
                </View>

                {/* Notes & Terms */}
                {notes && (
                    <View style={{ marginTop: 20 }}>
                        <Text style={baseStyles.termsText}>{notes}</Text>
                    </View>
                )}
                {terms && (
                    <View style={baseStyles.terms} wrap={false}>
                        <Text style={baseStyles.termsTitle}>Terms & Conditions</Text>
                        <Text style={baseStyles.termsText}>{terms}</Text>
                    </View>
                )}

                {/* Footer with page numbers */}
                <PDFFooter businessName={business.name || "Your Business"} />
            </Page>
        </Document>
    );
}

// ============================================================================
// SIGNATURE TEMPLATE
// ============================================================================
export function SignaturePDF({ document }: PDFTemplateProps) {
    const { type, business, client, details, items, customTemplate } = document;
    const { terms, notes, currency = "USD" } = details;
    const color = ACCENT_COLORS[document.accentColor as AccentColor] || document.accentColor;
    const { subtotal, totalDiscount, totalTax, grandTotal, taxRateDisplay } = calculateTotals(document);
    const docLabel = type === "invoice" ? "Invoice" : "Quotation";

    return (
        <Document>
            <Page size="A4" style={[baseStyles.page, { paddingHorizontal: 48 }]}>
                {/* Custom Letterhead Background */}
                {customTemplate && (
                    <Image
                        src={customTemplate}
                        style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                        }}
                    />
                )}
                <View style={[baseStyles.row, baseStyles.spaceBetween, { marginBottom: 48 }]}>
                    <View>
                        {business.name && <Text style={{ fontSize: 20, fontWeight: 600, color: colors.gray800, marginBottom: 4 }}>{business.name}</Text>}
                        {business.address && <Text style={{ fontSize: 11, color: colors.gray500 }}>{business.address}</Text>}
                    </View>
                    <View style={{ alignItems: "flex-end" }}>
                        <Text style={{ fontSize: 28, fontWeight: 400, color: colors.gray800, letterSpacing: 3, textTransform: "uppercase" }}>{docLabel}</Text>
                        <Text style={{ fontSize: 12, color: colors.gray500, marginTop: 8 }}>#{details.documentNumber}</Text>
                    </View>
                </View>
                <View style={[baseStyles.row, { gap: 48, marginBottom: 36 }]}>
                    <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: 10, fontWeight: 600, color: color, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Billed To</Text>
                        {client.name && <Text style={{ fontSize: 14, fontWeight: 700, color: colors.gray800 }}>{client.name}</Text>}
                        {client.address && <Text style={{ fontSize: 12, color: colors.gray500, marginTop: 4 }}>{client.address}</Text>}
                    </View>
                    <View>
                        <Text style={{ fontSize: 11, color: colors.gray400 }}>Date: {formatDate(details.issueDate)}</Text>
                        {details.dueDate ? <Text style={{ fontSize: 11, color: colors.gray400, marginTop: 4 }}>Due: {formatDate(details.dueDate)}</Text> : null}
                    </View>
                </View>
                <View style={baseStyles.table}>
                    <View style={[baseStyles.tableHeader, { borderBottomColor: colors.gray200 }]}>
                        <Text style={{ width: "50%", fontSize: 10, fontWeight: 600, color: colors.gray400, textTransform: "uppercase" }}>Item</Text>
                        <Text style={{ width: "15%", textAlign: "center", fontSize: 10, fontWeight: 600, color: colors.gray400 }}>Qty</Text>
                        <Text style={{ width: "17%", textAlign: "right", fontSize: 10, fontWeight: 600, color: colors.gray400 }}>Price</Text>
                        <Text style={{ width: "18%", textAlign: "right", fontSize: 10, fontWeight: 600, color: colors.gray400 }}>Total</Text>
                    </View>
                    {items.map((item, index) => (
                        <View key={index} style={[baseStyles.tableRow, { borderBottomColor: colors.gray100 }]}>
                            <Text style={{ width: "50%", fontSize: 13, color: colors.gray700 }}>{item.description}</Text>
                            <Text style={{ width: "15%", textAlign: "center", fontSize: 13, color: colors.gray500 }}>{item.quantity}</Text>
                            <Text style={{ width: "17%", textAlign: "right", fontSize: 13, color: colors.gray500 }}>{formatCurrency(item.unitPrice, currency)}</Text>
                            <Text style={{ width: "18%", textAlign: "right", fontSize: 13, fontWeight: 700, color: colors.gray800 }}>{formatCurrency(item.quantity * item.unitPrice, currency)}</Text>
                        </View>
                    ))}
                </View>
                <View style={{ alignItems: "flex-end", marginBottom: 48 }}>
                    <View style={{ width: 220 }}>
                        <View style={[baseStyles.totalRow, { padding: 8 }]}><Text style={{ fontSize: 12, color: colors.gray500 }}>Subtotal</Text><Text style={{ fontSize: 12, color: colors.gray700 }}>{formatCurrency(subtotal, currency)}</Text></View>
                        {totalDiscount > 0 && <View style={[baseStyles.totalRow, { padding: 8 }]}><Text style={{ fontSize: 12, color: colors.gray500 }}>Discount</Text><Text style={{ fontSize: 12, color: colors.green600 }}>-{formatCurrency(totalDiscount, currency)}</Text></View>}
                        {totalTax > 0 && <View style={[baseStyles.totalRow, { padding: 8 }]}><Text style={{ fontSize: 12, color: colors.gray500 }}>{taxRateDisplay ? `VAT (${taxRateDisplay}%)` : "VAT"}</Text><Text style={{ fontSize: 12, color: colors.gray700 }}>{formatCurrency(totalTax, currency)}</Text></View>}
                        <View style={[baseStyles.totalRow, { padding: 14, marginTop: 8, borderTopWidth: 1, borderTopColor: colors.gray300 }]}><Text style={{ fontSize: 13, fontWeight: 600, color: colors.gray700 }}>Total Due</Text><Text style={{ fontSize: 16, fontWeight: 600, color: colors.gray900 }}>{formatCurrency(grandTotal, currency)}</Text></View>
                    </View>
                </View>
                <View style={[baseStyles.row, baseStyles.spaceBetween, { alignItems: "flex-end", marginTop: "auto", paddingTop: 32 }]}>
                    <View style={{ maxWidth: 280 }}>
                        {notes && <Text style={{ fontSize: 12, color: colors.gray500, lineHeight: 1.7, marginBottom: 16 }}>{notes}</Text>}
                        {terms && <Text style={{ fontSize: 10, color: colors.gray400, lineHeight: 1.6 }}>{terms}</Text>}
                    </View>
                    <View style={{ alignItems: "center" }}>
                        <View style={{ width: 180, borderBottomWidth: 1, borderBottomColor: colors.gray300, marginBottom: 8, paddingBottom: 40 }} />
                        <Text style={{ fontSize: 10, color: colors.gray400, textTransform: "uppercase", letterSpacing: 1 }}>Authorized Signature</Text>
                    </View>
                </View>

                {/* Footer with page numbers */}
                <PDFFooter businessName={business.name || "Your Business"} />
            </Page>
        </Document>
    );
}

// ============================================================================
// TOTAL HIGHLIGHT TEMPLATE
// ============================================================================
export function TotalHighlightPDF({ document }: PDFTemplateProps) {
    const { type, business, client, details, items, customTemplate } = document;
    const { terms, currency = "USD" } = details;
    const color = ACCENT_COLORS[document.accentColor as AccentColor] || document.accentColor;
    const { subtotal, totalDiscount, totalTax, grandTotal, taxRateDisplay } = calculateTotals(document);
    const docLabel = type === "invoice" ? "INVOICE" : "QUOTATION";

    return (
        <Document>
            <Page size="A4" style={baseStyles.page}>
                {/* Custom Letterhead Background */}
                {customTemplate && (
                    <Image
                        src={customTemplate}
                        style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                        }}
                    />
                )}
                <View style={[baseStyles.row, baseStyles.spaceBetween, { marginBottom: 32 }]}>
                    <View>
                        {business.name && <Text style={{ fontSize: 22, fontWeight: 700, color: colors.gray800 }}>{business.name}</Text>}
                        {business.address && <Text style={{ fontSize: 11, color: colors.gray500, marginTop: 8 }}>{business.address}</Text>}
                    </View>
                    <View style={{ backgroundColor: color, padding: 20, borderRadius: 8, alignItems: "center" }}>
                        <Text style={{ fontSize: 10, color: colors.white, textTransform: "uppercase", letterSpacing: 1 }}>{docLabel} Total</Text>
                        <Text style={{ fontSize: 26, fontWeight: 700, color: colors.white, marginTop: 8 }}>{formatCurrency(grandTotal, currency)}</Text>
                    </View>
                </View>
                <View style={[baseStyles.row, { gap: 32, marginBottom: 28, paddingBottom: 20, borderBottomWidth: 1, borderBottomColor: colors.gray200 }]}>
                    <View><Text style={{ fontSize: 10, color: colors.gray400, textTransform: "uppercase" }}>{docLabel} #</Text><Text style={{ fontSize: 13, fontWeight: 600, color: colors.gray700, marginTop: 4 }}>{details.documentNumber}</Text></View>
                    <View><Text style={{ fontSize: 10, color: colors.gray400, textTransform: "uppercase" }}>Issue Date</Text><Text style={{ fontSize: 13, color: colors.gray700, marginTop: 4 }}>{formatDate(details.issueDate)}</Text></View>
                    {details.dueDate ? <View><Text style={{ fontSize: 10, color: colors.gray400, textTransform: "uppercase" }}>Due Date</Text><Text style={{ fontSize: 13, color: colors.gray700, marginTop: 4 }}>{formatDate(details.dueDate)}</Text></View> : null}
                </View>
                <View style={{ marginBottom: 28 }}>
                    <Text style={{ fontSize: 10, fontWeight: 600, color: color, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Bill To</Text>
                    {client.name && <Text style={{ fontSize: 14, fontWeight: 600, color: colors.gray800 }}>{client.name}</Text>}
                    {client.address && <Text style={{ fontSize: 12, color: colors.gray500, marginTop: 4 }}>{client.address}</Text>}
                    {client.email && <Text style={{ fontSize: 12, color: colors.gray500, marginTop: 4 }}>{client.email}</Text>}
                </View>
                <View style={baseStyles.table}>
                    <View style={[baseStyles.tableHeader, { backgroundColor: colors.gray50, paddingHorizontal: 16 }]}>
                        <Text style={[baseStyles.colDesc, { fontWeight: 600, color: colors.gray500 }]}>Description</Text>
                        <Text style={[baseStyles.colQty, { fontWeight: 600, color: colors.gray500 }]}>Qty</Text>
                        <Text style={[baseStyles.colPrice, { fontWeight: 600, color: colors.gray500 }]}>Rate</Text>
                        <Text style={[baseStyles.colTotal, { width: "20%", fontWeight: 600, color: colors.gray500 }]}>Amount</Text>
                    </View>
                    {items.map((item, index) => (
                        <View key={index} style={[baseStyles.tableRow, { paddingHorizontal: 16 }]}>
                            <Text style={[baseStyles.colDesc, { color: colors.gray700 }]}>{item.description}</Text>
                            <Text style={[baseStyles.colQty, { color: colors.gray500 }]}>{item.quantity}</Text>
                            <Text style={[baseStyles.colPrice, { color: colors.gray500 }]}>{formatCurrency(item.unitPrice, currency)}</Text>
                            <Text style={[baseStyles.colTotal, { width: "20%", fontWeight: 600, color: colors.gray800 }]}>{formatCurrency(item.quantity * item.unitPrice, currency)}</Text>
                        </View>
                    ))}
                </View>
                <View style={baseStyles.totalsSection}>
                    <View style={baseStyles.totalRow}><Text style={baseStyles.totalLabel}>Subtotal</Text><Text style={baseStyles.totalValue}>{formatCurrency(subtotal, currency)}</Text></View>
                    {totalDiscount > 0 && <View style={baseStyles.totalRow}><Text style={baseStyles.totalLabel}>Discount</Text><Text style={[baseStyles.totalValue, { color: colors.green600 }]}>-{formatCurrency(totalDiscount, currency)}</Text></View>}
                    {totalTax > 0 && <View style={baseStyles.totalRow}><Text style={baseStyles.totalLabel}>{taxRateDisplay ? `VAT (${taxRateDisplay}%)` : "Tax"}</Text><Text style={baseStyles.totalValue}>{formatCurrency(totalTax, currency)}</Text></View>}
                </View>
                {terms && <View style={baseStyles.terms} wrap={false}><Text style={baseStyles.termsTitle}>Terms & Conditions</Text><Text style={baseStyles.termsText}>{terms}</Text></View>}

                {/* Footer with page numbers */}
                <PDFFooter businessName={business.name || "Your Business"} />
            </Page>
        </Document>
    );
}

// ============================================================================
// BLUE BANNER TEMPLATE
// ============================================================================
export function BlueBannerPDF({ document }: PDFTemplateProps) {
    const { type, business, client, details, items, customTemplate } = document;
    const { terms, currency = "USD" } = details;
    const color = ACCENT_COLORS[document.accentColor as AccentColor] || document.accentColor;
    const { subtotal, totalDiscount, totalTax, grandTotal, taxRateDisplay } = calculateTotals(document);
    const docLabel = type === "invoice" ? "INVOICE" : "QUOTATION";

    return (
        <Document>
            <Page size="A4" style={[baseStyles.page, { paddingTop: 0 }]}>
                {/* Custom Letterhead Background */}
                {customTemplate && (
                    <Image
                        src={customTemplate}
                        style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                        }}
                    />
                )}
                <View style={{ backgroundColor: color, marginHorizontal: -40, paddingHorizontal: 40, paddingVertical: 24, marginBottom: 30 }}>
                    <View style={[baseStyles.row, baseStyles.spaceBetween, { alignItems: "center" }]}>
                        <View>
                            {business.name && <Text style={{ fontSize: 18, fontWeight: 700, color: colors.white }}>{business.name}</Text>}
                            {business.address && <Text style={{ fontSize: 10, color: colors.white, opacity: 0.85, marginTop: 4 }}>{business.address}</Text>}
                        </View>
                        <Text style={{ fontSize: 14, color: colors.white, letterSpacing: 2 }}>★ {docLabel} ★</Text>
                    </View>
                </View>
                <View style={[baseStyles.row, baseStyles.spaceBetween, { marginBottom: 32 }]}>
                    <View>
                        <Text style={{ fontSize: 10, fontWeight: 600, color: colors.gray400, textTransform: "uppercase", marginBottom: 8 }}>Bill To</Text>
                        {client.name && <Text style={{ fontSize: 14, fontWeight: 600, color: colors.gray800 }}>{client.name}</Text>}
                        {client.address && <Text style={{ fontSize: 12, color: colors.gray500, marginTop: 4 }}>{client.address}</Text>}
                    </View>
                    <View style={{ alignItems: "flex-end" }}>
                        <Text style={{ fontSize: 12, color: colors.gray500, marginBottom: 4 }}>{docLabel} #: <Text style={{ fontWeight: 600, color: colors.gray700 }}>{details.documentNumber}</Text></Text>
                        <Text style={{ fontSize: 12, color: colors.gray500, marginBottom: 4 }}>Date: <Text style={{ color: colors.gray700 }}>{formatDate(details.issueDate)}</Text></Text>
                        {details.dueDate ? <Text style={{ fontSize: 12, color: colors.gray500 }}>Due: <Text style={{ color: colors.gray700 }}>{formatDate(details.dueDate)}</Text></Text> : null}
                    </View>
                </View>
                <View style={{ marginBottom: 28 }}>
                    <View style={{ flexDirection: "row", borderBottomWidth: 2, borderBottomColor: color, paddingBottom: 12 }}>
                        <Text style={[baseStyles.colDesc, { fontSize: 11, fontWeight: 600, color: colors.gray600, textTransform: "uppercase" }]}>Item</Text>
                        <Text style={[baseStyles.colQty, { fontSize: 11, fontWeight: 600, color: colors.gray600, textTransform: "uppercase" }]}>Qty</Text>
                        <Text style={[baseStyles.colRate, { fontSize: 11, fontWeight: 600, color: colors.gray600, textTransform: "uppercase" }]}>Rate</Text>
                        <Text style={[baseStyles.colAmount, { fontSize: 11, fontWeight: 600, color: colors.gray600, textTransform: "uppercase" }]}>Amount</Text>
                    </View>
                    {items.map((item, index) => (
                        <View key={index} wrap={false} style={{ flexDirection: "row", paddingVertical: 14, backgroundColor: index % 2 === 1 ? colors.gray50 : "transparent" }}>
                            <Text style={[baseStyles.colDesc, { fontSize: 13, color: colors.gray700 }]}>{item.description}</Text>
                            <Text style={[baseStyles.colQty, { fontSize: 13, color: colors.gray500 }]}>{item.quantity}</Text>
                            <Text style={[baseStyles.colRate, { fontSize: 13, color: colors.gray500 }]}>{formatCurrency(item.unitPrice, currency)}</Text>
                            <Text style={[baseStyles.colAmount, { fontSize: 13, fontWeight: 600, color: colors.gray800 }]}>{formatCurrency(item.quantity * item.unitPrice, currency)}</Text>
                        </View>
                    ))}
                </View>
                <View style={{ alignItems: "flex-end", marginBottom: 32 }}>
                    <View style={{ width: 240 }}>
                        <View style={{ flexDirection: "row", justifyContent: "space-between", paddingVertical: 8 }}>
                            <Text style={{ fontSize: 13, color: colors.gray500 }}>Subtotal</Text>
                            <Text style={{ fontSize: 13, color: colors.gray700 }}>{formatCurrency(subtotal, currency)}</Text>
                        </View>
                        {totalDiscount > 0 ? <View style={{ flexDirection: "row", justifyContent: "space-between", paddingVertical: 8 }}><Text style={{ fontSize: 13, color: colors.gray500 }}>Discount</Text><Text style={{ fontSize: 13, color: colors.green600 }}>-{formatCurrency(totalDiscount, currency)}</Text></View> : null}
                        {totalTax > 0 ? <View style={{ flexDirection: "row", justifyContent: "space-between", paddingVertical: 8 }}><Text style={{ fontSize: 13, color: colors.gray500 }}>{taxRateDisplay ? `VAT (${taxRateDisplay}%)` : "VAT"}</Text><Text style={{ fontSize: 13, color: colors.gray700 }}>{formatCurrency(totalTax, currency)}</Text></View> : null}
                        <View style={{ flexDirection: "row", justifyContent: "space-between", padding: "14 16", marginTop: 8, backgroundColor: color, borderRadius: 6 }}>
                            <Text style={{ fontSize: 13, fontWeight: 600, color: colors.white }}>Total Due</Text>
                            <Text style={{ fontSize: 18, fontWeight: 700, color: colors.white }}>{formatCurrency(grandTotal, currency)}</Text>
                        </View>
                    </View>
                </View>
                <View style={{ alignItems: "center", paddingVertical: 24, borderTopWidth: 1, borderTopColor: colors.gray200 }}><Text style={{ fontSize: 16, fontWeight: 500, color: color }}>Thank you for your business!</Text></View>
                {terms && <View style={baseStyles.terms} wrap={false}><Text style={baseStyles.termsTitle}>Terms & Conditions</Text><Text style={baseStyles.termsText}>{terms}</Text></View>}

                {/* Footer with page numbers */}
                <PDFFooter businessName={business.name || "Your Business"} />
            </Page>
        </Document>
    );
}

// ============================================================================
// WATERCOLOR TEMPLATE
// ============================================================================
export function WatercolorPDF({ document }: PDFTemplateProps) {
    const { type, business, client, details, items, customTemplate } = document;
    const { terms, currency = "USD" } = details;
    const color = ACCENT_COLORS[document.accentColor as AccentColor] || document.accentColor;
    const { subtotal, totalDiscount, totalTax, grandTotal, taxRateDisplay } = calculateTotals(document);
    const docLabel = type === "invoice" ? "Invoice" : "Quotation";
    const lightColor = lightenColor(color, 0.85);

    return (
        <Document>
            <Page size="A4" style={[baseStyles.page, { position: "relative" }]}>
                {/* Custom Letterhead Background */}
                {customTemplate && (
                    <Image
                        src={customTemplate}
                        style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                        }}
                    />
                )}
                {/* Watercolor gradient effect using SVG */}
                <Svg style={{ position: "absolute", top: 0, left: 0, right: 0, height: 120 }}>
                    <Defs>
                        <LinearGradient id="watercolorGradient" x1="0" y1="0" x2="0" y2="1">
                            <Stop offset="0%" stopColor={lightColor} stopOpacity={0.7} />
                            <Stop offset="100%" stopColor={lightColor} stopOpacity={0} />
                        </LinearGradient>
                    </Defs>
                    <Rect x="0" y="0" width="100%" height="120" fill="url(#watercolorGradient)" />
                </Svg>
                <View style={[baseStyles.row, baseStyles.spaceBetween, { marginBottom: 48 }]}>
                    <View>
                        <Text style={{ fontSize: 32, fontWeight: 300, color: color, fontStyle: "italic" }}>{docLabel}</Text>
                        <Text style={{ fontSize: 12, color: colors.gray500, marginTop: 8 }}>#{details.documentNumber}</Text>
                    </View>
                    <View style={{ alignItems: "flex-end" }}>
                        {business.name && <Text style={{ fontSize: 18, fontWeight: 600, color: colors.gray800 }}>{business.name}</Text>}
                        {business.email && <Text style={{ fontSize: 11, color: colors.gray500, marginTop: 4 }}>{business.email}</Text>}
                    </View>
                </View>
                <View style={[baseStyles.row, baseStyles.spaceBetween, { marginBottom: 30 }]}>
                    <View>
                        <Text style={{ fontSize: 9, fontWeight: 600, color: color, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Bill To</Text>
                        {client.name && <Text style={{ fontSize: 13, fontWeight: 600, color: colors.gray800 }}>{client.name}</Text>}
                        {client.address && <Text style={{ fontSize: 11, color: colors.gray500, marginTop: 4 }}>{client.address}</Text>}
                    </View>
                    <View style={{ alignItems: "flex-end" }}>
                        <Text style={{ fontSize: 10, color: colors.gray500 }}>Date: {formatDate(details.issueDate)}</Text>
                        {details.dueDate ? <Text style={{ fontSize: 10, color: colors.gray500, marginTop: 4 }}>Due: {formatDate(details.dueDate)}</Text> : null}
                    </View>
                </View>
                <View style={{ marginBottom: 32 }}>
                    <View style={{ flexDirection: "row", paddingVertical: 14, borderBottomWidth: 2, borderBottomColor: lightColor }}>
                        <Text style={[baseStyles.colDesc, { fontSize: 10, fontWeight: 600, color: color, textTransform: "uppercase", letterSpacing: 1 }]}>Description</Text>
                        <Text style={[baseStyles.colQty, { fontSize: 10, fontWeight: 600, color: color, textTransform: "uppercase", letterSpacing: 1 }]}>Qty</Text>
                        <Text style={[baseStyles.colRate, { fontSize: 10, fontWeight: 600, color: color, textTransform: "uppercase", letterSpacing: 1 }]}>Price</Text>
                        <Text style={[baseStyles.colAmount, { fontSize: 10, fontWeight: 600, color: color, textTransform: "uppercase", letterSpacing: 1 }]}>Total</Text>
                    </View>
                    {items.map((item, index) => (
                        <View key={index} wrap={false} style={{ flexDirection: "row", paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: colors.gray100 }}>
                            <Text style={[baseStyles.colDesc, { fontSize: 13, color: colors.gray700 }]}>{item.description}</Text>
                            <Text style={[baseStyles.colQty, { fontSize: 13, color: colors.gray500 }]}>{item.quantity}</Text>
                            <Text style={[baseStyles.colRate, { fontSize: 13, color: colors.gray500 }]}>{formatCurrency(item.unitPrice, currency)}</Text>
                            <Text style={[baseStyles.colAmount, { fontSize: 13, fontWeight: 500, color: colors.gray800 }]}>{formatCurrency(item.quantity * item.unitPrice, currency)}</Text>
                        </View>
                    ))}
                </View>
                <View style={{ alignItems: "flex-end", marginBottom: 40 }}>
                    <View style={{ width: 220, backgroundColor: lightColor, padding: 20, borderRadius: 12 }}>
                        <View style={{ flexDirection: "row", justifyContent: "space-between", paddingVertical: 6 }}>
                            <Text style={{ fontSize: 12, color: colors.gray600 }}>Subtotal</Text>
                            <Text style={{ fontSize: 12, color: colors.gray700 }}>{formatCurrency(subtotal, currency)}</Text>
                        </View>
                        {totalDiscount > 0 && <View style={{ flexDirection: "row", justifyContent: "space-between", paddingVertical: 6 }}><Text style={{ fontSize: 12, color: colors.gray600 }}>Discount</Text><Text style={{ fontSize: 12, color: colors.green600 }}>-{formatCurrency(totalDiscount, currency)}</Text></View>}
                        {totalTax > 0 && <View style={{ flexDirection: "row", justifyContent: "space-between", paddingVertical: 6 }}><Text style={{ fontSize: 12, color: colors.gray600 }}>{taxRateDisplay ? `VAT (${taxRateDisplay}%)` : "VAT"}</Text><Text style={{ fontSize: 12, color: colors.gray700 }}>{formatCurrency(totalTax, currency)}</Text></View>}
                        <View style={{ flexDirection: "row", justifyContent: "space-between", paddingTop: 12, marginTop: 8, borderTopWidth: 1, borderTopColor: color }}>
                            <Text style={{ fontSize: 13, fontWeight: 600, color: color }}>Total</Text>
                            <Text style={{ fontSize: 18, fontWeight: 700, color: color }}>{formatCurrency(grandTotal, currency)}</Text>
                        </View>
                    </View>
                </View>
                {terms && <View style={baseStyles.terms} wrap={false}><Text style={baseStyles.termsTitle}>Terms & Conditions</Text><Text style={baseStyles.termsText}>{terms}</Text></View>}

                {/* Footer with page numbers */}
                <PDFFooter businessName={business.name || "Your Business"} />
            </Page>
        </Document>
    );
}

// ============================================================================
// SIDEBAR TEMPLATE
// ============================================================================
export function SidebarPDF({ document }: PDFTemplateProps) {
    const { type, business, client, details, items, customTemplate } = document;
    const { terms, currency = "USD" } = details;
    const color = ACCENT_COLORS[document.accentColor as AccentColor] || document.accentColor;
    const { subtotal, totalDiscount, totalTax, grandTotal, taxRateDisplay } = calculateTotals(document);
    const docLabel = type === "invoice" ? "INVOICE" : "QUOTATION";

    return (
        <Document>
            <Page size="A4" style={[baseStyles.page, { paddingLeft: 0, paddingTop: 0, paddingBottom: 0 }]}>
                {/* Custom Letterhead Background */}
                {customTemplate && (
                    <Image
                        src={customTemplate}
                        style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                        }}
                    />
                )}
                <View style={{ flexDirection: "row", minHeight: "100%" }}>
                    {/* Left sidebar with accent color */}
                    <View style={{ width: 50, backgroundColor: color, justifyContent: "center", alignItems: "center" }}>
                        <Text style={{ fontSize: 10, fontWeight: 700, color: colors.white, letterSpacing: 2, transform: "rotate(-90deg)", width: 400, textAlign: "center" }}>{docLabel} #{details.documentNumber}</Text>
                    </View>

                    {/* Main content */}
                    <View style={{ flex: 1, padding: 40 }}>
                        {/* Header */}
                        <View style={[baseStyles.row, baseStyles.spaceBetween, { marginBottom: 36 }]}>
                            <View>
                                {business.name && <Text style={{ fontSize: 20, fontWeight: 700, color: colors.gray800 }}>{business.name}</Text>}
                                {business.address && <Text style={{ fontSize: 11, color: colors.gray500, marginTop: 8 }}>{business.address}</Text>}
                                {business.email && <Text style={{ fontSize: 11, color: colors.gray500, marginTop: 4 }}>{business.email}</Text>}
                            </View>
                            <View style={{ alignItems: "flex-end" }}>
                                <Text style={{ fontSize: 11, color: colors.gray400 }}>Date: <Text style={{ color: colors.gray700 }}>{formatDate(details.issueDate)}</Text></Text>
                                {details.dueDate && <Text style={{ fontSize: 11, color: colors.gray400, marginTop: 4 }}>Due: <Text style={{ color: colors.gray700 }}>{formatDate(details.dueDate)}</Text></Text>}
                            </View>
                        </View>

                        {/* Bill To with border-bottom */}
                        <View style={{ marginBottom: 28, paddingBottom: 20, borderBottomWidth: 1, borderBottomColor: colors.gray200 }}>
                            <Text style={{ fontSize: 10, fontWeight: 600, color: color, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Bill To</Text>
                            {client.name && <Text style={{ fontSize: 14, fontWeight: 600, color: colors.gray800 }}>{client.name}</Text>}
                            {client.address && <Text style={{ fontSize: 12, color: colors.gray500, marginTop: 4 }}>{client.address}</Text>}
                        </View>

                        {/* Items table with uppercase headers */}
                        <View style={[baseStyles.table, { marginBottom: 28 }]}>
                            <View style={[baseStyles.tableHeader, { borderBottomWidth: 2, borderBottomColor: colors.gray200 }]}>
                                <Text style={[baseStyles.colDesc, { fontWeight: 600, color: colors.gray500, textTransform: "uppercase", fontSize: 10 }]}>Description</Text>
                                <Text style={[baseStyles.colQty, { fontWeight: 600, color: colors.gray500, textTransform: "uppercase", fontSize: 10 }]}>Qty</Text>
                                <Text style={[baseStyles.colRate, { fontWeight: 600, color: colors.gray500, textTransform: "uppercase", fontSize: 10 }]}>Rate</Text>
                                <Text style={[baseStyles.colAmount, { fontWeight: 600, color: colors.gray500, textTransform: "uppercase", fontSize: 10 }]}>Amount</Text>
                            </View>
                            {items.map((item, index) => (
                                <View key={index} style={[baseStyles.tableRow, { borderBottomColor: colors.gray100 }]}>
                                    <Text style={[baseStyles.colDesc, { fontSize: 12, color: colors.gray700 }]}>{item.description || "Item"}</Text>
                                    <Text style={[baseStyles.colQty, { fontSize: 12, color: colors.gray500 }]}>{item.quantity}</Text>
                                    <Text style={[baseStyles.colRate, { fontSize: 12, color: colors.gray500 }]}>{formatCurrency(item.unitPrice, currency)}</Text>
                                    <Text style={[baseStyles.colAmount, { fontSize: 12, fontWeight: 600, color: colors.gray800 }]}>{formatCurrency(item.quantity * item.unitPrice, currency)}</Text>
                                </View>
                            ))}
                        </View>

                        {/* Totals - right aligned */}
                        <View style={{ alignItems: "flex-end", marginBottom: 32 }}>
                            <View style={{ width: 200 }}>
                                <View style={[baseStyles.totalRow, { padding: "6pt 0" }]}><Text style={{ fontSize: 12, color: colors.gray500 }}>Subtotal</Text><Text style={{ fontSize: 12, color: colors.gray700 }}>{formatCurrency(subtotal, currency)}</Text></View>
                                {totalDiscount > 0 && <View style={[baseStyles.totalRow, { padding: "6pt 0" }]}><Text style={{ fontSize: 12, color: colors.gray500 }}>Discount</Text><Text style={{ fontSize: 12, color: colors.green600 }}>-{formatCurrency(totalDiscount, currency)}</Text></View>}
                                {totalTax > 0 && <View style={[baseStyles.totalRow, { padding: "6pt 0" }]}><Text style={{ fontSize: 12, color: colors.gray500 }}>{taxRateDisplay ? `VAT (${taxRateDisplay}%)` : "VAT"}</Text><Text style={{ fontSize: 12, color: colors.gray700 }}>{formatCurrency(totalTax, currency)}</Text></View>}
                                <View style={[baseStyles.totalRow, { paddingTop: 12, marginTop: 8, borderTopWidth: 2, borderTopColor: color }]}>
                                    <Text style={{ fontSize: 12, fontWeight: 600, color: colors.gray700 }}>Total</Text>
                                    <Text style={{ fontSize: 16, fontWeight: 700, color: color }}>{formatCurrency(grandTotal, currency)}</Text>
                                </View>
                            </View>
                        </View>

                        {/* Notes & Terms */}
                        {(details.notes || terms) && (
                            <View style={{ paddingTop: 16, borderTopWidth: 1, borderTopColor: colors.gray200 }}>
                                {details.notes && <Text style={{ fontSize: 11, color: colors.gray600, lineHeight: 1.7, marginBottom: 12 }}>{details.notes}</Text>}
                                {terms && <Text style={{ fontSize: 10, color: colors.gray400, lineHeight: 1.6 }}>{terms}</Text>}
                            </View>
                        )}
                    </View>
                </View>

                {/* Footer with page numbers */}
                <View style={[baseStyles.footer, { left: 140 }]} fixed>
                    <Text style={baseStyles.footerText}>{business.name || "Your Business"}</Text>
                    <Text style={baseStyles.footerText} render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`} />
                </View>
            </Page>
        </Document>
    );
}

// ============================================================================
// BLUE ACCENT TEMPLATE
// ============================================================================
export function BlueAccentPDF({ document }: PDFTemplateProps) {
    const { type, business, client, details, items, customTemplate } = document;
    const { terms, currency = "USD" } = details;
    const color = ACCENT_COLORS[document.accentColor as AccentColor] || document.accentColor;
    const { subtotal, totalDiscount, totalTax, grandTotal, taxRateDisplay } = calculateTotals(document);
    const docLabel = type === "invoice" ? "Invoice" : "Quotation";

    return (
        <Document>
            <Page size="A4" style={[baseStyles.page, { padding: "40pt 48pt" }]}>
                {/* Custom Letterhead Background */}
                {customTemplate && (
                    <Image
                        src={customTemplate}
                        style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                        }}
                    />
                )}
                {/* Header */}
                <View style={[baseStyles.row, baseStyles.spaceBetween, { marginBottom: 40, paddingBottom: 20, borderBottomWidth: 3, borderBottomColor: color }]}>
                    <View>
                        {business.name && <Text style={{ fontSize: 22, fontWeight: 700, color: colors.gray800 }}>{business.name}</Text>}
                        {business.address && <Text style={{ fontSize: 11, color: colors.gray500, marginTop: 8 }}>{business.address}</Text>}
                    </View>
                    <View style={{ alignItems: "flex-end" }}>
                        <Text style={{ fontSize: 28, fontWeight: 700, color: color }}>{docLabel}</Text>
                        <Text style={{ fontSize: 13, color: colors.gray500, marginTop: 4 }}>#{details.documentNumber}</Text>
                    </View>
                </View>

                {/* Info boxes */}
                <View style={[baseStyles.row, { gap: 24, marginBottom: 32 }]}>
                    <View style={{ flex: 1, padding: 16, backgroundColor: colors.gray50, borderRadius: 8, borderLeftWidth: 4, borderLeftColor: color }}>
                        <Text style={{ fontSize: 10, fontWeight: 600, color: colors.gray400, textTransform: "uppercase", marginBottom: 6 }}>Bill To</Text>
                        {client.name && <Text style={{ fontSize: 13, fontWeight: 600, color: colors.gray800 }}>{client.name}</Text>}
                        {client.address && <Text style={{ fontSize: 11, color: colors.gray500, marginTop: 4 }}>{client.address}</Text>}
                    </View>
                    <View style={{ padding: 16, backgroundColor: colors.gray50, borderRadius: 8 }}>
                        <View style={{ marginBottom: 10 }}>
                            <Text style={{ fontSize: 10, fontWeight: 600, color: colors.gray400, textTransform: "uppercase" }}>Date</Text>
                            <Text style={{ fontSize: 13, color: colors.gray700, marginTop: 2 }}>{formatDate(details.issueDate)}</Text>
                        </View>
                        {details.dueDate && <View>
                            <Text style={{ fontSize: 10, fontWeight: 600, color: colors.gray400, textTransform: "uppercase" }}>Due Date</Text>
                            <Text style={{ fontSize: 13, color: colors.gray700, marginTop: 2 }}>{formatDate(details.dueDate)}</Text>
                        </View>}
                    </View>
                </View>

                {/* Items table with colored header */}
                <View style={[baseStyles.table, { marginBottom: 28 }]}>
                    <View style={[baseStyles.tableHeader, { backgroundColor: color, paddingVertical: 12, paddingHorizontal: 16 }]}>
                        <Text style={[baseStyles.colDesc, { fontWeight: 600, color: colors.white, textTransform: "uppercase", fontSize: 11 }]}>Description</Text>
                        <Text style={[baseStyles.colQty, { fontWeight: 600, color: colors.white, textTransform: "uppercase", fontSize: 11 }]}>Qty</Text>
                        <Text style={[baseStyles.colRate, { fontWeight: 600, color: colors.white, textTransform: "uppercase", fontSize: 11 }]}>Rate</Text>
                        <Text style={[baseStyles.colAmount, { fontWeight: 600, color: colors.white, textTransform: "uppercase", fontSize: 11 }]}>Amount</Text>
                    </View>
                    {items.map((item, index) => (
                        <View key={index} style={[baseStyles.tableRow, { backgroundColor: index % 2 === 0 ? colors.white : colors.gray50, paddingHorizontal: 16 }]}>
                            <Text style={[baseStyles.colDesc, { fontSize: 13, color: colors.gray700 }]}>{item.description || "Item"}</Text>
                            <Text style={[baseStyles.colQty, { fontSize: 13, color: colors.gray500 }]}>{item.quantity}</Text>
                            <Text style={[baseStyles.colRate, { fontSize: 13, color: colors.gray500 }]}>{formatCurrency(item.unitPrice, currency)}</Text>
                            <Text style={[baseStyles.colAmount, { fontSize: 13, fontWeight: 600, color: colors.gray800 }]}>{formatCurrency(item.quantity * item.unitPrice, currency)}</Text>
                        </View>
                    ))}
                </View>

                {/* Totals */}
                <View style={{ alignItems: "flex-end", marginBottom: 36 }}>
                    <View style={{ width: 240 }}>
                        <View style={[baseStyles.totalRow, { padding: "8pt 0" }]}><Text style={{ fontSize: 13, color: colors.gray500 }}>Subtotal</Text><Text style={{ fontSize: 13, color: colors.gray700 }}>{formatCurrency(subtotal, currency)}</Text></View>
                        {totalDiscount > 0 && <View style={[baseStyles.totalRow, { padding: "8pt 0" }]}><Text style={{ fontSize: 13, color: colors.gray500 }}>Discount</Text><Text style={{ fontSize: 13, color: colors.green600 }}>-{formatCurrency(totalDiscount, currency)}</Text></View>}
                        {totalTax > 0 && <View style={[baseStyles.totalRow, { padding: "8pt 0" }]}><Text style={{ fontSize: 13, color: colors.gray500 }}>{taxRateDisplay ? `VAT (${taxRateDisplay}%)` : "VAT"}</Text><Text style={{ fontSize: 13, color: colors.gray700 }}>{formatCurrency(totalTax, currency)}</Text></View>}
                        <View style={[baseStyles.totalRow, { padding: 14, marginTop: 8, backgroundColor: color, borderRadius: 6 }]}>
                            <Text style={{ fontSize: 14, fontWeight: 600, color: colors.white }}>Total</Text>
                            <Text style={{ fontSize: 18, fontWeight: 700, color: colors.white }}>{formatCurrency(grandTotal, currency)}</Text>
                        </View>
                    </View>
                </View>

                {/* Notes & Terms */}
                {(details.notes || terms) && (
                    <View style={{ paddingTop: 20, borderTopWidth: 1, borderTopColor: colors.gray200 }}>
                        {details.notes && <Text style={{ fontSize: 12, color: colors.gray600, lineHeight: 1.7, marginBottom: 12 }}>{details.notes}</Text>}
                        {terms && <Text style={{ fontSize: 10, color: colors.gray400, lineHeight: 1.6 }}>{terms}</Text>}
                    </View>
                )}

                {/* Footer with page numbers */}
                <PDFFooter businessName={business.name || "Your Business"} />
            </Page>
        </Document>
    );
}

// ============================================================================
// TWO COLUMN TEMPLATE
// ============================================================================
export function TwoColumnPDF({ document }: PDFTemplateProps) {
    const { type, business, client, details, items, customTemplate } = document;
    const { terms, currency = "USD" } = details;
    const color = ACCENT_COLORS[document.accentColor as AccentColor] || document.accentColor;
    const { subtotal, totalDiscount, totalTax, grandTotal, taxRateDisplay } = calculateTotals(document);
    const docLabel = type === "invoice" ? "INVOICE" : "QUOTATION";

    return (
        <Document>
            <Page size="A4" style={[baseStyles.page, { padding: 0 }]}>
                {/* Custom Letterhead Background */}
                {customTemplate && (
                    <Image
                        src={customTemplate}
                        style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                        }}
                    />
                )}
                {/* Split header */}
                <View style={{ flexDirection: "row" }}>
                    <View style={{ flex: 1, padding: 32, backgroundColor: colors.gray50 }}>
                        {business.name && <Text style={{ fontSize: 18, fontWeight: 700, color: colors.gray800, marginBottom: 12 }}>{business.name}</Text>}
                        {business.address && <Text style={{ fontSize: 11, color: colors.gray500, marginBottom: 4 }}>{business.address}</Text>}
                        {business.email && <Text style={{ fontSize: 11, color: colors.gray500 }}>{business.email}</Text>}
                    </View>
                    <View style={{ flex: 1, padding: 32, backgroundColor: color }}>
                        <Text style={{ fontSize: 24, fontWeight: 700, color: colors.white, letterSpacing: 2, marginBottom: 12 }}>{docLabel}</Text>
                        <Text style={{ fontSize: 12, color: colors.white, opacity: 0.9, marginBottom: 4 }}>#{details.documentNumber}</Text>
                        <Text style={{ fontSize: 11, color: colors.white, opacity: 0.8, marginBottom: 2 }}>Date: {formatDate(details.issueDate)}</Text>
                        {details.dueDate && <Text style={{ fontSize: 11, color: colors.white, opacity: 0.8 }}>Due: {formatDate(details.dueDate)}</Text>}
                    </View>
                </View>

                <View style={{ padding: 32 }}>
                    {/* Bill To */}
                    <View style={{ marginBottom: 28 }}>
                        <Text style={{ fontSize: 10, fontWeight: 600, color: color, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Bill To</Text>
                        {client.name && <Text style={{ fontSize: 14, fontWeight: 600, color: colors.gray800 }}>{client.name}</Text>}
                        {client.address && <Text style={{ fontSize: 12, color: colors.gray500, marginTop: 4 }}>{client.address}</Text>}
                        {client.email && <Text style={{ fontSize: 12, color: colors.gray500, marginTop: 4 }}>{client.email}</Text>}
                    </View>

                    {/* Items table */}
                    <View style={[baseStyles.table, { marginBottom: 28 }]}>
                        <View style={[baseStyles.tableHeader, { borderBottomWidth: 2, borderBottomColor: colors.gray200 }]}>
                            <Text style={[baseStyles.colDesc, { fontWeight: 600, color: colors.gray500, textTransform: "uppercase", fontSize: 10 }]}>Description</Text>
                            <Text style={[baseStyles.colQty, { fontWeight: 600, color: colors.gray500, textTransform: "uppercase", fontSize: 10 }]}>Qty</Text>
                            <Text style={[baseStyles.colRate, { fontWeight: 600, color: colors.gray500, textTransform: "uppercase", fontSize: 10 }]}>Rate</Text>
                            <Text style={[baseStyles.colAmount, { fontWeight: 600, color: colors.gray500, textTransform: "uppercase", fontSize: 10 }]}>Amount</Text>
                        </View>
                        {items.map((item, index) => (
                            <View key={index} style={[baseStyles.tableRow, { borderBottomColor: colors.gray100 }]}>
                                <Text style={[baseStyles.colDesc, { fontSize: 13, color: colors.gray700 }]}>{item.description || "Item"}</Text>
                                <Text style={[baseStyles.colQty, { fontSize: 13, color: colors.gray500 }]}>{item.quantity}</Text>
                                <Text style={[baseStyles.colRate, { fontSize: 13, color: colors.gray500 }]}>{formatCurrency(item.unitPrice, currency)}</Text>
                                <Text style={[baseStyles.colAmount, { fontSize: 13, fontWeight: 600, color: colors.gray800 }]}>{formatCurrency(item.quantity * item.unitPrice, currency)}</Text>
                            </View>
                        ))}
                    </View>

                    {/* Totals */}
                    <View style={{ alignItems: "flex-end", marginBottom: 32 }}>
                        <View style={{ width: 240 }}>
                            <View style={[baseStyles.totalRow, { padding: "8pt 0" }]}><Text style={{ fontSize: 13, color: colors.gray500 }}>Subtotal</Text><Text style={{ fontSize: 13, color: colors.gray700 }}>{formatCurrency(subtotal, currency)}</Text></View>
                            {totalDiscount > 0 && <View style={[baseStyles.totalRow, { padding: "8pt 0" }]}><Text style={{ fontSize: 13, color: colors.gray500 }}>Discount</Text><Text style={{ fontSize: 13, color: colors.green600 }}>-{formatCurrency(totalDiscount, currency)}</Text></View>}
                            {totalTax > 0 && <View style={[baseStyles.totalRow, { padding: "8pt 0" }]}><Text style={{ fontSize: 13, color: colors.gray500 }}>{taxRateDisplay ? `VAT (${taxRateDisplay}%)` : "VAT"}</Text><Text style={{ fontSize: 13, color: colors.gray700 }}>{formatCurrency(totalTax, currency)}</Text></View>}
                            <View style={[baseStyles.totalRow, { paddingTop: 14, marginTop: 8, borderTopWidth: 2, borderTopColor: color }]}>
                                <Text style={{ fontSize: 14, fontWeight: 600, color: colors.gray800 }}>Total</Text>
                                <Text style={{ fontSize: 20, fontWeight: 700, color: color }}>{formatCurrency(grandTotal, currency)}</Text>
                            </View>
                        </View>
                    </View>

                    {/* Notes & Terms */}
                    {(details.notes || terms) && (
                        <View style={{ paddingTop: 20, borderTopWidth: 1, borderTopColor: colors.gray200 }}>
                            {details.notes && <Text style={{ fontSize: 12, color: colors.gray600, lineHeight: 1.7, marginBottom: 12 }}>{details.notes}</Text>}
                            {terms && <Text style={{ fontSize: 10, color: colors.gray400, lineHeight: 1.6 }}>{terms}</Text>}
                        </View>
                    )}
                </View>

                {/* Footer with page numbers */}
                <View style={[baseStyles.footer, { left: 0, right: 0, paddingHorizontal: 32 }]} fixed>
                    <Text style={baseStyles.footerText}>{business.name || "Your Business"}</Text>
                    <Text style={baseStyles.footerText} render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`} />
                </View>
            </Page>
        </Document>
    );
}

// ============================================================================
// LOWERCASE MINIMAL TEMPLATE
// ============================================================================
export function LowercaseMinimalPDF({ document }: PDFTemplateProps) {
    const { type, business, client, details, items, customTemplate } = document;
    const { terms, currency = "USD" } = details;
    const { subtotal, totalDiscount, totalTax, grandTotal, taxRateDisplay } = calculateTotals(document);
    const docLabel = type === "invoice" ? "invoice" : "quotation";

    return (
        <Document>
            <Page size="A4" style={[baseStyles.page, { paddingHorizontal: 48 }]}>
                {/* Custom Letterhead Background */}
                {customTemplate && (
                    <Image
                        src={customTemplate}
                        style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                        }}
                    />
                )}
                {/* Simple header - just docLabel */}
                <View style={{ marginBottom: 48 }}>
                    <Text style={{ fontSize: 36, fontWeight: 300, color: colors.gray800 }}>{docLabel}</Text>
                </View>

                {/* Info row: from, to, dates */}
                <View style={[baseStyles.row, baseStyles.spaceBetween, { marginBottom: 36, paddingBottom: 24, borderBottomWidth: 1, borderBottomColor: colors.gray200 }]}>
                    <View>
                        <Text style={{ fontSize: 10, color: colors.gray400, textTransform: "lowercase", marginBottom: 4 }}>from</Text>
                        {business.name && <Text style={{ fontSize: 14, fontWeight: 500, color: colors.gray800 }}>{business.name}</Text>}
                        {business.address && <Text style={{ fontSize: 11, color: colors.gray500, marginTop: 4 }}>{business.address}</Text>}
                    </View>
                    <View>
                        <Text style={{ fontSize: 10, color: colors.gray400, textTransform: "lowercase", marginBottom: 4 }}>to</Text>
                        {client.name && <Text style={{ fontSize: 14, fontWeight: 500, color: colors.gray800 }}>{client.name}</Text>}
                        {client.address && <Text style={{ fontSize: 11, color: colors.gray500, marginTop: 4 }}>{client.address}</Text>}
                    </View>
                    <View style={{ alignItems: "flex-end" }}>
                        <Text style={{ fontSize: 11, color: colors.gray500, marginBottom: 8 }}>#{details.documentNumber}</Text>
                        <Text style={{ fontSize: 11, color: colors.gray400, marginBottom: 4 }}>{formatDate(details.issueDate)}</Text>
                        {details.dueDate && <Text style={{ fontSize: 11, color: colors.gray400 }}>due {formatDate(details.dueDate)}</Text>}
                    </View>
                </View>

                {/* Items table */}
                <View style={[baseStyles.table, { marginBottom: 32 }]}>
                    <View style={[baseStyles.tableHeader, { borderBottomColor: colors.gray200 }]}>
                        <Text style={[baseStyles.colDesc, { fontWeight: 400, color: colors.gray400, fontSize: 10, textTransform: "lowercase" }]}>item</Text>
                        <Text style={[baseStyles.colQty, { fontWeight: 400, color: colors.gray400, fontSize: 10, textTransform: "lowercase" }]}>qty</Text>
                        <Text style={[baseStyles.colRate, { fontWeight: 400, color: colors.gray400, fontSize: 10, textTransform: "lowercase" }]}>price</Text>
                        <Text style={[baseStyles.colAmount, { fontWeight: 400, color: colors.gray400, fontSize: 10, textTransform: "lowercase" }]}>total</Text>
                    </View>
                    {items.map((item, index) => (
                        <View key={index} style={[baseStyles.tableRow, { borderBottomColor: colors.gray100 }]}>
                            <Text style={[baseStyles.colDesc, { fontSize: 13, color: colors.gray700 }]}>{item.description || "Item"}</Text>
                            <Text style={[baseStyles.colQty, { fontSize: 13, color: colors.gray500 }]}>{item.quantity}</Text>
                            <Text style={[baseStyles.colRate, { fontSize: 13, color: colors.gray500 }]}>{formatCurrency(item.unitPrice, currency)}</Text>
                            <Text style={[baseStyles.colAmount, { fontSize: 13, color: colors.gray800 }]}>{formatCurrency(item.quantity * item.unitPrice, currency)}</Text>
                        </View>
                    ))}
                </View>

                {/* Totals - right aligned */}
                <View style={{ alignItems: "flex-end", marginBottom: 40 }}>
                    <View style={{ width: 200 }}>
                        <View style={[baseStyles.totalRow, { padding: "6pt 0" }]}><Text style={{ fontSize: 12, color: colors.gray400, textTransform: "lowercase" }}>subtotal</Text><Text style={{ fontSize: 12, color: colors.gray600 }}>{formatCurrency(subtotal, currency)}</Text></View>
                        {totalDiscount > 0 && <View style={[baseStyles.totalRow, { padding: "6pt 0" }]}><Text style={{ fontSize: 12, color: colors.gray400, textTransform: "lowercase" }}>discount</Text><Text style={{ fontSize: 12, color: colors.green600 }}>-{formatCurrency(totalDiscount, currency)}</Text></View>}
                        {totalTax > 0 && <View style={[baseStyles.totalRow, { padding: "6pt 0" }]}><Text style={{ fontSize: 12, color: colors.gray400, textTransform: "lowercase" }}>{taxRateDisplay ? `vat (${taxRateDisplay}%)` : "vat"}</Text><Text style={{ fontSize: 12, color: colors.gray600 }}>{formatCurrency(totalTax, currency)}</Text></View>}
                        <View style={[baseStyles.totalRow, { paddingTop: 16, marginTop: 8, borderTopWidth: 1, borderTopColor: colors.gray300 }]}>
                            <Text style={{ fontSize: 14, color: colors.gray600, textTransform: "lowercase" }}>total</Text>
                            <Text style={{ fontSize: 20, fontWeight: 600, color: colors.gray900 }}>{formatCurrency(grandTotal, currency)}</Text>
                        </View>
                    </View>
                </View>

                {/* Notes & Terms */}
                {(details.notes || terms) && (
                    <View>
                        {details.notes && <Text style={{ fontSize: 12, color: colors.gray500, lineHeight: 1.7, marginBottom: 16 }}>{details.notes}</Text>}
                        {terms && <Text style={{ fontSize: 10, color: colors.gray400, lineHeight: 1.6 }}>{terms}</Text>}
                    </View>
                )}

                {/* Footer with page numbers */}
                <PDFFooter businessName={business.name || "Your Business"} />
            </Page>
        </Document>
    );
}

// ============================================================================
// BEACH WAVE TEMPLATE
// ============================================================================
export function BeachWavePDF({ document }: PDFTemplateProps) {
    const { type, business, client, details, items, customTemplate } = document;
    const { terms, notes, currency = "USD" } = details;
    const color = ACCENT_COLORS[document.accentColor as AccentColor] || document.accentColor;
    const { subtotal, totalDiscount, totalTax, grandTotal, taxRateDisplay } = calculateTotals(document);
    const docLabel = type === "invoice" ? "Invoice" : "Quotation";
    const lightColor = lightenColor(color, 0.9);

    return (
        <Document>
            <Page size="A4" style={[baseStyles.page, { paddingBottom: 80 }]}>
                {/* Custom Letterhead Background */}
                {customTemplate && (
                    <Image
                        src={customTemplate}
                        style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                        }}
                    />
                )}
                {/* Header */}
                <View style={[baseStyles.row, baseStyles.spaceBetween, { marginBottom: 30 }]}>
                    <View>
                        {business.name && <Text style={{ fontSize: 22, fontWeight: 700, color: colors.gray800 }}>{business.name}</Text>}
                        {business.address && <Text style={{ fontSize: 11, color: colors.gray500, marginTop: 8 }}>{business.address}</Text>}
                    </View>
                    <View style={{ alignItems: "flex-end" }}>
                        <Text style={{ fontSize: 28, fontWeight: 600, color: color }}>{docLabel}</Text>
                        <Text style={{ fontSize: 12, color: colors.gray500, marginTop: 4 }}>#{details.documentNumber}</Text>
                    </View>
                </View>

                {/* Bill To + Dates */}
                <View style={[baseStyles.row, baseStyles.spaceBetween, { marginBottom: 32 }]}>
                    <View>
                        <Text style={{ fontSize: 10, fontWeight: 600, color: color, textTransform: "uppercase", marginBottom: 8 }}>Bill To</Text>
                        <Text style={{ fontSize: 14, fontWeight: 600, color: colors.gray800 }}>{client.name || ""}</Text>
                        {client.address ? <Text style={{ fontSize: 12, color: colors.gray500, marginTop: 4 }}>{client.address}</Text> : null}
                    </View>
                    <View style={{ alignItems: "flex-end" }}>
                        <Text style={{ fontSize: 11, color: colors.gray500 }}>Date: {formatDate(details.issueDate)}</Text>
                        {details.dueDate ? <Text style={{ fontSize: 11, color: colors.gray500, marginTop: 4 }}>Due: {formatDate(details.dueDate)}</Text> : null}
                    </View>
                </View>

                {/* Items Table - with light background on headers */}
                <View style={{ marginBottom: 28 }}>
                    <View style={{ flexDirection: "row", backgroundColor: lightColor, paddingVertical: 12, paddingHorizontal: 16 }}>
                        <Text style={[baseStyles.colDesc, { fontSize: 10, fontWeight: 600, textTransform: "uppercase", color: color }]}>Description</Text>
                        <Text style={[baseStyles.colQty, { fontSize: 10, fontWeight: 600, textTransform: "uppercase", color: color, textAlign: "center" }]}>Qty</Text>
                        <Text style={[baseStyles.colRate, { fontSize: 10, fontWeight: 600, textTransform: "uppercase", color: color, textAlign: "right" }]}>Rate</Text>
                        <Text style={[baseStyles.colAmount, { fontSize: 10, fontWeight: 600, textTransform: "uppercase", color: color, textAlign: "right" }]}>Amount</Text>
                    </View>
                    {items.map((item, index) => {
                        const lineTotal = item.quantity * item.unitPrice;
                        return (
                            <View key={index} wrap={false} style={{ flexDirection: "row", paddingVertical: 14, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: colors.gray100 }}>
                                <Text style={[baseStyles.colDesc, { fontSize: 13, color: colors.gray700 }]}>{item.description || "Item"}</Text>
                                <Text style={[baseStyles.colQty, { fontSize: 13, color: colors.gray500, textAlign: "center" }]}>{item.quantity}</Text>
                                <Text style={[baseStyles.colRate, { fontSize: 13, color: colors.gray500, textAlign: "right" }]}>{formatCurrency(item.unitPrice, currency)}</Text>
                                <Text style={[baseStyles.colAmount, { fontSize: 13, fontWeight: 600, color: colors.gray800, textAlign: "right" }]}>{formatCurrency(lineTotal, currency)}</Text>
                            </View>
                        );
                    })}
                </View>

                {/* Totals */}
                <View style={{ alignItems: "flex-end", marginBottom: 32 }}>
                    <View style={{ width: 220 }}>
                        <View style={{ flexDirection: "row", justifyContent: "space-between", paddingVertical: 8 }}>
                            <Text style={{ fontSize: 12, color: colors.gray500 }}>Subtotal</Text>
                            <Text style={{ fontSize: 12, color: colors.gray700 }}>{formatCurrency(subtotal, currency)}</Text>
                        </View>
                        {totalDiscount > 0 && (
                            <View style={{ flexDirection: "row", justifyContent: "space-between", paddingVertical: 8 }}>
                                <Text style={{ fontSize: 12, color: colors.gray500 }}>Discount</Text>
                                <Text style={{ fontSize: 12, color: colors.green600 }}>-{formatCurrency(totalDiscount, currency)}</Text>
                            </View>
                        )}
                        {totalTax > 0 && (
                            <View style={{ flexDirection: "row", justifyContent: "space-between", paddingVertical: 8 }}>
                                <Text style={{ fontSize: 12, color: colors.gray500 }}>{taxRateDisplay ? `VAT (${taxRateDisplay}%)` : "VAT"}</Text>
                                <Text style={{ fontSize: 12, color: colors.gray700 }}>{formatCurrency(totalTax, currency)}</Text>
                            </View>
                        )}
                        <View style={{ flexDirection: "row", justifyContent: "space-between", paddingVertical: 14, marginTop: 8, borderTopWidth: 2, borderTopColor: color }}>
                            <Text style={{ fontSize: 13, fontWeight: 600, color: colors.gray700 }}>Total</Text>
                            <Text style={{ fontSize: 18, fontWeight: 700, color: color }}>{formatCurrency(grandTotal, currency)}</Text>
                        </View>
                    </View>
                </View>

                {/* Notes & Terms */}
                {notes && <Text style={{ fontSize: 12, color: colors.gray600, lineHeight: 1.7, marginBottom: 12 }}>{notes}</Text>}
                {terms && <Text style={{ fontSize: 10, color: colors.gray400, lineHeight: 1.6 }}>{terms}</Text>}

                {/* Footer with page numbers - positioned above the wave */}
                <View style={[baseStyles.footer, { bottom: 65 }]} fixed>
                    <Text style={baseStyles.footerText}>{business.name || "Your Business"}</Text>
                    <Text style={baseStyles.footerText} render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`} />
                </View>

                {/* Beach Wave SVG decoration */}
                <View style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 60 }}>
                    <Svg viewBox="0 0 595 60" style={{ width: "100%", height: "100%" }}>
                        <Path d="M0,30 Q150,0 297.5,30 T595,30 L595,60 L0,60 Z" fill={lightColor} opacity={0.6} />
                        <Path d="M0,40 Q150,15 297.5,40 T595,40 L595,60 L0,60 Z" fill={color} opacity={0.4} />
                    </Svg>
                </View>
            </Page>
        </Document>
    );
}

// ============================================================================
// BLUE HEADER BAR TEMPLATE
// ============================================================================
export function BlueHeaderBarPDF({ document }: PDFTemplateProps) {
    const { type, business, client, details, items, customTemplate } = document;
    const { terms, currency = "USD" } = details;
    const color = ACCENT_COLORS[document.accentColor as AccentColor] || document.accentColor;
    const { subtotal, totalDiscount, totalTax, grandTotal, taxRateDisplay } = calculateTotals(document);
    const docLabel = type === "invoice" ? "INVOICE" : "QUOTATION";

    return (
        <Document>
            <Page size="A4" style={[baseStyles.page, { paddingTop: 0 }]}>
                {/* Custom Letterhead Background */}
                {customTemplate && (
                    <Image
                        src={customTemplate}
                        style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                        }}
                    />
                )}
                <View style={{ backgroundColor: color, marginHorizontal: -40, paddingHorizontal: 40, paddingVertical: 30, marginBottom: 30 }}>
                    <View style={[baseStyles.row, baseStyles.spaceBetween, { alignItems: "center" }]}>
                        <View>
                            {business.logo && <Image src={business.logo} style={{ width: 50, height: 50, marginBottom: 8 }} />}
                            {business.name && <Text style={{ fontSize: 18, fontWeight: 700, color: colors.white }}>{business.name}</Text>}
                        </View>
                        <Text style={{ fontSize: 18, fontWeight: 700, color: colors.white, letterSpacing: 2 }}>{docLabel}</Text>
                    </View>
                </View>
                <View style={[baseStyles.row, baseStyles.spaceBetween, { marginBottom: 28 }]}>
                    <View>
                        <Text style={{ fontSize: 10, color: colors.gray400 }}>#{details.documentNumber}</Text>
                        <Text style={{ fontSize: 10, color: colors.gray500, marginTop: 4 }}>Date: {formatDate(details.issueDate)}</Text>
                        {details.dueDate ? <Text style={{ fontSize: 10, color: colors.gray500, marginTop: 4 }}>Due: {formatDate(details.dueDate)}</Text> : null}
                    </View>
                    <View style={{ alignItems: "flex-end" }}>
                        {business.address && <Text style={{ fontSize: 10, color: colors.gray500 }}>{business.address}</Text>}
                        {business.email && <Text style={{ fontSize: 10, color: colors.gray500, marginTop: 2 }}>{business.email}</Text>}
                    </View>
                </View>
                <View style={{ marginBottom: 28 }}>
                    <Text style={{ fontSize: 9, fontWeight: 600, color: color, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Bill To</Text>
                    {client.name && <Text style={{ fontSize: 13, fontWeight: 600, color: colors.gray800 }}>{client.name}</Text>}
                    {client.address && <Text style={{ fontSize: 11, color: colors.gray500, marginTop: 4 }}>{client.address}</Text>}
                </View>
                <View style={baseStyles.table}>
                    <View style={baseStyles.tableHeader}>
                        <Text style={[baseStyles.colDesc, { fontWeight: 600, color: colors.gray700 }]}>Description</Text>
                        <Text style={[baseStyles.colQty, { fontWeight: 600, color: colors.gray700 }]}>Qty</Text>
                        <Text style={[baseStyles.colRate, { fontWeight: 600, color: colors.gray700 }]}>Rate</Text>
                        <Text style={[baseStyles.colAmount, { fontWeight: 600, color: colors.gray700 }]}>Amount</Text>
                    </View>
                    {items.map((item, index) => (
                        <View key={index} style={baseStyles.tableRow}>
                            <Text style={[baseStyles.colDesc, { color: colors.gray700 }]}>{item.description}</Text>
                            <Text style={[baseStyles.colQty, { color: colors.gray500 }]}>{item.quantity}</Text>
                            <Text style={[baseStyles.colRate, { color: colors.gray500 }]}>{formatCurrency(item.unitPrice, currency)}</Text>
                            <Text style={[baseStyles.colAmount, { fontWeight: 700, color: colors.gray800 }]}>{formatCurrency(item.quantity * item.unitPrice, currency)}</Text>
                        </View>
                    ))}
                </View>
                <View style={baseStyles.totalsSection}>
                    <View style={baseStyles.totalRow}><Text style={baseStyles.totalLabel}>Subtotal</Text><Text style={baseStyles.totalValue}>{formatCurrency(subtotal, currency)}</Text></View>
                    {totalDiscount > 0 ? <View style={baseStyles.totalRow}><Text style={baseStyles.totalLabel}>Discount</Text><Text style={[baseStyles.totalValue, { color: colors.green600 }]}>-{formatCurrency(totalDiscount, currency)}</Text></View> : null}
                    {totalTax > 0 ? <View style={baseStyles.totalRow}><Text style={baseStyles.totalLabel}>{taxRateDisplay ? `VAT (${taxRateDisplay}%)` : "Tax"}</Text><Text style={baseStyles.totalValue}>{formatCurrency(totalTax, currency)}</Text></View> : null}
                    <View style={[baseStyles.totalRow, { marginTop: 10, paddingTop: 10, borderTopWidth: 2, borderTopColor: color }]}>
                        <Text style={{ fontSize: 12, fontWeight: 600, color: colors.gray800, width: 100, textAlign: "right", marginRight: 10 }}>Total</Text>
                        <Text style={{ fontSize: 16, fontWeight: 700, color: color, width: 80, textAlign: "right" }}>{formatCurrency(grandTotal, currency)}</Text>
                    </View>
                </View>
                {terms ? <View style={baseStyles.terms} wrap={false}><Text style={baseStyles.termsTitle}>Terms & Conditions</Text><Text style={baseStyles.termsText}>{terms}</Text></View> : null}

                {/* Footer with page numbers */}
                <PDFFooter businessName={business.name || "Your Business"} />
            </Page>
        </Document>
    );
}

// ============================================================================
// CIRCULAR MODERN TEMPLATE
// ============================================================================
export function CircularModernPDF({ document }: PDFTemplateProps) {
    const { type, business, client, details, items, customTemplate } = document;
    const { terms, currency = "USD" } = details;
    const color = ACCENT_COLORS[document.accentColor as AccentColor] || document.accentColor;
    const { subtotal, totalDiscount, totalTax, grandTotal, taxRateDisplay } = calculateTotals(document);
    const docLabel = type === "invoice" ? "INVOICE" : "QUOTATION";

    return (
        <Document>
            <Page size="A4" style={baseStyles.page}>
                {/* Custom Letterhead Background */}
                {customTemplate && (
                    <Image
                        src={customTemplate}
                        style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                        }}
                    />
                )}
                {/* Large decorative circle - 200x200, positioned top right, extends beyond page */}
                <View style={{ position: "absolute", top: -60, right: -60, width: 200, height: 200, borderRadius: 100, backgroundColor: color, opacity: 0.1 }} />

                {/* Header with business info and small solid circle */}
                <View style={[baseStyles.row, baseStyles.spaceBetween, { marginBottom: 30 }]}>
                    <View style={{ paddingRight: 100 }}>
                        <Text style={{ fontSize: 18, fontWeight: 700, color: colors.gray800 }}>{business.name || "Your Business"}</Text>
                        {business.address ? <Text style={{ fontSize: 10, color: colors.gray500, marginTop: 6 }}>{business.address}</Text> : null}
                        {business.email ? <Text style={{ fontSize: 10, color: colors.gray500, marginTop: 2 }}>{business.email}</Text> : null}
                    </View>
                    {/* Small solid circle - 80x80px */}
                    <View style={{ position: "absolute", top: 0, right: 0, width: 80, height: 80, borderRadius: 40, backgroundColor: color, justifyContent: "center", alignItems: "center" }}>
                        <Text style={{ fontSize: 10, fontWeight: 700, color: colors.white, textAlign: "center" }}>{docLabel}</Text>
                    </View>
                </View>

                {/* Info row: Bill To left, document details right - pushed down from circle */}
                <View style={[baseStyles.row, baseStyles.spaceBetween, { marginTop: 25, marginBottom: 28, paddingBottom: 20, borderBottomWidth: 1, borderBottomColor: colors.gray200 }]}>
                    <View>
                        <Text style={{ fontSize: 10, fontWeight: 600, color: color, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Bill To</Text>
                        {client.name && <Text style={{ fontSize: 14, fontWeight: 600, color: colors.gray800 }}>{client.name}</Text>}
                        {client.address && <Text style={{ fontSize: 12, color: colors.gray500, marginTop: 4 }}>{client.address}</Text>}
                    </View>
                    <View style={{ alignItems: "flex-end" }}>
                        <Text style={{ fontSize: 12, color: colors.gray500, marginBottom: 6 }}>#{details.documentNumber}</Text>
                        <Text style={{ fontSize: 11, color: colors.gray400, marginBottom: 4 }}>Date: {formatDate(details.issueDate)}</Text>
                        {details.dueDate && <Text style={{ fontSize: 11, color: colors.gray400 }}>Due: {formatDate(details.dueDate)}</Text>}
                    </View>
                </View>

                {/* Items table with accent border */}
                <View style={{ marginBottom: 16, borderTopWidth: 2, borderTopColor: color }}>
                    <View style={[baseStyles.tableHeader, { paddingTop: 12 }]}>
                        <Text style={[baseStyles.colDesc, { fontWeight: 600, color: colors.gray700 }]}>Description</Text>
                        <Text style={[baseStyles.colQty, { fontWeight: 600, color: colors.gray700 }]}>Qty</Text>
                        <Text style={[baseStyles.colRate, { fontWeight: 600, color: colors.gray700 }]}>Rate</Text>
                        <Text style={[baseStyles.colAmount, { fontWeight: 600, color: colors.gray700 }]}>Amount</Text>
                    </View>
                    {items.map((item, index) => (
                        <View key={index} style={baseStyles.tableRow}>
                            <Text style={[baseStyles.colDesc, { color: colors.gray700 }]}>{item.description}</Text>
                            <Text style={[baseStyles.colQty, { color: colors.gray500 }]}>{item.quantity}</Text>
                            <Text style={[baseStyles.colRate, { color: colors.gray500 }]}>{formatCurrency(item.unitPrice, currency)}</Text>
                            <Text style={[baseStyles.colAmount, { fontWeight: 700, color: colors.gray800 }]}>{formatCurrency(item.quantity * item.unitPrice, currency)}</Text>
                        </View>
                    ))}
                </View>

                {/* Totals section */}
                <View style={baseStyles.totalsSection}>
                    <View style={baseStyles.totalRow}><Text style={baseStyles.totalLabel}>Subtotal</Text><Text style={baseStyles.totalValue}>{formatCurrency(subtotal, currency)}</Text></View>
                    {totalDiscount > 0 ? <View style={baseStyles.totalRow}><Text style={baseStyles.totalLabel}>Discount</Text><Text style={[baseStyles.totalValue, { color: colors.green600 }]}>-{formatCurrency(totalDiscount, currency)}</Text></View> : null}
                    {totalTax > 0 ? <View style={baseStyles.totalRow}><Text style={baseStyles.totalLabel}>{taxRateDisplay ? `VAT (${taxRateDisplay}%)` : "Tax"}</Text><Text style={baseStyles.totalValue}>{formatCurrency(totalTax, currency)}</Text></View> : null}
                    <View style={[baseStyles.totalRow, { marginTop: 10, paddingTop: 16, borderTopWidth: 2, borderTopColor: colors.gray200, alignItems: "center" }]}>
                        <Text style={{ fontSize: 14, fontWeight: 600, color: colors.gray700 }}>Total</Text>
                        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
                            <Text style={{ fontSize: 22, fontWeight: 700, color: color }}>{formatCurrency(grandTotal, currency)}</Text>
                            {/* Small accent dot after total */}
                            <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: color }} />
                        </View>
                    </View>
                </View>

                {terms ? <View style={baseStyles.terms} wrap={false}><Text style={baseStyles.termsTitle}>Terms & Conditions</Text><Text style={baseStyles.termsText}>{terms}</Text></View> : null}

                {/* Footer with page numbers */}
                <PDFFooter businessName={business.name || "Your Business"} />
            </Page>
        </Document>
    );
}

// ============================================================================
// LETTERHEAD TEMPLATE - Uses uploaded letterhead as background, content only
// ============================================================================
export function LetterheadPDF({ document }: PDFTemplateProps) {
    const { type, client, details, items, customTemplate, business } = document;
    const { terms, notes, currency = "USD" } = details;
    const { subtotal, totalDiscount, totalTax, grandTotal, taxRateDisplay } = calculateTotals(document);
    const docLabel = type === "invoice" ? "INVOICE" : "QUOTATION";

    return (
        <Document>
            <Page size="A4" style={{ fontFamily: "Helvetica", fontSize: 10, paddingTop: 170, paddingBottom: 80, paddingHorizontal: 45 }}>
                {/* Letterhead Background - Full Page, Fixed to repeat on all pages */}
                {customTemplate && (
                    <Image
                        src={customTemplate}
                        style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: 595,
                            height: 842,
                        }}
                        fixed
                    />
                )}

                {/* Date and Document Number Row */}
                <View style={[baseStyles.row, baseStyles.spaceBetween, { marginBottom: 8 }]}>
                    <Text style={{ fontSize: 11, color: colors.gray700 }}>{formatDate(details.issueDate)}</Text>
                    <Text style={{ fontSize: 12, fontWeight: 600, color: colors.gray800 }}>{docLabel} #: {details.documentNumber}</Text>
                </View>

                {/* Client Info */}
                <View style={{ marginBottom: 24 }}>
                    <Text style={{ fontSize: 13, fontWeight: 600, color: colors.gray800 }}>{client.name || "Client Name"}</Text>
                    {client.address && <Text style={{ fontSize: 11, color: colors.gray600, marginTop: 2 }}>{client.address}</Text>}
                    {client.company && <Text style={{ fontSize: 11, color: colors.gray600, marginTop: 2 }}>{client.company}</Text>}
                </View>

                {/* Document Title */}
                <View style={{ alignItems: "center", marginBottom: 24 }}>
                    <Text style={{ fontSize: 14, fontWeight: 700, color: colors.gray800, textDecoration: "underline" }}>
                        REQUEST FOR {docLabel}
                    </Text>
                </View>

                {/* Items Table */}
                <View style={baseStyles.table}>
                    <View style={[baseStyles.tableHeader, { backgroundColor: colors.gray100, paddingHorizontal: 8, paddingVertical: 10 }]}>
                        <Text style={{ width: 30, fontSize: 10, fontWeight: 600, color: colors.gray700 }}>#</Text>
                        <Text style={[baseStyles.colDesc, { fontSize: 10, fontWeight: 600, color: colors.gray700 }]}>Description</Text>
                        <Text style={[baseStyles.colQty, { fontSize: 10, fontWeight: 600, color: colors.gray700 }]}>Quantity</Text>
                        <Text style={[baseStyles.colRate, { fontSize: 10, fontWeight: 600, color: colors.gray700 }]}>Unit Price</Text>
                        <Text style={[baseStyles.colAmount, { fontSize: 10, fontWeight: 600, color: colors.gray700 }]}>Total</Text>
                    </View>
                    {items.map((item, index) => {
                        const lineTotal = item.quantity * item.unitPrice;
                        return (
                            <View key={index} style={[baseStyles.tableRow, { paddingHorizontal: 8 }]}>
                                <Text style={{ width: 30, fontSize: 11, color: colors.gray600 }}>{index + 1}</Text>
                                <Text style={[baseStyles.colDesc, { fontSize: 11, color: colors.gray800 }]}>{item.description || "Item"}</Text>
                                <Text style={[baseStyles.colQty, { fontSize: 11, color: colors.gray600 }]}>{item.quantity}</Text>
                                <Text style={[baseStyles.colRate, { fontSize: 11, color: colors.gray600 }]}>{formatCurrency(item.unitPrice, currency)}</Text>
                                <Text style={[baseStyles.colAmount, { fontSize: 11, fontWeight: 600, color: colors.gray800 }]}>{formatCurrency(lineTotal, currency)}</Text>
                            </View>
                        );
                    })}
                </View>

                {/* Totals */}
                <View style={{ alignItems: "flex-end", marginTop: 16, marginBottom: 24 }}>
                    <View style={{ width: 200 }}>
                        <View style={{ flexDirection: "row", justifyContent: "space-between", paddingVertical: 4 }}>
                            <Text style={{ fontSize: 11, color: colors.gray600 }}>Subtotal:</Text>
                            <Text style={{ fontSize: 11, color: colors.gray800 }}>{formatCurrency(subtotal, currency)}</Text>
                        </View>
                        {totalDiscount > 0 && (
                            <View style={{ flexDirection: "row", justifyContent: "space-between", paddingVertical: 4 }}>
                                <Text style={{ fontSize: 11, color: colors.gray600 }}>Discount:</Text>
                                <Text style={{ fontSize: 11, color: colors.green600 }}>-{formatCurrency(totalDiscount, currency)}</Text>
                            </View>
                        )}
                        {totalTax > 0 && (
                            <View style={{ flexDirection: "row", justifyContent: "space-between", paddingVertical: 4 }}>
                                <Text style={{ fontSize: 11, color: colors.gray600 }}>{taxRateDisplay ? `VAT (${taxRateDisplay}%):` : "VAT:"}</Text>
                                <Text style={{ fontSize: 11, color: colors.gray800 }}>{formatCurrency(totalTax, currency)}</Text>
                            </View>
                        )}
                        <View style={{ flexDirection: "row", justifyContent: "space-between", paddingVertical: 8, borderTopWidth: 1, borderTopColor: colors.gray300, marginTop: 4 }}>
                            <Text style={{ fontSize: 12, fontWeight: 700, color: colors.gray800 }}>Total:</Text>
                            <Text style={{ fontSize: 14, fontWeight: 700, color: colors.gray900 }}>{formatCurrency(grandTotal, currency)}</Text>
                        </View>
                    </View>
                </View>

                {/* Terms & Conditions */}
                {terms && (
                    <View style={{ marginBottom: 20 }} wrap={false}>
                        <Text style={{ fontSize: 11, fontWeight: 600, color: colors.gray700, marginBottom: 6 }}>Terms & Conditions</Text>
                        <Text style={{ fontSize: 10, color: colors.gray500, lineHeight: 1.6 }}>{terms}</Text>
                    </View>
                )}

                {/* Sign-off */}
                <View style={{ marginTop: 16 }} wrap={false}>
                    {notes && <Text style={{ fontSize: 11, color: colors.gray700, marginBottom: 8 }}>{notes}</Text>}
                    <Text style={{ fontSize: 11, color: colors.gray700 }}>Yours faithfully,</Text>
                    <Text style={{ fontSize: 12, fontWeight: 600, color: colors.gray800, marginTop: 4 }}>{business.name || "Your Business"}</Text>
                </View>
            </Page>
        </Document>
    );
}

// ============================================================================
// EXPORT PDF TEMPLATE SELECTOR
// ============================================================================
export function getPDFTemplate(document: DocumentData) {
    const { template, customTemplate } = document;

    // If a custom letterhead is uploaded, use the Letterhead template
    if (customTemplate) {
        return <LetterheadPDF document={document} />;
    }

    switch (template) {
        case "modern":
            return <ModernPDF document={document} />;
        case "signature":
            return <SignaturePDF document={document} />;
        case "total-highlight":
            return <TotalHighlightPDF document={document} />;
        case "blue-banner":
            return <BlueBannerPDF document={document} />;
        case "watercolor":
            return <WatercolorPDF document={document} />;
        case "sidebar":
            return <SidebarPDF document={document} />;
        case "blue-accent":
            return <BlueAccentPDF document={document} />;
        case "two-column":
            return <TwoColumnPDF document={document} />;
        case "lowercase-minimal":
            return <LowercaseMinimalPDF document={document} />;
        case "beach-wave":
            return <BeachWavePDF document={document} />;
        case "blue-header-bar":
            return <BlueHeaderBarPDF document={document} />;
        case "circular-modern":
            return <CircularModernPDF document={document} />;
        case "minimalist":
            return <MinimalistPDF document={document} />;
        case "corporate":
            return <CorporatePDF document={document} />;
        case "creative":
            return <CreativePDF document={document} />;
        case "simple-clean":
            return <SimpleCleanPDF document={document} />;
        // For remaining templates, fall back to Classic for now
        case "signature":
        case "total-highlight":
        case "blue-banner":
        case "watercolor":
        case "sidebar":
        case "blue-accent":
        case "two-column":
        case "lowercase-minimal":
        case "beach-wave":
        case "blue-header-bar":
        case "circular-modern":
        case "classic":
        default:
            return <ClassicPDF document={document} />;
    }
}
