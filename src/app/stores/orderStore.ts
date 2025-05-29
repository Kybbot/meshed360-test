import { createStore } from "zustand/vanilla";
import { CreditNoteType, FulfilmentType, InvoiceType } from "@/@types/salesOrders/api.ts";

type OrderStoreType = {
	taxInclusive: boolean;
	skipQuote: boolean;
	currentTab: string;
	setTaxInclusive: (value: boolean) => void;
	setSkipQuote: (value: boolean) => void;
	setCurrentTab: (value: string) => void;
	setFulfillment: (value: FulfilmentType[] | undefined) => void;
	fulfilment: FulfilmentType[] | undefined;
	setInvoicing: (value: InvoiceType[] | undefined) => void;
	setCreditNotes: (value: CreditNoteType[] | undefined) => void;
	invoicing: InvoiceType[] | undefined;
	creditNotes: CreditNoteType[] | undefined;
};

export const orderStore = createStore<OrderStoreType>((set) => ({
	taxInclusive: false,
	skipQuote: false,
	currentTab: "quote",
	fulfilment: undefined,
	invoicing: undefined,
	creditNotes: undefined,
	setTaxInclusive: (value) => set(() => ({ taxInclusive: value })),
	setSkipQuote: (value) =>
		set((state) => ({
			skipQuote: value,
			...(value && state.currentTab === "quote" ? { currentTab: "salesOrder" } : {}),
		})),
	setCurrentTab: (value) => set(() => ({ currentTab: value })),
	setFulfillment: (value) => set(() => ({ fulfilment: value })),
	setInvoicing: (value) => set(() => ({ invoicing: value })),
	setCreditNotes: (value) => set(() => ({ creditNotes: value })),
}));
