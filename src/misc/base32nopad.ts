import type { BytesCoder } from '@scure/base'
import { utils as baseUtils } from '@scure/base'

// base32 strings (nopad)
export const base32nopad: BytesCoder = /* @__PURE__ */ baseUtils.chain(
	baseUtils.radix2(5),
	baseUtils.alphabet('abcdefghijklmnopqrstuvwxyz234567'),
	baseUtils.join('')
)
