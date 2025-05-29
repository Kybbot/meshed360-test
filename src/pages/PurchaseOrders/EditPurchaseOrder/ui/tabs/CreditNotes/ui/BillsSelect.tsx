import { useRef, useMemo, useState, forwardRef, useCallback, ChangeEvent, KeyboardEvent } from "react";

import { Input } from "@/components/shared/form/Input";

import { useDebounce } from "@/hooks/useDebounce";
import { useClickOutside } from "@/hooks/useClickOutside";
import { useCustomSelectStyles } from "@/hooks/useCustomSelectStyles";

import { BillType } from "@/@types/purchaseOrders";

type Props = {
	id: string;
	error?: string;
	billIds: string[];
	disabled?: boolean;
	customValues: BillType[];
	onValueChange: (value: BillType, useReset?: boolean) => void;
};

type Ref = HTMLDivElement;

export const BillsSelect = forwardRef<Ref, Props>(
	({ id, error, billIds, disabled, customValues, onValueChange }, forwardedRef) => {
		const hasError = !!error;

		const buttonRef = useRef<HTMLButtonElement>(null);

		const [isOpen, setIsOpen] = useState(false);

		const { contentRef, containerRef } = useCustomSelectStyles(isOpen);

		const [search, setSearch] = useState("");
		const searchValue = useDebounce<string>(search, 700);

		const handleOpen = () => {
			setIsOpen((prev) => !prev);
		};

		const onClickOutside = useCallback(() => {
			setIsOpen(false);
		}, []);

		useClickOutside(containerRef, onClickOutside);

		const handleChangeSearch = (event: ChangeEvent<HTMLInputElement>) => {
			setSearch(event.target.value);
		};

		const selectOption = (option: BillType) => {
			if (!billIds.includes(option.id)) {
				onValueChange(option, true);
			}
		};

		const isOptionSelected = (option: BillType) => {
			return billIds.includes(option.id);
		};

		const filteredValues = useMemo(() => {
			if (customValues) {
				return customValues.filter(
					(item) =>
						item.billNumber !== null &&
						item.status === "AUTHORIZED" &&
						item.billNumber.toLowerCase().includes(searchValue.toLowerCase()),
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
						data-state={isOpen ? "open" : "closed"}
						className={`
							customSelect__trigger
							customSelect__trigger--smallHeight
							${hasError ? "customSelect__trigger--error" : ""}
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
					<div
						ref={contentRef}
						className={`customSelect__content ${isOpen ? "customSelect__content--open" : ""}`}
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
									<svg focusable="false" aria-hidden="true" className="search__icon" width="24" height="24">
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
					</div>
					{hasError && (
						<p role="alert" className="customSelect__error">
							{error}
						</p>
					)}
				</div>
			</div>
		);
	},
);
