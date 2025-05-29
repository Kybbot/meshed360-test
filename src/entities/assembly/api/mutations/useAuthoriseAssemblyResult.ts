import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { showError } from "@/utils/showError";
import { axiosInstance } from "@/utils/axios";

import {
	GetAllAssemblyResultResponseType,
	AuthoriseAssemblyResultResponseType,
} from "@/@types/assembly/result";
import { ApiError, ApiResult } from "@/@types/api";
import { GetAssemblyByIdResponseType } from "@/@types/assembly/assembly";

export const useAuthoriseAssemblyResult = () => {
	const queryClient = useQueryClient();

	return useMutation<
		ApiResult<AuthoriseAssemblyResultResponseType>,
		AxiosError<ApiError>,
		{
			body: { id: string };
		}
	>({
		mutationFn: async ({ body }) => {
			const { data } = await axiosInstance.post<ApiResult<AuthoriseAssemblyResultResponseType>>(
				`/api/assemblies/result/authorise`,
				JSON.stringify(body),
			);

			return data;
		},
		onSuccess: async (newData, variables) => {
			toast.success("Assembly Result was successfully authorised");

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
