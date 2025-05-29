export const getFormDayPickerDate = (date: Date | string | undefined, useHyphen?: boolean) => {
	if (date) {
		const value = new Date(date);

		const day = value.getDate();
		const month = value.getMonth() + 1;
		const year = value.getFullYear();

		return useHyphen
			? `${year}-${month < 10 ? `0${month}` : month}-${day < 10 ? `0${day}` : day}`
			: `${day < 10 ? `0${day}` : day}/${month < 10 ? `0${month}` : month}/${year}`;
	} else {
		return "";
	}
};

export const getDateFromDayPickerDate = (date?: string) => {
	if (!date) return undefined;

	const [year, month, day] = date.split("-");

	return new Date(`${year}-${month}-${day}`);
};

export const parseDateToIso = (date?: string): string | null => {
	if (!date) return null;

	const [day, month, year] = date.split(/[-/]/);

	if (!day || !month || !year) return null;

	return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
};

export const getDueDate = (date: Date, method: number, durationDays: number | null) => {
	switch (method) {
		case 1: {
			const now = date;
			const futureDate = new Date(now.getFullYear(), now.getMonth() + 1, durationDays || 1);
			return futureDate;
		}
		case 2: {
			const now = date;
			const futureDate = new Date(now);
			futureDate.setDate(now.getDate() + (durationDays || 0));

			return futureDate;
		}
		case 3: {
			const now = date;
			const futureDate = new Date(now.getFullYear(), now.getMonth() + 1, durationDays || 1);
			return futureDate;
		}
		case 4: {
			const now = new Date();
			const futureDate = new Date(now.getFullYear(), now.getMonth(), durationDays || 1);
			return futureDate;
		}
		case 5: {
			const now = date;
			const futureDate = new Date(now.getFullYear(), now.getMonth() + 2, 0);
			return futureDate;
		}
		case 6: {
			const now = date;
			const futureDate = new Date(now.getFullYear(), now.getMonth() + 3, 0);
			return futureDate;
		}

		default:
			return new Date();
	}
};
