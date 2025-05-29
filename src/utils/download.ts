export const downloadCsvTemplate = (value: string, name: string) => {
	const blob = new Blob([value], { type: "text/csv" });

	const link = document.createElement("a");
	link.href = URL.createObjectURL(blob);
	link.download = `${name}.csv`;

	document.body.appendChild(link);
	link.click();

	document.body.removeChild(link);
};

export const downloadDocxTemplate = async (value: Blob, name: string) => {
	const link = document.createElement("a");
	link.href = URL.createObjectURL(value);
	link.download = `${name}.docx`;

	document.body.appendChild(link);
	link.click();

	document.body.removeChild(link);
};

export const downloadXlsxTemplate = (blob: Blob, name: string) => {
	const link = document.createElement("a");
	link.href = URL.createObjectURL(blob);
	link.download = `${name}.xlsx`;

	document.body.appendChild(link);
	link.click();

	document.body.removeChild(link);
};
