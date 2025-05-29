import { SelectOption } from "@/@types/selects.ts";

export enum OrderStatus {
	DRAFT = "DRAFT",
	AUTHORIZED = "AUTHORIZED",
	ORDERING = "ORDERING",
	ORDERED = "ORDERED",
	PARTIALLY_PICKED = "PARTIALLY_PICKED",
	PICKED = "PICKED",
	PARTIALLY_PACKED = "PARTIALLY_PACKED",
	PACKED = "PACKED",
	PARTIALLY_SHIPPED = "PARTIALLY_SHIPPED",
	SHIPPED = "SHIPPED",
	INVOICING = "INVOICING",
	INVOICED = "INVOICED",
	CREDITING = "CREDITING",
	PARTIALLY_CREDITED = "PARTIALLY_CREDITED",
	CREDITED = "CREDITED",
	LOST = "LOST",
	VOID = "VOID",
	CLOSED = "CLOSED",
}

export enum XeroStatus {
	AUTHORISED = "AUTHORISED",
	DRAFT = "DRAFT",
	NOT_POSTED = "NOT_POSTED",
	PAID = "PAID",
}

export enum Template {
	DEFAULT = "DEFAULT",
	MEAT = "MEAT",
	WOOLWORTHS = "WOOLWORTHS",
}

export enum PickingStatus {
	AWAITING_PICK = "AWAITING_PICK",
	PARTIALLY_PICKED = "PARTIALLY_PICKED",
	PICKED = "PICKED",
}

export enum PackingStatus {
	AWAITING_PACK = "AWAITING_PACK",
	PARTIALLY_PACKED = "PARTIALLY_PACKED",
	PACKED = "PACKED",
}

export enum ShippingStatus {
	AWAITING_SHIPMENT = "AWAITING_SHIPMENT",
	PARTIALLY_SHIPPED = "PARTIALLY_SHIPPED",
	SHIPPED = "SHIPPED",
}

export enum PaymentStatus {
	PAID = "PAID",
	PARTIALLY_PAID = "PARTIALLY_PAID",
	UNPAID = "UNPAID",
}

export type OrderType = {
	id: string;
	customerName: string;
	reference: string | null;
	soNumber: string | null;
	orderDate: string;
	salesRepName: string;
	total: string;
	currencyCode: string;
	overallStatus: OrderStatus;
	invoices: {
		id: string;
		invoiceNumber: string;
	}[];
	xeroStatus: XeroStatus;
	template: Template;
	pickingStatus: PickingStatus;
	packingStatus: PackingStatus;
	shippingStatus: ShippingStatus;
	paymentStatus: PaymentStatus;
};

export type GetAllOrdersResponseType = {
	items: OrderType[];
	totalCount: number;
	totalPages: number;
};

export type GetOrderSettingsResponseType = {
	email: string;
	phone: string;
	contacts?: {
		name: string;
		email: string;
		phone: string;
		comment: string;
		isDefault: boolean;
	}[];
	billingAddresses: {
		addressLine1?: string;
		addressLine2?: string;
	}[];
	shippingAddresses: {
		addressLine1?: string;
		addressLine2?: string;
	}[];
	customerDiscount: string | null;
	warehouses: {
		id: string;
		name: string;
	}[];
	priceList: {
		id: string;
		name: string;
	}[];
	salesReps: {
		id: string;
		name: string;
	}[];
	paymentTerms: {
		id: string;
		name: string;
	}[];
	accounts: {
		id: string;
		name: string;
	}[];
	taxRates: {
		id: string;
		name: string;
	}[];
	defaultBillingAddress?: { addressLine1: string; addressLine2?: string };
	defaultShippingAddress?: { addressLine1: string; addressLine2?: string };
	defaultPriceList: SelectOption;
	defaultSalesRep: SelectOption;
	defaultPaymentTerm: SelectOption;
	defaultAccount: SelectOption;
	defaultTaxRate: SelectOption;
};

export type QuoteType = {
	id: string;
	status: "DRAFT" | "AUTHORIZED" | "VOID";
	memo: string | null;
	lines: {
		id: string;
		description: string | null;
		discount: string;
		account: {
			name: string;
			id: string;
		};
		taxRate: {
			id: string;
			name: string;
		};
		comment: string | null;
		product: {
			id: string;
			name: string;
		};
		quantity: string;
		unitPrice: string;
		margin: string;
		trackingCategoryAId: string | null;
		trackingCategoryBId: string | null;
		mass: string | null;
		packOrder: string | null;
		sLugs: number | null;
		lLugs: number | null;
	}[];
	serviceLines: {
		id: string;
		discount: string;
		taxRate: {
			id: string;
			name: string;
		};
		account: {
			id: string;
			name: string;
		};
		comment: string | null;
		product: {
			id: string;
			name: string;
		};
		quantity: string;
		unitPrice: string;
	}[];
};

