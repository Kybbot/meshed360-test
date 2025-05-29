import { SelectOption, SelectOptionOnlyWithName, TaxRateType } from "../selects.ts";
import {
	OrderStatus,
	PackingStatus,
	PaymentStatus,
	PickingStatus,
	ShippingStatus,
	Template,
	XeroStatus,
} from "@/@types/salesOrders/api.ts";
import { ProductType } from "@/@types/products.ts";
import { PriceListType } from "@/@types/priceLists.ts";

export const templates = [
	{ id: "DEFAULT", name: "Default" },
	{ id: "MEAT", name: "Meat" },
	{ id: "WOOLWORTHS", name: "Woolworth" },
];

export const orderStatusDictionary: { [key in OrderStatus]: string } = {
	[OrderStatus.DRAFT]: "Draft",
	[OrderStatus.AUTHORIZED]: "Authorized",
	[OrderStatus.ORDERING]: "Ordering",
	[OrderStatus.ORDERED]: "Ordered",
	[OrderStatus.PARTIALLY_PICKED]: "Partially Picked",
	[OrderStatus.PICKED]: "Picked",
	[OrderStatus.PARTIALLY_PACKED]: "Partially Packed",
	[OrderStatus.PACKED]: "Packed",
	[OrderStatus.PARTIALLY_SHIPPED]: "Partially Shipped",
	[OrderStatus.SHIPPED]: "Shipped",
	[OrderStatus.INVOICING]: "Invoicing",
	[OrderStatus.INVOICED]: "Invoiced",
	[OrderStatus.CREDITING]: "Crediting",
	[OrderStatus.PARTIALLY_CREDITED]: "Partially Credited",
	[OrderStatus.CREDITED]: "Credited",
	[OrderStatus.LOST]: "Lost",
	[OrderStatus.VOID]: "Void",
	[OrderStatus.CLOSED]: "Completed",
};

export const xeroStatusDictionary: { [key in XeroStatus]: string } = {
	[XeroStatus.AUTHORISED]: "Authorised",
	[XeroStatus.DRAFT]: "Draft",
	[XeroStatus.NOT_POSTED]: "Not Posted",
	[XeroStatus.PAID]: "Paid",
};

export const templateDictionary: { [key in Template]: string } = {
	[Template.DEFAULT]: "Default",
	[Template.MEAT]: "Meat",
	[Template.WOOLWORTHS]: "Woolworths",
};

export const pickingStatusDictionary: { [key in PickingStatus]: string } = {
	[PickingStatus.AWAITING_PICK]: "Awaiting Pick",
	[PickingStatus.PARTIALLY_PICKED]: "Partially Picked",
	[PickingStatus.PICKED]: "Picked",
};

export const packingStatusDictionary: { [key in PackingStatus]: string } = {
	[PackingStatus.AWAITING_PACK]: "Awaiting Pack",
	[PackingStatus.PARTIALLY_PACKED]: "Partially Packed",
	[PackingStatus.PACKED]: "Packed",
};

export const shippingStatusDictionary: { [key in ShippingStatus]: string } = {
	[ShippingStatus.AWAITING_SHIPMENT]: "Awaiting Shipment",
	[ShippingStatus.PARTIALLY_SHIPPED]: "Partially Shipped",
	[ShippingStatus.SHIPPED]: "Shipped",
};

export const paymentStatusDictionary: { [key in PaymentStatus]: string } = {
	[PaymentStatus.PAID]: "Paid",
	[PaymentStatus.PARTIALLY_PAID]: "Partially Paid",
	[PaymentStatus.UNPAID]: "Unpaid",
};

export type OrderFormValues = {
	customer: SelectOption;
	contact?: SelectOptionOnlyWithName;
	phone?: string;
	email?: string;
	billingAddress?: SelectOptionOnlyWithName;
	billingAddressLine2?: string;
	priceList: PriceListType;
	reference?: string;
	template: SelectOption;

	paymentTerm: SelectOption;
	salesRep: SelectOption;
	account: SelectOption;
	taxRate: TaxRateType;
	taxInclusive: boolean;
	skipQuote: boolean;

	warehouse: SelectOption;
	date: Date;
	dueDate?: Date;
	shipToDifferentCompany: boolean;
	shippingAddress?: SelectOptionOnlyWithName;
	shippingAddressText?: string;
	shippingAddressLine2?: string;
	shippingNotes?: string;
	deliveryMethod?: string;

	comments?: string;

	memo: string;
	defaultQuoteLines: DefaultOrderLineType[];
	meatQuoteLines: MeatOrderLineType[];
	woolworthsQuoteLines: WoolworthsOrderLineType[];
	serviceLines: OrderServiceLineType[];
};

export type EditOrderFormValues = {
	customer: SelectOption;
	contact?: SelectOptionOnlyWithName;
	phone?: string;
	email?: string;
	billingAddress?: SelectOptionOnlyWithName;
	billingAddressLine2?: string;
	priceList: PriceListType;
	reference?: string;
	template: SelectOption;
	paymentTerm: SelectOption;
	salesRep: SelectOption;
	account: SelectOption;
	taxRate: TaxRateType;
	taxInclusive: boolean;
	skipQuote: boolean;
	warehouse: SelectOption;
	date: Date;
	dueDate?: Date;
	shipToDifferentCompany: boolean;
	shippingAddress?: SelectOptionOnlyWithName;
	shippingAddressText?: string;
	shippingAddressLine2?: string;
	shippingNotes?: string;
	deliveryMethod?: string;
	comments?: string;
	memo: string;
};

