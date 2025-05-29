import { CreditNoteType, FulfilmentType, InvoiceType } from "@/@types/salesOrders/api.ts";
import { ProductType } from "@/@types/products.ts";
import { useGetProducts } from "@/entities/products";
import { useMemo } from "react";
import { SelectOption } from "@/@types/selects.ts";

interface Props {
	sourceLines: { product: SelectOption; quantity: string }[];
	fulfilment?: FulfilmentType[];
	invoicing?: InvoiceType[];
	creditNotes?: CreditNoteType[];
	currentLines?: { product?: ProductType; quantity?: string }[];
	orgId: string;
	template?: "WOOL";
}

export interface ProductForSelect extends ProductType {
	count: number;
}

export interface MapProductsArgs {
	products: ProductType[];
	sourceLines: { product: SelectOption; quantity: string }[];
	fulfilment?: FulfilmentType[];
	invoicing?: InvoiceType[];
	creditNotes?: CreditNoteType[];
}

export interface ValidateQuantityArgs {
	productWithCount?: ProductForSelect;
	lines: { product?: ProductType; quantity?: string }[];
}

export const validateQuantity = ({ productWithCount, lines }: ValidateQuantityArgs) => {
	if (productWithCount) {
		const currentReservedCount = lines
			.filter((cl) => cl.product?.id === productWithCount.id)
			.reduce((sum, cl) => sum + (Number(cl.quantity) || 0), 0);

		if (currentReservedCount > productWithCount.count) {
			return "Max count exceeded";
		} else {
			return true;
		}
	}
	return "Max count exceeded";
};

export const mapProductsToProductsWithCount = ({
	products,
	sourceLines,
	fulfilment,
	invoicing,
	creditNotes,
}: MapProductsArgs): ProductForSelect[] => {
	return products
		.filter((prod) => sourceLines.some((line) => line.product.id === prod.id))
		.map((prod) => {
			const orderedCount = sourceLines
				.filter((line) => line.product.id === prod.id)
				.reduce((sum, line) => sum + (Number(line.quantity) || 0), 0);

			const authorizedPickingLines =
				fulfilment?.filter((f) => f.picking?.status === "AUTHORIZED").flatMap((f) => f.picking!.lines) ?? [];
			const pickedCount = authorizedPickingLines
				.filter((line) => line.product.id === prod.id)
				.reduce((sum, line) => sum + (Number(line.quantity) || 0), 0);

			const authorizedInvoiceLines =
				invoicing?.filter((inv) => inv.status === "AUTHORIZED").flatMap((inv) => inv.lines) ?? [];
			const invoicedCount = authorizedInvoiceLines
				.filter((line) => line.product.id === prod.id)
				.reduce((sum, line) => sum + (Number(line.quantity) || 0), 0);

			const authorizedCreditLines =
				creditNotes?.filter((cn) => cn.status === "AUTHORIZED").flatMap((cn) => cn.lines) ?? [];
			const creditedCount = authorizedCreditLines
				.filter((line) => line.product.id === prod.id)
				.reduce((sum, line) => sum + (Number(line.quantity) || 0), 0);

			const count = Math.max(0, orderedCount - pickedCount - invoicedCount - creditedCount);

			return { ...prod, count };
		});
};

export default ({
	sourceLines,
	fulfilment,
	invoicing,
	creditNotes,
	currentLines = [],
	orgId,
	template,
}: Props): { products: ProductForSelect[]; isLoading: boolean } => {
	const { data: productsData, isLoading } = useGetProducts({
		type: "stock",
		organisationId: orgId,
		template,
	});

	const products = useMemo<ProductForSelect[]>(() => {
		if (!productsData) return [];
		return mapProductsToProductsWithCount({
			products: productsData.data.allProducts,
			sourceLines,
			fulfilment,
			invoicing,
			creditNotes,
		});
	}, [productsData, sourceLines, fulfilment, invoicing, creditNotes, currentLines]);

	return {
		products,
		isLoading,
	};
};
