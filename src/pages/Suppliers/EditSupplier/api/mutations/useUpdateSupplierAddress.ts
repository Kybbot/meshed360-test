import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { showError } from "@/utils/showError";
import { axiosInstance } from "@/utils/axios";

import { ApiError, ApiResult } from "@/@types/api";
import { CreateAddressBody, GetAllAddressesResponseType } from "@/@types/suppliers";

export const useUpdateSupplierAddress = (isForCheckbox = false) => {
	const queryClient = useQueryClient();

	return useMutation<
		ApiResult<GetAllAddressesResponseType>,
		AxiosError<ApiError>,
		{
			supplierId: string;
			body: CreateAddressBody;
		}
	>({
		mutationFn: async ({ supplierId, body }) => {
			const { data } = await axiosInstance.put<ApiResult<GetAllAddressesResponseType>>(
				`/api/suppliers/addresses/${supplierId}`,
				JSON.stringify(body),
			);

			return data;
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: ["get-all-supplier-addresses"],
			});
			toast.success("Addresses was successfully updated");
		},
		onError(error) {
			if (isForCheckbox) showError(error);
		},
	});
};
