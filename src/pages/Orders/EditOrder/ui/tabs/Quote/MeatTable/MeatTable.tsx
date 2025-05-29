import { FC, useEffect, useMemo, useRef } from "react";
import { useStore } from "zustand";
import { useParams } from "react-router";
import { useForm, useWatch } from "react-hook-form";

import { OrderLines } from "./OrderLines";
import { OrderServices } from "./OrderServices.tsx";

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

import { useSaveQuote } from "@/entities/orders";
import { useGetPriceListById } from "@/entities/priceLists";

import {
	EmptyMeatOrderLine,
	MeatOrderFormValues,
	MeatOrderLineType,
	orderStatusDictionary,
	OrderServiceLineType,
} from "@/@types/salesOrders/local.ts";
import { ExtendedSalesOrder, QuoteType } from "@/@types/salesOrders/api.ts";
import { ProductType } from "@/@types/products.ts";
import { TaxRateType } from "@/@types/selects.ts";
import { useGetUserAndOrgInfo } from "@/hooks/useGetUserInfo.ts";
import { getNormalizedMeatQuoteData } from "@/pages/Orders/EditOrder/ui/tabs/Quote/utils/getNormalizedMeatData.ts";
import { useAuthoriseQuote } from "@/entities/orders/api/mutations/qoute/useAuthoriseQuote.ts";
import { useVoidQuote } from "@/entities/orders/api/mutations/qoute/useVoidQuote.ts";
import { useUndoQuote } from "@/entities/orders/api/mutations/qoute/useUndoQuote.ts";

type Props = {
	quote: QuoteType | null;
	orderInfo: ExtendedSalesOrder;
};

export const MeatTable: FC<Props> = ({ quote, orderInfo }) => {
	const { orderId } = useParams();
	const { orgId } = useStore(orgStore);
	const { taxInclusive } = useStore(orderStore);
	const userAndOrgInfo = useGetUserAndOrgInfo();

	const formRef = useRef<HTMLFormElement>(null);

	const { mutate: saveQuote } = useSaveQuote();
	const { mutate: authoriseQuote } = useAuthoriseQuote();
	const { mutate: voidQuote } = useVoidQuote();
	const { mutate: undoQuote } = useUndoQuote();

	const { isLoading, isError, isSuccess, error, data } = useGetPriceListById({
		priceListId: orderInfo.priceList.id,
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
		formState: { errors, isSubmitted, disabled },
		reset,
	} = useForm<MeatOrderFormValues>({
		defaultValues: {
			lines: [EmptyMeatOrderLine],
			serviceLines: [],
			memo: "",
		},
		disabled: quote?.status === "AUTHORIZED",
	});

	useEffect(() => {
		if (quote) {
			reset({
				lines: quote?.lines.length
					? quote?.lines.map((line): MeatOrderLineType => {
							return {
								product: line.product as unknown as ProductType,
								comment: line.comment || "",
								quantity: line.quantity,
								mass: line.mass || "",
								account: line.account,
								unitPrice: line.unitPrice,
								discount: line.discount,
								taxType: line.taxRate as unknown as TaxRateType,
								trackingCategoryA: userAndOrgInfo?.trackingCategoryAFiltered?.categories.find(
									({ id }) => id === line.trackingCategoryAId,
								),
								trackingCategoryB: userAndOrgInfo?.trackingCategoryBFiltered?.categories.find(
									({ id }) => id === line.trackingCategoryBId,
								),
								total: "",
							};
						})
					: [EmptyMeatOrderLine],
				serviceLines: quote?.serviceLines.map((line): OrderServiceLineType => {
					return {
						product: line.product as unknown as ProductType,
						comment: line.comment || "",
						quantity: line.quantity,
						unitPrice: line.unitPrice,
						discount: line.discount,
						taxType: line.taxRate as unknown as TaxRateType,
						total: "",
					};
				}),
				memo: quote?.memo || "",
			});
		} else {
			reset({
				lines: [EmptyMeatOrderLine],
				serviceLines: [],
				memo: "",
			});
		}
	}, [quote]);

	const linesValues = useWatch({
		name: "lines",
		control,
	});

	const serviceLinesValues = useWatch({
		name: "serviceLines",
		control,
	});

	const onSubmit = async (formData: MeatOrderFormValues, action: "save" | "authorise" | "void") => {
		const payload = getNormalizedMeatQuoteData(formData);

		if (!orderId || !orgId) return;

		switch (action) {
			case "authorise":
				authoriseQuote({ orderId, organisationId: orgId, body: payload });
				break;
			case "save":
				saveQuote({ orderId, organisationId: orgId, body: payload });
				break;
		}
	};

	const handleSave = handleSubmit((data) => onSubmit(data, "save"));
	const handleAuthorise = handleSubmit((data) => onSubmit(data, "authorise"));
	const handleVoid = () => {
		if (!orderId || !orgId) return;
		voidQuote({ orderId, organisationId: orgId });
	};
	const handleUndo = () => {
		if (!orderId || !orgId) return;
		undoQuote({ orderId, organisationId: orgId });
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
							{quote?.status ? (
								<CommonPageStatus
									isYellow={quote.status === "DRAFT"}
									isGreen={quote.status === "AUTHORIZED"}
									isRed={quote.status === "VOID"}
								>
									{orderStatusDictionary[quote.status]}
								</CommonPageStatus>
							) : (
								<CommonPageStatus>New</CommonPageStatus>
							)}
							<CommonPageTitle>Quote</CommonPageTitle>
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
									{quote?.status !== "AUTHORIZED" ? (
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
										<DropdownMenuItem className="dropDown__item" onSelect={() => handleUndo()}>
											Undo
										</DropdownMenuItem>
									)}
								</DropdownMenu>
							</DropdownMenuRoot>
						</CommonPageSubWrapper>
					</CommonPageActions>
					<CommonPageMain>
						<form ref={formRef} action="quoteForm" className="commonPage__main" onSubmit={handleSave}>
							<OrderLines
								errors={errors}
								control={control}
								register={register}
								setValue={setValue}
								priceListContentData={priceListContentData}
								isSubmitted={isSubmitted}
								disabled={disabled}
								orderInfo={orderInfo}
							/>
							<OrderServices
								errors={errors}
								control={control}
								register={register}
								setValue={setValue}
								priceListContentData={priceListContentData}
								disabled={disabled}
								orderInfo={orderInfo}
							/>
						</form>
						<CommonPageFooter>
							<TextareaRhf<MeatOrderFormValues>
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
