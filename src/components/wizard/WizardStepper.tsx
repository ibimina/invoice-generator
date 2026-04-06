"use client";

import { cn } from "@/lib/utils";
import { useDocument, WIZARD_STEPS, WizardStep } from "@/context/DocumentContext";
import { Check } from "lucide-react";

export function WizardStepper() {
    const { state, goToStep } = useDocument();
    const { currentStep } = state;

    return (
        <nav aria-label="Progress" className="w-full">
            <ol className="flex items-start">
                {WIZARD_STEPS.map((step, index) => {
                    const isCompleted = currentStep > step.id;
                    const isCurrent = currentStep === step.id;
                    const isClickable = step.id <= currentStep;
                    const isLast = index === WIZARD_STEPS.length - 1;

                    return (
                        <li key={step.id} className={cn("flex items-start", !isLast && "flex-1")}>
                            <button
                                onClick={() => isClickable && goToStep(step.id as WizardStep)}
                                disabled={!isClickable}
                                className={cn(
                                    "group flex flex-col items-center",
                                    isClickable ? "cursor-pointer" : "cursor-not-allowed"
                                )}
                            >
                                {/* Step circle */}
                                <span
                                    className={cn(
                                        "flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-200",
                                        isCompleted
                                            ? "border-teal-600 bg-teal-600 text-white"
                                            : isCurrent
                                                ? "border-teal-600 bg-white text-teal-600"
                                                : "border-slate-300 bg-white text-slate-400"
                                    )}
                                >
                                    {isCompleted ? (
                                        <Check className="h-5 w-5" />
                                    ) : (
                                        <span className="text-sm font-semibold">{step.id}</span>
                                    )}
                                </span>

                                {/* Step label */}
                                <span
                                    className={cn(
                                        "mt-2 text-xs font-medium transition-colors whitespace-nowrap",
                                        isCurrent ? "text-teal-600" : isCompleted ? "text-slate-700" : "text-slate-400"
                                    )}
                                >
                                    {step.name}
                                </span>
                            </button>

                            {/* Connector line - positioned to align with circle center (20px from top) */}
                            {!isLast && (
                                <div
                                    className={cn(
                                        "h-0.5 flex-1 mx-2 mt-5",
                                        isCompleted ? "bg-teal-600" : "bg-slate-200"
                                    )}
                                    aria-hidden="true"
                                />
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
}
