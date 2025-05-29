import {
	DefaultOrderFormValues,
	DefaultOrderLineType,
	OrderServiceLineType,
} from "@/@types/salesOrders/local.ts";
import { calculateTotal } from "@/pages/Orders/EditOrder/ui/tabs/Quote/utils/calculate.ts";
import { UpdateOrderLinesType, SalesOrderDefaultOrderLine, Template } from "@/@types/salesOrders/api.ts";

export const getNormalizedQuoteLineData = (data: DefaultOrderLineType): SalesOrderDefaultOrderLine => {
	return {
		productId: data.product!.id,
		comment: data.comment || "",
		quantity: data.quantity,
		unitPrice: data.unitPrice,
		accountId: data.account!.id,
		discount: data.discount || "0",
		taxRateId: data.taxType!.id,
		margin: "0",
		trackingCategoryAId: data.trackingCategoryA?.id || null,
		trackingCategoryBId: data.trackingCategoryB?.id || null,
		total: calculateTotal(+data.unitPrice, +data.quantity, +data.discount).total,
	};
};

export const getNormalizedServiceLineData = (data: OrderServiceLineType) => {
	return {
		productId: data.product!.id,
		comment: data.comment || null,
		quantity: data.quantity,
		unitPrice: data.unitPrice,
		discount: data.discount || "0",
		taxRateId: data.taxType!.id,
		accountId: data.account!.id,
		total: data.total,
	};
};

export const getNormalizedDefaultQuoteData = (data: DefaultOrderFormValues): UpdateOrderLinesType => {
	return {
		lines: {
			items: data.lines.map(getNormalizedQuoteLineData),
			type: Template.DEFAULT,
		},
		serviceLines: data.serviceLines.map(getNormalizedServiceLineData),
		memo: data.memo ?? "",
	};
};
