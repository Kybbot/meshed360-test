import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";

import { showError } from "@/utils/showError";
import { axiosInstance } from "@/utils/axios";

import { ApiError, ApiResult } from "@/@types/api";
import { CreateCustomerBody, CustomerType } from "@/@types/customers";

export const useCreateCustomer = () => {
	return useMutation<
		ApiResult<CustomerType>,
		AxiosError<ApiError>,
		{
			body: CreateCustomerBody;
		}
	>({
		mutationKey: ["create-customer"],
		mutationFn: async ({ body }) => {
			const { data } = await axiosInstance.post<ApiResult<CustomerType>>(
				`/api/customers`,
				JSON.stringify(body),
			);

			return data;
		},
		onSuccess: async () => {
			toast.success("New Customer was successfully added");
		},
		onError(error) {
			showError(error);
		},
	});
};
