# Architecture

This document describes the architecture and design decisions of the Invoice Generator application.

## Overview

Invoice Generator is a Next.js 16 application that allows users to create professional invoices and quotations with multiple template designs and PDF export capabilities.

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| UI Components | Radix UI Primitives |
| Styling | Tailwind CSS v4 |
| Forms | React Hook Form + Zod |
| PDF Generation | @react-pdf/renderer |
| Icons | Lucide React |

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── create/            # Document creation wizard
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
│
├── components/
│   ├── pdf/               # PDF generation components
│   │   └── PDFTemplates.tsx  # All 17 PDF templates
│   ├── preview/           # Document preview components
│   ├── ui/                # Reusable UI components (shadcn/ui)
│   └── wizard/            # Multi-step form wizard
│
├── context/               # React context providers
├── hooks/                 # Custom React hooks
├── lib/                   # Utility functions
├── schemas/               # Zod validation schemas
└── types/                 # TypeScript type definitions
    └── document.ts        # Core document types
```

## Core Domain Model

### Document Types

The application supports two document types:
- **Invoice** - For billing clients
- **Quotation** - For price estimates

### Data Model

```typescript
DocumentData
├── type: "invoice" | "quotation"
├── business: BusinessInfo      # Sender details
├── client: ClientInfo          # Recipient details
├── details: DocumentDetails    # Document metadata
├── items: LineItem[]           # Line items
├── template: Template          # Visual template
└── accentColor: AccentColor    # Theme color
```

### Templates

17 professionally designed templates are available:

| Template | Style |
|----------|-------|
| classic | Traditional business layout |
| modern | Contemporary with colored header |
| minimalist | Clean, simple design |
| corporate | Sidebar with business info |
| creative | Bold colors and shapes |
| simple-clean | Minimal with accent borders |
| signature | Includes signature line |
| total-highlight | Prominent total display |
| blue-banner | Colored header banner |
| watercolor | Soft gradient background |
| sidebar | Left sidebar accent |
| blue-accent | Blue theme accents |
| two-column | Split header layout |
| lowercase-minimal | Lowercase typography |
| beach-wave | Wave pattern decoration |
| blue-header-bar | Full-width header bar |
| circular-modern | Circular design elements |

### Accent Colors

10 predefined accent colors:
- teal, blue, crimson, slate, purple
- emerald, orange, pink, indigo, amber

## Key Components

### PDF Generation

PDF generation uses `@react-pdf/renderer` with custom template components:

```
PDFTemplates.tsx
├── ClassicPDF
├── ModernPDF
├── MinimalistPDF
├── CorporatePDF
├── CreativePDF
├── SimpleCleanPDF
├── SignaturePDF
├── TotalHighlightPDF
├── BlueBannerPDF
├── WatercolorPDF
├── SidebarPDF
├── BlueAccentPDF
├── TwoColumnPDF
├── LowercaseMinimalPDF
├── BeachWavePDF
├── BlueHeaderBarPDF
└── CircularModernPDF
```

Each template:
- Receives `DocumentData` as props
- Renders using React-PDF primitives (`Document`, `Page`, `View`, `Text`)
- Handles currency formatting, date formatting, and calculations
- Supports dynamic accent colors

### Document Preview

The preview system renders HTML versions of templates for real-time preview before PDF generation. Templates in `preview/DocumentPreview.tsx` mirror the PDF templates.

### Form Wizard

Multi-step form for document creation:
1. **Business Details** - Your company information
2. **Client Details** - Customer information
3. **Document Details** - Numbers, dates, terms
4. **Line Items** - Products/services
5. **Template Selection** - Choose design and color

## Data Flow

```
User Input → React Hook Form → Zod Validation → DocumentData
                                                     ↓
                                              Document Preview
                                                     ↓
                                              PDF Generation
                                                     ↓
                                              Download PDF
```

## Calculations

Line item calculations:
```
lineTotal = quantity × unitPrice
discount = lineTotal × (discountPercent / 100)
afterDiscount = lineTotal - discount
tax = afterDiscount × (taxRate / 100)
```

Document totals:
```
subtotal = Σ(lineTotal)
totalDiscount = Σ(discount)
totalTax = Σ(tax)
grandTotal = subtotal - totalDiscount + totalTax
```

## Styling Architecture

### Tailwind CSS v4

Using the latest Tailwind CSS with:
- CSS variables for theming
- PostCSS integration
- Responsive design utilities

### Component Library

UI components based on shadcn/ui patterns:
- Radix UI primitives for accessibility
- Class Variance Authority for variants
- Tailwind Merge for class composition

## PDF-Specific Constraints

React-PDF has limitations compared to web CSS:

| Feature | Web CSS | React-PDF |
|---------|---------|-----------|
| Flexbox | Full support | Partial support |
| Grid | Yes | No |
| Gradients | CSS gradients | SVG LinearGradient |
| Fonts | Any web font | Registered fonts only |
| Text rotation | transform | transform + width required |

## Future Considerations

- [ ] Cloud storage for documents
- [ ] User authentication
- [ ] Template customization
- [ ] Multi-language support
- [ ] Email integration
- [ ] Payment tracking
