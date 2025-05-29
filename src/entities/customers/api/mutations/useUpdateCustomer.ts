import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";

import { showError } from "@/utils/showError";
import { axiosInstance } from "@/utils/axios";

import { ApiError, ApiResult } from "@/@types/api";
import { CreateCustomerBody, CustomerType } from "@/@types/customers";

export const useUpdateCustomer = ({ customerId }: { customerId?: string }) => {
	return useMutation<
		ApiResult<CustomerType>,
		AxiosError<ApiError>,
		{
			body: Omit<CreateCustomerBody, "name">;
		}
	>({
		mutationKey: ["update-customer"],
		mutationFn: async ({ body }) => {
			const { data } = await axiosInstance.patch<ApiResult<CustomerType>>(
				`/api/customers/${customerId}`,
				JSON.stringify(body),
			);

			return data;
		},
		onSuccess: async () => {
			toast.success("Customer was successfully updated");
		},
		onError(error) {
			showError(error);
		},
	});
};
