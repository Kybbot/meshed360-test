import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";

import { showError } from "@/utils/showError";
import { axiosInstance } from "@/utils/axios";

import { ApiError, ApiResult } from "@/@types/api";
import { SaveProductBOMBody } from "@/@types/products";

export const useSaveProductBom = () => {
	return useMutation<
		ApiResult<never>,
		AxiosError<ApiError>,
		{
			productId: string;
			body: SaveProductBOMBody;
		}
	>({
		mutationFn: async ({ productId, body }) => {
			const { data } = await axiosInstance.post<ApiResult<never>>(
				`/api/organisation/products/${productId}/bom`,
				body,
			);
			return data;
		},
		onSuccess: () => {
			toast.success("Bill of Materials saved successfully");
		},
		onError: (error) => {
			showError(error);
		},
	});
};
