import AES from "crypto-js/aes";
import CryptoJS from "crypto-js";
import axios from "./axios";

const secret = process.env.JWT_SECRET as string;

const iv = CryptoJS.enc.Hex.parse("0".repeat(32));
const key = CryptoJS.SHA256(secret);

export class CardinalKeyService {
  constructor() {}

  getEncryptedKey(raw: string) {
    const encrypted = AES.encrypt(raw, key, { iv }).toString();
    return encrypted.replace(/\//g, "-");
  }

  getDecryptedKey(encrypted: string) {
    const corrected = encrypted.replace(/-/g, "/");
    const decrypted = AES.decrypt(corrected, key, { iv });
    return decrypted.toString(CryptoJS.enc.Utf8);
  }

  async createKey(name: string, raw: string, active: boolean) {
    const response = await axios.post("/admin/key", {
      name,
      key: this.getEncryptedKey(raw),
      active,
    });
    return response.data;
  }

  async enableKey(raw: string) {
    const response = await axios.put(
      `/admin/key/enable/${this.getEncryptedKey(raw)}`
    );
    return response.data;
  }

  async disableKey(raw: string) {
    const response = await axios.put(
      `/admin/key/disable/${this.getEncryptedKey(raw)}`
    );
    return response.data;
  }
}
