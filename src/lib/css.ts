import { twMerge } from "tailwind-merge";
import classNames from "classnames";

// tailwind-merge around classname api
export function tcx(...args: Parameters<typeof classNames>) {
	return twMerge(classNames(...args));
}
