import { FC, useEffect, useMemo, useRef, useState } from "react";
import { useStore } from "zustand";
import { Link } from "react-router";
import toast from "react-hot-toast";
import { Controller, useForm, useWatch } from "react-hook-form";

import {
	useAddBill,
	useUndoBill,
	useVoidBill,
	useGetBills,
	useEmailBill,
	useUpdateBill,
	useCompleteBill,
	useAuthoriseBill,
	useGetOrganisationBills,
} from "./api";

import { SubBillLines } from "./ui/SubBillLines";
import { TotalTable } from "./ui/TotalTable";
import { BillServices } from "./ui/BillServices";
import { ReceivingsSelect } from "./ui/ReceivingsSelect";

import { useGetReceiving } from "../Receiving/api";

import {
	getNormalizedResetData,
	getNormalizedCreateBillData,
	getNormalizedCopyReceivingData,
	getNormalizedCopyServiceLinesData,
} from "./utils/getNormalizedSubBillData";
import { validateData } from "./utils/validateData";
import { calculateTotalTableValues } from "./utils/calculate";
import { getReceivingsForSelect } from "./utils/getReceivings";

import {
	DropdownMenu,
	DropdownMenuItem,
	DropdownMenuRoot,
	DropdownMenuTrigger,
} from "@/components/shared/DropdownMenu";
import { Button } from "@/components/shared/Button";
import { Loader } from "@/components/shared/Loader";
import { Input } from "@/components/shared/form/Input";
import { InputRhf } from "@/components/shared/form/InputRhf";
import { ErrorMessage } from "@/components/shared/ErrorMessage";
import { FormDayPickerRhf } from "@/components/shared/form/FormDayPickerRhf";

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

import { orgStore } from "@/app/stores/orgStore";

import { useGetPrintUrl } from "@/hooks/useGetPrintUrl";

import { getDueDate } from "@/utils/date";
import { currencySymbols } from "@/utils/currencySymbols";
import { formatNumberToCurrency } from "@/utils/formatNumberToCurrency";

import { ReceivingType } from "@/@types/purchaseOrder/receiving";
import { BillFormValues, BillPaymentStatusValues } from "@/@types/purchaseOrders";
import { GetOrderLineType, GetPurchaseOrderByIdResponseType } from "@/@types/purchaseOrder/order";

type Props = {
	orderData: GetPurchaseOrderByIdResponseType;
};

