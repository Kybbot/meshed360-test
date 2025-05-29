import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { axiosInstance } from "@/utils/axios";

import { ApiError, ApiResult } from "@/@types/api";
import { CreateStockPickerBody, StockPickerType } from "@/@types/stockPickers";

export const useCreateStockPicker = () => {
	const queryClient = useQueryClient();

	return useMutation<
		ApiResult<StockPickerType>,
		AxiosError<ApiError>,
		{
			organisationId: string;
			body: CreateStockPickerBody;
		}
	>({
		mutationFn: async ({ body, organisationId }) => {
			const { data } = await axiosInstance.post<ApiResult<StockPickerType>>(
				`/api/organisation/pickers/${organisationId}`,
				JSON.stringify(body),
			);

			return data;
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: ["get-all-stock-pickers"],
			});
			toast.success("New Stock Picker was successfully added");
		},
	});
};
