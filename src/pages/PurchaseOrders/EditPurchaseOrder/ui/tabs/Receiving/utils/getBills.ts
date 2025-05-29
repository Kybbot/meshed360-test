import { BillType } from "@/@types/purchaseOrders";
import { ReceivingType } from "@/@types/purchaseOrder/receiving";

const getLinesWithRemaining = (
	lines: { key: string; value: { [key: string]: number } }[],
	billedLineQuantity: { [key: string]: number },
) => {
	// Make a mutable copy of the billed quantities
	const billedRemaining = { ...billedLineQuantity };
	const result = [];

	for (const { key, value } of lines) {
		const newValue: { [key: string]: number } = {};
		let consumedAny = false;

		// For each item in this line...
		for (const [id, qty] of Object.entries(value)) {
			const toBill = billedRemaining[id] || 0;

			if (toBill > 0) {
				// consume up to `qty`, subtract from billedRemaining
				const consumed = Math.min(qty, toBill);
				const rem = qty - consumed;
				billedRemaining[id] = toBill - consumed;
				newValue[id] = rem;
				consumedAny = true;
			} else {
				// no billed left for this ID → leave as-is
				newValue[id] = qty;
			}
		}

		if (consumedAny) {
			result.push({ key, value: newValue });
		} else {
			result.push({ key, value });
		}
	}

	return result;
};

export const getBillsForSelect = (bills: BillType[], receivings: ReceivingType[], billIds?: string[]) => {
	if (!bills || bills.length <= 0) return { billsResult: [], billLinesQuantity: null };

	const filteredBills = bills.map((bill, index) => {
		const linesMap = bill.lines.reduce(
			(acc, line) => {
				acc[line.orderLineId] = (acc[line.orderLineId] || 0) + +line.quantity;
				return acc;
			},
			{} as { [key: string]: number },
		);

		const sortKey = +index;
		const key = bill.id;

		return { key, value: linesMap, sortKey };
	});

	const sortedArrayOfObject = filteredBills
		.sort((a, b) => a.sortKey - b.sortKey)
		.map(({ sortKey, ...rest }) => rest);

	const receivingsQuantity = receivings.reduce(
		(acc, receiving) => {
			if (receiving.status === "AUTHORIZED") {
				for (const line of receiving.lines) {
					acc[line.orderLineId] = (acc[line.orderLineId] || 0) + +line.quantity;
				}
				return acc;
			}
			return acc;
		},
		{} as { [key: string]: number },
	);

	const linesWithRemaining = getLinesWithRemaining(sortedArrayOfObject, receivingsQuantity);

	const arrayOfReceivingIds = linesWithRemaining
		.filter((obj) => Object.values(obj.value).some((val) => val !== 0))
		.map((obj) => obj.key);

	const billsResult = bills.filter((r) => arrayOfReceivingIds.includes(r.id));

	if (billIds) {
		const objOfLinesWithRemaining = linesWithRemaining.reduce<{ [key: string]: { [key: string]: number } }>(
			(acc, item) => {
				acc[item.key] = item.value;
				return acc;
			},
			{},
		);

		const billLinesQuantity = billIds.reduce<Record<string, number>>((acc, id) => {
			const nested = objOfLinesWithRemaining[id] || {};
			Object.entries(nested).forEach(([key, value]) => {
				acc[key] = (acc[key] || 0) + value;
			});
			return acc;
		}, {});

		return { billsResult, billLinesQuantity };
	}

	return { billsResult, billLinesQuantity: null };
};
