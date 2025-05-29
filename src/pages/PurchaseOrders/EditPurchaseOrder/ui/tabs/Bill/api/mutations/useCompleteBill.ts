import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { showError } from "@/utils/showError";
import { axiosInstance } from "@/utils/axios";

import { ApiError, ApiResult } from "@/@types/api";
import { GetPurchaseOrderByIdResponseType } from "@/@types/purchaseOrder/order";
import { CompleteBillStatusResponseType, GetAllBillsResponseType } from "@/@types/purchaseOrders";

export const useCompleteBill = () => {
	const queryClient = useQueryClient();

	return useMutation<
		ApiResult<CompleteBillStatusResponseType>,
		AxiosError<ApiError>,
		{
			orderId: string;
			body: { id: string };
		}
	>({
		mutationFn: async ({ body }) => {
			const { data } = await axiosInstance.post<ApiResult<CompleteBillStatusResponseType>>(
				`/api/purchase-orders/bills/complete`,
				JSON.stringify(body),
			);

			return data;
		},
		onSuccess: async (newData, variables) => {
			toast.success("Bill was successfully completed");

			queryClient.setQueryData<ApiResult<GetAllBillsResponseType>>(
				["get-purchase-order-bills", variables.orderId],
				(oldData) => {
					if (oldData) {
						return {
							data: {
								bills: oldData.data.bills.map((item) => {
									if (variables.body.id === item.id) {
										return {
											...item,
											status: newData.data.billStatus,
										};
									}
									return item;
								}),
							},
							status: oldData.status,
						};
					}

					return oldData;
				},
			);

			queryClient.setQueriesData<ApiResult<GetPurchaseOrderByIdResponseType>>(
				{ queryKey: ["get-purchase-order-by-id", variables.orderId] },
				(oldData) => {
					if (oldData) {
						return {
							data: {
								...oldData.data,
								status: newData.data.orderStatus,
							},
							status: oldData.status,
						};
					}
					return oldData;
				},
			);
		},
		onError(error) {
			showError(error);
		},
	});
};
