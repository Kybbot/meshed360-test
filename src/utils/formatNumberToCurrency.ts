export const formatNumberToCurrency = (value: number | string | undefined | null) => {
	const formattedCurrency = value
		? new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(+value)
		: "0.00";

	return formattedCurrency.replace("$", "");
};
