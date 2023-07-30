import Button from "./button";

import type { ComponentProps, ReactElement } from "react";

export default function ButtonGroup({
	children,
}: {
	children: ReactElement<ButtonProps>[] | ReactElement<ButtonProps>;
}) {
	return (
		<div className="flex min-h-[5rem] w-full items-center justify-center px-0 py-3">
			{children}
		</div>
	);
}

export { Button };

type ButtonProps = ComponentProps<typeof Button>;
