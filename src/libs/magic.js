import { Magic } from "magic-sdk";
import { WebAuthnExtension } from "@magic-ext/webauthn";

export const magic = new Magic("pk_live_8D938ABAB2301750", {
  extensions: [new WebAuthnExtension()],
});
