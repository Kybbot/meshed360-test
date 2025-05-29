import { SelectOption, SelectOptionOnlyWithName } from "./selects";

// Stock Control List
export type StockControlType = {
	id: string;
	number: string | null;
	type: "STOCK_ADJUSTMENT" | "STOCK_TAKE" | "STOCK_TRANSFER";
	sourceLocation: string;
	destinationLocation: string | null;
	date: Date;
	status: "DRAFT" | "COMPLETED" | "IN_PROGRESS" | "VOID";
	createdBy: string;
	reference: string | null;
};

export const StockControlTypes: Record<string, string> = {
	STOCK_ADJUSTMENT: "Stock Adjustment",
	STOCK_TAKE: "Stock Take",
	STOCK_TRANSFER: "Stock Transfer",
};

export const StockControlRoutes: Record<string, string> = {
	STOCK_ADJUSTMENT: "stockAdjustment",
	STOCK_TRANSFER: "stockTransfer",
	STOCK_TAKE: "stockTake",
};

export const StockControlStatuses: Record<string, string> = {
	DRAFT: "Draft",
	IN_PROGRESS: "In Progress",
	COMPLETED: "Completed",
	VOID: "Void",
};

export type GetStockControlResponseType = {
	items: StockControlType[];
	totalCount: number;
	totalPages: number;
};
// Stock Adjustment
export type StockAdjustmentType = {
	id: string;
	status: string;
	stockAdjustmentNumber: string;
	organisationId: string;
	accountId: string;
	effectiveDate: Date;
	warehouseId: string;
	reference: string | null;
	createdAt: Date;
	createdBy: string;
	updatedAt: Date;
};

export type GetStockAdjustmentResponseType = {
	stockAdjustment: StockAdjustmentType & {
		additionLines: StockAdjustmentAdditionLine[];
		modificationLines: StockAdjustmentModificationLine[];
		account: {
			id: string;
			name: string;
		};
		warehouse: {
			id: string;
			name: string;
		};
		accounts: {
			id: string;
			name: string;
		}[];
		warehouses: {
			id: string;
			name: string;
		}[];
	};
};

export type CreateStockAdjustmentType = {
	effectiveDate: string;
	accountId: string;
	warehouseId: string;
	reference: string | null;
	additionLines?: CreateStockAdjustmentAdditionLine[];
	modificationLines?: CreateStockAdjustmentModificationLine[];
};

export type StockAdjustmentFormValues = {
	effectiveDate: Date;
	account: SelectOption;
	warehouse: SelectOption;
	reference?: string;
	additionLines: AdditionLineFormValue[];
	modificationLines: ModificationLineFormValue[];
};

// Stock Adjustment Modification Line
export type StockAdjustmentModificationLine = {
	id?: string;
	stockAdjustmentId: string;
	productId: string;
	productName: string;
	batchNumber: string | null;
	expiryDate: string | null;
	quantityOnHand: string;
	quantityAvailable: string;
	quantityNew: string;
	trackingCategoryAId: string | null;
	trackingCategoryBId: string | null;
	comment: string | null;
};
export type CreateStockAdjustmentModificationLine = Omit<
	StockAdjustmentModificationLine,
	"productName" | "stockAdjustmentId"
>;

export type ModificationLineFormValue = {
	id?: string;
	stockAdjustmentId: string;
	product?: SelectOption;
	batchNumber?: SelectOptionOnlyWithName;
	expiryDate?: string;
	quantityOnHand: string;
	quantityAvailable: string;
	quantityNew: string;
	trackingCategoryA?: SelectOption;
	trackingCategoryB?: SelectOption;
	comment?: string;
};

export const DefaultModificationLine: ModificationLineFormValue = {
	stockAdjustmentId: "",
	product: undefined,
	batchNumber: undefined,
	expiryDate: "",
	quantityOnHand: "0",
	quantityAvailable: "0",
	quantityNew: "0",
	trackingCategoryA: undefined,
	trackingCategoryB: undefined,
	comment: "",
};

// Stock Adjustment Addition Line
export type StockAdjustmentAdditionLine = {
	id?: string;
	stockAdjustmentId: string;
	productId: string;
	productName: string;
	batchNumber: string | null;
	expiryDate: string | null;
	quantity: string;
	unitCost: string;
	trackingCategoryAId: string | null;
	trackingCategoryBId: string | null;
	comment: string | null;
};
export type CreateStockAdjustmentAdditionLine = Omit<
	StockAdjustmentAdditionLine,
	"productName" | "stockAdjustmentId"
>;

export type AdditionLineFormValue = {
	id?: string;
	stockAdjustmentId: string;
	product?: SelectOption;
	batchNumber?: string;
	expiryDate?: Date;
	quantity: string;
	unitCost: string;
	trackingCategoryA?: SelectOption;
	trackingCategoryB?: SelectOption;
	comment?: string;
};

export const DefaultAdditionLine: AdditionLineFormValue = {
	stockAdjustmentId: "",
	product: undefined,
	batchNumber: "",
	expiryDate: undefined,
	quantity: "0",
	unitCost: "0",
	trackingCategoryA: undefined,
	trackingCategoryB: undefined,
	comment: "",
};

// Stock Trasfer
export type GetStockTransferResponseType = {
	stockTransfer: {
		id: string;
		status: string;
		stockTransferNumber: string | null;
		organisationId: string;
		sourceWarehouseId: string;
		destinationWarehouseId: string;
		reference: string | null;
		effectiveDate: string;
		destinationWarehouse: {
			id: string;
			name: string;
		};
		sourceWarehouse: {
			id: string;
			name: string;
		};
		lines: StockTransferLine[];
	};
};

