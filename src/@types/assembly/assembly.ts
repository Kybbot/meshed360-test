import { ProductType } from "../products";
import { SelectOption } from "../selects";
import { WarehousType } from "../warehouses";
import { UnitOfMeasureType } from "../unitsOfMeasure";

export type AssemblyStatus = "DRAFT" | "CLOSED" | "AUTHORISED" | "PICKING" | "PICKED";

export const AssemblyStatuses: Record<string, string> = {
	DRAFT: "Draft",
	CLOSED: "Closed",
	PICKED: "Picked",
	PICKING: "Picking",
	AUTHORISED: "Authorised",
};

// ASSEMBLY LIST
export type AssemblyListType = {
	id: string;
	assemblyNumber?: string;
	batchNumber?: string;
	expiryDate?: string;
	product: {
		id: string;
		name: string;
		sku: string;
	};
	quantity: string;
	warehouse: SelectOption;
	date: string;
	status: AssemblyStatus;
	totalCost: string;
	notes?: string;
};

export type GetAllAssembliesListResponseType = {
	items: AssemblyListType[];
	totalCount: number;
	totalPages: number;
};

// ASSEMBLY PRODUCT
type AssemblyProductLines = {
	id: string;
	material: ProductType;
	uom: UnitOfMeasureType;
	wastageType: "percentage" | "quantity";
	wastage: string;
	totalCost: string;
	quantity: string;
	unitCost: string;
	available: string;
};

type AssemblyProductServices = {
	id: string;
	quantity: string;
	unitCost: string;
	totalCost: string;
	service: ProductType;
	expenseAccount: SelectOption;
};

export type AssemblyProductType = {
	productSku: string;
	productName: string;
	productBom: string;
	defaultLocation: SelectOption;
	maxQuantity: string;
	workInProgressAccounts: SelectOption[];
	finishedGoodsAccounts: SelectOption[];
	bom: {
		lines: AssemblyProductLines[];
		serviceLines: AssemblyProductServices[];
	};
};

export type GetAssemblyProductResponseType = AssemblyProductType;

// ASSEMBLY BY ID
type AssemblyLines = {
	id: string;
	product: ProductType;
	uom: UnitOfMeasureType;
	quantity: string;
	unitCost: string;
	wastageType: "percentage" | "quantity";
	wastage: string;
	totalCost: string;
	available: number;
	totalQuantity: string;
};

type AssemblyServices = {
	id: string;
	product: ProductType;
	expenseAccount: SelectOption;
	quantity: string;
	unitCost: string;
	totalCost: string;
};

export type AssemblyByIdType = {
	id: string;
	status: AssemblyStatus;
	assemblyNumber: string | null;
	product: {
		id: string;
		name: string;
		sku: string;
	};
	warehouse: WarehousType;
	workInProgressAccount: SelectOption;
	finishedGoodsAccount: SelectOption;
	quantity: string;
	maxQuantity: string;
	workInProgressDate: string;
	completionDate: string;
	comments: string;
	lines: AssemblyLines[];
	serviceLines: AssemblyServices[];
};

export type GetAssemblyByIdResponseType = AssemblyByIdType;

// ASSEMBLY FORM
export type AssemblyLineFormType = {
	lineId?: string;
	product?: ProductType;
	quantity: string;
	unitOfMeasure?: UnitOfMeasureType;
	wastagePercentage: string;
	wastageQuantity: string;
	unitCost: string;
	available: string;
	total: string;
};

export type AssemblyServiceFormType = {
	lineId?: string;
	product?: ProductType;
	quantity: string;
	expenseAccount?: SelectOption;
	unitCost: string;
	total: string;
};

export type AssemblyFormValues = {
	product: SelectOption;
	productName: string;
	warehouse: SelectOption;
	workInProgressAccount?: SelectOption;
	finishedGoodsAccount?: SelectOption;
	quantity: string;
	maxQuantity: string;
	workInProgressDate?: Date;
	completionDate?: Date;
	comments?: string;
	lines: AssemblyLineFormType[];
	serviceLines: AssemblyServiceFormType[];
};

export const DefaultAssemblyLine: AssemblyLineFormType = {
	product: undefined,
	quantity: "",
	unitOfMeasure: undefined,
	wastagePercentage: "0",
	wastageQuantity: "0",
	unitCost: "",
	available: "",
	total: "",
};

export const DefaultAssemblyService: AssemblyServiceFormType = {
	product: undefined,
	quantity: "",
	expenseAccount: undefined,
	unitCost: "",
	total: "",
};

// CREATE/UPDATE ASSEMBLY
export type CreateAssemblyBodyType = {
	organisationId: string;
	productId: string;
	warehouseId: string;
	workInProgressAccountId: string;
	finishedGoodsAccountId: string;
	quantity: string;
	workInProgressDate?: string;
	completionDate?: string;
	comments?: string;
	lines: {
		id?: string;
		productId: string;
		quantity: string;
		wastageType: "percentage" | "quantity";
		wastage: string;
	}[];
	serviceLines: {
		id?: string;
		productId: string;
		quantity: string;
		expenseAccountId: string;
		unitCost: string;
	}[];
};

export type UpdateAssemblyBodyType = { id: string } & Omit<CreateAssemblyBodyType, "organisationId">;

export type CreateAssemblyResponseType = {
	order: {
		id: string;
		status: AssemblyStatus;
	};
};

// ASSEMBLY RESPONSES
export type AuthoriseAssemblyOrderResponseType = {
	status: AssemblyStatus;
	assemblyNumber: string;
};

export type UndoAssemblyOrderResponseType = {
	status: AssemblyStatus;
};

export type VoidAssemblyOrderResponseType = {
	status: AssemblyStatus;
};
