import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { showError } from "@/utils/showError";
import { axiosInstance } from "@/utils/axios";

import { ApiError, ApiResult } from "@/@types/api";
import { GetAllAssemblyResultResponseType, VoidAssemblyResultResponseType } from "@/@types/assembly/result";

export const useVoidAssemblyResult = () => {
	const queryClient = useQueryClient();

	return useMutation<
		ApiResult<VoidAssemblyResultResponseType>,
		AxiosError<ApiError>,
		{
			body: { id: string };
		}
	>({
		mutationFn: async ({ body }) => {
			const { data } = await axiosInstance.post<ApiResult<VoidAssemblyResultResponseType>>(
				`/api/assemblies/result/void`,
				JSON.stringify(body),
			);

			return data;
		},
		onSuccess: async (newData, variables) => {
			toast.success("Assembly Result was successfully voided");

			queryClient.setQueryData<ApiResult<GetAllAssemblyResultResponseType>>(
				["get-assembly-result", variables.body.id],
				(oldData) => {
					if (oldData) {
						return {
							data: {
								...oldData.data,
								status: newData.data.status,
								resultStatus: newData.data.resultStatus,
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
