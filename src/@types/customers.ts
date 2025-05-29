import { SelectOption } from "./selects";

export const statuses = [
	{ id: "ACTIVE", name: "Active" },
	{ id: "INACTIVE", name: "Archived" },
];

export const statusesByKey: Record<string, { id: string; name: string }> = {
	ACTIVE: { id: "ACTIVE", name: "Active" },
	INACTIVE: { id: "INACTIVE", name: "Archived" },
};

export type GetCustomerSettingsResponseType = {
	salesReps: {
		id: string;
		name: string;
	}[];
	paymentTerms: {
		id: string;
		name: string;
	}[];
	priceList: {
		id: string;
		name: string;
	}[];
	xeroTaxRate: {
		id: string;
		name: string;
	}[];
	xeroAccounts: {
		id: string;
		name: string;
	}[];
};

export type CustomerType = {
	id: string;
	name: string;
	account: string;
	vatNumber: string;

	contact: {
		name?: string;
		phone?: string;
		email?: string;
	};

	address?: string;

	// invoiceTemplate: string;
	currency?: string;
	salesRep?: string;
	dueAmount: string;
	creditLimit: string;
};

export type GetAllCustomersResponseType = {
	customers: CustomerType[];
	totalCount: number;
	totalPages: number;
	isSearch: boolean;
};

export type EditCustomerType = {
	id: string;
	name: string;
	accountNumber: string;
	status: "ACTIVE" | "INACTIVE";
	vatNumber: string;
	creditLimit: string;
	discount: string;
	comments: string;

	salesRep?: {
		id: string;
		name: string;
	} | null;
	paymentTerm?: {
		id: string;
		paymentTerm: string;
	} | null;
	priceList?: {
		id: string;
		name: string;
	} | null;
	taxRule?: {
		id: string;
		name: string;
	} | null;
	saleAccount: {
		id: string;
		name: string;
	} | null;
};

export type GetCustomersByIdResponseType = EditCustomerType;

export type CustomerFormValues = {
	name: string;
	accountNumber: string;
	status: SelectOption;
	vatNumber: string;
	creditLimit: string;
	discount: string;
	salesRep: SelectOption;
	paymentTerm: SelectOption;
	priceList: SelectOption;
	taxRule: SelectOption;
	salesAccount: SelectOption;
	comments: string;
};

export type CreateCustomerBody = {
	name: string;
	accountNumber: string;
	status: string;
	vatNumber: string | null;
	creditLimit: string | null;
	discount: string | null;

	salesRepId: string | null;
	paymentTermId: string | null;
	priceListId: string | null;
	taxRuleId: string | null;
	salesAccountId: string | null;

	comments: string | null;
	organisationId: string;
};

// ADDRESSES
export const address = [
	{ id: "SHIPPING", name: "Shipping" },
	{ id: "BILLING", name: "Billing" },
	{ id: "BILLING_AND_SHIPPING", name: "Shipping & Billing" },
];

export const addressByKey: Record<string, { id: string; name: string }> = {
	SHIPPING: { id: "SHIPPING", name: "Shipping" },
	BILLING: { id: "BILLING", name: "Billing" },
	BILLING_AND_SHIPPING: { id: "BILLING_AND_SHIPPING", name: "Shipping & Billing" },
};

export type AddressFormValue = {
	addressLine1: string;
	addressLine2: string;
	addressLine3: string;
	addressLine4: string;
	addressType: { id: "SHIPPING" | "BILLING" | "BILLING_AND_SHIPPING"; name: string };
	postalCode: string;
	city: string;
	region: string;
	country: string;
};

export type CustomerAddressesType = {
	addressLine1: string;
	addressLine2?: string;
	addressLine3?: string;
	addressLine4?: string;
	addressType: "SHIPPING" | "BILLING" | "BILLING_AND_SHIPPING";
	city?: string;
	country?: string;
	postalCode?: string;
	region?: string;
	isDefault: boolean;
};

export type NormalizedAddressesData = {
	totalCount: number;
	totalPages: number;
	addresses: CustomerAddressesType[];
};

export type GetAllCustomerAddressesResponseType = {
	totalCount: number;
	totalPages: number;
	addresses: CustomerAddressesType[];
};

export type CreateAddressBody = {
	addresses: CustomerAddressesType[];
};

// CONTACTS
export type CustomerContactsType = {
	name: string;
	email?: string;
	phone?: string;
	comment: string;
	isDefault: boolean;
};

export type GetAllCustomerContactsResponseType = {
	contacts: CustomerContactsType[];
	totalCount: number;
	totalPages: number;
};

export type CreateContactsBody = {
	name: string;
	email: string;
	phone: string;
	comment: string;
	isDefault: boolean;
};
