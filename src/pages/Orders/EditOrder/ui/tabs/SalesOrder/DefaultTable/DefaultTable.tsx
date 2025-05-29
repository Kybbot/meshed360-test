import { FC, useEffect, useMemo, useRef } from "react";
import { useStore } from "zustand";
import { useParams } from "react-router";
import { useForm, useWatch } from "react-hook-form";

import { OrderLines } from "@/pages/Orders/EditOrder/ui/tabs/Quote/DefaultTable/OrderLines.tsx";
import { OrderServices } from "@/pages/Orders/EditOrder/ui/tabs/Quote/DefaultTable/OrderServices.tsx";

import { getNormalizedDefaultQuoteData } from "@/pages/Orders/EditOrder/ui/tabs/Quote/utils/getNormalizedDefaultData.ts";

import {
	DropdownMenu,
	DropdownMenuItem,
	DropdownMenuRoot,
	DropdownMenuTrigger,
} from "@/components/shared/DropdownMenu";
import { Loader } from "@/components/shared/Loader";
import { Button } from "@/components/shared/Button";
import { ErrorMessage } from "@/components/shared/ErrorMessage";
import { TextareaRhf } from "@/components/shared/form/TextareaRhf";

import {
	CommonPageActions,
	CommonPageFooter,
	CommonPageMain,
	CommonPageStatus,
	CommonPageSubWrapper,
	CommonPageTitle,
	CommonPageWrapper,
} from "@/components/widgets/Page";
import { TotalTable } from "@/components/widgets/TotalTable";

import { orgStore } from "@/app/stores/orgStore";
import { orderStore } from "@/app/stores/orderStore";

import { useGetPriceListById } from "@/entities/priceLists";

import {
	DefaultOrderFormValues,
	DefaultOrderLineType,
	EmptyDefaultOrderLine,
	orderStatusDictionary,
	OrderServiceLineType,
} from "@/@types/salesOrders/local.ts";
import { ExtendedSalesOrder, OrderStatus, QuoteType } from "@/@types/salesOrders/api.ts";
import { ProductType } from "@/@types/products.ts";
import { TaxRateType } from "@/@types/selects.ts";
import { useGetUserAndOrgInfo } from "@/hooks/useGetUserInfo.ts";
import { useSaveOrder } from "@/entities/orders/api/mutations/salesOrder/useSaveOrder.ts";
import { useEmailOrder } from "@/entities/orders/api/mutations/salesOrder/useEmailOrder.ts";
import { useAuthoriseOrder } from "@/entities/orders/api/mutations/salesOrder/useAuthoriseOrder.ts";
import { useCloseOrder } from "@/entities/orders/api/mutations/salesOrder/useCloseOrder.ts";
import { useUndoOrder } from "@/entities/orders/api/mutations/salesOrder/useUndoOrder.ts";

type Props = {
	order: ExtendedSalesOrder;
	quote?: QuoteType;
};

