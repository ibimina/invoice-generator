"use client";

import { useState } from "react";
import { useDocument } from "@/context/DocumentContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    FileText,
    Image as ImageIcon,
    Code,
    ArrowLeft,
    Loader2,
    RefreshCw
} from "lucide-react";
import { useExport } from "@/hooks/useExport";
import { cn } from "@/lib/utils";
import { DocumentPreview } from "@/components/preview/DocumentPreview";

export function PreviewStep() {
    const { state, returnFromPreview, resetDocument } = useDocument();
    const { document } = state;
    const { exportToPDF, exportToPNG, exportToHTML, isExporting, exportType } = useExport();

    const [zoom, setZoom] = useState(100);

    const exportOptions = [
        {
            id: "pdf",
            label: "PDF Document",
            description: "Professional PDF file for sharing",
            icon: FileText,
            action: exportToPDF,
            color: "text-red-500",
            bgColor: "bg-red-50",
        },
        {
            id: "png",
            label: "PNG Image",
            description: "High-resolution image for quick sharing",
            icon: ImageIcon,
            action: exportToPNG,
            color: "text-blue-500",
            bgColor: "bg-blue-50",
        },
        {
            id: "html",
            label: "HTML File",
            description: "Open in browser, print as PDF",
            icon: Code,
            action: exportToHTML,
            color: "text-green-500",
            bgColor: "bg-green-50",
        },
    ];

    return (
        <div className="space-y-6">
            {/* Preview Card */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100">
                                <FileText className="h-5 w-5 text-emerald-600" />
                            </div>
                            <div>
                                <CardTitle>Preview Your {document.type === "invoice" ? "Invoice" : "Quotation"}</CardTitle>
                                <CardDescription>
                                    Review and export your document
                                </CardDescription>
                            </div>
                        </div>

                        {/* Zoom Controls */}
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setZoom(Math.max(50, zoom - 25))}
                                disabled={zoom <= 50}
                            >
                                −
                            </Button>
                            <span className="w-14 text-center text-sm">{zoom}%</span>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setZoom(Math.min(150, zoom + 25))}
                                disabled={zoom >= 150}
                            >
                                +
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {/* Debug: Show current template */}
                    <div className="mb-2 text-sm text-slate-500">
                        Template: <span className="font-medium text-teal-600">{document.template}</span>
                    </div>
                    <div className="overflow-auto rounded-lg border border-slate-200 bg-slate-100 p-4">
                        <div
                            className="mx-auto transition-transform"
                            style={{
                                transform: `scale(${zoom / 100})`,
                                transformOrigin: 'top center',
                                width: 'fit-content'
                            }}
                        >
                            <DocumentPreview document={document} />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Export Options */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Export Options</CardTitle>
                    <CardDescription>
                        Choose your preferred format to download
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 sm:grid-cols-3">
                        {exportOptions.map((option) => (
                            <button
                                key={option.id}
                                onClick={option.action}
                                disabled={isExporting}
                                className={cn(
                                    "flex flex-col items-center rounded-xl border-2 border-slate-200 p-6 transition-all",
                                    "hover:border-slate-300 hover:bg-slate-50",
                                    "disabled:cursor-not-allowed disabled:opacity-50"
                                )}
                            >
                                <div className={cn("mb-3 rounded-full p-3", option.bgColor)}>
                                    {isExporting && exportType === option.id ? (
                                        <Loader2 className={cn("h-6 w-6 animate-spin", option.color)} />
                                    ) : (
                                        <option.icon className={cn("h-6 w-6", option.color)} />
                                    )}
                                </div>
                                <span className="font-medium text-slate-900">{option.label}</span>
                                <span className="mt-1 text-center text-xs text-slate-500">
                                    {option.description}
                                </span>
                            </button>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Navigation */}
            <div className="flex items-center justify-between border-t border-slate-200 pt-6">
                <Button variant="outline" onClick={returnFromPreview} className="gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Back to Edit
                </Button>

                <Button
                    variant="ghost"
                    onClick={resetDocument}
                    className="gap-2 text-slate-500"
                >
                    <RefreshCw className="h-4 w-4" />
                    Start New
                </Button>
            </div>
        </div>
    );
}
