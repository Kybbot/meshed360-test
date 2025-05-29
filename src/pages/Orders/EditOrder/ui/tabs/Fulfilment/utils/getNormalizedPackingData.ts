import { PackingFulfilmentFormValues } from "@/@types/salesOrders/local.ts";
import { UpdateFulfillmentPackingType } from "@/@types/salesOrders/api.ts";
import { getFormDayPickerDate } from "@/utils/date.ts";

export const getNormalizedPackingData = (data: PackingFulfilmentFormValues): UpdateFulfillmentPackingType => {
	return {
		requiredBy: getFormDayPickerDate(data.requiredBy, true) || null,
		packerId: data.packer!.id,
		lines: data.lines.map((line) => ({
			productId: line.product!.id,
			quantity: line.quantity,
			packageNumber: line.packingNumber,
		})),
	};
};
