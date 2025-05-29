import { useCallback, useState } from "react";
import { isAxiosError } from "axios";
import toast from "react-hot-toast";

import { showError } from "@/utils/showError";
import { axiosInstance } from "@/utils/axios";

import { ApiResult } from "@/@types/api";

type RouteType =
	| "SalesOrderQuote"
	| "SalesOrderInvoice"
	| "SalesOrderCreditNote"
	| "SalesOrderPickingList"
	| "SalesOrderPackingList"
	| "PurchaseOrder"
	| "PurchaseOrderReceiving"
	| "PurchaseOrderBill"
	| "PurchaseOrderUnstock"
	| "AssemblyOrder"
	| "AssemblyOrderPick";

const Endpoints = {
	SalesOrderQuote: "/api/print/sales-order-quote?id=",
	SalesOrderInvoice: "/api/print/sales-order-invoice?id=",
	SalesOrderCreditNote: "/api/print/sales-order-credit-note?id=",
	SalesOrderPickingList: "/api/print/sales-order-picking-list?id=",
	SalesOrderPackingList: "/api/print/sales-order-packing-list?id=",
	PurchaseOrder: "/api/print/purchase-order?id=",
	PurchaseOrderReceiving: "/api/print/purchase-order/receivings?id=",
	PurchaseOrderBill: "/api/print/purchase-order/bills?id=",
	PurchaseOrderUnstock: "/api/print/purchase-order/unstock?id=",
	AssemblyOrder: "/api/print/assembly-order?id=",
	AssemblyOrderPick: "/api/print/assembly-order-pick?id=",
};

export const useGetPrintUrl = (routeType: RouteType) => {
	const [loading, setLoading] = useState(false);

	const getPrintUrlData = useCallback(
		async (id: string) => {
			setLoading(true);

			try {
				const { data } = await axiosInstance.get<ApiResult<{ url: string }>>(`${Endpoints[routeType]}${id}`);

				if (data.data.url) {
					window.open(data.data.url, "_blank");
				}
			} catch (error) {
				if (isAxiosError(error)) {
					showError(error);
				} else if (error instanceof Error) {
					toast.error(error.message);
				} else {
					toast.error("Something went wrong");
				}
			} finally {
				setLoading(false);
			}
		},
		[routeType],
	);

	return { isLoadingPrintUrl: loading, getPrintUrlData };
};
