import { FC } from "react";

import { calculateTotalTableValues } from "../utils/calculate";

import { OrderLineFormType, AdditionalLineFormType } from "@/@types/purchaseOrder/orderLines";

type Props = {
	firstHeader: string;
	secondHeader: string;
	taxInclusive: boolean;
	orderLinesValues: OrderLineFormType[];
	serviceLinesValues: AdditionalLineFormType[];
};

export const TotalTable: FC<Props> = ({
	firstHeader,
	secondHeader,
	taxInclusive,
	orderLinesValues,
	serviceLinesValues,
}) => {
	const orderLines = calculateTotalTableValues(orderLinesValues, taxInclusive);
	const serviceLines = calculateTotalTableValues(serviceLinesValues, taxInclusive);

	return (
		<div className="totalTable">
			<table className="totalTable__table">
				<thead className="totalTable__thead">
					<tr className="totalTable__tr">
						<th className="totalTable__th" style={{ width: "13%" }}></th>
						<th className="totalTable__th" style={{ width: "32%" }}>
							{firstHeader}
						</th>
						<th className="totalTable__th" style={{ width: "32%" }}>
							{secondHeader}
						</th>
						<th className="totalTable__th" style={{ width: "33%" }}>
							Total
						</th>
					</tr>
				</thead>
				<tbody>
					<tr className="totalTable__tr">
						<td className="totalTable__td">Before Tax</td>
						<td className="totalTable__td">{orderLines.beforeTax.toFixed(2)}</td>
						<td className="totalTable__td">{serviceLines.beforeTax.toFixed(2)}</td>
						<td className="totalTable__td">{(orderLines.beforeTax + serviceLines.beforeTax).toFixed(2)}</td>
					</tr>
					<tr className="totalTable__tr">
						<td className="totalTable__td">Tax</td>
						<td className="totalTable__td">{orderLines.tax.toFixed(2)}</td>
						<td className="totalTable__td">{serviceLines.tax.toFixed(2)}</td>
						<td className="totalTable__td">{(orderLines.tax + serviceLines.tax).toFixed(2)}</td>
					</tr>
					<tr className="totalTable__tr">
						<td className="totalTable__td">Total</td>
						<td className="totalTable__td">{orderLines.total.toFixed(2)}</td>
						<td className="totalTable__td">{serviceLines.total.toFixed(2)}</td>
						<td className="totalTable__td">{(orderLines.total + serviceLines.total).toFixed(2)}</td>
					</tr>
				</tbody>
			</table>
		</div>
	);
};
