export const documentTemplates = {
	sales: [
		{ id: "sales_order_quote", name: "Quote" },
		{ id: "sales_order", name: "Sales Order" },
		{ id: "sales_order_invoice", name: "Invoice" },
		{ id: "sales_order_picking_list", name: "Picking Ship" },
		{ id: "sales_order_packing_list", name: "Packing Ship" },
		{ id: "sales_order_shipping_slip", name: "Shipping Ship" },
		{ id: "sales_order_credit_note", name: "Credit Note" },
		{ id: "sales_order_restock", name: "Restock" },
	],
	purchase: [
		{ id: "purchase_order", name: "Purchuse Order" },
		{ id: "purchase_order_receivings", name: "Receivings" },
		{ id: "purchase_order_bills", name: "Bills" },
		{ id: "purchase_order_unstock", name: "Unstock" },
	],
	inventory: [
		{ id: "stock_adjustments", name: "Stock Adjustments" },
		{ id: "stock_take", name: "Stock Take" },
		{ id: "stock_transfers", name: "Stock Transfers" },
	],
	production: [
		{ id: "assembly_order", name: "Assembly Order" },
		{ id: "disassembly_order", name: "Disassembly Order" },
		{ id: "assembly_pick_list", name: "Assembly Pick List" },
		{ id: "disassembly_pick_list", name: "Disassembly Pick List" },
	],
} as const;

export const documentTemplatesObj: Record<TemplateTypes, TemplateType[]> = {
	sales_order_quote: [],
	sales_order: [],
	sales_order_invoice: [],
	sales_order_picking_list: [],
	sales_order_packing_list: [],
	sales_order_shipping_slip: [],
	sales_order_credit_note: [],
	sales_order_restock: [],
	purchase_order: [],
	purchase_order_receivings: [],
	purchase_order_bills: [],
	purchase_order_unstock: [],
	stock_adjustments: [],
	stock_take: [],
	stock_transfers: [],
	assembly_order: [],
	disassembly_order: [],
	assembly_pick_list: [],
	disassembly_pick_list: [],
};

export type TemplateTypes =
	| "sales_order_quote"
	| "sales_order"
	| "sales_order_invoice"
	| "sales_order_picking_list"
	| "sales_order_packing_list"
	| "sales_order_shipping_slip"
	| "sales_order_credit_note"
	| "sales_order_restock"
	| "purchase_order"
	| "purchase_order_receivings"
	| "purchase_order_bills"
	| "purchase_order_unstock"
	| "stock_adjustments"
	| "stock_take"
	| "stock_transfers"
	| "assembly_order"
	| "disassembly_order"
	| "assembly_pick_list"
	| "disassembly_pick_list";

export type TemplateType = {
	id: string;
	type: TemplateTypes;
	name: string;
	default: boolean;
	uploaded: boolean;
};

export type GetAllTemplatesResponseType = TemplateType[];

export type CreateTemplateBody = {
	name: string;
	type: TemplateTypes;
	organisationId: string;
};
