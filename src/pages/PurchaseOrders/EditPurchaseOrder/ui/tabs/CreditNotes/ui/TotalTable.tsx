import { FC } from "react";

type Props = {
	orderLines: {
		beforeTax: number;
		tax: number;
		total: number;
	};
	serviceLines: {
		beforeTax: number;
		tax: number;
		total: number;
	};
	additionalExpense: boolean;
};

export const TotalTable: FC<Props> = ({ orderLines, serviceLines, additionalExpense }) => {
	return (
		<div className="totalTable">
			<table className="totalTable__table">
				<thead className="totalTable__thead">
					<tr className="totalTable__tr">
						<th className="totalTable__th" style={{ width: !additionalExpense ? "13%" : "50%" }}></th>
						{!additionalExpense && (
							<th className="totalTable__th" style={{ width: "32%" }}>
								Order Lines
							</th>
						)}
						<th className="totalTable__th" style={{ width: !additionalExpense ? "32%" : "50%" }}>
							Additional Costs
						</th>
						{!additionalExpense && (
							<th className="totalTable__th" style={{ width: "33%" }}>
								Total
							</th>
						)}
					</tr>
				</thead>
				<tbody>
					<tr className="totalTable__tr">
						<td className="totalTable__td">Before Tax</td>
						{!additionalExpense && <td className="totalTable__td">{orderLines.beforeTax.toFixed(2)}</td>}
						<td className="totalTable__td">{serviceLines.beforeTax.toFixed(2)}</td>
						{!additionalExpense && (
							<td className="totalTable__td">{(orderLines.beforeTax + serviceLines.beforeTax).toFixed(2)}</td>
						)}
					</tr>
					<tr className="totalTable__tr">
						<td className="totalTable__td">Tax</td>
						{!additionalExpense && <td className="totalTable__td">{orderLines.tax.toFixed(2)}</td>}
						<td className="totalTable__td">{serviceLines.tax.toFixed(2)}</td>
						{!additionalExpense && (
							<td className="totalTable__td">{(orderLines.tax + serviceLines.tax).toFixed(2)}</td>
						)}
					</tr>
					<tr className="totalTable__tr">
						<td className="totalTable__td">Total</td>
						{!additionalExpense && <td className="totalTable__td">{orderLines.total.toFixed(2)}</td>}
						<td className="totalTable__td">{serviceLines.total.toFixed(2)}</td>
						{!additionalExpense && (
							<td className="totalTable__td">{(orderLines.total + serviceLines.total).toFixed(2)}</td>
						)}
					</tr>
				</tbody>
			</table>
		</div>
	);
};
