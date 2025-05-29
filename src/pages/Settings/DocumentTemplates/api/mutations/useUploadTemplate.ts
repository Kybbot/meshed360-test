import { AxiosError } from "axios";
import { useStore } from "zustand";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { orgStore } from "@/app/stores/orgStore";

import { showError } from "@/utils/showError";
import { axiosInstance } from "@/utils/axios";

import { ApiError, ApiResult } from "@/@types/api";
import { TemplateType, TemplateTypes } from "@/@types/documentTemplates";

export const useUploadTemplate = () => {
	const { orgId } = useStore(orgStore);
	const queryClient = useQueryClient();

	return useMutation<
		ApiResult<TemplateType>,
		AxiosError<ApiError>,
		{
			formData: FormData;
			templateId: string;
			templateType: TemplateTypes;
		}
	>({
		mutationFn: async ({ formData, templateId }) => {
			const { data } = await axiosInstance.post<ApiResult<TemplateType>>(
				`/api/settings/general/document-templates/${templateId}`,
				formData,
				{
					headers: { "Content-Type": "multipart/form-data" },
				},
			);

			return data;
		},
		onSuccess: async (_newData, variables) => {
			toast.success("Template was successfully uploaded");

			queryClient.setQueryData<Record<TemplateTypes, TemplateType[]>>(
				["get-all-document-templates", orgId],
				(oldData) => {
					if (oldData) {
						const newArr = oldData[variables.templateType].map((item) => {
							if (item.id === variables.templateId) {
								return { ...item, uploaded: true };
							}

							return item;
						});

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
