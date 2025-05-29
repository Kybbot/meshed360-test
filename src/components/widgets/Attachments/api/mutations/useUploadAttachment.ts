import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { getRoutePath } from "../../utils/getRoutePath";

import { axiosInstance } from "@/utils/axios";

import { ApiError, ApiResult } from "@/@types/api";
import { AttachmentEntityType, AttachmentType } from "@/@types/attachments";

export const useUploadAttachment = (type: AttachmentEntityType) => {
	const queryClient = useQueryClient();

	return useMutation<
		ApiResult<AttachmentType>,
		AxiosError<ApiError>,
		{ organisationId?: string; entityId: string; formData: FormData }
	>({
		mutationFn: async ({ organisationId, entityId, formData }) => {
			const { data } = await axiosInstance.post<ApiResult<AttachmentType>>(
				`/${getRoutePath(type)}/${organisationId}/${entityId}`,
				formData,
				{
					headers: { "Content-Type": "multipart/form-data" },
				},
			);

			return data;
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: [`get-${type}-attachments`],
			});
			toast.success("File was successfully uploaded");
		},
	});
};
