import { FC, useEffect, useState } from "react";
import { NavLink } from "react-router";

import { NavigationDetails } from "./components/NavigationDetails";

export const Navigation: FC = () => {
	const [isOpen, setOpen] = useState(false);
	const [navWidth, setNavWidth] = useState(
		document.documentElement.style.getPropertyValue("--navigation-width"),
	);

	const isShow = isOpen || navWidth === "255px";

	const handlePin = () => {
		if (navWidth === "255px") {
			setNavWidth("80px");
			localStorage.setItem("isOpenNav", "0");
			document.documentElement.style.setProperty("--navigation-width", "80px");
		} else {
			setNavWidth("255px");
			localStorage.setItem("isOpenNav", "1");
			document.documentElement.style.setProperty("--navigation-width", "255px");
		}
	};

	useEffect(() => {
		const isOpenNav = localStorage.getItem("isOpenNav");
		const isOpenNavParse = isOpenNav ? +(JSON.parse(isOpenNav) as "1" | "0") : +0;

		if (isOpenNavParse) {
			setOpen(true);
			setNavWidth("255px");
			document.documentElement.style.setProperty("--navigation-width", "255px");
		}
	}, []);

	return (
		<nav
			className="navigation"
			onMouseEnter={() => {
				if (navWidth !== "255px") setOpen(true);
			}}
			onMouseLeave={() => {
				if (navWidth !== "255px") setOpen(false);
			}}
		>
			<div className="navigation__logo">
				<img
					width={44}
					height={44}
					alt="Meshed360"
					src="/imgs/miniLogo.png"
					className="navigation__img"
					srcSet="/imgs/miniLogo@2x.png 2x"
				/>
				<button
					type="button"
					onClick={handlePin}
					className={`navigation__pin ${isShow ? "navigation__pin--visible" : ""}`}
				>
					{navWidth === "255px" ? (
						<svg width="20" height="20" focusable="false" aria-hidden="true">
							<use xlinkHref="/icons/icons.svg#pin2" />
						</svg>
					) : (
						<svg width="20" height="20" focusable="false" aria-hidden="true">
							<use xlinkHref="/icons/icons.svg#pin1" />
						</svg>
					)}
				</button>
			</div>
			<hr className="navigation__hr" />
			<div className="navigation__links">
				<NavLink
					to="/"
					className={({ isActive }) => `navigation__link ${isActive ? "navigation__link--active" : ""}`}
				>
					<svg width="24" height="24" focusable="false" aria-hidden="true">
						<use xlinkHref="/icons/icons.svg#home" />
					</svg>
					{isShow && <span className="navigation__name">Dashboard</span>}
				</NavLink>
				<NavigationDetails
					id="sales"
					name="Sales"
					iconName="sales"
					isOpenNavigation={isShow}
					links={[
						{ name: "Customers", link: "/sales/customers" },
						{ name: "Sales Orders", link: "/sales/orders" },
					]}
				/>
				<NavigationDetails
					id="purchases"
					name="Purchases"
					iconName="purchases"
					isOpenNavigation={isShow}
					links={[
						{ name: "Suppliers", link: "/purchases/suppliers" },
						{ name: "Purchase Orders", link: "/purchases/orders" },
						// { name: "Automated Bills", link: "/purchases/automatedBills" },
						{ name: "Automations", link: "/purchases/automations" },
					]}
				/>
				<NavigationDetails
					id="production"
					name="Production"
					iconName="production"
					isOpenNavigation={isShow}
					links={[
						{ name: "Assembly", link: "/production/assembly" },
						// { name: "Disassembly", link: "/production/disassembly" },
					]}
				/>
				<NavigationDetails
					id="inventory"
					name="Inventory"
					iconName="inventory"
					isOpenNavigation={isShow}
					links={[
						{ name: "Products", link: "/inventory/products" },
						{ name: "Stock Availability", link: "/inventory/stockAvailability" },
						{ name: "Stock Control", link: "/inventory/stockControl" },
					]}
				/>
				{/* <NavigationDetails
					id="approvals"
					name="Approvals"
					iconName="approvals"
					isOpenNavigation={isShow}
					iconWidth="22.5"
					iconHeight="22.5"
					iconStyles={{ paddingLeft: "3px" }}
					links={[
						{ name: "View Approvals", link: "/approvals/viewApprovals" },
						{ name: "Approval Workflows", link: "/approvals/approvalWorkflows" },
					]}
				/> */}
				<NavigationDetails
					id="settings"
					name="Settings"
					iconName="settings"
					isOpenNavigation={isShow}
					links={[
						{ name: "General Settings", link: "/settings/general-settings" },
						{ name: "Users", link: "/settings/users-roles" },
					]}
				/>
				<NavLink
					to="/integrations"
					className={({ isActive }) => `navigation__link ${isActive ? "navigation__link--active" : ""}`}
				>
					<svg width="24" height="24" focusable="false" aria-hidden="true">
						<use xlinkHref="/icons/icons.svg#integrations" />
					</svg>
					{isShow && <span className="navigation__name">Integrations</span>}
				</NavLink>
				<NavLink
					to="/reports"
					className={({ isActive }) => `navigation__link ${isActive ? "navigation__link--active" : ""}`}
				>
					<svg width="24" height="24" focusable="false" aria-hidden="true">
						<use xlinkHref="/icons/icons.svg#reporting" />
					</svg>
					{isShow && <span className="navigation__name">Reporting</span>}
				</NavLink>
				{/* <NavLink
					to="/jobs"
					className={({ isActive }) => `navigation__link ${isActive ? "navigation__link--active" : ""}`}
				>
					<svg width="24" height="24" focusable="false" aria-hidden="true">
						<use xlinkHref="/icons/icons.svg#jobs" />
					</svg>
					{isShow && <span className="navigation__name">Jobs</span>}
				</NavLink> */}
				{/* <NavLink
					to="/assets"
					className={({ isActive }) => `navigation__link ${isActive ? "navigation__link--active" : ""}`}
				>
					<svg width="24" height="24" focusable="false" aria-hidden="true">
						<use xlinkHref="/icons/icons.svg#assets" />
					</svg>
					{isShow && <span className="navigation__name">Assets</span>}
				</NavLink> */}
			</div>
		</nav>
	);
};
