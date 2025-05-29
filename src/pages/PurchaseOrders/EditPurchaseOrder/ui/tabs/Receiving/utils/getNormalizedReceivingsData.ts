import { getDateFromDayPickerDate, getFormDayPickerDate } from "@/utils/date";

import {
	ReceivingType,
	ReceivingRowType,
	ReceivingFormValues,
	CreateReceivingsType,
	UpdateReceivingsType,
} from "@/@types/purchaseOrder/receiving";
import { BillType } from "@/@types/purchaseOrders";
import { GetPurchaseOrderByIdResponseType } from "@/@types/purchaseOrder/order";

export const getNormalizedResetData = (data: ReceivingType): ReceivingFormValues => {
	return {
		receivingDate: getDateFromDayPickerDate(data.receivingDate) || new Date(),
		lines: data.lines.map((line) => ({
			lineId: line.id,
			orderLineId: line.orderLineId,
			product: {
				id: line.orderLineId,
				quantity: line.quantity,
				supplierSku: line.supplierSku,
				product: line.product,
			},
			blindProduct: line.product,
			batchOrSerialNumber: line.batchOrSerialNumber,
			expiryDate: getDateFromDayPickerDate(line.expiryDate),
			supplierSku: line.supplierSku,
			quantity: line.quantity.toString(),
			warehouse: line.warehouse,
		})),
	};
};

export const getNormalizedCopyBillData = (
	data: BillType,
	orderData: GetPurchaseOrderByIdResponseType,
	receivingListQuantity: { [key: string]: number },
) => {
	// FORM VALUES
	const receivingFormLines: ReceivingRowType[] = data.lines.map((item) => {
		const usedQuantity =
			(Object.keys(receivingListQuantity).length > 0 && receivingListQuantity[item.orderLineId]) || 0;

		return {
			lineId: "",
			orderLineId: item.orderLineId,
			product: {
				id: item.orderLineId,
				product: item.product,
				quantity: Math.max(+(item.quantity || 0) - usedQuantity, 0),
				supplierSku: item.supplierSku,
			},
			batchOrSerialNumber: "",
			expiryDate: undefined,
			supplierSku: item.supplierSku,
			quantity: Math.max(+(item.quantity || 0) - usedQuantity, 0).toString(),
			warehouse: orderData.warehouse || undefined,
		};
	});

	return { receivingFormLines };
};

export const getNormalizedCopyData = (
	orderData: GetPurchaseOrderByIdResponseType,
	receivingListQuantity: { [key: string]: number },
): ReceivingFormValues => {
	return {
		receivingDate: new Date(),
		lines: orderData.orderLines.map((line) => {
			const usedQuantity =
				(Object.keys(receivingListQuantity).length > 0 && receivingListQuantity[line.id]) || 0;

			return {
				lineId: "",
				orderLineId: line.id,
				product: {
					id: line.id,
					quantity: +line.quantity,
					supplierSku: line.supplierSku,
					product: line.product,
				},
				batchOrSerialNumber: "",
				expiryDate: undefined,
				supplierSku: line.supplierSku,
				quantity: Math.max(+line.quantity - usedQuantity, 0).toString(),
				warehouse: orderData.warehouse || line.product.defaultWarehouse,
			};
		}),
	};
};

const getNormalizedLinesData = (data: ReceivingRowType) => {
	const product = data.product!;
	const warehouse = data.warehouse!;

	return {
		orderLineId: data.orderLineId,
		productId: product.product.id,
		batchOrSerialNumber: data.batchOrSerialNumber || "",
		...(data.expiryDate ? { expiryDate: getFormDayPickerDate(data.expiryDate, true) } : {}),
		supplierSku: data.supplierSku || "",
		quantity: data.quantity,
		warehouseId: warehouse.id,
	};
};

const getNormalizedBlindLinesData = (data: ReceivingRowType) => {
	const product = data.blindProduct!;
	const warehouse = data.warehouse!;

	return {
		productId: product.id,
		batchOrSerialNumber: data.batchOrSerialNumber || "",
		...(data.expiryDate ? { expiryDate: getFormDayPickerDate(data.expiryDate, true) } : {}),
		supplierSku: data.supplierSku || "",
		quantity: data.quantity,
		warehouseId: warehouse.id,
	};
};

export const getNormalizedCreateReceivingsData = (
	data: ReceivingFormValues,
	blindBill: boolean,
	stockFirst: boolean,
	billIds: string[],
): Omit<CreateReceivingsType, "orderId"> => {
	return {
		billIds: billIds,
		receivingDate: getFormDayPickerDate(data.receivingDate, true),
		lines:
			blindBill && stockFirst
				? data.lines.map(getNormalizedBlindLinesData)
				: data.lines.map(getNormalizedLinesData),
	};
};

export const getNormalizedUpdateReceivingsData = (
	data: ReceivingFormValues,
	blindBill: boolean,
	stockFirst: boolean,
	billIds: string[],
): Omit<UpdateReceivingsType, "id"> => {
	return {
		billIds: billIds,
		receivingDate: getFormDayPickerDate(data.receivingDate, true),
		lines:
			blindBill && stockFirst
				? data.lines.map(getNormalizedBlindLinesData)
				: data.lines.map(getNormalizedLinesData),
	};
};