export interface ExtendedSalesOrder {
	id: string;
	createdAt: string;
	createdBy: string;
	updatedAt: string;
	updatedBy: string | null;
	organisationId: string;
	soNumber: string | null;
	status: OrderStatus;
	shippingDate: string;
	shippingDueDate: string | null;
	contactDetails: {
		name: string | null;
		phone: string | null;
		email: string | null;
	} | null;
	shipToDifferentCompany: boolean;
	shippingAddress: {
		addressLine1: string | null;
		addressLine2: string | null;
	} | null;
	billingAddress: {
		addressLine1: string | null;
		addressLine2: string | null;
	} | null;
	reference: string | null;
	comment: string | null;
	deliveryMethod: string | null;
	shippingNotes: string | null;
	skipQuote: boolean;
	taxInclusive: boolean;
	memo: string | null;
	template: Template;
	orderLines: {
		id: string;
		description: string | null;
		discount: string;
		account: {
			name: string;
			id: string;
		};
		taxRate: {
			id: string;
			name: string;
		};
		comment: string | null;
		product: {
			id: string;
			name: string;
			dimensions?: { lugSize: "s_lugs" | "l_lugs"; calculatedWith: "quantity" | "weight"; quantity: number };
		};
		quantity: string;
		unitPrice: string;
		margin: string;
		trackingCategoryAId: string | null;
		trackingCategoryBId: string | null;
		mass: string | null;
		packOrder: string | null;
		sLugs: number | null;
		lLugs: number | null;
	}[];
	serviceLines: {
		id: string;
		discount: string;
		taxRate: {
			id: string;
			name: string;
		};
		account: {
			id: string;
			name: string;
		};
		comment: string | null;
		product: {
			id: string;
			name: string;
		};
		quantity: string;
		unitPrice: string;
	}[];
	customer: {
		id: string;
		name: string;
		discount: string | null;
	};
	paymentTerm: {
		id: string;
		name: string;
		method: number;
		durationDays: number | null;
	};
	priceList: {
		id: string;
		name: string;
	};
	currency: {
		id: string;
		code: string;
		name: string;
	};
	taxRate: {
		id: string;
		name: string;
	};
	account: {
		id: string;
		name: string;
	};
	salesRep: {
		id: string;
		name: string;
	} | null;
	warehouse: {
		id: string;
		name: string;
	};
}

export type GetOrderByIdResponseType = {
	quote: QuoteType | null;
	salesOrder: ExtendedSalesOrder;
};

export type ServiceLine = {
	productId: string;
	comment: string | null;
	quantity: string;
	unitPrice: string;
	discount: string;
	accountId: string;
	taxRateId: string;
	total: string;
};

export type CreateOrderType = {
	salesOrder: {
		customerId: string;
		contact: {
			name: string | null;
			phone: string | null;
			email: string | null;
		} | null;
		billingAddressLine1: string | null;
		billingAddressLine2: string | null;
		priceListId: string;
		currencyId: string;
		reference: string | null;
		template: "DEFAULT" | "MEAT" | "WOOLWORTHS";
		paymentTermId: string;
		salesRepId: string;
		accountId: string;
		taxRateId: string;
		taxInclusive: boolean;
		skipQuote: boolean;
		recurringTask: boolean;
		invoiceOnly: boolean;
		warehouseId: string;
		shippingDate: string;
		shippingDueDate: string | null;
		shipToDifferentCompany: boolean;
		shippingAddressLine1: string | null;
		shippingAddressLine2: string | null;
		shippingNotes: string | null;
		deliveryMethod: string | null;
		comment: string | null;
		memo: string | null;
		lines: {
			type: Template;
			items: SalesOrderOrderLine[];
		};
		serviceLines: [];
	};
	quote?: {
		memo: string | null;
		lines: {
			type: Template;
			items: SalesOrderOrderLine[];
		};
		serviceLines: ServiceLine[];
	};
};

