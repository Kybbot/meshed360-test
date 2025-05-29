import { ChangeEvent, KeyboardEvent, forwardRef, useCallback, useMemo, useRef, useState } from "react";

import { Spinner } from "@/components/shared/Spinner";
import { Input } from "@/components/shared/form/Input";

import { useDebounce } from "@/hooks/useDebounce";
import { useClickOutside } from "@/hooks/useClickOutside";
import { useCustomSelectStyles } from "@/hooks/useCustomSelectStyles";

import { SelectOption, SelectOptionOnlyWithName } from "@/@types/selects";

type Props = {
	id: string;
	error?: string;
	isSmall?: boolean;
	disabled?: boolean;
	placeholder: string;
	useSearch?: boolean;
	isLoading?: boolean;
	useNameAsId?: boolean;
	allowUnselect?: boolean;
	value?: SelectOption | SelectOptionOnlyWithName;
	customValues?: (SelectOption | SelectOptionOnlyWithName)[];
	onValueChange: (value: (SelectOption | SelectOptionOnlyWithName) | undefined) => void;
};

type Ref = HTMLDivElement;

export const CustomSelect = forwardRef<Ref, Props>(
	(
		{
			id,
			error,
			value,
			isSmall,
			disabled,
			useSearch,
			isLoading,
			placeholder,
			useNameAsId,
			customValues,
			onValueChange,
			allowUnselect = true,
		},
		forwardedRef,
	) => {
		const hasError = !!error;

		const buttonRef = useRef<HTMLButtonElement>(null);

		const [isOpen, setIsOpen] = useState(false);
		const [isHighlighted, setIsHighlighted] = useState(false);

		const { contentRef, containerRef } = useCustomSelectStyles(isOpen);

		const [search, setSearch] = useState("");
		const searchValue = useDebounce<string>(search, 700);

		const handleOpen = () => {
			if (value && !isOpen && allowUnselect) {
				setIsHighlighted(true);
			} else {
				setIsHighlighted(false);
			}
			setIsOpen((prev) => !prev);
		};

		const onClickOutside = useCallback(() => {
			setIsOpen(false);
			setIsHighlighted(false);
		}, []);

		useClickOutside(containerRef, onClickOutside);

		const handleChangeSearch = (event: ChangeEvent<HTMLInputElement>) => {
			setSearch(event.target.value);
		};

		const selectOption = (option: SelectOption | SelectOptionOnlyWithName) => {
			if (option !== value) onValueChange(option);
		};

		const isOptionSelected = (option: SelectOption | SelectOptionOnlyWithName) => {
			if (useNameAsId) {
				return option.name === value?.name;
			} else {
				return option.id === value?.id;
			}
		};

		const filteredValues = useMemo(() => {
			if (customValues) {
				return customValues.filter(
					(item) =>
						item.name.toLocaleLowerCase() !== null &&
						item.name.toLocaleLowerCase().includes(searchValue.toLocaleLowerCase()),
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
				case "Backspace":
					if (isHighlighted && allowUnselect) {
						e.preventDefault();
						onValueChange(undefined);
						setIsHighlighted(false);
					}
					break;
			}
		};

		return (
			<div className="customSelect__wrapper" ref={forwardedRef}>
				<div className="customSelect__container" ref={containerRef}>
					<button
						type="button"
						ref={buttonRef}
						disabled={disabled}
						onClick={handleOpen}
						onKeyDown={onKeyDown}
						data-state={isOpen ? "open" : "closed"}
						className={`
							customSelect__trigger
							${hasError ? "customSelect__trigger--error" : ""}
							${isLoading ? "customSelect__trigger--loading" : ""}
							${isSmall ? "customSelect__trigger--small" : ""}
					`}
					>
						<span className={isHighlighted && allowUnselect ? "customSelect__value--highlighted" : ""}>
							{value ? value.name : <>&#8203;</>}
						</span>
						<span
							className={`
								customSelect__placeholder
								${value?.name ? "customSelect__placeholder--active" : ""}
								${isSmall ? "customSelect__placeholder--small" : ""}
							`}
						>
							{placeholder}
						</span>
						<div
							className={`
								customSelect__icon
								${isOpen ? "customSelect__icon--open" : ""}
								${isSmall ? "customSelect__icon--small" : ""}
							`}
						>
							{isLoading ? (
								<Spinner />
							) : (
								<svg width={isSmall ? "20" : "24"} height={isSmall ? "20" : "24"} focusable="false">
									<use xlinkHref="/icons/icons.svg#arrowDown" />
								</svg>
							)}
						</div>
					</button>
					<div
						ref={contentRef}
						className={`customSelect__content ${isOpen ? "customSelect__content--open" : ""}`}
					>
						{useSearch && (
							<div className={`customSelect__header ${isSmall ? "customSelect__header--small" : ""}`}>
								<div className="customSelect__form">
									<Input
										isSmall
										label=""
										type="text"
										value={search}
										id={`search-${id}`}
										name={`searchName-${id}`}
										onChange={handleChangeSearch}
										onFocus={() => setIsHighlighted(false)}
										onKeyDown={(event) => event.stopPropagation()}
										className={`${isSmall ? "customSelect__input--small" : ""}`}
									/>
									<button
										type="button"
										aria-label="Search"
										className={`search__submit search__submit--small ${isSmall ? "search__submit--sm" : ""}`}
									>
										<svg
											focusable="false"
											aria-hidden="true"
											className="search__icon"
											width={isSmall ? "20" : "24"}
											height={isSmall ? "20" : "24"}
										>
											<use xlinkHref="/icons/icons.svg#search" />
										</svg>
									</button>
								</div>
							</div>
						)}
						<div className="customSelect__items">
							{filteredValues.map((option) => (
								<button
									type="button"
									onClick={(e) => {
										e.stopPropagation();
										selectOption(option);
										handleOpen();
									}}
									key={useNameAsId ? option.name : option.id}
									className={`
										customSelect__item
										${isOptionSelected(option) ? "customSelect__item--selected" : ""}
										${isSmall ? "customSelect__item--small" : ""}
									`}
								>
									{option.name}
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
