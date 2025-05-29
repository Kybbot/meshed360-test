import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";

import { showError } from "@/utils/showError";
import { axiosInstance } from "@/utils/axios";

import { ApiError, ApiResult } from "@/@types/api";
import { CreatePurchaseOrderBodyType, CreatePurchaseOrderResponseType } from "@/@types/purchaseOrder/order";

export const useCreatePurchaseOrder = () => {
	return useMutation<
		ApiResult<CreatePurchaseOrderResponseType>,
		AxiosError<ApiError>,
		{ body: CreatePurchaseOrderBodyType }
	>({
		mutationKey: ["create-purchase-order"],
		mutationFn: async ({ body }) => {
			const { data } = await axiosInstance.post<ApiResult<CreatePurchaseOrderResponseType>>(
				`/api/purchase-orders`,
				JSON.stringify(body),
			);

			return data;
		},
		onSuccess: async () => {
			toast.success("New Purchase Order was successfully added");
		},
		onError(error) {
			showError(error);
		},
	});
};
