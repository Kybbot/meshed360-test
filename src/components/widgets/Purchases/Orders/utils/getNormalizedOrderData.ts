import { getFormDayPickerDate } from "@/utils/date";

import { PurchaseOrderFormValues, CreatePurchaseOrderBodyType } from "@/@types/purchaseOrder/order";

export const getNormalizedOrderData = (
	data: PurchaseOrderFormValues,
): Omit<CreatePurchaseOrderBodyType, "organisationId"> => {
	return {
		supplierId: data.supplier.id,
		contact: {
			name: data.contact?.name || "",
			phone: data.phone || "",
		},
		vendorAddress: {
			addressLine1: data.vendorAddress?.name || "",
			addressLine2: data.vendorAddressLine2 || "",
		},
		reference: data.reference || "",

		stockFirst: data.stockFirst,
		billFirst: data.billFirst,
		blindBill: data.blindBill,
		additionalExpense: data.additionalExpense,
		paymentTermId: data.paymentTerm.id,
		expectedDeliveryDate: getFormDayPickerDate(data.expectedDeliveryDate, true),
		inventoryAccountId: data.inventoryAccount.id,
		taxInclusive: data.taxInclusive,
		taxRuleId: data.taxRule.id,

		shippingDate: getFormDayPickerDate(data.shippingDate, true),
		warehouseId: data.warehouse.id,
		shipToDifferentCompany: data.shipToDifferentCompany,
		shippingAddress: {
			addressLine1: data.shippingAddress ? data.shippingAddress.name : data.shippingAddressText || "",
			addressLine2: data.shippingAddressLine2 || "",
		},
		comments: data.comments || "",
	};
};
