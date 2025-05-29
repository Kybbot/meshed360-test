import { useRef, useMemo, useState, forwardRef, ChangeEvent } from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";

import { Input } from "@/components/shared/form/Input";

import { useDebounce } from "@/hooks/useDebounce";

import { UnstockProductType } from "@/@types/purchaseOrder/unstock";
import { CreditNoteLineType } from "@/@types/purchaseOrder/creditNote";

type Props = {
	id: string;
	error?: string;
	disabled?: boolean;
	orderLineId: string;
	value?: UnstockProductType;
	customValues?: CreditNoteLineType[];
	onValueChange: (value?: CreditNoteLineType) => void;
};

type Ref = HTMLDivElement;

export const UnstockProductSelect = forwardRef<Ref, Props>(
	({ id, error, value, disabled, orderLineId, customValues, onValueChange }, forwardedRef) => {
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

		const selectOption = (option: CreditNoteLineType) => {
			if (option.orderLineId !== value?.orderLineId) {
				onValueChange(option);
			}
		};

		const isOptionSelected = (option: CreditNoteLineType) => {
			return option.orderLineId === value?.orderLineId;
		};

		const filteredValues = useMemo(() => {
			if (customValues) {
				return customValues.filter(
					(item) =>
						item.product.name !== null && item.product.name.toLowerCase().includes(searchValue.toLowerCase()),
				);
			}

			return [];
		}, [customValues, searchValue]);

		const orderLineQuantity =
			customValues && orderLineId
				? +(customValues.find((line) => line.orderLineId === orderLineId)?.quantity || 0)
				: 0;

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
						`}
					>
						<span>{value ? `${value.product.name} - (max ${orderLineQuantity ?? 0})` : <>&#8203;</>}</span>
						<span
							className={`customTableSelect__placeholder ${value ? "customTableSelect__placeholder--active" : ""}`}
						>
							Select
						</span>
						<div
							className={`
								customTableSelect__icon
								${isOpen ? "customTableSelect__icon--open" : ""}
							`}
						>
							<svg width="24" height="24" focusable="false">
								<use xlinkHref="/icons/icons.svg#arrowDown" />
							</svg>
						</div>
						{hasError && (
							<p role="alert" className="tableSelect__error">
								{error}
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
									{option.product.name} - (max {option.quantity})
								</button>
							))}
						</div>
					</PopoverPrimitive.Content>
				</PopoverPrimitive.Portal>
			</PopoverPrimitive.Root>
		);
	},
);
