import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";

import { showError } from "@/utils/showError";
import { axiosInstance } from "@/utils/axios";

import { ApiError, ApiResult } from "@/@types/api";
import { CreateProductBody, ProductType } from "@/@types/products";

export const useUpdateProduct = () => {
	return useMutation<
		ApiResult<ProductType>,
		AxiosError<ApiError>,
		{
			productId?: string;
			body: CreateProductBody;
		}
	>({
		mutationKey: ["update-product"],
		mutationFn: async ({ productId, body }) => {
			const { data } = await axiosInstance.patch<ApiResult<ProductType>>(
				`/api/organisation/products/${productId}`,
				JSON.stringify(body),
			);

			return data;
		},
		onSuccess: async () => {
			toast.success("Product was successfully updated");
		},
		onError(error) {
			showError(error);
		},
	});
};
