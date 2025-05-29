import { FC, useEffect } from "react";
import { useStore } from "zustand";
import * as Tabs from "@radix-ui/react-tabs";
import { Link, useNavigate, useParams, useSearchParams } from "react-router";
import { useMutationState } from "@tanstack/react-query";

import { Orders } from "./tabs/Orders/Orders";
import { Receiving } from "./tabs/Receiving/Receiving";
import { SubReceiving } from "./tabs/Receiving/SubReceiving";
import { Bill } from "./tabs/Bill/Bill";
import { SubBill } from "./tabs/Bill/SubBill";
import { Unstock } from "./tabs/Unstock/Unstock";
import { CreditNotes } from "./tabs/CreditNotes/CreditNotes";
import { AdditionalExpenses } from "./tabs/AdditionalExpense/AdditionalExpense";

import { useVoidOrdersLines } from "./tabs/Orders/api";
import { useGetCreditNote } from "./tabs/CreditNotes/api";
import { useCloseOrder } from "../api/mutations/useCloseOrder";

import { Loader } from "@/components/shared/Loader";
import { Button } from "@/components/shared/Button";
import { ErrorMessage } from "@/components/shared/ErrorMessage";

import {
	CommonPage,
	CommonPageLine,
	CommonPageMain,
	CommonPageArrow,
	CommonPageTitle,
	CommonPageHeader,
	CommonPageActions,
	CommonPageSubWrapper,
	CommonPageStatus,
} from "@/components/widgets/Page";
import { OrderForm } from "@/components/widgets/Purchases";
import { Attachments } from "@/components/widgets/Attachments";

import { orgStore } from "@/app/stores/orgStore";

import { useGetPurchaseOrderById } from "@/entities/purchaseOrders";

import { usePageDetails } from "@/hooks/useAddPageDetails";
import { useOrganisationError } from "@/hooks/useOrganisationError";

import { PurchaseOrderOverallStatuses } from "@/@types/purchaseOrder/statuses";

const tabsNames = {
	purchaseOrders: "purchaseOrders",
	receiving: "receiving",
	attachments: "attachments",
	bill: "bill",
	credit: "credit",
	unstock: "unstock",
	additionalExpense: "additionalExpense",
};

const defaultTabsNav = [
	{ content: "Purchase Orders", name: tabsNames.purchaseOrders, iconName: "emptyFile", isDisabled: false },
	{ content: "Receiving", name: tabsNames.receiving, iconName: "emptyFile", isDisabled: false },
	{ content: "Bills", name: tabsNames.bill, iconName: "emptyFile", isDisabled: false },
	{ content: "Credit Notes", name: tabsNames.credit, iconName: "plusFile", isDisabled: false },
	{ content: "Unstock", name: tabsNames.unstock, iconName: "stop", isDisabled: false },
	{
		content: "Additional Expenses",
		name: tabsNames.additionalExpense,
		iconName: "emptyFile",
		isDisabled: false,
	},
	{ content: "Attachments", name: tabsNames.attachments, iconName: "attachments", isDisabled: false },
];

const onlyAdditionalCostTabsNav = [
	{ content: "Bill", name: tabsNames.bill, iconName: "emptyFile", isDisabled: false },
	{ content: "Credit", name: tabsNames.credit, iconName: "emptyFile", isDisabled: false },
	{ content: "Attachments", name: tabsNames.attachments, iconName: "attachments", isDisabled: false },
];

const getTabsNav = (isBillFirst: boolean, isBlindBill: boolean, hideUnstock = false) => {
	const arr = [...defaultTabsNav];

	if (isBillFirst) {
		[arr[1], arr[2]] = [arr[2], arr[1]];
	}

	if (isBlindBill) {
		arr.shift();
	}

	if (hideUnstock) {
		arr.splice(arr.length - 3, 1);
	}

	return arr;
};

const EMAIL_TARGET_NAME = "attachments";

