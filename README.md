# talks-libraries

A monorepo for my talks, including common slides snippets and styles

## Coding Style

Preference order for conditionals and property access:

1. Prefer optional chaining over if statements and short circuits.
   - Reason: shorter, clearer, avoids accidental TypeErrors.
   - Example:
     - Good: `user?.profile?.email ?? 'n/a'`
     - Avoid: `user && user.profile && user.profile.email ? user.profile.email : 'n/a'`

2. Prefer short circuiting over if when optional chaining is not applicable.
   - Reason: concise, keeps expressions inline.
   - Example:
     - Good: `isReady && doStart()`
     - Avoid: `if (isReady) { doStart(); }`

3. Use if as last resort when readability or side effects require a statement.
   - Reason: complex branching belongs in statements, but keep it minimal.
   - Example:
     - Good: `if (config.mode === 'advanced') { initAdvanced(config); } else { initBasic(); }`

Notes:

- Use nullish coalescing (`??`) instead of `||` when 0, '' or false are valid values.
- Combine optional chaining with nullish coalescing where useful: `opts?.timeout ?? 5000`.
