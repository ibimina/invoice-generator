"use client";

import { useDocument } from "@/context/DocumentContext";
import { BusinessInfoStep } from "./steps/BusinessInfoStep";
import { ClientInfoStep } from "./steps/ClientInfoStep";
import { LineItemsStep } from "./steps/LineItemsStep";
import { StyleStep } from "./steps/StyleStep";
import { PreviewStep } from "./steps/PreviewStep";

export function WizardContent() {
    const { state } = useDocument();
    const { currentStep } = state;

    switch (currentStep) {
        case 1:
            return <BusinessInfoStep />;
        case 2:
            return <ClientInfoStep />;
        case 3:
            return <LineItemsStep />;
        case 4:
            return <StyleStep />;
        case 5:
            return <PreviewStep />;
        default:
            return <BusinessInfoStep />;
    }
}