const EditPurchaseOrder: FC = () => {
	const navigate = useNavigate();
	const { orderId } = useParams();
	const { orgId } = useStore(orgStore);
	const [searchParams] = useSearchParams();

	const updateStatus = useMutationState({
		filters: { mutationKey: ["update-purchase-order"] },
		select: (mutation) => mutation.state.status,
	});

	const isPending = updateStatus.includes("pending");

	const {
		data: orderData,
		error: orderError,
		isError: isOrderError,
		isLoading: isOrderLoading,
		isSuccess: isOrderSuccess,
	} = useGetPurchaseOrderById({
		orderId,
		organisationId: orgId,
	});

	useOrganisationError(isOrderError, orderError);

	const { data: creditNote, isLoading: isCreditNoteLoading } = useGetCreditNote({ purchaseOrderId: orderId });

	const { isPending: isClosePending, mutate } = useCloseOrder();
	const { mutate: mutateVoid, isPending: isVoidPending, isSuccess: isSuccessVoid } = useVoidOrdersLines();

	const [contentRef, isOpen, height, handleOpenClose] = usePageDetails(true, "fit-content");
	const isAttachments = searchParams.has(EMAIL_TARGET_NAME);

	const handleVoidOrder = () => {
		if (orderId) {
			mutateVoid({ body: { id: orderId } });
		}
	};

	const handleCloseOrder = () => {
		if (orderId) {
			mutate({ body: { id: orderId } });
		}
	};

	const defineAttachmentsId = (keyName: string) => {
		if (keyName === EMAIL_TARGET_NAME) {
			return { id: EMAIL_TARGET_NAME };
		}

		return {};
	};

	useEffect(() => {
		if (isSuccessVoid) {
			navigate("/purchases/orders");
		}
	}, [isSuccessVoid, navigate]);

	useEffect(() => {
		const scrollToElement = () => {
			const attachmentTabEl = document.getElementById(EMAIL_TARGET_NAME);
			if (attachmentTabEl && isAttachments) {
				attachmentTabEl.scrollIntoView({ behavior: "smooth" });
			}
		};

		setTimeout(() => {
			scrollToElement();
		}, 500);
	}, [isAttachments]);

	return (
		<div className="main__sections">
			<CommonPage>
				<div className="main__container">
					{isOrderLoading || isCreditNoteLoading ? (
						<Loader isFullWidth />
					) : isOrderError && orderError ? (
						<ErrorMessage error={orderError} />
					) : isOrderSuccess && orderData.data ? (
						<>
							<CommonPageHeader withoutDec>
								<CommonPageSubWrapper>
									<CommonPageStatus
										isRed={orderData.data.status === "VOID"}
										isGreen={orderData.data.status === "CLOSED"}
										isYellow={orderData.data.status !== "VOID" && orderData.data.status !== "CLOSED"}
									>
										{PurchaseOrderOverallStatuses[orderData.data.status]}
									</CommonPageStatus>
									<CommonPageTitle>{orderData.data.poNumber ?? "Edit Purchase"}</CommonPageTitle>
								</CommonPageSubWrapper>
								<CommonPageActions>
									<Link to="/purchases/orders" className="link link--secondary">
										<svg width="18" height="18" focusable="false" aria-hidden="true">
											<use xlinkHref="/icons/icons.svg#list" />
										</svg>
										Back to List
									</Link>
									{orderData.data.blindBill && orderData.data.status === "DRAFT" && (
										<Button
											isSecondary
											type="button"
											disabled={isVoidPending}
											isLoading={isVoidPending}
											onClick={handleVoidOrder}
										>
											<svg width="18" height="18" focusable="false" aria-hidden="true">
												<use xlinkHref="/icons/icons.svg#delete" />
											</svg>
											Void
										</Button>
									)}
									{orderData.data.status !== "DRAFT" && orderData.data.status !== "CLOSED" && (
										<Button
											type="button"
											disabled={isClosePending}
											isLoading={isClosePending}
											onClick={handleCloseOrder}
										>
											<svg width="18" height="18" focusable="false" aria-hidden="true">
												<use xlinkHref="/icons/icons.svg#save" />
											</svg>
											Close
										</Button>
									)}
									<Button
										type="submit"
										disabled={isPending}
										isLoading={isPending}
										form="newPurchaseOrderForm"
									>
										<svg width="18" height="18" focusable="false" aria-hidden="true">
											<use xlinkHref="/icons/icons.svg#save" />
										</svg>
										Save
									</Button>
									<CommonPageLine />
									<CommonPageArrow isOpen={isOpen} onClick={handleOpenClose} />
								</CommonPageActions>
							</CommonPageHeader>
							<CommonPageMain isActive isOpen={isOpen} height={height} ref={contentRef}>
								<OrderForm isEdit orderData={orderData.data} />
							</CommonPageMain>
						</>
					) : (
						<p className="empty_list">No data available</p>
					)}
				</div>
			</CommonPage>
			<CommonPage>
				<div className="main__container">
					{isOrderLoading ? (
						<Loader isFullWidth />
					) : isOrderError && orderError ? (
						<ErrorMessage error={orderError} />
					) : isOrderSuccess && orderData.data ? (
						<Tabs.Root
							className="tabs"
							key={
								isAttachments
									? defaultTabsNav[defaultTabsNav.length - 1].name
									: orderData.data.additionalExpense
										? onlyAdditionalCostTabsNav[0].name
										: getTabsNav(
												orderData.data.billFirst,
												orderData.data.blindBill,
												!creditNote?.data || creditNote?.data.status !== "AUTHORIZED",
											)[0].name
							}
							defaultValue={
								isAttachments
									? defaultTabsNav[defaultTabsNav.length - 1].name
									: orderData.data.additionalExpense
										? onlyAdditionalCostTabsNav[0].name
										: getTabsNav(
												orderData.data.billFirst,
												orderData.data.blindBill,
												!creditNote?.data || creditNote?.data.status !== "AUTHORIZED",
											)[0].name
							}
						>
							<div className="tabs__header">
								<Tabs.List className="tabs__nav" aria-label="Manage Purchase Order">
									{orderData.data.additionalExpense ? (
										<>
											{onlyAdditionalCostTabsNav.map((item) => (
												<Tabs.Trigger key={item.name} value={item.name} className="tabs__btn">
													<svg focusable="false" aria-hidden="true" width="18" height="18">
														<use xlinkHref={`/icons/icons.svg#${item.iconName}`} />
													</svg>
													{item.content}
												</Tabs.Trigger>
											))}
										</>
									) : (
										<>
											{getTabsNav(
												orderData.data.billFirst,
												orderData.data.blindBill,
												!creditNote?.data || creditNote?.data.status !== "AUTHORIZED",
											).map((item) => (
												<Tabs.Trigger
													key={item.name}
													{...defineAttachmentsId(item.name)}
													value={item.name}
													className="tabs__btn"
												>
													<svg focusable="false" aria-hidden="true" width="18" height="18">
														<use xlinkHref={`/icons/icons.svg#${item.iconName}`} />
													</svg>
													{item.content}
												</Tabs.Trigger>
											))}
										</>
									)}
								</Tabs.List>
							</div>
							<Tabs.Content className="tabs__content" value={tabsNames.purchaseOrders}>
								<Orders orderData={orderData.data} />
							</Tabs.Content>
							<Tabs.Content className="tabs__content" value={tabsNames.receiving}>
								{orderData.data.billFirst &&
								!orderData.data.blindBill &&
								!orderData.data.additionalExpense ? (
									<SubReceiving orderData={orderData.data} />
								) : (
									<Receiving orderData={orderData.data} />
								)}
							</Tabs.Content>
							<Tabs.Content className="tabs__content" value={tabsNames.bill}>
								{orderData.data.stockFirst &&
								!orderData.data.blindBill &&
								!orderData.data.additionalExpense ? (
									<SubBill orderData={orderData.data} />
								) : (
									<Bill orderData={orderData.data} />
								)}
							</Tabs.Content>
							<Tabs.Content className="tabs__content" value={tabsNames.credit}>
								<CreditNotes orderData={orderData.data} />
							</Tabs.Content>
							<Tabs.Content className="tabs__content" value={tabsNames.unstock}>
								<Unstock orderData={orderData.data} />
							</Tabs.Content>
							<Tabs.Content className="tabs__content" value={tabsNames.additionalExpense}>
								<AdditionalExpenses orderData={orderData.data} />
							</Tabs.Content>
							<Tabs.Content className="tabs__content" value={tabsNames.attachments}>
								<Attachments type="purchaseOrder" entityId={orderData.data.id} />
							</Tabs.Content>
						</Tabs.Root>
					) : (
						<p className="empty_list">No data available</p>
					)}
				</div>
			</CommonPage>
		</div>
	);
};

export default EditPurchaseOrder;
