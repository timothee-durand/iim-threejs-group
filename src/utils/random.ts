export function random(min: number, max: number) {
	return Math.random() * (max - min) + min
}

export function randomInArray<T>(array: T[]): T {
	return array[Math.floor(Math.random() * array.length)]
}