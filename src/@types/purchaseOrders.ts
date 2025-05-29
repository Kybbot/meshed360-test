import { ProductType } from "./products";
import { SelectOption, TaxRateType } from "./selects";

// BILL
export type BillStatus = "VOID" | "DRAFT" | "COMPLETED" | "AUTHORIZED";
export type BillPaymentStatus = "PAID" | "UNPAID" | "PARTIALLY_PAID";

export const BillPaymentStatusValues = {
	PAID: "Paid",
	UNPAID: "Unpaid",
	PARTIALLY_PAID: "Partially Paid",
};

export type BillAllocationType = {
	cost: string;
	billId: string;
	billLineId: string;
};

export type BillLine = {
	id: string;
	orderLineId: string;
	product: ProductType;
	comment?: string;
	supplierSku?: string;
	quantity: string;
	unitPrice: string;
	discount: string;
	taxRate: TaxRateType;
	account: SelectOption;
	trackingCategory1?: SelectOption;
	trackingCategory2?: SelectOption;
	total: string;
};

type BillServiceLine = {
	id: string;
	product?: ProductType;
	description?: string;
	comment?: string;
	quantity: string;
	unitPrice: string;
	discount: string;
	taxRate?: TaxRateType;
	addToLandedCost: boolean;
	account?: SelectOption;
	trackingCategory1?: SelectOption;
	trackingCategory2?: SelectOption;
	total: string;
	allocation: BillAllocationType[];
};

export type BillType = {
	id: string;
	xeroInvoiceUrl?: string;
	receivingIds: string[];
	receivings: {
		id: string;
		receivingNumber: string;
	}[];
	billNumber: string;
	due: string;
	paid: string;
	dueDate: string;
	billDate: string;
	currency: string;
	lines: BillLine[];
	serviceLines: BillServiceLine[];
	status: BillStatus;
	paymentStatus: BillPaymentStatus;
	payments: {
		id: string;
		amount: string;
		paymentNumber: string;
	}[];
};

export type GetAllBillsResponseType = {
	bills: BillType[];
};

export type OrgBillType = {
	id: string;
	billNumber: string;
	currency: {
		id: string;
		name: string;
		code: string;
	};
	lines: {
		id: string;
		orderLineId: string;
		supplierSku: string;
		product: ProductType;
		taxRate: TaxRateType;
		comment: string | null;
		quantity: string;
		unitPrice: string;
		discount: string;
		total: string;
	}[];
};

export type GetAllOrgBillsResponseType = OrgBillType[];

// FORM
type BillProductType = {
	id: string;
	product: ProductType;
	supplierSku?: string;
	quantity: number;
};

export type BillLineFormType = {
	lineId: string;
	orderLineId: string;
	product?: BillProductType;
	blindProduct?: ProductType;
	comment?: string;
	supplierSku?: string;
	quantity: string;
	unitPrice: string;
	discount: string;
	taxRate?: TaxRateType;
	account?: SelectOption;
	trackingCategory1?: SelectOption;
	trackingCategory2?: SelectOption;
	total: string;
	receivingIds?: string[]; // For frontend use only
};

export type BillAdditionalCostFormType = { lineId: string } & Omit<BillServiceLine, "id">;

export type BillFormValues = {
	billNumber: string;
	billDate: Date;
	dueDate: Date;
	lines: BillLineFormType[];
	serviceLines: BillAdditionalCostFormType[];
};

export const DefaultBillLine: BillLineFormType = {
	lineId: "",
	orderLineId: "",
	product: undefined,
	blindProduct: undefined,
	comment: "",
	quantity: "",
	unitPrice: "",
	discount: "",
	taxRate: undefined,
	account: undefined,
	trackingCategory1: undefined,
	trackingCategory2: undefined,
	total: "",
};

export const DefaultBillAdditionalCost: BillAdditionalCostFormType = {
	lineId: "",
	product: undefined,
	comment: "",
	quantity: "",
	unitPrice: "",
	discount: "",
	taxRate: undefined,
	addToLandedCost: false,
	account: undefined,
	trackingCategory1: undefined,
	trackingCategory2: undefined,
	total: "",
	allocation: [],
};

export type CreateBillLine = {
	id?: string;
	orderLineId?: string;
	productId: string;
	comment?: string;
	supplierSku?: string;
	quantity: string;
	unitPrice: string;
	discount?: string;
	taxRateId: string;
	accountId: string;
	trackingCategory1Id?: string;
	trackingCategory2Id?: string;
};

export type CreateAdditionalCost = {
	id?: string;
	productId?: string;
	description?: string;
	comment?: string;
	quantity: string;
	unitPrice: string;
	discount?: string;
	taxRateId: string;
	addToLandedCost: boolean;
	accountId?: string;
	trackingCategory1Id?: string;
	trackingCategory2Id?: string;
	allocation: {
		cost: string;
		billId?: string;
		billLineId: string;
	}[];
};

export type CreateBillType = {
	orderId: string;
	billNumber: string;
	billDate: string;
	dueDate: string;
	receivingIds: string[];
	lines: CreateBillLine[];
	serviceLines: CreateAdditionalCost[];
};

export type UpdateBillLine = { id?: string } & CreateBillLine;

export type UpdateAdditionalCost = { id?: string } & CreateAdditionalCost;

export type UpdateBillType = {
	id: string;
	billNumber: string;
	billDate: string;
	dueDate: string;
	lines: UpdateBillLine[];
	serviceLines: UpdateAdditionalCost[];
};

export type GetAddBillResponseType = {
	id: string;
	receivingId?: string;
	billNumber: string;
	due: string;
	paid: string;
	dueDate: string;
	billDate: string;
	currency: string;
	lines: BillLine[];
	serviceLines: BillServiceLine[];
	status: BillStatus;
	paymentStatus: BillPaymentStatus;
};

export type UndoBillStatusResponseType = {
	billStatus: "DRAFT";
	orderStatus: "PARTIALLY_BILLED" | "FULLY_BILLED";
};

export type VoidBillStatusResponseType = {
	billStatus: "VOID";
	orderStatus: "PARTIALLY_BILLED" | "FULLY_BILLED";
};

export type AuthoriseBillStatusResponseType = {
	billStatus: "AUTHORIZED";
	orderStatus: "PARTIALLY_BILLED" | "FULLY_BILLED";
};

export type CompleteBillStatusResponseType = {
	billStatus: "COMPLETED";
	orderStatus: "PARTIALLY_BILLED" | "FULLY_BILLED";
};

// MODAL FORM
export type BillAllocate = {
	id: string;
	name: string;
	billId: string;
	billLineId: string;
	product?: ProductType;
	reference: string;
	billTotal: string;
	cost: string;
};

export type BillModalFormValues = {
	additionalLines: BillAllocate[];
};

export const DefaultBillModalAllocate: BillAllocate = {
	id: "",
	name: "",
	billId: "",
	billLineId: "",
	product: undefined,
	reference: "",
	billTotal: "",
	cost: "",
};
