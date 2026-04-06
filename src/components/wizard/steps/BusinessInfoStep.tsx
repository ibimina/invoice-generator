"use client";

import { useCallback, useRef } from "react";
import { useDocument } from "@/context/DocumentContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { WizardNavigation } from "../WizardNavigation";
import { Building2, X, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function BusinessInfoStep() {
    const { state, setBusinessInfo } = useDocument();
    const { business } = state.document;
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleLogoUpload = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            if (!file) return;

            // Validate file type
            if (!file.type.startsWith("image/")) {
                alert("Please upload an image file");
                return;
            }

            // Validate file size (2MB max)
            if (file.size > 2 * 1024 * 1024) {
                alert("Image must be less than 2MB");
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                setBusinessInfo({ logo: reader.result as string });
            };
            reader.readAsDataURL(file);
        },
        [setBusinessInfo]
    );

    const handleRemoveLogo = useCallback(() => {
        setBusinessInfo({ logo: undefined });
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    }, [setBusinessInfo]);

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-100">
                            <Building2 className="h-5 w-5 text-teal-600" />
                        </div>
                        <div>
                            <CardTitle>Your Business Details</CardTitle>
                            <CardDescription>
                                Enter your business information that will appear on the document
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Logo Upload */}
                    <div className="space-y-2">
                        <Label>Business Logo</Label>
                        <div className="flex items-start gap-4">
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className={cn(
                                    "relative flex h-32 w-32 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors",
                                    business.logo
                                        ? "border-teal-300 bg-teal-50"
                                        : "border-slate-300 bg-slate-50 hover:border-teal-400 hover:bg-teal-50"
                                )}
                            >
                                {business.logo ? (
                                    <>
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={business.logo}
                                            alt="Business logo"
                                            className="h-full w-full rounded-lg object-contain p-2"
                                        />
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleRemoveLogo();
                                            }}
                                            className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-600"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <ImageIcon className="h-8 w-8 text-slate-400" />
                                        <span className="mt-2 text-xs text-slate-500">Click to upload</span>
                                    </>
                                )}
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleLogoUpload}
                                    className="hidden"
                                />
                            </div>
                            <div className="text-sm text-slate-500">
                                <p>PNG, JPG, SVG or WebP</p>
                                <p>Max 2MB</p>
                            </div>
                        </div>
                    </div>

                    {/* Business Name */}
                    <div className="space-y-2">
                        <Label htmlFor="businessName" required>
                            Business / Your Name
                        </Label>
                        <Input
                            id="businessName"
                            placeholder="Acme Corporation"
                            value={business.name}
                            onChange={(e) => setBusinessInfo({ name: e.target.value })}
                        />
                    </div>

                    {/* Email & Phone */}
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="businessEmail">Email</Label>
                            <Input
                                id="businessEmail"
                                type="email"
                                placeholder="hello@acme.com"
                                value={business.email || ""}
                                onChange={(e) => setBusinessInfo({ email: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="businessPhone">Phone</Label>
                            <Input
                                id="businessPhone"
                                placeholder="+1 (555) 123-4567"
                                value={business.phone || ""}
                                onChange={(e) => setBusinessInfo({ phone: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Address */}
                    <div className="space-y-2">
                        <Label htmlFor="businessAddress">Address</Label>
                        <Textarea
                            id="businessAddress"
                            placeholder="123 Business Street&#10;City, State 12345&#10;Country"
                            value={business.address || ""}
                            onChange={(e) => setBusinessInfo({ address: e.target.value })}
                            className="min-h-20"
                        />
                    </div>

                    {/* Website & Tax ID */}
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="businessWebsite">Website</Label>
                            <Input
                                id="businessWebsite"
                                type="url"
                                placeholder="https://www.acme.com"
                                value={business.website || ""}
                                onChange={(e) => setBusinessInfo({ website: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="businessTaxId">Tax / Registration ID</Label>
                            <Input
                                id="businessTaxId"
                                placeholder="12-3456789"
                                value={business.taxId || ""}
                                onChange={(e) => setBusinessInfo({ taxId: e.target.value })}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <WizardNavigation />
        </div>
    );
}
