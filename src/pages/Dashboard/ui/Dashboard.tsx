import { FC } from "react";
import { useStore } from "zustand";
import { useQueryClient } from "@tanstack/react-query";

import { useGetDashboardData } from "./api";

import { Loader } from "@/components/shared/Loader";
import { ErrorMessage } from "@/components/shared/ErrorMessage";

import { orgStore } from "@/app/stores/orgStore";

import { getFormDayPickerDate } from "@/utils/date";
import { formatNumberToCurrency } from "@/utils/formatNumberToCurrency";

import { ApiResult } from "@/@types/api";
import { GetUserInfoResponseType } from "@/@types/user";

const Dashboard: FC = () => {
	const queryClient = useQueryClient();
	const { orgId } = useStore(orgStore);

	const userInfo = queryClient.getQueryData<ApiResult<GetUserInfoResponseType>>(["user-info"]);

	const { data, error, isError, isLoading, isSuccess } = useGetDashboardData({ organisationId: orgId });

	return (
		<section className="dashboard">
			<div className="main__container">
				<div className="dashboard__header">
					<h1 className="dashboard__title">
						{userInfo?.data.user.name ? `Welcome, ${userInfo?.data.user.name}` : "Welcome"}
					</h1>
				</div>
				{isLoading ? (
					<Loader />
				) : isError && error ? (
					<ErrorMessage error={error} />
				) : isSuccess && data.data ? (
					<>
						<div className="dashboard__statistics">
							<div className="dashboardStatistic">
								<div className="dashboardStatistic__left">
									<p className="dashboardStatistic__number">
										{formatNumberToCurrency(data.data.grossProfit)}
									</p>
									<h2 className="dashboardStatistic__title">Gross Profit</h2>
									{/* <p className="dashboardStatistic__percentages dashboardStatistic__percentages--green">
								22.45%
								<svg
									width="24"
									height="24"
									focusable="false"
									aria-hidden="true"
									className="dashboardStatistic__arrow"
								>
									<use xlinkHref="/icons/icons.svg#arrowDown" />
								</svg>
							</p> */}
								</div>
								<svg width="56" height="56" focusable="false" aria-hidden="true">
									<use xlinkHref="/icons/icons.svg#statistic" />
								</svg>
							</div>
							<div className="dashboardStatistic">
								<div className="dashboardStatistic__left">
									<p className="dashboardStatistic__number">{data.data.salesOrders}</p>
									<h2 className="dashboardStatistic__title">Sales Orders</h2>
									{/* <p className="dashboardStatistic__percentages dashboardStatistic__percentages--green">
								15.34%
								<svg
									width="24"
									height="24"
									focusable="false"
									aria-hidden="true"
									className="dashboardStatistic__arrow"
								>
									<use xlinkHref="/icons/icons.svg#arrowDown" />
								</svg>
							</p> */}
								</div>
								<svg width="56" height="56" focusable="false" aria-hidden="true">
									<use xlinkHref="/icons/icons.svg#statistic" />
								</svg>
							</div>
							<div className="dashboardStatistic">
								<div className="dashboardStatistic__left">
									<p className="dashboardStatistic__number">
										{formatNumberToCurrency(data.data.averageRevenuePerSale)}
									</p>
									<h2 className="dashboardStatistic__title">Average Revenue Per Sale</h2>
									{/* <p className="dashboardStatistic__percentages dashboardStatistic__percentages--red">
								18.25%
								<svg
									width="24"
									height="24"
									focusable="false"
									aria-hidden="true"
									className="dashboardStatistic__arrow"
								>
									<use xlinkHref="/icons/icons.svg#arrowDown" />
								</svg>
							</p> */}
								</div>
								<svg width="56" height="56" focusable="false" aria-hidden="true">
									<use xlinkHref="/icons/icons.svg#statistic" />
								</svg>
							</div>
							<div className="dashboardStatistic">
								<div className="dashboardStatistic__left">
									<p className="dashboardStatistic__number">{data.data.createdPurchaseOrderValue}</p>
									<h2 className="dashboardStatistic__title">Created PO Value</h2>
									{/* <p className="dashboardStatistic__percentages dashboardStatistic__percentages--red">
								10.24%
								<svg
									width="24"
									height="24"
									focusable="false"
									aria-hidden="true"
									className="dashboardStatistic__arrow"
								>
									<use xlinkHref="/icons/icons.svg#arrowDown" />
								</svg>
							</p> */}
								</div>
								<svg width="56" height="56" focusable="false" aria-hidden="true">
									<use xlinkHref="/icons/icons.svg#statistic" />
								</svg>
							</div>
						</div>
						<div className="dashboard__statistics dashboard__statistics--second">
							<div className="dashboardStatistic dashboardStatistic--single">
								<div className="dashboardStatistic__left">
									<h2 className="dashboardStatistic__title">Units Sold</h2>
									<p className="dashboardStatistic__number">{data.data.unitsSold}</p>
									{/* <p className="dashboardStatistic__percentages dashboardStatistic__percentages--green">
								22.45%
								<svg
									width="24"
									height="24"
									focusable="false"
									aria-hidden="true"
									className="dashboardStatistic__arrow"
								>
									<use xlinkHref="/icons/icons.svg#arrowDown" />
								</svg>
							</p> */}
								</div>
								<svg width="148" height="80" focusable="false" aria-hidden="true">
									<use xlinkHref="/icons/icons.svg#chart1" />
								</svg>
							</div>
							<div className="dashboardStatistic dashboardStatistic--single">
								<div className="dashboardStatistic__left">
									<h2 className="dashboardStatistic__title">Total Customers</h2>
									<p className="dashboardStatistic__number">{data.data.totalCustomers}</p>
									{/* <p className="dashboardStatistic__percentages dashboardStatistic__percentages--green">
								15.34%
								<svg
									width="24"
									height="24"
									focusable="false"
									aria-hidden="true"
									className="dashboardStatistic__arrow"
								>
									<use xlinkHref="/icons/icons.svg#arrowDown" />
								</svg>
							</p> */}
								</div>
								<svg width="148" height="80" focusable="false" aria-hidden="true">
									<use xlinkHref="/icons/icons.svg#chart2" />
								</svg>
							</div>
							<div className="dashboardStatistic dashboardStatistic--single">
								<div className="dashboardStatistic__left">
									<h2 className="dashboardStatistic__title">Assembly Costs</h2>
									<p className="dashboardStatistic__number">{data.data.assemblyCosts}</p>
									{/* <p className="dashboardStatistic__percentages dashboardStatistic__percentages--red">
								10.24%
								<svg
									width="24"
									height="24"
									focusable="false"
									aria-hidden="true"
									className="dashboardStatistic__arrow"
								>
									<use xlinkHref="/icons/icons.svg#arrowDown" />
								</svg>
							</p> */}
								</div>
								<svg width="148" height="80" focusable="false" aria-hidden="true">
									<use xlinkHref="/icons/icons.svg#chart3" />
								</svg>
							</div>
						</div>
						<div className="dashboard__data">
							<div className="dashboard__card">
								<h2 className="dashboard__subTitle">Recent Sales</h2>
								<div className="customTable customTable--simple">
									<div className="customTable__wrapper">
										<table className="table">
											<thead className="table__thead">
												<tr className="table__tr">
													<th className="table__th" style={{ width: "30%" }}>
														Name
													</th>
													<th className="table__th" style={{ width: "30%" }}>
														Date
													</th>
													<th className="table__th" style={{ width: "30%" }}>
														Amount
													</th>
													<th className="table__th" style={{ width: "10%" }}>
														Status
													</th>
												</tr>
											</thead>
											<tbody>
												{data.data.recentSales.map((item, index) => (
													<tr className="table__tr" key={index}>
														<td className="table__td">{item.name}</td>
														<td className="table__td">{getFormDayPickerDate(item.date)}</td>
														<td className="table__td">{item.amount}</td>
														<td className="table__td">
															<span
																className={`
																	table__status
																	${item.status === "PAID" ? "table__status--green" : "table__status--grey"}
																`}
															>
																{item.status.toLowerCase()}
															</span>
														</td>
													</tr>
												))}
											</tbody>
										</table>
									</div>
								</div>
							</div>
							<div className="dashboard__card">
								<h2 className="dashboard__subTitle">Product Group Ranked by Sales Revenue</h2>
								<div className="customTable customTable--simple">
									<div className="customTable__wrapper">
										<table className="table">
											<thead className="table__thead">
												<tr className="table__tr">
													<th className="table__th" style={{ width: "65%" }}>
														Name
													</th>
													<th className="table__th" style={{ width: "35%" }}>
														Revenue
													</th>
												</tr>
											</thead>
											<tbody>
												{data.data.productRevenueByBrand.map((item, index) => (
													<tr className="table__tr" key={index}>
														<td className="table__td">{item.name}</td>
														<td className="table__td">{formatNumberToCurrency(item.revenue)}</td>
													</tr>
												))}
											</tbody>
										</table>
									</div>
								</div>
							</div>
							{/* <div className="dashboardInfo">
						<h2 className="dashboardInfo__title">Revenue vs Targets</h2>
						<div className="dashboardInfo__percantagy">
							<svg width="112" height="112" viewBox="0 0 250 250" className="dashboardInfo__circle">
								<g>
									<circle r="112" cy="125" cx="125" strokeWidth="16" stroke="#608DFF" fill="transparent" />
									<circle
										r="112"
										cy="125"
										cx="125"
										strokeWidth="16"
										stroke="#FFFFFF"
										fill="transparent"
										strokeDasharray="704"
										className="dashboardInfo__line"
										style={{ "--dasharray": 75 } as CSSProperties}
									/>
								</g>
							</svg>
							<p className="dashboardInfo__number">75%</p>
						</div>
						<div className="dashboardInfo__list">
							<p className="dashboardInfo__text">
								Jan: <span className="dashboardInfo__text--bold">27%</span>
							</p>
							<p className="dashboardInfo__text">
								Feb: <span className="dashboardInfo__text--bold">23%</span>
							</p>
							<p className="dashboardInfo__text">
								Mar: <span className="dashboardInfo__text--bold">25%</span>
							</p>
						</div>
					</div> */}
						</div>
					</>
				) : (
					<p className="empty_list">No data available</p>
				)}
			</div>
		</section>
	);
};

export default Dashboard;
