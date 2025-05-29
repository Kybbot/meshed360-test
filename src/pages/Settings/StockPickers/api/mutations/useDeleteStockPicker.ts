import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { axiosInstance } from "@/utils/axios";

import { ApiError, ApiResult } from "@/@types/api";
import { StockPickerType } from "@/@types/stockPickers";

export const useDeleteStockPicker = () => {
	const queryClient = useQueryClient();

	return useMutation<ApiResult<StockPickerType>, AxiosError<ApiError>, { pickerId: string }>({
		mutationFn: async ({ pickerId }) => {
			const { data } = await axiosInstance.delete<ApiResult<StockPickerType>>(
				`api/organisation/pickers/${pickerId}`,
			);

			return data;
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: ["get-all-stock-pickers"],
			});
			toast.success("Stock Picker was successfully deleted");
		},
	});
};
