import {
	BillType,
	BillFormValues,
	CreateBillLine,
	CreateBillType,
	BillLineFormType,
	CreateAdditionalCost,
	BillAdditionalCostFormType,
} from "@/@types/purchaseOrders";
import { ProductType } from "@/@types/products";
import { ReceivingType } from "@/@types/purchaseOrder/receiving";
import { GetPurchaseOrderByIdResponseType } from "@/@types/purchaseOrder/order";

import { getDateFromDayPickerDate, getFormDayPickerDate } from "@/utils/date";

export const getNormalizedResetData = (data: BillType): BillFormValues => {
	return {
		billNumber: data.billNumber,
		billDate: getDateFromDayPickerDate(data.billDate) || new Date(),
		dueDate: getDateFromDayPickerDate(data.dueDate) || new Date(),
		lines: data.lines.map((item) => ({
			...item,
			lineId: item.id,
			product: {
				id: item.orderLineId,
				quantity: +item.quantity,
				supplierSku: item.supplierSku,
				product: item.product,
			},
			blindProduct: item.product,
		})),

		serviceLines: data.serviceLines.map((item) => ({
			...item,
			lineId: item.id,
			...(item.description
				? { product: { id: "", name: item.description } as ProductType }
				: { product: item.product }),
		})),
	};
};

export const getNormalizedCopyReceivingData = (
	data: ReceivingType,
	orderData: GetPurchaseOrderByIdResponseType,
	orderLines: BillLineFormType[],
	receivingLinesQuantity: Record<string, number> | null,
) => {
	// FORM VALUES
	const formBills = Object.values(
		data.lines.reduce(
			(acc, item) => {
				const currentOrderLine = orderData.orderLines.find((line) => line.id === item.orderLineId)!;

				acc[item.orderLineId] = acc[item.orderLineId]
					? {
							...acc[item.orderLineId],
							quantity: ((+acc[item.orderLineId].quantity || 0) + +item.quantity).toString(),
							product: {
								id: item.orderLineId,
								product: item.product,
								quantity: +(acc[item.orderLineId].product?.quantity || 0) + +item.quantity,
								supplierSku: item.supplierSku,
							},
						}
					: {
							lineId: "",
							orderLineId: item.orderLineId,
							product: {
								id: item.orderLineId,
								product: item.product,
								quantity: item.quantity,
								supplierSku: item.supplierSku,
							},
							comment: currentOrderLine.comment,
							supplierSku: item.supplierSku,
							quantity: item.quantity.toString(),
							unitPrice: currentOrderLine.unitPrice,
							discount: currentOrderLine.discount,
							taxRate: currentOrderLine.taxType || orderData.taxRule,
							account: orderData.inventoryAccount || undefined,
							trackingCategory1: currentOrderLine.trackingCategory1,
							trackingCategory2: currentOrderLine.trackingCategory2,
							total: "",
						};

				return acc;
			},
			{} as { [key: string]: BillLineFormType },
		),
	);

	const combinedArr2 = [...orderLines, ...formBills];

	const billFormLines = Object.values(
		combinedArr2.reduce<{ [key: string]: BillLineFormType }>((acc, item) => {
			acc[item.orderLineId] = acc[item.orderLineId]
				? { ...item, quantity: (+acc[item.orderLineId].quantity + +item.quantity).toString() }
				: { ...item };

			return acc;
		}, {}),
	).map((item) => {
		const product = item.product!;

		return {
			...item,
			quantity: receivingLinesQuantity?.[item.orderLineId]?.toString() || "0",
			product: { ...product, quantity: receivingLinesQuantity?.[item.orderLineId] || 0 },
		};
	});

	return { billFormLines };
};

export const getNormalizedCopyData = (
	data: GetPurchaseOrderByIdResponseType,
	billListQuantity: {
		[key: string]: {
			quantity: number;
			receivingIds: string[];
		};
	},
): { lines: BillLineFormType[]; serviceLines: BillAdditionalCostFormType[] } => {
	return {
		lines: data.orderLines.map((item) => {
			const usedQuantity =
				(Object.keys(billListQuantity).length > 0 &&
					billListQuantity[item.id] &&
					billListQuantity[item.id]?.quantity) ||
				0;

			return {
				lineId: "",
				orderLineId: item.id,
				product: {
					id: item.id,
					quantity: +item.quantity,
					product: item.product,
				},
				comment: item.comment,
				supplierSku: item.supplierSku,
				quantity: Math.max(+item.quantity - usedQuantity, 0).toString(),
				unitPrice: item.unitPrice,
				discount: item.discount,
				taxRate: item.taxType,
				account: data.inventoryAccount || undefined,
				trackingCategory1: item.trackingCategory1,
				trackingCategory2: item.trackingCategory2,
				total: "",
			};
		}),
		serviceLines: data.additionalLines.map((item) => ({
			lineId: "",
			...(item.description
				? { product: { id: "", name: item.description } as ProductType }
				: { product: item.product }),
			comment: item.reference,
			quantity: item.quantity,
			unitPrice: item.unitPrice,
			discount: item.discount,
			taxRate: item.taxType,
			addToLandedCost: item.addToLandedCost,
			account: data.inventoryAccount || undefined,
			trackingCategory1: item.trackingCategory1,
			trackingCategory2: item.trackingCategory2,
			total: "",
			allocation: [],
		})),
	};
};

