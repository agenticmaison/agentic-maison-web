'use client';

import { useActionState } from 'react';
import { unlockDeck, type UnlockState } from './actions';

const initial: UnlockState = {};

export function UnlockForm({ from }: { from: string }) {
  const [state, formAction, pending] = useActionState(unlockDeck, initial);
  return (
    <form action={formAction} className="mt-1.5 flex flex-col gap-3">
      <input type="hidden" name="from" value={from} />
      <input
        type="password"
        name="password"
        autoComplete="current-password"
        autoFocus
        required
        spellCheck={false}
        className="appearance-none border border-rule bg-paper-2 px-3.5 py-3 font-body text-base text-ink outline-none transition-[border-color] duration-[180ms] focus:border-brass"
        placeholder="Password"
        aria-label="Password"
        aria-invalid={state.error ? 'true' : 'false'}
      />
      <button
        type="submit"
        disabled={pending}
        className="deck-cta cursor-pointer appearance-none border border-ink bg-ink px-3.5 py-3 font-mono text-[0.72rem] uppercase tracking-[0.16em] text-paper transition-colors duration-[180ms] hover:border-brass hover:bg-brass disabled:opacity-70"
      >
        {pending ? 'Verifying' : 'Enter'}
      </button>
      {state.error ? (
        <p
          className="m-0 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-brass"
          role="alert"
        >
          {state.error}
        </p>
      ) : null}
    </form>
  );
}
