import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { showError } from "@/utils/showError";
import { axiosInstance } from "@/utils/axios";

import { ApiError, ApiResult } from "@/@types/api";
import { GetAssemblyByIdResponseType, UndoAssemblyOrderResponseType } from "@/@types/assembly/assembly";

export const useUndoAssemblyOrder = () => {
	const queryClient = useQueryClient();

	return useMutation<
		ApiResult<UndoAssemblyOrderResponseType>,
		AxiosError<ApiError>,
		{
			body: { id: string };
		}
	>({
		mutationFn: async ({ body }) => {
			const { data } = await axiosInstance.post<ApiResult<UndoAssemblyOrderResponseType>>(
				`/api/assemblies/undo`,
				JSON.stringify(body),
			);

			return data;
		},
		onSuccess: async (newData, variables) => {
			toast.success("Assembly was successfully undo");

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
