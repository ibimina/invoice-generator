# Contributing

Thank you for your interest in contributing to Invoice Generator!

## Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, pnpm, or bun
- Git

### Setup

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/your-username/invoice-generator.git
   cd invoice-generator
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## Development Workflow

### Branch Naming

- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring

Example: `feature/add-new-template`

### Commit Messages

Use clear, descriptive commit messages:

```
feat: add new watercolor template
fix: correct tax calculation for discounts
docs: update README with new features
refactor: extract common PDF styles
```

## Code Style

### TypeScript

- Use strict TypeScript
- Define types in `src/types/`
- Avoid `any` type

### Components

- Use functional components with hooks
- Place in appropriate directory under `src/components/`
- Export from index file if creating a directory

### Styling

- Use Tailwind CSS classes
- Follow existing class patterns
- Test responsive design

## Adding a New Template

1. Add template name to `src/types/document.ts`:
   ```typescript
   export type Template = "classic" | "modern" | ... | "your-template";
   ```

2. Create PDF template in `src/components/pdf/PDFTemplates.tsx`:
   ```typescript
   export function YourTemplatePDF({ document }: PDFTemplateProps) {
     // Implementation
   }
   ```

3. Create preview template in `src/components/preview/DocumentPreview.tsx`

4. Add to template selection in the wizard

5. Update documentation

## Testing

### Manual Testing

- Test all form steps
- Verify PDF generation
- Check responsive design
- Test with different data scenarios

### Build Verification

```bash
npm run build
```

Ensure no TypeScript or build errors.

## Pull Request Process

1. Create a feature branch
2. Make your changes
3. Run lint and build:
   ```bash
   npm run lint
   npm run build
   ```
4. Push to your fork
5. Open a Pull Request with:
   - Clear description of changes
   - Screenshots for UI changes
   - Link to related issues

## Issue Reporting

### Bug Reports

Include:
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots if applicable
- Browser/OS information

### Feature Requests

Include:
- Use case description
- Proposed solution
- Alternative approaches considered

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Help others learn and grow

## Questions?

Open a discussion or issue on GitHub.
