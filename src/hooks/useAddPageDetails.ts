import { useEffect, useRef, useState } from "react";

export const usePageDetails = (isOpenValue: boolean, heightValue: string) => {
	const isFirstRender = useRef(true);
	const content = useRef<HTMLDivElement>(null);

	const [isOpen, setIsClose] = useState(isOpenValue);
	const [height, setHeight] = useState(heightValue);

	const handlePanelButton = () => {
		setIsClose((prevState) => !prevState);
		setHeight(!isOpen && content.current ? `fit-content` : "0px");
	};

	useEffect(() => {
		if (isOpen && content.current && isFirstRender.current) {
			isFirstRender.current = false;
			setHeight(`fit-content`);
		}
	}, [isOpen, content, isFirstRender]);

	return [content, isOpen, height, handlePanelButton] as const;
};
