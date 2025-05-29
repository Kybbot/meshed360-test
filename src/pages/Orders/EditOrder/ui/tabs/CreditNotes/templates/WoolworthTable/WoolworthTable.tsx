import { FC, useEffect, useMemo, useRef } from "react";
import { useStore } from "zustand";
import { useParams } from "react-router";
import { Controller, FormProvider, useForm, useWatch } from "react-hook-form";

import { OrderLines } from "@/pages/Orders/EditOrder/ui/tabs/Invoicing/templates/WoolworthTable/OrderLines.tsx";
import { OrderServices } from "@/pages/Orders/EditOrder/ui/tabs/Invoicing/templates/WoolworthTable/OrderServices.tsx";

import {
	DropdownMenu,
	DropdownMenuItem,
	DropdownMenuRoot,
	DropdownMenuTrigger,
} from "@/components/shared/DropdownMenu.tsx";
import { Loader } from "@/components/shared/Loader.tsx";
import { Button } from "@/components/shared/Button.tsx";
import { ErrorMessage } from "@/components/shared/ErrorMessage.tsx";

import {
	CommonPageFooter,
	CommonPageMain,
	CommonPageStatus,
	CommonPageSubWrapper,
	CommonPageTitle,
	CommonPageWrapper,
} from "@/components/widgets/Page";
import { TotalTable } from "@/components/widgets/TotalTable";

import { orgStore } from "@/app/stores/orgStore.ts";
import { orderStore } from "@/app/stores/orderStore.ts";

import { useGetPriceListById } from "@/entities/priceLists";

import {
	orderStatusDictionary,
	OrderServiceLineType,
	WoolworthInvoicingFormValues,
	EmptyWoolworthsOrderLine,
	WoolworthsOrderLineType,
} from "@/@types/salesOrders/local.ts";
import { CreditNoteType, ExtendedSalesOrder } from "@/@types/salesOrders/api.ts";
import { ProductType } from "@/@types/products.ts";
import { TaxRateType } from "@/@types/selects.ts";
import { useGetUserAndOrgInfo } from "@/hooks/useGetUserInfo.ts";
import { Input } from "@/components/shared/form/Input.tsx";
import { FormDayPickerRhf } from "@/components/shared/form/FormDayPickerRhf.tsx";
import getInvoiceTotal from "@/pages/Orders/EditOrder/ui/tabs/Invoicing/utils/getInvoiceTotal.ts";
import { getNormalizedWoolworthInvoiceData } from "@/pages/Orders/EditOrder/ui/tabs/Invoicing/utils/getNormalizedWoolworthInvoiceData.ts";
import { useSaveCreditNote } from "@/entities/orders/api/mutations/creditNotes/useSaveCreditNote.ts";
import { useAuthoriseCreditNote } from "@/entities/orders/api/mutations/creditNotes/useAuthoriseCreditNote.ts";
import { useVoidCreditNote } from "@/entities/orders/api/mutations/creditNotes/useVoidCreditNote.ts";
import { useCreateCreditNote } from "@/entities/orders/api/mutations/creditNotes/useCreateCreditNote.ts";
import { useUndoCreditNote } from "@/entities/orders/api/mutations/creditNotes/useUndoCreditNote.ts";
import { getDateFromDayPickerDate } from "@/utils/date";

type Props = {
	creditNote?: CreditNoteType;
	orderInfo: ExtendedSalesOrder;
	isListShown: boolean;
	setIsListShown: (value: boolean) => void;
	setSelectedCreditNoteId: (value: string) => void;
};

