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

export const getReceivingsForSelect = (
	receivings: ReceivingType[],
	bills: BillType[],
	receivingIds?: string[],
) => {
	if (!receivings || receivings.length <= 0) return { receivingsResult: [], receivingLinesQuantity: null };

	const filteredReceivings = receivings.map((receiving) => {
		const linesMap = receiving.lines.reduce(
			(acc, line) => {
				acc[line.orderLineId] = (acc[line.orderLineId] || 0) + +line.quantity;
				return acc;
			},
			{} as { [key: string]: number },
		);

		const sortKey = +receiving.receivingNumber.replace("REC-", "");
		const key = receiving.id;

		return { key, value: linesMap, sortKey };
	});

	const sortedArrayOfObject = filteredReceivings
		.sort((a, b) => a.sortKey - b.sortKey)
		.map(({ sortKey, ...rest }) => rest);

	const billsQuantity = bills.reduce(
		(acc, bill) => {
			if (bill.status === "AUTHORIZED" || bill.status === "COMPLETED") {
				for (const line of bill.lines) {
					acc[line.orderLineId] = (acc[line.orderLineId] || 0) + +line.quantity;
				}

				return acc;
			}
			return acc;
		},
		{} as { [key: string]: number },
	);

	const linesWithRemaining = getLinesWithRemaining(sortedArrayOfObject, billsQuantity);

	const arrayOfReceivingIds = linesWithRemaining
		.filter((obj) => Object.values(obj.value).some((val) => val !== 0))
		.map((obj) => obj.key);

	const receivingsResult = receivings.filter((r) => arrayOfReceivingIds.includes(r.id));

	if (receivingIds) {
		const objOfLinesWithRemaining = linesWithRemaining.reduce<{ [key: string]: { [key: string]: number } }>(
			(acc, item) => {
				acc[item.key] = item.value;
				return acc;
			},
			{},
		);

		const receivingLinesQuantity = receivingIds.reduce<Record<string, number>>((acc, id) => {
			const nested = objOfLinesWithRemaining[id] || {};
			Object.entries(nested).forEach(([key, value]) => {
				acc[key] = (acc[key] || 0) + value;
			});
			return acc;
		}, {});

		return { receivingsResult, receivingLinesQuantity };
	}

	return { receivingsResult, receivingLinesQuantity: null };
};
