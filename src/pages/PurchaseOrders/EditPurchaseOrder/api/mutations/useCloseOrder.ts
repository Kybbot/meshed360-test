import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { showError } from "@/utils/showError";
import { axiosInstance } from "@/utils/axios";

import {
	ClosePurchaseOrderResponseType,
	GetPurchaseOrderByIdResponseType,
} from "@/@types/purchaseOrder/order";
import { ApiError, ApiResult } from "@/@types/api";

export const useCloseOrder = () => {
	const queryClient = useQueryClient();

	return useMutation<
		ApiResult<ClosePurchaseOrderResponseType>,
		AxiosError<ApiError>,
		{
			body: { id: string };
		}
	>({
		mutationFn: async ({ body }) => {
			const { data } = await axiosInstance.post<ApiResult<ClosePurchaseOrderResponseType>>(
				`/api/purchase-orders/lines/close`,
				JSON.stringify(body),
			);

			return data;
		},
		onSuccess: async (newData, variables) => {
			toast.success("Purchase Order were successfully closed");

			queryClient.setQueriesData<ApiResult<GetPurchaseOrderByIdResponseType>>(
				{ queryKey: ["get-purchase-order-by-id", variables.body.id] },
				(oldData) => {
					if (oldData) {
						return {
							data: {
								...oldData.data,
								status: newData.data.status,
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
