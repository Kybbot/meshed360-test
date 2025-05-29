import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { showError } from "@/utils/showError";
import { axiosInstance } from "@/utils/axios";

import { ApiError, ApiResult } from "@/@types/api";
import { GetPurchaseOrderByIdResponseType } from "@/@types/purchaseOrder/order";
import { GetUnstokResponseType, VoidUnstockResponseType } from "@/@types/purchaseOrder/unstock";

export const useVoidUnstock = (handleNewUnstock: () => void) => {
	const queryClient = useQueryClient();

	return useMutation<
		ApiResult<VoidUnstockResponseType>,
		AxiosError<ApiError>,
		{
			orderId: string;
			body: { id: string };
		}
	>({
		mutationFn: async ({ body }) => {
			const { data } = await axiosInstance.post<ApiResult<VoidUnstockResponseType>>(
				`/api/purchase-orders/unstock/void`,
				JSON.stringify(body),
			);

			return data;
		},
		onSuccess: async (newData, variables) => {
			toast.success("Unstock was successfully voided");

			queryClient.setQueryData<ApiResult<GetUnstokResponseType>>(
				["get-purchase-order-unstock", variables.orderId],
				(oldData) => {
					if (oldData) {
						handleNewUnstock();

						return {
							data: null,
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
