import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { showError } from "@/utils/showError";
import { axiosInstance } from "@/utils/axios";

import { ApiError, ApiResult } from "@/@types/api";
import { DocumentNumberingType } from "@/@types/documentNumbering";

export const useUpdateDocumentNumbering = () => {
	const queryClient = useQueryClient();

	return useMutation<
		ApiResult<DocumentNumberingType[]>,
		AxiosError<ApiError>,
		{
			organisationId: string;
			body: DocumentNumberingType[];
		}
	>({
		mutationFn: async ({ organisationId, body }) => {
			const { data } = await axiosInstance.patch<ApiResult<DocumentNumberingType[]>>(
				`/api/settings/general/document-numbering?organisationId=${organisationId}`,
				JSON.stringify(body),
			);

			return data;
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: ["get-all-document-numbering"],
			});
			toast.success("Document Numbering was successfully updated");
		},
		onError(error) {
			showError(error);
		},
	});
};
