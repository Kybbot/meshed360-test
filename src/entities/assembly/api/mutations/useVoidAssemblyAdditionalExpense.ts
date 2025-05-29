import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { showError } from "@/utils/showError";
import { axiosInstance } from "@/utils/axios";

import {
	GetAssemblyAdditionalExpenseType,
	VoidAssemblyAdditionalExpenseStatusResponseType,
} from "@/@types/assembly/additionalExpense";
import { ApiError, ApiResult } from "@/@types/api";

export const useVoidAssemblyAdditionalExpense = () => {
	const queryClient = useQueryClient();

	return useMutation<
		ApiResult<VoidAssemblyAdditionalExpenseStatusResponseType>,
		AxiosError<ApiError>,
		{
			body: { id: string };
		}
	>({
		mutationFn: async ({ body }) => {
			const { data } = await axiosInstance.post<ApiResult<VoidAssemblyAdditionalExpenseStatusResponseType>>(
				`/api/assemblies/expenses/void`,
				JSON.stringify(body),
			);

			return data;
		},
		onSuccess: async (newData, variables) => {
			toast.success("Assembly Additional Expenses was successfully voided");

			queryClient.setQueryData<ApiResult<GetAssemblyAdditionalExpenseType>>(
				["get-assembly-additional-expense", variables.body.id],
				(oldData) => {
					if (oldData) {
						return {
							data: {
								...oldData.data,
								status: newData.data.status,
								additionalExpensesStatus: newData.data.additionalExpensesStatus,
								lines: [],
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
