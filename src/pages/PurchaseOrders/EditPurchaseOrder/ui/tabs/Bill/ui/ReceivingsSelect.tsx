import { useRef, useMemo, useState, forwardRef, useCallback, ChangeEvent, KeyboardEvent } from "react";

import { getReceivingsForSelect } from "../utils/getReceivings";

import { Input } from "@/components/shared/form/Input";

import { useDebounce } from "@/hooks/useDebounce";
import { useClickOutside } from "@/hooks/useClickOutside";
import { useCustomSelectStyles } from "@/hooks/useCustomSelectStyles";

import { BillType } from "@/@types/purchaseOrders";
import { ReceivingType } from "@/@types/purchaseOrder/receiving";

type Props = {
	id: string;
	error?: string;
	bills: BillType[];
	disabled?: boolean;
	receivingIds: string[];
	customValues: ReceivingType[];
	onValueChange: (value: ReceivingType, useReset?: boolean) => void;
};

type Ref = HTMLDivElement;

export const ReceivingsSelect = forwardRef<Ref, Props>(
	({ id, error, bills, receivingIds, disabled, customValues, onValueChange }, forwardedRef) => {
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

		const selectOption = (option: ReceivingType) => {
			if (!receivingIds.includes(option.id)) {
				onValueChange(option, true);
			}
		};

		const isOptionSelected = (option: ReceivingType) => {
			return receivingIds.includes(option.id);
		};

		const receivings = useMemo(() => {
			return getReceivingsForSelect(customValues, bills);
		}, [customValues, bills]);

		const filteredValues = useMemo(() => {
			if (receivings.receivingsResult) {
				return receivings.receivingsResult.filter(
					(item) =>
						item.status === "AUTHORIZED" &&
						item.receivingNumber.toLocaleLowerCase() !== null &&
						item.receivingNumber.toLocaleLowerCase().includes(searchValue.toLocaleLowerCase()),
				);
			}

			return [];
		}, [receivings, searchValue]);

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
							${hasError ? "customSelect__trigger--error" : ""}
					`}
					>
						<span>&#8203;</span>
						<span className={`customSelect__placeholder`}>Copy From Receiving</span>
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
									{option.receivingNumber}
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
