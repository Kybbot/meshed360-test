import { ChangeEvent, forwardRef, useMemo, useRef, useState } from "react";
import { useStore } from "zustand";
import * as PopoverPrimitive from "@radix-ui/react-popover";

import { Spinner } from "@/components/shared/Spinner";
import { Input } from "@/components/shared/form/Input";

import { orgStore } from "@/app/stores/orgStore";

import { useGetWarehoueses } from "@/entities/selects";

import { useDebounce } from "@/hooks/useDebounce";

import { returnErrorText } from "@/utils/returnErrorText";

import { WarehousType } from "@/@types/warehouses";

type Props = {
	id: string;
	error?: string;
	disabled?: boolean;
	placeholder?: string;
	value?: WarehousType;
	onValueChange: (value: WarehousType | undefined) => void;
};

type Ref = HTMLDivElement;

export const FormTableWarehouseSelect = forwardRef<Ref, Props>(
	({ id, error, value, disabled, placeholder = "Select", onValueChange }, forwardedRef) => {
		const { orgId } = useStore(orgStore);

		const closeRef = useRef<HTMLButtonElement>(null);
		const buttonRef = useRef<HTMLButtonElement>(null);

		const [isOpen, setIsOpen] = useState(false);

		const [search, setSearch] = useState("");
		const searchValue = useDebounce<string>(search, 700);

		const {
			data,
			isError,
			isLoading,
			error: dataError,
		} = useGetWarehoueses({ organisationId: orgId, searchValue: searchValue });

		const hasError = !!error || !!dataError;

		const handleOpen = () => {
			setIsOpen((prev) => !prev);
		};

		const handleChangeSearch = (event: ChangeEvent<HTMLInputElement>) => {
			setSearch(event.target.value);
		};

		const selectOption = (option: WarehousType) => {
			if (option.id !== value?.id) onValueChange(option);
		};

		const isOptionSelected = (option: WarehousType) => {
			return option.id === value?.id;
		};

		const filteredValues = useMemo(() => {
			if (data) {
				return data.data.warehouses.filter(
					(item) => item.name !== null && item.name.toLowerCase().includes(searchValue.toLowerCase()),
				);
			}

			return [];
		}, [data, searchValue]);

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
								{error} {isError && dataError ? returnErrorText(dataError) : ""}
							</p>
						)}
					</button>
				</PopoverPrimitive.Trigger>
				<PopoverPrimitive.Portal container={document.body.querySelector("#portal2") as HTMLDivElement}>
					<PopoverPrimitive.Content ref={forwardedRef} align="start" className="tableSelect2__content">
						<PopoverPrimitive.Close ref={closeRef} className="tableSelect2__close" />
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
						<div className="customTableSelect__items">
							{filteredValues.map((option) => (
								<button
									type="button"
									onClick={(e) => {
										e.stopPropagation();
										selectOption(option);
										handleOpen();
										if (closeRef.current) closeRef.current.click();
									}}
									key={option.id}
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
