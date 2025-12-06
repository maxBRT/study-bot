# study-bot

## Todo

- [x] Add token field to user table
- [x] Add token_refresh field to user table
- [x] Add a token_usage table
- [ ] Monitor token usage in sendMessage function
- [ ] Create a tokenUsage middleware

## SQL schema

<img width="1039" height="808" alt="image" src="https://github.com/user-attachments/assets/dcba7a55-1c37-4aa9-9b40-483fd6df6d12" />

## Better Auth Routes

- Sign in: /api/auth/sign-in/email
- Sign up: /api/auth/sign-up/email
- Sign out: /api/auth/sign-out
- Get session: /api/auth/get-session
- List sessions: /api/auth/list-sessions
- Verify email: /api/auth/verify-email
