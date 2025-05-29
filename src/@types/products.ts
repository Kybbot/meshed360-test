import { z } from "zod";

import { WarehousType } from "./warehouses";
import { UnitOfMeasureType } from "./unitsOfMeasure";
import { SelectOption, TaxRateType } from "./selects";

export const types = [
	{ id: "STOCK", name: "Stock" },
	{ id: "SERVICE", name: "Service" },
];

export const typesByKey: Record<string, { id: string; name: string }> = {
	STOCK: { id: "STOCK", name: "Stock" },
	SERVICE: { id: "SERVICE", name: "Service" },
};

export const statuses = [
	{ id: "active", name: "Active" },
	{ id: "inactive", name: "Archived" },
];

export const statusesByKey: Record<string, { id: string; name: string }> = {
	active: { id: "active", name: "Active" },
	inactive: { id: "inactive", name: "Archived" },
};

export const boms = [
	{ id: "NO_BOM", name: "No BOM" },
	{ id: "ASSEMBLY_BOM", name: "Assembly BOM" },
	{ id: "DISASSEMBLY_BOM", name: "Disassembly BOM" },
];

export const bomsByKey: Record<string, { id: string; name: string }> = {
	NO_BOM: { id: "NO_BOM", name: "No BOM" },
	ASSEMBLY_BOM: { id: "ASSEMBLY_BOM", name: "Assembly BOM" },
	DISASSEMBLY_BOM: { id: "DISASSEMBLY_BOM", name: "Disassembly BOM" },
};

export const costingMethods = [
	{ id: "FIFO", name: "FIFO" },
	{ id: "FEFO", name: "FEFO" },
	{ id: "FIFO_BATCH", name: "FIFO Batch" },
	{ id: "FEFO_BATCH", name: "FEFO Batch" },
];

export const costingMethodsByKey: Record<string, { id: string; name: string }> = {
	FIFO: { id: "FIFO", name: "FIFO" },
	FEFO: { id: "FEFO", name: "FEFO" },
	FIFO_BATCH: { id: "FIFO_BATCH", name: "FIFO Batch" },
	FEFO_BATCH: { id: "FEFO_BATCH", name: "FEFO Batch" },
};

export type GetProductSettingsResponseType = {
	unitOfMeasure: {
		id: string;
		name: string;
	}[];
	brand: {
		id: string;
		name: string;
	}[];
	warehouses: {
		id: string;
		name: string;
	}[];
	categories: {
		id: string;
		name: string;
	}[];
	inventoryAccounts: {
		id: string;
		name: string;
	}[];
	expenseAccounts: {
		id: string;
		name: string;
	}[];
	revenueAccounts: {
		id: string;
		name: string;
	}[];
	cogsAccounts: {
		id: string;
		name: string;
	}[];
	purchaseTaxRules: {
		id: string;
		name: string;
	}[];
	saleTaxRules: {
		id: string;
		name: string;
	}[];
};

export type ProductType = {
	id: string;
	sku: string;
	name: string;
	code: string;
	barcode: string;
	type: string;
	bomType: "NO_BOM" | "ASSEMBLY_BOM" | "DISASSEMBLY_BOM";
	supplierSku?: string;
	defaultLocationId?: string;
	defaultWarehouse?: WarehousType;
	costingMethod: "FIFO" | "FEFO" | "FIFO_BATCH" | "FEFO_BATCH";
	category: string;
	brand: string;
	unitOfMeasure?: UnitOfMeasureType;
	status: "active" | "inactive";
	accountMappings: string;
	salesTax: TaxRateType;
	purchaseTax: TaxRateType;
	dimensions?: { lugSize: "s_lugs" | "l_lugs"; calculatedWith: "quantity" | "weight"; quantity: number };
	attachments: string;
	xeroId: string;
	organisationId: string;
	productCost: number;
	serviceAccountMappings: {
		expenseAccount: string;
		revenueAccount: string;
	};
	stockAccountMappings: {
		inventoryAccount: string;
		revenueAccount: string;
	};
};

export type GetAllProductsResponseType = {
	allProducts: ProductType[];
	totalCount: number;
	totalPages: number;
	isSearch: boolean;
};

export type ProductFormValues = {
	sku: string;
	name: string;
	barcode: string;
	type: SelectOption;
	category?: SelectOption;
	brand?: SelectOption;
	unitOfMeasure?: SelectOption;
	status: SelectOption;
	bom?: SelectOption;
	costingMethod: SelectOption;
	defaultLocation?: SelectOption;
	inventoryAccount?: SelectOption;
	expenseAccount?: SelectOption;
	revenueAccount?: SelectOption;
	cogsAccount?: SelectOption;
	purchaseTaxRule?: SelectOption;
	saleTaxRule?: SelectOption;
};

export type CreateProductBody = {
	sku: string;
	name: string;
	barcode: string | null;
	type: string;
	category: string | null;
	brand: string | null;
	unitOfMeasure: string | null;

	isActive: boolean;
	bom?: "NO_BOM" | "ASSEMBLY_BOM" | "DISASSEMBLY_BOM";
	costingMethod?: string | null;
	defaultLocationId?: string | null;

	inventoryAccount?: string | null;
	cogsAccount?: string | null;
	expenseAccount?: string | null;
	revenueAccount: string | null;
	purchaseTaxRule: string | null;
	saleTaxRule: string | null;
};

