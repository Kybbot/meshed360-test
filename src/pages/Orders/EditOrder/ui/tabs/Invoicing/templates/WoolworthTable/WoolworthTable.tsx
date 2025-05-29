import { FC, useEffect, useMemo, useRef } from "react";
import { useStore } from "zustand";
import { useParams } from "react-router";
import { Controller, FormProvider, useForm, useWatch } from "react-hook-form";

import { OrderLines } from "./OrderLines.tsx";
import { OrderServices } from "./OrderServices.tsx";

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
import { ExtendedSalesOrder, InvoiceType } from "@/@types/salesOrders/api.ts";
import { ProductType } from "@/@types/products.ts";
import { TaxRateType } from "@/@types/selects.ts";
import { useGetUserAndOrgInfo } from "@/hooks/useGetUserInfo.ts";
import { Input } from "@/components/shared/form/Input.tsx";
import { FormDayPickerRhf } from "@/components/shared/form/FormDayPickerRhf.tsx";
import { useSaveInvoice } from "@/entities/orders/api/mutations/invoicing/useSaveInvoice.ts";
import { useAuthoriseInvoice } from "@/entities/orders/api/mutations/invoicing/useAuthoriseInvoice.ts";
import { useVoidInvoice } from "@/entities/orders/api/mutations/invoicing/useVoidInvoice.ts";
import { useCreateInvoice } from "@/entities/orders/api/mutations/invoicing/useCreateInvoice.ts";
import { useUndoInvoice } from "@/entities/orders/api/mutations/invoicing/useUndoInvoice.ts";
import getInvoiceTotal from "@/pages/Orders/EditOrder/ui/tabs/Invoicing/utils/getInvoiceTotal.ts";
import { getNormalizedWoolworthInvoiceData } from "@/pages/Orders/EditOrder/ui/tabs/Invoicing/utils/getNormalizedWoolworthInvoiceData.ts";
import { getDateFromDayPickerDate, getDueDate } from "@/utils/date.ts";

type Props = {
	invoice?: InvoiceType;
	orderInfo: ExtendedSalesOrder;
	isListShown: boolean;
	setIsListShown: (value: boolean) => void;
	setSelectedInvoiceId: (value: string) => void;
};

export const WoolworthTable: FC<Props> = ({
	invoice,
	orderInfo,
	isListShown,
	setIsListShown,
	setSelectedInvoiceId,
}) => {
	const paymentTerm = orderInfo.paymentTerm;

	const { orderId } = useParams();
	const { orgId } = useStore(orgStore);
	const { taxInclusive } = useStore(orderStore);
	const userAndOrgInfo = useGetUserAndOrgInfo();

	const formRef = useRef<HTMLFormElement>(null);

	const { mutate: saveInvoice } = useSaveInvoice();
	const { mutate: authoriseInvoice } = useAuthoriseInvoice();
	const { mutate: voidInvoice } = useVoidInvoice();
	const { mutate: createInvoice } = useCreateInvoice(setSelectedInvoiceId);
	const { mutate: undoInvoice } = useUndoInvoice();

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
			dueDate: getDueDate(new Date(), paymentTerm.method, paymentTerm.durationDays),
			invoiceNumber: "",
		},
		disabled: invoice?.status === "AUTHORIZED",
	});

	const invoiceDate = useWatch({ name: "invoiceDate", control: form.control });

	useEffect(() => {
		if (invoice) {
			form.reset({
				lines: invoice?.lines.length
					? invoice?.lines.map((line): WoolworthsOrderLineType => {
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
				serviceLines: invoice?.serviceLines.map((line): OrderServiceLineType => {
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
				dueDate: getDateFromDayPickerDate(invoice.dueDate),
				invoiceDate: getDateFromDayPickerDate(invoice.date),
				invoiceNumber: invoice.invoiceNumber || "",
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
	}, [invoice]);

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
				authoriseInvoice({ orderId, organisationId: orgId, invoiceId: invoice!.id, body: payload });
				break;
			case "save":
				if (!invoice) {
					createInvoice({ orderId, organisationId: orgId, body: payload });
				} else {
					saveInvoice({ orderId, organisationId: orgId, invoiceId: invoice.id, body: payload });
				}

				break;
		}
	};

	const handleSave = form.handleSubmit((data) => onSubmit(data, "save"));
	const handleAuthorise = form.handleSubmit((data) => onSubmit(data, "authorise"));
	const handleVoid = () => {
		if (!orderId || !orgId || !invoice) return;
		voidInvoice({ orderId, organisationId: orgId, invoiceId: invoice.id });
	};
	const handleUndo = () => {
		if (!orderId || !orgId || !invoice) return;
		undoInvoice({ orderId, organisationId: orgId, invoiceId: invoice.id });
	};

	useEffect(() => {
		if (paymentTerm && invoiceDate) {
			const newDueDate = getDueDate(invoiceDate, paymentTerm.method, paymentTerm.durationDays);
			form.setValue("dueDate", newDueDate);
		}
	}, [paymentTerm, invoiceDate, form]);

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
								{invoice?.status ? (
									<CommonPageStatus
										isYellow={invoice.status === "DRAFT"}
										isGreen={invoice.status === "AUTHORIZED"}
										isRed={invoice.status === "VOID"}
									>
										{orderStatusDictionary[invoice.status]}
									</CommonPageStatus>
								) : (
									<CommonPageStatus>New</CommonPageStatus>
								)}
								<CommonPageTitle>Invoice</CommonPageTitle>
							</CommonPageSubWrapper>
							<CommonPageSubWrapper>
								<Button type="button" isSecondary onClick={() => setIsListShown(!isListShown)}>
									{isListShown ? (
										<>
											<svg width="18" height="18" focusable="false" aria-hidden="true">
												<use xlinkHref="/icons/icons.svg#eyeClose" />
											</svg>
											Hide Invoice List
										</>
									) : (
										<>
											<svg width="18" height="18" focusable="false" aria-hidden="true">
												<use xlinkHref="/icons/icons.svg#eyeOpen" />
											</svg>
											Show Invoice List
										</>
									)}
								</Button>
								{invoice && (
									<Button type="button" isSecondary onClick={() => setSelectedInvoiceId("")}>
										<svg width="18" height="18" focusable="false" aria-hidden="true">
											<use xlinkHref="/icons/icons.svg#plus" />
										</svg>
										New Invoice
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
										{invoice?.status !== "AUTHORIZED" ? (
											<>
												<DropdownMenuItem className="dropDown__item" onSelect={() => handleSave()}>
													Save
												</DropdownMenuItem>
												{!!invoice && (
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
								action="invoiceWoolworthForm"
								className="commonPage__main"
								onSubmit={handleSave}
							>
								<div className="salesOrder__invoicing-fields">
									<Input disabled label="Invoice Number" value={invoice?.invoiceNumber || ""} />
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
													placeholder="Invoice Date"
													onValueChange={field.onChange}
													error={form.formState.errors.invoiceDate?.message}
												/>
											);
										}}
									/>
									<Controller
										name="dueDate"
										control={form.control}
										rules={{
											required: "Required",
										}}
										render={({ field }) => {
											return (
												<FormDayPickerRhf
													{...field}
													value={field.value}
													placeholder="Due Date"
													onValueChange={field.onChange}
													error={form.formState.errors.dueDate?.message}
												/>
											);
										}}
									/>
									<Input disabled id="totalId" label={`Total (${orderInfo.currency.code})`} value={total} />
								</div>
								<OrderLines
									priceListContentData={priceListContentData}
									orderInfo={orderInfo}
									type="invoicing"
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
