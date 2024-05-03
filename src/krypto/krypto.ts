import {
  ed25519 as ed,
  edwardsToMontgomeryPriv,
  edwardsToMontgomeryPub,
  x25519 as xd,
} from "@noble/curves/ed25519";
import * as bytes from "../bytes";
import { EncryptedBytes, DecryptedBytes } from "../bytes";
import {
  AnyKey,
  Checksum,
  Hash,
  KeyPair,
  PrivateKey,
  PublicKey,
  SharedKey,
  Signature,
} from "./types";

/**
 * Hash
 */
import { sha256 } from "@noble/hashes/sha256";
export const createHash = (data: Bytes): Hash => bytes.toBase58(sha256(data));
export function verifyHash(data: Bytes, hash: Hash): boolean {
  return hash === bytes.toBase58(sha256(data));
}

/**
 * HKDF
 */
import { hkdf as _hkdf } from "@noble/hashes/hkdf";
export function hkdf(initialKey: AnyKey, salt: Bytes): AnyKey {
  return bytes.toBase58(
    _hkdf(sha256, bytes.fromBase58(initialKey), undefined, salt, 32),
  );
}

/**
 * Chacha
 */
import { chacha20poly1305 } from "@noble/ciphers/chacha";
import { managedNonce } from "@noble/ciphers/webcrypto";
const chacha = managedNonce(chacha20poly1305);

export function encrypt(sharedKey: SharedKey, data: Bytes): EncryptedBytes {
  return chacha(bytes.fromBase58(sharedKey)).encrypt(data);
}

export function decrypt(sharedKey: SharedKey, data: Bytes): DecryptedBytes {
  return chacha(bytes.fromBase58(sharedKey)).decrypt(data);
}

/**
 * Crc
 */
import * as crc32 from "crc-32";
import { Bytes } from "../bytes";
export const createChecksum = (digest: Bytes): Checksum => crc32.buf(digest);
export const verifyChecksum = (digest: Bytes, checksum: Checksum) =>
  crc32.buf(digest) === checksum;

/**
 * Ed25519
 */
export function createKeyPair(privateKey?: PrivateKey): KeyPair {
  let privateKeyBytes: Bytes;
  if (privateKey) {
    privateKeyBytes = bytes.fromBase58(privateKey);
  } else {
    privateKeyBytes = ed.utils.randomPrivateKey();
    privateKey = bytes.toBase58(privateKeyBytes);
  }
  return {
    publicKey: bytes.toBase58(ed.getPublicKey(privateKeyBytes)),
    privateKey,
  };
}

export function verifyKeyPair(keyPair: KeyPair): boolean {
  return (
    keyPair.publicKey ===
    bytes.toBase58(ed.getPublicKey(bytes.fromBase58(keyPair.privateKey)))
  );
}

export function createSignature(
  privateKey: PrivateKey,
  data: Bytes,
): Signature {
  return bytes.toBase58(ed.sign(bytes.fromBase58(privateKey), data));
}

export function verifySignature(
  publicKey: PublicKey,
  data: Bytes,
  signature: Signature,
): boolean {
  return ed.verify(
    bytes.fromBase58(publicKey),
    data,
    bytes.fromBase58(signature),
  );
}

/**
 * X25519
 */
export function createSharedKey(
  privateKey: PrivateKey,
  publicKey: PublicKey,
  context: Bytes = new Uint8Array([]),
): SharedKey {
  return bytes.toBase58(
    sha256(
      bytes.concat(
        xd.getSharedSecret(
          edwardsToMontgomeryPriv(bytes.fromBase58(privateKey)),
          edwardsToMontgomeryPub(bytes.fromBase58(publicKey)),
        ),
        context,
      ),
    ),
  );
}
export function verifySharedKey(
  privateKey: PrivateKey,
  publicKey: PublicKey,
  sharedKey: SharedKey,
): boolean {
  return sharedKey === createSharedKey(privateKey, publicKey);
}
