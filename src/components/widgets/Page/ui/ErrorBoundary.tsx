import { Component, ErrorInfo, ReactNode } from "react";
import * as Sentry from "@sentry/react";

import { Header } from "./Header";
import { Footer } from "./Footer";

import { Button } from "@/components/shared/Button";

interface ErrorBoundaryProps {
	children: ReactNode;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps> {
	state = { hasError: false };

	static getDerivedStateFromError() {
		return { hasError: true };
	}

	componentDidCatch(error: Error, info: ErrorInfo) {
		Sentry.captureReactException(error, info);
	}

	render() {
		if (this.state.hasError) {
			return (
				<div className="main__content main__content--error">
					<Header isError />
					<div className="main__error">
						<p style={{ margin: "0 0 20px 0" }}>An error has occurred, please refresh the page!</p>
						<Button type="button" onClick={() => window.location.reload()}>
							Refresh page
						</Button>
					</div>
					<Footer />
				</div>
			);
		}

		return this.props.children;
	}
}
