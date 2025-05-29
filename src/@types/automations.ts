import { SelectOption } from "./selects";

export type AutomationType = {
	id: string;
	automation: "AGRIMARK" | "BKB" | "OVK";
	supplier: string | null;
	purchaseType: string | null;
	accountNumber: string;
	subaccountNumber: string | null;
	isActive: boolean;
};

export type GetAllAutomationsResponseType = {
	items: AutomationType[];
	totalCount: number;
	totalPages: number;
};

export const automationVendorOptions = [{ id: "AGRIMARK", name: "Agrimark" }];

export const purchaseTypeOptions = [
	{ id: "ALL_PURCHASES", name: "All Purchases" },
	{ id: "DIESEL_PURCHASE", name: "Diesel Purchase" },
];

export const AutomationsTypes: Record<string, string> = {
	AGRIMARK: "Agrimark",
	BKB: "Bkb",
	OVK: "Ovk",
};

export type CreateAutomationBody = {
	provider: "AGRIMARK" | "BKB" | "OVK";
	accountNumber: string;
	username: string;
	password: string;
	purchaseType: "ALL_PURCHASES" | "DIESEL_PURCHASE";
	accountHolder: string;
	subaccountNumber: string;
};

export type AutomationFormValues = {
	provider: SelectOption;
	purchaseType: SelectOption;
	accountHolder: string;
	accountNumber: string;
	subaccountNumber: string;
	username: string;
	password: string;
};