export type UpdateOrderType = {
	customerId: string;
	contact: {
		name: string | null;
		phone: string | null;
		email: string | null;
	} | null;
	billingAddressLine1: string | null;
	billingAddressLine2: string | null;
	priceListId: string;
	currencyId: string;
	reference: string | null;
	template: "DEFAULT" | "MEAT" | "WOOLWORTHS";
	paymentTermId: string;
	salesRepId: string;
	accountId: string;
	taxRateId: string;
	taxInclusive: boolean;
	skipQuote: boolean;
	recurringTask: boolean;
	invoiceOnly: boolean;
	warehouseId: string;
	shippingDate: string;
	shippingDueDate: string | null;
	shipToDifferentCompany: boolean;
	shippingAddressLine1: string | null;
	shippingAddressLine2: string | null;
	shippingNotes: string | null;
	deliveryMethod: string | null;
	comment: string | null;
	memo: string | null;
};

export type SalesOrderOrderLine =
	| SalesOrderDefaultOrderLine
	| SalesOrderMeatOrderLine
	| SalesOrderWoolworthsOrderLine;

export type SalesOrderDefaultOrderLine = {
	productId: string;
	comment: string | null;
	quantity: string;
	unitPrice: string;
	discount: string;
	accountId: string;
	taxRateId: string;
	margin: string;
	trackingCategoryAId: string | null;
	trackingCategoryBId: string | null;
	total: string;
};

export type SalesOrderMeatOrderLine = {
	productId: string;
	description: string | null;
	comment: string | null;
	quantity: string;
	mass: string;
	unitPrice: string;
	accountId: string;
	trackingCategoryAId: string | null;
	trackingCategoryBId: string | null;
	discount: string;
	taxRateId: string;
	margin: string;
	total: string;
};

export type SalesOrderWoolworthsOrderLine = {
	productId: string;
	description: string | null;
	comment: string | null;
	packOrder: string;
	sLugs: number | null;
	lLugs: number | null;
	quantity: string;
	mass: string;
	unitPrice: string;
	accountId: string;
	discount: string;
	taxRateId: string;
	margin: string;
	total: string;
	trackingCategoryAId: string | null;
	trackingCategoryBId: string | null;
};

export type UpdateOrderLinesType = {
	memo: string | null;
	lines: {
		items: SalesOrderOrderLine[];
		type: Template;
	};
	serviceLines: ServiceLine[];
};

export type FulfilmentType = {
	picking?: FulfillmentPickingType;
	packing?: FulfillmentPackingType;
	shipping?: FulfillmentShippingType;
	id: string;
};

export type GetFulfilmentByIdResponseType = {
	fulfillments: FulfilmentType[];
};

export type FulfillmentPickingType = {
	id: string;
	fulfillmentId: string;
	status: "DRAFT" | "AUTHORIZED" | "VOID";
	requiredBy: string | null;
	picker: {
		id: string;
		name: string;
	};
	createdAt: string;
	updatedAt: string;
	lines: FulfillmentPickingLineType[];
};

export type FulfillmentPickingLineType = {
	id: string;
	warehouse: {
		id: string;
		name: string;
	};
	quantity: string;
	product: {
		id: string;
		name: string;
		unitOfMeasure: {
			id: string;
			name: string;
		} | null;
	};
	batchNumber: string | null;
	expiryDate: string | null;
	salesOrderLineId: string | null;
};

export type FulfillmentPackingType = {
	id: string;
	fulfillmentId: string;
	status: "DRAFT" | "AUTHORIZED" | "VOID";
	requiredBy: string | null;
	packer: {
		id: string;
		name: string;
	};
	createdAt: string;
	updatedAt: string;
	lines: FulfillmentPackingLineType[];
};

export type FulfillmentPackingLineType = {
	id: string;
	quantity: string;
	product: {
		id: string;
		name: string;
	};
	packageNumber: string | null;
};

export type FulfillmentShippingType = {
	id: string;
	fulfillmentId: string;
	status: "DRAFT" | "AUTHORIZED" | "VOID";
	createdAt: string;
	updatedAt: string;
	lines: FulfillmentShippingLineType[];
};

export type FulfillmentShippingLineType = {
	id: string;
	shipDate: string | null;
	carrier?: {
		id: string;
		name: string;
	};
	waybillNumber: string | null;
	trackingLink: string | null;
	packageNumber: string | null;
};

export type CreateFulfillmentType = {
	picking: UpdateFulfillmentPickingType;
};

export type UpdateFulfillmentPickingType = {
	requiredBy: string | null;
	pickerId: string;
	lines: Array<{
		productId: string;
		batchNumber: string | null;
		expiryDate: string | null;
		quantity: string;
		warehouseId: string;
	}>;
};

