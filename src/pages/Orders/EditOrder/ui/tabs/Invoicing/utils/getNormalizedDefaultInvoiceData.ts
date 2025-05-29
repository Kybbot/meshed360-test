import { DefaultInvoicingFormValues } from "@/@types/salesOrders/local.ts";
import { Template, UpdateInvoiceType } from "@/@types/salesOrders/api.ts";

import { getFormDayPickerDate } from "@/utils/date.ts";
import {
	getNormalizedQuoteLineData,
	getNormalizedServiceLineData,
} from "@/pages/Orders/EditOrder/ui/tabs/Quote/utils/getNormalizedDefaultData.ts";

export const getNormalizedDefaultInvoiceData = (
	data: DefaultInvoicingFormValues,
	currencyId: string,
): UpdateInvoiceType => {
	return {
		lines: {
			items: data.lines.map(getNormalizedQuoteLineData),
			type: Template.DEFAULT,
		},
		serviceLines: data.serviceLines.map(getNormalizedServiceLineData),
		date: getFormDayPickerDate(data.invoiceDate, true),
		dueDate: getFormDayPickerDate(data.dueDate, true),
		currencyId,
	};
};
