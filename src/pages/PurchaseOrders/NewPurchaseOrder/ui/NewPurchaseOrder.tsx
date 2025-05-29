import { FC } from "react";
import { useNavigate } from "react-router";
import { useMutationState } from "@tanstack/react-query";

import { Button } from "@/components/shared/Button";

import {
	CommonPage,
	CommonPageTitle,
	CommonPageHeader,
	CommonPageActions,
	CommonPageStatus,
	CommonPageSubWrapper,
} from "@/components/widgets/Page";
import { OrderForm } from "@/components/widgets/Purchases";

const NewPurchaseOrder: FC = () => {
	const navigate = useNavigate();

	const createStatus = useMutationState({
		filters: { mutationKey: ["create-purchase-order"] },
		select: (mutation) => mutation.state.status,
	});

	const isPending = createStatus.includes("pending");

	return (
		<div className="main__sections">
			<CommonPage>
				<div className="main__container">
					<CommonPageHeader>
						<CommonPageSubWrapper>
							<CommonPageStatus isYellow>Draft</CommonPageStatus>
							<CommonPageTitle>New Purchase</CommonPageTitle>
						</CommonPageSubWrapper>
						<CommonPageActions>
							<Button type="button" isSecondary onClick={() => navigate(-1)}>
								<svg width="18" height="18" focusable="false" aria-hidden="true">
									<use xlinkHref="/icons/icons.svg#list" />
								</svg>
								Back to List
							</Button>
							<Button type="submit" form="newPurchaseOrderForm" isLoading={isPending} disabled={isPending}>
								<svg width="18" height="18" focusable="false" aria-hidden="true">
									<use xlinkHref="/icons/icons.svg#plus" />
								</svg>
								Create
							</Button>
						</CommonPageActions>
					</CommonPageHeader>
					<OrderForm />
				</div>
			</CommonPage>
		</div>
	);
};

export default NewPurchaseOrder;
