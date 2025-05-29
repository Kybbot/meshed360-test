export type PurchaseOrderStatus =
	| "DRAFT"
	| "VOID"
	| "CLOSED"
	| "CREDITED"
	| "AUTHORISED"
	| "PARTIALLY_RECEIVED"
	| "FULLY_RECEIVED"
	| "PARTIALLY_BILLED"
	| "FULLY_BILLED";

export type PurchaseOrderLinesStatus = "NEW" | "DRAFT" | "AUTHORISED";

export const PurchaseOrderOverallStatuses: Record<PurchaseOrderStatus, string> = {
	VOID: "Void",
	CLOSED: "Closed",
	DRAFT: "Draft",
	CREDITED: "Credited",
	AUTHORISED: "Authorised",
	PARTIALLY_RECEIVED: "Partially Received",
	FULLY_RECEIVED: "Fully Received",
	PARTIALLY_BILLED: "Partially Billed",
	FULLY_BILLED: "Fully Billed",
};

export const PurchaseOrderXeroStatuses: Record<string, string> = {
	VOID: "Void",
	PAID: "Paid",
	POSTED: "Posted",
	NOT_POSTED: "Not posted",
};

export const PurchaseOrderStockStatuses: Record<string, string> = {
	RECEIVED: "Received",
	NOT_RECEIVED: "Not Received",
	FULLY_RECEIVED: "Fully Received",
	PARTIALLY_RECEIVED: "Partially Received",
};

export const PurchaseOrderPaymentStatuses: Record<string, string> = {
	PAID: "Paid",
	UNPAID: "Unpaid",
	PARTIALLY_PAID: "Partially Paid",
};

export const PurchaseOrderBillStatuses: Record<string, string> = {
	FULLY_BILLED: "Fully Billed",
	NOT_BILLED: "Not Billed",
	PARTIALLY_BILLED: "Partially Billed",
};
