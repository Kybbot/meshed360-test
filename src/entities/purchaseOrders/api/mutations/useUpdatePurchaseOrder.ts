import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { showError } from "@/utils/showError";
import { axiosInstance } from "@/utils/axios";

import { ApiError, ApiResult } from "@/@types/api";
import { CreatePurchaseOrderBodyType } from "@/@types/purchaseOrder/order";

export const useUpdatePurchaseOrder = () => {
	const queryClient = useQueryClient();

	return useMutation<
		ApiResult<never>,
		AxiosError<ApiError>,
		{ body: { id: string } & Omit<CreatePurchaseOrderBodyType, "organisationId"> }
	>({
		mutationKey: ["update-purchase-order"],
		mutationFn: async ({ body }) => {
			const { data } = await axiosInstance.patch<ApiResult<never>>(
				`/api/purchase-orders`,
				JSON.stringify(body),
			);

			return data;
		},
		onSuccess: async (_newData, variables) => {
			toast.success("Purchase Order was successfully updated");

			queryClient.invalidateQueries({ queryKey: ["get-purchase-order-by-id", variables.body.id] });
		},
		onError(error) {
			showError(error);
		},
	});
};
