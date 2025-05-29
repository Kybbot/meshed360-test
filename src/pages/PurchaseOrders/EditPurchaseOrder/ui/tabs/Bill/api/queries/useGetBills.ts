import { AxiosError } from "axios";
import { useStore } from "zustand";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { orgStore } from "@/app/stores/orgStore";

import { axiosInstance } from "@/utils/axios";

import { ApiError, ApiResult } from "@/@types/api";
import { GetAllProductsResponseType } from "@/@types/products";
import { GetAllBillsResponseType } from "@/@types/purchaseOrders";

export const useGetBills = ({
	getData = true,
	purchaseOrderId,
}: {
	getData?: boolean;
	purchaseOrderId?: string;
}) => {
	const { orgId } = useStore(orgStore);
	const queryClient = useQueryClient();

	const products = queryClient.getQueryData<ApiResult<GetAllProductsResponseType>>([
		"get-select-products",
		orgId,
		"",
		{ isActive: true, type: "stock" },
	]);

	return useQuery<ApiResult<GetAllBillsResponseType>, AxiosError<ApiError>>({
		queryKey: ["get-purchase-order-bills", purchaseOrderId],
		queryFn: async () => {
			const { data } = await axiosInstance.get<ApiResult<GetAllBillsResponseType>>(
				`/api/purchase-orders/bills/${purchaseOrderId}`,
			);

			return {
				data: {
					bills: data.data.bills.map((bill) => {
						return {
							...bill,
							lines: bill.lines.map((line) => {
								if (products) {
									const currentProduct = products.data.allProducts.find(
										(item) => item.id === line.product.id,
									);

									return { ...line, product: currentProduct ?? line.product };
								}

								return line;
							}),
						};
					}),
				},
				status: data.status,
			};
		},
		enabled: getData && !!purchaseOrderId,
	});
};
