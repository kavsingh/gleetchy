import type { PropsWithChildren } from "react";

export default function ErrorMessage({ children }: PropsWithChildren) {
	return (
		<div className="bg-semanticError p-4 text-sm text-text600 is-full">
			{children}
		</div>
	);
}
