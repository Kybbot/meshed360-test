import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { showError } from "@/utils/showError";
import { axiosInstance } from "@/utils/axios";

import {
	GetAssemblyAdditionalExpenseType,
	AuthoriseAssemblyAdditionalExpenseStatusResponseType,
} from "@/@types/assembly/additionalExpense";
import { ApiError, ApiResult } from "@/@types/api";

export const useAuthoriseAssemblyAdditionalExpense = () => {
	const queryClient = useQueryClient();

	return useMutation<
		ApiResult<AuthoriseAssemblyAdditionalExpenseStatusResponseType>,
		AxiosError<ApiError>,
		{
			body: { id: string };
		}
	>({
		mutationFn: async ({ body }) => {
			const { data } = await axiosInstance.post<
				ApiResult<AuthoriseAssemblyAdditionalExpenseStatusResponseType>
			>(`/api/assemblies/expenses/authorise`, JSON.stringify(body));

			return data;
		},
		onSuccess: async (newData, variables) => {
			toast.success("Assembly Additional Expenses was successfully authorised");

			queryClient.setQueryData<ApiResult<GetAssemblyAdditionalExpenseType>>(
				["get-assembly-additional-expense", variables.body.id],
				(oldData) => {
					if (oldData) {
						return {
							data: {
								...oldData.data,
								status: newData.data.status,
								additionalExpensesStatus: newData.data.additionalExpensesStatus,
							},
							status: oldData.status,
						};
					}
					return oldData;
				},
			);
		},
		onError(error) {
			showError(error);
		},
	});
};
