import path from "node:path";

export const testFileSuffixes = ["test", "spec", "mock"];

export function testFilePatterns({
	root = "",
	extensions = "?(m|c)[tj]s?(x)",
} = {}) {
	return [
		`*.{${testFileSuffixes.join(",")}}`,
		"__{test,tests,mocks,fixtures}__/**/*",
		"__{test,mock,fixture}-*__/**/*",
	].map((pattern) => path.join(root, `**/${pattern}.${extensions}`));
}
