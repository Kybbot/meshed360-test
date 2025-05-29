import { FC } from "react";

import { Loader } from "./Loader";

import { CommonPage, CommonPageWrapper } from "../widgets/Page";

export const PageLoader: FC = () => {
	return (
		<CommonPage>
			<div className="main__container">
				<CommonPageWrapper>
					<Loader isFullWidth />
				</CommonPageWrapper>
			</div>
		</CommonPage>
	);
};
