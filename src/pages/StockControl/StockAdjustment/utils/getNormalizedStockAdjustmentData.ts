import {
	StockAdjustmentFormValues,
	CreateStockAdjustmentType,
	GetStockAdjustmentResponseType,
} from "@/@types/stockControl";

import { getFormDayPickerDate, parseDateToIso } from "@/utils/date";

export const normalizeStockAdjustmentData = (data: StockAdjustmentFormValues): CreateStockAdjustmentType => ({
	effectiveDate: getFormDayPickerDate(data.effectiveDate, true),
	accountId: data.account.id,
	warehouseId: data.warehouse.id,
	reference: data.reference || null,
	additionLines: data.additionLines
		.filter((line) => line.product?.id)
		.map((line) => ({
			id: line.id,
			productId: line.product!.id,
			batchNumber: line.batchNumber || null,
			expiryDate: getFormDayPickerDate(line.expiryDate, true) || null,
			quantity: line.quantity,
			unitCost: line.unitCost,
			trackingCategoryAId: line.trackingCategoryA?.id || null,
			trackingCategoryBId: line.trackingCategoryB?.id || null,
			comment: line.comment || null,
		})),
	modificationLines: data.modificationLines
		.filter((line) => line.product?.id)
		.map((line) => ({
			id: line.id,
			productId: line.product!.id,
			batchNumber: line.batchNumber?.name || null,
			expiryDate: parseDateToIso(line.expiryDate) || null,
			quantityOnHand: line.quantityOnHand,
			quantityAvailable: line.quantityAvailable,
			quantityNew: line.quantityNew,
			trackingCategoryAId: line.trackingCategoryA?.id || null,
			trackingCategoryBId: line.trackingCategoryB?.id || null,
			comment: line.comment || null,
		})),
});

export const denormalizeStockAdjustmentData = (
	data: GetStockAdjustmentResponseType["stockAdjustment"],
	trackingCategoryAOptions: { id: string; name: string }[],
	trackingCategoryBOptions: { id: string; name: string }[],
): StockAdjustmentFormValues => ({
	effectiveDate: new Date(data.effectiveDate),
	account: data.account,
	warehouse: data.warehouse,
	reference: data.reference ?? "",
	additionLines: data.additionLines.map((line) => ({
		id: line.id,
		stockAdjustmentId: line.stockAdjustmentId,
		product: { id: line.productId, name: line.productName },
		batchNumber: line.batchNumber ?? "",
		expiryDate: line.expiryDate ? new Date(line.expiryDate) : undefined,
		quantity: line.quantity,
		unitCost: line.unitCost,
		trackingCategoryA: line.trackingCategoryAId
			? {
					id: line.trackingCategoryAId,
					name: trackingCategoryAOptions.find((c) => c.id === line.trackingCategoryAId)?.name ?? "",
				}
			: undefined,
		trackingCategoryB: line.trackingCategoryBId
			? {
					id: line.trackingCategoryBId,
					name: trackingCategoryBOptions.find((c) => c.id === line.trackingCategoryBId)?.name ?? "",
				}
			: undefined,
		comment: line.comment ?? "",
	})),
	modificationLines: data.modificationLines.map((line) => ({
		id: line.id,
		stockAdjustmentId: line.stockAdjustmentId,
		product: { id: line.productId, name: line.productName },
		batchNumber: line.batchNumber ? { name: line.batchNumber } : undefined,
		expiryDate: line.expiryDate ? getFormDayPickerDate(line.expiryDate) : "",
		quantityOnHand: line.quantityOnHand,
		quantityAvailable: line.quantityAvailable,
		quantityNew: line.quantityNew,
		trackingCategoryA: line.trackingCategoryAId
			? {
					id: line.trackingCategoryAId,
					name: trackingCategoryAOptions.find((c) => c.id === line.trackingCategoryAId)?.name ?? "",
				}
			: undefined,
		trackingCategoryB: line.trackingCategoryBId
			? {
					id: line.trackingCategoryBId,
					name: trackingCategoryBOptions.find((c) => c.id === line.trackingCategoryBId)?.name ?? "",
				}
			: undefined,
		comment: line.comment ?? "",
	})),
});
