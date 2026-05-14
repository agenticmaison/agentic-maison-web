/** Shared contact form UI state — must live outside `"use server"` modules (Next.js restriction). */

export type ContactFormState = {
  ok: boolean | null;
  messageEn?: string;
  messageZh?: string;
};

/** Stable reference for `useActionState` initial render. */
export const CONTACT_FORM_INITIAL_STATE: ContactFormState = { ok: null };
