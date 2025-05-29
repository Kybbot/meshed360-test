import { WoolworthOrderFormValues, WoolworthsOrderLineType } from "@/@types/salesOrders/local.ts";
import { calculateWoolworthTotal } from "@/pages/Orders/EditOrder/ui/tabs/Quote/utils/calculate.ts";
import { UpdateOrderLinesType, Template, SalesOrderWoolworthsOrderLine } from "@/@types/salesOrders/api.ts";
import { getNormalizedServiceLineData } from "@/pages/Orders/EditOrder/ui/tabs/Quote/utils/getNormalizedDefaultData.ts";

export const getNormalizedWoolworthQuoteLineData = (
	data: WoolworthsOrderLineType,
): SalesOrderWoolworthsOrderLine => {
	return {
		productId: data.product!.id,
		comment: data.comment || "",
		description: null,
		quantity: data.quantity,
		lLugs: data.lLugs ? +data.lLugs : null,
		sLugs: data.sLugs ? +data.sLugs : null,
		mass: data.mass!,
		unitPrice: data.unitPrice,
		packOrder: data.packOrder,
		discount: data.discount || "0",
		accountId: data.account!.id,
		taxRateId: data.taxType!.id,
		margin: "0",
		trackingCategoryAId: data.trackingCategoryA?.id || null,
		trackingCategoryBId: data.trackingCategoryB?.id || null,
		total:
			data.product?.dimensions?.calculatedWith === "quantity"
				? calculateWoolworthTotal(+data.unitPrice, +data.quantity, +data.discount).total
				: calculateWoolworthTotal(+data.unitPrice, NaN, +data.discount, +data.mass).total,
	};
};

export const getNormalizedWoolworthQuoteData = (data: WoolworthOrderFormValues): UpdateOrderLinesType => {
	return {
		lines: {
			items: data.lines.map(getNormalizedWoolworthQuoteLineData),
			type: Template.WOOLWORTHS,
		},
		serviceLines: data.serviceLines.map(getNormalizedServiceLineData),
		memo: data.memo ?? "",
	};
};
