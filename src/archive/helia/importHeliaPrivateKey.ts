import { base64 } from "multiformats/bases/base64";
import type { Helia } from "helia";
import { PrivateKey } from "@mootline/types";
import * as ciphers from "./aes-gcm";
import { b, c } from "@mootline/utils";

export async function importHeliaPrivateKey(
  heliaInstance: Helia,
  privateKey: PrivateKey,
) {
  // manually create the key
  const syntheticKeyBytes = b.concat(
    // protobuf encoding of the key
    Uint8Array.from([8, 1, 18, 64]),
    // the private key
    privateKey.bytes,
    // concatenated with the public key
    c.ed.getPublicKey(privateKey.bytes),
  );

  // dummy encrypt the key
  const cipher = ciphers.create();
  const encryptedKey = await cipher.encrypt(
    syntheticKeyBytes,
    privateKey.string,
  );
  const encodedKey = base64.encode(encryptedKey);

  // import the key
  //@ts-expect-error libp2p exists
  const keyInfo = await heliaInstance.libp2p.services.keychain.importKey(
    privateKey.string,
    encodedKey,
    privateKey.string,
  );

  return keyInfo;
}
