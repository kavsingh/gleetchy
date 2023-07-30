import type { PropsWithChildren } from "react";

export default function ErrorMessage({ children }: PropsWithChildren) {
	return (
		<div className="w-full bg-semanticError p-4 text-sm text-text600">
			{children}
		</div>
	);
}
