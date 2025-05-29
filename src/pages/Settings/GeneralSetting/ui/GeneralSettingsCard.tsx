import { FC } from "react";
import { Link } from "react-router";

type GeneralSettingsCardProps = {
	iconName: string;
	title: string;
	links: {
		url: string;
		name: string;
		description: string;
	}[];
};

const GeneralSettingsCard: FC<GeneralSettingsCardProps> = ({ iconName, title, links }) => {
	return (
		<article className="generalSettings__card">
			<div className="generalSettings__header">
				<h2 className="generalSettings__title">
					<svg width="24" height="24" focusable="false" aria-hidden="true">
						<use xlinkHref={`/icons/icons.svg#${iconName}`} />
					</svg>
					{title}
				</h2>
			</div>
			<div className="generalSettings__content">
				{links.map((link) => (
					<Link key={link.url} to={link.url} className="generalSettings__link">
						<h3 className="generalSettings__subTitle">
							{link.name}{" "}
							<svg width="24" height="24" focusable="false" aria-hidden="true">
								<use xlinkHref="/icons/icons.svg#edit" />
							</svg>
						</h3>
						<p className="generalSettings__text">{link.description}</p>
					</Link>
				))}
			</div>
		</article>
	);
};

export default GeneralSettingsCard;
