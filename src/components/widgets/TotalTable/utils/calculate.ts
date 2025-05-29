import {
	WoolworthsOrderLineType,
	DefaultOrderLineType,
	MeatOrderLineType,
	OrderServiceLineType,
} from "@/@types/salesOrders/local.ts";
import { OrderLineFormType, AdditionalLineFormType } from "@/@types/purchaseOrder/orderLines";

export const calculateTotalTableValues = (
	data: (
		| WoolworthsOrderLineType
		| DefaultOrderLineType
		| MeatOrderLineType
		| OrderServiceLineType
		| OrderLineFormType
		| AdditionalLineFormType
	)[],
	taxInclusive: boolean,
) => {
	return data.reduce(
		(prev, curr) => {
			const lineTotal = +curr.total || 0;

			const effectiveTaxRate = curr.taxType ? curr.taxType.effectiveTaxRate / 100 : 0;

			const beforeTax =
				prev.beforeTax + (taxInclusive ? lineTotal - lineTotal * effectiveTaxRate : lineTotal);
			const tax = prev.tax + lineTotal * effectiveTaxRate;

			return {
				beforeTax,
				tax,
				total: beforeTax + tax,
			};
		},
		{ beforeTax: 0, tax: 0, total: 0 },
	);
};
