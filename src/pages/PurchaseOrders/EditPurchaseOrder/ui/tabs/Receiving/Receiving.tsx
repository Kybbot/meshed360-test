import { FC, useMemo, useRef, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";

import { ReceivingLines } from "./ui";
import { BillsSelect } from "./ui/BillsSelect";

import {
	useGetReceiving,
	useAddReceivings,
	useUndoReceivings,
	useVoidReceivings,
	useUpdateReceivings,
	useAuthoriseReceivings,
} from "./api";
import { useGetBills } from "../Bill/api";

import {
	getNormalizedResetData,
	getNormalizedCopyBillData,
	getNormalizedCreateReceivingsData,
	getNormalizedUpdateReceivingsData,
	getNormalizedCopyData,
} from "./utils/getNormalizedReceivingsData";
import { validateData } from "./utils/validateData";

import {
	DropdownMenu,
	DropdownMenuItem,
	DropdownMenuRoot,
	DropdownMenuTrigger,
} from "@/components/shared/DropdownMenu";
import { Loader } from "@/components/shared/Loader";
import { Button } from "@/components/shared/Button";
import { ErrorMessage } from "@/components/shared/ErrorMessage";
import { FormDayPickerRhf } from "@/components/shared/form/FormDayPickerRhf";

import {
	CommonPageActions,
	CommonPageHeader,
	CommonPageMain,
	CommonPageStatus,
	CommonPageSubWrapper,
	CommonPageTitle,
	CommonPageWrapper,
} from "@/components/widgets/Page";

import { useGetPrintUrl } from "@/hooks/useGetPrintUrl";

import { BillType } from "@/@types/purchaseOrders";
import { ReceivingFormValues, DefaultReceivingRow } from "@/@types/purchaseOrder/receiving";
import { GetOrderLineType, GetPurchaseOrderByIdResponseType } from "@/@types/purchaseOrder/order";

type Props = {
	orderData: GetPurchaseOrderByIdResponseType;
};

export const Receiving: FC<Props> = ({ orderData }) => {
	const orderId = orderData.id;
	const orderStatus = orderData.status;
	const billFirst = orderData.billFirst;
	const blindBill = orderData.blindBill;
	const stockFirst = orderData.stockFirst;

	const formRef = useRef<HTMLFormElement>(null);
	const currentStateRef = useRef<"save" | "authorise">();

	const [showReceivingList, setShowReceivingList] = useState(true);
	const [currentReceivingId, setCurrentReceivingId] = useState<string>("");

	const [billIds, setBillIds] = useState<string[]>([]);

	const { isLoadingPrintUrl, getPrintUrlData } = useGetPrintUrl("PurchaseOrderReceiving");

	const {
		data: bills,
		error: billsError,
		isError: isBillsError,
		isLoading: isBillsLoading,
		isSuccess: isBillsSuccess,
	} = useGetBills({ purchaseOrderId: orderId, getData: billFirst });
	const { data, error, isLoading, isSuccess, isError } = useGetReceiving({ purchaseOrderId: orderId });

	const currentReceiving = useMemo(() => {
		if (data && currentReceivingId) {
			return data.data.receivings.find((item) => item.id === currentReceivingId);
		}
	}, [data, currentReceivingId]);

	const disabledStatus =
		orderStatus === "VOID" ||
		(orderStatus === "DRAFT" && !blindBill) ||
		orderStatus === "CLOSED" ||
		currentReceiving?.status === "VOID" ||
		currentReceiving?.status === "AUTHORIZED";

	const disabledActions =
		orderStatus === "VOID" || (orderStatus === "DRAFT" && !blindBill) || orderStatus === "CLOSED";

	const {
		reset,
		control,
		setValue,
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<ReceivingFormValues>({
		defaultValues: {
			receivingDate: new Date(),
			lines: billFirst ? [] : [DefaultReceivingRow],
		},
	});

	const allLines = useWatch({
		name: "lines",
		control,
	});

	const currentOrderLines = useMemo(() => {
		if (bills && bills.data.bills.length > 0 && billIds.length > 0) {
			return Object.values(
				billIds.reduce(
					(acc, billId) => {
						const bill = bills.data.bills.find((item) => item.id === billId);

						if (bill) {
							for (const line of bill.lines) {
								const currentOrderLine = orderData.orderLines.find((item) => item.id === line.orderLineId)!;

								acc[line.orderLineId] = acc[line.orderLineId]
									? {
											...acc[line.orderLineId],
											quantity: (+acc[line.orderLineId].quantity + +line.quantity).toString(),
										}
									: {
											id: currentOrderLine.id,
											product: line.product,
											comment: currentOrderLine.comment,
											supplierSku: line.supplierSku,
											unitOfMeasure: currentOrderLine.unitOfMeasure,
											quantity: line.quantity.toString(),
											unitPrice: currentOrderLine.unitPrice,
											discount: currentOrderLine.discount,
											taxType: currentOrderLine.taxType,
											trackingCategory1: currentOrderLine.trackingCategory1,
											trackingCategory2: currentOrderLine.trackingCategory2,
											billIds: [bill.id],
										};
							}
						}

						return acc;
					},
					{} as { [key: string]: GetOrderLineType },
				),
			);
		}

		return [];
	}, [bills, billIds, orderData]);

	const receivingListQuantity = useMemo(() => {
		if (data) {
			return data.data.receivings.reduce(
				(acc, receiving) => {
					for (const line of receiving.lines) {
						acc[line.orderLineId] = acc[line.orderLineId]
							? acc[line.orderLineId] + +line.quantity
							: +line.quantity;
					}

					return acc;
				},
				{} as { [key: string]: number },
			);
		}

		return {};
	}, [data]);

	const handleSelectBill = (value: BillType, useReset = true) => {
		setBillIds((prev) => {
			if (prev.includes(value.id)) return prev;
			return [...prev, value.id];
		});

		if (useReset) {
			const { receivingFormLines } = getNormalizedCopyBillData(value, orderData, receivingListQuantity);

			setValue("lines", [...allLines, ...receivingFormLines]);
		}
	};

	const handleSelectReceiving = (id: string) => {
		setCurrentReceivingId(id);

		if (data) {
			const receiving = data.data.receivings.find((item) => item.id === id);

			if (receiving) {
				const data = getNormalizedResetData(receiving);
				reset(data, { keepDefaultValues: true });

				if (receiving.billIds.length > 0) {
					setBillIds(receiving.billIds);
				}
			}
		}
	};

	const handleCopyFromOrder = () => {
		const resetData = getNormalizedCopyData(orderData, receivingListQuantity);
		reset(resetData, { keepDefaultValues: true });
	};

	const handleNewReceiving = () => {
		setCurrentReceivingId("");
		setBillIds([]);
		reset({
			receivingDate: new Date(),
			lines: billFirst ? [] : [DefaultReceivingRow],
		});
	};

	const { mutate: undo } = useUndoReceivings();
	const { mutate: authorise } = useAuthoriseReceivings();
	const { mutateAsync: updateAsync } = useUpdateReceivings();
	const { mutate } = useAddReceivings(setCurrentReceivingId);
	const { mutate: mutateVoid } = useVoidReceivings(handleNewReceiving);

	const toggleShowReceivingList = () => {
		setShowReceivingList((prev) => !prev);
	};

	const handleActions = async (type: "undo" | "void") => {
		if (orderId && currentReceiving) {
			switch (type) {
				case "undo":
					undo({ orderId, body: { id: currentReceiving.id } });
					break;
				case "void":
					mutateVoid({ orderId, body: { id: currentReceiving.id } });
					break;
			}
		}
	};

	const onSubmit = async (formData: ReceivingFormValues) => {
		const isCurrentReceiving = !!currentReceiving;

		if (orderId) {
			if (isCurrentReceiving) {
				const data = getNormalizedUpdateReceivingsData(formData, blindBill, stockFirst, billIds);
				const isValid = validateData(data);

				if (isValid) {
					await updateAsync({ orderId, body: { id: currentReceiving.id, ...data } });

					if (currentStateRef.current === "authorise") {
						authorise({ orderId, body: { id: currentReceiving.id } });
					}
				}
			} else {
				const data = getNormalizedCreateReceivingsData(formData, blindBill, stockFirst, billIds);
				const isValid = validateData(data);

				if (isValid) {
					mutate({ body: { orderId: orderId, ...data } });
				}
			}
		}
	};

	return (
		<CommonPageWrapper>
			{isLoading || isBillsLoading ? (
				<Loader isFullWidth />
			) : isError && error ? (
				<ErrorMessage error={error} />
			) : isBillsError && billsError ? (
				<ErrorMessage error={billsError} />
			) : isSuccess && data.data ? (
				<>
					<div className={`receivingTab ${showReceivingList ? "receivingTab--active" : ""}`}>
						<div className={`receivinglist ${showReceivingList ? "receivinglist--active" : ""}`}>
							<div className="receivinglist__header">
								<h2 className="receivinglist__title">Received List</h2>
							</div>
							<div className="receivinglist__content">
								{data.data.receivings.map((item) => (
									<div className="receivinglist__wrapper" key={item.id}>
										<button
											type="button"
											className={`
												receivinglist__item
												receivinglist__item--${item.status.toLocaleLowerCase()}
												${currentReceiving?.id === item.id ? "receivinglist__item--active" : ""}
											`}
											onClick={() => {
												handleSelectReceiving(item.id);
											}}
										>
											{item.receivingNumber}
										</button>
										{item?.bills.length > 0 && (
											<>
												<p className="receivinglist__subTitle">Linked bills</p>
												{item.bills.map((item) => (
													<p key={item.id} className="receivinglist__linkedItem">
														Bill - {item.billNumber}
													</p>
												))}
											</>
										)}
									</div>
								))}
							</div>
						</div>
						<div>
							<CommonPageHeader>
								<CommonPageSubWrapper>
									{currentReceiving ? (
										<CommonPageStatus
											isRed={currentReceiving.status === "VOID"}
											isYellow={currentReceiving.status === "DRAFT"}
											isGreen={currentReceiving.status === "AUTHORIZED"}
										>
											{currentReceiving.status.toLocaleLowerCase()}
										</CommonPageStatus>
									) : (
										<CommonPageStatus>New</CommonPageStatus>
									)}
									<CommonPageTitle>Stock Received</CommonPageTitle>
								</CommonPageSubWrapper>
								<CommonPageActions>
									<Button type="button" isSecondary onClick={toggleShowReceivingList}>
										{showReceivingList ? (
											<>
												<svg width="18" height="18" focusable="false" aria-hidden="true">
													<use xlinkHref="/icons/icons.svg#eyeClose" />
												</svg>
												Hide Receiving List
											</>
										) : (
											<>
												<svg width="18" height="18" focusable="false" aria-hidden="true">
													<use xlinkHref="/icons/icons.svg#eyeOpen" />
												</svg>
												Show Receiving List
											</>
										)}
									</Button>
									{!disabledStatus && billFirst && isBillsSuccess && bills.data.bills.length > 0 && (
										<BillsSelect
											billIds={billIds}
											id="billsSelectId"
											customValues={bills.data.bills}
											onValueChange={handleSelectBill}
											receivings={data.data.receivings}
										/>
									)}
									{currentReceiving && (
										<Button type="button" isSecondary onClick={handleNewReceiving}>
											<svg width="18" height="18" focusable="false" aria-hidden="true">
												<use xlinkHref="/icons/icons.svg#plus" />
											</svg>
											New Receiving
										</Button>
									)}
									{currentReceiving && (
										<Button
											isSecondary
											type="button"
											disabled={isLoadingPrintUrl}
											isLoading={isLoadingPrintUrl}
											onClick={() => getPrintUrlData(currentReceiving.id)}
										>
											<svg width="18" height="18" focusable="false" aria-hidden="true">
												<use xlinkHref="/icons/icons.svg#print" />
											</svg>
											Print
										</Button>
									)}
									{!disabledActions && (
										<DropdownMenuRoot modal={false}>
											<DropdownMenuTrigger asChild>
												<Button type="button" disabled={currentReceiving?.status === "VOID"}>
													<svg width="18" height="18" focusable="false" aria-hidden="true">
														<use xlinkHref="/icons/icons.svg#dotsInCicle" />
													</svg>
													Actions
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenu className="dropDown__content" sideOffset={10} align="end">
												{currentReceiving?.status !== "AUTHORIZED" && (
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
												{currentReceiving?.status === "DRAFT" && (
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
												{currentReceiving?.status === "AUTHORIZED" && (
													<DropdownMenuItem className="dropDown__item" onClick={() => handleActions("undo")}>
														Undo
													</DropdownMenuItem>
												)}
												{currentReceiving?.status === "DRAFT" && (
													<DropdownMenuItem className="dropDown__item" onClick={() => handleActions("void")}>
														Void
													</DropdownMenuItem>
												)}
											</DropdownMenu>
										</DropdownMenuRoot>
									)}
								</CommonPageActions>
							</CommonPageHeader>
							<CommonPageMain>
								<form
									ref={formRef}
									id="receivingForm"
									style={{ display: "grid" }}
									onSubmit={handleSubmit(onSubmit)}
								>
									<div style={{ maxWidth: "270px", marginBottom: "16px" }}>
										<Controller
											name="receivingDate"
											control={control}
											rules={{
												required: "Required",
											}}
											render={({ field }) => {
												return (
													<FormDayPickerRhf
														{...field}
														value={field.value}
														placeholder="Date Received"
														onValueChange={field.onChange}
														error={errors.receivingDate?.message}
														disabled={
															disabledStatus ||
															currentReceiving?.status === "VOID" ||
															currentReceiving?.status === "AUTHORIZED"
														}
													/>
												);
											}}
										/>
									</div>
									<ReceivingLines
										errors={errors}
										data={data.data}
										control={control}
										register={register}
										setValue={setValue}
										orderData={orderData}
										disabledStatus={disabledStatus}
										currentReceiving={currentReceiving}
										currentOrderLines={currentOrderLines}
										handleCopyFromOrder={handleCopyFromOrder}
									/>
								</form>
							</CommonPageMain>
						</div>
					</div>
				</>
			) : (
				<p className="empty_list">No data available</p>
			)}
		</CommonPageWrapper>
	);
};
