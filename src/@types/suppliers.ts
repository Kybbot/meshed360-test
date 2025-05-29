import { SelectOption } from "./selects";

export const statuses = [
	{ id: "active", name: "Active" },
	{ id: "inactive", name: "Archived" },
];

export const statusesByKey: Record<string, { id: string; name: string }> = {
	active: { id: "active", name: "Active" },
	inactive: { id: "inactive", name: "Archived" },
};

export type GetSupplierSettingsResponseType = {
	currencies: {
		id: string;
		name: string;
	}[];
	paymentTerms: {
		id: string;
		name: string;
	}[];
	taxRates: {
		id: string;
		name: string;
	}[];
	purchaseAccounts: {
		id: string;
		name: string;
	}[];
};

export type SupplierType = {
	id: string;
	name: string;
	accountNumber: string;
	taxNumber: string;
	contact?: {
		name: string;
		email: string;
		phone: string;
		comment: string;
	};
	currency: string;
	isActive: boolean;
};

export type GetAllSuppliersResponseType = {
	suppliers: SupplierType[];
	totalCount: number;
	totalPages: number;
	isSearch: boolean;
};

export type EditSupplierType = {
	id: string;
	name: string;
	accountNumber: string;
	isActive: boolean;
	taxNumber: string;
	creditLimit: string;
	discount: string;

	currency: SelectOption;
	paymentTerm: SelectOption;
	purchaseTax: SelectOption;
	defaultPurchaseAccount: SelectOption;

	comments: string;
};

export type GetSupplierByIdResponseType = EditSupplierType;

export type SupplierFormValues = {
	name: string;
	accountNumber: string;
	isActive: SelectOption;
	taxNumber?: string;
	creditLimit?: string;
	discount?: string;
	currency: SelectOption;
	paymentTerm: SelectOption;
	purchaseTax: SelectOption;
	purchaseAccount: SelectOption;
	comments?: string;
};

export type CreateSupplierBody = {
	name: string;
	accountNumber: string;
	isActive: boolean;
	taxNumber: string | null;
	creditLimit: string | null;
	discount: string | null;

	currency: string | null;
	paymentTermId: string | null;
	purchaseTaxId: string | null;
	defaultPurchaseAccount: string;

	organisationId: string;
	comments: string | null;
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

export type SupplierAddressesType = {
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
	addresses: SupplierAddressesType[];
};

export type GetAllAddressesResponseType = {
	totalCount: number;
	totalPages: number;
	addresses: SupplierAddressesType[];
};

export type CreateAddressBody = {
	addresses: SupplierAddressesType[];
};

// CONTACTS
export type ContactsType = {
	name: string;
	email?: string;
	phone?: string;
	comment: string;
	isDefault: boolean;
};

export type GetAllContactsResponseType = {
	contacts: ContactsType[];
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
