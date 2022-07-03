import path from "path";

import { PROJECT_ROOT } from "./constants";

export const resolveFromProjectRoot = path.resolve.bind(path, PROJECT_ROOT);
