import { FC, ReactNode } from "react";

import { usePageDetails } from "@/hooks/useAddPageDetails";

type Props = {
	id: string;
	name: string;
	children: ReactNode;
	heightValue: string;
	isOpenValue: boolean;
};

export const TemplatesDetails: FC<Props> = ({ id, name, children, isOpenValue, heightValue }) => {
	const [contentRef, isOpen, height, handleOpenClose] = usePageDetails(isOpenValue, heightValue);

	return (
		<div className="templatesDetails">
			<button
				type="button"
				id={`${id}-header`}
				aria-expanded={isOpen}
				onClick={handleOpenClose}
				aria-controls={`${id}-panel`}
				className="templatesDetails__btn"
			>
				<span className="templatesDetails__name">{name}</span>
				<div className={`templatesDetails__icon ${isOpen ? "templatesDetails__icon--open" : ""}`}>
					<svg width="24" height="24" focusable="false" aria-hidden="true">
						<use xlinkHref="/icons/icons.svg#arrowDown" />
					</svg>
				</div>
			</button>
			<div
				ref={contentRef}
				id={`${id}-panel`}
				aria-hidden={!isOpen}
				aria-labelledby={`${id}-header`}
				style={{ maxHeight: `${height}` }}
				className={`templatesDetails__content ${isOpen ? "templatesDetails__content--open" : "templatesDetails__content--close"}`}
			>
				<div className="templatesDetails__children">{children}</div>
			</div>
		</div>
	);
};
