import { FC } from "react";
import { BrowserRouter } from "react-router";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { ErrorBoundary } from "./components/widgets/Page";

import { CustomRoutes } from "./app/routes/CustomRoutes";

import { queryClientConfig } from "./app/configs/queryClientConfig";

const queryClient = new QueryClient(queryClientConfig);

const App: FC = () => {
	return (
		<BrowserRouter>
			<QueryClientProvider client={queryClient}>
				<ErrorBoundary>
					<CustomRoutes />
				</ErrorBoundary>
				<ReactQueryDevtools initialIsOpen={false} />
			</QueryClientProvider>
		</BrowserRouter>
	);
};

export default App;
