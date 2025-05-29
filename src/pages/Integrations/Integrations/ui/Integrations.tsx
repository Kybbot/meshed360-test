import { FC } from "react";
import { useStore } from "zustand";
import { Link } from "react-router";

import { Loader } from "@/components/shared/Loader";
import { ErrorMessage } from "@/components/shared/ErrorMessage";

import { CommonPage, CommonPageHeader, CommonPageMain, CommonPageTitle } from "@/components/widgets/Page";

import { orgStore } from "@/app/stores/orgStore";

import { useGetOrganisationConnectionStatus } from "@/entities/organisations";

const Integrations: FC = () => {
	const { orgId } = useStore(orgStore);

	const {
		data: organisationConnectionStatusData,
		error: organisationConnectionStatusError,
		isError: isOrganisationConnectionStatusError,
		isLoading: isOrganisationConnectionStatusLoading,
		isSuccess: isOrganisationConnectionStatusSuccess,
	} = useGetOrganisationConnectionStatus({ organisationId: orgId, isError: false });

	return (
		<CommonPage>
			<div className="main__container">
				<CommonPageHeader>
					<CommonPageTitle>Integrations</CommonPageTitle>
				</CommonPageHeader>
				<CommonPageMain isSimple>
					{isOrganisationConnectionStatusLoading ? (
						<Loader isFullWidth />
					) : isOrganisationConnectionStatusError && organisationConnectionStatusError ? (
						<ErrorMessage error={organisationConnectionStatusError} />
					) : isOrganisationConnectionStatusSuccess ? (
						<div className="integrations__cards">
							<article className="integrationCard">
								<header className="integrationCard__header">
									<p
										className={`
											integrationCard__status
											${organisationConnectionStatusData.data.connectionStatus ? "integrationCard__status--active" : ""}
										`}
									>
										{organisationConnectionStatusData.data.connectionStatus ? "Active" : "Inactive"}
									</p>
								</header>
								<div className="integrationCard__picture">
									<img
										width={130}
										height={130}
										alt="Xero logo"
										src="/imgs/xeroApp.png"
										srcSet="/imgs/xeroApp@2x.png"
										className="integrationCard__img"
									/>
								</div>
								<h2 className="integrationCard__title">
									<Link to="/integrations/xero" className="integrationCard__link">
										Xero <span className="integrationCard__title--grey">| Accounting</span>
									</Link>
								</h2>
								<p className="integrationCard__text">
									Share access to your latest business numbers with your team
								</p>
							</article>
						</div>
					) : (
						<p className="empty_list">No data available</p>
					)}
				</CommonPageMain>
			</div>
		</CommonPage>
	);
};

export default Integrations;