export const SubBill: FC<Props> = ({ orderData }) => {
	const orderId = orderData.id;
	const orderStatus = orderData.status;
	const paymentTerm = orderData.paymentTerm;
	const taxInclusive = orderData.taxInclusive;

	const { orgId } = useStore(orgStore);

	const formRef = useRef<HTMLFormElement>(null);
	const currentStateRef = useRef<"save" | "authorise">();

	const [showList, setShowList] = useState(true);
	const [currentBillId, setCurrentBillId] = useState("");
	const [receivingIds, setReceivingIds] = useState<string[]>([]);

	const { isLoadingPrintUrl, getPrintUrlData } = useGetPrintUrl("PurchaseOrderBill");

	const {
		data: receivings,
		error: receivingsError,
		isError: isReceivingsError,
		isLoading: isReceivingsLoading,
		isSuccess: isReceivingsSuccess,
	} = useGetReceiving({ purchaseOrderId: orderId, getData: true });
	const {
		data: orgBills,
		error: orgBillsError,
		isError: isOrgBillsError,
		isLoading: isOrgBillsLoading,
		isSuccess: isOrgBillsSuccess,
	} = useGetOrganisationBills({ orgId: orgId });

	const { data, error, isLoading, isSuccess, isError } = useGetBills({ purchaseOrderId: orderId });

	const currentBill = useMemo(() => {
		if (data && currentBillId) {
			return data.data.bills.find((item) => item.id === currentBillId);
		}
	}, [data, currentBillId]);

	const disabledStatus =
		orderStatus === "VOID" ||
		orderStatus === "DRAFT" ||
		orderStatus === "CLOSED" ||
		currentBill?.status === "AUTHORIZED" ||
		currentBill?.status === "COMPLETED";

	const disabledActions =
		orderStatus === "VOID" ||
		orderStatus === "DRAFT" ||
		orderStatus === "CLOSED" ||
		currentBill?.status === "COMPLETED";

	const disabledServices =
		orderStatus === "VOID" ||
		orderStatus === "DRAFT" ||
		orderStatus === "CLOSED" ||
		currentBill?.status === "AUTHORIZED" ||
		currentBill?.status === "COMPLETED" ||
		!receivingIds.length;

	const {
		reset,
		control,
		setValue,
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<BillFormValues>({
		defaultValues: {
			billNumber: "",
			billDate: new Date(),
			dueDate: getDueDate(new Date(), paymentTerm.method, paymentTerm.durationDays),
			lines: [],
			serviceLines: [],
		},
	});

	const billDate = useWatch({ name: "billDate", control });

	const orderLinesValues = useWatch({
		name: "lines",
		control,
	});

	const serviceLinesValues = useWatch({
		name: "serviceLines",
		control,
	});

	const orderLines = useMemo(
		() => calculateTotalTableValues(orderLinesValues, taxInclusive),
		[orderLinesValues, taxInclusive],
	);

	const serviceLines = useMemo(
		() => calculateTotalTableValues(serviceLinesValues, taxInclusive),
		[serviceLinesValues, taxInclusive],
	);

	const receivingLinesQuantity = useMemo(() => {
		if (data && receivings && receivings.data.receivings.length > 0 && receivingIds.length > 0) {
			const { receivingLinesQuantity } = getReceivingsForSelect(
				receivings.data.receivings,
				data.data.bills,
				receivingIds,
			);

			return receivingLinesQuantity;
		}

		return null;
	}, [data, receivings, receivingIds]);

	const currentOrderLines = useMemo(() => {
		if (
			receivings &&
			receivings.data.receivings.length > 0 &&
			receivingIds.length > 0 &&
			receivingLinesQuantity
		) {
			return Object.values(
				receivingIds.reduce(
					(acc, receivingId) => {
						const receiving = receivings.data.receivings.find((item) => item.id === receivingId);
						if (receiving) {
							for (const line of receiving.lines) {
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
											receivingIds: [receiving.id],
										};
							}
						}

						return acc;
					},
					{} as { [key: string]: GetOrderLineType },
				),
			).map((item) => ({ ...item, quantity: receivingLinesQuantity[item.id]?.toString() || "0" }));
		}

		return [];
	}, [receivings, receivingIds, orderData, receivingLinesQuantity]);

	const handleSelectReceiving = (value: ReceivingType, useReset = true) => {
		let localReceivingIds: string[] = [];

		setReceivingIds((prev) => {
			if (prev.includes(value.id)) {
				localReceivingIds = prev;
				return prev;
			}

			localReceivingIds = [...prev, value.id];
			return [...prev, value.id];
		});

		if (useReset) {
			if (data && receivings && receivings.data.receivings.length > 0 && localReceivingIds.length > 0) {
				const { receivingLinesQuantity } = getReceivingsForSelect(
					receivings.data.receivings,
					data.data.bills,
					localReceivingIds,
				);

				const { billFormLines } = getNormalizedCopyReceivingData(
					value,
					orderData,
					orderLinesValues,
					receivingLinesQuantity,
				);

				setValue("lines", billFormLines);
			}
		}
	};

	const handleSelectBill = (id: string) => {
		setCurrentBillId(id);

		if (data) {
			const bill = data.data.bills.find((item) => item.id === id);

			if (bill) {
				const resetData = getNormalizedResetData(bill);
				reset(resetData, { keepDefaultValues: true });

				if (bill.receivingIds.length > 0) {
					setReceivingIds(bill.receivingIds);
				}
			}
		}
	};

	const handleNewBill = () => {
		setReceivingIds([]);
		setCurrentBillId("");
		reset({
			billNumber: "",
			billDate: new Date(),
			dueDate: getDueDate(new Date(), paymentTerm.method, paymentTerm.durationDays),
			lines: [],
			serviceLines: [],
		});
	};

	const { mutate: undo, isPending: isUndoPending } = useUndoBill();
	const { mutate: email, isPending: isEmailPending } = useEmailBill();
	const { mutate, isPending: isSavePending } = useAddBill(setCurrentBillId);
	const { mutate: complete, isPending: isCompletePending } = useCompleteBill();
	const { mutate: authorise, isPending: isAuthorisePending } = useAuthoriseBill();
	const { mutateAsync: updateAsync, isPending: isUpdatePending } = useUpdateBill();
	const { mutate: mutateVoid, isPending: isVoidPending } = useVoidBill(handleNewBill);

	const isActionLoading =
		isSavePending ||
		isUndoPending ||
		isEmailPending ||
		isUpdatePending ||
		isCompletePending ||
		isAuthorisePending ||
		isVoidPending;

	const toggleShowList = () => {
		setShowList((prev) => !prev);
	};

	const handleCopyServiceLinesFromOrder = () => {
		const data = getNormalizedCopyServiceLinesData(orderData);
		setValue("serviceLines", data);
	};

	const handleActions = async (type: "undo" | "void" | "email" | "complete") => {
		if (orderId && currentBill) {
			switch (type) {
				case "undo":
					undo({ orderId, body: { id: currentBill.id } });
					break;
				case "email":
					email({ orderId, body: { id: currentBill.id } });
					break;
				case "complete":
					complete({ orderId, body: { id: currentBill.id } });
					break;
				case "void":
					mutateVoid({ orderId, body: { id: currentBill.id } });
					break;
			}
		}
	};

	const onSubmit = async (formData: BillFormValues) => {
		const isCurrentBill = !!currentBill;

		const validateAllocation = formData.serviceLines.map((item, index) => {
			const total = +item.total;
			const allocation = item.allocation.reduce((acc, item) => acc + +item.cost, 0);

			if (total !== allocation) {
				toast.error(
					`Allocation total (${formatNumberToCurrency(allocation)}) does not match service line ${index + 1} total (${formatNumberToCurrency(total)})`,
				);
				return false;
			}

			return true;
		});

		if (orderId && !validateAllocation.includes(false)) {
			const normalizedData = getNormalizedCreateBillData(formData, false, false, receivingIds);
			const isValid = validateData(normalizedData);

			if (isValid) {
				if (isCurrentBill) {
					await updateAsync({ orderId, body: { id: currentBill.id, ...normalizedData } });

					if (currentStateRef.current === "authorise") {
						authorise({ orderId, body: { id: currentBill.id } });
					}
				} else {
					mutate({ formData, body: { orderId: orderId, ...normalizedData } });
				}
			}
		}
	};

	useEffect(() => {
		if (paymentTerm && billDate) {
			const newDueDate = getDueDate(billDate, paymentTerm.method, paymentTerm.durationDays);
			setValue("dueDate", newDueDate);
		}
	}, [paymentTerm, billDate, setValue]);

	return (
		<CommonPageWrapper>
			{isLoading || isReceivingsLoading || isOrgBillsLoading ? (
				<Loader isFullWidth />
			) : isError && error ? (
				<ErrorMessage error={error} />
			) : isReceivingsError && receivingsError ? (
				<ErrorMessage error={receivingsError} />
			) : isOrgBillsError && orgBillsError ? (
				<ErrorMessage error={orgBillsError} />
			) : isSuccess && data.data ? (
				<>
					<div className={`receivingTab ${showList ? "receivingTab--active" : ""}`}>
						<div className={`receivinglist ${showList ? "receivinglist--active" : ""}`}>
							<div className="receivinglist__header">
								<h2 className="receivinglist__title">Bill List</h2>
							</div>
							<div className="receivinglist__content">
								{data.data.bills.map((item) => {
									const allocations = item.serviceLines.map((line) => line.allocation).flat();
									const allocationsData =
										isOrgBillsSuccess && orgBills.data.length > 0
											? allocations
													.map((allocation) => {
														const currentBill = orgBills.data.find((bill) => bill.id === allocation.billId);
														const currentBillLine = currentBill?.lines.find(
															(line) => line.id === allocation.billLineId,
														);
														if (currentBill && currentBillLine) {
															return {
																billNumber: currentBill.billNumber,
																productName: currentBillLine.product.name,
																cost: allocation.cost,
															};
														} else {
															return null;
														}
													})
													.filter((item) => item !== null)
											: [];

									return (
										<div className="receivinglist__wrapper" key={item.id}>
											<button
												type="button"
												className={`
												receivinglist__item
												receivinglist__item--${item.status.toLocaleLowerCase()}
												${currentBill?.id === item.id ? "receivinglist__item--active" : ""}
											`}
												onClick={() => {
													if (currentBill?.id !== item.id) handleSelectBill(item.id);
												}}
											>
												<p className="receivinglist__text">
													{item.billNumber || "Draft Bill"}
													<span>
														Due: {currencySymbols?.[orderData.currency.code] || ""}
														{formatNumberToCurrency(item.due)}
													</span>
												</p>
											</button>
											{item.receivings.length > 0 && (
												<>
													<p className="receivinglist__subTitle">Linked Receivings</p>
													{item.receivings.map((item) => (
														<p key={item.id} className="receivinglist__linkedItem">
															Receiving - {item.receivingNumber}
														</p>
													))}
												</>
											)}
											{item.payments.length > 0 && (
												<>
													<p className="receivinglist__subTitle">Payments</p>
													{item.payments.map((payment) => (
														<p key={payment.id} className="receivinglist__payment">
															<span>Payment #{payment.paymentNumber}</span>
															<span>Paid: {formatNumberToCurrency(payment.amount)}</span>
														</p>
													))}
												</>
											)}
											{allocationsData.length > 0 && (
												<>
													<p className="receivinglist__subTitle">Allocations</p>
													{allocationsData.map((allocation, index) => (
														<p key={index} className="receivinglist__payment">
															<span>Bill: {allocation.billNumber}</span>
															<span>Cost: {formatNumberToCurrency(allocation.cost)}</span>
														</p>
													))}
												</>
											)}
										</div>
									);
								})}
							</div>
						</div>
						<div>
							<CommonPageHeader>
								<CommonPageSubWrapper>
									{currentBill ? (
										<>
											<CommonPageStatus
												isRed={currentBill.status === "VOID"}
												isYellow={currentBill.status === "DRAFT"}
												isGreen={currentBill.status === "AUTHORIZED" || currentBill.status === "COMPLETED"}
											>
												{currentBill.status.toLocaleLowerCase()}
											</CommonPageStatus>
											<CommonPageStatus
												isRed={currentBill.paymentStatus === "UNPAID"}
												isGreen={currentBill.paymentStatus === "PAID"}
												isYellow={currentBill.paymentStatus === "PARTIALLY_PAID"}
											>
												{BillPaymentStatusValues[currentBill.paymentStatus].toLocaleLowerCase()}
											</CommonPageStatus>
										</>
									) : (
										<CommonPageStatus>New</CommonPageStatus>
									)}
									<CommonPageTitle>Bill</CommonPageTitle>
								</CommonPageSubWrapper>
								<CommonPageActions>
									<Button type="button" isSecondary onClick={toggleShowList}>
										{showList ? (
											<>
												<svg width="18" height="18" focusable="false" aria-hidden="true">
													<use xlinkHref="/icons/icons.svg#eyeClose" />
												</svg>
												Hide Bill List
											</>
										) : (
											<>
												<svg width="18" height="18" focusable="false" aria-hidden="true">
													<use xlinkHref="/icons/icons.svg#eyeOpen" />
												</svg>
												Show Bill List
											</>
										)}
									</Button>
									{currentBill && currentBill.xeroInvoiceUrl && (
										<Link className="link link--secondary" to={currentBill.xeroInvoiceUrl}>
											View Xero Bill
										</Link>
									)}
									{!disabledStatus && isReceivingsSuccess && receivings.data.receivings.length > 0 && (
										<ReceivingsSelect
											id="receivingsSelectId"
											bills={data.data.bills}
											receivingIds={receivingIds}
											onValueChange={handleSelectReceiving}
											customValues={receivings.data.receivings}
										/>
									)}
									{currentBill && (
										<Button type="button" isSecondary onClick={handleNewBill}>
											<svg width="18" height="18" focusable="false" aria-hidden="true">
												<use xlinkHref="/icons/icons.svg#plus" />
											</svg>
											New Bill
										</Button>
									)}
									{currentBill && (
										<Button
											isSecondary
											type="button"
											disabled={isLoadingPrintUrl}
											isLoading={isLoadingPrintUrl}
											onClick={() => getPrintUrlData(currentBill.id)}
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
												<Button type="button" isLoading={isActionLoading} disabled={isActionLoading}>
													<svg width="18" height="18" focusable="false" aria-hidden="true">
														<use xlinkHref="/icons/icons.svg#dotsInCicle" />
													</svg>
													Actions
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenu className="dropDown__content" sideOffset={10} align="end">
												{currentBill?.status !== "AUTHORIZED" && (
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
												{currentBill?.status === "DRAFT" && (
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
												{currentBill?.status === "DRAFT" && (
													<DropdownMenuItem className="dropDown__item" onClick={() => handleActions("void")}>
														Void
													</DropdownMenuItem>
												)}
												{currentBill?.status === "AUTHORIZED" && (
													<DropdownMenuItem className="dropDown__item" onClick={() => handleActions("undo")}>
														Undo
													</DropdownMenuItem>
												)}
												{currentBill?.status === "AUTHORIZED" && (
													<DropdownMenuItem
														className="dropDown__item"
														onClick={() => handleActions("complete")}
													>
														Mark as complete
													</DropdownMenuItem>
												)}
												{(currentBill?.status === "AUTHORIZED" || currentBill?.status === "COMPLETED") && (
													<DropdownMenuItem className="dropDown__item" onClick={() => handleActions("email")}>
														Email
													</DropdownMenuItem>
												)}
											</DropdownMenu>
										</DropdownMenuRoot>
									)}
								</CommonPageActions>
							</CommonPageHeader>
							<CommonPageMain>
								<form
									id="billForm"
									ref={formRef}
									className="commonPage__main"
									onSubmit={handleSubmit(onSubmit)}
								>
									<fieldset className="form__fieldset form__fieldset--fullWidth">
										<InputRhf<BillFormValues>
											type="text"
											name="billNumber"
											id="billNumberId"
											label="Bill Number*"
											register={register}
											rules={{
												required: "Required",
											}}
											disabled={disabledStatus}
											error={errors.billNumber?.message}
										/>
										<Controller
											name="billDate"
											control={control}
											rules={{
												required: "Required",
											}}
											render={({ field }) => {
												return (
													<FormDayPickerRhf
														{...field}
														value={field.value}
														placeholder="Bill Date*"
														disabled={disabledStatus}
														onValueChange={field.onChange}
														error={errors.billDate?.message}
													/>
												);
											}}
										/>
										<Controller
											name="dueDate"
											control={control}
											rules={{
												required: "Required",
											}}
											render={({ field }) => {
												return (
													<FormDayPickerRhf
														{...field}
														value={field.value}
														placeholder="Due Date*"
														disabled={disabledStatus}
														onValueChange={field.onChange}
														error={errors.dueDate?.message}
													/>
												);
											}}
										/>
										<Input
											disabled
											id="totalId"
											label={`Total (${orderData.currency.code})`}
											value={(orderLines.total + serviceLines.total).toFixed(2)}
										/>
									</fieldset>
									<SubBillLines
										errors={errors}
										control={control}
										register={register}
										setValue={setValue}
										orderData={orderData}
										disabledStatus={disabledStatus}
										currentOrderLines={currentOrderLines}
										currentBillStatus={currentBill?.status}
										receivingLinesQuantity={receivingLinesQuantity}
									/>
									<BillServices
										errors={errors}
										control={control}
										register={register}
										setValue={setValue}
										orderData={orderData}
										currentBill={currentBill}
										disabledServices={disabledServices}
										handleCopyServiceLinesFromOrder={handleCopyServiceLinesFromOrder}
									/>
									<CommonPageFooter>
										<div />
										<TotalTable
											orderLines={orderLines}
											additionalExpense={false}
											serviceLines={serviceLines}
										/>
									</CommonPageFooter>
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