export type UpdateFulfillmentPackingType = {
	requiredBy: string | null;
	packerId: string;
	lines: {
		productId: string;
		quantity: string;
		packageNumber: string;
	}[];
};

export type UpdateFulfillmentShippingType = {
	lines: {
		shipDate: string;
		carrierId?: string;
		waybillNumber: string;
		trackingLink: string;
		packageNumber: string;
	}[];
};

export type GetInvoicingByIdResponseType = {
	salesOrderInvoices: InvoiceType[];
};

export type InvoiceType = {
	status: "DRAFT" | "AUTHORIZED" | "VOID";
	date: string;
	id: string;
	currencyId: string;
	salesOrderId: string;
	xeroInvoiceId: string | null;
	invoiceNumber: string | null;
	dueDate: string;
	xeroInvoiceURL: string | null;
	xeroInvoiceNumber: string | null;
	payments?: { paid: string; id: string }[];
	lines: {
		id: string;
		description: string | null;
		discount: string;
		account: {
			id: string;
			name: string;
		};
		taxRate: {
			id: string;
			name: string;
		};
		comment: string | null;
		product: {
			id: string;
			name: string;
			dimensions?: { lugSize: "s_lugs" | "l_lugs"; calculatedWith: "quantity" | "weight"; quantity: number };
		};
		quantity: string;
		unitPrice: string;
		margin: string;
		trackingCategoryAId: string | null;
		trackingCategoryBId: string | null;
		mass: string | null;
		packOrder: string | null;
		sLugs: number | null;
		lLugs: number | null;
		salesOrderLineId: string | null;
		total: string;
	}[];
	serviceLines: {
		id: string;
		discount: string;
		account: {
			id: string;
			name: string;
		};
		taxRate: {
			id: string;
			name: string;
		};
		comment: string | null;
		quantity: string;
		product: {
			id: string;
			name: string;
		};
		unitPrice: string;
		salesOrderServiceLineId: string | null;
		total: string;
	}[];
};

export type UpdateInvoiceType = {
	lines: {
		items: SalesOrderOrderLine[];
		type: Template;
	};
	serviceLines: ServiceLine[];
	date: string;
	dueDate: string;
	currencyId: string;
};

export type GetCreditNotesByIdResponseType = {
	salesOrderCreditNotes: CreditNoteType[];
};

export type CreditNoteType = {
	status: "DRAFT" | "AUTHORIZED" | "VOID";
	date: string;
	id: string;
	currencyId: string;
	salesOrderId: string;
	xeroInvoiceId: string | null;
	creditNoteNumber: string | null;
	dueDate: string;
	xeroInvoiceURL: string | null;
	xeroInvoiceNumber: string | null;
	lines: {
		id: string;
		description: string | null;
		discount: string;
		account: {
			id: string;
			name: string;
		};
		taxRate: {
			id: string;
			name: string;
		};
		comment: string | null;
		product: {
			id: string;
			name: string;
		};
		quantity: string;
		unitPrice: string;
		margin: string;
		trackingCategoryAId: string | null;
		trackingCategoryBId: string | null;
		mass: string | null;
		packOrder: string | null;
		sLugs: number | null;
		lLugs: number | null;
		salesOrderLineId: string | null;
		total: string;
	}[];
	serviceLines: {
		id: string;
		discount: string;
		account: {
			id: string;
			name: string;
		};
		taxRate: {
			id: string;
			name: string;
		};
		comment: string | null;
		quantity: string;
		product: {
			id: string;
			name: string;
		};
		unitPrice: string;
		salesOrderServiceLineId: string | null;
		total: string;
	}[];
};

export type GetRestockByIdResponseType = {
	salesOrderRestock: RestockType;
};

export type RestockType = {
	status: "DRAFT" | "AUTHORIZED" | "VOID";
	createdAt: string;
	salesOrderId: string;
	lines: {
		id: string;
		warehouse: {
			id: string;
			name: string;
		};
		salesOrderRestockId: string;
		product: {
			id: string;
			name: string;
			unitOfMeasure: {
				id: string;
				name: string;
			} | null;
		};
		batchNumber: string | null;
		expiryDate: string | null;
		quantity: string;
	}[];
};

export type UpdateRestockType = {
	lines: Array<{
		productId: string;
		batchNumber: string | null;
		expiryDate: string | null;
		quantity: string;
		warehouseId: string;
	}>;
};
