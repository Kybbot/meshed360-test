import { AxiosError } from "axios";
import { useStore } from "zustand";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { orgStore } from "@/app/stores/orgStore";

import { showError } from "@/utils/showError";
import { axiosInstance } from "@/utils/axios";

import { ApiError, ApiResult } from "@/@types/api";
import { TemplateType, TemplateTypes } from "@/@types/documentTemplates";

export const useDeleteTemplate = () => {
	const { orgId } = useStore(orgStore);
	const queryClient = useQueryClient();

	return useMutation<
		ApiResult<TemplateType>,
		AxiosError<ApiError>,
		{ templateId: string; templateType: TemplateTypes }
	>({
		mutationFn: async ({ templateId }) => {
			const { data } = await axiosInstance.delete<ApiResult<TemplateType>>(
				`/api/settings/general/document-templates/${templateId}`,
			);

			return data;
		},
		onSuccess: async (_newData, variables) => {
			toast.success("Template was successfully deleted");

			queryClient.setQueryData<Record<TemplateTypes, TemplateType[]>>(
				["get-all-document-templates", orgId],
				(oldData) => {
					if (oldData) {
						const newArr = oldData[variables.templateType].filter((item) => item.id !== variables.templateId);

						return {
							...oldData,
							[variables.templateType]: newArr,
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
