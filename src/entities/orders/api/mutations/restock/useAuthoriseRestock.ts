import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { showError } from "@/utils/showError.ts";
import { axiosInstance } from "@/utils/axios.ts";

import { ApiError, ApiResult } from "@/@types/api.ts";
import { ExtendedSalesOrder, RestockType, UpdateRestockType } from "@/@types/salesOrders/api.ts";

export const useAuthoriseRestock = () => {
	const queryClient = useQueryClient();

	return useMutation<
		ApiResult<{ salesOrderRestock: RestockType; salesOrder: ExtendedSalesOrder }>,
		AxiosError<ApiError>,
		{
			organisationId: string;
			orderId: string;
			body: UpdateRestockType;
		}
	>({
		mutationKey: ["authorise-restock"],
		mutationFn: async ({ organisationId, orderId, body }) => {
			await axiosInstance.post(
				`/api/sales-orders/${organisationId}/orders/${orderId}/restock/save`,
				JSON.stringify(body),
			);

			const { data } = await axiosInstance.post<
				ApiResult<{ salesOrderRestock: RestockType; salesOrder: ExtendedSalesOrder }>
			>(`/api/sales-orders/${organisationId}/orders/${orderId}/restock/authorize`, JSON.stringify(body));

			return data;
		},
		onSuccess: async (_, { organisationId, orderId }) => {
			await queryClient.invalidateQueries({
				queryKey: ["get-restock-by-id", organisationId, orderId],
				exact: true,
			});

			toast.success("Restock was successfully authorized");
		},
		onError(error) {
			showError(error);
		},
	});
};
