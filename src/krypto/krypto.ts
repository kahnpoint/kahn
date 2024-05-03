import { chacha20poly1305 } from "@noble/ciphers/chacha";
import {
  ed25519 as ed,
  edwardsToMontgomeryPriv,
  edwardsToMontgomeryPub,
  x25519 as xd,
} from "@noble/curves/ed25519";

import { managedNonce } from "@noble/ciphers/webcrypto";
const chacha = managedNonce(chacha20poly1305);

import { hkdf } from "@noble/hashes/hkdf";
import { sha256 } from "@noble/hashes/sha256";

import * as crc32 from "crc-32";
const crc = crc32.buf;

function sharedSecret(edPriv: Uint8Array, edPub: Uint8Array) {
  return xd.getSharedSecret(
    edwardsToMontgomeryPriv(edPriv),
    edwardsToMontgomeryPub(edPub),
  );
}

// sha256 hmac key derivation function
function shakdf(initialKey: Uint8Array, salt: Uint8Array) {
  return hkdf(sha256, initialKey, undefined, salt, 32);
}

export {
  chacha,
  crc,
  ed,
  hkdf,
  sha256,
  shakdf,
  sharedSecret,
  xd,
  edwardsToMontgomeryPriv,
  edwardsToMontgomeryPub,
};
