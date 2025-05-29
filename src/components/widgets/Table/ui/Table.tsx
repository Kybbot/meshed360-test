import { DetailedHTMLProps, FC, ReactNode, ThHTMLAttributes } from "react";
import { Link } from "react-router";

import { SelectItem, SimpleSelect } from "@/components/shared/SimpleSelect";

import { pluralize } from "@/utils/pluralize";

type TableProps = {
	children: ReactNode;
};

export const Table: FC<TableProps> = ({ children }) => {
	return <table className="table">{children}</table>;
};

type TableTheadProps = {
	children: ReactNode;
};

export const TableThead: FC<TableTheadProps> = ({ children }) => {
	return <thead className="table__thead">{children}</thead>;
};

type TableTbodyProps = {
	children: ReactNode;
};

export const TableTbody: FC<TableTbodyProps> = ({ children }) => {
	return <tbody className="table__tbody">{children}</tbody>;
};

type TableTrProps = {
	children: ReactNode;
	isTotal?: boolean;
};

export const TableTr: FC<TableTrProps> = ({ children, isTotal }) => {
	return <tr className={`table__tr ${isTotal ? "table__tr--total" : ""}`}>{children}</tr>;
};

type TableThProps = {
	children: ReactNode;
	isShown?: boolean;
	isActions?: boolean;
	isCheckbox?: boolean;
	sortButton?: ReactNode;
	isCurrentItem?: boolean;
	onSortClick?: () => void;
} & DetailedHTMLProps<ThHTMLAttributes<HTMLTableCellElement>, HTMLTableCellElement>;

export const TableTh: FC<TableThProps> = ({
	children,
	isActions,
	isCheckbox,
	sortButton,
	onSortClick,
	isCurrentItem,
	isShown = true,
	...props
}) => {
	return (
		<th
			className={`
			table__th
			${!isShown ? "table--hide" : ""}
			${isActions ? "table__th--actions" : ""}
			${isCheckbox ? "table__th--checkbox" : ""}
			${onSortClick ? "table__th--clickable" : ""}
			${isCurrentItem ? "table__th--currentItem" : ""}
			`}
			onClick={onSortClick}
			{...props}
		>
			{sortButton ? (
				<div className="table__th--sort">
					{children}
					{sortButton}
				</div>
			) : (
				children
			)}
		</th>
	);
};

type TableTdProps = {
	children: ReactNode;
	width?: string;
	isShown?: boolean;
	isOverflow?: boolean;
	isCapitalize?: boolean;
};

export const TableTd: FC<TableTdProps> = ({
	children,
	isShown = true,
	isOverflow = false,
	isCapitalize = false,
}) => {
	return (
		<td
			className={`
				table__td
				${!isShown ? "table--hide" : ""}
				${isCapitalize ? "table__td--capitalize" : ""}
			`}
		>
			{isOverflow ? <span className="table__td--overflow">{children}</span> : children}
		</td>
	);
};

type TableLinkProps = {
	children: ReactNode;
	to: string;
};

export const TableLink: FC<TableLinkProps> = ({ children, to }) => {
	return (
		<Link to={to} className="table__link">
			{children}
		</Link>
	);
};

type TableCenterProps = {
	children: ReactNode;
};

export const TableCenter: FC<TableCenterProps> = ({ children }) => {
	return <div className="table__td--center">{children}</div>;
};

type TableStatusProps = {
	children: ReactNode;
	isYellow?: boolean;
	isGreen?: boolean;
	isRed?: boolean;
};

export const TableStatus: FC<TableStatusProps> = ({ children, isYellow, isGreen, isRed }) => {
	return (
		<span
			className={`
				table__status
				${isRed ? "table__status--red" : ""}
				${isGreen ? "table__status--green" : ""}
				${isYellow ? "table__status--yellow" : ""}
			`}
		>
			{children}
		</span>
	);
};

type TableEmptyProps = {
	colSpan: number;
};

