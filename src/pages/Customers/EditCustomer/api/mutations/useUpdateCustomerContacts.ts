import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { showError } from "@/utils/showError";
import { axiosInstance } from "@/utils/axios";

import { ApiError, ApiResult } from "@/@types/api";
import { CustomerContactsType } from "@/@types/customers";

export const useUpdateCustomerContacts = (isForCheckbox = false) => {
	const queryClient = useQueryClient();

	return useMutation<
		ApiResult<CustomerContactsType[]>,
		AxiosError<ApiError>,
		{
			customerId: string;
			body: CustomerContactsType[];
		}
	>({
		mutationFn: async ({ customerId, body }) => {
			const { data } = await axiosInstance.put<ApiResult<CustomerContactsType[]>>(
				`/api/customers/contacts/${customerId}`,
				JSON.stringify(body),
			);

			return data;
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: ["get-all-customer-contacts"],
			});
			toast.success("Contacts was successfully updated");
		},
		onError(error) {
			if (isForCheckbox) showError(error);
		},
	});
};
