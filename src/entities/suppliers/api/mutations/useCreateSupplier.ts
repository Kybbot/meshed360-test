import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";

import { showError } from "@/utils/showError";
import { axiosInstance } from "@/utils/axios";

import { ApiError, ApiResult } from "@/@types/api";
import { CreateSupplierBody, SupplierType } from "@/@types/suppliers";

export const useCreateSupplier = () => {
	return useMutation<
		ApiResult<SupplierType>,
		AxiosError<ApiError>,
		{
			body: CreateSupplierBody;
		}
	>({
		mutationKey: ["create-supplier"],
		mutationFn: async ({ body }) => {
			const { data } = await axiosInstance.post<ApiResult<SupplierType>>(
				`/api/suppliers`,
				JSON.stringify(body),
			);

			return data;
		},
		onSuccess: async () => {
			toast.success("New Supplier was successfully added");
		},
		onError(error) {
			showError(error);
		},
	});
};
