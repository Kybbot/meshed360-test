import { ProductType } from "../products";
import { SelectOption, TaxRateType } from "../selects";

export type CreditNoteStatus = "DRAFT" | "VOID" | "AUTHORIZED";

export type CreditNoteLineType = {
	id: string;
	orderLineId: string;
	product: ProductType;
	comment?: string;
	quantity: string;
	unitPrice: string;
	discount: string;
	account: SelectOption;
};

export type CreditNoteServiceLineType = {
	id: string;
	product: ProductType;
	description?: string;
	comment?: string;
	quantity: string;
	unitPrice: string;
	discount: string;
	tax: TaxRateType;
	account: SelectOption;
};

export type CreditNoteType = {
	id: string;
	status: CreditNoteStatus;
	date: string;
	bills: {
		id: string;
		billNumber: string;
	}[];
	creditNoteNumber?: string;
	lines: CreditNoteLineType[];
	serviceLines: CreditNoteServiceLineType[];
};

export type GetCreditNoteResponseType = CreditNoteType | null;

// FORM
export type CreditNoteProductType = {
	id: string;
	quantity: number;
	product: ProductType;
};

export type CreditNoteLineFormType = {
	lineId: string;
	orderLineId: string;
	product?: ProductType;
	comment?: string;
	quantity: string;
	unitPrice: string;
	discount: string;
	account?: SelectOption;
	total: string;
};

export type CreditNoteServiceLineFormType = {
	lineId: string;
	product?: ProductType;
	comment?: string;
	quantity: string;
	unitPrice: string;
	discount: string;
	tax?: TaxRateType;
	account?: SelectOption;
	total: string;
};

export type CreditNoteFormValues = {
	date: Date;
	total: string;
	lines: CreditNoteLineFormType[];
	serviceLines: CreditNoteServiceLineFormType[];
};

export const DefaultCreditNoteLine: CreditNoteLineFormType = {
	lineId: "",
	orderLineId: "",
	product: undefined,
	comment: "",
	quantity: "",
	unitPrice: "",
	discount: "",
	account: undefined,
	total: "",
};

export const DefaultCreditNoteServiceLine: CreditNoteServiceLineFormType = {
	lineId: "",
	product: undefined,
	comment: "",
	quantity: "",
	unitPrice: "",
	discount: "",
	tax: undefined,
	account: undefined,
	total: "",
};

// CREATE | UPDATE
export type CreateCreditNoteLine = {
	id?: string;
	orderLineId: string;
	productId: string;
	comment?: string;
	quantity: string;
	unitPrice: string;
	discount?: string;
	accountId: string;
};

export type CreateCreditNoteServiceLine = {
	id?: string;
	productId?: string;
	description?: string;
	comment?: string;
	quantity: string;
	unitPrice: string;
	discount?: string;
	taxRateId: string;
	accountId: string;
};

export type CreateCreditNoteType = {
	orderId: string;
	date: string;
	total: string;
	billIds: string[];
	lines: CreateCreditNoteLine[];
	serviceLines: CreateCreditNoteServiceLine[];
};

export type UpdateCreditNoteType = {
	id: string;
	date: string;
	total: string;
	billIds: string[];
	lines: CreateCreditNoteLine[];
	serviceLines: CreateCreditNoteServiceLine[];
};

export type GetAddCreditNoteResponseType = {
	id: string;
	billId: string;
	status: CreditNoteStatus;
	lines: {
		id: string;
		noteId: string;
		orderLineId: string;
		productId: string;
		comment: string;
		quantity: string;
		unitPrice: string;
		discount: string;
		accountId: string;
	}[];
	serviceLines: {
		id: string;
		noteId: string;
		productId: string;
		comment: string;
		quantity: string;
		unitPrice: string;
		discount: string;
		taxRateId: string;
		accountId: string;
	}[];
};

export type AuthoriseCreditNoteResponseType = {
	orderStatus: "CREDITED";
	creditNoteStatus: "AUTHORIZED";
};

export type UndoCreditNoteResponseType = {
	orderStatus: "CREDITED";
	creditNoteStatus: "DRAFT";
};

export type VoidCreditNoteResponseType = {
	orderStatus: "CREDITED";
	creditNoteStatus: "VOID";
};
