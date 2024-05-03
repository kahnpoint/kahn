import { Bytes } from "../bytes";
export type Hash = string;
export type Signature = string;
export type Checksum = number;
export type AnyKey = string;
export type PublicKey = AnyKey;
export type PrivateKey = AnyKey;
export type SharedKey = AnyKey;
export type PublicKeyBytes = Uint8Array;
export type PrivateKeyBytes = Uint8Array;
export type SharedKeyBytes = Uint8Array;
export type KeyPair = {
  publicKey: PublicKey;
  privateKey: PrivateKey;
};
export type JoinedKeyPair = `${PublicKey}:${PrivateKey}`;
