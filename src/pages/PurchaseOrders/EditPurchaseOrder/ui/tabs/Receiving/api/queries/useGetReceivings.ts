import { AxiosError } from "axios";
import { useStore } from "zustand";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { orgStore } from "@/app/stores/orgStore";

import { axiosInstance } from "@/utils/axios";

import { ApiError, ApiResult } from "@/@types/api";
import { GetAllProductsResponseType } from "@/@types/products";
import { GetAllReceivingResponseType } from "@/@types/purchaseOrder/receiving";

export const useGetReceiving = ({
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

	return useQuery<ApiResult<GetAllReceivingResponseType>, AxiosError<ApiError>>({
		queryKey: ["get-purchase-order-receivings", purchaseOrderId],
		queryFn: async () => {
			const { data } = await axiosInstance.get<ApiResult<GetAllReceivingResponseType>>(
				`/api/purchase-orders/receivings/${purchaseOrderId}`,
			);

			return {
				data: {
					receivings: data.data.receivings.map((receivings) => {
						return {
							...receivings,
							lines: receivings.lines.map((line) => {
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
