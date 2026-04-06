"use client";

import { useRef, useCallback } from "react";
import { useDocument } from "@/context/DocumentContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { WizardNavigation } from "../WizardNavigation";
import { Palette, Check, Upload, X } from "lucide-react";
import { ACCENT_COLORS, AccentColor } from "@/types/document";
import { cn } from "@/lib/utils";

export function StyleStep() {
    const { state, setTemplate, setAccentColor, dispatch } = useDocument();
    const { template, accentColor, customTemplate } = state.document;
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleTemplateUpload = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            if (!file) return;

            if (!file.type.startsWith("image/")) {
                alert("Please upload an image file");
                return;
            }

            if (file.size > 5 * 1024 * 1024) {
                alert("Image must be less than 5MB");
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                dispatch({ type: "SET_CUSTOM_TEMPLATE", payload: reader.result as string });
            };
            reader.readAsDataURL(file);
        },
        [dispatch]
    );

    const handleRemoveCustomTemplate = useCallback(() => {
        dispatch({ type: "SET_CUSTOM_TEMPLATE", payload: undefined });
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    }, [dispatch]);

    const isCustomColor = !Object.keys(ACCENT_COLORS).includes(accentColor as AccentColor);

    return (
        <div className="space-y-6">
            {/* Template Selection */}
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100">
                            <Palette className="h-5 w-5 text-indigo-600" />
                        </div>
                        <div>
                            <CardTitle>Choose a Template</CardTitle>
                            <CardDescription>
                                Select a template style for your document
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {/* Classic Template */}
                        <button
                            onClick={() => setTemplate("classic")}
                            className={cn(
                                "relative flex flex-col rounded-xl border-2 p-3 transition-all overflow-hidden",
                                template === "classic"
                                    ? "border-teal-500 bg-teal-50"
                                    : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                            )}
                        >
                            {template === "classic" && (
                                <div className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-teal-500 text-white z-10">
                                    <Check className="h-4 w-4" />
                                </div>
                            )}
                            <div className="h-32 w-full bg-white rounded border border-slate-200 p-2">
                                <div className="flex justify-between items-start mb-1">
                                    <div className="h-4 w-4 rounded bg-slate-200" />
                                    <div className="h-2 w-8 rounded" style={{ backgroundColor: ACCENT_COLORS[accentColor as AccentColor] || accentColor }} />
                                </div>
                                <div className="h-0.5 w-full my-1" style={{ backgroundColor: ACCENT_COLORS[accentColor as AccentColor] || accentColor }} />
                                <div className="flex gap-1 mb-1">
                                    <div className="flex-1 p-1 border border-slate-100 rounded">
                                        <div className="h-1 w-4 rounded bg-slate-200 mb-0.5" />
                                        <div className="h-1 w-full rounded bg-slate-100" />
                                    </div>
                                    <div className="flex-1 p-1 border border-slate-100 rounded">
                                        <div className="h-1 w-4 rounded bg-slate-200 mb-0.5" />
                                        <div className="h-1 w-full rounded bg-slate-100" />
                                    </div>
                                </div>
                                <div className="space-y-0.5">
                                    <div className="h-1 w-full rounded bg-slate-100" />
                                    <div className="h-1 w-full rounded bg-slate-100" />
                                </div>
                                <div className="mt-1 pt-1 border-t border-slate-100 flex justify-end">
                                    <div className="h-1.5 w-8 rounded" style={{ backgroundColor: ACCENT_COLORS[accentColor as AccentColor] || accentColor }} />
                                </div>
                            </div>
                            <span className="mt-2 font-medium text-slate-900 text-sm">Classic</span>
                            <span className="text-xs text-slate-500">Professional and clean</span>
                        </button>

                        {/* Modern Template */}
                        <button
                            onClick={() => setTemplate("modern")}
                            className={cn(
                                "relative flex flex-col rounded-xl border-2 p-3 transition-all overflow-hidden",
                                template === "modern"
                                    ? "border-teal-500 bg-teal-50"
                                    : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                            )}
                        >
                            {template === "modern" && (
                                <div className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-teal-500 text-white z-10">
                                    <Check className="h-4 w-4" />
                                </div>
                            )}
                            <div className="h-32 w-full bg-white rounded border border-slate-200 overflow-hidden">
                                <div className="h-6 p-1 flex items-center justify-between" style={{ background: `linear-gradient(to right, ${ACCENT_COLORS[accentColor as AccentColor] || accentColor}, ${ACCENT_COLORS[accentColor as AccentColor] || accentColor}dd)` }}>
                                    <div className="h-3 w-3 rounded bg-white/30" />
                                    <div className="h-1.5 w-10 rounded bg-white/50" />
                                </div>
                                <div className="p-2">
                                    <div className="flex gap-2 mb-1">
                                        <div className="flex-1">
                                            <div className="h-1 w-6 rounded mb-0.5" style={{ backgroundColor: `${ACCENT_COLORS[accentColor as AccentColor] || accentColor}40` }} />
                                            <div className="h-1 w-full rounded bg-slate-100" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="h-1 w-6 rounded mb-0.5" style={{ backgroundColor: `${ACCENT_COLORS[accentColor as AccentColor] || accentColor}40` }} />
                                            <div className="h-1 w-full rounded bg-slate-100" />
                                        </div>
                                    </div>
                                    <div className="space-y-0.5 mb-1">
                                        <div className="h-1 w-full rounded bg-slate-100" />
                                        <div className="h-1 w-full rounded bg-slate-100" />
                                    </div>
                                    <div className="rounded p-1 flex justify-between items-center" style={{ backgroundColor: `${ACCENT_COLORS[accentColor as AccentColor] || accentColor}15` }}>
                                        <div className="h-1 w-4 rounded" style={{ backgroundColor: `${ACCENT_COLORS[accentColor as AccentColor] || accentColor}40` }} />
                                        <div className="h-1.5 w-6 rounded" style={{ backgroundColor: ACCENT_COLORS[accentColor as AccentColor] || accentColor }} />
                                    </div>
                                </div>
                            </div>
                            <span className="mt-2 font-medium text-slate-900 text-sm">Modern</span>
                            <span className="text-xs text-slate-500">Bold header with gradients</span>
                        </button>

                        {/* Minimalist Template */}
                        <button
                            onClick={() => setTemplate("minimalist")}
                            className={cn(
                                "relative flex flex-col rounded-xl border-2 p-3 transition-all overflow-hidden",
                                template === "minimalist"
                                    ? "border-teal-500 bg-teal-50"
                                    : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                            )}
                        >
                            {template === "minimalist" && (
                                <div className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-teal-500 text-white z-10">
                                    <Check className="h-4 w-4" />
                                </div>
                            )}
                            <div className="h-32 w-full bg-white rounded border border-slate-200 p-3">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="h-3 w-3 rounded-sm bg-slate-300" />
                                    <div className="h-1 w-8 rounded bg-slate-400" />
                                </div>
                                <div className="h-px w-full bg-slate-200 mb-2" />
                                <div className="space-y-1.5 mb-2">
                                    <div className="flex justify-between">
                                        <div className="h-0.5 w-6 rounded bg-slate-300" />
                                        <div className="h-0.5 w-10 rounded bg-slate-200" />
                                    </div>
                                    <div className="flex justify-between">
                                        <div className="h-0.5 w-8 rounded bg-slate-300" />
                                        <div className="h-0.5 w-6 rounded bg-slate-200" />
                                    </div>
                                </div>
                                <div className="h-px w-full bg-slate-200 mb-1" />
                                <div className="flex justify-between items-center">
                                    <div className="h-0.5 w-4 rounded bg-slate-400" />
                                    <div className="h-1 w-6 rounded bg-slate-500" />
                                </div>
                            </div>
                            <span className="mt-2 font-medium text-slate-900 text-sm">Minimalist</span>
                            <span className="text-xs text-slate-500">Clean and simple</span>
                        </button>

                        {/* Corporate Template */}
                        <button
                            onClick={() => setTemplate("corporate")}
                            className={cn(
                                "relative flex flex-col rounded-xl border-2 p-3 transition-all overflow-hidden",
                                template === "corporate"
                                    ? "border-teal-500 bg-teal-50"
                                    : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                            )}
                        >
                            {template === "corporate" && (
                                <div className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-teal-500 text-white z-10">
                                    <Check className="h-4 w-4" />
                                </div>
                            )}
                            <div className="h-32 w-full bg-white rounded border border-slate-200 flex overflow-hidden">
                                <div className="w-8 p-1.5 flex flex-col items-center" style={{ backgroundColor: ACCENT_COLORS[accentColor as AccentColor] || accentColor }}>
                                    <div className="h-3 w-3 rounded bg-white/30 mb-1" />
                                    <div className="h-0.5 w-3 rounded bg-white/50 mb-0.5" />
                                    <div className="h-0.5 w-2 rounded bg-white/30 mb-0.5" />
                                    <div className="h-0.5 w-3 rounded bg-white/30" />
                                </div>
                                <div className="flex-1 p-2">
                                    <div className="h-1.5 w-10 rounded mb-1" style={{ backgroundColor: `${ACCENT_COLORS[accentColor as AccentColor] || accentColor}40` }} />
                                    <div className="space-y-0.5 mb-1">
                                        <div className="h-1 w-full rounded bg-slate-100" />
                                        <div className="h-1 w-full rounded bg-slate-100" />
                                        <div className="h-1 w-3/4 rounded bg-slate-100" />
                                    </div>
                                    <div className="border-t border-slate-100 pt-1 mt-auto">
                                        <div className="flex justify-between">
                                            <div className="h-0.5 w-4 rounded bg-slate-200" />
                                            <div className="h-1 w-6 rounded" style={{ backgroundColor: ACCENT_COLORS[accentColor as AccentColor] || accentColor }} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <span className="mt-2 font-medium text-slate-900 text-sm">Corporate</span>
                            <span className="text-xs text-slate-500">Formal sidebar layout</span>
                        </button>

                        {/* Creative Template */}
                        <button
                            onClick={() => setTemplate("creative")}
                            className={cn(
                                "relative flex flex-col rounded-xl border-2 p-3 transition-all overflow-hidden",
                                template === "creative"
                                    ? "border-teal-500 bg-teal-50"
                                    : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                            )}
                        >
                            {template === "creative" && (
                                <div className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-teal-500 text-white z-10">
                                    <Check className="h-4 w-4" />
                                </div>
                            )}
                            <div className="h-32 w-full bg-white rounded border border-slate-200 p-2 relative overflow-hidden">
                                <div className="absolute inset-0 flex items-center justify-center opacity-5 text-xs font-bold rotate-[-15deg]" style={{ color: ACCENT_COLORS[accentColor as AccentColor] || accentColor }}>
                                    INVOICE
                                </div>
                                <div className="relative">
                                    <div className="flex justify-between items-start mb-1">
                                        <div className="h-4 w-4 rounded-full bg-slate-200" />
                                        <div className="px-1.5 py-0.5 rounded-full" style={{ backgroundColor: ACCENT_COLORS[accentColor as AccentColor] || accentColor }}>
                                            <div className="h-1 w-6 rounded bg-white" />
                                        </div>
                                    </div>
                                    <div className="pl-1.5 mb-1" style={{ borderLeftWidth: '2px', borderLeftColor: ACCENT_COLORS[accentColor as AccentColor] || accentColor }}>
                                        <div className="h-1 w-8 rounded bg-slate-300 mb-0.5" />
                                        <div className="h-1 w-12 rounded bg-slate-200" />
                                    </div>
                                    <div className="space-y-0.5 mb-1">
                                        <div className="h-1 w-full rounded bg-slate-100" />
                                        <div className="h-1 w-full rounded bg-slate-100" />
                                    </div>
                                    <div className="rounded p-1 flex justify-between" style={{ backgroundColor: `${ACCENT_COLORS[accentColor as AccentColor] || accentColor}15` }}>
                                        <div className="h-1 w-4 rounded" style={{ backgroundColor: `${ACCENT_COLORS[accentColor as AccentColor] || accentColor}40` }} />
                                        <div className="h-1.5 w-8 rounded" style={{ backgroundColor: ACCENT_COLORS[accentColor as AccentColor] || accentColor }} />
                                    </div>
                                </div>
                            </div>
                            <span className="mt-2 font-medium text-slate-900 text-sm">Creative</span>
                            <span className="text-xs text-slate-500">Watermark and bold accents</span>
                        </button>

                        {/* Simple Clean Template */}
                        <button
                            onClick={() => setTemplate("simple-clean")}
                            className={cn(
                                "relative flex flex-col rounded-xl border-2 p-3 transition-all overflow-hidden",
                                template === "simple-clean"
                                    ? "border-teal-500 bg-teal-50"
                                    : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                            )}
                        >
                            {template === "simple-clean" && (
                                <div className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-teal-500 text-white z-10">
                                    <Check className="h-4 w-4" />
                                </div>
                            )}
                            <div className="h-32 w-full bg-white rounded border border-slate-200 p-2">
                                <div className="text-[8px] font-bold text-blue-600 mb-2">INVOICE</div>
                                <div className="flex justify-between mb-2">
                                    <div className="space-y-0.5">
                                        <div className="h-1 w-8 rounded bg-slate-300" />
                                        <div className="h-1 w-6 rounded bg-slate-200" />
                                    </div>
                                    <div className="space-y-0.5 text-right">
                                        <div className="h-1 w-6 rounded bg-slate-200 ml-auto" />
                                        <div className="h-1 w-8 rounded bg-slate-200 ml-auto" />
                                    </div>
                                </div>
                                <div className="space-y-0.5">
                                    <div className="h-1 w-full rounded bg-slate-100" />
                                    <div className="h-1 w-full rounded bg-slate-100" />
                                </div>
                            </div>
                            <span className="mt-2 font-medium text-slate-900 text-sm">Simple Clean</span>
                            <span className="text-xs text-slate-500">Blue header, minimal design</span>
                        </button>

                        {/* Signature Template */}
                        <button
                            onClick={() => setTemplate("signature")}
                            className={cn(
                                "relative flex flex-col rounded-xl border-2 p-3 transition-all overflow-hidden",
                                template === "signature"
                                    ? "border-teal-500 bg-teal-50"
                                    : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                            )}
                        >
                            {template === "signature" && (
                                <div className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-teal-500 text-white z-10">
                                    <Check className="h-4 w-4" />
                                </div>
                            )}
                            <div className="h-32 w-full bg-white rounded border border-slate-200 p-2">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="h-4 w-4 rounded bg-slate-200" />
                                    <div className="text-[6px] text-slate-400">INVOICE</div>
                                </div>
                                <div className="space-y-0.5 mb-2">
                                    <div className="h-1 w-full rounded bg-slate-100" />
                                    <div className="h-1 w-full rounded bg-slate-100" />
                                </div>
                                <div className="mt-auto pt-2 border-t border-slate-100">
                                    <div className="h-2 w-12 rounded bg-slate-200 italic" style={{ fontFamily: 'cursive' }} />
                                </div>
                            </div>
                            <span className="mt-2 font-medium text-slate-900 text-sm">Signature</span>
                            <span className="text-xs text-slate-500">Elegant with signature area</span>
                        </button>

                        {/* Total Highlight Template */}
                        <button
                            onClick={() => setTemplate("total-highlight")}
                            className={cn(
                                "relative flex flex-col rounded-xl border-2 p-3 transition-all overflow-hidden",
                                template === "total-highlight"
                                    ? "border-teal-500 bg-teal-50"
                                    : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                            )}
                        >
                            {template === "total-highlight" && (
                                <div className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-teal-500 text-white z-10">
                                    <Check className="h-4 w-4" />
                                </div>
                            )}
                            <div className="h-32 w-full bg-white rounded border border-slate-200 p-2">
                                <div className="space-y-0.5 mb-2">
                                    <div className="h-1 w-full rounded bg-slate-100" />
                                    <div className="h-1 w-full rounded bg-slate-100" />
                                </div>
                                <div className="border-2 border-slate-800 rounded p-1.5 mt-2">
                                    <div className="flex justify-between items-center">
                                        <div className="h-1.5 w-8 rounded bg-slate-400" />
                                        <div className="h-2 w-10 rounded bg-slate-800" />
                                    </div>
                                </div>
                            </div>
                            <span className="mt-2 font-medium text-slate-900 text-sm">Total Highlight</span>
                            <span className="text-xs text-slate-500">Prominently boxed total</span>
                        </button>

                        {/* Blue Banner Template */}
                        <button
                            onClick={() => setTemplate("blue-banner")}
                            className={cn(
                                "relative flex flex-col rounded-xl border-2 p-3 transition-all overflow-hidden",
                                template === "blue-banner"
                                    ? "border-teal-500 bg-teal-50"
                                    : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                            )}
                        >
                            {template === "blue-banner" && (
                                <div className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-teal-500 text-white z-10">
                                    <Check className="h-4 w-4" />
                                </div>
                            )}
                            <div className="h-32 w-full bg-white rounded border border-slate-200 overflow-hidden">
                                <div className="h-5 bg-blue-600 flex items-center justify-center">
                                    <div className="text-[6px] text-white">★ INVOICE ★</div>
                                </div>
                                <div className="p-2 space-y-0.5">
                                    <div className="h-1 w-full rounded bg-slate-100" />
                                    <div className="h-1 w-full rounded bg-slate-100" />
                                </div>
                                <div className="text-[5px] text-center text-slate-400 mt-1">Thank you!</div>
                            </div>
                            <span className="mt-2 font-medium text-slate-900 text-sm">Blue Banner</span>
                            <span className="text-xs text-slate-500">Stars decoration with thank you</span>
                        </button>

                        {/* Watercolor Template */}
                        <button
                            onClick={() => setTemplate("watercolor")}
                            className={cn(
                                "relative flex flex-col rounded-xl border-2 p-3 transition-all overflow-hidden",
                                template === "watercolor"
                                    ? "border-teal-500 bg-teal-50"
                                    : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                            )}
                        >
                            {template === "watercolor" && (
                                <div className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-teal-500 text-white z-10">
                                    <Check className="h-4 w-4" />
                                </div>
                            )}
                            <div className="h-32 w-full bg-white rounded border border-slate-200 p-2 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-16 h-8 bg-gradient-to-bl from-teal-200/50 to-transparent rounded-bl-full" />
                                <div className="relative">
                                    <div className="text-[7px] font-medium text-slate-600 mb-2">Invoice</div>
                                    <div className="space-y-0.5">
                                        <div className="h-1 w-full rounded bg-slate-100" />
                                        <div className="h-1 w-full rounded bg-slate-100" />
                                    </div>
                                </div>
                            </div>
                            <span className="mt-2 font-medium text-slate-900 text-sm">Watercolor</span>
                            <span className="text-xs text-slate-500">Artistic brush stroke design</span>
                        </button>

                        {/* Sidebar Template */}
                        <button
                            onClick={() => setTemplate("sidebar")}
                            className={cn(
                                "relative flex flex-col rounded-xl border-2 p-3 transition-all overflow-hidden",
                                template === "sidebar"
                                    ? "border-teal-500 bg-teal-50"
                                    : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                            )}
                        >
                            {template === "sidebar" && (
                                <div className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-teal-500 text-white z-10">
                                    <Check className="h-4 w-4" />
                                </div>
                            )}
                            <div className="h-32 w-full bg-white rounded border border-slate-200 flex overflow-hidden">
                                <div className="w-4 bg-slate-800 flex items-center justify-center">
                                    <div className="text-[4px] text-white rotate-[-90deg] whitespace-nowrap">INV-001</div>
                                </div>
                                <div className="flex-1 p-2">
                                    <div className="space-y-0.5">
                                        <div className="h-1 w-full rounded bg-slate-100" />
                                        <div className="h-1 w-full rounded bg-slate-100" />
                                        <div className="h-1 w-3/4 rounded bg-slate-100" />
                                    </div>
                                </div>
                            </div>
                            <span className="mt-2 font-medium text-slate-900 text-sm">Sidebar</span>
                            <span className="text-xs text-slate-500">Rotated number on side</span>
                        </button>

                        {/* Blue Accent Template */}
                        <button
                            onClick={() => setTemplate("blue-accent")}
                            className={cn(
                                "relative flex flex-col rounded-xl border-2 p-3 transition-all overflow-hidden",
                                template === "blue-accent"
                                    ? "border-teal-500 bg-teal-50"
                                    : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                            )}
                        >
                            {template === "blue-accent" && (
                                <div className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-teal-500 text-white z-10">
                                    <Check className="h-4 w-4" />
                                </div>
                            )}
                            <div className="h-32 w-full bg-white rounded border border-slate-200 p-2">
                                <div className="flex justify-between items-center mb-2">
                                    <div className="h-3 w-3 rounded bg-slate-200" />
                                    <div className="text-[7px] font-medium text-blue-600">INVOICE</div>
                                </div>
                                <div className="h-0.5 w-full bg-blue-600 mb-2" />
                                <div className="space-y-0.5">
                                    <div className="h-1 w-full rounded bg-slate-100" />
                                    <div className="h-1 w-full rounded bg-slate-100" />
                                </div>
                                <div className="h-0.5 w-full bg-blue-600 mt-2" />
                            </div>
                            <span className="mt-2 font-medium text-slate-900 text-sm">Blue Accent</span>
                            <span className="text-xs text-slate-500">Clean with blue accent lines</span>
                        </button>

                        {/* Two Column Template */}
                        <button
                            onClick={() => setTemplate("two-column")}
                            className={cn(
                                "relative flex flex-col rounded-xl border-2 p-3 transition-all overflow-hidden",
                                template === "two-column"
                                    ? "border-teal-500 bg-teal-50"
                                    : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                            )}
                        >
                            {template === "two-column" && (
                                <div className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-teal-500 text-white z-10">
                                    <Check className="h-4 w-4" />
                                </div>
                            )}
                            <div className="h-32 w-full bg-white rounded border border-slate-200 p-2">
                                <div className="flex gap-2 mb-2">
                                    <div className="flex-1 p-1 bg-slate-50 rounded">
                                        <div className="h-1 w-6 rounded bg-slate-300 mb-0.5" />
                                        <div className="h-1 w-full rounded bg-slate-200" />
                                    </div>
                                    <div className="flex-1 p-1 bg-slate-50 rounded">
                                        <div className="h-1 w-6 rounded bg-slate-300 mb-0.5" />
                                        <div className="h-1 w-full rounded bg-slate-200" />
                                    </div>
                                </div>
                                <div className="space-y-0.5">
                                    <div className="h-1 w-full rounded bg-slate-100" />
                                    <div className="h-1 w-full rounded bg-slate-100" />
                                </div>
                            </div>
                            <span className="mt-2 font-medium text-slate-900 text-sm">Two Column</span>
                            <span className="text-xs text-slate-500">Split header layout</span>
                        </button>

                        {/* Lowercase Minimal Template */}
                        <button
                            onClick={() => setTemplate("lowercase-minimal")}
                            className={cn(
                                "relative flex flex-col rounded-xl border-2 p-3 transition-all overflow-hidden",
                                template === "lowercase-minimal"
                                    ? "border-teal-500 bg-teal-50"
                                    : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                            )}
                        >
                            {template === "lowercase-minimal" && (
                                <div className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-teal-500 text-white z-10">
                                    <Check className="h-4 w-4" />
                                </div>
                            )}
                            <div className="h-32 w-full bg-white rounded border border-slate-200 p-3">
                                <div className="text-[8px] text-slate-600 mb-3">invoice</div>
                                <div className="space-y-1">
                                    <div className="h-1 w-full rounded bg-slate-100" />
                                    <div className="h-1 w-full rounded bg-slate-100" />
                                </div>
                            </div>
                            <span className="mt-2 font-medium text-slate-900 text-sm">Lowercase Minimal</span>
                            <span className="text-xs text-slate-500">Simple lowercase text</span>
                        </button>

                        {/* Beach Wave Template */}
                        <button
                            onClick={() => setTemplate("beach-wave")}
                            className={cn(
                                "relative flex flex-col rounded-xl border-2 p-3 transition-all overflow-hidden",
                                template === "beach-wave"
                                    ? "border-teal-500 bg-teal-50"
                                    : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                            )}
                        >
                            {template === "beach-wave" && (
                                <div className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-teal-500 text-white z-10">
                                    <Check className="h-4 w-4" />
                                </div>
                            )}
                            <div className="h-32 w-full bg-white rounded border border-slate-200 p-2 relative overflow-hidden">
                                <div className="space-y-0.5 mb-2">
                                    <div className="h-1 w-8 rounded bg-slate-300" />
                                    <div className="h-1 w-full rounded bg-slate-100" />
                                    <div className="h-1 w-full rounded bg-slate-100" />
                                </div>
                                <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-teal-200/60 to-transparent" style={{ borderRadius: '80% 80% 0 0' }} />
                            </div>
                            <span className="mt-2 font-medium text-slate-900 text-sm">Beach Wave</span>
                            <span className="text-xs text-slate-500">Watercolor waves at bottom</span>
                        </button>

                        {/* Blue Header Bar Template */}
                        <button
                            onClick={() => setTemplate("blue-header-bar")}
                            className={cn(
                                "relative flex flex-col rounded-xl border-2 p-3 transition-all overflow-hidden",
                                template === "blue-header-bar"
                                    ? "border-teal-500 bg-teal-50"
                                    : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                            )}
                        >
                            {template === "blue-header-bar" && (
                                <div className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-teal-500 text-white z-10">
                                    <Check className="h-4 w-4" />
                                </div>
                            )}
                            <div className="h-32 w-full bg-white rounded border border-slate-200 overflow-hidden">
                                <div className="h-8 bg-blue-700 flex items-center justify-between px-2">
                                    <div className="h-3 w-3 rounded bg-white/30" />
                                    <div className="text-[6px] text-white font-medium">INVOICE</div>
                                </div>
                                <div className="p-2 space-y-0.5">
                                    <div className="h-1 w-full rounded bg-slate-100" />
                                    <div className="h-1 w-full rounded bg-slate-100" />
                                </div>
                            </div>
                            <span className="mt-2 font-medium text-slate-900 text-sm">Blue Header Bar</span>
                            <span className="text-xs text-slate-500">Solid blue banner header</span>
                        </button>

                        {/* Circular Modern Template */}
                        <button
                            onClick={() => setTemplate("circular-modern")}
                            className={cn(
                                "relative flex flex-col rounded-xl border-2 p-3 transition-all overflow-hidden",
                                template === "circular-modern"
                                    ? "border-teal-500 bg-teal-50"
                                    : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                            )}
                        >
                            {template === "circular-modern" && (
                                <div className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-teal-500 text-white z-10">
                                    <Check className="h-4 w-4" />
                                </div>
                            )}
                            <div className="h-32 w-full bg-white rounded border border-slate-200 p-2 relative">
                                <div className="absolute top-2 right-2 w-8 h-8 rounded-full bg-red-500 flex items-center justify-center">
                                    <div className="text-[4px] text-white font-bold">INV</div>
                                </div>
                                <div className="pr-10">
                                    <div className="h-1.5 w-10 rounded bg-slate-300 mb-1" />
                                    <div className="h-1 w-8 rounded bg-slate-200 mb-2" />
                                </div>
                                <div className="space-y-0.5">
                                    <div className="h-1 w-full rounded bg-slate-100" />
                                    <div className="h-1 w-full rounded bg-slate-100" />
                                </div>
                            </div>
                            <span className="mt-2 font-medium text-slate-900 text-sm">Circular Modern</span>
                            <span className="text-xs text-slate-500">Red circle accent design</span>
                        </button>
                    </div>
                </CardContent>
            </Card>

            {/* Accent Color Selection */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Accent Color</CardTitle>
                    <CardDescription>
                        Choose a color that matches your brand
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Preset Colors */}
                    <div className="flex flex-wrap gap-3">
                        {(Object.entries(ACCENT_COLORS) as [AccentColor, string][]).map(
                            ([name, hex]) => (
                                <button
                                    key={name}
                                    onClick={() => setAccentColor(name)}
                                    className="relative h-10 w-10 rounded-full transition-transform hover:scale-110"
                                    style={{
                                        backgroundColor: hex,
                                        boxShadow: accentColor === name ? `0 0 0 2px white, 0 0 0 4px ${hex}` : undefined,
                                    }}
                                    title={name.charAt(0).toUpperCase() + name.slice(1)}
                                >
                                    {accentColor === name && (
                                        <Check className="absolute inset-0 m-auto h-5 w-5 text-white" />
                                    )}
                                </button>
                            )
                        )}
                    </div>

                    {/* Custom Color */}
                    <div className="flex items-center gap-4">
                        <Label htmlFor="customColor" className="whitespace-nowrap">
                            Custom Color
                        </Label>
                        <div className="flex items-center gap-2">
                            <Input
                                id="customColor"
                                type="color"
                                value={isCustomColor ? accentColor : "#14b8a6"}
                                onChange={(e) => setAccentColor(e.target.value)}
                                className="h-10 w-14 cursor-pointer p-1"
                            />
                            <Input
                                type="text"
                                placeholder="#14b8a6"
                                value={isCustomColor ? accentColor : ""}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    if (value.match(/^#[0-9A-Fa-f]{0,6}$/)) {
                                        setAccentColor(value);
                                    }
                                }}
                                className="w-28 font-mono text-sm"
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Custom Template Upload */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Custom Watermark (Optional)</CardTitle>
                    <CardDescription>
                        Upload your company logo or brand mark as a subtle watermark
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-start gap-6">
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className={cn(
                                "relative flex h-40 w-full max-w-xs cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors",
                                customTemplate
                                    ? "border-indigo-300 bg-indigo-50"
                                    : "border-slate-300 bg-slate-50 hover:border-indigo-400 hover:bg-indigo-50"
                            )}
                        >
                            {customTemplate ? (
                                <>
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={customTemplate}
                                        alt="Custom template"
                                        className="h-full w-full rounded-lg object-contain p-2"
                                    />
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleRemoveCustomTemplate();
                                        }}
                                        className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-600"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Upload className="h-8 w-8 text-slate-400" />
                                    <span className="mt-2 text-sm text-slate-500">
                                        Click to upload watermark
                                    </span>
                                    <span className="mt-1 text-xs text-slate-400">
                                        PNG, JPG · Max 5MB
                                    </span>
                                </>
                            )}
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleTemplateUpload}
                                className="hidden"
                            />
                        </div>

                        <div className="text-sm text-slate-500">
                            <p className="font-medium text-slate-700">Best practices:</p>
                            <ul className="mt-2 list-inside list-disc space-y-1">
                                <li>Use your logo or monogram</li>
                                <li>High contrast images work best</li>
                                <li>Appears as subtle centered watermark</li>
                                <li>PNG with transparency recommended</li>
                            </ul>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <WizardNavigation />
        </div>
    );
}
