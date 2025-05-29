import { AxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";

import { axiosInstance } from "@/utils/axios";

import { ApiError, ApiResult } from "@/@types/api";
import { GetAdditionalExpenseType } from "@/@types/purchaseOrder/additionalExpense";

export const useGetAdditionalExpense = ({ purchaseOrderId }: { purchaseOrderId?: string }) => {
	return useQuery<ApiResult<GetAdditionalExpenseType>, AxiosError<ApiError>>({
		queryKey: ["get-purchase-order-additional-expense", purchaseOrderId],
		queryFn: async () => {
			const { data } = await axiosInstance.get<ApiResult<GetAdditionalExpenseType>>(
				`/api/purchase-orders/expenses/${purchaseOrderId}`,
			);

			return data;
		},
		enabled: !!purchaseOrderId,
	});
};
