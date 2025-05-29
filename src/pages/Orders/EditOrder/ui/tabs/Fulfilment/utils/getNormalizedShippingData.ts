import { ShippingFulfilmentFormValues } from "@/@types/salesOrders/local.ts";
import { UpdateFulfillmentShippingType } from "@/@types/salesOrders/api.ts";
import { getFormDayPickerDate } from "@/utils/date.ts";

export const getNormalizedShippingData = (
	data: ShippingFulfilmentFormValues,
): UpdateFulfillmentShippingType => {
	return {
		lines: data.lines.map((line) => ({
			shipDate: getFormDayPickerDate(line.shipDate, true),
			carrierId: line.carrier?.id,
			waybillNumber: line.waybillNumber,
			trackingLink: line.trackingLink,
			packageNumber: line.packageNumber,
		})),
	};
};
