# Invoice Generator

A modern, open-source invoice and quotation generator built with Next.js 16. Create professional documents with 17 beautiful templates and export them as PDFs.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)

## Features

- **17 Professional Templates** - Classic, Modern, Minimalist, Corporate, Creative, and more
- **Invoice & Quotation Support** - Create both document types with appropriate fields
- **Real-time Preview** - See your document as you build it
- **PDF Export** - High-quality PDF generation with @react-pdf/renderer
- **10 Accent Colors** - Customize your brand colors
- **Responsive Design** - Works on desktop and mobile
- **No Account Required** - Use immediately without sign-up

## Templates

| | | | |
|---|---|---|---|
| Classic | Modern | Minimalist | Corporate |
| Creative | Simple Clean | Signature | Total Highlight |
| Blue Banner | Watercolor | Sidebar | Blue Accent |
| Two Column | Lowercase Minimal | Beach Wave | Blue Header Bar |
| Circular Modern | | | |

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, pnpm, or bun

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/invoice-generator.git
cd invoice-generator

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to start creating invoices.

### Build for Production

```bash
npm run build
npm start
```

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **UI Components**: [Radix UI](https://www.radix-ui.com/) + [shadcn/ui](https://ui.shadcn.com/)
- **Forms**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **PDF**: [@react-pdf/renderer](https://react-pdf.org/)
- **Icons**: [Lucide React](https://lucide.dev/)

## Project Structure

```
src/
├── app/                 # Next.js pages
│   └── create/         # Document creation wizard
├── components/
│   ├── pdf/            # PDF templates
│   ├── preview/        # Live preview
│   ├── ui/             # UI components
│   └── wizard/         # Form wizard
├── hooks/              # Custom hooks
├── schemas/            # Validation schemas
└── types/              # TypeScript types
```

See [docs/](docs/) for detailed documentation:
- [Architecture](docs/architecture.md) - System design and technical decisions
- [Templates](docs/templates.md) - Available templates and customization
- [Contributing](docs/contributing.md) - How to contribute

## Usage

1. **Start the wizard** - Click "Create Invoice" or "Create Quotation"
2. **Enter business details** - Your company name, address, logo
3. **Add client info** - Customer details
4. **Set document details** - Invoice number, dates, terms
5. **Add line items** - Products/services with quantities and prices
6. **Choose a template** - Select design and accent color
7. **Download PDF** - Export your professional document

## Contributing

Contributions are welcome! Please read our contributing guidelines before submitting PRs.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/) - The React framework
- [React PDF](https://react-pdf.org/) - PDF rendering
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [Radix UI](https://www.radix-ui.com/) - Accessible primitives