export const getNormalizedCopyServiceLinesData = (
	data: GetPurchaseOrderByIdResponseType,
): BillAdditionalCostFormType[] => {
	return data.additionalLines.map((item) => ({
		lineId: "",
		...(item.description
			? { product: { id: "", name: item.description } as ProductType }
			: { product: item.product }),
		comment: item.reference,
		quantity: item.quantity,
		unitPrice: item.unitPrice,
		discount: item.discount,
		taxRate: item.taxType,
		addToLandedCost: item.addToLandedCost,
		account: data.inventoryAccount || undefined,
		trackingCategory1: item.trackingCategory1,
		trackingCategory2: item.trackingCategory2,
		total: "",
		allocation: [],
	}));
};

const getNormalizedCreateLinesData = (data: BillLineFormType): CreateBillLine => {
	const product = data.product!;
	const taxRate = data.taxRate!;
	const account = data.account!;

	return {
		...(data.lineId ? { id: data.lineId } : {}),
		orderLineId: data.orderLineId,
		productId: product.product.id,
		...(data.comment ? { comment: data.comment } : {}),
		...(data.supplierSku ? { supplierSku: data.supplierSku } : {}),
		quantity: data.quantity,
		unitPrice: data.unitPrice,
		discount: data.discount || "0",
		taxRateId: taxRate.id,
		accountId: account.id,
		...(data.trackingCategory1 ? { trackingCategory1Id: data.trackingCategory1.id } : {}),
		...(data.trackingCategory2 ? { trackingCategory2Id: data.trackingCategory2.id } : {}),
	};
};

const getNormalizedCreateBlindLinesData = (data: BillLineFormType): CreateBillLine => {
	const product = data.blindProduct!;
	const taxRate = data.taxRate!;
	const account = data.account!;

	return {
		...(data.lineId ? { id: data.lineId } : {}),
		productId: product.id,
		...(data.comment ? { comment: data.comment } : {}),
		...(data.supplierSku ? { supplierSku: data.supplierSku } : {}),
		quantity: data.quantity,
		unitPrice: data.unitPrice,
		discount: data.discount || "0",
		taxRateId: taxRate.id,
		accountId: account.id,
		...(data.trackingCategory1 ? { trackingCategory1Id: data.trackingCategory1.id } : {}),
		...(data.trackingCategory2 ? { trackingCategory2Id: data.trackingCategory2.id } : {}),
	};
};

const getNormalizedCreateServiceLinesData = (data: BillAdditionalCostFormType): CreateAdditionalCost => {
	const product = data.product!;
	const taxRate = data.taxRate!;

	return {
		...(data.lineId ? { id: data.lineId } : {}),
		...(product.id ? { productId: product.id } : { description: product.name }),
		...(data.comment ? { comment: data.comment } : {}),
		quantity: data.quantity,
		unitPrice: data.unitPrice,
		discount: data.discount || "0",
		taxRateId: taxRate.id,
		addToLandedCost: data.addToLandedCost,
		accountId: data.account ? data.account.id : undefined,
		...(data.trackingCategory1 ? { trackingCategory1Id: data.trackingCategory1.id } : {}),
		...(data.trackingCategory2 ? { trackingCategory2Id: data.trackingCategory2.id } : {}),
		allocation: data.allocation.map((item) => ({
			cost: item.cost,
			billLineId: item.billLineId,
			...(item.billId ? { billId: item.billId } : {}),
		})),
	};
};

export const getNormalizedCreateBillData = (
	data: BillFormValues,
	blindBill: boolean,
	billFirst: boolean,
	receivingIds: string[],
): Omit<CreateBillType, "orderId"> => {
	return {
		receivingIds: receivingIds,
		billNumber: data.billNumber,
		billDate: getFormDayPickerDate(data.billDate, true),
		dueDate: getFormDayPickerDate(data.dueDate, true),
		lines:
			blindBill && billFirst
				? data.lines.map(getNormalizedCreateBlindLinesData)
				: data.lines.map(getNormalizedCreateLinesData),
		serviceLines: data.serviceLines.map(getNormalizedCreateServiceLinesData),
	};
};
