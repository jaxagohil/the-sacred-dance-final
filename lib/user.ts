import * as SecureStore from "expo-secure-store";
import { v4 as uuidv4 } from "uuid";

let USER_ID: string | null = null;

export async function initUser() {
  let id = await SecureStore.getItemAsync("user_id");

  if (!id) {
    id = uuidv4();
    await SecureStore.setItemAsync("user_id", id);
    console.log("🆕 New user created:", id);
  } else {
    console.log("👤 Existing user:", id);
  }

  USER_ID = id;
  return id;
}

// ✅ SAFE ACCESS
export async function getUserId() {
  if (!USER_ID) {
    console.log("⚠️ USER_ID not ready → init");
    return await initUser();
  }
  return USER_ID;
}