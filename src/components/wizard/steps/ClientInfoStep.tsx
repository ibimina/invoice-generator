"use client";

import { useDocument } from "@/context/DocumentContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { WizardNavigation } from "../WizardNavigation";
import { User } from "lucide-react";

export function ClientInfoStep() {
    const { state, setClientInfo } = useDocument();
    const { client } = state.document;
    const documentType = state.document.type;

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                            <User className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                            <CardTitle>Client Information</CardTitle>
                            <CardDescription>
                                Enter the details of the client you&apos;re {documentType === "invoice" ? "billing" : "quoting"}
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Client Name */}
                    <div className="space-y-2">
                        <Label htmlFor="clientName" required>
                            Client Name
                        </Label>
                        <Input
                            id="clientName"
                            placeholder="John Doe"
                            value={client.name}
                            onChange={(e) => setClientInfo({ name: e.target.value })}
                        />
                    </div>

                    {/* Company */}
                    <div className="space-y-2">
                        <Label htmlFor="clientCompany">Company</Label>
                        <Input
                            id="clientCompany"
                            placeholder="Client Company Inc."
                            value={client.company || ""}
                            onChange={(e) => setClientInfo({ company: e.target.value })}
                        />
                    </div>

                    {/* Email & Phone */}
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="clientEmail">Email</Label>
                            <Input
                                id="clientEmail"
                                type="email"
                                placeholder="client@example.com"
                                value={client.email || ""}
                                onChange={(e) => setClientInfo({ email: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="clientPhone">Phone</Label>
                            <Input
                                id="clientPhone"
                                placeholder="+1 (555) 987-6543"
                                value={client.phone || ""}
                                onChange={(e) => setClientInfo({ phone: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Address */}
                    <div className="space-y-2">
                        <Label htmlFor="clientAddress">Address</Label>
                        <Textarea
                            id="clientAddress"
                            placeholder="456 Client Avenue&#10;City, State 67890&#10;Country"
                            value={client.address || ""}
                            onChange={(e) => setClientInfo({ address: e.target.value })}
                            className="min-h-20"
                        />
                    </div>
                </CardContent>
            </Card>

            <WizardNavigation />
        </div>
    );
}
