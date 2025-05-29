import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { showError } from "@/utils/showError";
import { axiosInstance } from "@/utils/axios";

import { ApiError, ApiResult } from "@/@types/api";
import { ContactsType } from "@/@types/suppliers";

export const useUpdateSupplierContacts = (isForCheckbox = false) => {
	const queryClient = useQueryClient();

	return useMutation<
		ApiResult<ContactsType[]>,
		AxiosError<ApiError>,
		{
			supplierId: string;
			body: ContactsType[];
		}
	>({
		mutationFn: async ({ supplierId, body }) => {
			const { data } = await axiosInstance.put<ApiResult<ContactsType[]>>(
				`/api/suppliers/contacts/${supplierId}`,
				JSON.stringify(body),
			);

			return data;
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: ["get-all-supplier-contacts"],
			});
			toast.success("Contacts was successfully updated");
		},
		onError(error) {
			if (isForCheckbox) showError(error);
		},
	});
};
