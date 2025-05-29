import { ReactNode } from "react";

export interface TableColumnData {
	key: string;
	label: string | React.ReactNode;
	renderHeader: (item: TableColumnData, index: number) => ReactNode;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	renderItem: (item: any, column: TableColumnData, rowIndex?: number) => ReactNode;
}

export type LayputOptionsData = Record<string, { key: string; name: string; isShown: boolean }>;

export type DeepKeys<T> = T extends object ? { [K in keyof T]: K | DeepKeys<T[K]> }[keyof T] : never;
