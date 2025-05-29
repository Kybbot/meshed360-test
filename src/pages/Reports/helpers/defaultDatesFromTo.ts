export const formatDateToIsoQwery = (date?: Date) => {
	return new Date(date ?? new Date()).toISOString().slice(0, 10);
};

export const formatToIsoDateString = (fromTo: Date) => {
	const yearFromTo = new Intl.DateTimeFormat("en", { year: "numeric" }).format(fromTo);
	const monthFromTo = new Intl.DateTimeFormat("en", { month: "2-digit" }).format(fromTo);
	const dayFromTo = new Intl.DateTimeFormat("en", { day: "2-digit" }).format(fromTo);
	return `${yearFromTo}-${monthFromTo}-${dayFromTo}`;
};

const defaultDatesFromTo = (from?: string, to?: string) => {
	let dateFrom = from;
	let dateTo = to;

	if (!from) {
		dateFrom = formatDateToIsoQwery(new Date(new Date().setFullYear(new Date().getFullYear() - 1)));
	}

	if (!to) {
		dateTo = formatDateToIsoQwery();
	}
	return { dateFrom, dateTo };
};

export default defaultDatesFromTo;