export type EditProductType = {
	sku: string;
	name: string;
	barcode: string;
	type: string;
	category: SelectOption;
	brand: SelectOption;
	unitOfMeasure: SelectOption;

	isActive: boolean;
	status: string;
	bom: "NO_BOM" | "ASSEMBLY_BOM" | "DISASSEMBLY_BOM";
	costingMethod: string;
	defaultLocation: SelectOption;

	inventoryAccount: SelectOption;
	expenseAccount: SelectOption;
	revenueAccount: SelectOption;
	cogsAccount: SelectOption;
	purchaseTaxRule: SelectOption;
	saleTaxRule: SelectOption;

	dimensions: {
		lugSize?: string;
		length?: number;
		width?: number;
		height?: number;
		weight?: number;
		calculatedWith?: string;
		quantity?: number;
		uom?: string;
		uomWeight?: string;
	} | null;
};

export type GetProductByIdResponseType = EditProductType;

export const BOMValues: Record<string, string> = {
	NO_BOM: "No BOM",
	ASSEMBLY_BOM: "Assembly BOM",
	DISASSEMBLY_BOM: "Disassembly BOM",
};

export const CostingMethodValues: Record<string, string> = {
	FIFO: "FIFO",
	FEFO: "FEFO",
	FIFO_BATCH: "FIFO Batch",
	FEFO_BATCH: "FEFO Batch",
};

// DIMENSIONS
export type UpdateDimensionsBody = Partial<{
	uom: string;
	length: number;
	width: number;
	height: number;
	uomWeight: string;
	weight: number;
	lugSize: string;
	quantity: number;
	calculatedWith: string;
}>;

export const dimensionFormSchema = z
	.object({
		uom: z.string().optional(),
		length: z.number().nonnegative().optional(),
		width: z.number().nonnegative().optional(),
		height: z.number().nonnegative().optional(),
		uomWeight: z.string().optional(),
		weight: z.number().nonnegative().optional(),
		lugSize: z.string().optional(),
		quantity: z.number().nonnegative().optional(),
		calculatedWith: z.string().optional(),
	})
	.superRefine((data, ctx) => {
		// Validation for uom, length, width, height
		const dimensionFields = [data.uom, data.length, data.width, data.height];
		if (dimensionFields.some((field) => !!field)) {
			if (!data.uom) ctx.addIssue({ code: "custom", message: "Required", path: ["uom"] });
			if (!data.length) ctx.addIssue({ code: "custom", message: "Required", path: ["length"] });
			if (!data.width) ctx.addIssue({ code: "custom", message: "Required", path: ["width"] });
			if (!data.height) ctx.addIssue({ code: "custom", message: "Required", path: ["height"] });
		}

		// Validation for uomWeight and weight
		if (data.uomWeight || data.weight) {
			if (!data.uomWeight) ctx.addIssue({ code: "custom", message: "Required", path: ["uomWeight"] });
			if (!data.weight) ctx.addIssue({ code: "custom", message: "Required", path: ["weight"] });
		}

		// Validation for lugSize, quantity, calculatedWith
		const lugFields = [data.lugSize, data.quantity, data.calculatedWith];
		if (lugFields.some((field) => !!field)) {
			if (!data.lugSize) ctx.addIssue({ code: "custom", message: "Required", path: ["lugSize"] });
			if (!data.quantity) ctx.addIssue({ code: "custom", message: "Required", path: ["quantity"] });
			if (!data.calculatedWith)
				ctx.addIssue({ code: "custom", message: "Required", path: ["calculatedWith"] });
		}
	});

export type DimensionFormValues = z.infer<typeof dimensionFormSchema>;

// BOM
export type ProductBOMLine = {
	id: string;
	material: ProductType;
	quantity: string;
	wastageType: "percentage" | "quantity";
	wastage: string;
	unitCost: string;
	disassemblyCostPercentage: string;
	totalCost: string;
};

export type ProductBOMServiceLine = {
	id: string;
	service: ProductType;
	quantity: string;
	expenseAccount: SelectOption;
	unitCost: string;
	totalCost: string;
};

export type GetProductBOMResponseType = {
	quantityToProduce: number;
	quantityToDismantle: number;
	lines: ProductBOMLine[];
	serviceLines: ProductBOMServiceLine[];
};

export type SaveProductBOMBody = {
	quantityToProduce?: number;
	quantityToDismantle?: number;
	lines: {
		materialId: string;
		quantity: string;
		wastageType?: "percentage" | "quantity";
		wastage?: string;
		disassemblyCostPercentage?: string;
		unitCost: string;
	}[];
	serviceLines: {
		serviceId: string;
		quantity: string;
		expenseAccountId: string;
		unitCost: string;
	}[];
};

// BOM Form
export type ProductBomFormValues = {
	quantityToProduce: string;
	quantityToDismantle: string;
	lines: ProductBOMLineFormValues[];
	serviceLines: ProductBOMServiceLineFormValues[];
};

export type ProductBOMLineFormValues = {
	id?: string;
	material?: ProductType;
	quantity: string;
	wastagePercentage: string;
	wastageQuantity: string;
	disassemblyCostPercentage: string;
	unitCost: string;
	totalCost: string;
};
export const DefaultProductBOMLineFormValues: ProductBOMLineFormValues = {
	material: undefined,
	quantity: "0",
	wastagePercentage: "0",
	wastageQuantity: "0",
	disassemblyCostPercentage: "0",
	unitCost: "0",
	totalCost: "0.00",
};

export type ProductBOMServiceLineFormValues = {
	id?: string;
	service?: ProductType;
	quantity: string;
	expenseAccount?: SelectOption;
	unitCost: string;
	totalCost: string;
};

export const DefaultProductBOMServiceLineFormValues: ProductBOMServiceLineFormValues = {
	service: undefined,
	quantity: "0",
	expenseAccount: undefined,
	unitCost: "0",
	totalCost: "0.00",
};
