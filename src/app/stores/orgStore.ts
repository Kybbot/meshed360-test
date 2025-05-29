import { createStore } from "zustand/vanilla";

type OrgStoreType = {
	orgId?: string;
	setOrgId: (value: string) => void;
};

export const orgStore = createStore<OrgStoreType>((set) => ({
	orgId: undefined,
	setOrgId: (value) => set(() => ({ orgId: value })),
}));
