import { MeatInvoicingFormValues } from "@/@types/salesOrders/local.ts";
import { Template, UpdateInvoiceType } from "@/@types/salesOrders/api.ts";
import { getFormDayPickerDate } from "@/utils/date.ts";
import { getNormalizedServiceLineData } from "@/pages/Orders/EditOrder/ui/tabs/Quote/utils/getNormalizedDefaultData.ts";
import { getNormalizedMeatQuoteLineData } from "@/pages/Orders/EditOrder/ui/tabs/Quote/utils/getNormalizedMeatData.ts";

export const getNormalizedMeatInvoiceData = (
	data: MeatInvoicingFormValues,
	currencyId: string,
): UpdateInvoiceType => {
	return {
		lines: {
			items: data.lines.map(getNormalizedMeatQuoteLineData),
			type: Template.MEAT,
		},
		serviceLines: data.serviceLines.map(getNormalizedServiceLineData),
		date: getFormDayPickerDate(data.invoiceDate, true),
		dueDate: getFormDayPickerDate(data.dueDate, true),
		currencyId,
	};
};
