"use client";

import { useDocument } from "@/context/DocumentContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { WizardNavigation } from "../WizardNavigation";
import { Package, Plus, Trash2, Calendar, Hash } from "lucide-react";
import { CURRENCIES, DEFAULT_TERMS } from "@/types/document";
import { formatCurrency } from "@/lib/utils";

export function LineItemsStep() {
    const {
        state,
        setDocumentDetails,
        addItem,
        updateItem,
        removeItem,
        calculateTotals,
    } = useDocument();
    const { items, details, type } = state.document;
    const totals = calculateTotals();

    const handleItemChange = (
        id: string,
        field: string,
        value: string | number
    ) => {
        updateItem(id, { [field]: value });
    };

    const handleAddItem = () => {
        addItem();
    };

    const handleRemoveItem = (id: string) => {
        if (items.length > 1) {
            removeItem(id);
        }
    };

    return (
        <div className="space-y-6">
            {/* Document Details Card */}
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">
                            <Hash className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                            <CardTitle>Document Details</CardTitle>
                            <CardDescription>
                                Set the {type} number, dates, and currency
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {/* Document Number */}
                        <div className="space-y-2">
                            <Label htmlFor="documentNumber" required>
                                {type === "invoice" ? "Invoice" : "Quotation"} Number
                            </Label>
                            <Input
                                id="documentNumber"
                                value={details.documentNumber}
                                onChange={(e) =>
                                    setDocumentDetails({ documentNumber: e.target.value })
                                }
                            />
                        </div>

                        {/* Issue Date */}
                        <div className="space-y-2">
                            <Label htmlFor="issueDate" required>
                                Issue Date
                            </Label>
                            <Input
                                id="issueDate"
                                type="date"
                                value={details.issueDate}
                                onChange={(e) =>
                                    setDocumentDetails({ issueDate: e.target.value })
                                }
                            />
                        </div>

                        {/* Due Date / Valid Until */}
                        <div className="space-y-2">
                            <Label htmlFor="dueDate">
                                {type === "invoice" ? "Due Date" : "Valid Until"}
                            </Label>
                            <Input
                                id="dueDate"
                                type="date"
                                value={
                                    type === "invoice"
                                        ? details.dueDate || ""
                                        : details.validUntil || ""
                                }
                                onChange={(e) =>
                                    setDocumentDetails(
                                        type === "invoice"
                                            ? { dueDate: e.target.value }
                                            : { validUntil: e.target.value }
                                    )
                                }
                            />
                        </div>

                        {/* Currency */}
                        <div className="space-y-2">
                            <Label htmlFor="currency" required>
                                Currency
                            </Label>
                            <Select
                                value={details.currency}
                                onValueChange={(value) =>
                                    setDocumentDetails({ currency: value })
                                }
                            >
                                <SelectTrigger id="currency">
                                    <SelectValue>
                                        {CURRENCIES.find(c => c.code === details.currency)?.symbol} {details.currency}
                                    </SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                    {CURRENCIES.map((currency) => (
                                        <SelectItem key={currency.code} value={currency.code}>
                                            {currency.symbol} {currency.code} - {currency.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* PO Number */}
                    <div className="max-w-xs space-y-2">
                        <Label htmlFor="poNumber">PO / Reference Number</Label>
                        <Input
                            id="poNumber"
                            placeholder="PO-12345"
                            value={details.poNumber || ""}
                            onChange={(e) => setDocumentDetails({ poNumber: e.target.value })}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Line Items Card */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100">
                                <Package className="h-5 w-5 text-orange-600" />
                            </div>
                            <div>
                                <CardTitle>Line Items</CardTitle>
                                <CardDescription>
                                    Add the products or services you&apos;re{" "}
                                    {type === "invoice" ? "billing" : "quoting"} for
                                </CardDescription>
                            </div>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleAddItem}
                            className="gap-2"
                        >
                            <Plus className="h-4 w-4" />
                            Add Item
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {items.map((item, index) => (
                            <div
                                key={item.id}
                                className="rounded-lg border border-slate-200 bg-slate-50 p-4"
                            >
                                <div className="mb-3 flex items-center justify-between">
                                    <span className="text-sm font-medium text-slate-600">
                                        Item {index + 1}
                                    </span>
                                    {items.length > 1 && (
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleRemoveItem(item.id)}
                                            className="h-8 w-8 text-red-500 hover:bg-red-50 hover:text-red-600"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>

                                <div className="grid gap-4">
                                    {/* Description */}
                                    <div className="space-y-2">
                                        <Label htmlFor={`desc-${item.id}`} required>
                                            Description
                                        </Label>
                                        <Input
                                            id={`desc-${item.id}`}
                                            placeholder="Web Development Services"
                                            value={item.description}
                                            onChange={(e) =>
                                                handleItemChange(item.id, "description", e.target.value)
                                            }
                                        />
                                    </div>

                                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                                        {/* Quantity */}
                                        <div className="space-y-2">
                                            <Label htmlFor={`qty-${item.id}`}>Qty</Label>
                                            <Input
                                                id={`qty-${item.id}`}
                                                type="number"
                                                min="1"
                                                value={item.quantity}
                                                onChange={(e) =>
                                                    handleItemChange(
                                                        item.id,
                                                        "quantity",
                                                        parseFloat(e.target.value) || 1
                                                    )
                                                }
                                            />
                                        </div>

                                        {/* Unit Price */}
                                        <div className="space-y-2">
                                            <Label htmlFor={`price-${item.id}`}>Unit Price</Label>
                                            <Input
                                                id={`price-${item.id}`}
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                value={item.unitPrice}
                                                onChange={(e) =>
                                                    handleItemChange(
                                                        item.id,
                                                        "unitPrice",
                                                        parseFloat(e.target.value) || 0
                                                    )
                                                }
                                            />
                                        </div>

                                        {/* Tax Rate */}
                                        <div className="space-y-2">
                                            <Label htmlFor={`tax-${item.id}`}>Tax %</Label>
                                            <Input
                                                id={`tax-${item.id}`}
                                                type="number"
                                                min="0"
                                                max="100"
                                                step="0.1"
                                                value={item.taxRate}
                                                onChange={(e) =>
                                                    handleItemChange(
                                                        item.id,
                                                        "taxRate",
                                                        parseFloat(e.target.value) || 0
                                                    )
                                                }
                                            />
                                        </div>

                                        {/* Discount */}
                                        <div className="space-y-2">
                                            <Label htmlFor={`discount-${item.id}`}>Discount %</Label>
                                            <Input
                                                id={`discount-${item.id}`}
                                                type="number"
                                                min="0"
                                                max="100"
                                                step="0.1"
                                                value={item.discountPercent}
                                                onChange={(e) =>
                                                    handleItemChange(
                                                        item.id,
                                                        "discountPercent",
                                                        parseFloat(e.target.value) || 0
                                                    )
                                                }
                                            />
                                        </div>

                                        {/* Line Total */}
                                        <div className="space-y-2">
                                            <Label>Amount</Label>
                                            <div className="flex h-10 items-center rounded-lg bg-white px-3 text-sm font-medium">
                                                {formatCurrency(
                                                    item.quantity * item.unitPrice,
                                                    details.currency
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Totals */}
                    <div className="mt-6 flex justify-end">
                        <div className="w-full max-w-xs space-y-2 rounded-lg bg-slate-900 p-4 text-white">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-400">Subtotal</span>
                                <span>{formatCurrency(totals.subtotal, details.currency)}</span>
                            </div>
                            {totals.totalDiscount > 0 && (
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-400">Discount</span>
                                    <span className="text-red-400">
                                        -{formatCurrency(totals.totalDiscount, details.currency)}
                                    </span>
                                </div>
                            )}
                            {totals.totalTax > 0 && (
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-400">Tax</span>
                                    <span>{formatCurrency(totals.totalTax, details.currency)}</span>
                                </div>
                            )}
                            <div className="border-t border-slate-700 pt-2">
                                <div className="flex justify-between text-lg font-semibold">
                                    <span>Total</span>
                                    <span className="text-teal-400">
                                        {formatCurrency(totals.grandTotal, details.currency)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Notes & Terms Card */}
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100">
                            <Calendar className="h-5 w-5 text-slate-600" />
                        </div>
                        <div>
                            <CardTitle>Notes & Terms</CardTitle>
                            <CardDescription>
                                Add any additional information or payment terms
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="notes">Notes / Closing Message</Label>
                        <Textarea
                            id="notes"
                            placeholder={"Thank you for your business!\n\nYours sincerely,\nYour Name"}
                            value={details.notes || ""}
                            onChange={(e) => setDocumentDetails({ notes: e.target.value })}
                            className="min-h-20"
                        />
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="terms">Terms & Conditions</Label>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                    setDocumentDetails({ terms: DEFAULT_TERMS[type] })
                                }
                                className="text-xs text-teal-600 hover:text-teal-700"
                            >
                                Use Default
                            </Button>
                        </div>
                        <Textarea
                            id="terms"
                            placeholder="Enter your payment terms..."
                            value={details.terms || ""}
                            onChange={(e) => setDocumentDetails({ terms: e.target.value })}
                            className="min-h-25"
                        />
                    </div>
                </CardContent>
            </Card>

            <WizardNavigation />
        </div>
    );
}
