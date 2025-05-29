import { FC, ReactNode, MouseEvent, KeyboardEvent } from "react";

import { usePageDetails } from "@/hooks/useAddPageDetails";

import { TemplateTypes } from "@/@types/documentTemplates";

type Props = {
	name: string;
	id: TemplateTypes;
	children: ReactNode;
	heightValue: string;
	isOpenValue: boolean;
	handlePlusButton: (
		event: MouseEvent<HTMLDivElement> | KeyboardEvent<HTMLDivElement>,
		type: TemplateTypes,
	) => void;
};

export const TemplatesSubDetails: FC<Props> = ({
	id,
	name,
	children,
	isOpenValue,
	heightValue,
	handlePlusButton,
}) => {
	const [contentRef, isOpen, height, handleOpenClose] = usePageDetails(isOpenValue, heightValue);

	return (
		<div className="templatesSubDetails">
			<button
				type="button"
				id={`${id}-header`}
				aria-expanded={isOpen}
				onClick={handleOpenClose}
				aria-controls={`${id}-panel`}
				className="templatesSubDetails__btn"
			>
				<span className="templatesSubDetails__name">{name}</span>
				<div className="templatesSubDetails__wrapper">
					{isOpen && (
						<div
							tabIndex={0}
							role="button"
							className="templatesSubDetails__plus"
							onClick={(event) => handlePlusButton(event, id)}
							onKeyDown={(event) => {
								if (event.key === "Enter" || event.key === " ") {
									handlePlusButton(event, id);
								}
							}}
						>
							<svg width="24" height="24" focusable="false" aria-hidden="true">
								<use xlinkHref="/icons/icons.svg#plusInCircle" />
							</svg>
						</div>
					)}
					<div className={`templatesSubDetails__icon ${isOpen ? "templatesSubDetails__icon--open" : ""}`}>
						<svg width="24" height="24" focusable="false" aria-hidden="true">
							<use xlinkHref="/icons/icons.svg#arrowDown" />
						</svg>
					</div>
				</div>
			</button>
			<div
				ref={contentRef}
				id={`${id}-panel`}
				aria-hidden={!isOpen}
				aria-labelledby={`${id}-header`}
				style={{ maxHeight: `${height}` }}
				className={`templatesSubDetails__content ${isOpen ? "templatesSubDetails__content--open" : "templatesSubDetails__content--close"}`}
			>
				<div className="templatesSubDetails__children">{children}</div>
			</div>
		</div>
	);
};
