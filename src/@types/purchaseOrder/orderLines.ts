import { ProductType } from "../products";
import { UnitOfMeasureType } from "../unitsOfMeasure";
import { SelectOption, TaxRateType } from "../selects";
import { PurchaseOrderLinesStatus, PurchaseOrderStatus } from "./statuses";

export type OrderLineFormType = {
	id?: string;
	product?: ProductType;
	comment: string;
	supplierSku?: string;
	unitOfMeasure?: UnitOfMeasureType;
	quantity: string;
	unitPrice: string;
	discount: string;
	taxType?: TaxRateType;
	trackingCategory1?: SelectOption;
	trackingCategory2?: SelectOption;
	total: string;
};

export type AdditionalLineFormType = {
	id?: string;
	product?: ProductType;
	reference: string;
	quantity: string;
	unitPrice: string;
	discount: string;
	addToLandedCost: boolean;
	taxType?: TaxRateType;
	trackingCategory1?: SelectOption;
	trackingCategory2?: SelectOption;
	total: string;
};

export type OrderLinesFormValues = {
	memo: string;
	orderLines: OrderLineFormType[];
	additionalLines: AdditionalLineFormType[];
};

export const DefaultOrderLine: OrderLineFormType = {
	product: undefined,
	comment: "",
	supplierSku: "",
	unitOfMeasure: undefined,
	quantity: "",
	unitPrice: "",
	discount: "",
	taxType: undefined,
	trackingCategory1: undefined,
	trackingCategory2: undefined,
	total: "",
};

export const DefaultCostLine: AdditionalLineFormType = {
	product: undefined,
	reference: "",
	quantity: "",
	unitPrice: "",
	discount: "",
	addToLandedCost: false,
	taxType: undefined,
	trackingCategory1: undefined,
	trackingCategory2: undefined,
	total: "",
};

export type CreatePurchaseOrderLinesBodyType = {
	id: string;
	orderLines: {
		id?: string;
		productId: string;
		comment?: string;
		supplierSku?: string;
		uomId?: string;
		quantity: string;
		unitPrice: string;
		discount: string;
		taxRateId: string;
		trackingCategory1Id?: string;
		trackingCategory2Id?: string;
	}[];
	additionalLines: {
		id?: string;
		productId?: string;
		description?: string;
		reference: string;
		quantity: string;
		unitPrice: string;
		discount: string;
		addToLandedCost: boolean;
		taxRateId: string;
		trackingCategory1Id?: string;
		trackingCategory2Id?: string;
	}[];
	memo: string;
};

export type SavePurchaseOrderLinesResponseType = {
	status: PurchaseOrderStatus;
	lineStatus: PurchaseOrderLinesStatus;
	lines: { id: string }[];
	additionalLines: { id: string }[];
};

export type UndoPurchaseOrdeLinesResponseType = {
	id: string;
	status: PurchaseOrderStatus;
	lineStatus: PurchaseOrderLinesStatus;
};

export type VoidPurchaseOrderLinesResponseType = {
	id: string;
	status: PurchaseOrderStatus;
};