export const DefaultTable: FC<Props> = ({ order, quote }) => {
	const { orderId } = useParams();
	const { orgId } = useStore(orgStore);
	const { taxInclusive } = useStore(orderStore);
	const userAndOrgInfo = useGetUserAndOrgInfo();

	const formRef = useRef<HTMLFormElement>(null);

	const { mutate: emailOrder } = useEmailOrder();
	const { mutate: saveOrder } = useSaveOrder();
	const { mutate: authoriseOrder } = useAuthoriseOrder();
	const { mutate: closeOrder } = useCloseOrder();
	const { mutate: undoOrder } = useUndoOrder();

	const { isLoading, isError, isSuccess, error, data } = useGetPriceListById({
		priceListId: order.priceList.id,
	});

	const priceListContentData = useMemo(() => {
		if (data?.data.priceList.priceListContent?.length) {
			return data.data.priceList.priceListContent.reduce<Record<string, number>>((prev, curr) => {
				prev[curr.productid] = curr.price;
				return prev;
			}, {});
		}

		return null;
	}, [data]);

	const {
		control,
		setValue,
		register,
		handleSubmit,
		reset,
		formState: { errors, disabled },
	} = useForm<DefaultOrderFormValues>({
		defaultValues: {
			lines: [EmptyDefaultOrderLine],
			serviceLines: [],
			memo: "",
		},
		disabled: order?.status !== "ORDERING" && order.status !== "DRAFT",
	});

	useEffect(() => {
		if (order) {
			reset({
				lines: order?.orderLines.length
					? order?.orderLines.map((line): DefaultOrderLineType => {
							return {
								product: line.product as unknown as ProductType,
								comment: line.comment || "",
								quantity: line.quantity,
								unitPrice: line.unitPrice,
								discount: line.discount,
								taxType: line.taxRate as unknown as TaxRateType,
								account: line.account,
								trackingCategoryA: userAndOrgInfo?.trackingCategoryAFiltered?.categories.find(
									({ id }) => id === line.trackingCategoryAId,
								),
								trackingCategoryB: userAndOrgInfo?.trackingCategoryBFiltered?.categories.find(
									({ id }) => id === line.trackingCategoryBId,
								),
								total: "",
							};
						})
					: [EmptyDefaultOrderLine],
				serviceLines: order?.serviceLines.length
					? order?.serviceLines.map((line): OrderServiceLineType => {
							return {
								product: line.product as unknown as ProductType,
								comment: line.comment || "",
								quantity: line.quantity,
								unitPrice: line.unitPrice,
								discount: line.discount,
								account: line.account,
								taxType: line.taxRate as unknown as TaxRateType,
								total: "",
							};
						})
					: [],
				memo: order?.memo || "",
			});
		} else {
			reset({
				lines: [EmptyDefaultOrderLine],
				serviceLines: [],
				memo: "",
			});
		}
	}, [order]);

	const linesValues = useWatch({
		name: "lines",
		control,
	});

	const serviceLinesValues = useWatch({
		name: "serviceLines",
		control,
	});

	const badgeColor = useMemo(() => {
		let res: "red" | "green" | "yellow" = "yellow";

		switch (order.status) {
			case OrderStatus.CLOSED:
				res = "green";
				break;
			case OrderStatus.VOID:
			case OrderStatus.LOST:
				res = "red";
				break;
			default:
				break;
		}

		return res;
	}, [order.status]);

	const onSubmit = async (
		formData: DefaultOrderFormValues,
		action: "save" | "email" | "authorise" | "close",
	) => {
		const payload = disabled ? undefined : getNormalizedDefaultQuoteData(formData);

		if (!orderId || !orgId) return;

		switch (action) {
			case "save":
				saveOrder({ orderId, organisationId: orgId, body: payload! });
				break;
			case "email":
				emailOrder({ orderId, organisationId: orgId, body: payload });
				break;
			case "close":
				closeOrder({ orderId, organisationId: orgId, body: payload });
				break;
			case "authorise":
				authoriseOrder({ orderId, organisationId: orgId, body: payload! });
				break;
		}
	};

	const handleSave = handleSubmit((data) => onSubmit(data, "save"));
	const handleEmail = handleSubmit((data) => onSubmit(data, "email"));
	const handleAuthorise = handleSubmit((data) => onSubmit(data, "authorise"));
	const handleClose = handleSubmit((data) => onSubmit(data, "close"));
	const handleUndo = () => {
		if (!orderId || !orgId) return;
		undoOrder({ orderId, organisationId: orgId });
	};

	return (
		<CommonPageWrapper>
			{isLoading ? (
				<Loader />
			) : isError && error ? (
				<ErrorMessage error={error} />
			) : isSuccess && data.data.priceList ? (
				<>
					<CommonPageActions isComplex>
						<CommonPageSubWrapper>
							{order?.status && (
								<CommonPageStatus
									isYellow={badgeColor === "yellow"}
									isGreen={badgeColor === "green"}
									isRed={badgeColor === "red"}
								>
									{orderStatusDictionary[order.status]}
								</CommonPageStatus>
							)}
							<CommonPageTitle>Order Lines</CommonPageTitle>
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
									{disabled ? null : (
										<>
											<DropdownMenuItem className="dropDown__item" onSelect={() => handleSave()}>
												Save
											</DropdownMenuItem>
											<DropdownMenuItem className="dropDown__item" onSelect={() => handleAuthorise()}>
												Authorise
											</DropdownMenuItem>
										</>
									)}
									{order.status === "ORDERED" && (
										<DropdownMenuItem className="dropDown__item" onSelect={() => handleUndo()}>
											Undo
										</DropdownMenuItem>
									)}
									<DropdownMenuItem className="dropDown__item" onSelect={() => handleEmail()}>
										Email
									</DropdownMenuItem>
									{order?.status !== "CLOSED" && (
										<DropdownMenuItem className="dropDown__item" onSelect={() => handleClose()}>
											Mark as closed
										</DropdownMenuItem>
									)}
								</DropdownMenu>
							</DropdownMenuRoot>
						</CommonPageSubWrapper>
					</CommonPageActions>
					<CommonPageMain>
						<form ref={formRef} action="quoteForm" className="commonPage__main" onSubmit={handleSave}>
							<OrderLines
								disabled={disabled}
								errors={errors}
								control={control}
								register={register}
								setValue={setValue}
								priceListContentData={priceListContentData}
								quote={quote}
								orderInfo={order}
							/>
							<OrderServices
								disabled={disabled}
								errors={errors}
								control={control}
								register={register}
								setValue={setValue}
								priceListContentData={priceListContentData}
								quote={quote}
								orderInfo={order}
							/>
						</form>
						<CommonPageFooter>
							<TextareaRhf<DefaultOrderFormValues>
								name="memo"
								id="memoId"
								label="Quote Memo"
								register={register}
								error={errors.memo?.message}
							/>
							<TotalTable
								firstHeader="Order Lines"
								taxInclusive={taxInclusive}
								secondHeader="Additional Charges"
								orderLinesValues={linesValues}
								serviceLinesValues={serviceLinesValues}
							/>
						</CommonPageFooter>
					</CommonPageMain>
				</>
			) : (
				<p className="empty_list">No data available</p>
			)}
		</CommonPageWrapper>
	);
};
