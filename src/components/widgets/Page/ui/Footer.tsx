import { FC } from "react";

export const Footer: FC = () => {
	return (
		<footer className="footer">
			<button
				onClick={() => {
					throw new Error("This is your first error!");
				}}
			>
				Break the world
			</button>
			<img
				width={130}
				height={38}
				alt="Meshed360"
				className="footer__img"
				src="/imgs/footerLogo.png"
				srcSet="/imgs/footerLogo@2x.png 2x"
			/>
		</footer>
	);
};
