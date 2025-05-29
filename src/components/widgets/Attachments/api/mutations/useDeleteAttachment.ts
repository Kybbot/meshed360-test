import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { getRoutePath } from "../../utils/getRoutePath";

import { axiosInstance } from "@/utils/axios";

import { ApiError, ApiResult } from "@/@types/api";
import { AttachmentEntityType, DeletedAttachmentResponseType } from "@/@types/attachments";

export const useDeleteAttachment = (type: AttachmentEntityType) => {
	const queryClient = useQueryClient();

	return useMutation<
		ApiResult<DeletedAttachmentResponseType>,
		AxiosError<ApiError>,
		{ organisationId?: string; entityId: string; attachmentId: string }
	>({
		mutationFn: async ({ organisationId, entityId, attachmentId }) => {
			const { data } = await axiosInstance.delete<ApiResult<DeletedAttachmentResponseType>>(
				`/${getRoutePath(type)}/${organisationId}/${entityId}/${attachmentId}`,
			);

			return data;
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: [`get-${type}-attachments`],
			});
			toast.success("Attachment was successfully deleted");
		},
	});
};
