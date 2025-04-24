import AES from "crypto-js/aes";
import CryptoJS from "crypto-js";
import axios from "./axios";
import { CardinalApiKey } from "@/types";

const secret = process.env.JWT_SECRET as string;

const iv = CryptoJS.enc.Hex.parse("0".repeat(32));
const key = CryptoJS.SHA256(secret);

export class CardinalApiKeyService {
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

  async createKey(name: string, raw: string, active: boolean): Promise<CardinalApiKey | { error: string }> {
    try {
      const response = await axios.post("/admin/api-key", {
        name,
        key: this.getEncryptedKey(raw),
        active,
      });
      return response.data;
    } catch (error: any) {
      return { error: error?.response?.data?.message || "Failed to create key" };
    }
  }

  async enableKey(raw: string): Promise<CardinalApiKey | { error: string }> {
    try {
      const response = await axios.put(`/admin/api-key/enable/${this.getEncryptedKey(raw)}`);
      return response.data;
    } catch (error: any) {
      return { error: error?.response?.data?.message || "Failed to enable key" };
    }
  }

  async disableKey(raw: string): Promise<CardinalApiKey | { error: string }> {
    try {
      const response = await axios.put(`/admin/api-key/disable/${this.getEncryptedKey(raw)}`);
      return response.data;
    } catch (error: any) {
      return { error: error?.response?.data?.message || "Failed to disable key" };
    }
  }

  async refreshKey(name: string, raw: string): Promise<CardinalApiKey | { error: string }> {
    try {
      const response = await axios.post(`/admin/api-key/refresh`,{
        name,
        key: this.getEncryptedKey(raw),
      });
      return response.data;
    } catch (error: any) {
      return { error: error?.response?.data?.message || "Failed to refresh key" };
    }
  }
}
