import {
	SaveProductBOMBody,
	ProductBomFormValues,
	GetProductBOMResponseType,
	DefaultProductBOMLineFormValues,
} from "@/@types/products";

export const getNormalizedProductBOMData = (
	formData: ProductBomFormValues,
	isAssembly: boolean,
): SaveProductBOMBody => {
	return {
		...(isAssembly
			? { quantityToProduce: Number(formData.quantityToProduce) }
			: { quantityToDismantle: Number(formData.quantityToDismantle) }),
		lines: formData.lines
			.filter((line) => line.material?.id)
			.map((line) => ({
				materialId: line.material!.id,
				quantity: line.quantity,
				unitCost: line.unitCost,
				...(isAssembly
					? {
							wastageType: +line.wastagePercentage > 0 ? "percentage" : "quantity",
							wastage: +line.wastagePercentage > 0 ? line.wastagePercentage : line.wastageQuantity,
						}
					: {
							disassemblyCostPercentage: line.disassemblyCostPercentage,
						}),
			})),
		serviceLines: formData.serviceLines
			.filter((line) => line.service?.id)
			.map((line) => ({
				serviceId: line.service!.id,
				quantity: line.quantity,
				expenseAccountId: line.expenseAccount!.id,
				unitCost: line.unitCost,
			})),
	};
};

export const denormalizeProductBOMData = (
	bomData: GetProductBOMResponseType,
	isAssembly: boolean,
): ProductBomFormValues => {
	return {
		quantityToProduce: bomData.quantityToProduce.toString(),
		quantityToDismantle: bomData.quantityToDismantle.toString(),
		lines:
			bomData.lines.length > 0
				? bomData.lines.map((line) => ({
						id: line.id,
						material: line.material,
						quantity: line.quantity,
						wastagePercentage: isAssembly && line.wastageType === "percentage" ? line.wastage : "0",
						wastageQuantity: isAssembly && line.wastageType === "quantity" ? line.wastage : "0",
						disassemblyCostPercentage: line.disassemblyCostPercentage,
						unitCost: line.unitCost,
						totalCost: line.totalCost,
					}))
				: [DefaultProductBOMLineFormValues],
		serviceLines: bomData.serviceLines.map((line) => ({
			id: line.id,
			service: line.service,
			quantity: line.quantity,
			expenseAccount: line.expenseAccount,
			unitCost: line.unitCost,
			totalCost: line.totalCost,
		})),
	};
};
