import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { showError } from "@/utils/showError";
import { axiosInstance } from "@/utils/axios";

import { ApiError, ApiResult } from "@/@types/api";
import { CreateAddressBody, GetAllCustomerAddressesResponseType } from "@/@types/customers";

export const useUpdateCustomerAddress = (isForCheckbox = false) => {
	const queryClient = useQueryClient();

	return useMutation<
		ApiResult<GetAllCustomerAddressesResponseType>,
		AxiosError<ApiError>,
		{
			customerId: string;
			body: CreateAddressBody;
		}
	>({
		mutationFn: async ({ customerId, body }) => {
			const { data } = await axiosInstance.put<ApiResult<GetAllCustomerAddressesResponseType>>(
				`/api/customers/addresses/${customerId}`,
				JSON.stringify(body),
			);

			return data;
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: ["get-all-customer-addresses"],
			});
			toast.success("Addresses was successfully updated");
		},
		onError(error) {
			if (isForCheckbox) showError(error);
		},
	});
};
