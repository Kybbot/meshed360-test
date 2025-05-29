import { Dispatch, forwardRef, SetStateAction } from "react";
import { DayPicker } from "react-day-picker";

import { Popover, PopoverContent, PopoverTrigger } from "../Popover";

import { getFormDayPickerDate } from "@/utils/date";

type Props = {
	value?: Date;
	error?: string;
	disabled?: boolean;
	placeholder: string;
	btnWrapperClassName?: string;
	onValueChange: Dispatch<SetStateAction<Date | undefined | null>>;
};

type Ref = HTMLButtonElement;

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const TableDayPickerRhf = forwardRef<Ref, Props>(
	({ value, error, disabled, placeholder, btnWrapperClassName, onValueChange }, forwardedRef) => {
		const hasError = !!error;

		return (
			<Popover>
				<PopoverTrigger asChild>
					<button
						type="button"
						ref={forwardedRef}
						disabled={disabled}
						className={`
							tableDayPicker
							${hasError ? "tableDayPicker--error" : ""}
							${btnWrapperClassName ? btnWrapperClassName : ""}
						`}
					>
						<div className="tableDayPicker__wrapper">
							<span
								className={`tableDayPicker__placeholder ${value ? "tableDayPicker__placeholder--active" : ""}`}
							>
								{placeholder}
							</span>
							<span className="tableDayPicker__value">{getFormDayPickerDate(value)}&#8203;</span>
							<span className="tableDayPicker__svg">
								<svg width="16" height="16" focusable="false" aria-hidden="true">
									<use xlinkHref="/icons/icons.svg#calendar" />
								</svg>
							</span>
						</div>
						{hasError && (
							<p role="alert" className="tableDayPicker__error">
								{error}
							</p>
						)}
					</button>
				</PopoverTrigger>
				<PopoverContent customClassName="tableDayPicker__popover">
					<DayPicker
						classNames={{ root: "tableDayPicker__dayPicker" }}
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
						selected={value}
						onSelect={(date) => {
							onValueChange(date ?? null);
						}}
					/>
				</PopoverContent>
			</Popover>
		);
	},
);
