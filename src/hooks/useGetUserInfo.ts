import { useStore } from "zustand";
import { useQueryClient } from "@tanstack/react-query";

import { orgStore } from "@/app/stores/orgStore";

import { ApiResult } from "@/@types/api";
import { GetUserInfoResponseType } from "@/@types/user";

export const useGetUserAndOrgInfo = () => {
	const { orgId } = useStore(orgStore);

	const queryClient = useQueryClient();

	const userInfo = queryClient.getQueryData<ApiResult<GetUserInfoResponseType>>(["user-info"]);

	if (orgId && userInfo) {
		const currentOrg = userInfo.data.organisations.find((item) => item.id === orgId)!;

		const trackingCategoryA = currentOrg.trackingCategories?.[0];
		const trackingCategoryB = currentOrg.trackingCategories?.[1];
		const trackingCategoryAFiltered = trackingCategoryA
			? {
					...trackingCategoryA,
					categories: trackingCategoryA.categories.filter(({ status }) => status === "ACTIVE"),
				}
			: undefined;
		const trackingCategoryBFiltered = trackingCategoryB
			? {
					...trackingCategoryB,
					categories: trackingCategoryB.categories.filter(({ status }) => status === "ACTIVE"),
				}
			: undefined;

		return {
			trackingCategoryA,
			trackingCategoryB,
			trackingCategoryAFiltered,
			trackingCategoryBFiltered,
			orgId: currentOrg.id,
			user: userInfo.data.user,
			orgName: currentOrg.name,
			orgRoles: currentOrg.roles,
			marginThreshold: currentOrg.marginThreshold,
		};
	}

	return null;
};
