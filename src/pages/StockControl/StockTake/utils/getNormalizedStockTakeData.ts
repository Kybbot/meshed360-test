import { getFormDayPickerDate, parseDateToIso } from "@/utils/date";
import { StockTakeFormValues, CreateStockTakeType, GetStockTakeResponseType } from "@/@types/stockControl";

export const normalizeStockTakeData = (data: StockTakeFormValues): CreateStockTakeType => ({
	accountId: data.account.id,
	warehouseId: data.warehouse.id,
	effectiveDate: getFormDayPickerDate(data.effectiveDate, true),
	reference: data.reference || null,
	additionLines: data.additionLines
		.filter((line) => line.product?.id)
		.map((line) => ({
			id: line.id,
			productId: line.product!.id,
			batchNumber: line.batchNumber === "-" ? null : line.batchNumber || null,
			expiryDate: getFormDayPickerDate(line.expiryDate, true) || null,
			quantity: line.quantity,
			unitCost: line.unitCost,
			trackingCategoryAId: line.trackingCategoryA?.id || null,
			trackingCategoryBId: line.trackingCategoryB?.id || null,
			comment: line.comment || null,
		})),
	modificationLines: data.modificationLines
		.filter((line) => {
			if (!line.product?.id) return false;
			return Number(line.quantityOnHand) !== Number(line.quantityNew);
		})
		.map((line) => ({
			id: line.id,
			productId: line.product!.id,
			batchNumber: line.batchNumber?.name || null,
			expiryDate: parseDateToIso(line.expiryDate) || null,
			quantityOnHand: line.quantityOnHand,
			quantityNew: line.quantityNew,
			trackingCategoryAId: line.trackingCategoryA?.id || null,
			trackingCategoryBId: line.trackingCategoryB?.id || null,
			comment: line.comment || null,
		})),
});

export const denormalizeStockTakeData = (
	data: GetStockTakeResponseType["stockTake"],
	trackingCategoryAOptions: { id: string; name: string }[],
	trackingCategoryBOptions: { id: string; name: string }[],
): StockTakeFormValues => ({
	account: {
		id: data.accountId,
		name: data.account?.name,
	},
	warehouse: {
		id: data.warehouseId,
		name: data.warehouse?.name,
	},
	effectiveDate: new Date(data.effectiveDate),
	reference: data.reference ?? "",
	additionLines: data.additionLines.map((line) => ({
		id: line.id,
		stockTakeId: line.stockTakeId,
		product: { id: line.productId, name: line.product?.name },
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
		stockTakeId: line.stockTakeId,
		product: { id: line.productId, name: line.product?.name },
		batchNumber: line.batchNumber ? { name: line.batchNumber } : undefined,
		expiryDate: line.expiryDate ? getFormDayPickerDate(line.expiryDate) : "",
		quantityOnHand: line.quantityOnHand,
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
