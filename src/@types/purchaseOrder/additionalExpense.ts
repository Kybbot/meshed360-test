import { ProductType } from "../products";
import { SelectOption } from "../selects";

// GET DATA
export type AdditionalExpenseStatus = "DRAFT" | "VOID" | "AUTHORIZED";

export type AdditionalExpenseAllocationType = {
	billId: string;
	billLineId: string;
	product: ProductType;
	reference: string;
	billTotal: string;
	allocateAdditionalCost: string;
};

export type AdditionalExpenseLineType = {
	id: string;
	expenseAccount: SelectOption;
	reference: string;
	date: string;
	amount: string;
	allocation: AdditionalExpenseAllocationType[];
};

export type AdditionalExpense = {
	status: AdditionalExpenseStatus;
	lines: AdditionalExpenseLineType[];
};

export type GetAdditionalExpenseType = AdditionalExpense | null;

// FORM
export type AdditionalExpenseAllocate = {
	id: string;
	name: string;
	billId: string;
	billLineId: string;
	product?: ProductType;
	reference?: string;
	billTotal: string;
	allocateAdditionalCost: string;
};

export type AdditionalExpenseLineFormType = {
	lineId: string;
	expenseAccount?: SelectOption;
	reference?: string;
	date?: Date;
	amount: string;
	allocation: AdditionalExpenseAllocate[];
};

export type AdditionalExpenseFormValues = {
	lines: AdditionalExpenseLineFormType[];
};

export const DefaultAdditionalExpenseLine: AdditionalExpenseLineFormType = {
	lineId: "",
	expenseAccount: undefined,
	reference: "",
	date: undefined,
	amount: "",
	allocation: [],
};

// MODAL FORM
export type AdditionalExpenseModalFormValues = {
	additionalLines: AdditionalExpenseAllocate[];
};

export const DefaultAdditionalModalExpenseAllocate: AdditionalExpenseAllocate = {
	id: "",
	name: "",
	billId: "",
	billLineId: "",
	product: undefined,
	reference: "",
	billTotal: "",
	allocateAdditionalCost: "",
};

// CREATE | UPDATE
export type CreateAdditionalExpenseType = {
	orderId: string;
	lines: {
		id?: string;
		expenseAccountId: string;
		reference?: string;
		date?: string;
		amount: string;
		allocation: {
			billId: string;
			billLineId: string;
			productId: string;
			reference?: string;
			allocateAdditionalCost: string;
		}[];
	}[];
};

export type AuthoriseAdditionalExpenseStatusResponseType = {
	orderStatus: "AUTHORISED";
	additionalExpensesStatus: "AUTHORIZED";
};

export type UndoAdditionalExpenseStatusResponseType = {
	orderStatus: "AUTHORISED";
	additionalExpensesStatus: "DRAFT";
};

export type VoidAdditionalExpenseStatusResponseType = {
	orderStatus: "AUTHORISED";
	additionalExpensesStatus: "DRAFT";
};
