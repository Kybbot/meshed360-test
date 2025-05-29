import { useRef, useMemo, useState, forwardRef, useCallback, KeyboardEvent } from "react";

import { useClickOutside } from "@/hooks/useClickOutside";
import { useCustomSelectStyles } from "@/hooks/useCustomSelectStyles";

import { FulfilmentType } from "@/@types/salesOrders/api.ts";

type Props = {
	fulfilments: FulfilmentType[];
	disabled?: boolean;
	onValueChange: (value: FulfilmentType) => void;
};

type Ref = HTMLDivElement;

export const FulfilmentsSelect = forwardRef<Ref, Props>(
	({ fulfilments, disabled, onValueChange }, forwardedRef) => {
		const buttonRef = useRef<HTMLButtonElement>(null);

		const [isOpen, setIsOpen] = useState(false);

		const { contentRef, containerRef } = useCustomSelectStyles(isOpen);

		const handleOpen = () => {
			setIsOpen((prev) => !prev);
		};

		const onClickOutside = useCallback(() => {
			setIsOpen(false);
		}, []);

		useClickOutside(containerRef, onClickOutside);

		const filteredValues = useMemo(() => {
			if (fulfilments) {
				return fulfilments.filter((item) => item.picking?.status === "AUTHORIZED");
			}

			return [];
		}, [fulfilments]);

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

		if (!filteredValues.length) return null;

		return (
			<div
				className="customSelect__wrapper fulfilmentSelect"
				ref={forwardedRef}
				style={{ minWidth: "226px" }}
			>
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
						<span className={`customSelect__placeholder`}>Copy From Fulfilment</span>
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
						<div className="customSelect__items">
							{filteredValues.map((option, index) => (
								<button
									type="button"
									onClick={(e) => {
										e.stopPropagation();
										onValueChange(option);
										handleOpen();
									}}
									key={option.id}
									className={`customSelect__item`}
								>
									Fulfilment #{index + 1}
								</button>
							))}
						</div>
					</div>
				</div>
			</div>
		);
	},
);
