import { MeatOrderFormValues, MeatOrderLineType } from "@/@types/salesOrders/local.ts";
import { calculateTotal } from "@/pages/Orders/EditOrder/ui/tabs/Quote/utils/calculate.ts";
import { UpdateOrderLinesType, Template, SalesOrderMeatOrderLine } from "@/@types/salesOrders/api.ts";
import { getNormalizedServiceLineData } from "@/pages/Orders/EditOrder/ui/tabs/Quote/utils/getNormalizedDefaultData.ts";

export const getNormalizedMeatQuoteLineData = (data: MeatOrderLineType): SalesOrderMeatOrderLine => {
	return {
		productId: data.product!.id,
		comment: data.comment || "",
		description: null,
		quantity: data.quantity,
		mass: data.mass!,
		unitPrice: data.unitPrice,
		discount: data.discount || "0",
		accountId: data.account!.id,
		taxRateId: data.taxType!.id,
		margin: "0",
		trackingCategoryAId: data.trackingCategoryA?.id || null,
		trackingCategoryBId: data.trackingCategoryB?.id || null,
		total: calculateTotal(+data.unitPrice, +data.quantity, +data.discount).total,
	};
};

export const getNormalizedMeatQuoteData = (data: MeatOrderFormValues): UpdateOrderLinesType => {
	return {
		lines: {
			items: data.lines.map(getNormalizedMeatQuoteLineData),
			type: Template.MEAT,
		},
		serviceLines: data.serviceLines.map(getNormalizedServiceLineData),
		memo: data.memo ?? "",
	};
};
