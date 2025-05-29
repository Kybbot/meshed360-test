import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { showError } from "@/utils/showError";
import { axiosInstance } from "@/utils/axios";

import { ApiError, ApiResult } from "@/@types/api";
import { GetPurchaseOrderByIdResponseType } from "@/@types/purchaseOrder/order";
import { VoidPurchaseOrderLinesResponseType } from "@/@types/purchaseOrder/orderLines";

export const useVoidOrdersLines = () => {
	const queryClient = useQueryClient();

	return useMutation<
		ApiResult<VoidPurchaseOrderLinesResponseType>,
		AxiosError<ApiError>,
		{
			body: { id: string };
		}
	>({
		mutationFn: async ({ body }) => {
			const { data } = await axiosInstance.post<ApiResult<VoidPurchaseOrderLinesResponseType>>(
				`/api/purchase-orders/lines/void`,
				JSON.stringify(body),
			);

			return data;
		},
		onSuccess: async (newData, variables) => {
			toast.success("Purchase Order Lines were successfully voided");

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
