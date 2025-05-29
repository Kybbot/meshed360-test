import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";

import { axiosInstance } from "@/utils/axios";
import { showError } from "@/utils/showError";

import { ApiError, ApiResult } from "@/@types/api";
import { GetStockTakeResponseType } from "@/@types/stockControl";

export const useVoidStockTake = () => {
	return useMutation<
		ApiResult<GetStockTakeResponseType>,
		AxiosError<ApiError>,
		{
			organisationId: string;
			stockTakeId: string;
		}
	>({
		mutationFn: async ({ organisationId, stockTakeId }) => {
			const { data } = await axiosInstance.post<ApiResult<GetStockTakeResponseType>>(
				`/api/stock-control/${organisationId}/stock-takes/${stockTakeId}/void`,
			);

			return data;
		},
		onSuccess: () => {
			toast.success("Stock Take was successfully voided");
		},
		onError: (error) => {
			showError(error);
		},
	});
};
