import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";

import { axiosInstance } from "@/utils/axios";
import { showError } from "@/utils/showError";

import { ApiError, ApiResult } from "@/@types/api";
import { SetProductPricesRequestType } from "@/@types/priceLists";

export const useSetProductPrices = () => {
	return useMutation<
		ApiResult<never>,
		AxiosError<ApiError>,
		{
			productId: string;
			body: SetProductPricesRequestType;
		}
	>({
		mutationFn: async ({ productId, body }) => {
			const { data } = await axiosInstance.post<ApiResult<never>>(
				`/api/organisation/products/${productId}/prices`,
				body,
			);
			return data;
		},
		onSuccess: () => {
			toast.success("Prices were successfully updated");
		},
		onError: (error) => {
			showError(error);
		},
	});
};
