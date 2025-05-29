import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { axiosInstance } from "@/utils/axios";

import { ApiError, ApiResult } from "@/@types/api";
import { CreateStockPickerBody, StockPickerType } from "@/@types/stockPickers";

export const useUpdateStockPicker = () => {
	const queryClient = useQueryClient();

	return useMutation<
		ApiResult<StockPickerType>,
		AxiosError<ApiError>,
		{
			pickerId: string;
			body: CreateStockPickerBody;
		}
	>({
		mutationFn: async ({ pickerId, body }) => {
			const { data } = await axiosInstance.patch<ApiResult<StockPickerType>>(
				`/api/organisation/pickers/${pickerId}`,
				JSON.stringify(body),
			);

			return data;
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: ["get-all-stock-pickers"],
			});
			toast.success("Stock Picker was successfully updated");
		},
	});
};
