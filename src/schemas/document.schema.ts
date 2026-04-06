import { z } from "zod";

export const businessInfoSchema = z.object({
  name: z.string().min(1, "Business name is required").max(100),
  logo: z.string().optional(),
  address: z.string().max(500).optional(),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  phone: z.string().max(20).optional(),
  website: z.string().url("Invalid URL").optional().or(z.literal("")),
  taxId: z.string().max(50).optional(),
});

export const clientInfoSchema = z.object({
  name: z.string().min(1, "Client name is required").max(100),
  company: z.string().max(100).optional(),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  phone: z.string().max(20).optional(),
  address: z.string().max(500).optional(),
});

export const lineItemSchema = z.object({
  id: z.string(),
  description: z.string().min(1, "Description is required").max(500),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  unitPrice: z.number().min(0, "Price cannot be negative"),
  taxRate: z.number().min(0).max(100, "Tax rate must be 0-100%"),
  discountPercent: z.number().min(0).max(100, "Discount must be 0-100%"),
});

export const documentDetailsSchema = z.object({
  documentNumber: z.string().min(1, "Document number is required"),
  issueDate: z.string().min(1, "Issue date is required"),
  dueDate: z.string().optional(),
  validUntil: z.string().optional(),
  poNumber: z.string().max(50).optional(),
  currency: z.string().min(1, "Currency is required"),
  notes: z.string().max(2000).optional(),
  terms: z.string().max(5000).optional(),
});

export const documentSchema = z.object({
  type: z.enum(["invoice", "quotation"]),
  business: businessInfoSchema,
  client: clientInfoSchema,
  details: documentDetailsSchema,
  items: z.array(lineItemSchema).min(1, "At least one line item is required"),
  template: z.enum([
    "classic",
    "modern",
    "minimalist",
    "corporate",
    "creative",
  ]),
  accentColor: z.string(),
  customTemplate: z.string().optional(),
});

export type BusinessInfoFormData = z.infer<typeof businessInfoSchema>;
export type ClientInfoFormData = z.infer<typeof clientInfoSchema>;
export type LineItemFormData = z.infer<typeof lineItemSchema>;
export type DocumentDetailsFormData = z.infer<typeof documentDetailsSchema>;
export type DocumentFormData = z.infer<typeof documentSchema>;
