import { Dispatch, FC, SetStateAction, useState } from "react";
import toast from "react-hot-toast";
import { AxiosError, isAxiosError } from "axios";
import { useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/shared/Button";
import { ErrorMessage } from "@/components/shared/ErrorMessage";
import { FormSelect, SelectItem } from "@/components/shared/form/FormSelect";
import { DialogClose, DialogContent, DialogRoot, DialogTitle } from "@/components/shared/Dialog";

import { axiosInstance } from "@/utils/axios";

import { ApiError, ApiResult } from "@/@types/api";
import { GetOrganisationConnectionStatusResponseType } from "@/@types/organisations";

type DeleteDialogProps = {
	orgId?: string;
	dialogState: boolean;
	data: GetOrganisationConnectionStatusResponseType;
	setDialogState: Dispatch<SetStateAction<boolean>>;
};

export const XeroConnectionDialog: FC<DeleteDialogProps> = ({ data, orgId, dialogState, setDialogState }) => {
	const queryClient = useQueryClient();

	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<AxiosError<ApiError, unknown> | null>(null);

	const [currentAccountId, setCurrentAccountId] = useState(() => {
		if (data.xeroOrganisations.length > 0 && data.organisationName) {
			const selectedAccount = data.xeroOrganisations.find((item) => item.name === data.organisationName);
			return selectedAccount ? selectedAccount.id : "";
		} else {
			return "";
		}
	});

	const handleSelectAccount = (value: string) => {
		setCurrentAccountId(value);
	};

	const handleCloseModal = () => {
		setDialogState(false);
	};

	const handleOnSubmit = async () => {
		if (orgId) {
			try {
				setLoading(true);
				setError(null);

				const { data } = await axiosInstance.get<ApiResult<string>>(
					`/api/integrations/sync-to-xero?organisationID=${orgId}`,
				);

				if (data.data) {
					window.location.replace(data.data);
				}
			} catch (error) {
				if (isAxiosError(error)) {
					setError(error);
				}
			} finally {
				setLoading(false);
			}
		}
	};

	const handleOnSave = async () => {
		if (orgId && currentAccountId) {
			try {
				setLoading(true);
				setError(null);

				await axiosInstance.post<ApiResult<unknown>>(
					`/api/integrations/xero-org?organisationId=${orgId}&xeroOrganisationId=${currentAccountId}`,
				);

				setDialogState(false);
				toast.success("Xero organisarion was successfully saved!");
				await queryClient.invalidateQueries({ queryKey: ["get-organisation-connection-status", orgId] });
			} catch (error) {
				if (isAxiosError(error)) {
					setError(error);
				}
			} finally {
				setLoading(false);
			}
		}
	};

	return (
		<DialogRoot open={dialogState} onOpenChange={setDialogState}>
			<DialogContent size="small" onInteractOutside={handleCloseModal} onEscapeKeyDown={handleCloseModal}>
				<div className="infoDialog">
					<svg width="140" height="140" focusable="false" aria-hidden="true" className="infoDialog__svg">
						<use xlinkHref="/icons/illustrations.svg#info" />
					</svg>
					<DialogTitle asChild>
						<h3 className="infoDialog__title">Xero Connection</h3>
					</DialogTitle>
					{data.xeroOrganisations.length > 0 ? (
						<>
							<p className="infoDialog__text infoDialog__text--group">
								Please select your Xero organisation from the list!
							</p>
							<div className="infoDialog__select">
								<FormSelect
									usePortal1
									id="xeroSelect"
									value={currentAccountId}
									disabled={loading || !orgId}
									placeholder="Select organisation"
									onValueChange={handleSelectAccount}
									customValues={data.xeroOrganisations}
								>
									{data.xeroOrganisations.map((item) => (
										<SelectItem key={item.id} value={item.id}>
											{item.name}
										</SelectItem>
									))}
								</FormSelect>
							</div>
						</>
					) : (
						<p className="infoDialog__text">
							Please connect your Xero organisation for data synchronization!
						</p>
					)}
					<div className="infoDialog__btns">
						<DialogClose asChild>
							<Button type="button" isSecondary onClick={handleCloseModal}>
								<svg width="18" height="18" focusable="false" aria-hidden="true">
									<use xlinkHref="/icons/icons.svg#cancel" />
								</svg>
								Cancel
							</Button>
						</DialogClose>
						{data.xeroOrganisations.length > 0 ? (
							<Button type="button" isLoading={loading} onClick={handleOnSave} disabled={loading || !orgId}>
								<svg width="18" height="18" focusable="false" aria-hidden="true">
									<use xlinkHref="/icons/icons.svg#save" />
								</svg>
								Save
							</Button>
						) : (
							<Button type="button" isLoading={loading} onClick={handleOnSubmit} disabled={loading || !orgId}>
								<svg width="18" height="18" focusable="false" aria-hidden="true">
									<use xlinkHref="/icons/icons.svg#plus" />
								</svg>
								Connect
							</Button>
						)}
					</div>
					{error && <ErrorMessage error={error} useTopMargin />}
				</div>
			</DialogContent>
		</DialogRoot>
	);
};
