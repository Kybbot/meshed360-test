import { FC } from "react";
import { DayPicker } from "react-day-picker";

import { Popover, PopoverContent, PopoverTrigger } from "./Popover";

import { getFormDayPickerDate } from "@/utils/date";

export type FormDayPickerProps = {
	date?: Date;
	label?: string;
	error?: string;
	btnWrapperClassName?: string;
	setDate: (e?: Date | null) => void;
};

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const CustomDayPicker: FC<FormDayPickerProps> = ({
	date,
	error,
	setDate,
	btnWrapperClassName,
	label,
}) => {
	const hasError = !!error;

	return (
		<Popover>
			<PopoverTrigger asChild>
				<button
					type="button"
					className={`
						customDayPicker
						${hasError ? "customDayPicker--error" : ""}
						${btnWrapperClassName ? btnWrapperClassName : ""}
					`}
				>
					<div className="customDayPicker__wrapper">
						<span
							className={`customDayPicker__placeholder ${date ? "customDayPicker__placeholder--active" : ""}`}
						>
							{label ?? "Date"}
						</span>
						<span className="customDayPicker__value">{getFormDayPickerDate(date)}&#8203;</span>
						<span className="customDayPicker__svg">
							<svg width="24" height="24" focusable="false" aria-hidden="true">
								<use xlinkHref="/icons/icons.svg#calendar" />
							</svg>
						</span>
					</div>
					{hasError && (
						<p role="alert" className="customDayPicker__error">
							{error}
						</p>
					)}
				</button>
			</PopoverTrigger>
			<PopoverContent customClassName="customDayPicker__popover">
				<DayPicker
					classNames={{ root: "customDayPicker__dayPicker" }}
					mode="single"
					formatters={{
						formatWeekdayName(weekday) {
							return daysOfWeek[weekday.getDay()];
						},
					}}
					components={{
						PreviousMonthButton(props) {
							return (
								<button type="button" {...props}>
									<svg width="24" height="24" focusable="false" aria-hidden="true">
										<use xlinkHref="/icons/icons.svg#arrowDown" />
									</svg>
								</button>
							);
						},
						NextMonthButton(props) {
							return (
								<button type="button" {...props}>
									<svg width="24" height="24" focusable="false" aria-hidden="true">
										<use xlinkHref="/icons/icons.svg#arrowDown" />
									</svg>
								</button>
							);
						},
					}}
					showOutsideDays
					selected={date}
					onSelect={(date) => {
						setDate(date ?? null);
					}}
				/>
			</PopoverContent>
		</Popover>
	);
};
