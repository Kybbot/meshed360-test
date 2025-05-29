import { PickingFulfilmentFormValues } from "@/@types/salesOrders/local.ts";
import { UpdateFulfillmentPickingType } from "@/@types/salesOrders/api.ts";
import { getFormDayPickerDate } from "@/utils/date.ts";

export const getNormalizedPickingData = (data: PickingFulfilmentFormValues): UpdateFulfillmentPickingType => {
	return {
		requiredBy: getFormDayPickerDate(data.requiredBy, true) || null,
		pickerId: data.picker!.id,
		lines: data.lines.map((line) => ({
			productId: line.product!.id,
			batchNumber: line.batch?.id || null,
			expiryDate: line.expiryDate,
			quantity: line.quantity,
			warehouseId: line.location!.id,
		})),
	};
};
