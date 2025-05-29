import { AxiosError } from "axios";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { getRoutePath } from "../../utils/getRoutePath";

import { axiosInstance } from "@/utils/axios";

import { ApiError, ApiResult } from "@/@types/api";
import { AttachmentEntityType, GetAttachmentsResponseType } from "@/@types/attachments";

export const useGetAttachments = ({
	type,
	pageSize,
	entityId,
	pageNumber,
	searchValue,
	organisationId,
}: {
	entityId: string;
	pageSize: string;
	pageNumber: string;
	searchValue: string;
	organisationId?: string;
	type: AttachmentEntityType;
}) => {
	return useQuery<ApiResult<GetAttachmentsResponseType>, AxiosError<ApiError>>({
		queryKey: [`get-${type}-attachments`, organisationId, entityId, { searchValue, pageSize, pageNumber }],
		queryFn: async () => {
			const { data } = await axiosInstance.get<ApiResult<GetAttachmentsResponseType>>(
				`/${getRoutePath(type)}/${organisationId}/${entityId}?search=${searchValue}&pageSize=${pageSize}&pageNumber=${pageNumber}`,
			);

			return data;
		},
		enabled: !!organisationId && !!entityId,
		placeholderData: keepPreviousData,
	});
};
