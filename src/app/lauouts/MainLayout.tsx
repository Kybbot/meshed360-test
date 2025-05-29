import { FC, useEffect, useRef, useState } from "react";
import { useStore } from "zustand";
import { Outlet } from "react-router";
import { NuqsAdapter } from "nuqs/adapters/react-router/v7";

import { orgStore } from "../stores/orgStore";

import { Loader } from "@/components/shared/Loader";
import { Toasts } from "@/components/shared/Toasts";
import { ErrorMessage } from "@/components/shared/ErrorMessage";
import { Header, Footer, Navigation } from "@/components/widgets/Page";

import { useGetUserInfo } from "@/entities/user";

export const MainLayout: FC = () => {
	const { setOrgId } = useStore(orgStore);
	const { isLoading, isError, error, isSuccess, data } = useGetUserInfo();

	const ref = useRef<HTMLDivElement>(null);
	const [inView, setInView] = useState(true);

	useEffect(() => {
		if (isSuccess && data.data?.organisations?.length) {
			const storageData = localStorage.getItem("orgId");

			if (storageData) {
				setOrgId(storageData);
			} else {
				setOrgId(data.data.organisations[0].id);
				localStorage.setItem("orgId", data.data.organisations[0].id);
			}
		}
	}, [isSuccess, data, setOrgId]);

	useEffect(() => {
		if (isSuccess) {
			const element = ref.current;

			if (!element) return;

			const observer = new IntersectionObserver((entries) => {
				setInView(entries[0].isIntersecting);
			}, {});

			observer.observe(element);

			return () => {
				if (element) observer.unobserve(element);
			};
		}
	}, [ref, isSuccess]);

	useEffect(() => {
		if (inView) {
			document.documentElement.style.setProperty("--toast-position", "absolute");
			document.documentElement.style.setProperty("--toast-inset", "61px 0 0 80px");
		} else {
			document.documentElement.style.setProperty("--toast-position", "fixed");
			document.documentElement.style.setProperty("--toast-inset", "0 0 0 80px");
		}
	}, [inView]);

	return (
		<main className="main">
			{isLoading ? (
				<Loader isFullWindow />
			) : isError && error ? (
				<div className="main__content main__content--error">
					<Header isError />
					<div className="main__error">
						<ErrorMessage error={error} />
					</div>
					<Footer />
				</div>
			) : isSuccess && (!data.data || !data.data.organisations || !data.data.organisations.length) ? (
				<div className="main__content main__content--error">
					<Header isError />
					<div className="main__error">
						<p className="errorMessage">Error with organisation data</p>
					</div>
					<Footer />
				</div>
			) : (
				<>
					<Navigation />
					<div className="main__content">
						<Header />
						<div className="main__trigger" ref={ref} />
						<Toasts />
						<div className="main__outlet">
							<NuqsAdapter>
								<Outlet />
							</NuqsAdapter>
						</div>
						<Footer />
					</div>
				</>
			)}
		</main>
	);
};
