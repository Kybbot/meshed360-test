import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { showError } from "@/utils/showError";
import { axiosInstance } from "@/utils/axios";

import {
	GetAssemblyAdditionalExpenseType,
	UndoAssemblyAdditionalExpenseStatusResponseType,
} from "@/@types/assembly/additionalExpense";
import { ApiError, ApiResult } from "@/@types/api";

export const useUndoAssemblyAdditionalExpense = () => {
	const queryClient = useQueryClient();

	return useMutation<
		ApiResult<UndoAssemblyAdditionalExpenseStatusResponseType>,
		AxiosError<ApiError>,
		{
			body: { id: string };
		}
	>({
		mutationFn: async ({ body }) => {
			const { data } = await axiosInstance.post<ApiResult<UndoAssemblyAdditionalExpenseStatusResponseType>>(
				`/api/assemblies/expenses/undo`,
				JSON.stringify(body),
			);

			return data;
		},
		onSuccess: async (newData, variables) => {
			toast.success("Assembly Additional Expenses was successfully undo");

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
