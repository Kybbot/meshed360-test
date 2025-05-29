import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";

import { axiosInstance } from "@/utils/axios";
import { showError } from "@/utils/showError";

import { ApiError, ApiResult } from "@/@types/api";
import { CreateStockTakeType, GetStockTakeResponseType } from "@/@types/stockControl";

export const useSaveStockTake = () => {
	return useMutation<
		ApiResult<GetStockTakeResponseType>,
		AxiosError<ApiError>,
		{
			organisationId: string;
			stockTakeId: string;
			body: CreateStockTakeType;
			options?: {
				showSuccessToast?: boolean;
			};
		}
	>({
		mutationFn: async ({ organisationId, stockTakeId, body }) => {
			const { data } = await axiosInstance.post<ApiResult<GetStockTakeResponseType>>(
				`/api/stock-control/${organisationId}/stock-takes/${stockTakeId}/save`,
				body,
			);
			return data;
		},
		onSuccess: (_newData, variables) => {
			if (variables.options?.showSuccessToast !== false) {
				toast.success("Stock Take was successfully saved");
			}
		},
		onError: (error) => {
			showError(error);
		},
	});
};
