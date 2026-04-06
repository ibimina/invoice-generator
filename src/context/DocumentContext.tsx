"use client";

import React, { createContext, useContext, useReducer, useCallback } from "react";
import {
    DocumentData,
    DocumentType,
    BusinessInfo,
    ClientInfo,
    LineItem,
    DocumentDetails,
    Template,
    AccentColor,
    DEFAULT_TERMS,
} from "@/types/document";
import { generateDocumentNumber, getDateString, addDays } from "@/lib/utils";

// Wizard steps
export const WIZARD_STEPS = [
    { id: 1, name: "Business", description: "Your business details" },
    { id: 2, name: "Client", description: "Client information" },
    { id: 3, name: "Items", description: "Products & services" },
    { id: 4, name: "Style", description: "Template & colors" },
    { id: 5, name: "Preview", description: "Review & export" },
] as const;

export type WizardStep = (typeof WIZARD_STEPS)[number]["id"];

// State
interface DocumentState {
    document: DocumentData;
    currentStep: WizardStep;
    previousStepBeforeSkip: WizardStep | null;
    isAutoSaveEnabled: boolean;
}

// Actions
type DocumentAction =
    | { type: "SET_DOCUMENT_TYPE"; payload: DocumentType }
    | { type: "SET_BUSINESS_INFO"; payload: Partial<BusinessInfo> }
    | { type: "SET_CLIENT_INFO"; payload: Partial<ClientInfo> }
    | { type: "SET_DOCUMENT_DETAILS"; payload: Partial<DocumentDetails> }
    | { type: "SET_ITEMS"; payload: LineItem[] }
    | { type: "ADD_ITEM"; payload: LineItem }
    | { type: "UPDATE_ITEM"; payload: { id: string; item: Partial<LineItem> } }
    | { type: "REMOVE_ITEM"; payload: string }
    | { type: "SET_TEMPLATE"; payload: Template }
    | { type: "SET_ACCENT_COLOR"; payload: AccentColor | string }
    | { type: "SET_CUSTOM_TEMPLATE"; payload: string | undefined }
    | { type: "SET_STEP"; payload: WizardStep }
    | { type: "NEXT_STEP" }
    | { type: "PREV_STEP" }
    | { type: "SKIP_TO_PREVIEW" }
    | { type: "RETURN_FROM_PREVIEW" }
    | { type: "TOGGLE_AUTO_SAVE" }
    | { type: "RESET_DOCUMENT" }
    | { type: "LOAD_DOCUMENT"; payload: DocumentData };

// Initial state factory
function createInitialDocument(type: DocumentType = "invoice"): DocumentData {
    const today = getDateString();
    const dueDate = getDateString(addDays(new Date(), 30));

    return {
        type,
        business: {
            name: "",
            logo: undefined,
            address: "",
            email: "",
            phone: "",
            website: "",
            taxId: "",
        },
        client: {
            name: "",
            company: "",
            email: "",
            phone: "",
            address: "",
        },
        details: {
            documentNumber: generateDocumentNumber(type),
            issueDate: today,
            dueDate: type === "invoice" ? dueDate : undefined,
            validUntil: type === "quotation" ? dueDate : undefined,
            poNumber: "",
            currency: "USD",
            notes: "",
            terms: DEFAULT_TERMS[type],
        },
        items: [
            {
                id: crypto.randomUUID(),
                description: "",
                quantity: 1,
                unitPrice: 0,
                taxRate: 0,
                discountPercent: 0,
            },
        ],
        template: "classic",
        accentColor: "teal",
        customTemplate: undefined,
    };
}

const initialState: DocumentState = {
    document: createInitialDocument("invoice"),
    currentStep: 1,
    previousStepBeforeSkip: null,
    isAutoSaveEnabled: false,
};

