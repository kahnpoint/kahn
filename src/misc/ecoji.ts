import type { BytesCoder } from '@scure/base'
import { utils as baseUtils } from '@scure/base'
import { emojis } from './ecojiEmojis'

// emojis
export const ecoji: BytesCoder = /* @__PURE__ */ baseUtils.chain(
	baseUtils.radix2(10),
	baseUtils.alphabet(emojis),
	baseUtils.join('')
)
