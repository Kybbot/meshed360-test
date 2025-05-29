import { getFormDayPickerDate } from "@/utils/date";

import { OrderFormValues } from "@/@types/salesOrders/local.ts";
import { CreateOrderType, SalesOrderOrderLine, Template } from "@/@types/salesOrders/api.ts";
import {
	calculateTotal,
	calculateWoolworthTotal,
} from "@/pages/Orders/EditOrder/ui/tabs/Quote/utils/calculate.ts";

export const getNormalizedOrderData = (data: OrderFormValues): CreateOrderType => {
	let quoteLines: SalesOrderOrderLine[] = [];

	if (!data.skipQuote) {
		switch (data.template.id) {
			case Template.DEFAULT:
				quoteLines = data.defaultQuoteLines.map((line) => ({
					productId: line.product!.id,
					comment: line.comment || "",
					quantity: line.quantity,
					unitPrice: line.unitPrice,
					accountId: line.account!.id,
					discount: line.discount || "0",
					taxRateId: line.taxType!.id,
					margin: "0",
					trackingCategoryAId: line.trackingCategoryA?.id || null,
					trackingCategoryBId: line.trackingCategoryB?.id || null,
					total: calculateTotal(+line.unitPrice, +line.quantity, +line.discount).total,
				}));
				break;
			case Template.MEAT:
				quoteLines = data.meatQuoteLines.map((line) => ({
					productId: line.product!.id,
					comment: line.comment || "",
					description: null,
					quantity: line.quantity,
					mass: line.mass!,
					unitPrice: line.unitPrice,
					discount: line.discount || "0",
					accountId: line.account!.id,
					taxRateId: line.taxType!.id,
					margin: "0",
					trackingCategoryAId: line.trackingCategoryA?.id || null,
					trackingCategoryBId: line.trackingCategoryB?.id || null,
					total: calculateTotal(+line.unitPrice, +line.quantity, +line.discount).total,
				}));
				break;
			case Template.WOOLWORTHS:
				quoteLines = data.woolworthsQuoteLines.map((line) => ({
					productId: line.product!.id,
					comment: line.comment || "",
					description: null,
					quantity: line.quantity,
					lLugs: line.lLugs ? +line.lLugs : null,
					sLugs: line.sLugs ? +line.sLugs : null,
					mass: line.mass!,
					unitPrice: line.unitPrice,
					packOrder: line.packOrder,
					discount: line.discount || "0",
					accountId: line.account!.id,
					taxRateId: line.taxType!.id,
					margin: "0",
					trackingCategoryAId: line.trackingCategoryA?.id || null,
					trackingCategoryBId: line.trackingCategoryB?.id || null,
					total:
						line.product?.dimensions?.calculatedWith === "quantity"
							? calculateWoolworthTotal(+line.unitPrice, +line.quantity, +line.discount).total
							: calculateWoolworthTotal(+line.unitPrice, NaN, +line.discount, +line.mass).total,
				}));
				break;
		}
	}

	return {
		salesOrder: {
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
			lines: {
				type: data.template.id as Template,
				items: [],
			},
			serviceLines: [],
		},
		quote: !data.skipQuote
			? {
					lines: {
						type: data.template.id as Template,
						items: quoteLines,
					},
					serviceLines: data.serviceLines.map((line) => ({
						productId: line.product!.id,
						comment: line.comment || null,
						quantity: line.quantity,
						unitPrice: line.unitPrice,
						discount: line.discount || "0",
						taxRateId: line.taxType!.id,
						accountId: line.account!.id,
						total: line.total,
					})),
					memo: data.memo,
				}
			: undefined,
	};
};
