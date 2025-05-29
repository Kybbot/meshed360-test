import { FC } from "react";
import { Link } from "react-router";

type EmptyPage = {
	link: string;
	title: string;
	svgName: string;
	subTilte: string;
	buttonText: string;
	description: string;
};

export const EmptyPage: FC<EmptyPage> = ({ link, title, svgName, subTilte, buttonText, description }) => {
	return (
		<div className="emptyPage">
			<div className="emptyPage__header">
				<h1 className="emptyPage__title">{title}</h1>
			</div>
			<div className="emptyPage__main">
				<svg width="140" height="140" focusable="false" aria-hidden="true" className="emptyPage__svg">
					<use xlinkHref={`/icons/illustrations.svg#${svgName}`} />
				</svg>
				<h2 className="emptyPage__subTitle">{subTilte}</h2>
				<p className="emptyPage__description">{description}</p>
				<Link to={link} className="link">
					<svg width="18" height="18" focusable="false" aria-hidden="true">
						<use xlinkHref="/icons/icons.svg#plus" />
					</svg>
					{buttonText}
				</Link>
			</div>
		</div>
	);
};
