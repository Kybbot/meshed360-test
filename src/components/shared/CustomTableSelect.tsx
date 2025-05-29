import { ChangeEvent, forwardRef, useMemo, useRef, useState } from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";

import { Spinner } from "@/components/shared/Spinner";
import { Input } from "@/components/shared/form/Input";

import { useDebounce } from "@/hooks/useDebounce";

import { SelectOption, SelectOptionOnlyWithName } from "@/@types/selects";

type Props = {
	id: string;
	error?: string;
	disabled?: boolean;
	placeholder: string;
	useSearch?: boolean;
	isLoading?: boolean;
	useNameAsId?: boolean;
	value?: SelectOption | SelectOptionOnlyWithName;
	customValues?: (SelectOption | SelectOptionOnlyWithName)[];
	onValueChange: (value?: SelectOption | SelectOptionOnlyWithName) => void;
};

type Ref = HTMLDivElement;

export const CustomTableSelect = forwardRef<Ref, Props>(
	(
		{
			id,
			error,
			value,
			disabled,
			useSearch,
			isLoading,
			placeholder,
			useNameAsId,
			customValues,
			onValueChange,
		},
		forwardedRef,
	) => {
		const hasError = !!error;

		const closeRef = useRef<HTMLButtonElement>(null);
		const buttonRef = useRef<HTMLButtonElement>(null);

		const [isOpen, setIsOpen] = useState(false);

		const [search, setSearch] = useState("");
		const searchValue = useDebounce<string>(search, 700);

		const handleOpen = () => {
			setIsOpen((prev) => !prev);
		};

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
					(item) => item.name !== null && item.name.toLowerCase().includes(searchValue.toLowerCase()),
				);
			}

			return [];
		}, [customValues, searchValue]);

		return (
			<PopoverPrimitive.Root>
				<PopoverPrimitive.Trigger asChild>
					<button
						type="button"
						ref={buttonRef}
						disabled={disabled}
						className={`
							customTableSelect__trigger
							${hasError ? "customTableSelect__trigger--error" : ""}
							${isLoading ? "customTableSelect__trigger--loading" : ""}
						`}
					>
						<span>{value ? value.name : <>&#8203;</>}</span>
						<span
							className={`customTableSelect__placeholder ${value?.name ? "customTableSelect__placeholder--active" : ""}`}
						>
							{placeholder}
						</span>
						<div className={`customTableSelect__icon ${isOpen ? "customTableSelect__icon--open" : ""}`}>
							{isLoading ? (
								<Spinner />
							) : (
								<svg width="24" height="24" focusable="false">
									<use xlinkHref="/icons/icons.svg#arrowDown" />
								</svg>
							)}
						</div>
						{hasError && (
							<p role="alert" className="tableSelect__error">
								{error}
							</p>
						)}
					</button>
				</PopoverPrimitive.Trigger>
				<PopoverPrimitive.Portal container={document.body.querySelector("#portal") as HTMLDivElement}>
					<PopoverPrimitive.Content ref={forwardedRef} align="start" className="tableSelect2__content">
						<PopoverPrimitive.Close ref={closeRef} className="tableSelect2__close" />
						{useSearch && (
							<div className="customTableSelect__header">
								<div className="customTableSelect__form">
									<Input
										isSmall
										label=""
										type="text"
										value={search}
										id={`search-${id}`}
										name={`searchName-${id}`}
										onChange={handleChangeSearch}
										onKeyDown={(event) => event.stopPropagation()}
									/>
									<button type="button" aria-label="Search" className="search__submit search__submit--small">
										<svg width="24" height="24" focusable="false" aria-hidden="true" className="search__icon">
											<use xlinkHref="/icons/icons.svg#search" />
										</svg>
									</button>
								</div>
							</div>
						)}
						<div className="customTableSelect__items">
							{filteredValues.map((option, index) => (
								<button
									type="button"
									onClick={(e) => {
										e.stopPropagation();
										selectOption(option);
										handleOpen();
										if (closeRef.current) closeRef.current.click();
									}}
									key={useNameAsId ? `${option.name}-${index}` : option.id}
									className={`
										customTableSelect__item
										${isOptionSelected(option) ? "customTableSelect__item--selected" : ""}
									`}
								>
									{option.name}
								</button>
							))}
						</div>
					</PopoverPrimitive.Content>
				</PopoverPrimitive.Portal>
			</PopoverPrimitive.Root>
		);
	},
);
