import Button from "./button";

import type { ComponentProps, ReactElement } from "react";

export default function ButtonGroup({
	children,
}: {
	children: ReactElement<ButtonProps>[] | ReactElement<ButtonProps>;
}) {
	return (
		<div className="flex items-center justify-center min-bs-[5rem] is-full plb-3 pli-0">
			{children}
		</div>
	);
}

export { Button };

type ButtonProps = ComponentProps<typeof Button>;
