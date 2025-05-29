import { SelectOption } from "../selects";

// GET DATA
export type AssemblyAdditionalExpenseStatus = "DRAFT" | "VOID" | "AUTHORIZED";

export type AssemblyAdditionalExpenseLineType = {
	id: string;
	expenseAccount: SelectOption;
	reference: string;
	date: string;
	amount: string;
};

export type AssemblyAdditionalExpense = {
	additionalExpensesStatus: AssemblyAdditionalExpenseStatus;
	lines: AssemblyAdditionalExpenseLineType[];
};

export type GetAssemblyAdditionalExpenseType = AssemblyAdditionalExpense;

// FORM
export type AssemblyAdditionalExpenseLineFormType = {
	expenseAccount?: SelectOption;
	reference?: string;
	date?: Date;
	amount: string;
};

export type AssemblyAdditionalExpenseFormValues = {
	lines: AssemblyAdditionalExpenseLineFormType[];
};

export const DefaultAssemblyAdditionalExpenseLine: AssemblyAdditionalExpenseLineFormType = {
	expenseAccount: undefined,
	reference: "",
	date: undefined,
	amount: "",
};

// CREATE/UPDATE
export type CreateAssemblyAdditionalExpenseType = {
	orderId: string;
	lines: {
		id?: string;
		expenseAccountId: string;
		reference?: string;
		date?: string;
		amount: string;
	}[];
};

// RESPONSES
export type SaveAssemblyAdditionalExpenseResponseType = {
	status: "AUTHORISED";
	additionalExpensesStatus: "DRAFT";
};

export type AuthoriseAssemblyAdditionalExpenseStatusResponseType = {
	status: "AUTHORISED";
	additionalExpensesStatus: "AUTHORIZED";
};

export type UndoAssemblyAdditionalExpenseStatusResponseType = {
	status: "AUTHORISED";
	additionalExpensesStatus: "DRAFT";
};

export type VoidAssemblyAdditionalExpenseStatusResponseType = {
	status: "AUTHORISED";
	additionalExpensesStatus: "DRAFT";
};