export type CreateStockTransferType = {
	sourceWarehouseId: string;
	destinationWarehouseId: string;
	effectiveDate: string;
	reference: string | null;
	lines: CreateStockTransferLine[];
};

export type StockTransferFormValues = {
	sourceLocation: SelectOption;
	destinationLocation: SelectOption;
	effectiveDate: Date;
	reference?: string;
	lines: StockTransferLineFormValue[];
};

// Stock Transfer Line
export type StockTransferLine = {
	id?: string;
	stockTransferId: string;
	productId: string;
	batchNumber: string | null;
	expiryDate: string | null;
	quantity: string;
	onHand: string;
	trackingCategoryAId: string | null;
	trackingCategoryBId: string | null;
	comment: string | null;
	product: {
		id: string;
		name: string;
	};
};

export type CreateStockTransferLine = {
	id?: string;
	productId: string;
	batchNumber: string | null;
	expiryDate: string | null;
	quantity: string;
	trackingCategoryAId: string | null;
	trackingCategoryBId: string | null;
	comment: string | null;
};

export type StockTransferLineFormValue = {
	id?: string;
	stockTransferId?: string;
	product?: SelectOption;
	batchNumber?: SelectOptionOnlyWithName;
	expiryDate?: string;
	onHand: string;
	quantity: string;
	trackingCategoryA?: SelectOption;
	trackingCategoryB?: SelectOption;
	comment?: string;
};

export const DefaultStockTransferLine: StockTransferLineFormValue = {
	product: undefined,
	batchNumber: undefined,
	expiryDate: "",
	onHand: "0",
	quantity: "0",
	trackingCategoryA: undefined,
	trackingCategoryB: undefined,
	comment: "",
};

// Stock Take
export type StockTakeType = {
	id: string;
	status: string;
	stockTakeNumber: string;
	organisationId: string;
	accountId: string;
	effectiveDate: string;
	warehouseId: string;
	reference: string | null;
};

export type GetStockTakeResponseType = {
	stockTake: StockTakeType & {
		additionLines: StockTakeAdditionLine[];
		modificationLines: StockTakeModificationLine[];
		warehouse: {
			id: string;
			name: string;
		};
		account: {
			id: string;
			name: string;
		};
	};
};

export type CreateStockTakeType = {
	effectiveDate: string;
	accountId: string;
	warehouseId: string;
	reference: string | null;
	additionLines?: CreateStockAdjustmentAdditionLine[];
	modificationLines?: CreateStockTakeModificationLine[];
};

export type StockTakeFormValues = {
	effectiveDate: Date;
	account: SelectOption;
	warehouse: SelectOption;
	brand?: SelectOption;
	category?: SelectOption;
	reference?: string;
	additionLines: AdditionStockTakeLineFormValue[];
	modificationLines: ModificationStockTakeLineFormValue[];
};

// Stock Take Modification Lines
export type StockTakeModificationLine = {
	id?: string;
	stockTakeId: string;
	productId: string;
	product: { id: string; name: string };
	batchNumber: string | null;
	expiryDate: string | null;
	quantityOnHand: string;
	quantityNew: string;
	trackingCategoryAId: string | null;
	trackingCategoryBId: string | null;
	comment: string | null;
};

export type CreateStockTakeModificationLine = Omit<StockTakeModificationLine, "product" | "stockTakeId">;

export type ModificationStockTakeLineFormValue = {
	id?: string;
	stockTakeId: string;
	product?: SelectOption;
	batchNumber?: SelectOptionOnlyWithName;
	expiryDate?: string;
	quantityOnHand: string;
	quantityNew: string;
	trackingCategoryA?: SelectOption;
	trackingCategoryB?: SelectOption;
	comment?: string;
};

export const DefaultStockTakeModificationLine: ModificationStockTakeLineFormValue = {
	stockTakeId: "",
	product: undefined,
	batchNumber: undefined,
	expiryDate: "",
	quantityOnHand: "0",
	quantityNew: "0",
	trackingCategoryA: undefined,
	trackingCategoryB: undefined,
	comment: "",
};

// Stock Take Addition Lines
export type StockTakeAdditionLine = {
	id?: string;
	stockTakeId: string;
	productId: string;
	product: { id: string; name: string };
	batchNumber: string | null;
	expiryDate: string | null;
	quantity: string;
	unitCost: string;
	trackingCategoryAId: string | null;
	trackingCategoryBId: string | null;
	comment: string | null;
};

export type AdditionStockTakeLineFormValue = {
	id?: string;
	stockTakeId: string;
	product?: SelectOption;
	batchNumber?: string;
	expiryDate?: Date;
	quantity: string;
	unitCost: string;
	trackingCategoryA?: SelectOption;
	trackingCategoryB?: SelectOption;
	comment?: string;
};

export const DefaultStockTakeAdditionLine: AdditionStockTakeLineFormValue = {
	stockTakeId: "",
	product: undefined,
	batchNumber: "",
	expiryDate: undefined,
	quantity: "0",
	unitCost: "0",
	trackingCategoryA: undefined,
	trackingCategoryB: undefined,
	comment: "",
};

// Helpers
export type GetWarehousesAccountsResponse = {
	warehouses: SelectOption[];
	accounts: SelectOption[];
};

export type ProductNamesResponseType = {
	productId: string;
	productName: string;
	brand: {
		id: string;
		name: string;
		organisationId: string;
	} | null;
	category: {
		id: string;
		name: string;
		organisationId: string;
	} | null;
	availability: {
		batchNumber: string | null;
	}[];
};

export type ProductAvailabilityResponseType = {
	productId: string;
	batchNumber: string;
	expiryDate: string;
	warehouseId: string;
	onHand: string;
	available: string;
};
