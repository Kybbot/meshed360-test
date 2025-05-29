import { FC, useEffect, useMemo, useState } from "react";
import { Loader } from "@/components/shared/Loader.tsx";
import { ErrorMessage } from "@/components/shared/ErrorMessage.tsx";
import { CommonPageTitle, CommonPageWrapper } from "@/components/widgets/Page";
import { useParams } from "react-router";
import { useStore } from "zustand";
import { orgStore } from "@/app/stores/orgStore.ts";
import { ExtendedSalesOrder, Template } from "@/@types/salesOrders/api.ts";
import { DefaultTable } from "@/pages/Orders/EditOrder/ui/tabs/CreditNotes/templates/DefaultTable/DefaultTable.tsx";
import getInvoiceTotal from "@/pages/Orders/EditOrder/ui/tabs/Invoicing/utils/getInvoiceTotal.ts";
import { MeatTable } from "@/pages/Orders/EditOrder/ui/tabs/CreditNotes/templates/MeatTable/MeatTable.tsx";
import { WoolworthTable } from "@/pages/Orders/EditOrder/ui/tabs/CreditNotes/templates/WoolworthTable/WoolworthTable.tsx";
import { useGetOrderCreditNotes } from "@/entities/orders/api/queries/useGetOrderCreditNotes.ts";
import { orderStore } from "@/app/stores/orderStore.ts";
import { DefaultOrderLineType, OrderServiceLineType } from "@/@types/salesOrders/local.ts";

interface Props {
	orderInfo: ExtendedSalesOrder;
}

export const CreditNotes: FC<Props> = ({ orderInfo }) => {
	const { orderId } = useParams();
	const { orgId } = useStore(orgStore);
	const { setCreditNotes } = useStore(orderStore);
	const [isListShown, setIsListShown] = useState(true);
	const [selectedCreditNoteId, setSelectedCreditNoteId] = useState<string | null>(null);

	const { data, error, isError, isLoading, isSuccess } = useGetOrderCreditNotes({
		organisationId: orgId,
		orderId,
	});

	useEffect(() => {
		if (data?.data?.salesOrderCreditNotes) {
			setCreditNotes(data.data.salesOrderCreditNotes);
		}
	}, [data]);

	const currentCreditNote = useMemo(() => {
		if (data && selectedCreditNoteId) {
			return data.data.salesOrderCreditNotes.find(({ id }) => id === selectedCreditNoteId);
		} else {
			return undefined;
		}
	}, [data, selectedCreditNoteId]);

	const renderForm = () => {
		switch (orderInfo.template) {
			case Template.MEAT:
				return (
					<MeatTable
						orderInfo={orderInfo}
						creditNote={currentCreditNote}
						isListShown={isListShown}
						setIsListShown={setIsListShown}
						setSelectedCreditNoteId={setSelectedCreditNoteId}
					/>
				);
			case Template.WOOLWORTHS:
				return (
					<WoolworthTable
						orderInfo={orderInfo}
						creditNote={currentCreditNote}
						isListShown={isListShown}
						setIsListShown={setIsListShown}
						setSelectedCreditNoteId={setSelectedCreditNoteId}
					/>
				);
			default:
				return (
					<DefaultTable
						orderInfo={orderInfo}
						creditNote={currentCreditNote}
						isListShown={isListShown}
						setIsListShown={setIsListShown}
						setSelectedCreditNoteId={setSelectedCreditNoteId}
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
				<div style={{ display: "flex", gap: "48px", alignItems: "flex-start" }}>
					{isListShown && (
						<div className="salesOrder__fulfilment-left-container">
							<div className="salesOrder__fulfilment-left-header">
								<CommonPageTitle>Credit Notes</CommonPageTitle>
								<button type="button" onClick={() => setSelectedCreditNoteId(null)}>
									<svg focusable="false" aria-hidden="true" width="24" height="24">
										<use xlinkHref="/icons/icons.svg#plusInCircle" />
									</svg>
								</button>
							</div>
							<div className="salesOrder__fulfilment-list-container">
								{data.data.salesOrderCreditNotes.map((creditNote, index) => (
									<div
										role="presentation"
										key={creditNote.id}
										onClick={() => setSelectedCreditNoteId(creditNote.id)}
										className="salesOrder__invoicing-list-card"
									>
										<div
											style={{ marginBottom: 0 }}
											className={`salesOrder__invoicing-list-card-heading ${creditNote.id === selectedCreditNoteId && "salesOrder__invoicing-list-card-heading-active"}`}
										>
											<div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
												<div
													className="salesOrder__invoicing-list-card-heading-indicator"
													style={{
														backgroundColor: creditNote.status === "AUTHORIZED" ? "#06a561" : "#f99600",
													}}
												></div>
												<span>
													{creditNote.creditNoteNumber
														? creditNote.creditNoteNumber
														: `Credit Note #${index + 1}`}
												</span>
											</div>
											<span style={{ fontWeight: 600 }}>
												{getInvoiceTotal(
													creditNote.lines.map((line) => ({
														...line,
														taxType: line.taxRate,
													})) as unknown as DefaultOrderLineType[],
													creditNote.serviceLines as unknown as OrderServiceLineType[],
													orderInfo.taxInclusive,
												)}{" "}
												({orderInfo.currency.code})
											</span>
										</div>
									</div>
								))}
							</div>
						</div>
					)}
					<div className="salesOrder__fulfilment-right-container">{renderForm()}</div>
				</div>
			) : (
				<p className="empty_list">No data available</p>
			)}
		</CommonPageWrapper>
	);
};
