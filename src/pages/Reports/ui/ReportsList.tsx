import { CommonPageWrapper } from "@/components/widgets/Page";
import { FC } from "react";
import NoReports from "./NoReports";
import ReportItem, { IReportItem } from "./ReportItem";

interface Props {
	data: IReportItem[] | null;
	name: string;
	isText?: boolean;
}

const ReportsList: FC<Props> = ({ data, name, isText }) => {
	return (
		<>
			{data ? (
				<CommonPageWrapper>
					{data.map((report) => (
						<ReportItem
							key={report.url}
							url={report.url}
							title={report.title}
							content={report.content}
							isFavourite={report.isFavourite}
						/>
					))}
				</CommonPageWrapper>
			) : (
				<div className="reports__container">
					<NoReports name={name} isText={isText} />
				</div>
			)}
		</>
	);
};

export default ReportsList;
