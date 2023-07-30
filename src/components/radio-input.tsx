import { forwardRef } from "react";
import { twMerge } from "tailwind-merge";

import type { InputHTMLAttributes, ReactNode } from "react";

export default forwardRef<HTMLInputElement, Props>(function RadioInput(
	{ label, ...inputProps },
	ref,
) {
	return (
		<label
			title={inputProps.title}
			htmlFor={inputProps.id}
			className="flex cursor-pointer items-center gap-[0.3em]"
		>
			<div className="leading-[1]">{label}</div>
			<div className="relative">
				<div
					className={twMerge(
						"pointer-events-none z-0 h-[0.8em] w-[0.8em] border border-text100",
						inputProps.checked && "border-text400 bg-text400",
					)}
				/>
				<input
					{...inputProps}
					ref={ref}
					type="radio"
					className="absolute inset-0 z-10 cursor-pointer opacity-0"
				/>
			</div>
		</label>
	);
});

type Props = Omit<
	InputHTMLAttributes<HTMLInputElement>,
	"className" | "type" | "hidden"
> & {
	label: ReactNode;
};
