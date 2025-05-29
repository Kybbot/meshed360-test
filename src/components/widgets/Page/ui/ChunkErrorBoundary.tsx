import { Component, ReactNode } from "react";

import { Header } from "./Header";
import { Footer } from "./Footer";

import { Button } from "@/components/shared/Button";

interface ChunkErrorBoundaryProps {
	children: ReactNode;
}

export class ChunkErrorBoundary extends Component<ChunkErrorBoundaryProps> {
	state = { hasError: false };

	static getDerivedStateFromError(error: Error) {
		// Only show refresh for chunk load errors
		if (
			error.name === "ChunkLoadError" ||
			error.message.includes("error loading dynamically imported module") ||
			error.message.includes("Failed to fetch dynamically imported module")
		) {
			return { hasError: true };
		}
		return { hasError: false };
	}

	render() {
		if (this.state.hasError) {
			return (
				<div className="main__content main__content--error">
					<Header isError />
					<div className="main__error">
						<p style={{ margin: "0 0 20px 0" }}>The site has been updated, please refresh the page!</p>
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
