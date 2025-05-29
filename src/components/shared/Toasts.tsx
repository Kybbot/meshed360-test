import { FC } from "react";
import toast, { Toaster, resolveValue } from "react-hot-toast";

export const Toasts: FC = () => {
	return (
		<Toaster containerClassName="toasts">
			{(t) => (
				<div className={`toast toast--${t.type}`} data-state={`${t.visible ? "open" : "close"}`}>
					<div className="toast__content">
						<p className="toast__message">{resolveValue(t.message, t)}</p>
						{t.type !== "loading" && (
							<button
								type="button"
								aria-label="Close"
								className="toast__btn"
								onClick={() => toast.dismiss(t.id)}
							>
								<svg width="24" height="24" focusable="false" aria-hidden="true">
									<use xlinkHref="/icons/icons.svg#cancel" />
								</svg>
							</button>
						)}
					</div>
				</div>
			)}
		</Toaster>
	);
};
