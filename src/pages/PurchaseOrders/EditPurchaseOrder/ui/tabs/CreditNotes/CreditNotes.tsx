import { FC, useEffect, useMemo, useRef, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";

import { Lines } from "./ui/Lines";
import { Services } from "./ui/Services";
import { TotalTable } from "./ui/TotalTable";
import { BillsSelect } from "./ui/BillsSelect";

import {
	useGetCreditNote,
	useAddCreditNote,
	useUndoCreditNote,
	useVoidCreditNote,
	useUpdateCreditNote,
	useAuthoriseCreditNote,
} from "./api";
import { useGetBills } from "../Bill/api";

import {
	getNormalizedResetData,
	getNormalizedCopyBillData,
	getNormalizedCurrentOrderLines,
	getNormalizedCreateCreditNoteData,
} from "./utils/getNormalizedCreditNoteData";
import { validateData } from "./utils/validteData";
import { calculateTotalTableValues1, calculateTotalTableValues2 } from "./utils/calculate";

import {
	DropdownMenu,
	DropdownMenuRoot,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/shared/DropdownMenu";
import { Loader } from "@/components/shared/Loader";
import { Button } from "@/components/shared/Button";
import { Input } from "@/components/shared/form/Input";
import { ErrorMessage } from "@/components/shared/ErrorMessage";
import { FormDayPickerRhf } from "@/components/shared/form/FormDayPickerRhf";

import {
	CommonPageMain,
	CommonPageTitle,
	CommonPageFooter,
	CommonPageHeader,
	CommonPageStatus,
	CommonPageActions,
	CommonPageWrapper,
	CommonPageSubWrapper,
} from "@/components/widgets/Page";

import { BillType } from "@/@types/purchaseOrders";
import { GetPurchaseOrderByIdResponseType } from "@/@types/purchaseOrder/order";
import { CreditNoteFormValues, DefaultCreditNoteServiceLine } from "@/@types/purchaseOrder/creditNote";

type Props = {
	orderData: GetPurchaseOrderByIdResponseType;
};

export const CreditNotes: FC<Props> = ({ orderData }) => {
	const orderId = orderData.id;
	const orderStatus = orderData.status;
	const taxInclusive = orderData.taxInclusive;
	const additionalExpense = orderData.additionalExpense;

	const formRef = useRef<HTMLFormElement>(null);
	const currentStateRef = useRef<"save" | "authorise">();

	const [billIds, setBillIds] = useState<string[]>([]);

	const {
		data: bills,
		error: billsError,
		isError: isBillsError,
		isLoading: isBillsLoading,
		isSuccess: isBillsSuccess,
	} = useGetBills({ purchaseOrderId: orderId });
	const { data, error, isLoading, isSuccess, isError } = useGetCreditNote({ purchaseOrderId: orderId });

	const currentCreditNote = data?.data;

	const disabledStatus =
		orderStatus === "VOID" ||
		orderStatus === "DRAFT" ||
		orderStatus === "CLOSED" ||
		currentCreditNote?.status === "AUTHORIZED";

	const disabledActions = orderStatus === "VOID" || orderStatus === "DRAFT" || orderStatus === "CLOSED";

	const disabledServices =
		orderStatus === "VOID" ||
		orderStatus === "DRAFT" ||
		orderStatus === "CLOSED" ||
		currentCreditNote?.status === "AUTHORIZED";

	const {
		reset,
		control,
		setValue,
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<CreditNoteFormValues>({
		defaultValues: {
			date: new Date(),
			total: "",
			lines: [],
			serviceLines: !additionalExpense ? [] : [DefaultCreditNoteServiceLine],
		},
	});

	const orderLinesValues = useWatch({ name: "lines", control });
	const serviceLinesValues = useWatch({ name: "serviceLines", control });

	const orderLines = useMemo(
		() => calculateTotalTableValues1(orderLinesValues, taxInclusive),
		[orderLinesValues, taxInclusive],
	);
	const serviceLines = useMemo(
		() => calculateTotalTableValues2(serviceLinesValues, taxInclusive),
		[serviceLinesValues, taxInclusive],
	);

	const currentOrderLines = useMemo(() => {
		if (bills && bills.data.bills.length > 0 && billIds.length > 0) {
			const lines = getNormalizedCurrentOrderLines(bills.data.bills, billIds);

			return lines;
		}

		return [];
	}, [bills, billIds]);

	const handleSelectBill = (value: BillType) => {
		setBillIds((prev) => {
			if (prev.includes(value.id)) return prev;
			return [...prev, value.id];
		});

		const { lines, serviceLines } = getNormalizedCopyBillData(value, orderLinesValues);

		setValue("lines", lines);

		if (serviceLinesValues.length === 1 && !serviceLinesValues[0].product) {
			setValue("serviceLines", serviceLines);
		} else {
			setValue("serviceLines", [...serviceLinesValues, ...serviceLines]);
		}
	};

	const handleNewCreditNote = () => {
		setBillIds([]);
		reset({
			date: new Date(),
			total: "",
			lines: [],
			serviceLines: !additionalExpense ? [] : [DefaultCreditNoteServiceLine],
		});
	};

	const { mutate } = useAddCreditNote();
	const { mutate: undo } = useUndoCreditNote();
	const { mutate: authorise } = useAuthoriseCreditNote();
	const { mutateAsync: updateAsync } = useUpdateCreditNote();
	const { mutate: mutateVoid } = useVoidCreditNote(handleNewCreditNote);

	const handleActions = async (type: "undo" | "void") => {
		if (orderId && currentCreditNote) {
			switch (type) {
				case "undo":
					undo({ orderId, body: { id: currentCreditNote.id } });
					break;
				case "void":
					mutateVoid({ orderId, body: { id: currentCreditNote.id } });
					break;
			}
		}
	};

	const onSubmit = async (formData: CreditNoteFormValues) => {
		const isCurrent = !!currentCreditNote;

		if (orderId) {
			const data = getNormalizedCreateCreditNoteData(formData, billIds);
			const isValid = validateData(data);

			if (isValid) {
				if (isCurrent) {
					await updateAsync({ orderId, body: { id: currentCreditNote.id, ...data } });

					if (currentStateRef.current === "authorise") {
						authorise({ orderId, body: { id: currentCreditNote.id } });
					}
				} else {
					mutate({ formData, body: { orderId, ...data } });
				}
			}
		}
	};

	useEffect(() => {
		if (isSuccess && data && data.data) {
			const resetData = getNormalizedResetData(data.data);
			reset(resetData, { keepDefaultValues: true });

			if (data.data.bills.length > 0) {
				setBillIds(data.data.bills.map((item) => item.id));
			}
		}
	}, [data, isSuccess, bills, isBillsSuccess, reset]);

	return (
		<CommonPageWrapper>
			{isLoading || isBillsLoading ? (
				<Loader isFullWidth />
			) : isError && error ? (
				<ErrorMessage error={error} />
			) : isBillsError && billsError ? (
				<ErrorMessage error={billsError} />
			) : isSuccess ? (
				<>
					<CommonPageHeader>
						<CommonPageSubWrapper>
							{currentCreditNote ? (
								<CommonPageStatus
									isRed={currentCreditNote.status === "VOID"}
									isYellow={currentCreditNote.status === "DRAFT"}
									isGreen={currentCreditNote.status === "AUTHORIZED"}
								>
									{currentCreditNote.status.toLocaleLowerCase()}
								</CommonPageStatus>
							) : (
								<CommonPageStatus>New</CommonPageStatus>
							)}
							<CommonPageTitle>Credit Note</CommonPageTitle>
						</CommonPageSubWrapper>
						<CommonPageActions>
							{!disabledStatus && isBillsSuccess && bills.data.bills.length > 0 && (
								<BillsSelect
									billIds={billIds}
									id="receivingsSelectId"
									customValues={bills.data.bills}
									onValueChange={handleSelectBill}
								/>
							)}
							{!disabledActions && (
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
										{currentCreditNote?.status !== "AUTHORIZED" && (
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
										{currentCreditNote?.status === "DRAFT" && (
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
										{currentCreditNote?.status === "AUTHORIZED" && (
											<DropdownMenuItem className="dropDown__item" onClick={() => handleActions("undo")}>
												Undo
											</DropdownMenuItem>
										)}
										{currentCreditNote?.status === "DRAFT" && (
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
							id="creditNoteForm"
							className="commonPage__main"
							onSubmit={handleSubmit(onSubmit)}
						>
							<fieldset className="form__fieldset form__fieldset--2">
								<Controller
									name="date"
									control={control}
									rules={{
										required: "Required",
									}}
									render={({ field }) => {
										return (
											<FormDayPickerRhf
												{...field}
												value={field.value}
												disabled={disabledStatus}
												error={errors.date?.message}
												onValueChange={field.onChange}
												placeholder="Credit Note Date*"
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
							{!additionalExpense && (
								<Lines
									errors={errors}
									control={control}
									register={register}
									setValue={setValue}
									taxInclusive={taxInclusive}
									disabledStatus={disabledStatus}
									currentOrderLines={currentOrderLines}
								/>
							)}
							<Services
								errors={errors}
								control={control}
								register={register}
								setValue={setValue}
								orderData={orderData}
								disabledServices={disabledServices}
							/>
							<CommonPageFooter>
								<div />
								<TotalTable
									orderLines={orderLines}
									serviceLines={serviceLines}
									additionalExpense={additionalExpense}
								/>
							</CommonPageFooter>
						</form>
					</CommonPageMain>
				</>
			) : (
				<p className="empty_list">No data available</p>
			)}
		</CommonPageWrapper>
	);
};
