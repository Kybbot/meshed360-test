import { FC, useEffect, useMemo, useRef } from "react";
import { FormProvider, useForm } from "react-hook-form";

import {
	DropdownMenu,
	DropdownMenuItem,
	DropdownMenuRoot,
	DropdownMenuTrigger,
} from "@/components/shared/DropdownMenu.tsx";
import { Button } from "@/components/shared/Button.tsx";

import {
	CommonPageActions,
	CommonPageMain,
	CommonPageStatus,
	CommonPageSubWrapper,
	CommonPageTitle,
	CommonPageWrapper,
} from "@/components/widgets/Page";

import { EmptyRestockLine, orderStatusDictionary, RestockFormValues } from "@/@types/salesOrders/local.ts";
import { ExtendedSalesOrder } from "@/@types/salesOrders/api.ts";
import { useStore } from "zustand";
import { orgStore } from "@/app/stores/orgStore.ts";

import { ProductType } from "@/@types/products.ts";
import { useGetOrderRestock } from "@/entities/orders/api/queries/useGetOrderRestock.ts";
import { Loader } from "@/components/shared/Loader.tsx";
import { ErrorMessage } from "@/components/shared/ErrorMessage.tsx";
import { useSaveRestock } from "@/entities/orders/api/mutations/restock/useSaveRestock.ts";
import { useAuthoriseRestock } from "@/entities/orders/api/mutations/restock/useAuthoriseRestock.ts";
import { useVoidRestock } from "@/entities/orders/api/mutations/restock/useVoidRestock.ts";
import { useUndoRestock } from "@/entities/orders/api/mutations/restock/useUndoRestock.ts";
import { RestockLines } from "@/pages/Orders/EditOrder/ui/tabs/Restock/RestockLines.tsx";
import { getNormalizedRestockData } from "@/pages/Orders/EditOrder/ui/tabs/Restock/utils/getNormalizedRestockData.ts";

type Props = {
	orderInfo: ExtendedSalesOrder;
};

export const Restock: FC<Props> = ({ orderInfo }) => {
	const formRef = useRef<HTMLFormElement>(null);
	const { orgId } = useStore(orgStore);

	const { data, error, isError, isLoading, isSuccess } = useGetOrderRestock({
		organisationId: orgId,
		orderId: orderInfo.id,
	});

	const restock = useMemo(() => {
		return data?.data?.salesOrderRestock;
	}, [data]);

	const { mutate: saveRestock } = useSaveRestock();
	const { mutate: authoriseRestock } = useAuthoriseRestock();
	const { mutate: voidRestock } = useVoidRestock();
	const { mutate: undoRestock } = useUndoRestock();

	const form = useForm<RestockFormValues>({
		defaultValues: {
			lines: [{ ...EmptyRestockLine, location: orderInfo.warehouse }],
		},
		disabled: restock?.status === "AUTHORIZED",
	});

	useEffect(() => {
		if (restock) {
			form.reset({
				lines: restock.lines.map((line) => ({
					product: line.product as ProductType,
					batch: line.batchNumber ? { id: line.batchNumber, name: line.batchNumber } : undefined,
					quantity: line.quantity,
					expiryDate: line.expiryDate,
					location: line.warehouse,
				})),
			});
		} else {
			form.reset({
				lines: [{ ...EmptyRestockLine, location: orderInfo.warehouse }],
			});
		}
	}, [restock]);

	const onSubmit = async (formData: RestockFormValues, action: "save" | "authorise") => {
		const payload = getNormalizedRestockData(formData);

		if (!orgId) return;

		switch (action) {
			case "authorise":
				authoriseRestock({
					orderId: orderInfo.id,
					organisationId: orgId,
					body: payload,
				});
				break;
			case "save":
				saveRestock({
					orderId: orderInfo.id,
					organisationId: orgId,
					body: payload,
				});
				break;
		}
	};

	const handleSave = form.handleSubmit((data) => onSubmit(data, "save"));
	const handleAuthorise = form.handleSubmit((data) => onSubmit(data, "authorise"));
	const handleVoid = () => {
		if (!orderInfo.id || !orgId) return;
		voidRestock({ orderId: orderInfo.id, organisationId: orgId });
	};
	const handleUndo = () => {
		if (!orderInfo.id || !orgId) return;
		undoRestock({ orderId: orderInfo.id, organisationId: orgId });
	};

	return (
		<FormProvider {...form}>
			<CommonPageWrapper>
				{isLoading ? (
					<Loader />
				) : isError && error ? (
					<ErrorMessage error={error} />
				) : isSuccess ? (
					<CommonPageWrapper>
						<CommonPageActions isComplex>
							<CommonPageSubWrapper>
								{restock?.status ? (
									<CommonPageStatus
										isYellow={restock.status === "DRAFT"}
										isGreen={restock.status === "AUTHORIZED"}
										isRed={restock.status === "VOID"}
									>
										{orderStatusDictionary[restock.status]}
									</CommonPageStatus>
								) : (
									<CommonPageStatus>New</CommonPageStatus>
								)}
								<CommonPageTitle>Restock</CommonPageTitle>
							</CommonPageSubWrapper>
							<CommonPageSubWrapper>
								<DropdownMenuRoot modal={false}>
									<DropdownMenuTrigger asChild>
										<Button type="button">
											<svg width="18" height="18" focusable="false" aria-hidden="true">
												<use xlinkHref="/icons/icons.svg#dotsInCicle" />
											</svg>
											Actions
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenu className="dropDown__content" sideOffset={10} align="end">
										{restock?.status !== "AUTHORIZED" ? (
											<>
												<DropdownMenuItem className="dropDown__item" onSelect={() => handleSave()}>
													Save
												</DropdownMenuItem>
												<DropdownMenuItem className="dropDown__item" onSelect={() => handleAuthorise()}>
													Authorise
												</DropdownMenuItem>
												<DropdownMenuItem className="dropDown__item" onSelect={() => handleVoid()}>
													Void
												</DropdownMenuItem>
											</>
										) : (
											<>
												<DropdownMenuItem className="dropDown__item" onSelect={() => handleUndo()}>
													Undo
												</DropdownMenuItem>
											</>
										)}
									</DropdownMenu>
								</DropdownMenuRoot>
							</CommonPageSubWrapper>
						</CommonPageActions>
						<form ref={formRef} action="restockForm" className="commonPage__main" onSubmit={handleSave}>
							<CommonPageMain>
								<RestockLines orderInfo={orderInfo} />
							</CommonPageMain>
						</form>
					</CommonPageWrapper>
				) : (
					<p className="empty_list">No data available</p>
				)}
			</CommonPageWrapper>
		</FormProvider>
	);
};
