import { FC, useEffect, useState } from "react";
import { useStore } from "zustand";
import { Link, useNavigate } from "react-router";
import { useQueryClient } from "@tanstack/react-query";

import { XeroConnectionDialog } from "./components/XeroConnectionDialog";

import {
	DropdownMenu,
	DropdownMenuItem,
	DropdownMenuRoot,
	DropdownMenuTrigger,
} from "@/components/shared/DropdownMenu";
import { Loader } from "@/components/shared/Loader";
import { SimpleSelect, SelectItem } from "@/components/shared/SimpleSelect";

import { orgStore } from "@/app/stores/orgStore";
import { authStore } from "@/app/stores/authStore";

import { useGetOrganisationConnectionStatus } from "@/entities/organisations";

import { showError } from "@/utils/showError";

import { ApiResult } from "@/@types/api";
import { GetUserInfoResponseType } from "@/@types/user";

type Props = {
	isError?: boolean;
};

export const Header: FC<Props> = ({ isError = false }) => {
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	const { orgId, setOrgId } = useStore(orgStore);
	const setLoggedIn = useStore(authStore, (selector) => selector.setLoggedIn);

	const userInfo = queryClient.getQueryData<ApiResult<GetUserInfoResponseType>>(["user-info"]);

	const [xeroDialog, setXeroDialog] = useState(false);
	const [currentOrgId, setCurrentOrgId] = useState(() => {
		const storageData = localStorage.getItem("orgId");
		return storageData ? storageData : userInfo ? userInfo.data.organisations?.[0]?.id : "";
	});

	const {
		data: organisationConnectionStatusData,
		error: organisationConnectionStatusError,
		isError: isOrganisationConnectionStatusError,
		isLoading: isOrganisationConnectionStatusLoading,
		isSuccess: isOrganisationConnectionStatusSuccess,
	} = useGetOrganisationConnectionStatus({ organisationId: orgId, isError });

	const handleChangeCurrentOrgId = async (orgId: string) => {
		const pathname = location.pathname;
		let newPathname = pathname;

		const updateOrgId = (newUrl: string) => {
			history.replaceState(null, "", newUrl);
			localStorage.setItem("orgId", orgId);
			setCurrentOrgId(orgId);
			setOrgId(orgId);
		};

		const isEdit = pathname.includes("edit");
		const isNew = pathname.includes("new");

		if (isEdit || isNew) {
			const segment = isEdit ? "/edit" : "/new";

			newPathname = pathname
				.split(segment)[0]
				.replace(/stockTake|stockTransfer|stockAdjustment/g, "stockControl");

			await new Promise((resolve) => {
				navigate(newPathname);
				setTimeout(resolve, 100);
			});

			updateOrgId(newPathname);
			return;
		}

		updateOrgId(newPathname);
	};

	const handleXeroBtn = () => {
		setXeroDialog(true);
	};

	const handleLogout = () => {
		localStorage.clear();
		queryClient.clear();

		navigate("/");
		setLoggedIn(false);
	};

	useEffect(() => {
		if (isOrganisationConnectionStatusError && organisationConnectionStatusError) {
			showError(organisationConnectionStatusError);
		}
	}, [isOrganisationConnectionStatusError, organisationConnectionStatusError]);

	useEffect(() => {
		if (isOrganisationConnectionStatusSuccess && organisationConnectionStatusData.data) {
			if (!organisationConnectionStatusData.data.connectionStatus) {
				setXeroDialog(true);
			}
		}
	}, [isOrganisationConnectionStatusSuccess, organisationConnectionStatusData]);

	return (
		<header className="header">
			<div className="header__first">
				<Link className="header__title" to="/">
					Home
				</Link>
				{!isError && userInfo && !!userInfo.data.organisations.length && (
					<div className="header__select">
						<SimpleSelect
							name="organisation"
							id="organisationId"
							value={currentOrgId}
							onValueChange={handleChangeCurrentOrgId}
						>
							{userInfo.data.organisations.map((organisation) => (
								<SelectItem key={organisation.id} value={organisation.id}>
									{organisation.name}
								</SelectItem>
							))}
						</SimpleSelect>
					</div>
				)}
				{!isError && (
					<>
						<button
							type="button"
							className="header__connect"
							onClick={handleXeroBtn}
							disabled={
								isOrganisationConnectionStatusLoading ||
								(isOrganisationConnectionStatusSuccess &&
									organisationConnectionStatusData.data.connectionStatus)
							}
						>
							<img width={24} height={24} alt="Xero" src="/imgs/xero.png" srcSet="/imgs/xero@2x.png" />
							{isOrganisationConnectionStatusLoading ? (
								<Loader isSmall />
							) : isOrganisationConnectionStatusError ? (
								<span className="header__connection">Connection error</span>
							) : (
								isOrganisationConnectionStatusSuccess &&
								organisationConnectionStatusData && (
									<span className="header__connection">
										{organisationConnectionStatusData.data.connectionStatus
											? `Connected to ${organisationConnectionStatusData.data.organisationName}`
											: "Not Connected"}
									</span>
								)
							)}
						</button>
						{isOrganisationConnectionStatusSuccess && xeroDialog && (
							<XeroConnectionDialog
								orgId={orgId}
								dialogState={xeroDialog}
								setDialogState={setXeroDialog}
								data={organisationConnectionStatusData.data}
							/>
						)}
					</>
				)}
			</div>
			<div className="header__second">
				<a
					target="_blank"
					aria-label="Help"
					rel="noreferrer noopener"
					className="header__help"
					href="https://wkf.ms/45XHT2W"
				>
					<svg width="24" height="24" focusable="false" aria-hidden="true">
						<use xlinkHref="/icons/icons.svg#help" />
					</svg>
				</a>
				<DropdownMenuRoot modal={false}>
					<DropdownMenuTrigger asChild>
						<button type="button" className="header__account" aria-label="User settings">
							<img
								alt=""
								width={24}
								height={24}
								aria-hidden="true"
								src="/imgs/avatar.png"
								srcSet="/imgs/avatar@2x.png 2x"
							/>
						</button>
					</DropdownMenuTrigger>
					<DropdownMenu className="dropDown__content" sideOffset={10} align="end">
						<DropdownMenuItem className="dropDown__item" onClick={handleLogout}>
							Logout
						</DropdownMenuItem>
					</DropdownMenu>
				</DropdownMenuRoot>
			</div>
		</header>
	);
};
