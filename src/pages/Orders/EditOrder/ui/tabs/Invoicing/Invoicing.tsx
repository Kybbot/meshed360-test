import { FC, useEffect, useMemo, useState } from "react";
import { Loader } from "@/components/shared/Loader.tsx";
import { ErrorMessage } from "@/components/shared/ErrorMessage.tsx";
import { CommonPageWrapper } from "@/components/widgets/Page";
import { useParams } from "react-router";
import { useStore } from "zustand";
import { orgStore } from "@/app/stores/orgStore.ts";
import { ExtendedSalesOrder, Template } from "@/@types/salesOrders/api.ts";
import { useGetOrderInvoicing } from "@/entities/orders/api/queries/useGetOrderInvoicing.ts";
import { DefaultTable } from "@/pages/Orders/EditOrder/ui/tabs/Invoicing/templates/DefaultTable/DefaultTable.tsx";
import getInvoiceTotal from "@/pages/Orders/EditOrder/ui/tabs/Invoicing/utils/getInvoiceTotal.ts";
import { MeatTable } from "@/pages/Orders/EditOrder/ui/tabs/Invoicing/templates/MeatTable/MeatTable.tsx";
import { WoolworthTable } from "@/pages/Orders/EditOrder/ui/tabs/Invoicing/templates/WoolworthTable/WoolworthTable.tsx";
import { orderStore } from "@/app/stores/orderStore.ts";
import { DefaultOrderLineType, OrderServiceLineType } from "@/@types/salesOrders/local.ts";
import { currencySymbols } from "@/utils/currencySymbols";
import { formatNumberToCurrency } from "@/utils/formatNumberToCurrency";

interface Props {
	orderInfo: ExtendedSalesOrder;
}

export const Invoicing: FC<Props> = ({ orderInfo }) => {
	const { orderId } = useParams();
	const { orgId } = useStore(orgStore);
	const { setInvoicing } = useStore(orderStore);
	const [isListShown, setIsListShown] = useState(true);
	const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(null);

	const { data, error, isError, isLoading, isSuccess } = useGetOrderInvoicing({
		organisationId: orgId,
		orderId,
	});

	useEffect(() => {
		if (data?.data?.salesOrderInvoices) {
			setInvoicing(data.data.salesOrderInvoices);
		}
	}, [data]);

	const currentInvoice = useMemo(() => {
		if (data && selectedInvoiceId) {
			return data.data.salesOrderInvoices.find(({ id }) => id === selectedInvoiceId);
		} else {
			return undefined;
		}
	}, [data, selectedInvoiceId]);

	const renderForm = () => {
		switch (orderInfo.template) {
			case Template.MEAT:
				return (
					<MeatTable
						orderInfo={orderInfo}
						invoice={currentInvoice}
						isListShown={isListShown}
						setIsListShown={setIsListShown}
						setSelectedInvoiceId={setSelectedInvoiceId}
					/>
				);
			case Template.WOOLWORTHS:
				return (
					<WoolworthTable
						orderInfo={orderInfo}
						invoice={currentInvoice}
						isListShown={isListShown}
						setIsListShown={setIsListShown}
						setSelectedInvoiceId={setSelectedInvoiceId}
					/>
				);
			default:
				return (
					<DefaultTable
						orderInfo={orderInfo}
						invoice={currentInvoice}
						isListShown={isListShown}
						setIsListShown={setIsListShown}
						setSelectedInvoiceId={setSelectedInvoiceId}
					/>
				);
		}
	};

	return (
		<CommonPageWrapper>
			{isLoading ? (
				<Loader />
			) : isError && error ? (
				<ErrorMessage error={error} />
			) : isSuccess ? (
				<div className={`receivingTab ${isListShown ? "receivingTab--active" : ""}`}>
					<div className={`receivinglist ${isListShown ? "receivinglist--active" : ""}`}>
						<div className="receivinglist__header">
							<h2 className="receivinglist__title">Invoices</h2>
						</div>
						<div className="receivinglist__content">
							{data.data.salesOrderInvoices.map((invoice, index) => (
								<div
									role="presentation"
									key={invoice.id}
									onClick={() => setSelectedInvoiceId(invoice.id)}
									className="salesOrder__invoicing-list-card"
								>
									<div
										style={{ marginBottom: 0 }}
										className={`salesOrder__invoicing-list-card-heading ${invoice.id === selectedInvoiceId && "salesOrder__invoicing-list-card-heading-active"}`}
									>
										<div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
											<div
												className="salesOrder__invoicing-list-card-heading-indicator"
												style={{ backgroundColor: invoice.status === "AUTHORIZED" ? "#06a561" : "#f99600" }}
											></div>
											<span>
												{invoice.invoiceNumber ? `${invoice.invoiceNumber}` : `Invoice #${index + 1}`}
											</span>
										</div>
										<span style={{ fontWeight: 600 }}>
											Due: {currencySymbols?.[orderInfo.currency.code] || ""}
											{formatNumberToCurrency(
												`${getInvoiceTotal(
													invoice.lines.map((line) => ({
														...line,
														taxType: line.taxRate,
													})) as unknown as DefaultOrderLineType[],
													invoice.serviceLines as unknown as OrderServiceLineType[],
													orderInfo.taxInclusive,
												)}`,
											)}{" "}
										</span>
									</div>
									{!!invoice.payments?.length && (
										<div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
											{invoice.payments?.map((payment, index) => (
												<div
													key={payment.id}
													style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}
												>
													<span style={{ fontSize: "14px", color: "rgba(90, 96, 127, 1)" }}>
														Payment #{index + 1}
													</span>
													<span style={{ fontSize: "14px", color: "rgba(90, 96, 127, 1)" }}>
														{payment.paid} ({orderInfo.currency.code})
													</span>
												</div>
											))}
										</div>
									)}
								</div>
							))}
						</div>
					</div>
					<div>{renderForm()}</div>
				</div>
			) : (
				<p className="empty_list">No data available</p>
			)}
		</CommonPageWrapper>
	);
};
