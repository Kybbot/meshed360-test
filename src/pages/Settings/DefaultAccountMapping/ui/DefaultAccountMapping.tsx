import { FC, useState } from "react";
import { Link } from "react-router";

import { Button } from "@/components/shared/Button";

import {
	CommonPage,
	CommonPageActions,
	CommonPageHeader,
	CommonPageMain,
	CommonPageTitle,
} from "@/components/widgets/Page";

import { DAMForm } from "./components/DAMForm";
import { useMutationState } from "@tanstack/react-query";

const DefaultAccountMapping: FC = () => {
	const [isCancel, setIsCancel] = useState(false);

	const createCustomerStatus = useMutationState({
		filters: { mutationKey: ["update-default-account-mapping"] },
		select: (mutation) => mutation.state.status,
	});

	const isPending = createCustomerStatus.includes("pending");

	const handleCancel = () => {
		setIsCancel(!isCancel);
	};

	return (
		<CommonPage>
			<div className="main__container">
				<CommonPageHeader>
					<CommonPageTitle> Default Account Mapping</CommonPageTitle>
					<CommonPageActions>
						<Button isSecondary type="button" onClick={handleCancel}>
							<svg width="18" height="18" focusable="false" aria-hidden="true">
								<use xlinkHref="/icons/icons.svg#cancel" />
							</svg>
							Cancel
						</Button>
						<Button type="submit" form="DAMForm" isLoading={isPending} disabled={isPending}>
							<svg width="18" height="18" focusable="false" aria-hidden="true">
								<use xlinkHref="/icons/icons.svg#save" />
							</svg>
							Save
						</Button>
						<Link to="/settings/general-settings" className="link">
							Back to Settings
						</Link>
					</CommonPageActions>
				</CommonPageHeader>
				<CommonPageMain isSimple>
					<DAMForm isCancelClicked={isCancel} />
				</CommonPageMain>
			</div>
		</CommonPage>
	);
};

export default DefaultAccountMapping;
