"use client";

import { useActionState, useEffect, useState } from "react";
import {
  CONTACT_FORM_INITIAL_STATE,
  submitContactForm,
  type ContactFormState,
} from "@/app/actions/contact";

function FormStatus({ state }: { state: ContactFormState }) {
  if (state.ok === null) return null;
  return (
    <div
      role="status"
      aria-live="polite"
      className="mb-[1rem] rounded border border-rule bg-paper-2 p-[0.75rem] font-body text-[0.95rem] text-ink"
    >
      <span lang="en">{state.messageEn}</span>
      <span className="block max-[980px]:block min-[981px]:hidden mt-[0.35rem]" />
      <span lang="zh">{state.messageZh}</span>
    </div>
  );
}

/**
 * Contact form — posts to a Server Action (Resend). Honeypot + timing in actions/contact.
 */
export function ContactForm() {
  const [state, formAction, isPending] = useActionState(
    submitContactForm,
    CONTACT_FORM_INITIAL_STATE
  );
  const [openedAt, setOpenedAt] = useState<number | null>(null);

  useEffect(() => {
    const id = window.setTimeout(() => {
      setOpenedAt(Date.now());
    }, 0);
    return () => window.clearTimeout(id);
  }, []);

  const resetKey = state.ok === true ? "sent" : "edit";

  return (
    <form
      key={resetKey}
      className="relative bg-paper border border-rule p-[clamp(1.75rem,3vw,2.5rem)] shadow-[0_1px_0_var(--rule)]"
      action={formAction}
      aria-label="Contact form"
    >
      <span className="font-mono text-[0.7rem] tracking-[0.16em] uppercase text-brass border-b border-rule pb-[0.9rem] mb-[1.5rem] block">
        <span lang="en">Hong Kong · <span data-form-date>—</span></span>
        <span lang="zh">香港 · <span data-form-date-zh>—</span></span>
      </span>

      <FormStatus state={state} />

      {openedAt !== null && (
        <input type="hidden" name="_opened_at" value={String(openedAt)} />
      )}

      {/* Honeypot: hidden from users; bots often fill every field */}
      <div
        className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden"
        aria-hidden="true"
      >
        <label htmlFor="website_url">Leave this empty</label>
        <input
          type="text"
          id="website_url"
          name="website_url"
          tabIndex={-1}
          autoComplete="off"
          defaultValue=""
        />
      </div>

      <div className="mb-[1.1rem] grid gap-[0.5rem]">
        <label htmlFor="f-name" className="font-mono text-[0.66rem] tracking-[0.18em] uppercase text-brass">
          <span lang="en">Name</span>
          <span lang="zh">姓名</span>
        </label>
        <input
          className="am-input"
          type="text"
          id="f-name"
          name="name"
          autoComplete="name"
          required
          minLength={2}
          maxLength={200}
          data-signoff-source
          disabled={isPending}
        />
      </div>
      <div className="mb-[1.1rem] grid gap-[0.5rem]">
        <label htmlFor="f-email" className="font-mono text-[0.66rem] tracking-[0.18em] uppercase text-brass">
          <span lang="en">Email</span>
          <span lang="zh">電子郵件</span>
        </label>
        <input
          className="am-input"
          type="email"
          id="f-email"
          name="email"
          autoComplete="email"
          required
          maxLength={254}
          disabled={isPending}
        />
      </div>
      <div className="mb-[1.1rem] grid gap-[0.5rem]">
        <label htmlFor="f-company" className="font-mono text-[0.66rem] tracking-[0.18em] uppercase text-brass">
          <span lang="en">Company</span>
          <span lang="zh">公司</span>
          <span className="text-ink-3 ml-[0.25em]">
            <span lang="en">(optional)</span>
            <span lang="zh">（選填）</span>
          </span>
        </label>
        <input
          className="am-input"
          type="text"
          id="f-company"
          name="company"
          autoComplete="organization"
          maxLength={200}
          disabled={isPending}
        />
      </div>
      <div className="mb-[1.1rem] grid gap-[0.5rem]">
        <label htmlFor="f-message" className="font-mono text-[0.66rem] tracking-[0.18em] uppercase text-brass">
          <span lang="en">Message</span>
          <span lang="zh">訊息</span>
        </label>
        <textarea
          className="am-input"
          id="f-message"
          name="message"
          rows={5}
          required
          minLength={10}
          maxLength={10000}
          disabled={isPending}
        />
      </div>
      <div className="mt-[1.5rem] font-body italic text-ink-2 text-[1rem] leading-[1.55] [&_em]:text-ink [&_em]:italic">
        <p>
          <span lang="en">With thanks,</span>
          <span lang="zh">謹此致謝，</span>
        </p>
        <p>
          <em>
            <span lang="en">— <span data-signoff-name>your name</span></span>
            <span lang="zh">— <span data-signoff-name-zh>您的署名</span></span>
          </em>
        </p>
      </div>
      <div className="mt-[1.5rem]">
        <button
          type="submit"
          className="cta cta-submit"
          disabled={isPending || openedAt === null}
          aria-busy={isPending}
        >
          <span lang="en">{isPending ? "Sending…" : "Send"}</span>
          <span lang="zh">{isPending ? "寄送中…" : "寄出"}</span>
        </button>
      </div>
    </form>
  );
}
