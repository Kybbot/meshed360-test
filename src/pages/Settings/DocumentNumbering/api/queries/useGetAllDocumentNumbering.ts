import { AxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";

import { axiosInstance } from "@/utils/axios";

import { ApiError, ApiResult } from "@/@types/api";
import { GetAllDocumentNumberingResponseType } from "@/@types/documentNumbering";

export const useGetAllDocumentNumbering = ({ organisationId }: { organisationId?: string }) => {
	return useQuery<ApiResult<GetAllDocumentNumberingResponseType>, AxiosError<ApiError>>({
		queryKey: ["get-all-document-numbering", organisationId],
		queryFn: async () => {
			const { data } = await axiosInstance.get<ApiResult<GetAllDocumentNumberingResponseType>>(
				`/api/settings/general/document-numbering?organisationId=${organisationId}`,
			);

			return data;
		},
		enabled: !!organisationId,
	});
};
