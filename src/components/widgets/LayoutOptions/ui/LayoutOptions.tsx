import { FC } from "react";

import { Checkbox } from "@/components/shared/form/Checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/shared/Popover";

import { LayputOptionsData } from "@/@types/utility";

type LayoutOptionsProps = {
	data: LayputOptionsData;
	handleReset: () => void;
	handleToggle: (col: string) => void;
};

export const LayoutOptions: FC<LayoutOptionsProps> = ({ data, handleReset, handleToggle }) => {
	return (
		<Popover modal={false}>
			<PopoverTrigger asChild>
				<button type="button" className="layoutOptions__btn">
					<svg width="18" height="18" focusable="false" aria-hidden="true">
						<use xlinkHref="/icons/icons.svg#sliders" />
					</svg>
				</button>
			</PopoverTrigger>
			<PopoverContent>
				<div className="layoutOptions__main">
					{Object.values(data).map((item) => (
						<Checkbox
							id={item.key}
							key={item.key}
							label={item.name}
							checked={item.isShown}
							onChange={() => handleToggle(item.key)}
						/>
					))}
				</div>
				<button type="button" className="layoutOptions__reset" onClick={handleReset}>
					<svg width="16" height="16" focusable="false" aria-hidden="true">
						<use xlinkHref="/icons/icons.svg#reset" />
					</svg>
					Reset Layout
				</button>
			</PopoverContent>
		</Popover>
	);
};