export const WoolworthTable: FC<Props> = ({
	creditNote,
	orderInfo,
	isListShown,
	setIsListShown,
	setSelectedCreditNoteId,
}) => {
	const { orderId } = useParams();
	const { orgId } = useStore(orgStore);
	const { taxInclusive } = useStore(orderStore);
	const userAndOrgInfo = useGetUserAndOrgInfo();

	const formRef = useRef<HTMLFormElement>(null);

	const { mutate: saveCreditNote } = useSaveCreditNote();
	const { mutate: authoriseCreditNote } = useAuthoriseCreditNote();
	const { mutate: voidCreditNote } = useVoidCreditNote();
	const { mutate: createCreditNote } = useCreateCreditNote(setSelectedCreditNoteId);
	const { mutate: undoCreditNote } = useUndoCreditNote();

	const {
		isLoading,
		isError,
		isSuccess,
		error,
		data: priceListData,
	} = useGetPriceListById({
		priceListId: orderInfo.priceList.id,
	});

	const priceListContentData = useMemo(() => {
		if (priceListData?.data.priceList.priceListContent?.length) {
			return priceListData.data.priceList.priceListContent.reduce<Record<string, number>>((prev, curr) => {
				prev[curr.productid] = curr.price;
				return prev;
			}, {});
		}

		return null;
	}, [priceListData]);

	const form = useForm<WoolworthInvoicingFormValues>({
		defaultValues: {
			lines: [EmptyWoolworthsOrderLine],
			serviceLines: [],
			dueDate: undefined,
			invoiceDate: undefined,
			invoiceNumber: "",
		},
		disabled: creditNote?.status === "AUTHORIZED",
	});

	useEffect(() => {
		if (creditNote) {
			form.reset({
				lines: creditNote?.lines.length
					? creditNote?.lines.map((line): WoolworthsOrderLineType => {
							return {
								product: line.product as unknown as ProductType,
								comment: line.comment || "",
								quantity: line.quantity,
								mass: line.mass || "",
								packOrder: line.packOrder || "",
								lLugs: line.lLugs ? String(line.lLugs) : "",
								sLugs: line.sLugs ? String(line.sLugs) : "",
								avgMass: line.mass ? String(+line.mass / +line.quantity) : "",
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
					: [EmptyWoolworthsOrderLine],
				serviceLines: creditNote?.serviceLines.map((line): OrderServiceLineType => {
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
				dueDate: getDateFromDayPickerDate(creditNote.dueDate),
				invoiceDate: getDateFromDayPickerDate(creditNote.date),
				invoiceNumber: creditNote.creditNoteNumber || "",
			});
		} else {
			form.reset({
				lines: [EmptyWoolworthsOrderLine],
				serviceLines: [],
				dueDate: undefined,
				invoiceDate: undefined,
				invoiceNumber: "",
			});
		}
	}, [creditNote]);

	const linesValues = useWatch({
		name: "lines",
		control: form.control,
	});

	const serviceLinesValues = useWatch({
		name: "serviceLines",
		control: form.control,
	});

	const total = useMemo(() => {
		return getInvoiceTotal(linesValues, serviceLinesValues, orderInfo.taxInclusive);
	}, [linesValues, serviceLinesValues, orderInfo.taxInclusive]);

	const onSubmit = async (formData: WoolworthInvoicingFormValues, action: "save" | "authorise" | "void") => {
		const payload = getNormalizedWoolworthInvoiceData(formData, priceListData!.data.priceList.currencyId);

		if (!orderId || !orgId) return;

		switch (action) {
			case "authorise":
				authoriseCreditNote({ orderId, organisationId: orgId, creditNoteId: creditNote!.id, body: payload });
				break;
			case "save":
				if (!creditNote) {
					createCreditNote({ orderId, organisationId: orgId, body: payload });
				} else {
					saveCreditNote({ orderId, organisationId: orgId, creditNoteId: creditNote.id, body: payload });
				}

				break;
		}
	};

	const handleSave = form.handleSubmit((data) => onSubmit(data, "save"));
	const handleAuthorise = form.handleSubmit((data) => onSubmit(data, "authorise"));
	const handleVoid = () => {
		if (!orderId || !orgId || !creditNote) return;
		voidCreditNote({ orderId, organisationId: orgId, creditNoteId: creditNote.id });
	};
	const handleUndo = () => {
		if (!orderId || !orgId || !creditNote) return;
		undoCreditNote({ orderId, organisationId: orgId, creditNoteId: creditNote.id });
	};

	return (
		<FormProvider {...form}>
			<CommonPageWrapper>
				{isLoading ? (
					<Loader />
				) : isError && error ? (
					<ErrorMessage error={error} />
				) : isSuccess && priceListData.data.priceList ? (
					<>
						<div
							style={{
								display: "flex",
								alignItems: "center",
								justifyContent: "space-between",
								width: "100%",
								marginBottom: "10px",
							}}
						>
							<CommonPageSubWrapper>
								{creditNote?.status ? (
									<CommonPageStatus
										isYellow={creditNote.status === "DRAFT"}
										isGreen={creditNote.status === "AUTHORIZED"}
										isRed={creditNote.status === "VOID"}
									>
										{orderStatusDictionary[creditNote.status]}
									</CommonPageStatus>
								) : (
									<CommonPageStatus>New</CommonPageStatus>
								)}
								<CommonPageTitle>Credit Note</CommonPageTitle>
							</CommonPageSubWrapper>
							<CommonPageSubWrapper>
								<Button type="button" isSecondary onClick={() => setIsListShown(!isListShown)}>
									{isListShown ? (
										<>
											<svg width="18" height="18" focusable="false" aria-hidden="true">
												<use xlinkHref="/icons/icons.svg#eyeClose" />
											</svg>
											Hide Credit Notes List
										</>
									) : (
										<>
											<svg width="18" height="18" focusable="false" aria-hidden="true">
												<use xlinkHref="/icons/icons.svg#eyeOpen" />
											</svg>
											Show Credit Notes List
										</>
									)}
								</Button>
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
										{creditNote?.status !== "AUTHORIZED" ? (
											<>
												<DropdownMenuItem className="dropDown__item" onSelect={() => handleSave()}>
													Save
												</DropdownMenuItem>
												{!!creditNote && (
													<>
														<DropdownMenuItem className="dropDown__item" onSelect={() => handleAuthorise()}>
															Authorise
														</DropdownMenuItem>
														<DropdownMenuItem className="dropDown__item" onSelect={() => handleVoid()}>
															Void
														</DropdownMenuItem>
													</>
												)}
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
						</div>
						<CommonPageMain>
							<form
								ref={formRef}
								action="creditNotesWoolworthForm"
								className="commonPage__main"
								onSubmit={handleSave}
							>
								<div className="salesOrder__creditNotes-fields">
									<Input disabled label="Credit Note Number" value={creditNote?.creditNoteNumber || ""} />
									<Controller
										name="invoiceDate"
										control={form.control}
										rules={{
											required: "Required",
										}}
										render={({ field }) => {
											return (
												<FormDayPickerRhf
													{...field}
													value={field.value}
													placeholder="Date"
													onValueChange={field.onChange}
													error={form.formState.errors.invoiceDate?.message}
												/>
											);
										}}
									/>
									<Input disabled id="totalId" label={`Total (${orderInfo.currency.code})`} value={total} />
								</div>
								<OrderLines
									priceListContentData={priceListContentData}
									orderInfo={orderInfo}
									type="creditNotes"
								/>
								<OrderServices priceListContentData={priceListContentData} orderInfo={orderInfo} />
							</form>
							<CommonPageFooter>
								<div></div>
								<TotalTable
									firstHeader="Order Lines"
									taxInclusive={taxInclusive}
									secondHeader="Additional Costs"
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
		</FormProvider>
	);
};
