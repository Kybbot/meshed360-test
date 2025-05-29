import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";

import { showError } from "@/utils/showError";
import { axiosInstance } from "@/utils/axios";

import { ApiError, ApiResult } from "@/@types/api";
import { CreateProductBody, ProductType } from "@/@types/products";

export const useCreateProduct = () => {
	return useMutation<
		ApiResult<ProductType>,
		AxiosError<ApiError>,
		{
			organisationId?: string;
			body: CreateProductBody;
		}
	>({
		mutationKey: ["create-product"],
		mutationFn: async ({ organisationId, body }) => {
			const { data } = await axiosInstance.post<ApiResult<ProductType>>(
				`/api/organisation/products/${organisationId}`,
				JSON.stringify(body),
			);

			return data;
		},
		onSuccess: async () => {
			toast.success("New Product was successfully added");
		},
		onError(error) {
			showError(error);
		},
	});
};
