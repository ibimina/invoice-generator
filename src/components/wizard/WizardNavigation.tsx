"use client";

import { Button } from "@/components/ui/button";
import { useDocument, WIZARD_STEPS } from "@/context/DocumentContext";
import { ArrowLeft, ArrowRight, Eye } from "lucide-react";

interface WizardNavigationProps {
    onValidate?: () => boolean;
}

export function WizardNavigation({ onValidate }: WizardNavigationProps) {
    const { state, nextStep, prevStep, skipToPreview } = useDocument();
    const { currentStep } = state;

    const isFirstStep = currentStep === 1;
    const isLastStep = currentStep === WIZARD_STEPS.length;

    const handleNext = () => {
        if (onValidate && !onValidate()) {
            return;
        }
        nextStep();
    };

    const handleSkipToPreview = () => {
        skipToPreview();
    };

    return (
        <div className="flex items-center justify-between pt-6 border-t border-slate-200">
            <div>
                {!isFirstStep && (
                    <Button variant="outline" onClick={prevStep} className="gap-2">
                        <ArrowLeft className="h-4 w-4" />
                        Back
                    </Button>
                )}
            </div>

            <div className="flex items-center gap-3">
                {!isLastStep && currentStep < 4 && (
                    <Button variant="ghost" onClick={handleSkipToPreview} className="gap-2 text-slate-500">
                        <Eye className="h-4 w-4" />
                        Skip to Preview
                    </Button>
                )}

                {!isLastStep && (
                    <Button onClick={handleNext} className="gap-2 bg-teal-600 hover:bg-teal-700">
                        Next
                        <ArrowRight className="h-4 w-4" />
                    </Button>
                )}
            </div>
        </div>
    );
}
