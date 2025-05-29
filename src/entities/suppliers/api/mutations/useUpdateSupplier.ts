import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";

import { showError } from "@/utils/showError";
import { axiosInstance } from "@/utils/axios";

import { ApiError, ApiResult } from "@/@types/api";
import { CreateSupplierBody, SupplierType } from "@/@types/suppliers";

export const useUpdateSupplier = () => {
	return useMutation<
		ApiResult<SupplierType>,
		AxiosError<ApiError>,
		{
			supplierId: string;
			body: CreateSupplierBody;
		}
	>({
		mutationKey: ["update-supplier"],
		mutationFn: async ({ supplierId, body }) => {
			const { data } = await axiosInstance.patch<ApiResult<SupplierType>>(
				`/api/suppliers/${supplierId}`,
				JSON.stringify(body),
			);

			return data;
		},
		onSuccess: async () => {
			toast.success("Supplier was successfully updated");
		},
		onError(error) {
			showError(error);
		},
	});
};
