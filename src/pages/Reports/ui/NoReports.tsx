import { FC } from "react";
import cup from "../assets/icons/cup.svg";

interface Props {
	name: string;
	isText?: boolean;
}

const NoReports: FC<Props> = ({ name, isText }) => {
	return (
		<div className="no-reports">
			<div className="no-reports__image">
				<img src={cup} alt="cup icon" />
			</div>
			<h2 className="no-reports__title">No {name} Yet</h2>
			{isText && (
				<p className="no-reports__text">
					You have no favourites yet. Click on the star on the report to save it to your favourites.
				</p>
			)}
		</div>
	);
};

export default NoReports;