export const TableEmpty: FC<TableEmptyProps> = ({ colSpan }) => {
	return (
		<tr>
			<td className="table__td table__td--empty" colSpan={colSpan}>
				No data available
			</td>
		</tr>
	);
};

type TablePaginationProps = {
	page: string;
	limit: string;
	total: number;
	totalPages: number;
	handlePageAndLimit: (p: string, l: string) => void;
};

const limits = {
	10: "10",
	25: "25",
	50: "50",
	100: "100",
	200: "200",
};

export const TablePagination: FC<TablePaginationProps> = ({
	page,
	limit,
	total,
	totalPages,
	handlePageAndLimit,
}) => {
	const handlePrevPage = () => {
		const newPage = (+page - 1).toString();
		handlePageAndLimit(newPage, limit);
	};

	const handleNextPage = () => {
		const newPage = (+page + 1).toString();
		handlePageAndLimit(newPage, limit);
	};

	const goToPage = (page: number) => {
		handlePageAndLimit(page.toString(), limit);
	};

	const handleChangeLimit = (value: string) => {
		handlePageAndLimit("1", value);
	};

	const getVisibleElements = () => {
		if (+page < 1 || +page > totalPages) {
			return 0;
		}

		const start = Math.min((+page - 1) * +limit + 1, total);
		const end = Math.min(+page * +limit, total);

		return `${start}-${end}`;
	};

	const generatePageNumbers = () => {
		const pageNumbers = [];
		const totalVisible = 6;

		if (totalPages === 0) {
			return [1];
		}

		if (totalPages <= totalVisible) {
			for (let i = 1; i <= totalPages; i++) {
				pageNumbers.push(i);
			}
		} else {
			let leftSide = Math.max(+page - 2, 1);
			let rightSide = Math.min(+page + 2, totalPages);

			if (+page <= 3) {
				rightSide = totalVisible;
			} else if (+page >= totalPages - 2) {
				leftSide = totalPages - (totalVisible - 1);
			}

			for (let i = leftSide; i <= rightSide; i++) {
				pageNumbers.push(i);
			}

			if (leftSide > 1) {
				pageNumbers.unshift("...");
				pageNumbers.unshift(1);
			}
			if (rightSide < totalPages) {
				pageNumbers.push("...");
				pageNumbers.push(totalPages);
			}
		}
		return pageNumbers;
	};

	return (
		<div className="customTable__pagination">
			<div className="customTable__showing">
				<p>Showing</p>
				<SimpleSelect id="show" value={limit} isForPagination onValueChange={handleChangeLimit}>
					{Object.entries(limits).map((value) => (
						<SelectItem key={value[0]} value={value[0]}>
							{value[1]}
						</SelectItem>
					))}
				</SimpleSelect>
				<p>items per page</p>
			</div>
			<p className="customTable__entries">
				{getVisibleElements()} of {pluralize(total, "Entry", "Entries")}
			</p>
			<div className="customTable__btns">
				<button
					type="button"
					aria-label="Prev page"
					disabled={page === "1"}
					onClick={handlePrevPage}
					className="customTable__arrow customTable__arrow--prev"
				>
					<svg width="24" height="24" focusable="false" aria-hidden="true">
						<use xlinkHref="/icons/icons.svg#prev" />
					</svg>
				</button>
				<div className="customTable__numbers">
					{generatePageNumbers().map((item, index) => (
						<button
							key={index}
							type="button"
							disabled={+page === item}
							onClick={() => typeof item === "number" && goToPage(item)}
							className={`
								customTable__page
								${+page === item ? "customTable__page--active" : ""}
								${typeof item !== "number" ? "customTable__page--dots" : ""}
							`}
						>
							{item}
						</button>
					))}
				</div>
				<button
					type="button"
					aria-label="Next page"
					onClick={handleNextPage}
					disabled={page === totalPages.toString() || totalPages === 0}
					className="customTable__arrow customTable__arrow--next"
				>
					<svg width="24" height="24" focusable="false" aria-hidden="true">
						<use xlinkHref="/icons/icons.svg#prev" />
					</svg>
				</button>
			</div>
		</div>
	);
};
