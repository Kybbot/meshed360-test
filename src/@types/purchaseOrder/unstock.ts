import { ProductType } from "../products";
import { WarehousType } from "../warehouses";
import { UnitOfMeasureType } from "../unitsOfMeasure";

export type UnstockStatus = "DRAFT" | "VOID" | "AUTHORIZED";

export type UnstockLineType = {
	id: string;
	orderLineId: string;
	product: ProductType;
	batchOrSerialNumber: string;
	unitOfMeasure: UnitOfMeasureType;
	quantity: string;
	unstockLocation: WarehousType;
	expiryDate: string;
};

export type UnstockType = {
	id: string;
	status: UnstockStatus;
	unstockDate: string;
	lines: UnstockLineType[];
};

export type GetUnstokResponseType = UnstockType | null;

// FORM
export type UnstockProductType = {
	quantity: number;
	orderLineId: string;
	product: ProductType;
};

export type UnstockLineFormType = {
	lineId: string;
	orderLineId: string;
	product?: UnstockProductType;
	batchOrSerialNumber: string;
	unitOfMeasure?: UnitOfMeasureType;
	quantity: string;
	unstockLocation?: WarehousType;
	expiryDate?: Date;
};

export type UnstockFormValues = {
	date: Date;
	lines: UnstockLineFormType[];
};

export const DefaultUnstockLine: UnstockLineFormType = {
	lineId: "",
	orderLineId: "",
	product: undefined,
	batchOrSerialNumber: "",
	unitOfMeasure: undefined,
	quantity: "",
	unstockLocation: undefined,
	expiryDate: undefined,
};

// CREATE | UPDATE
export type CreateUnstockLine = {
	orderLineId: string;
	batchOrSerialNumber: string;
	expiryDate?: string;
	quantity: string;
	warehouseId?: string;
	uomId?: string;
};

export type CreateUnstockType = {
	orderId: string;
	creditNoteId: string;
	unstockDate: string;
	lines: CreateUnstockLine[];
};

export type UpdateUnstockType = {
	id: string; // orderId
	creditNoteId: string;
	unstockDate: string;
	lines: CreateUnstockLine[];
};

export type GetAddUnstokResponseType = {
	id: string;
	status: UnstockStatus;
	unstockDate: string;
	creditNoteId: string;
	lines: {
		id: string;
		orderLineId: string;
		batchOrSerialNumber: string;
		uomId: string;
		quantity: string;
		warehouseId: string;
		expiryDate: string;
	}[];
};

export type AuthoriseUnstockResponseType = {
	orderStatus: "PARTIALLY_BILLED";
	unstockStatus: "AUTHORIZED";
};

export type UndoUnstockResponseType = {
	orderStatus: "PARTIALLY_BILLED";
	unstockStatus: "DRAFT";
};

export type VoidUnstockResponseType = {
	orderStatus: "PARTIALLY_BILLED";
	unstockStatus: "VOID";
};
