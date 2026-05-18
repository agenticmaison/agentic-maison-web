'use client';

import { useActionState } from 'react';
import { unlockDeck, type UnlockState } from './actions';

/**
 * UnlockForm — client wrapper around the unlockDeck server action.
 * Holds the inline "Incorrect" error message; otherwise the action
 * redirects on success and the user never sees this render again.
 */
const initial: UnlockState = {};

export function UnlockForm({ from }: { from: string }) {
  const [state, formAction, pending] = useActionState(unlockDeck, initial);
  return (
    <form action={formAction} className="unlock-form">
      <input type="hidden" name="from" value={from} />
      <input
        type="password"
        name="password"
        autoComplete="current-password"
        autoFocus
        required
        spellCheck={false}
        className="unlock-input"
        placeholder="Password"
        aria-label="Password"
        aria-invalid={state.error ? 'true' : 'false'}
      />
      <button type="submit" className="unlock-submit" disabled={pending}>
        {pending ? 'Verifying' : 'Enter'}
      </button>
      {state.error ? (
        <p className="unlock-error" role="alert">
          {state.error}
        </p>
      ) : null}
    </form>
  );
}
