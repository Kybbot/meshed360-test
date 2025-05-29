import { FC } from "react";

// import start from "../assets/icons/star.svg";
// import favStar from "../assets/icons/favStar.svg";
import arrow from "../assets/icons/arrow.svg";

import { Link } from "react-router";

export interface IReportItem {
	url: string;
	title: string;
	content: string;
	isFavourite?: boolean;
}

const ReportItem: FC<IReportItem> = ({ url, title, content /* , isFavourite */ }) => {
	// const favIcon = isFavourite ? favStar : start;

	return (
		<div className="report-item">
			{/* <div className="report-item__icon">
				<img
					style={{ display: "inline-block", width: "28px", cursor: "pointer" }}
					src={favIcon}
					alt="favourite"
				/>
			</div> */}
			<Link to={url} className="report-item__link">
				<div className="report-item__content">
					<h3 className="report-item__title">{title}</h3>
					<p className="report-item__text">{content}</p>
				</div>
				<p>
					<img src={arrow} alt="next" />
				</p>
			</Link>
		</div>
	);
};

export default ReportItem;
