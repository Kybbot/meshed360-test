import { useRef, useMemo, useState, forwardRef, useCallback, ChangeEvent, KeyboardEvent } from "react";
import ReactDOM from "react-dom";

import { Input } from "@/components/shared/form/Input";

import { useDebounce } from "@/hooks/useDebounce";
import { useClickOutside } from "@/hooks/useClickOutside";

import { GetAllOrgBillsResponseType, OrgBillType } from "@/@types/purchaseOrders";

type Props = {
	id: string;
	disabled?: boolean;
	billIds: string[];
	customValues: GetAllOrgBillsResponseType;
	onValueChange: (value: OrgBillType) => void;
};

type Ref = HTMLDivElement;

export const MultipleAllocateModalBillsSelect = forwardRef<Ref, Props>(
	({ id, billIds, disabled, customValues, onValueChange }, forwardedRef) => {
		const buttonRef = useRef<HTMLButtonElement>(null);
		const containerRef = useRef<HTMLDivElement>(null);

		const [isOpen, setIsOpen] = useState(false);
		const [position, setPosition] = useState({ top: 0, left: 0, width: 0 });

		const [search, setSearch] = useState("");
		const searchValue = useDebounce<string>(search, 700);

		const handleOpen = () => {
			if (!isOpen && buttonRef.current) {
				const rect = buttonRef.current.getBoundingClientRect();
				setPosition({ top: rect.bottom, left: rect.left, width: rect.width });
			}
			setIsOpen((prev) => !prev);
		};

		const onClickOutside = useCallback(() => {
			setIsOpen(false);
		}, []);

		useClickOutside(containerRef, onClickOutside);

		const handleChangeSearch = (event: ChangeEvent<HTMLInputElement>) => {
			setSearch(event.target.value);
		};

		const selectOption = (option: OrgBillType) => {
			onValueChange(option);
		};

		const isOptionSelected = (option: OrgBillType) => {
			return billIds.includes(option.id);
		};

		const filteredValues = useMemo(() => {
			if (customValues) {
				return customValues.filter(
					(item) =>
						item.billNumber !== null && item.billNumber.toLowerCase().includes(searchValue.toLowerCase()),
				);
			}

			return [];
		}, [customValues, searchValue]);

		const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
			if (e.target != buttonRef.current) return;

			switch (e.code) {
				case "Enter":
				case "Space":
					e.preventDefault();
					handleOpen();
					break;
				case "Escape":
					e.preventDefault();
					handleOpen();
					break;
			}
		};

		return (
			<div className="customSelect__wrapper" ref={forwardedRef} style={{ minWidth: "250px" }}>
				<div className="customSelect__container" ref={containerRef}>
					<button
						type="button"
						ref={buttonRef}
						disabled={disabled}
						data-active="active"
						onClick={handleOpen}
						onKeyDown={onKeyDown}
						className={`
							customSelect__trigger
							customSelect__trigger--smallHeight
					`}
					>
						<span>&#8203;</span>
						<span className={`customSelect__placeholder`}>Copy From Bill</span>
						<div
							className={`
								customSelect__icon
								${isOpen ? "customSelect__icon--open" : ""}
							`}
						>
							<svg width="24" height="24" focusable="false">
								<use xlinkHref="/icons/icons.svg#arrowDown" />
							</svg>
						</div>
					</button>
					{isOpen &&
						ReactDOM.createPortal(
							<div
								className={`customSelect__content ${isOpen ? "customSelect__content--open" : ""}`}
								style={{ position: "fixed", top: position.top, left: position.left, width: position.width }}
							>
								<div className={`customSelect__header`}>
									<div className="customSelect__form">
										<Input
											label=""
											type="text"
											value={search}
											id={`search-${id}`}
											name={`searchName-${id}`}
											onChange={handleChangeSearch}
											onKeyDown={(event) => event.stopPropagation()}
										/>
										<button type="button" aria-label="Search" className="search__submit">
											<svg
												focusable="false"
												aria-hidden="true"
												className="search__icon"
												width="24"
												height="24"
											>
												<use xlinkHref="/icons/icons.svg#search" />
											</svg>
										</button>
									</div>
								</div>
								<div className="customSelect__items">
									{filteredValues.map((option) => (
										<button
											type="button"
											onClick={(e) => {
												e.stopPropagation();
												selectOption(option);
												handleOpen();
											}}
											key={option.id}
											className={`
										customSelect__item
										${isOptionSelected(option) ? "customSelect__item--selected" : ""}
									`}
										>
											{option.billNumber}
										</button>
									))}
								</div>
							</div>,
							document.body.querySelector("#portal") as HTMLDivElement,
						)}
				</div>
			</div>
		);
	},
);