// Reducer
function documentReducer(state: DocumentState, action: DocumentAction): DocumentState {
    switch (action.type) {
        case "SET_DOCUMENT_TYPE": {
            const newDoc = createInitialDocument(action.payload);
            // Preserve existing data where possible
            return {
                ...state,
                document: {
                    ...newDoc,
                    business: state.document.business,
                    client: state.document.client,
                    items: state.document.items,
                    template: state.document.template,
                    accentColor: state.document.accentColor,
                    details: {
                        ...newDoc.details,
                        notes: state.document.details.notes,
                    },
                },
            };
        }

        case "SET_BUSINESS_INFO":
            return {
                ...state,
                document: {
                    ...state.document,
                    business: { ...state.document.business, ...action.payload },
                },
            };

        case "SET_CLIENT_INFO":
            return {
                ...state,
                document: {
                    ...state.document,
                    client: { ...state.document.client, ...action.payload },
                },
            };

        case "SET_DOCUMENT_DETAILS":
            return {
                ...state,
                document: {
                    ...state.document,
                    details: { ...state.document.details, ...action.payload },
                },
            };

        case "SET_ITEMS":
            return {
                ...state,
                document: { ...state.document, items: action.payload },
            };

        case "ADD_ITEM":
            return {
                ...state,
                document: {
                    ...state.document,
                    items: [...state.document.items, action.payload],
                },
            };

        case "UPDATE_ITEM":
            return {
                ...state,
                document: {
                    ...state.document,
                    items: state.document.items.map((item) =>
                        item.id === action.payload.id ? { ...item, ...action.payload.item } : item
                    ),
                },
            };

        case "REMOVE_ITEM":
            return {
                ...state,
                document: {
                    ...state.document,
                    items: state.document.items.filter((item) => item.id !== action.payload),
                },
            };

        case "SET_TEMPLATE":
            return {
                ...state,
                document: { ...state.document, template: action.payload },
            };

        case "SET_ACCENT_COLOR":
            return {
                ...state,
                document: { ...state.document, accentColor: action.payload },
            };

        case "SET_CUSTOM_TEMPLATE":
            return {
                ...state,
                document: { ...state.document, customTemplate: action.payload },
            };

        case "SET_STEP":
            return { ...state, currentStep: action.payload };

        case "NEXT_STEP":
            return {
                ...state,
                currentStep: Math.min(state.currentStep + 1, 5) as WizardStep,
            };

        case "PREV_STEP":
            return {
                ...state,
                currentStep: Math.max(state.currentStep - 1, 1) as WizardStep,
            };

        case "SKIP_TO_PREVIEW":
            return {
                ...state,
                previousStepBeforeSkip: state.currentStep,
                currentStep: 5,
            };

        case "RETURN_FROM_PREVIEW":
            return {
                ...state,
                currentStep: state.previousStepBeforeSkip || 4,
                previousStepBeforeSkip: null,
            };

        case "TOGGLE_AUTO_SAVE":
            return { ...state, isAutoSaveEnabled: !state.isAutoSaveEnabled };

        case "RESET_DOCUMENT":
            return {
                ...initialState,
                document: createInitialDocument(state.document.type),
            };

        case "LOAD_DOCUMENT":
            return { ...state, document: action.payload };

        default:
            return state;
    }
}

// Context
interface DocumentContextType {
    state: DocumentState;
    dispatch: React.Dispatch<DocumentAction>;
    // Computed values
    calculateTotals: () => { subtotal: number; totalDiscount: number; totalTax: number; grandTotal: number };
    // Convenience methods
    setDocumentType: (type: DocumentType) => void;
    setBusinessInfo: (info: Partial<BusinessInfo>) => void;
    setClientInfo: (info: Partial<ClientInfo>) => void;
    setDocumentDetails: (details: Partial<DocumentDetails>) => void;
    addItem: () => void;
    updateItem: (id: string, item: Partial<LineItem>) => void;
    removeItem: (id: string) => void;
    setTemplate: (template: Template) => void;
    setAccentColor: (color: AccentColor | string) => void;
    nextStep: () => void;
    prevStep: () => void;
    goToStep: (step: WizardStep) => void;
    skipToPreview: () => void;
    returnFromPreview: () => void;
    resetDocument: () => void;
}

