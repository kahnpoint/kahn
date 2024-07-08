import type { Bytes } from './types'
import { hamming } from './hamming';

// find the closest match (hamming) in an array of Bytess
// if the hammings are equal, the match with the most similar prefix is returned
export function hammingNearestFarthest(
	target: Bytes,
	candidates: Bytes[]
): { nearest: Bytes; farthest: Bytes } {
	let minDistance = Infinity
	let maxDistance = -Infinity
	let closestMatch: Bytes | null = null
	let farthestMatch: Bytes | null = null

	for (const candidate of candidates) {
		const distance = hamming(target, candidate)

		if (distance < minDistance) {
			minDistance = distance
			closestMatch = candidate
		} else if (distance === minDistance) {
			// If the Hamming distances are equal, compare the prefixes
			for (let i = 0; i < target.length; i++) {
				if (target[i] !== candidate[i]) {
					if (
						target[i] < candidate[i] &&
						closestMatch &&
						target[i] < closestMatch[i]
					) {
						closestMatch = candidate
					}
					break
				}
			}
		}

		if (distance > maxDistance) {
			maxDistance = distance
			farthestMatch = candidate
		}
	}

	if (closestMatch === null || farthestMatch === null) {
		throw new Error('No match found')
	}

	return { nearest: closestMatch, farthest: farthestMatch }
}

// get just the nearest match
export function hammingNearest(target: Bytes, candidates: Bytes[]): Bytes {
	return hammingNearestFarthest(target, candidates).nearest
}

// get just the farthest match
export function hammingFarthest(target: Bytes, candidates: Bytes[]): Bytes {
	return hammingNearestFarthest(target, candidates).farthest
}
