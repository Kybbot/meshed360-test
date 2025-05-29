import { FC, useEffect, useRef } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useNavigate, useParams } from "react-router";

import { OrderLines, OrderCosts, TotalTable } from "./ui";

import {
	useUndoOrderLines,
	useVoidOrdersLines,
	useAuthoriseOrderLines,
	useAddPurchaseOrderLines,
} from "./api";

import { validateData } from "./utils/validateData";
import { getNormalizedOrderData } from "./utils/getNormalizedDefaultData";

import {
	DropdownMenu,
	DropdownMenuItem,
	DropdownMenuRoot,
	DropdownMenuTrigger,
} from "@/components/shared/DropdownMenu";
import { Button } from "@/components/shared/Button";
import { TextareaRhf } from "@/components/shared/form/TextareaRhf";

import {
	CommonPageActions,
	CommonPageFooter,
	CommonPageHeader,
	CommonPageMain,
	CommonPageStatus,
	CommonPageSubWrapper,
	CommonPageTitle,
	CommonPageWrapper,
} from "@/components/widgets/Page";

import { useGetPrintUrl } from "@/hooks/useGetPrintUrl";

import { GetPurchaseOrderByIdResponseType } from "@/@types/purchaseOrder/order";
import { DefaultOrderLine, OrderLinesFormValues } from "@/@types/purchaseOrder/orderLines";

type Props = {
	orderData: GetPurchaseOrderByIdResponseType;
};

export const Orders: FC<Props> = ({ orderData }) => {
	const lineStatus = orderData.lineStatus;
	const taxInclusive = orderData.taxInclusive;

	const navigate = useNavigate();
	const { orderId } = useParams();

	const isFirstResetRef = useRef(true);
	const formRef = useRef<HTMLFormElement>(null);
	const currentStateRef = useRef<"save" | "authorise">();

	const { mutate } = useAddPurchaseOrderLines();

	const { isLoadingPrintUrl, getPrintUrlData } = useGetPrintUrl("PurchaseOrder");

	const { mutate: undo, isPending: isUndoPending } = useUndoOrderLines();
	const { mutate: authorise, isPending: isAuthorisePending } = useAuthoriseOrderLines();
	const { mutate: mutateVoid, isPending: isVoidPending, isSuccess: isSuccessVoid } = useVoidOrdersLines();

	const isActionLoading = isUndoPending || isAuthorisePending || isVoidPending;

	const {
		reset,
		control,
		setValue,
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<OrderLinesFormValues>({
		defaultValues: {
			orderLines: [DefaultOrderLine],
			additionalLines: [],
			memo: "",
		},
	});

	const orderLinesValues = useWatch({
		name: "orderLines",
		control,
	});

	const serviceLinesValues = useWatch({
		name: "additionalLines",
		control,
	});

	const handleActions = async (type: "undo" | "void") => {
		if (orderId) {
			switch (type) {
				case "undo":
					undo({ body: { id: orderId } });
					break;
				case "void":
					mutateVoid({ body: { id: orderId } });
					break;
			}
		}
	};

	const onSubmit = async (formData: OrderLinesFormValues) => {
		if (orderId) {
			const data = getNormalizedOrderData(formData, orderId);
			const isValid = validateData(data);

			if (isValid) {
				if (currentStateRef.current === "save") {
					mutate({ formData, body: data });
				} else {
					authorise({ formData, body: data });
				}
			}
		}
	};

	useEffect(() => {
		if (isFirstResetRef.current) {
			reset(
				{
					orderLines: orderData.orderLines.length ? orderData.orderLines : [DefaultOrderLine],
					additionalLines: orderData.additionalLines.map((item) => ({
						...item,
						...(item.description
							? { product: { id: "", name: item.description } }
							: { product: item.product }),
					})),
					memo: orderData.memo,
				},
				{ keepDefaultValues: true },
			);

			isFirstResetRef.current = false;
		}
	}, [orderData, reset]);

	useEffect(() => {
		if (isSuccessVoid) {
			navigate("/purchases/orders");
		}
	}, [isSuccessVoid, navigate]);

	return (
		<CommonPageWrapper>
			<CommonPageHeader>
				<CommonPageSubWrapper>
					<CommonPageStatus isYellow={lineStatus === "DRAFT"} isGreen={lineStatus === "AUTHORISED"}>
						{lineStatus.toLocaleLowerCase()}
					</CommonPageStatus>
					<CommonPageTitle>Order Lines</CommonPageTitle>
				</CommonPageSubWrapper>
				<CommonPageActions>
					{orderData.id && (
						<Button
							isSecondary
							type="button"
							disabled={isLoadingPrintUrl}
							isLoading={isLoadingPrintUrl}
							onClick={() => getPrintUrlData(orderData.id)}
						>
							<svg width="18" height="18" focusable="false" aria-hidden="true">
								<use xlinkHref="/icons/icons.svg#print" />
							</svg>
							Print
						</Button>
					)}
					<DropdownMenuRoot modal={false}>
						<DropdownMenuTrigger asChild>
							<Button type="button" isLoading={isActionLoading} disabled={isActionLoading}>
								<svg width="18" height="18" focusable="false" aria-hidden="true">
									<use xlinkHref="/icons/icons.svg#dotsInCicle" />
								</svg>
								Actions
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenu className="dropDown__content" sideOffset={10} align="end">
							{lineStatus !== "AUTHORISED" && (
								<DropdownMenuItem
									className="dropDown__item"
									onSelect={() => {
										if (formRef.current) {
											currentStateRef.current = "save";
											formRef.current.requestSubmit();
										}
									}}
								>
									Save
								</DropdownMenuItem>
							)}
							{lineStatus !== "AUTHORISED" && (
								<DropdownMenuItem
									className="dropDown__item"
									onSelect={() => {
										if (formRef.current) {
											currentStateRef.current = "authorise";
											formRef.current.requestSubmit();
										}
									}}
								>
									Authorise
								</DropdownMenuItem>
							)}
							{lineStatus === "AUTHORISED" && (
								<DropdownMenuItem className="dropDown__item" onClick={() => handleActions("undo")}>
									Undo
								</DropdownMenuItem>
							)}
							{lineStatus === "DRAFT" && (
								<DropdownMenuItem className="dropDown__item" onClick={() => handleActions("void")}>
									Void
								</DropdownMenuItem>
							)}
						</DropdownMenu>
					</DropdownMenuRoot>
				</CommonPageActions>
			</CommonPageHeader>
			<CommonPageMain>
				<form
					ref={formRef}
					id="purchaseOrderForm"
					className="commonPage__main"
					onSubmit={handleSubmit(onSubmit)}
				>
					<OrderLines
						errors={errors}
						control={control}
						register={register}
						setValue={setValue}
						orderData={orderData}
						lineStatus={lineStatus}
					/>
					<OrderCosts
						errors={errors}
						control={control}
						register={register}
						setValue={setValue}
						orderData={orderData}
						lineStatus={lineStatus}
					/>
				</form>
				<CommonPageFooter>
					<TextareaRhf<OrderLinesFormValues>
						name="memo"
						id="memoId"
						register={register}
						label="Purchase Order Memo"
						error={errors.memo?.message}
					/>
					<TotalTable
						firstHeader="Order Line"
						taxInclusive={taxInclusive}
						secondHeader="Additional Costs"
						orderLinesValues={orderLinesValues}
						serviceLinesValues={serviceLinesValues}
					/>
				</CommonPageFooter>
			</CommonPageMain>
		</CommonPageWrapper>
	);
};
