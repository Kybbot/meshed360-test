import { CreateSupplierBody, SupplierFormValues } from "@/@types/suppliers";

export const getNormalizedSupplierData = (
	data: SupplierFormValues,
): Omit<CreateSupplierBody, "organisationId"> => {
	return {
		name: data.name,
		accountNumber: data.accountNumber,
		isActive: data.isActive.id === "active" ? true : false,
		taxNumber: data.taxNumber || null,
		creditLimit: data.creditLimit || null,
		discount: data.discount || null,
		currency: data.currency?.id || null,
		paymentTermId: data.paymentTerm?.id || null,
		purchaseTaxId: data.purchaseTax?.id || null,
		defaultPurchaseAccount: data.purchaseAccount.id,
		comments: data.comments || null,
	};
};
