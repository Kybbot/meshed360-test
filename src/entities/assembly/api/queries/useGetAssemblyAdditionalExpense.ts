import { AxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";

import { axiosInstance } from "@/utils/axios";

import { ApiError, ApiResult } from "@/@types/api";
import { GetAssemblyAdditionalExpenseType } from "@/@types/assembly/additionalExpense";

export const useGetAssemblyAdditionalExpense = ({ assemblyId }: { assemblyId?: string }) => {
	return useQuery<ApiResult<GetAssemblyAdditionalExpenseType>, AxiosError<ApiError>>({
		queryKey: ["get-assembly-additional-expense", assemblyId],
		queryFn: async () => {
			const { data } = await axiosInstance.get<ApiResult<GetAssemblyAdditionalExpenseType>>(
				`/api/assemblies/expenses/${assemblyId}`,
			);
			return data;
		},
		enabled: !!assemblyId,
	});
};
