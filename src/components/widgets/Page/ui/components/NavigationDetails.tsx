import { CSSProperties, FC, useCallback, useEffect, useRef, useState } from "react";
import { NavLink, useLocation } from "react-router";

type NavigationDetailsProps = {
	id: string;
	name: string;
	isOpenNavigation: boolean;
	iconName: string;
	iconWidth?: string;
	iconHeight?: string;
	iconStyles?: CSSProperties;
	links: { name: string; link: string }[];
};

export const NavigationDetails: FC<NavigationDetailsProps> = ({
	id,
	name,
	links,
	iconName,
	iconStyles,
	iconWidth = "24",
	isOpenNavigation,
	iconHeight = "24",
}) => {
	const { pathname } = useLocation();
	const isPathnameActive = links.some((link) => pathname.includes(link.link));

	const content = useRef<HTMLDivElement>(null);

	const [isOpen, setIsOpen] = useState(false);
	const [height, setHeight] = useState("0px");

	const handlePanelButton = useCallback((value?: boolean) => {
		setIsOpen((prevState) => (value ? value : !prevState));
		setHeight((prevState) =>
			prevState === "0px" && content.current ? `${content.current.scrollHeight}px` : "0px",
		);
	}, []);

	// useEffect(() => {
	// 	if (!isPathnameActive) {
	// 		handlePanelButton(false);
	// 	}
	// }, [isPathnameActive, handlePanelButton]);

	useEffect(() => {
		if (isOpenNavigation && !isOpen && isPathnameActive) {
			handlePanelButton(true);
		}
	}, [isOpenNavigation, isOpen, isPathnameActive, handlePanelButton]);

	return (
		<div className={`navigationDetails ${isPathnameActive || isOpen ? "navigationDetails--open" : ""}`}>
			<button
				type="button"
				id={`${id}-header`}
				disabled={isPathnameActive}
				aria-controls={`${id}-panel`}
				aria-expanded={isPathnameActive || isOpen}
				className={`navigationDetails__btn ${isPathnameActive ? "navigationDetails__btn--active" : ""}`}
				onClick={() => handlePanelButton()}
			>
				<div className="navigationDetails__wrapper">
					<div className="navigationDetails__icon" style={iconStyles}>
						<svg width={iconWidth} height={iconHeight} focusable="false" aria-hidden="true">
							<use xlinkHref={`/icons/icons.svg#${iconName}`} />
						</svg>
					</div>
					{isOpenNavigation && name}
				</div>
				{isOpenNavigation && (
					<svg
						width="18"
						height="18"
						focusable="false"
						aria-hidden="true"
						className="navigationDetails__arrow"
					>
						<use xlinkHref="/icons/icons.svg#arrowDown" />
					</svg>
				)}
			</button>
			<div
				ref={content}
				id={`${id}-panel`}
				aria-hidden={!isOpen}
				aria-labelledby={`${id}-header`}
				className="navigationDetails__content"
				style={{ maxHeight: `${height}` }}
			>
				{isOpenNavigation && (
					<ul className="navigationDetails__links">
						{links.map((link) => (
							<li key={link.name} className="navigationDetails__li">
								<NavLink
									to={link.link}
									className={({ isActive }) =>
										`navigationDetails__link ${isActive ? "navigationDetails__link--active" : ""}`
									}
								>
									{link.name}
								</NavLink>
							</li>
						))}
					</ul>
				)}
			</div>
		</div>
	);
};
