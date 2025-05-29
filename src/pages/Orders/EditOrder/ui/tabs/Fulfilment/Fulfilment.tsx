import { FC, useEffect, useMemo, useState } from "react";
import { Loader } from "@/components/shared/Loader.tsx";
import { ErrorMessage } from "@/components/shared/ErrorMessage.tsx";
import { CommonPageTitle, CommonPageWrapper } from "@/components/widgets/Page";
import { useGetOrderFulfilment } from "@/entities/orders/api/queries/useGetOrderFulfilment.ts";
import { useParams } from "react-router";
import { useStore } from "zustand";
import { orgStore } from "@/app/stores/orgStore.ts";
import * as Tabs from "@radix-ui/react-tabs";
import { PickingTable } from "@/pages/Orders/EditOrder/ui/tabs/Fulfilment/tabs/PickingTable/PickingTable.tsx";
import { ExtendedSalesOrder } from "@/@types/salesOrders/api.ts";
import { PackingTable } from "@/pages/Orders/EditOrder/ui/tabs/Fulfilment/tabs/PackingTable/PackingTable.tsx";
import { ShippingTable } from "@/pages/Orders/EditOrder/ui/tabs/Fulfilment/tabs/ShippingTable/ShippingTable.tsx";
import { orderStore } from "@/app/stores/orderStore.ts";
import { getFormDayPickerDate } from "@/utils/date";

const tabsNav = [
	{ content: "Picking", name: "picking" },
	{ content: "Packing", name: "packing" },
	{ content: "Shipping", name: "shipping" },
];

interface Props {
	orderInfo: ExtendedSalesOrder;
}

