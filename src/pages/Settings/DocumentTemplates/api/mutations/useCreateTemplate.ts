import { AxiosError } from "axios";
import { useStore } from "zustand";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { orgStore } from "@/app/stores/orgStore";

import { axiosInstance } from "@/utils/axios";

import { ApiError, ApiResult } from "@/@types/api";
import { CreateTemplateBody, TemplateType, TemplateTypes } from "@/@types/documentTemplates";

export const useCreateTemplate = () => {
	const { orgId } = useStore(orgStore);
	const queryClient = useQueryClient();

	return useMutation<
		ApiResult<TemplateType>,
		AxiosError<ApiError>,
		{
			body: CreateTemplateBody;
		}
	>({
		mutationFn: async ({ body }) => {
			const { data } = await axiosInstance.post<ApiResult<TemplateType>>(
				`/api/settings/general/document-templates`,
				JSON.stringify(body),
			);

			return data;
		},
		onSuccess: async (newData, variables) => {
			toast.success("New Template was successfully added");

			queryClient.setQueryData<Record<TemplateTypes, TemplateType[]>>(
				["get-all-document-templates", orgId],
				(oldData) => {
					if (oldData) {
						const oldArr = oldData[variables.body.type];
						const newArr = [newData.data, ...(oldArr ? oldArr : [])];

						return {
							...oldData,
							[variables.body.type]: newArr,
						};
					}

					return oldData;
				},
			);
		},
	});
};
