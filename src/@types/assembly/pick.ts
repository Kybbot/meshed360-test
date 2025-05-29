import { ProductType } from "../products";
import { AssemblyStatus } from "./assembly";
import { WarehousType } from "../warehouses";
import { SelectOption, SelectOptionOnlyWithName } from "../selects";

// DATA
export type AssemblyPickType = {
	id: string;
	product: ProductType;
	warehouse: WarehousType;
	batchNumber?: string;
	expiryDate?: string;
	quantity: string;
	uom?: SelectOption;
	available: string;
	cost: string;
	batches: {
		productId: string;
		batchNumber: string | null;
		expiryDate: string | null;
		warehouseId: string;
		// allocated: string;
		// onHand: string;
		// onOrder: string;
		available: string;
	}[];
};

export type GetAssemblyPickResponseType = {
	status: AssemblyStatus;
	pickStatus: "DRAFT" | "AUTHORIZED";
	lines: AssemblyPickType[];
};

export type PickLineType = {
	productId: string;
	batchNumber: string;
	expiryDate: string;
	warehouseId: string;
	// onHand: string;
	// onOrder: string;
	available: string;
	cost: string;
};

export type GetPickLineResponseType = PickLineType[];

export type AutoPickType = {
	product: {
		id: string;
		name: string;
		unitOfMeasure: {
			id: string;
			name: string;
		};
	};
	warehouse: {
		id: string;
		name: string;
	};
	batchNumber: string;
	expiryDate: string;
	quantity: number;
	cost: string;
	available: string;
	options: {
		warehouse: {
			id: string;
			name: string;
		};
		product: {
			id: string;
			name: string;
			unitOfMeasure: {
				id: string;
				name: string;
			};
		};
		batchNumber: string;
		expiryDate: string;
		quantity: number;
		availableDate: string;
		available: string;
		cost: string;
	}[];
};

export type GetAutoPickResponseType = AutoPickType[];

// FORM
export type AssemblyPickLineBatchType = {
	name: string;
	batchNumber: string | null;
	expiryDate: string | null;
	available: string;
	cost: string;
};

export type AssemblyPickLineFormType = {
	product?: ProductType;
	warehouse?: WarehousType;
	batchNumber?: SelectOptionOnlyWithName;
	expiryDate?: string;
	quantity: string;
	unitOfMeasure?: SelectOption;
	available: string;
	cost: string;
	batches: AssemblyPickLineBatchType[];
};

export type AssemblyPickFormValues = {
	lines: AssemblyPickLineFormType[];
};

export const DefaultAssemblyPickLine: AssemblyPickLineFormType = {
	product: undefined,
	warehouse: undefined,
	batchNumber: undefined,
	expiryDate: undefined,
	quantity: "",
	unitOfMeasure: undefined,
	available: "",
	cost: "",
	batches: [],
};

// CREATE/UPDATE
export type CreateAssemblyPickType = {
	orderId: string;
	lines: {
		productId: string;
		warehouseId: string;
		batchNumber?: string;
		expiryDate?: string;
		uomId?: string;
		quantity: string;
	}[];
};

// RESPONSES
export type SaveAssemblyPickResponseType = {
	status: "PICKING";
	pickStatus: "DRAFT";
};

export type AuthoriseAssemblyPickStatusResponseType = {
	status: "PICKED";
	pickStatus: "AUTHORIZED";
};

export type UndoAssemblyPickStatusResponseType = {
	status: "AUTHORISED";
	pickStatus: "DRAFT";
};

export type VoidAssemblyPickStatusResponseType = {
	status: "AUTHORISED";
	pickStatus: "DRAFT";
};
