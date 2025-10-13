# TODO: Implement JWT-based Authentication and Authorization

## Backend Updates
- [x] Update `backend/prisma/seed.ts` to hash the test user's password using bcrypt.
- [x] Create `backend/src/controllers/authController.ts` with register and login logic.
- [x] Create `backend/src/routes/authRoutes.ts` for `/auth/register` and `/auth/login` endpoints.
- [x] Create `backend/src/middleware/auth.ts` for JWT verification middleware.
- [x] Update `backend/src/app.ts` to include auth routes and apply auth middleware to protected endpoints.

## Frontend Updates
- [x] Update `frontend/src/api/axios.ts` to include Authorization header with JWT token.
- [x] Update `frontend/src/App.tsx` to manage auth state and conditionally render components.
- [x] Create `frontend/src/components/Login.tsx` for login form.
- [x] Create `frontend/src/components/Register.tsx` for register form.

## Testing and Followup
- [x] Run `prisma db seed` to update the test user's password.
- [x] Test auth endpoints (register/login).
- [x] Test full auth flow on frontend.
- [x] Apply auth middleware to additional protected routes as needed.
