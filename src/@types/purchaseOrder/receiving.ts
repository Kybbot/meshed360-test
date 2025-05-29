import { ProductType } from "../products";
import { WarehousType } from "../warehouses";

export type ReceivingLineType = {
	id: string;
	orderLineId: string;
	product: ProductType;
	batchOrSerialNumber: string;
	expiryDate: string;
	supplierSku: string;
	quantity: number;
	warehouse: WarehousType;
};

export type ReceivingType = {
	id: string;
	billIds: string[];
	bills: {
		id: string;
		billNumber: string;
	}[];
	receivingDate: string;
	receivingNumber: string;
	status: "NEW" | "VOID" | "DRAFT" | "AUTHORIZED";
	lines: ReceivingLineType[];
};

export type GetAllReceivingResponseType = {
	receivings: ReceivingType[];
};

export type ReceivingOrderLineType = {
	id: string;
	product: ProductType;
	supplierSku?: string;
	quantity: number;
};

export type ReceivingRowType = {
	lineId: string;
	orderLineId: string;
	product?: ReceivingOrderLineType;
	blindProduct?: ProductType;
	batchOrSerialNumber?: string;
	expiryDate?: Date;
	supplierSku?: string;
	quantity: string;
	warehouse?: WarehousType;
	billIds?: string[]; // For frontend use only
};

export type ReceivingFormValues = {
	receivingDate: Date;
	lines: ReceivingRowType[];
};

export const DefaultReceivingRow: ReceivingRowType = {
	lineId: "",
	orderLineId: "",
	product: undefined,
	blindProduct: undefined,
	batchOrSerialNumber: "",
	expiryDate: undefined,
	supplierSku: "",
	quantity: "",
	warehouse: undefined,
};

export type CreateReceivingsType = {
	orderId: string;
	billIds: string[];
	receivingDate: string;
	lines: {
		orderLineId?: string;
		productId: string;
		batchOrSerialNumber?: string;
		expiryDate?: string;
		supplierSku?: string;
		quantity: string;
		warehouseId: string;
	}[];
};

export type UpdateReceivingsType = {
	id: string;
	billIds: string[];
	receivingDate: string;
	lines: {
		orderLineId?: string;
		productId: string;
		batchOrSerialNumber?: string;
		expiryDate?: string;
		supplierSku?: string;
		quantity: string;
		warehouseId: string;
	}[];
};

export type AuthoriseReceivingsStatusResponseType = {
	status: "AUTHORIZED";
	orderStatus: "FULLY_RECEIVED";
};

export type UndoReceivingsStatusResponseType = {
	status: "DRAFT";
	orderStatus: "DRAFT";
};

export type VoidReceivingsStatusResponseType = {
	status: "VOID";
};
