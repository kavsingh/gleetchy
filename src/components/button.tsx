import { memo } from "react";

import { tcx } from "~/lib/css";

import type { DetailedHTMLProps, HTMLAttributes } from "react";

export default memo(function Button({
	children,
	className,
	variant = "braced",
	...props
}: Props) {
	const isBraced = variant === "braced";

	return (
		<button
			{...props}
			className={tcx(
				"block appearance-none transition-colors hover:text-text600 focus-visible:text-text600 active:text-text600 disabled:cursor-default disabled:text-text100",
				{ ["text-xs"]: isBraced },
				className,
			)}
		>
			{isBraced ? <>[ {children} ]</> : children}
		</button>
	);
});

type Props = DetailedHTMLProps<
	HTMLAttributes<HTMLButtonElement>,
	HTMLButtonElement
> & { variant?: Variant };

export type Variant = "braced" | "text";
