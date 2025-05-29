import { ChangeEvent, ReactNode, forwardRef, useMemo, useState } from "react";
import * as SelectPrimitive from "@radix-ui/react-select";

import { Spinner } from "./Spinner";
import { Input } from "./form/Input";

import { useDebounce } from "@/hooks/useDebounce";

interface FormSelectProps extends SelectPrimitive.SelectProps {
	id: string;
	children?: ReactNode;
	error?: string;
	zIndex?: number;
	isLoading?: boolean;
	useSearch?: boolean;
	placeholder?: string;
	usePortal1?: boolean;
	useTriggetWidth?: boolean;
	customValues?: { id?: string; name: string }[];
}

type FormSelectRef = HTMLButtonElement;

export const CustomTableSelect3 = forwardRef<FormSelectRef, FormSelectProps>(
	(
		{
			id,
			error,
			children,
			isLoading,
			useSearch,
			placeholder,
			customValues,
			usePortal1 = false,
			useTriggetWidth = true,
			...props
		},
		forwardedRef,
	) => {
		const hasError = !!error;

		const [search, setSearch] = useState("");
		const searchValue = useDebounce<string>(search, 700);

		const handleChangeSearch = (event: ChangeEvent<HTMLInputElement>) => {
			setSearch(event.target.value);
		};

		const filteredValues = useMemo(() => {
			if (customValues) {
				return customValues
					.filter((item) => item.name !== null && item.name.includes(searchValue))
					.slice(0, 30);
			}

			return [];
		}, [customValues, searchValue]);

		return (
			<SelectPrimitive.Root {...props}>
				<div className="customTableSelect__wrapper">
					<SelectPrimitive.Trigger
						id={id}
						ref={forwardedRef}
						disabled={props.disabled}
						className={`
							customTableSelect__trigger
							${hasError ? "customTableSelect__trigger--error" : ""}
							${isLoading ? "customTableSelect__trigger--loading" : ""}
						`}
					>
						{customValues ? (
							<SelectPrimitive.Value placeholder="&#8203;">
								{props.value ? (
									Object.fromEntries(filteredValues.map(({ id, name }) => [id, name]))[props.value]
								) : (
									<>&#8203;</>
								)}
							</SelectPrimitive.Value>
						) : (
							<SelectPrimitive.Value placeholder="&#8203;" />
						)}
						<span
							className={`customTableSelect__placeholder ${props.value ? "customTableSelect__placeholder--active" : ""}`}
						>
							{placeholder}
						</span>
						<SelectPrimitive.Icon className="customTableSelect__icon">
							{isLoading ? (
								<Spinner />
							) : (
								<svg width="24" height="24" focusable="false">
									<use xlinkHref="/icons/icons.svg#arrowDown" />
								</svg>
							)}
						</SelectPrimitive.Icon>
					</SelectPrimitive.Trigger>
					{hasError && (
						<p role="alert" className="customTableSelect__error">
							{error}
						</p>
					)}
				</div>
				<SelectPrimitive.Portal
					container={document.body.querySelector(usePortal1 ? "#portal" : "#portal2") as HTMLDivElement}
				>
					<SelectPrimitive.Content
						position="popper"
						style={{ zIndex: props.zIndex }}
						className={`formSelect__content ${useTriggetWidth ? "formSelect__content--triggerWidth" : ""}`}
					>
						{useSearch && (
							<div className="customTableSelect__header">
								<form className="customTableSelect__form" onSubmit={() => {}}>
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
									<button type="submit" aria-label="Search" className="search__submit search__submit--small">
										<svg width="24" height="24" focusable="false" aria-hidden="true" className="search__icon">
											<use xlinkHref="/icons/icons.svg#search" />
										</svg>
									</button>
								</form>
							</div>
						)}
						<SelectPrimitive.Viewport className="customTableSelect__items">
							{useSearch ? (
								<>
									{filteredValues.map((item) => (
										<SelectItem key={item.id || item.name} value={item.id || item.name}>
											{item.name}
										</SelectItem>
									))}
								</>
							) : (
								children
							)}
						</SelectPrimitive.Viewport>
					</SelectPrimitive.Content>
				</SelectPrimitive.Portal>
			</SelectPrimitive.Root>
		);
	},
);

interface SelectItemProps extends SelectPrimitive.SelectItemProps {
	children: ReactNode;
}

type SelectItemRef = HTMLDivElement;

export const SelectItem = forwardRef<SelectItemRef, SelectItemProps>(
	({ children, ...props }, forwardedRef) => {
		return (
			<SelectPrimitive.Item {...props} ref={forwardedRef} className="customTableSelect__item">
				<SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
			</SelectPrimitive.Item>
		);
	},
);
