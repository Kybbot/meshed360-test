import { getFormDayPickerDate } from "@/utils/date";

import { EditOrderFormValues } from "@/@types/salesOrders/local.ts";
import { Template, UpdateOrderType } from "@/@types/salesOrders/api.ts";

export const getNormalizedUpdateOrderData = (data: EditOrderFormValues): UpdateOrderType => {
	return {
		customerId: data.customer.id,
		contact: {
			name: data.contact?.name || null,
			email: data.email || null,
			phone: data.phone || null,
		},
		billingAddressLine1: data.billingAddress?.name || null,
		billingAddressLine2: data.billingAddressLine2 || null,
		priceListId: data.priceList.id,
		reference: data.reference || null,
		template: data.template.id as Template,
		paymentTermId: data.paymentTerm.id,
		salesRepId: data.salesRep.id,
		accountId: data.account.id,
		taxRateId: data.taxRate.id,
		taxInclusive: data.taxInclusive,
		currencyId: data.priceList.currencyId,
		skipQuote: data.skipQuote,
		recurringTask: false,
		invoiceOnly: false,
		warehouseId: data.warehouse.id,
		shippingDate: getFormDayPickerDate(data.date, true),
		shippingDueDate: data.dueDate ? getFormDayPickerDate(data.dueDate, true) : null,
		shipToDifferentCompany: data.shipToDifferentCompany,
		shippingAddressLine1: data.shippingAddress?.name || null,
		shippingAddressLine2: data.shippingAddressLine2 || null,
		shippingNotes: data.shippingNotes || null,
		deliveryMethod: data.deliveryMethod || null,
		comment: data.comments || null,
		memo: null,
	};
};
