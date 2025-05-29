import { ChangeEvent, FC, FormEvent } from "react";

import { Input } from "@/components/shared/form/Input";

type SearchProps = {
	id: string;
	name: string;
	value: string;
	label: string;
	className?: string;
	onChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

export const Search: FC<SearchProps> = ({ id, name, value, label, className, onChange }) => {
	const handleSubmitForm = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
	};

	return (
		<search className={`search ${className ? className : ""}`}>
			<form className="search__form" onSubmit={handleSubmitForm}>
				<Input id={id} type="text" name={name} value={value} label={label} onChange={onChange} />
				<button type="submit" aria-label="Search" className="search__submit">
					<svg width="24" height="24" focusable="false" aria-hidden="true" className="search__icon">
						<use xlinkHref="/icons/icons.svg#search" />
					</svg>
				</button>
			</form>
		</search>
	);
};
