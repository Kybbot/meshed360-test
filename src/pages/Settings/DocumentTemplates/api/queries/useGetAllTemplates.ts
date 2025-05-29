import { AxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";

import { axiosInstance } from "@/utils/axios";

import {
	TemplateType,
	TemplateTypes,
	documentTemplatesObj,
	GetAllTemplatesResponseType,
} from "@/@types/documentTemplates";
import { ApiError, ApiResult } from "@/@types/api";

export const useGetAllTemplates = ({ organisationId }: { organisationId?: string }) => {
	return useQuery<Record<TemplateTypes, TemplateType[]>, AxiosError<ApiError>>({
		queryKey: ["get-all-document-templates", organisationId],
		queryFn: async () => {
			const { data } = await axiosInstance.get<ApiResult<GetAllTemplatesResponseType>>(
				`/api/settings/general/document-templates?organisationId=${organisationId}`,
			);

			const newObj = { ...documentTemplatesObj };

			for (const item of data.data) {
				newObj[item.type] = [...newObj[item.type], item];
			}

			return newObj;
		},
		enabled: !!organisationId,
	});
};
