import { CreateCustomerBody, CustomerFormValues } from "@/@types/customers";

export const getNormalizedCustomerData = (
	data: CustomerFormValues,
): Omit<CreateCustomerBody, "organisationId"> => {
	return {
		name: data.name,
		accountNumber: data.accountNumber,
		status: data.status.id,
		vatNumber: data.vatNumber || null,
		creditLimit: data.creditLimit || null,
		discount: data.discount || null,
		salesRepId: data.salesRep?.id || null,
		paymentTermId: data.paymentTerm?.id || null,
		priceListId: data.priceList?.id || null,
		taxRuleId: data.taxRule?.id || null,
		salesAccountId: data.salesAccount?.id || null,
		comments: data.comments || null,
	};
};
