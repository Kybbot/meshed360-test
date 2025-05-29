import { SelectOption } from "../selects";
import { AssemblyStatus } from "./assembly";

// DATA
export type AssemblyResultLineType = {
	id: string;
	product: SelectOption;
	uom: SelectOption | null;
	batchNumber: string | null;
	expiryDate: string | null;
	actualYield: string;
	totalCost: string;
};

export type GetAllAssemblyResultResponseType = {
	status: AssemblyStatus;
	resultStatus: "DRAFT" | "AUTHORIZED";
	lines: AssemblyResultLineType[];
};

// FORM
export type AssemblyResultFormValues = {
	batchNumber?: string;
	expiryDate?: Date;
	actualYield: string;
};

// CREATE/UPDATE
export type CreateAssemblyResult = {
	orderId: string;
	batchNumber?: string;
	expiryDate?: string;
	actualYield: string;
};

// RESPONSES
export type SaveAssemblyResultResponseType = {
	status: "AUTHORISED";
	resultStatus: "DRAFT";
};

export type UndoAssemblyResultResponseType = {
	status: "AUTHORISED";
	resultStatus: "AUTHORIZED";
};

export type VoidAssemblyResultResponseType = {
	status: "AUTHORISED";
	resultStatus: "AUTHORIZED";
};

export type AuthoriseAssemblyResultResponseType = {
	status: "CLOSED";
	resultStatus: "AUTHORIZED";
};