export const Fulfilment: FC<Props> = ({ orderInfo }) => {
	const { orderId } = useParams();
	const { orgId } = useStore(orgStore);
	const { setFulfillment } = useStore(orderStore);
	const [currentTab, setCurrentTab] = useState("picking");
	const [isListShown, setIsListShown] = useState(true);
	const [selectedFulfilmentId, setSelectedFulfilmentId] = useState<string | null>(null);

	const { data, error, isError, isLoading, isSuccess } = useGetOrderFulfilment({
		organisationId: orgId,
		orderId,
	});

	useEffect(() => {
		if (data?.data?.fulfillments) {
			setFulfillment(data.data.fulfillments);
		}
	}, [data]);

	const currentFulfilment = useMemo(() => {
		if (data && selectedFulfilmentId) {
			const fulfilment = data.data.fulfillments.find(({ id }) => id === selectedFulfilmentId);
			if (currentTab === "shipping") {
				if (!fulfilment?.shipping && !!fulfilment?.packing) {
					setCurrentTab("packing");
				}
			} else if (!fulfilment?.[currentTab as "picking" | "packing" | "shipping"]) {
				setCurrentTab("picking");
			}

			return fulfilment;
		} else {
			setCurrentTab("picking");
			return undefined;
		}
	}, [data, selectedFulfilmentId]);

	return (
		<CommonPageWrapper>
			{isLoading ? (
				<Loader />
			) : isError && error ? (
				<ErrorMessage error={error} />
			) : isSuccess ? (
				<div style={{ display: "flex", gap: "48px", alignItems: "flex-start" }}>
					{isListShown && (
						<div className="salesOrder__fulfilment-left-container">
							<div className="salesOrder__fulfilment-left-header">
								<CommonPageTitle>Fulfilment</CommonPageTitle>
								<button type="button" onClick={() => setSelectedFulfilmentId(null)}>
									<svg focusable="false" aria-hidden="true" width="24" height="24">
										<use xlinkHref="/icons/icons.svg#plusInCircle" />
									</svg>
								</button>
							</div>
							<div className="salesOrder__fulfilment-list-container">
								{data.data.fulfillments.map((fulfilment, index) => (
									<div
										role="presentation"
										key={fulfilment.id}
										onClick={() => setSelectedFulfilmentId(fulfilment.id)}
										className="salesOrder__fulfilment-list-card"
									>
										<div
											className={`salesOrder__fulfilment-list-card-heading ${fulfilment.id === selectedFulfilmentId && "salesOrder__fulfilment-list-card-heading-active"}`}
										>
											Fulfilment #{index + 1}
										</div>
										<div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
											<button
												style={{
													display: "flex",
													alignItems: "center",
													justifyContent: "space-between",
													background: "none",
													border: "none",
													padding: 0,
													width: "100%",
													cursor: "pointer",
												}}
												type="button"
												aria-label="Select Picking Tab"
												onClick={(event) => {
													event.stopPropagation();
													setSelectedFulfilmentId(fulfilment.id);
													setCurrentTab("picking");
												}}
											>
												<div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
													{fulfilment.picking?.status === "AUTHORIZED" ? (
														<svg
															width="18"
															height="18"
															viewBox="0 0 18 18"
															fill="none"
															xmlns="http://www.w3.org/2000/svg"
														>
															<path
																fillRule="evenodd"
																clipRule="evenodd"
																d="M9 1.5C13.1421 1.5 16.5 4.85786 16.5 9C16.5 13.1421 13.1421 16.5 9 16.5C4.85786 16.5 1.5 13.1421 1.5 9C1.5 4.85786 4.85786 1.5 9 1.5Z"
																fill="#1E5EFF"
															/>
															<path
																fillRule="evenodd"
																clipRule="evenodd"
																d="M9 3C5.68629 3 3 5.68629 3 9C3 12.3137 5.68629 15 9 15C12.3137 15 15 12.3137 15 9C15 5.68629 12.3137 3 9 3Z"
																fill="#1E5EFF"
															/>
															<path
																fillRule="evenodd"
																clipRule="evenodd"
																d="M11.2147 6.53307C11.5005 6.24085 11.9709 6.2415 12.2559 6.53451C12.5308 6.8172 12.5303 7.26751 12.2548 7.54961L7.908 12L5.74294 9.77388C5.46851 9.49171 5.46851 9.04237 5.74294 8.76019C6.02835 8.46673 6.49968 8.46669 6.78513 8.7601L7.908 9.91424L11.2147 6.53307Z"
																fill="white"
															/>
														</svg>
													) : (
														<svg
															width="18"
															height="18"
															viewBox="0 0 18 18"
															fill="none"
															xmlns="http://www.w3.org/2000/svg"
														>
															<path
																fillRule="evenodd"
																clipRule="evenodd"
																d="M9 1.5C13.1421 1.5 16.5 4.85786 16.5 9C16.5 13.1421 13.1421 16.5 9 16.5C4.85786 16.5 1.5 13.1421 1.5 9C1.5 4.85786 4.85786 1.5 9 1.5ZM9 3C5.68629 3 3 5.68629 3 9C3 12.3137 5.68629 15 9 15C12.3137 15 15 12.3137 15 9C15 5.68629 12.3137 3 9 3Z"
																fill="#1E5EFF"
															/>
														</svg>
													)}
													<span style={{ fontSize: "14px", color: "rgba(90, 96, 127, 1)" }}>Picking</span>
												</div>
												<span style={{ fontSize: "14px", color: "rgba(90, 96, 127, 1)" }}>
													{fulfilment.picking?.status === "DRAFT"
														? "In Progress"
														: getFormDayPickerDate(fulfilment.picking?.updatedAt)}
												</span>
											</button>
											<button
												style={{
													display: "flex",
													alignItems: "center",
													justifyContent: "space-between",
													background: "none",
													border: "none",
													padding: 0,
													width: "100%",
													cursor: "pointer",
												}}
												type="button"
												aria-label="Select Picking Tab"
												onClick={(event) => {
													event.stopPropagation();
													setSelectedFulfilmentId(fulfilment.id);
													setCurrentTab("packing");
												}}
												disabled={currentFulfilment?.picking?.status !== "AUTHORIZED"}
											>
												<div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
													{!fulfilment.packing ? (
														<svg
															width="18"
															height="18"
															viewBox="0 0 18 18"
															fill="none"
															xmlns="http://www.w3.org/2000/svg"
														>
															<path
																fillRule="evenodd"
																clipRule="evenodd"
																d="M9 1.5C13.1421 1.5 16.5 4.85786 16.5 9C16.5 13.1421 13.1421 16.5 9 16.5C4.85786 16.5 1.5 13.1421 1.5 9C1.5 4.85786 4.85786 1.5 9 1.5ZM9 3C5.68629 3 3 5.68629 3 9C3 12.3137 5.68629 15 9 15C12.3137 15 15 12.3137 15 9C15 5.68629 12.3137 3 9 3Z"
																fill="#E6E9F4"
															/>
														</svg>
													) : fulfilment.packing?.status === "AUTHORIZED" ? (
														<svg
															width="18"
															height="18"
															viewBox="0 0 18 18"
															fill="none"
															xmlns="http://www.w3.org/2000/svg"
														>
															<path
																fillRule="evenodd"
																clipRule="evenodd"
																d="M9 1.5C13.1421 1.5 16.5 4.85786 16.5 9C16.5 13.1421 13.1421 16.5 9 16.5C4.85786 16.5 1.5 13.1421 1.5 9C1.5 4.85786 4.85786 1.5 9 1.5Z"
																fill="#1E5EFF"
															/>
															<path
																fillRule="evenodd"
																clipRule="evenodd"
																d="M9 3C5.68629 3 3 5.68629 3 9C3 12.3137 5.68629 15 9 15C12.3137 15 15 12.3137 15 9C15 5.68629 12.3137 3 9 3Z"
																fill="#1E5EFF"
															/>
															<path
																fillRule="evenodd"
																clipRule="evenodd"
																d="M11.2147 6.53307C11.5005 6.24085 11.9709 6.2415 12.2559 6.53451C12.5308 6.8172 12.5303 7.26751 12.2548 7.54961L7.908 12L5.74294 9.77388C5.46851 9.49171 5.46851 9.04237 5.74294 8.76019C6.02835 8.46673 6.49968 8.46669 6.78513 8.7601L7.908 9.91424L11.2147 6.53307Z"
																fill="white"
															/>
														</svg>
													) : (
														<svg
															width="18"
															height="18"
															viewBox="0 0 18 18"
															fill="none"
															xmlns="http://www.w3.org/2000/svg"
														>
															<path
																fillRule="evenodd"
																clipRule="evenodd"
																d="M9 1.5C13.1421 1.5 16.5 4.85786 16.5 9C16.5 13.1421 13.1421 16.5 9 16.5C4.85786 16.5 1.5 13.1421 1.5 9C1.5 4.85786 4.85786 1.5 9 1.5ZM9 3C5.68629 3 3 5.68629 3 9C3 12.3137 5.68629 15 9 15C12.3137 15 15 12.3137 15 9C15 5.68629 12.3137 3 9 3Z"
																fill="#1E5EFF"
															/>
														</svg>
													)}
													<span style={{ fontSize: "14px", color: "rgba(90, 96, 127, 1)" }}>Packing</span>
												</div>
												{!!fulfilment.packing && (
													<span style={{ fontSize: "14px", color: "rgba(90, 96, 127, 1)" }}>
														{fulfilment.packing?.status === "DRAFT"
															? "In Progress"
															: getFormDayPickerDate(fulfilment.packing?.updatedAt)}
													</span>
												)}
											</button>
											<button
												style={{
													display: "flex",
													alignItems: "center",
													justifyContent: "space-between",
													background: "none",
													border: "none",
													padding: 0,
													width: "100%",
													cursor: "pointer",
												}}
												type="button"
												aria-label="Select Picking Tab"
												onClick={(event) => {
													event.stopPropagation();
													setSelectedFulfilmentId(fulfilment.id);
													setCurrentTab("shipping");
												}}
												disabled={currentFulfilment?.packing?.status !== "AUTHORIZED"}
											>
												<div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
													{!fulfilment.shipping ? (
														<svg
															width="18"
															height="18"
															viewBox="0 0 18 18"
															fill="none"
															xmlns="http://www.w3.org/2000/svg"
														>
															<path
																fillRule="evenodd"
																clipRule="evenodd"
																d="M9 1.5C13.1421 1.5 16.5 4.85786 16.5 9C16.5 13.1421 13.1421 16.5 9 16.5C4.85786 16.5 1.5 13.1421 1.5 9C1.5 4.85786 4.85786 1.5 9 1.5ZM9 3C5.68629 3 3 5.68629 3 9C3 12.3137 5.68629 15 9 15C12.3137 15 15 12.3137 15 9C15 5.68629 12.3137 3 9 3Z"
																fill="#E6E9F4"
															/>
														</svg>
													) : fulfilment.shipping?.status === "AUTHORIZED" ? (
														<svg
															width="18"
															height="18"
															viewBox="0 0 18 18"
															fill="none"
															xmlns="http://www.w3.org/2000/svg"
														>
															<path
																fillRule="evenodd"
																clipRule="evenodd"
																d="M9 1.5C13.1421 1.5 16.5 4.85786 16.5 9C16.5 13.1421 13.1421 16.5 9 16.5C4.85786 16.5 1.5 13.1421 1.5 9C1.5 4.85786 4.85786 1.5 9 1.5Z"
																fill="#1E5EFF"
															/>
															<path
																fillRule="evenodd"
																clipRule="evenodd"
																d="M9 3C5.68629 3 3 5.68629 3 9C3 12.3137 5.68629 15 9 15C12.3137 15 15 12.3137 15 9C15 5.68629 12.3137 3 9 3Z"
																fill="#1E5EFF"
															/>
															<path
																fillRule="evenodd"
																clipRule="evenodd"
																d="M11.2147 6.53307C11.5005 6.24085 11.9709 6.2415 12.2559 6.53451C12.5308 6.8172 12.5303 7.26751 12.2548 7.54961L7.908 12L5.74294 9.77388C5.46851 9.49171 5.46851 9.04237 5.74294 8.76019C6.02835 8.46673 6.49968 8.46669 6.78513 8.7601L7.908 9.91424L11.2147 6.53307Z"
																fill="white"
															/>
														</svg>
													) : (
														<svg
															width="18"
															height="18"
															viewBox="0 0 18 18"
															fill="none"
															xmlns="http://www.w3.org/2000/svg"
														>
															<path
																fillRule="evenodd"
																clipRule="evenodd"
																d="M9 1.5C13.1421 1.5 16.5 4.85786 16.5 9C16.5 13.1421 13.1421 16.5 9 16.5C4.85786 16.5 1.5 13.1421 1.5 9C1.5 4.85786 4.85786 1.5 9 1.5ZM9 3C5.68629 3 3 5.68629 3 9C3 12.3137 5.68629 15 9 15C12.3137 15 15 12.3137 15 9C15 5.68629 12.3137 3 9 3Z"
																fill="#1E5EFF"
															/>
														</svg>
													)}
													<span style={{ fontSize: "14px", color: "rgba(90, 96, 127, 1)" }}>Shipping</span>
												</div>
												{!!fulfilment.shipping && (
													<span style={{ fontSize: "14px", color: "rgba(90, 96, 127, 1)" }}>
														{fulfilment.shipping?.status === "DRAFT"
															? "In Progress"
															: getFormDayPickerDate(fulfilment.shipping?.updatedAt)}
													</span>
												)}
											</button>
										</div>
									</div>
								))}
							</div>
						</div>
					)}

					<div className="salesOrder__fulfilment-right-container">
						<Tabs.Root
							className="tabs"
							value={currentTab}
							onValueChange={setCurrentTab}
							defaultValue={tabsNav[0].name}
						>
							<div className="salesOrder__fulfilment-right-header">
								<Tabs.List className="tabs__nav">
									<Tabs.Trigger key={tabsNav[0].name} value={tabsNav[0].name} className="tabs__btn">
										{tabsNav[0].content}
									</Tabs.Trigger>
									<Tabs.Trigger
										disabled={!currentFulfilment || currentFulfilment.picking?.status !== "AUTHORIZED"}
										key={tabsNav[1].name}
										value={tabsNav[1].name}
										className="tabs__btn"
									>
										{tabsNav[1].content}
									</Tabs.Trigger>
									<Tabs.Trigger
										disabled={!currentFulfilment || currentFulfilment.packing?.status !== "AUTHORIZED"}
										key={tabsNav[2].name}
										value={tabsNav[2].name}
										className="tabs__btn"
									>
										{tabsNav[2].content}
									</Tabs.Trigger>
								</Tabs.List>
							</div>
							<Tabs.Content className="tabs__content" value={tabsNav[0].name}>
								<PickingTable
									orderInfo={orderInfo}
									fulfilment={currentFulfilment}
									isListShown={isListShown}
									setIsListShown={setIsListShown}
									setSelectedFulfilmentId={setSelectedFulfilmentId}
								/>
							</Tabs.Content>
							<Tabs.Content className="tabs__content" value={tabsNav[1].name}>
								<PackingTable
									orderInfo={orderInfo}
									fulfilment={currentFulfilment!}
									isListShown={isListShown}
									setIsListShown={setIsListShown}
								/>
							</Tabs.Content>
							<Tabs.Content className="tabs__content" value={tabsNav[2].name}>
								<ShippingTable
									orderInfo={orderInfo}
									fulfilment={currentFulfilment!}
									isListShown={isListShown}
									setIsListShown={setIsListShown}
								/>
							</Tabs.Content>
						</Tabs.Root>
					</div>
				</div>
			) : (
				<p className="empty_list">No data available</p>
			)}
		</CommonPageWrapper>
	);
};
