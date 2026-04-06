"use client";

import { useState } from "react";
import { useDocument } from "@/context/DocumentContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    FileText,
    ArrowLeft,
    Loader2,
    RefreshCw
} from "lucide-react";
import { useExport } from "@/hooks/useExport";
import { DocumentPreview } from "@/components/preview/DocumentPreview";

export function PreviewStep() {
    const { state, returnFromPreview, resetDocument } = useDocument();
    const { document } = state;
    const { exportToPDF, isExporting, exportType } = useExport();

    const [zoom, setZoom] = useState(100);

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
                    <CardTitle className="text-lg">Download</CardTitle>
                    <CardDescription>
                        Export your document as a professional PDF
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Button
                        onClick={exportToPDF}
                        disabled={isExporting}
                        className="w-full gap-2 bg-red-600 hover:bg-red-700"
                        size="lg"
                    >
                        {isExporting && exportType === "pdf" ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                            <FileText className="h-5 w-5" />
                        )}
                        Download PDF
                    </Button>
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
