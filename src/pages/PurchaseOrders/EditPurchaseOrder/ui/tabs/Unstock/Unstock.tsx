import { FC, useEffect, useRef, useState } from "react";
import { useStore } from "zustand";
import { useQueryClient } from "@tanstack/react-query";
import { Controller, useForm, useWatch } from "react-hook-form";

import { Lines } from "./ui/Lines";

import {
	useGetUnstock,
	useAddUnstock,
	useUndoUnstock,
	useVoidUnstock,
	useUpdateUnstock,
	useAuthoriseUnstock,
} from "./api";
import { useGetBills } from "../Bill/api";
import { useGetReceiving } from "../Receiving/api";
import { useGetCreditNote } from "../CreditNotes/api";

import {
	getCreditNoteItemData,
	getNormalizedResetData,
	getNormalizedCopyCreditNoteData,
	getNormalizedCreateUnstockData,
} from "./utils/getNormalizedUnstockData";
import { validateData } from "./utils/validateData";

import { Loader } from "@/components/shared/Loader";
import { Button } from "@/components/shared/Button";
import { ErrorMessage } from "@/components/shared/ErrorMessage";
import { FormDayPickerRhf } from "@/components/shared/form/FormDayPickerRhf";

import {
	CommonPageMain,
	CommonPageHeader,
	CommonPageStatus,
	CommonPageWrapper,
	CommonPageActions,
	CommonPageSubWrapper,
	CommonPageTitle,
} from "@/components/widgets/Page";
import {
	DropdownMenu,
	DropdownMenuRoot,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/shared/DropdownMenu";

import { orgStore } from "@/app/stores/orgStore";

import { useGetPrintUrl } from "@/hooks/useGetPrintUrl";

import { ApiResult } from "@/@types/api";
import { GetAllProductsResponseType } from "@/@types/products";
import { ReceivingType } from "@/@types/purchaseOrder/receiving";
import { UnstockFormValues } from "@/@types/purchaseOrder/unstock";
import { CreditNoteLineType } from "@/@types/purchaseOrder/creditNote";
import { GetPurchaseOrderByIdResponseType } from "@/@types/purchaseOrder/order";

type Props = {
	orderData: GetPurchaseOrderByIdResponseType;
};

export const Unstock: FC<Props> = ({ orderData }) => {
	const orderId = orderData.id;
	const orderStatus = orderData.status;
	const billFirst = orderData.billFirst;

	const queryClient = useQueryClient();
	const { orgId } = useStore(orgStore);

	const formRef = useRef<HTMLFormElement>(null);
	const currentStateRef = useRef<"save" | "authorise">();

	const [currentOrderLines, setCurrentOrderLines] = useState<CreditNoteLineType[]>();

	const { isLoadingPrintUrl, getPrintUrlData } = useGetPrintUrl("PurchaseOrderUnstock");

	const {
		data: bills,
		error: billsError,
		isError: isBillsError,
		isLoading: isBillsLoading,
		isSuccess: isBillsSuccess,
	} = useGetBills({ purchaseOrderId: orderId });
	const {
		data: receivings,
		error: receivingsError,
		isError: isReceivingsError,
		isLoading: isReceivingsLoading,
		isSuccess: isReceivingsSuccess,
	} = useGetReceiving({ purchaseOrderId: orderId });
	const {
		data: creditNote,
		error: creditNoteError,
		isError: isCreditNoteError,
		isLoading: isCreditNoteLoading,
		isSuccess: isCreditNoteSuccess,
	} = useGetCreditNote({ purchaseOrderId: orderId });
	const { data, error, isLoading, isSuccess, isError } = useGetUnstock({ purchaseOrderId: orderId });

	const currentUnstock = data?.data;

	const disabledStatus =
		orderStatus === "VOID" ||
		orderStatus === "DRAFT" ||
		orderStatus === "CLOSED" ||
		currentUnstock?.status === "AUTHORIZED";

	const {
		reset,
		control,
		setValue,
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<UnstockFormValues>({
		defaultValues: {
			date: new Date(),
			lines: [],
		},
	});

	const allLines = useWatch({
		name: "lines",
		control,
	});

	const handleCopyCreditNote = () => {
		if (
			isCreditNoteSuccess &&
			creditNote &&
			creditNote.data &&
			isBillsSuccess &&
			bills &&
			isReceivingsSuccess &&
			receivings
		) {
			const billIds = creditNote.data.bills.map((item) => item.id);
			const filteredBills = bills.data.bills.filter((item) => billIds.includes(item.id));

			const receivingsArr: ReceivingType[] = [];

			if (filteredBills.length > 0) {
				for (const filteredBill of filteredBills) {
					if (billFirst) {
						const findReceiving = receivings.data.receivings.find((item) =>
							item.billIds.includes(filteredBill.id),
						);

						if (findReceiving) {
							receivingsArr.push(findReceiving);
						}
					} else {
						for (const receivingId of filteredBill.receivingIds) {
							const filteredReceivings = receivings.data.receivings.filter((item) => item.id === receivingId);

							receivingsArr.push(...filteredReceivings);
						}
					}
				}
			}

			if (receivingsArr.length > 0) {
				const products = queryClient.getQueryData<ApiResult<GetAllProductsResponseType>>([
					"get-select-products",
					orgId,
					"",
					{ isActive: true, type: "stock" },
				]);

				const { lines } = getNormalizedCopyCreditNoteData(creditNote.data, receivingsArr, products?.data);
				setValue("lines", [...allLines, ...lines]);

				setCurrentOrderLines(creditNote.data.lines);
			}
		}
	};

	const handleCopyCreditNoteItem = (creditNoteItem: CreditNoteLineType) => {
		if (
			isCreditNoteSuccess &&
			creditNote &&
			creditNote.data &&
			isBillsSuccess &&
			bills &&
			isReceivingsSuccess &&
			receivings
		) {
			const billIds = creditNote.data.bills.map((item) => item.id);
			const filteredBills = bills.data.bills.filter((item) => billIds.includes(item.id));

			const receivingsArr: ReceivingType[] = [];

			if (filteredBills.length > 0) {
				for (const filteredBill of filteredBills) {
					if (billFirst) {
						const findReceiving = receivings.data.receivings.find((item) =>
							item.billIds.includes(filteredBill.id),
						);

						if (findReceiving) {
							receivingsArr.push(findReceiving);
						}
					} else {
						for (const receivingId of filteredBill.receivingIds) {
							const filteredReceivings = receivings.data.receivings.filter((item) => item.id === receivingId);

							receivingsArr.push(...filteredReceivings);
						}
					}
				}
			}

			if (receivingsArr.length > 0) {
				const products = queryClient.getQueryData<ApiResult<GetAllProductsResponseType>>([
					"get-select-products",
					orgId,
					"",
					{ isActive: true, type: "stock" },
				]);

				const creditNoteItemData = getCreditNoteItemData(creditNoteItem, receivingsArr, products?.data);
				return creditNoteItemData;
			}
		}
	};

	const handleNewUnstock = () => {
		reset({
			date: new Date(),
			lines: [],
		});
	};

	const { mutate } = useAddUnstock();
	const { mutate: undo } = useUndoUnstock();
	const { mutate: authorise } = useAuthoriseUnstock();
	const { mutateAsync: updateAsync } = useUpdateUnstock();
	const { mutate: mutateVoid } = useVoidUnstock(handleNewUnstock);

	const handleActions = async (type: "undo" | "void") => {
		if (orderId && data && data.data) {
			switch (type) {
				case "undo":
					undo({ orderId, body: { id: data.data.id } });
					break;
				case "void":
					mutateVoid({ orderId, body: { id: data.data.id } });
					break;
			}
		}
	};

	const onSubmit = async (formData: UnstockFormValues) => {
		const isCurrent = !!currentUnstock;

		if (orderId && creditNote && creditNote.data) {
			const normalizedData = getNormalizedCreateUnstockData(formData, creditNote.data.id);
			const isValid = validateData(normalizedData);

			if (isValid) {
				if (isCurrent) {
					await updateAsync({ orderId, body: { id: currentUnstock.id, ...normalizedData } });

					if (currentStateRef.current === "authorise" && data.data) {
						authorise({ orderId, body: { id: data.data.id } });
					}
				} else {
					mutate({ body: { orderId: orderId, ...normalizedData } });
				}
			}
		}
	};

	useEffect(() => {
		if (isSuccess && data && data.data) {
			const resetData = getNormalizedResetData(data.data);
			reset(resetData, { keepDefaultValues: true });
		}
	}, [data, isSuccess, reset]);

	useEffect(() => {
		if (isCreditNoteSuccess && creditNote && creditNote.data) {
			setCurrentOrderLines(creditNote.data.lines);
		}
	}, [isCreditNoteSuccess, creditNote]);

	return (
		<CommonPageWrapper>
			{isLoading || isCreditNoteLoading || isBillsLoading || isReceivingsLoading ? (
				<Loader isFullWidth />
			) : isError && error ? (
				<ErrorMessage error={error} />
			) : isCreditNoteError && creditNoteError ? (
				<ErrorMessage error={creditNoteError} />
			) : isBillsError && billsError ? (
				<ErrorMessage error={billsError} />
			) : isReceivingsError && receivingsError ? (
				<ErrorMessage error={receivingsError} />
			) : isSuccess && isCreditNoteSuccess && isBillsSuccess && isReceivingsSuccess ? (
				<>
					<CommonPageHeader>
						<CommonPageSubWrapper>
							{currentUnstock ? (
								<CommonPageStatus
									isRed={currentUnstock.status === "VOID"}
									isYellow={currentUnstock.status === "DRAFT"}
									isGreen={currentUnstock.status === "AUTHORIZED"}
								>
									{currentUnstock.status.toLocaleLowerCase()}
								</CommonPageStatus>
							) : (
								<CommonPageStatus>New</CommonPageStatus>
							)}
							<CommonPageTitle>Unstock</CommonPageTitle>
						</CommonPageSubWrapper>
						<CommonPageActions>
							{currentUnstock?.status !== "AUTHORIZED" && (
								<Button type="button" isSecondary onClick={handleCopyCreditNote}>
									Copy form Credit Note
								</Button>
							)}
							{currentUnstock && (
								<Button
									isSecondary
									type="button"
									disabled={isLoadingPrintUrl}
									isLoading={isLoadingPrintUrl}
									onClick={() => getPrintUrlData(currentUnstock.id)}
								>
									<svg width="18" height="18" focusable="false" aria-hidden="true">
										<use xlinkHref="/icons/icons.svg#print" />
									</svg>
									Print
								</Button>
							)}
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
									{currentUnstock?.status !== "AUTHORIZED" && (
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
									{currentUnstock?.status === "DRAFT" && (
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
									{currentUnstock?.status === "AUTHORIZED" && (
										<DropdownMenuItem className="dropDown__item" onClick={() => handleActions("undo")}>
											Undo
										</DropdownMenuItem>
									)}
									{currentUnstock?.status === "DRAFT" && (
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
							id="unstockForm"
							className="commonPage__main"
							onSubmit={handleSubmit(onSubmit)}
						>
							<fieldset className="form__fieldset form__fieldset--1">
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
												placeholder="Unstock Date*"
												error={errors.date?.message}
												onValueChange={field.onChange}
											/>
										);
									}}
								/>
							</fieldset>
							<Lines
								errors={errors}
								control={control}
								register={register}
								setValue={setValue}
								disabledStatus={disabledStatus}
								currentOrderLines={currentOrderLines}
								handleCopyCreditNoteItem={handleCopyCreditNoteItem}
							/>
						</form>
					</CommonPageMain>
				</>
			) : (
				<p className="empty_list">No data available</p>
			)}
		</CommonPageWrapper>
	);
};
