import { WoolworthInvoicingFormValues } from "@/@types/salesOrders/local.ts";
import { Template, UpdateInvoiceType } from "@/@types/salesOrders/api.ts";
import { getFormDayPickerDate } from "@/utils/date.ts";
import { getNormalizedServiceLineData } from "@/pages/Orders/EditOrder/ui/tabs/Quote/utils/getNormalizedDefaultData.ts";
import { getNormalizedWoolworthQuoteLineData } from "@/pages/Orders/EditOrder/ui/tabs/Quote/utils/getNormalizedWoolworthData.ts";

export const getNormalizedWoolworthInvoiceData = (
	data: WoolworthInvoicingFormValues,
	currencyId: string,
): UpdateInvoiceType => {
	return {
		lines: {
			items: data.lines.map(getNormalizedWoolworthQuoteLineData),
			type: Template.WOOLWORTHS,
		},
		serviceLines: data.serviceLines.map(getNormalizedServiceLineData),
		date: getFormDayPickerDate(data.invoiceDate, true),
		dueDate: getFormDayPickerDate(data.dueDate, true),
		currencyId,
	};
};
