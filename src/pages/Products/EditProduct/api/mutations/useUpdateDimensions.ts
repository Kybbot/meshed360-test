import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";

import { showError } from "@/utils/showError";
import { axiosInstance } from "@/utils/axios";

import { ApiError, ApiResult } from "@/@types/api";
import { UpdateDimensionsBody } from "@/@types/products";

export const useUpdateDimensions = () => {
	return useMutation<
		ApiResult<never>,
		AxiosError<ApiError>,
		{
			productId: string;
			body: UpdateDimensionsBody;
		}
	>({
		mutationFn: async ({ productId, body }) => {
			const { data } = await axiosInstance.patch<ApiResult<never>>(
				`/api/product/dimensions/${productId}`,
				JSON.stringify(body),
			);

			return data;
		},
		onSuccess: async () => {
			toast.success("Dimensions were successfully updated");
		},
		onError(error) {
			showError(error);
		},
	});
};