const DocumentContext = createContext<DocumentContextType | undefined>(undefined);

// Provider
export function DocumentProvider({ children }: { children: React.ReactNode }) {
    const [state, dispatch] = useReducer(documentReducer, initialState);

    const calculateTotals = useCallback(() => {
        let subtotal = 0;
        let totalDiscount = 0;
        let totalTax = 0;

        state.document.items.forEach((item) => {
            const lineTotal = item.quantity * item.unitPrice;
            const discount = lineTotal * (item.discountPercent / 100);
            const afterDiscount = lineTotal - discount;
            const tax = afterDiscount * (item.taxRate / 100);

            subtotal += lineTotal;
            totalDiscount += discount;
            totalTax += tax;
        });

        const grandTotal = subtotal - totalDiscount + totalTax;

        return { subtotal, totalDiscount, totalTax, grandTotal };
    }, [state.document.items]);

    const setDocumentType = useCallback((type: DocumentType) => {
        dispatch({ type: "SET_DOCUMENT_TYPE", payload: type });
    }, []);

    const setBusinessInfo = useCallback((info: Partial<BusinessInfo>) => {
        dispatch({ type: "SET_BUSINESS_INFO", payload: info });
    }, []);

    const setClientInfo = useCallback((info: Partial<ClientInfo>) => {
        dispatch({ type: "SET_CLIENT_INFO", payload: info });
    }, []);

    const setDocumentDetails = useCallback((details: Partial<DocumentDetails>) => {
        dispatch({ type: "SET_DOCUMENT_DETAILS", payload: details });
    }, []);

    const addItem = useCallback(() => {
        dispatch({
            type: "ADD_ITEM",
            payload: {
                id: crypto.randomUUID(),
                description: "",
                quantity: 1,
                unitPrice: 0,
                taxRate: 0,
                discountPercent: 0,
            },
        });
    }, []);

    const updateItem = useCallback((id: string, item: Partial<LineItem>) => {
        dispatch({ type: "UPDATE_ITEM", payload: { id, item } });
    }, []);

    const removeItem = useCallback((id: string) => {
        dispatch({ type: "REMOVE_ITEM", payload: id });
    }, []);

    const setTemplate = useCallback((template: Template) => {
        console.log("setTemplate called with:", template);
        dispatch({ type: "SET_TEMPLATE", payload: template });
    }, []);

    const setAccentColor = useCallback((color: AccentColor | string) => {
        dispatch({ type: "SET_ACCENT_COLOR", payload: color });
    }, []);

    const nextStep = useCallback(() => {
        dispatch({ type: "NEXT_STEP" });
    }, []);

    const prevStep = useCallback(() => {
        dispatch({ type: "PREV_STEP" });
    }, []);

    const goToStep = useCallback((step: WizardStep) => {
        dispatch({ type: "SET_STEP", payload: step });
    }, []);

    const skipToPreview = useCallback(() => {
        dispatch({ type: "SKIP_TO_PREVIEW" });
    }, []);

    const returnFromPreview = useCallback(() => {
        dispatch({ type: "RETURN_FROM_PREVIEW" });
    }, []);

    const resetDocument = useCallback(() => {
        dispatch({ type: "RESET_DOCUMENT" });
    }, []);

    const value: DocumentContextType = {
        state,
        dispatch,
        calculateTotals,
        setDocumentType,
        setBusinessInfo,
        setClientInfo,
        setDocumentDetails,
        addItem,
        updateItem,
        removeItem,
        setTemplate,
        setAccentColor,
        nextStep,
        prevStep,
        goToStep,
        skipToPreview,
        returnFromPreview,
        resetDocument,
    };

    return <DocumentContext.Provider value={value}>{children}</DocumentContext.Provider>;
}

// Hook
export function useDocument() {
    const context = useContext(DocumentContext);
    if (context === undefined) {
        throw new Error("useDocument must be used within a DocumentProvider");
    }
    return context;
}
