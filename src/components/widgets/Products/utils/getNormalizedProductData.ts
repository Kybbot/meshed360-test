import { CreateProductBody, ProductFormValues } from "@/@types/products";

export const getNormalizedProductData = (data: ProductFormValues): CreateProductBody => {
	const isStock = data.type.id === "STOCK";

	if (isStock) {
		return {
			sku: data.sku,
			name: data.name,
			barcode: data.barcode || null,
			type: data.type.id,
			category: data.category?.id || null,
			brand: data.brand?.id || null,
			unitOfMeasure: data.unitOfMeasure?.id || null,
			isActive: data.status.id === "active",
			bom: data.bom?.id as "NO_BOM" | "ASSEMBLY_BOM" | "DISASSEMBLY_BOM",
			costingMethod: data.costingMethod.id,
			defaultLocationId: data.defaultLocation?.id || null,
			inventoryAccount: data.inventoryAccount?.id || null,
			revenueAccount: data.revenueAccount?.id || null,
			cogsAccount: data.cogsAccount?.id || null,
			purchaseTaxRule: data.purchaseTaxRule?.id || null,
			saleTaxRule: data.saleTaxRule?.id || null,
		};
	} else {
		return {
			sku: data.sku,
			name: data.name,
			barcode: data.barcode || null,
			type: data.type.id,
			category: data.category?.id || null,
			brand: data.brand?.id || null,
			unitOfMeasure: data.unitOfMeasure?.id || null,
			isActive: data.status.id === "active",
			expenseAccount: data.expenseAccount?.id || null,
			revenueAccount: data.revenueAccount?.id || null,
			purchaseTaxRule: data.purchaseTaxRule?.id || null,
			saleTaxRule: data.saleTaxRule?.id || null,
		};
	}
};
