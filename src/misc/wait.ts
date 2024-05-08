// Pause for a given number of milliseconds
export async function wait(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms))
}
