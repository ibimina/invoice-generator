"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";
import Link from "next/link";
import { DocumentProvider, useDocument } from "@/context/DocumentContext";
import { WizardStepper } from "@/components/wizard/WizardStepper";
import { WizardContent } from "@/components/wizard/WizardContent";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { FileText, Plus, Home } from "lucide-react";
import { DocumentType } from "@/types/document";

function CreatePageContent() {
    const searchParams = useSearchParams();
    const { state, setDocumentType, resetDocument } = useDocument();
    const { document, currentStep } = state;

    // Set initial document type from URL
    useEffect(() => {
        const typeParam = searchParams.get("type");
        if (typeParam === "invoice" || typeParam === "quotation") {
            if (typeParam !== document.type) {
                setDocumentType(typeParam as DocumentType);
            }
        }
    }, [searchParams, document.type, setDocumentType]);

    const handleTypeChange = (value: DocumentType) => {
        setDocumentType(value);
    };

    const handleNewDocument = () => {
        if (confirm("Start a new document? This will clear all current data.")) {
            resetDocument();
        }
    };

    return (
        <div className="flex min-h-screen flex-col bg-slate-50">
            {/* Header */}
            <header className="sticky top-0 z-50 border-b border-slate-200 bg-white shadow-sm">
                <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
                    <div className="flex items-center gap-4">
                        <Link href="/" className="flex items-center gap-2">
                            <FileText className="h-7 w-7 text-teal-600" />
                            <span className="text-lg font-bold text-slate-900">
                                Invoice Generator
                            </span>
                        </Link>

                        {/* Document Type Selector */}
                        <Select value={document.type} onValueChange={handleTypeChange}>
                            <SelectTrigger className="w-[140px] border-slate-200">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="invoice">Invoice</SelectItem>
                                <SelectItem value="quotation">Quotation</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleNewDocument}
                            className="gap-2 text-slate-600"
                        >
                            <Plus className="h-4 w-4" />
                            New
                        </Button>
                        <Link href="/">
                            <Button variant="ghost" size="sm" className="gap-2 text-slate-600">
                                <Home className="h-4 w-4" />
                                Home
                            </Button>
                        </Link>
                    </div>
                </div>
            </header>

            {/* Progress Stepper */}
            <div className="border-b border-slate-200 bg-white py-6">
                <div className="mx-auto max-w-3xl px-4">
                    <WizardStepper />
                </div>
            </div>

            {/* Main Content */}
            <main className="flex-1 py-8">
                <div className="mx-auto max-w-3xl px-4">
                    <div className="animate-fade-in">
                        <WizardContent />
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="border-t border-slate-200 bg-white py-4">
                <div className="mx-auto max-w-5xl px-4 text-center text-sm text-slate-500">
                    Your data is processed locally and never sent to any server.
                </div>
            </footer>
        </div>
    );
}

export default function CreatePage() {
    return (
        <DocumentProvider>
            <Suspense fallback={
                <div className="flex min-h-screen items-center justify-center">
                    <div className="text-slate-500">Loading...</div>
                </div>
            }>
                <CreatePageContent />
            </Suspense>
        </DocumentProvider>
    );
}
