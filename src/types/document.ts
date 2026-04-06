export type DocumentType = "invoice" | "quotation";

export type Template =
  | "classic"
  | "modern"
  | "minimalist"
  | "corporate"
  | "creative"
  | "simple-clean"
  | "signature"
  | "total-highlight"
  | "blue-banner"
  | "watercolor"
  | "sidebar"
  | "blue-accent"
  | "two-column"
  | "lowercase-minimal"
  | "beach-wave"
  | "blue-header-bar"
  | "circular-modern";

export type AccentColor =
  | "teal"
  | "blue"
  | "crimson"
  | "slate"
  | "purple"
  | "emerald"
  | "orange"
  | "pink"
  | "indigo"
  | "amber";

export interface BusinessInfo {
  name: string;
  logo?: string; // base64 encoded image
  address?: string;
  email?: string;
  phone?: string;
  website?: string;
  taxId?: string;
}

export interface ClientInfo {
  name: string;
  company?: string;
  email?: string;
  phone?: string;
  address?: string;
}

export interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  taxRate: number; // percentage
  discountPercent: number; // percentage
}

export interface DocumentDetails {
  documentNumber: string;
  issueDate: string;
  dueDate?: string; // for invoices
  validUntil?: string; // for quotations
  poNumber?: string;
  currency: string;
  notes?: string;
  terms?: string;
}

export interface DocumentData {
  type: DocumentType;
  business: BusinessInfo;
  client: ClientInfo;
  details: DocumentDetails;
  items: LineItem[];
  template: Template;
  accentColor: AccentColor | string;
  customTemplate?: string; // base64 encoded image
}

export interface CalculatedTotals {
  subtotal: number;
  totalDiscount: number;
  totalTax: number;
  grandTotal: number;
}

export const CURRENCIES = [
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "NGN", symbol: "₦", name: "Nigerian Naira" },
  { code: "CAD", symbol: "C$", name: "Canadian Dollar" },
  { code: "AUD", symbol: "A$", name: "Australian Dollar" },
  { code: "INR", symbol: "₹", name: "Indian Rupee" },
  { code: "JPY", symbol: "¥", name: "Japanese Yen" },
  { code: "CNY", symbol: "¥", name: "Chinese Yuan" },
  { code: "ZAR", symbol: "R", name: "South African Rand" },
] as const;

export const ACCENT_COLORS: Record<AccentColor, string> = {
  teal: "#14b8a6",
  blue: "#3b82f6",
  crimson: "#dc2626",
  slate: "#64748b",
  purple: "#a855f7",
  emerald: "#10b981",
  orange: "#f97316",
  pink: "#ec4899",
  indigo: "#6366f1",
  amber: "#f59e0b",
};

export const TEMPLATES: { id: Template; name: string; description: string }[] =
  [
    {
      id: "classic",
      name: "Classic",
      description: "Professional and clean layout",
    },
    {
      id: "modern",
      name: "Modern",
      description: "Bold header with gradient accents",
    },
    {
      id: "minimalist",
      name: "Minimalist",
      description: "Light styling with ample whitespace",
    },
    {
      id: "corporate",
      name: "Corporate",
      description: "Formal sidebar layout",
    },
    {
      id: "creative",
      name: "Creative",
      description: "Watermark and bold borders",
    },
    {
      id: "simple-clean",
      name: "Simple Clean",
      description: "Blue INVOICE header, minimal design",
    },
    {
      id: "signature",
      name: "Signature",
      description: "Elegant with script signature area",
    },
    {
      id: "total-highlight",
      name: "Total Highlight",
      description: "Prominently boxed invoice total",
    },
    {
      id: "blue-banner",
      name: "Blue Banner",
      description: "Stars decoration with thank you",
    },
    {
      id: "watercolor",
      name: "Watercolor",
      description: "Artistic brush stroke design",
    },
    {
      id: "sidebar",
      name: "Sidebar",
      description: "Rotated invoice number on side",
    },
    {
      id: "blue-accent",
      name: "Blue Accent",
      description: "Clean with blue accent lines",
    },
    {
      id: "two-column",
      name: "Two Column",
      description: "Split header layout",
    },
    {
      id: "lowercase-minimal",
      name: "Lowercase Minimal",
      description: "Simple lowercase invoice text",
    },
    {
      id: "beach-wave",
      name: "Beach Wave",
      description: "Watercolor waves at bottom",
    },
    {
      id: "blue-header-bar",
      name: "Blue Header Bar",
      description: "Solid blue banner header",
    },
    {
      id: "circular-modern",
      name: "Circular Modern",
      description: "Red circle accent design",
    },
  ];

export const DEFAULT_TERMS = {
  invoice: `1. Payment is due within 30 days of the invoice date.
2. Late payments may be subject to a 1.5% monthly interest charge.
3. Please include the invoice number with your payment.`,
  quotation: `1. This quotation is valid for 30 days from the issue date.
2. Prices are subject to change after validity period.
3. A 50% deposit is required upon acceptance.`,
};
