import {
	OrderLineFormType,
	OrderLinesFormValues,
	AdditionalLineFormType,
	CreatePurchaseOrderLinesBodyType,
} from "@/@types/purchaseOrder/orderLines";
import { GetAdditionalLineType, GetOrderLineType } from "@/@types/purchaseOrder/order";

const getNormalizedQuoteLineData = (data: OrderLineFormType) => {
	const product = data.product!;
	const uom = data.unitOfMeasure;
	const taxType = data.taxType!;

	return {
		...(data.id ? { id: data.id } : {}),
		productId: product.id,
		...(data.comment ? { comment: data.comment } : {}),
		supplierSku: data.supplierSku,
		...(uom ? { uomId: uom.id } : {}),
		quantity: data.quantity.toString(),
		unitPrice: data.unitPrice.toString(),
		discount: data.discount.toString() || "0",
		taxRateId: taxType.id,
		...(data.trackingCategory1 ? { trackingCategory1Id: data.trackingCategory1.id } : {}),
		...(data.trackingCategory2 ? { trackingCategory2Id: data.trackingCategory2.id } : {}),
	};
};

const getNormalizedServiceLineData = (data: AdditionalLineFormType) => {
	const product = data.product!;
	const taxType = data.taxType!;

	return {
		...(data.id ? { id: data.id } : {}),
		...(product.id ? { productId: product.id } : { description: product.name }),
		reference: data.reference,
		quantity: data.quantity.toString(),
		unitPrice: data.unitPrice.toString(),
		discount: data.discount.toString() || "0",
		addToLandedCost: data.addToLandedCost,
		taxRateId: taxType.id,
		...(data.trackingCategory1 ? { trackingCategory1Id: data.trackingCategory1.id } : {}),
		...(data.trackingCategory2 ? { trackingCategory2Id: data.trackingCategory2.id } : {}),
	};
};

export const getNormalizedOrderData = (
	data: OrderLinesFormValues,
	orderId: string,
): CreatePurchaseOrderLinesBodyType => {
	return {
		id: orderId,
		orderLines: data.orderLines.map(getNormalizedQuoteLineData),
		additionalLines: data.additionalLines.map(getNormalizedServiceLineData),
		memo: data.memo ?? "",
	};
};

export const getNormalizedOrderLinesData = (
	data: OrderLineFormType[],
	newArr: { id: string }[],
): GetOrderLineType[] => {
	return data.map((item, index) => {
		const product = item.product!;
		const uom = item.unitOfMeasure!;
		const taxType = item.taxType!;

		return {
			id: item.id || newArr[index].id,
			product: product,
			comment: item.comment,
			supplierSku: item.supplierSku,
			unitOfMeasure: uom,
			quantity: item.quantity,
			unitPrice: item.unitPrice,
			discount: item.discount || "0",
			taxType: taxType,
			trackingCategory1: item.trackingCategory1,
			trackingCategory2: item.trackingCategory2,
			total: item.total,
		};
	});
};

export const getNormalizedAdditionalLinesData = (
	data: AdditionalLineFormType[],
	newArr: { id: string }[],
): GetAdditionalLineType[] => {
	return data.map((item, index) => {
		const product = item.product!;
		const taxType = item.taxType!;

		return {
			id: item.id || newArr[index].id,
			product: product,
			reference: item.reference,
			quantity: item.quantity,
			unitPrice: item.unitPrice,
			discount: item.discount || "0",
			addToLandedCost: item.addToLandedCost,
			taxType: taxType,
			trackingCategory1: item.trackingCategory1,
			trackingCategory2: item.trackingCategory2,
		};
	});
};
