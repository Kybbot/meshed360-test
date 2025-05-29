import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { showError } from "@/utils/showError";
import { axiosInstance } from "@/utils/axios";

import { ApiError, ApiResult } from "@/@types/api";
import { GetAllAssemblyResultResponseType, UndoAssemblyResultResponseType } from "@/@types/assembly/result";
import { GetAssemblyByIdResponseType } from "@/@types/assembly/assembly";

export const useUndoAssemblyResult = () => {
	const queryClient = useQueryClient();

	return useMutation<
		ApiResult<UndoAssemblyResultResponseType>,
		AxiosError<ApiError>,
		{
			body: { id: string };
		}
	>({
		mutationFn: async ({ body }) => {
			const { data } = await axiosInstance.post<ApiResult<UndoAssemblyResultResponseType>>(
				`/api/assemblies/result/undo`,
				JSON.stringify(body),
			);

			return data;
		},
		onSuccess: async (newData, variables) => {
			toast.success("Assembly Result was successfully undo");

			queryClient.setQueryData<ApiResult<GetAllAssemblyResultResponseType>>(
				["get-assembly-result", variables.body.id],
				(oldData) => {
					if (oldData) {
						return {
							data: {
								...oldData.data,
								status: newData.data.status,
								resultStatus: newData.data.resultStatus,
							},
							status: oldData.status,
						};
					}
					return oldData;
				},
			);

			queryClient.setQueriesData<ApiResult<GetAssemblyByIdResponseType>>(
				{ queryKey: ["get-assembly-by-id", variables.body.id] },
				(oldData) => {
					if (oldData) {
						return {
							data: {
								...oldData.data,
								status: newData.data.status,
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
