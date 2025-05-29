import { getDateFromDayPickerDate, getFormDayPickerDate } from "@/utils/date";

import {
	AssemblyByIdType,
	AssemblyFormValues,
	AssemblyProductType,
	DefaultAssemblyLine,
	CreateAssemblyBodyType,
} from "@/@types/assembly/assembly";
import { SelectOption } from "@/@types/selects";

export const getNormalizedAssemblyData = (
	data: AssemblyFormValues,
): Omit<CreateAssemblyBodyType, "organisationId"> => {
	const warehouse = data.warehouse!;
	const workInProgressAccount = data.workInProgressAccount!;
	const finishedGoodsAccount = data.finishedGoodsAccount!;

	return {
		productId: data.product.id,
		warehouseId: warehouse.id,
		workInProgressAccountId: workInProgressAccount.id,
		finishedGoodsAccountId: finishedGoodsAccount.id,
		quantity: data.quantity,
		...(data.workInProgressDate
			? { workInProgressDate: getFormDayPickerDate(data.workInProgressDate, true) }
			: {}),
		...(data.completionDate ? { completionDate: getFormDayPickerDate(data.completionDate, true) } : {}),
		...(data.comments ? { comments: data.comments } : {}),
		lines: data.lines.map((item) => {
			const product = item.product!;

			const wastageType = +item.wastagePercentage > 0 ? "percentage" : "quantity";
			const wastage = +item.wastagePercentage > 0 ? item.wastagePercentage : item.wastageQuantity;

			return {
				...(item.lineId ? { id: item.lineId } : {}),
				productId: product.id,
				quantity: item.quantity,
				wastageType,
				wastage,
			};
		}),
		serviceLines: data.serviceLines.map((item) => {
			const product = item.product!;
			const expenseAccount = item.expenseAccount!;

			return {
				...(item.lineId ? { id: item.lineId } : {}),
				productId: product.id,
				quantity: item.quantity,
				expenseAccountId: expenseAccount.id,
				unitCost: item.unitCost,
			};
		}),
	};
};

export const getNormalizedResetAssemblyData = (assemblyData: AssemblyByIdType): AssemblyFormValues => {
	return {
		product: { id: assemblyData.product.id, name: assemblyData.product.sku },
		productName: assemblyData.product.name,
		warehouse: assemblyData.warehouse,
		workInProgressAccount: assemblyData.workInProgressAccount,
		finishedGoodsAccount: assemblyData.finishedGoodsAccount,
		quantity: assemblyData.quantity,
		maxQuantity: assemblyData.maxQuantity,
		workInProgressDate: getDateFromDayPickerDate(assemblyData.workInProgressDate),
		completionDate: getDateFromDayPickerDate(assemblyData.completionDate),
		comments: assemblyData.comments,
		lines: assemblyData.lines.map((item) => ({
			lineId: item.id,
			product: item.product,
			quantity: item.quantity,
			unitOfMeasure: item.uom,
			unitCost: item.unitCost,
			wastagePercentage: item.wastageType === "percentage" ? item.wastage : "0",
			wastageQuantity: item.wastageType === "quantity" ? item.wastage : "0",
			available: item.available.toString(),
			total: "",
		})),
		serviceLines: assemblyData.serviceLines.map((item) => ({
			lineId: item.id,
			product: item.product,
			quantity: item.quantity,
			expenseAccount: item.expenseAccount,
			unitCost: item.unitCost,
			total: "",
		})),
	};
};

export const getNormalizedResetAssemblyProduct = (
	product: SelectOption,
	assemblyProduct: AssemblyProductType,
): AssemblyFormValues => {
	return {
		product: { id: product?.id, name: assemblyProduct.productSku },
		productName: assemblyProduct.productName,
		warehouse: assemblyProduct.defaultLocation || undefined,
		workInProgressAccount: undefined,
		finishedGoodsAccount: undefined,
		quantity: "",
		maxQuantity: assemblyProduct.maxQuantity,
		workInProgressDate: undefined,
		completionDate: undefined,
		comments: "",
		lines:
			assemblyProduct.bom.lines.length > 0
				? assemblyProduct.bom.lines.map((item) => ({
						product: item.material,
						quantity: item.quantity,
						unitOfMeasure: item.uom,
						unitCost: item.unitCost,
						wastagePercentage: item.wastageType === "percentage" ? item.wastage : "0",
						wastageQuantity: item.wastageType === "quantity" ? item.wastage : "0",
						available: item.available,
						total: "",
					}))
				: [DefaultAssemblyLine],
		serviceLines:
			assemblyProduct.bom.serviceLines.length > 0
				? assemblyProduct.bom.serviceLines.map((item) => ({
						product: item.service,
						quantity: item.quantity,
						expenseAccount: item.expenseAccount,
						unitCost: item.unitCost,
						total: "",
					}))
				: [],
	};
};
