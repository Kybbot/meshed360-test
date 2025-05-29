import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { showError } from "@/utils/showError";
import { axiosInstance } from "@/utils/axios";

import { ApiError, ApiResult } from "@/@types/api";
import {
	CreateAssemblyResult,
	AssemblyResultLineType,
	SaveAssemblyResultResponseType,
	GetAllAssemblyResultResponseType,
} from "@/@types/assembly/result";

export const useSaveAssemblyResult = () => {
	const queryClient = useQueryClient();

	return useMutation<
		ApiResult<SaveAssemblyResultResponseType>,
		AxiosError<ApiError>,
		{ body: CreateAssemblyResult; newData: AssemblyResultLineType }
	>({
		mutationFn: async ({ body }) => {
			const { data } = await axiosInstance.post<ApiResult<SaveAssemblyResultResponseType>>(
				`/api/assemblies/result`,
				JSON.stringify(body),
			);

			return data;
		},
		onSuccess: async (newData, variables) => {
			toast.success("Assembly Result was successfully added");

			queryClient.setQueryData<ApiResult<GetAllAssemblyResultResponseType>>(
				["get-assembly-result", variables.body.orderId],
				(oldData) => {
					if (oldData) {
						return {
							data: {
								...oldData.data,
								status: newData.data.status,
								resultStatus: newData.data.resultStatus,
								lines: [{ ...variables.newData }],
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
