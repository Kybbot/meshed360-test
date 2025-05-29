import { ButtonHTMLAttributes, DetailedHTMLProps, FC, ReactNode, ThHTMLAttributes } from "react";

type OnlyChildrenProp = { children: ReactNode };

export const TF: FC<OnlyChildrenProp> = ({ children }) => {
	return <div className="tableForm">{children}</div>;
};

export const TFTitle: FC<OnlyChildrenProp> = ({ children }) => {
	return <h2 className="tableForm__title">{children}</h2>;
};

export const TFInfo: FC<OnlyChildrenProp> = ({ children }) => {
	return <p className="tableForm__info">{children}</p>;
};

export const TFInfoBold: FC<OnlyChildrenProp> = ({ children }) => {
	return <span className="tableForm__info--bold">{children}</span>;
};

export const TFWrapper: FC<OnlyChildrenProp> = ({ children }) => {
	return <div className="tableForm__wrapper">{children}</div>;
};

export const TFOverflow: FC<OnlyChildrenProp> = ({ children }) => {
	return <div className="tableForm__overflow">{children}</div>;
};

export const TFTable: FC<OnlyChildrenProp> = ({ children }) => {
	return <table className="tableForm__main">{children}</table>;
};

export const TFThead: FC<OnlyChildrenProp> = ({ children }) => {
	return <thead className="tableForm__thead">{children}</thead>;
};

export const TFTr: FC<OnlyChildrenProp> = ({ children }) => {
	return <tr className="tableForm__tr">{children}</tr>;
};

type TFThProps = {
	isRight?: boolean;
	isFooter?: boolean;
	isActions?: boolean;
	children?: ReactNode;
} & DetailedHTMLProps<ThHTMLAttributes<HTMLTableCellElement>, HTMLTableCellElement>;
export const TFTh: FC<TFThProps> = ({ isRight, isFooter, isActions, children, ...props }) => {
	return (
		<th
			className={`
				tableForm__th
				${isRight ? "tableForm__th--right" : ""}
				${isFooter ? "tableForm__th--footer" : ""}
				${isActions ? "tableForm__th--actions" : ""}
			`}
			{...props}
		>
			{children}
		</th>
	);
};

type TFThFootProps = {
	isRight?: boolean;
	isActions?: boolean;
	children?: ReactNode;
};
export const TFThFoot: FC<TFThFootProps> = ({ isRight, isActions, children }) => {
	return (
		<th
			className={`
				tableForm__th
				tableForm__th--footer
				${isRight ? "tableForm__th--right" : ""}
				${isActions ? "tableForm__th--actions" : ""}
			`}
		>
			{children}
		</th>
	);
};

type TFTdProps = {
	error?: string;
	colSpan?: number;
	isText?: boolean;
	isRight?: boolean;
	isEmpty?: boolean;
	isCenter?: boolean;
	uncapitalize?: boolean;
	children: ReactNode;
};
export const TFTd: FC<TFTdProps> = ({
	error,
	isText,
	isRight,
	isEmpty,
	colSpan,
	isCenter,
	uncapitalize,
	children,
}) => {
	return (
		<td className={`tableForm__td ${error ? "tableForm__td--error" : ""}`} colSpan={colSpan}>
			{isCenter || isRight || isEmpty ? (
				<div
					className={`
						tableForm__td--wrapper
						${isRight ? "tableForm__td--right" : ""}
						${isEmpty ? "tableForm__td--empty" : ""}
						${isCenter ? "tableForm__td--center" : ""}
					`}
				>
					{children}
				</div>
			) : isText ? (
				<p
					className={`
						tableForm__td--text
						${uncapitalize ? "tableForm__td--uncapitalize" : ""}
					`}
				>
					{children}
				</p>
			) : (
				<>{children}</>
			)}
			{error && (
				<p role="alert" className="tableForm__td--alert">
					{error}
				</p>
			)}
		</td>
	);
};

export const TFTbody: FC<OnlyChildrenProp> = ({ children }) => {
	return <tbody>{children}</tbody>;
};

export const TFTfoot: FC<OnlyChildrenProp> = ({ children }) => {
	return <tfoot>{children}</tfoot>;
};

export const TFAddRow: FC<OnlyChildrenProp> = ({ children }) => {
	return <div className="tableForm__addRow">{children}</div>;
};

export const TFHr: FC = () => {
	return <hr className="tableForm__hr" />;
};

export const TFRemove: FC<DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>> = ({
	...props
}) => {
	return (
		<button type="button" aria-label="Remove row" className="tableForm__remove" {...props}>
			<svg focusable="false" aria-hidden="true" width="16" height="16">
				<use xlinkHref="/icons/icons.svg#crossInCircle" />
			</svg>
		</button>
	);
};
