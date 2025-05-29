import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { showError } from "@/utils/showError";
import { axiosInstance } from "@/utils/axios";

import {
	GetAssemblyAdditionalExpenseType,
	AssemblyAdditionalExpenseLineType,
	CreateAssemblyAdditionalExpenseType,
	SaveAssemblyAdditionalExpenseResponseType,
} from "@/@types/assembly/additionalExpense";
import { ApiError, ApiResult } from "@/@types/api";

export const useSaveAssemblyAdditionalExpense = () => {
	const queryClient = useQueryClient();

	return useMutation<
		ApiResult<SaveAssemblyAdditionalExpenseResponseType>,
		AxiosError<ApiError>,
		{ body: CreateAssemblyAdditionalExpenseType; newData: AssemblyAdditionalExpenseLineType[] }
	>({
		mutationFn: async ({ body }) => {
			const { data } = await axiosInstance.post<ApiResult<SaveAssemblyAdditionalExpenseResponseType>>(
				`/api/assemblies/expenses`,
				JSON.stringify(body),
			);

			return data;
		},
		onSuccess: async (newData, variables) => {
			toast.success("Assembly Additional Expenses was successfully added");

			queryClient.setQueryData<ApiResult<GetAssemblyAdditionalExpenseType>>(
				["get-assembly-additional-expense", variables.body.orderId],
				(oldData) => {
					if (oldData) {
						return {
							data: {
								...oldData.data,
								additionalExpensesStatus: newData.data.additionalExpensesStatus,
								lines: variables.newData,
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
