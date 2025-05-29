import { FC, useEffect, useMemo } from "react";
import { useStore } from "zustand";
import * as Tabs from "@radix-ui/react-tabs";
import { Link, useParams } from "react-router";
import { useMutationState } from "@tanstack/react-query";

import { Quote } from "./tabs/Quote/Quote";

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
import { Attachments } from "@/components/widgets/Attachments";

import { orgStore } from "@/app/stores/orgStore";
import { orderStore } from "@/app/stores/orderStore";

import { useGetOrderById } from "@/entities/orders";

import { usePageDetails } from "@/hooks/useAddPageDetails";
import { useOrganisationError } from "@/hooks/useOrganisationError";
import { EditOrderForm } from "@/components/widgets/Sales/Orders/ui/EditOrderForm.tsx";
import { orderStatusDictionary } from "@/@types/salesOrders/local.ts";
import { SalesOrder } from "@/pages/Orders/EditOrder/ui/tabs/SalesOrder/SalesOrder.tsx";
import { OrderStatus } from "@/@types/salesOrders/api.ts";
import { Fulfilment } from "@/pages/Orders/EditOrder/ui/tabs/Fulfilment/Fulfilment.tsx";
import { Invoicing } from "@/pages/Orders/EditOrder/ui/tabs/Invoicing/Invoicing.tsx";
import { CreditNotes } from "@/pages/Orders/EditOrder/ui/tabs/CreditNotes/CreditNotes.tsx";
import { Restock } from "@/pages/Orders/EditOrder/ui/tabs/Restock/Restock.tsx";

export const tabsNames = {
	quote: "quote",
	salesOrder: "salesOrder",
	fulfilment: "fulfilment",
	invoicing: "invoicing",
	creditNotes: "creditNotes",
	restock: "restock",
	attachments: "attachments",
};

const tabsNav = [
	{ content: "Quote", name: tabsNames.quote, iconName: "emptyFile" },
	{ content: "Sales Order", name: tabsNames.salesOrder, iconName: "sales" },
	{ content: "Fulfilment", name: tabsNames.fulfilment, iconName: "car" },
	{ content: "Invoicing", name: tabsNames.invoicing, iconName: "emptyFile" },
	{ content: "Credit Notes", name: tabsNames.creditNotes, iconName: "plusFile" },
	{ content: "Restock", name: tabsNames.restock, iconName: "reset" },
	{ content: "Attachments", name: tabsNames.attachments, iconName: "attachments" },
];

const EditOrder: FC = () => {
	const { orderId } = useParams();
	const { orgId } = useStore(orgStore);
	const { skipQuote, currentTab, setCurrentTab } = useStore(orderStore);

	const {
		data: orderData,
		error: orderError,
		isError: isOrderError,
		isLoading: isOrderLoading,
		isSuccess: isOrderSuccess,
	} = useGetOrderById({
		organisationId: orgId,
		orderId,
	});

	useOrganisationError(isOrderError, orderError);

	useEffect(() => {
		return () => {
			setCurrentTab("quote");
		};
	}, []);

	const createCustomerStatus = useMutationState({
		filters: { mutationKey: ["update-order"] },
		select: (mutation) => mutation.state.status,
	});

	const badgeColor = useMemo(() => {
		if (!orderData?.data?.salesOrder.status) return;

		let res: "red" | "green" | "yellow" = "yellow";

		switch (orderData.data.salesOrder.status) {
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
	}, [orderData?.data?.salesOrder.status]);

	const isPending = createCustomerStatus.includes("pending");

	const [contentRef, isOpen, height, handleOpenClose] = usePageDetails(true, "fit-content");

	return (
		<div className="main__sections">
			<CommonPage>
				<div className="main__container">
					<CommonPageHeader withoutDec>
						<CommonPageSubWrapper>
							{orderData?.data?.salesOrder?.status && (
								<CommonPageStatus
									isYellow={badgeColor === "yellow"}
									isGreen={badgeColor === "green"}
									isRed={badgeColor === "red"}
								>
									{orderStatusDictionary[orderData?.data?.salesOrder?.status]}
								</CommonPageStatus>
							)}
							<CommonPageTitle>{orderData?.data?.salesOrder?.soNumber || "Edit Order"}</CommonPageTitle>
						</CommonPageSubWrapper>
						<CommonPageActions>
							<Link to="/sales/orders" className="link link--secondary">
								<svg width="18" height="18" focusable="false" aria-hidden="true">
									<use xlinkHref="/icons/icons.svg#list" />
								</svg>
								Back to List
							</Link>
							<Button
								type="submit"
								form="newOrderForm"
								isLoading={isPending}
								disabled={
									isPending ||
									orderData?.data?.salesOrder.status === "ORDERED" ||
									orderData?.data?.salesOrder.status === "CLOSED"
								}
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
						{isOrderLoading ? (
							<Loader isFullWidth />
						) : isOrderError && orderError ? (
							<ErrorMessage error={orderError} />
						) : isOrderSuccess && orderData.data ? (
							<EditOrderForm orderData={orderData.data.salesOrder} />
						) : (
							<p className="empty_list">No data available</p>
						)}
					</CommonPageMain>
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
							value={currentTab}
							onValueChange={setCurrentTab}
							defaultValue={skipQuote ? tabsNav[1].name : tabsNav[0].name}
						>
							<div className="tabs__header">
								<Tabs.List className="tabs__nav" aria-label="Manage users & roles">
									{(skipQuote ? tabsNav.slice(1) : tabsNav).map((item) => (
										<Tabs.Trigger key={item.name} value={item.name} className="tabs__btn">
											<svg focusable="false" aria-hidden="true" width="18" height="18">
												<use xlinkHref={`/icons/icons.svg#${item.iconName}`} />
											</svg>
											{item.content}
										</Tabs.Trigger>
									))}
								</Tabs.List>
							</div>
							{!skipQuote && (
								<Tabs.Content className="tabs__content" value={tabsNames.quote}>
									<Quote orderInfo={orderData.data.salesOrder} quote={orderData.data.quote} />
								</Tabs.Content>
							)}
							<Tabs.Content className="tabs__content" value={tabsNames.salesOrder}>
								<SalesOrder orderInfo={orderData.data.salesOrder} quote={orderData.data.quote || undefined} />
							</Tabs.Content>
							<Tabs.Content className="tabs__content" value={tabsNames.fulfilment}>
								<Fulfilment orderInfo={orderData.data.salesOrder} />
							</Tabs.Content>
							<Tabs.Content className="tabs__content" value={tabsNames.invoicing}>
								<Invoicing orderInfo={orderData.data.salesOrder} />
							</Tabs.Content>
							<Tabs.Content className="tabs__content" value={tabsNames.creditNotes}>
								<CreditNotes orderInfo={orderData.data.salesOrder} />
							</Tabs.Content>
							<Tabs.Content className="tabs__content" value={tabsNames.restock}>
								<Restock orderInfo={orderData.data.salesOrder} />
							</Tabs.Content>
							<Tabs.Content className="tabs__content" value={tabsNames.attachments}>
								<Attachments type="salesOrder" entityId={orderData.data.salesOrder.id} />
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

export default EditOrder;
