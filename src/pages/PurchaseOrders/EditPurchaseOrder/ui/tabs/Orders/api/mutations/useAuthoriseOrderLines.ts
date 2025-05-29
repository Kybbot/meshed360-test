import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
	getNormalizedAdditionalLinesData,
	getNormalizedOrderLinesData,
} from "../../utils/getNormalizedDefaultData";

import { showError } from "@/utils/showError";
import { axiosInstance } from "@/utils/axios";

import {
	OrderLinesFormValues,
	CreatePurchaseOrderLinesBodyType,
	SavePurchaseOrderLinesResponseType,
} from "@/@types/purchaseOrder/orderLines";
import { ApiError, ApiResult } from "@/@types/api";
import { GetPurchaseOrderByIdResponseType } from "@/@types/purchaseOrder/order";

export const useAuthoriseOrderLines = () => {
	const queryClient = useQueryClient();

	return useMutation<
		ApiResult<SavePurchaseOrderLinesResponseType>,
		AxiosError<ApiError>,
		{
			formData: OrderLinesFormValues;
			body: CreatePurchaseOrderLinesBodyType;
		}
	>({
		mutationFn: async ({ body }) => {
			const { data } = await axiosInstance.post<ApiResult<SavePurchaseOrderLinesResponseType>>(
				`/api/purchase-orders/lines/authorise`,
				JSON.stringify(body),
			);

			return data;
		},
		onSuccess: async (newData, variables) => {
			toast.success("Purchase Order Lines were successfully authorised");

			queryClient.setQueriesData<ApiResult<GetPurchaseOrderByIdResponseType>>(
				{ queryKey: ["get-purchase-order-by-id", variables.body.id] },
				(oldData) => {
					const orderLines = getNormalizedOrderLinesData(variables.formData.orderLines, newData.data.lines);
					const additionalLines = getNormalizedAdditionalLinesData(
						variables.formData.additionalLines,
						newData.data.additionalLines,
					);

					if (oldData) {
						return {
							data: {
								...oldData.data,
								status: newData.data.status,
								lineStatus: newData.data.lineStatus,
								orderLines,
								additionalLines,
								memo: variables.formData.memo,
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
