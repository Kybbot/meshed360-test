import { getFormDayPickerDate, parseDateToIso } from "@/utils/date";
import {
	StockTransferFormValues,
	CreateStockTransferType,
	GetStockTransferResponseType,
} from "@/@types/stockControl";

export const normalizeStockTransferData = (data: StockTransferFormValues): CreateStockTransferType => ({
	sourceWarehouseId: data.sourceLocation.id,
	destinationWarehouseId: data.destinationLocation.id,
	effectiveDate: getFormDayPickerDate(data.effectiveDate, true),
	reference: data.reference || null,
	lines: data.lines
		.filter((line) => line.product?.id)
		.map((line) => ({
			id: line.id,
			productId: line.product!.id,
			batchNumber: line.batchNumber?.name || null,
			expiryDate: parseDateToIso(line.expiryDate) || null,
			quantity: line.quantity,
			trackingCategoryAId: line.trackingCategoryA?.id || null,
			trackingCategoryBId: line.trackingCategoryB?.id || null,
			comment: line.comment || null,
		})),
});

export const denormalizeStockTransferData = (
	data: GetStockTransferResponseType["stockTransfer"],
	trackingCategoryAOptions: { id: string; name: string }[],
	trackingCategoryBOptions: { id: string; name: string }[],
): StockTransferFormValues => ({
	sourceLocation: {
		id: data.sourceWarehouseId,
		name: data.sourceWarehouse?.name,
	},
	destinationLocation: {
		id: data.destinationWarehouseId,
		name: data.destinationWarehouse?.name,
	},
	effectiveDate: new Date(data.effectiveDate),
	reference: data.reference ?? "",
	lines: data.lines.map((line) => ({
		id: line.id,
		stockTransferId: line.stockTransferId,
		product: {
			id: line.productId,
			name: line.product?.name,
		},
		batchNumber: line.batchNumber ? { name: line.batchNumber } : undefined,
		expiryDate: line.expiryDate ? getFormDayPickerDate(line.expiryDate) : "",
		quantity: line.quantity,
		onHand: line.onHand,
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
