import { SelectOption } from "./selects";

export type GetConfigurationSettingsResponseType = {
	xeroInvoiceStatus: "DRAFT" | "AUTHORIZED" | "AWAITING_APPROVAL" | "AWAITING_PAYMENT";
	importPurchaseOrderFromXero: boolean;
	exportPurchaseOrderToXero: boolean;
	enableTrackingCategories: boolean;
	trackingCategories: { id: string; name: string; isActive: boolean }[];
	loadItemsFromXero: boolean;
	loadInvoicesFromXero: boolean;
	defaultLocation?: SelectOption;
	defaultLocations: SelectOption[];
	autoPick: "NO_PICKING" | "AUTO_PICK" | "AUTO_PICK_PACK" | "AUTO_PICK_PACK_SHIP";
	loadBillsFromXero: boolean;
	autoReceiveStockFromXero: boolean;
};

export type UpdateConfigurationSettingsRequestBody = {
	xeroInvoiceStatus: string;
	importPurchaseOrderFromXero: boolean;
	exportPurchaseOrderToXero: boolean;
	enableTrackingCategories: boolean;
	categories: { id: string; isActive: boolean }[];
	loadItemsFromXero: boolean;
	loadInvoicesFromXero: boolean;
	defaultLocationId?: string | null;
	autoPick: string;
	loadBillsFromXero: boolean;
	autoReceiveStockFromXero: boolean;
};

export const xeroInvoiceStatusOptions = [
	{ id: "DRAFT", name: "Draft" },
	{ id: "AWAITING_APPROVAL", name: "Awaiting Approval" },
	{ id: "AWAITING_PAYMENT", name: "Awaiting Payment" },
	{ id: "AUTHORIZED", name: "Authorized" },
];

export const autoPickOptions = [
	{ id: "NO_PICKING", name: "No Picking" },
	{ id: "AUTO_PICK", name: "Auto Pick" },
	{ id: "AUTO_PICK_PACK", name: "Auto Pick & Pack" },
	{ id: "AUTO_PICK_PACK_SHIP", name: "Auto Pick, Pack & Ship" },
];

export const xeroInvoiceStatusByKey: Record<string, SelectOption> = {
	DRAFT: { id: "DRAFT", name: "Draft" },
	AWAITING_APPROVAL: { id: "AWAITING_APPROVAL", name: "Awaiting Approval" },
	AWAITING_PAYMENT: { id: "AWAITING_PAYMENT", name: "Awaiting Payment" },
	AUTHORIZED: { id: "AUTHORIZED", name: "Authorized" },
};

export const autoPickByKey: Record<string, SelectOption> = {
	NO_PICKING: { id: "NO_PICKING", name: "No Picking" },
	AUTO_PICK: { id: "AUTO_PICK", name: "Auto Pick" },
	AUTO_PICK_PACK: { id: "AUTO_PICK_PACK", name: "Auto Pick & Pack" },
	AUTO_PICK_PACK_SHIP: { id: "AUTO_PICK_PACK_SHIP", name: "Auto Pick, Pack & Ship" },
};

export type ConfigurationSettingsFormValues = {
	xeroInvoiceStatus: SelectOption;
	importPurchaseOrderFromXero: boolean;
	exportPurchaseOrderToXero: boolean;
	enableTrackingCategories: boolean;
	categories: { id: string; name: string; isActive: boolean }[];
	loadItemsFromXero: boolean;
	loadInvoicesFromXero: boolean;
	defaultLocation?: SelectOption;
	autoPick: SelectOption;
	loadBillsFromXero: boolean;
	autoReceiveStockFromXero: boolean;
};
