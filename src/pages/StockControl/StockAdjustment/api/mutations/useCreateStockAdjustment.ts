import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";

import { axiosInstance } from "@/utils/axios";
import { showError } from "@/utils/showError";

import { ApiError, ApiResult } from "@/@types/api";
import { CreateStockAdjustmentType, GetStockAdjustmentResponseType } from "@/@types/stockControl";

export const useCreateStockAdjustment = () => {
	return useMutation<
		ApiResult<GetStockAdjustmentResponseType>,
		AxiosError<ApiError>,
		{ organisationId: string; body: CreateStockAdjustmentType }
	>({
		mutationFn: async ({ organisationId, body }) => {
			const { data } = await axiosInstance.post<ApiResult<GetStockAdjustmentResponseType>>(
				`/api/stock-control/${organisationId}/adjustments`,
				body,
			);

			return data;
		},
		onSuccess: () => {
			toast.success("New Stock Adjustment was successfully added");
		},
		onError: (error) => {
			showError(error);
		},
	});
};
