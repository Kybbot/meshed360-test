import { ProductType } from "../products";
import { CurrencyType } from "../currencies";
import { WarehousType } from "../warehouses";
import { UnitOfMeasureType } from "../unitsOfMeasure";
import { PurchaseOrderLinesStatus, PurchaseOrderStatus } from "./statuses";
import { SelectOption, SelectOptionOnlyWithName, TaxRateType } from "../selects";

// GET TABLE DATA
export type PurchaseOrderType = {
	id: string;
	from: string;
	reference: string;
	poNumber: string;
	orderDate: string;
	stockStatus: string;
	total: number;
	location: string;
	currency: string;
	overallStatus: PurchaseOrderStatus;
	expectedDeliveryDate: string;
	billNumber: string[];
	xeroStatus: string;
	paymentStatus: string;
	billStatus: string;
};

export type GetAllPurchaseOrdersResponseType = {
	items: PurchaseOrderType[];
	totalCount: number;
	totalPages: number;
};

// GET ORDER SETTINGS
export type GetPurchaseOrderSettingsResponseType = {
	contacts?: {
		name: string;
		email: string;
		phone: string;
		comment: string;
		isDefault: boolean;
	}[];
	defaultContact?: {
		name: string;
		phone: string;
	};
	vendorAddresses: {
		name: string;
	}[];
	paymentTerms: {
		id: string;
		name: string;
	}[];
	inventoryAccounts: {
		id: string;
		name: string;
	}[];
	taxRules: {
		id: string;
		name: string;
	}[];
	warehouses: {
		id: string;
		name: string;
	}[];
	shippingAddresses: {
		name: string;
	}[];
	defaultInventoryAccount: SelectOption;
	defaultVendorAddress?: { addressLine1: string; addressLine2?: string };
	defaultShippingAddress?: { addressLine1: string; addressLine2?: string };
	defaultPaymentTerm: SelectOption;
	defaultTaxRule: SelectOption;
};

// GET ORDER BY ID
export type GetOrderLineType = {
	id: string;
	product: ProductType;
	comment?: string;
	supplierSku?: string;
	unitOfMeasure: UnitOfMeasureType;
	quantity: string;
	unitPrice: string;
	discount: string;
	taxType: TaxRateType;
	trackingCategory1?: SelectOption;
	trackingCategory2?: SelectOption;
	billIds?: string[]; // For frontend use only
	receivingIds?: string[]; // For frontend use only
};

export type GetAdditionalLineType = {
	id: string;
	product: ProductType;
	description?: string;
	reference: string;
	quantity: string;
	unitPrice: string;
	discount: string;
	addToLandedCost: boolean;
	taxType: TaxRateType;
	trackingCategory1?: SelectOption;
	trackingCategory2?: SelectOption;
};

export type GetPurchaseOrderByIdResponseType = {
	id: string;
	poNumber?: string;
	status: PurchaseOrderStatus;
	lineStatus: PurchaseOrderLinesStatus;
	currency: CurrencyType;

	supplier: { discount: string | null } & SelectOption;
	contactDetails?: {
		name: string;
		phone: string;
	};
	vendorAddressLine?: {
		addressLine1: string;
		addressLine2: string;
	};
	reference?: string;

	stockFirst: boolean;
	billFirst: boolean;
	blindBill: boolean;
	additionalExpense: boolean;
	paymentTerm: { id: string; name: string; method: number; durationDays: number | null };
	expectedDeliveryDate: string;
	inventoryAccount: SelectOption;
	taxInclusive: boolean;
	taxRule: TaxRateType;

	shippingDate: string;
	warehouse: WarehousType;
	shipToDifferentCompany: boolean;
	shippingAddress?: {
		addressLine1?: string;
		addressLine2?: string;
	};

	comments?: string;

	orderLines: GetOrderLineType[];
	additionalLines: GetAdditionalLineType[];
	memo?: string;
};

// FORM
export type PurchaseOrderFormValues = {
	supplier: SelectOption;
	contact?: SelectOptionOnlyWithName;
	phone?: string;
	vendorAddress?: SelectOptionOnlyWithName;
	vendorAddressLine2?: string;
	reference?: string;

	stockFirst: boolean;
	billFirst: boolean;
	blindBill: boolean;
	additionalExpense: boolean;
	paymentTerm: SelectOption;
	expectedDeliveryDate: Date;
	inventoryAccount: SelectOption;
	taxInclusive: boolean;
	taxRule: SelectOption;

	shippingDate: Date;
	warehouse: SelectOption;
	shipToDifferentCompany: boolean;
	shippingAddress?: SelectOptionOnlyWithName;
	shippingAddressText?: string;
	shippingAddressLine2?: string;

	comments?: string;
};

// CREATE ORDER
export type CreatePurchaseOrderBodyType = {
	organisationId: string;

	supplierId: string;
	contact: {
		name: string | null;
		phone: string | null;
	};
	vendorAddress: {
		addressLine1: string | null;
		addressLine2: string | null;
	};
	reference: string | null;

	stockFirst: boolean;
	billFirst: boolean;
	blindBill: boolean;
	additionalExpense: boolean;
	paymentTermId: string;
	expectedDeliveryDate: string;
	inventoryAccountId: string;
	taxInclusive: boolean;
	taxRuleId: string;

	shippingDate: string;
	warehouseId: string;
	shipToDifferentCompany: boolean;
	shippingAddress: {
		addressLine1: string | null;
		addressLine2: string | null;
	};

	comments: string | null;
};

export type CreatePurchaseOrderResponseType = {
	id: string;
	status: PurchaseOrderStatus;
	lineStatus: PurchaseOrderLinesStatus;
};

// CLOSE ORDER
export type ClosePurchaseOrderResponseType = {
	id: string;
	status: PurchaseOrderStatus;
};