// QUOTE

export type DefaultOrderLineType = {
	product?: ProductType;
	comment: string;
	quantity: string;
	unitPrice: string;
	discount: string;
	taxType?: TaxRateType;
	account?: SelectOption;
	total: string;
	trackingCategoryA?: SelectOption;
	trackingCategoryB?: SelectOption;
};

export type MeatOrderLineType = {
	product?: ProductType;
	comment: string;
	quantity: string;
	mass: string;
	unitPrice: string;
	account?: SelectOption;
	discount: string;
	taxType?: TaxRateType;
	total: string;
	trackingCategoryA?: SelectOption;
	trackingCategoryB?: SelectOption;
};

export type WoolworthsOrderLineType = {
	product?: ProductType;
	comment: string;
	packOrder: string;
	sLugs: string;
	lLugs: string;
	quantity: string;
	mass: string;
	avgMass: string;
	unitPrice: string;
	account?: SelectOption;
	discount: string;
	taxType?: TaxRateType;
	total: string;
	trackingCategoryA?: SelectOption;
	trackingCategoryB?: SelectOption;
};

export type OrderServiceLineType = {
	product?: ProductType;
	comment: string;
	quantity: string;
	unitPrice: string;
	discount: string;
	taxType?: TaxRateType;
	account?: SelectOption;
	total: string;
};

export const EmptyDefaultOrderLine: DefaultOrderLineType = {
	product: undefined,
	comment: "",
	quantity: "",
	unitPrice: "",
	discount: "",
	taxType: undefined,
	trackingCategoryA: undefined,
	trackingCategoryB: undefined,
	account: undefined,
	total: "",
};

export const EmptyMeatOrderLine: MeatOrderLineType = {
	product: undefined,
	comment: "",
	mass: "",
	quantity: "",
	unitPrice: "",
	discount: "",
	taxType: undefined,
	trackingCategoryA: undefined,
	trackingCategoryB: undefined,
	account: undefined,
	total: "",
};

export const EmptyWoolworthsOrderLine: WoolworthsOrderLineType = {
	product: undefined,
	comment: "",
	packOrder: "",
	sLugs: "",
	lLugs: "",
	mass: "",
	avgMass: "",
	quantity: "",
	unitPrice: "",
	discount: "",
	account: undefined,
	taxType: undefined,
	trackingCategoryA: undefined,
	trackingCategoryB: undefined,
	total: "",
};

export const DefaultServiceLine: OrderServiceLineType = {
	product: undefined,
	comment: "",
	quantity: "",
	unitPrice: "",
	discount: "",
	taxType: undefined,
	total: "",
};

export type DefaultOrderFormValues = {
	lines: DefaultOrderLineType[];
	memo: string;
	serviceLines: OrderServiceLineType[];
};

export type MeatOrderFormValues = {
	lines: MeatOrderLineType[];
	memo: string;
	serviceLines: OrderServiceLineType[];
};

export type WoolworthOrderFormValues = {
	lines: WoolworthsOrderLineType[];
	memo: string;
	serviceLines: OrderServiceLineType[];
};

export type PickingFulfilmentFormValues = {
	lines: PickingFulfilmentLineType[];
	requiredBy?: Date;
	picker?: SelectOption;
};

export type PickingFulfilmentLineType = {
	product?: ProductType;
	batch?: SelectOption;
	quantity: string;
	expiryDate: string | null;
	location?: SelectOption;
};

export const EmptyFulfilmentPickingLine: PickingFulfilmentLineType = {
	product: undefined,
	batch: undefined,
	expiryDate: null,
	quantity: "",
	location: undefined,
};

export type PackingFulfilmentFormValues = {
	lines: PackingFulfilmentLineType[];
	requiredBy?: Date;
	packer?: SelectOption;
};

export type PackingFulfilmentLineType = {
	product?: ProductType;
	batch?: SelectOption;
	quantity: string;
	expiryDate: string | null;
	packingNumber: string;
	location?: SelectOption;
};

export type ShippingFulfilmentFormValues = {
	lines: ShippingFulfilmentLineType[];
};

export type ShippingFulfilmentLineType = {
	shipDate?: Date;
	carrier?: SelectOption;
	waybillNumber: string;
	trackingLink: string;
	packageNumber: string;
};

export type DefaultInvoicingFormValues = {
	lines: DefaultOrderLineType[];
	serviceLines: OrderServiceLineType[];
	invoiceNumber: string;
	invoiceDate?: Date;
	dueDate?: Date;
};

export type MeatInvoicingFormValues = {
	lines: MeatOrderLineType[];
	serviceLines: OrderServiceLineType[];
	invoiceNumber: string;
	invoiceDate?: Date;
	dueDate?: Date;
};

export type WoolworthInvoicingFormValues = {
	lines: WoolworthsOrderLineType[];
	serviceLines: OrderServiceLineType[];
	invoiceNumber: string;
	invoiceDate?: Date;
	dueDate?: Date;
};

export type RestockFormValues = {
	lines: RestockLineType[];
};

export type RestockLineType = {
	product?: ProductType;
	batch?: SelectOption;
	quantity: string;
	expiryDate: string | null;
	location?: SelectOption;
};

export const EmptyRestockLine: RestockLineType = {
	product: undefined,
	batch: undefined,
	expiryDate: null,
	quantity: "",
	location: undefined,
};
