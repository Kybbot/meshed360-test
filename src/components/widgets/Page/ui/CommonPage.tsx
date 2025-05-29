import { ButtonHTMLAttributes, DetailedHTMLProps, FC, forwardRef, ReactNode } from "react";

type CommonPageProps = {
	children: ReactNode;
};

export const CommonPage: FC<CommonPageProps> = ({ children }) => {
	return <section className="commonPage">{children}</section>;
};

type CommonPageWrapperProps = {
	children: ReactNode;
};

export const CommonPageWrapper: FC<CommonPageWrapperProps> = ({ children }) => {
	return <div className="commonPage__wrapper">{children}</div>;
};

type CommonPageSubWrapperProps = {
	children: ReactNode;
};

export const CommonPageSubWrapper: FC<CommonPageSubWrapperProps> = ({ children }) => {
	return <div className="commonPage__subWrapper">{children}</div>;
};

type CommonPageHeaderProps = {
	children: ReactNode;
	isSimple?: boolean;
	withoutDec?: boolean;
};

export const CommonPageHeader: FC<CommonPageHeaderProps> = ({
	children,
	isSimple = false,
	withoutDec = false,
}) => {
	return (
		<header
			className={`
				commonPage__header
				${isSimple ? "commonPage__header--simple" : ""}
				${withoutDec ? "commonPage__header--withoutDec" : ""}
			`}
		>
			{children}
		</header>
	);
};

type CommonPageStatusProps = {
	children: ReactNode;
	isRed?: boolean;
	isGreen?: boolean;
	isYellow?: boolean;
};

export const CommonPageStatus: FC<CommonPageStatusProps> = ({ children, isRed, isGreen, isYellow }) => {
	return (
		<p
			className={`
				commonPage__status
				${isRed ? "commonPage__status--red" : ""}
				${isGreen ? "commonPage__status--green" : ""}
				${isYellow ? "commonPage__status--yellow" : ""}
			`}
		>
			{children}
		</p>
	);
};

type CommonPageTitleProps = {
	children: ReactNode;
	isSingle?: boolean;
	withoutPadding?: boolean;
};

export const CommonPageTitle: FC<CommonPageTitleProps> = ({ children, withoutPadding, isSingle = false }) => {
	return (
		<h1
			className={`
				commonPage__title
				${isSingle ? "commonPage__title--single" : ""}
				${withoutPadding ? "commonPage__title--withoutPadding" : ""}
			`}
		>
			{children}
		</h1>
	);
};

type CommonPageH2Props = {
	children: ReactNode;
};

export const CommonPageH2: FC<CommonPageH2Props> = ({ children }) => {
	return <h2 className="commonPage__h2">{children}</h2>;
};

type CommonPageActionsProps = {
	children: ReactNode;
	isComplex?: boolean;
	alignItem?: "start" | "end";
};

export const CommonPageActions: FC<CommonPageActionsProps> = ({ children, isComplex, alignItem }) => {
	return (
		<div
			className={`
				commonPage__actions
				${isComplex ? "commonPage__actions--complex" : ""}
				${alignItem ? `commonPage__actions--${alignItem}` : ""}
			`}
		>
			{children}
		</div>
	);
};

export const CommonPageLine: FC = () => {
	return <div className="commonPage__line"></div>;
};

type CommonPageArrowProps = {
	isOpen: boolean;
} & DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;

export const CommonPageArrow: FC<CommonPageArrowProps> = ({ isOpen, ...props }) => {
	return (
		<button
			type="button"
			className={`commonPage__arrow ${isOpen ? "commonPage__arrow--open" : ""}`}
			{...props}
		>
			<svg width="24" height="24" focusable="false" aria-hidden="true">
				<use xlinkHref="/icons/icons.svg#arrowInCircel" />
			</svg>
		</button>
	);
};

type CommonPageButtonsProps = {
	children: ReactNode;
};

export const CommonPageButtons: FC<CommonPageButtonsProps> = ({ children }) => {
	return <div className="commonPage__buttons">{children}</div>;
};

type CommonPageMainRef = HTMLDivElement;

type CommonPageMainProps = {
	children: ReactNode;
	isSimple?: boolean;
	isOpen?: boolean;
	columns?: "two";
} & ({ isActive: true; height: string } | { isActive?: false; height?: never });

export const CommonPageMain = forwardRef<CommonPageMainRef, CommonPageMainProps>(
	({ children, isSimple, isOpen, columns, isActive, height }, forwardRef) => {
		return (
			<div
				ref={forwardRef}
				style={{ maxHeight: `${height}` }}
				className={`
					commonPage__main
					${isSimple ? "commonPage__main--simple" : ""}
					${isActive ? "commonPage__main--active" : ""}
					${columns ? `commonPage__main--${columns}` : ""}
					${isOpen ? "commonPage__main--open" : !isOpen && isActive ? "commonPage__main--close" : ""}
				`}
			>
				{children}
			</div>
		);
	},
);

type CommonPageFooterProps = {
	children: ReactNode;
};

export const CommonPageFooter: FC<CommonPageFooterProps> = ({ children }) => {
	return <div className="commonPage__footer">{children}</div>;
};
