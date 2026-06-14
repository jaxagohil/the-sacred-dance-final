import { supabase } from "../services/supabase";

let USER_ID: string | null = null;

let INIT_PROMISE:
  Promise<string> | null = null;

export async function initUser() {

  if (INIT_PROMISE) {
    return INIT_PROMISE;
  }

  INIT_PROMISE = (async () => {

    const {
      data: { user },
    } = await supabase.auth.getUser();

    console.log(
      "👤 EXISTING AUTH USER:",
      user?.id
    );

    if (user) {

      USER_ID = user.id;

      return USER_ID;
    }

    console.log(
      "🆕 CREATING ANON USER"
    );

    const {
      data,
      error,
    } =
      await supabase.auth
        .signInAnonymously();

    if (error) {
      throw error;
    }

    USER_ID = data.user.id;

    console.log(
      "✅ ANON USER CREATED:",
      USER_ID
    );

    return USER_ID;

  })();

  return INIT_PROMISE;
}

export async function getUserId() {

  if (!USER_ID) {
    return await initUser();
  }

  return USER_ID;
}