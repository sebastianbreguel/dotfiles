---
name: vambe-ui-patterns
description: Apply Vambe UI patterns to any frontend project. Detects stack, adapts patterns for Next.js/Tailwind/React Query or provides portable equivalents.
---

# Vambe UI Patterns

Apply battle-tested frontend patterns from Vambe monorepo to any project. Stack-aware adaptation.

## When to Use

- Building new frontend features
- Creating UI components
- Setting up forms, API hooks, auth
- Porting patterns to new project

## Step 1: Stack Detection

Read `package.json` and detect:

| Dependency | Check |
|------------|-------|
| Next.js | `next` in dependencies |
| Tailwind | `tailwindcss` in devDependencies |
| React Query | `@tanstack/react-query` |
| Zod | `zod` |
| React Hook Form | `react-hook-form` |
| Firebase Auth | `firebase` + `next-firebase-auth-edge` |

**Classification:**
- `full-stack`: Has Next.js + Tailwind + React Query + Zod → use patterns directly
- `partial`: Has Next.js, missing some libs → adapt with available tools
- `minimal`: No Next.js or very different stack → provide portable patterns

## Step 2: UI Components

### Button

```tsx
// ALWAYS use isLoading for async actions
<Button isLoading={isPending} variant="default">Submit</Button>

// Variants
// - default: primary action (filled)
// - outline: secondary action (bordered)
// - ghost: subtle action (no border)
// - destructive: delete/danger action (red)
```

**Portable:** Create Button component with same props API.

### Icon

```tsx
// NEVER import from lucide-react directly
// Use wrapper component
import { Icon } from "@vambe/ui"; // or local equivalent

<Icon icon="check" size="sm" emphasis="success" />

// Sizes: xs=12px | sm=16px | md=20px | lg=24px | xl=32px
// Emphasis: default | muted | success | warning | danger
```

**Portable:** Create Icon wrapper over lucide-react (or heroicons, etc):

```tsx
import { icons } from "lucide-react";

const sizeMap = { xs: 12, sm: 16, md: 20, lg: 24, xl: 32 };
const emphasisMap = {
  default: "text-foreground",
  muted: "text-muted-foreground", 
  success: "text-green-600",
  warning: "text-yellow-600",
  danger: "text-red-600",
};

export function Icon({ icon, size = "md", emphasis = "default" }) {
  const LucideIcon = icons[icon];
  return <LucideIcon size={sizeMap[size]} className={emphasisMap[emphasis]} />;
}
```

### AlertDialog (Required for Deletes)

```tsx
// ALL delete actions MUST have confirmation dialog
<AlertDialog>
  <AlertDialogTrigger asChild>
    <Button variant="destructive">Delete</Button>
  </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
      <AlertDialogDescription>
        This action cannot be undone.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

### Card

```tsx
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>
    {/* content */}
  </CardContent>
  <CardFooter>
    {/* actions */}
  </CardFooter>
</Card>
```

## Step 3: Forms

### Pattern: react-hook-form + zod

```tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const schema = z.object({
  email: z.string().email("Invalid email"),
  name: z.string().min(2, "Name too short"),
});

type FormData = z.infer<typeof schema>;

function MyForm() {
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", name: "" },
  });

  const onSubmit = (data: FormData) => {
    // handle submit
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <InputComponentControl 
          control={form.control} 
          name="email" 
          label="Email" 
        />
        <Button type="submit" isLoading={form.formState.isSubmitting}>
          Submit
        </Button>
      </form>
    </Form>
  );
}
```

### Controlled Components

```tsx
// Input
<InputComponentControl control={form.control} name="email" label="Email" />

// Select
<SelectComponentControlled 
  control={form.control} 
  name="role" 
  label="Role"
  options={[{ value: "admin", label: "Admin" }]} 
/>

// Checkbox
<CheckboxComponentControlled control={form.control} name="active" label="Active" />

// Textarea
<TextareaComponentControlled control={form.control} name="bio" label="Bio" />

// DatePicker
<DatePickerComponentControlled control={form.control} name="startDate" label="Start Date" />
```

**Without RHF/Zod:** Use formik, or native forms with useState + manual validation.

## Step 4: API Hooks (React Query)

### Query Keys - Const Functions

```tsx
// ✅ CORRECT - Individual const functions
export const contactsQueryKey = () => ["contacts"] as const;
export const contactQueryKey = (id: string) => [...contactsQueryKey(), id] as const;

// ❌ WRONG - Object with methods
const queryKeys = { contacts: () => ["contacts"] };
```

### Mutations - Rename mutate

```tsx
// ✅ CORRECT - Always rename
const { mutate: createContact, isPending } = useCreateContact();
const { mutate: deleteContact } = useDeleteContact();

// ❌ WRONG
const mutation = useCreateContact();
const createContact = useCreateContact(); // shadows hook
```

### Infrastructure Functions

```tsx
// ✅ CORRECT - No accessToken param, handled by interceptors
import { api } from "#api.ts";

export async function getContacts(): Promise<Contact[]> {
  const response = await api.get<Contact[]>("/contacts", { camelize: true });
  return response.data;
}

export async function createContact(data: CreateContactDto): Promise<Contact> {
  const response = await api.post<Contact>("/contacts", data, { camelize: true });
  return response.data;
}

// ❌ WRONG - accessToken as param
export async function getContacts(accessToken: string) { ... }
```

### Camelize Pattern (Preferred)

API returns `snake_case`, frontend uses `camelCase`. Use `camelize: true`:

```tsx
// Types in @vambe/types (camelCase)
export interface Contact {
  id: string;
  firstName: string;  // auto-converted from first_name
  lastName: string;   // auto-converted from last_name
  createdAt: string;  // auto-converted from created_at
}

// Infrastructure with camelize
const response = await api.get<Contact[]>("/contacts", { camelize: true });
```

### Hook Structure

```tsx
// packages/api/src/{domain}/hooks/use-contacts.ts
import { useQuery } from "@tanstack/react-query";
import { getContacts } from "../infrastructure/get-contacts";
import { contactsQueryKey } from "../query-keys";

export function useContacts() {
  return useQuery({
    queryKey: contactsQueryKey(),
    queryFn: getContacts,
  });
}
```

### Infinite Queries - MUST use "Infinite" suffix

```tsx
// ✅ File: use-contacts-infinite.ts
export function useContactsInfinite() {
  return useInfiniteQuery({ ... });
}

// ❌ WRONG - No suffix
export function useContacts() {
  return useInfiniteQuery({ ... }); // misleading name
}
```

**Without React Query:** Use SWR, or custom hooks with fetch + useState/useEffect.

## Step 5: Auth

### Architecture Overview

Firebase + `next-firebase-auth-edge` with dual-sync:
1. **Server-side**: Cookie-based auth via `next-firebase-auth-edge`
2. **Client-side**: Firebase SDK for real-time auth state
3. **Sync**: `/api/login` and `/api/logout` endpoints sync cookies

### AuthProvider Setup

```tsx
// _app.tsx or layout.tsx
import { AuthProvider } from "@vambe/auth";

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider 
      router={router}
      LoadingComponent={LoadingSpinner}
      onboardingRequired={true}
      unprotectedRoutes={["/login", "/register", "/welcome"]}
      loginPath="/login"
    >
      <Component {...pageProps} />
    </AuthProvider>
  );
}
```

### AuthAction Enum

```tsx
enum AuthAction {
  RENDER = "RENDER",                    // Render component
  RETURN_NULL = "RETURN_NULL",          // Return null
  REDIRECT_TO_APP = "REDIRECT_TO_APP",  // Redirect to app (for login page)
  REDIRECT_TO_LOGIN = "REDIRECT_TO_LOGIN", // Redirect to login
}
```

### Server-Side Protection (withUserSSR)

```tsx
import { withUserSSR, AuthAction } from "@vambe/auth";

// Protected page - redirect if not authenticated
export const getServerSideProps = withUserSSR({
  whenUnauthed: AuthAction.REDIRECT_TO_LOGIN,
  whenAuthed: AuthAction.RENDER,
  redirectTo: "/login",
})(async (ctx) => {
  // ctx.user and ctx.tokens available
  const { user, tokens } = ctx;
  
  return { 
    props: { 
      userData: user 
    } 
  };
});

// Login page - redirect if already authenticated
export const getServerSideProps = withUserSSR({
  whenAuthed: AuthAction.REDIRECT_TO_APP,
  whenUnauthed: AuthAction.RENDER,
  appPageURL: "/dashboard",
})(async (ctx) => {
  return { props: {} };
});
```

### Client-Side Protection (withUser HOC)

```tsx
import { withUser, AuthAction } from "@vambe/auth";

function ProtectedPage({ user, loading }) {
  return <div>Welcome {user.email}</div>;
}

export default withUser({
  whenAuthed: AuthAction.RENDER,
  whenUnauthedBeforeInit: AuthAction.RENDER, // Show loading
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
  redirectTo: "/login",
  appPageURL: "/dashboard",
})(ProtectedPage);
```

### useAuth Hook - Full API

```tsx
import { useAuth } from "@vambe/auth";

function MyComponent() {
  const {
    // User state
    user,              // User | null
    accessToken,       // string | null
    loading,           // boolean
    
    // Profile & subscription
    profile,           // Profile object with onboarding, language, etc.
    subscription,      // Active subscription data
    subscriptionLoading,
    phones,            // User phone numbers
    provider,          // "password" | "google.com" | null
    
    // Actions
    login,             // (email, password) => Promise
    register,          // (email, password, name) => Promise
    logout,            // () => Promise
    signInWithGoogle,  // () => Promise<{ user, token }>
    refreshProfile,    // () => Promise - refetch profile
    refreshToken,      // () => Promise - refresh Firebase token
    removeToken,       // () => void - clear token (for logout scenarios)
  } = useAuth();

  return (
    <div>
      {loading && <Spinner />}
      {user && <p>Logged in as {user.email}</p>}
      {profile?.onboarding?.done && <p>Onboarding complete</p>}
      {subscription && <p>Plan: {subscription.planName}</p>}
    </div>
  );
}
```

### Login Implementation

```tsx
function LoginForm() {
  const { login, signInWithGoogle } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (email: string, password: string) => {
    try {
      await login(email, password);
      // Redirect handled by AuthProvider
    } catch (err) {
      if (err.message === "ACCOUNT_LOCKED") {
        setError("Account locked. Try again later.");
      } else if (err.message === "INVALID_CREDENTIALS") {
        setError("Invalid email or password.");
      }
    }
  };

  const handleGoogleLogin = async () => {
    const { user, token } = await signInWithGoogle();
    if (user) {
      // Success - redirect handled by AuthProvider
    }
  };

  return (
    <form onSubmit={...}>
      {/* form fields */}
      <Button type="submit">Login</Button>
      <Button type="button" onClick={handleGoogleLogin}>
        Sign in with Google
      </Button>
    </form>
  );
}
```

### Unprotected Routes

```tsx
// Define routes that don't require auth
export const UNPROTECTED_ROUTES = [
  "/login",
  "/register", 
  "/welcome",
  "/password-forgot",
  "/payment/[id]",        // Dynamic routes supported
  "/agents/[ownerId]/register/[userId]",
];

// Pass to AuthProvider
<AuthProvider unprotectedRoutes={UNPROTECTED_ROUTES}>
```

### Onboarding Flow

```tsx
// AuthProvider handles onboarding redirect automatically
<AuthProvider 
  onboardingRequired={true}  // Enable onboarding check
>

// If profile.onboarding.done === false, redirects to /vambe-setup
// After onboarding complete, set profile.onboarding.done = true
```

### API Routes for Auth

```tsx
// pages/api/login.ts
import { createAuthConfig } from "@vambe/auth";

export default async function handler(req, res) {
  const authConfig = createAuthConfig({
    COOKIE_SECRET_CURRENT: process.env.COOKIE_SECRET_CURRENT!,
    COOKIE_SECRET_PREVIOUS: process.env.COOKIE_SECRET_PREVIOUS!,
    FIREBASE_PRIVATE_KEY: process.env.FIREBASE_PRIVATE_KEY!,
    COOKIE_DOMAIN: process.env.COOKIE_DOMAIN,
  });
  
  // Set session cookie from Firebase ID token
  const token = req.headers.authorization?.split("Bearer ")[1];
  // ... verify and set cookie
}

// pages/api/logout.ts
export default async function handler(req, res) {
  // Clear session cookie
  res.setHeader("Set-Cookie", "vambe-ai-frontend=; Path=/; Max-Age=0");
  res.status(200).json({ success: true });
}
```

### Auth Config

```tsx
// Required environment variables
FIREBASE_PRIVATE_KEY=       // Firebase service account private key
COOKIE_SECRET_CURRENT=      // Hex string for cookie signing
COOKIE_SECRET_PREVIOUS=     // Previous secret for rotation
COOKIE_DOMAIN=              // Cookie domain (e.g., ".vambe.ai")

// Config structure
export function createAuthConfig(env) {
  return {
    apiKey: "your-firebase-api-key",
    cookieName: "your-app-frontend",
    cookieSignatureKeys: [
      Buffer.from(env.COOKIE_SECRET_CURRENT, "hex").toString("base64"),
      Buffer.from(env.COOKIE_SECRET_PREVIOUS, "hex").toString("base64"),
    ],
    cookieSerializeOptions: {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      domain: env.COOKIE_DOMAIN || "localhost",
      maxAge: 12 * 60 * 60 * 24, // 12 days
    },
    enableCustomToken: false, // Disable to prevent large cookies
  };
}
```

### Token Refresh

```tsx
// AuthProvider handles automatic token refresh every 50 minutes
const TOKEN_REFRESH_INTERVAL = 50 * 60 * 1000;

// Manual refresh if needed
const { refreshToken } = useAuth();
await refreshToken();
```

### Portable Auth System (Without Firebase)

For other auth providers, maintain same patterns:

```tsx
// 1. AuthProvider with same interface
interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  // ... other methods
}

// 2. HOCs with AuthAction pattern
function withAuth(config: AuthConfig) {
  return (Component) => {
    return function WrappedComponent(props) {
      const { user, loading } = useAuth();
      
      if (loading) return config.LoadingComponent || null;
      if (!user && config.whenUnauthed === "REDIRECT") {
        redirect(config.redirectTo);
      }
      
      return <Component {...props} user={user} />;
    };
  };
}

// 3. Server/client sync via cookies or tokens
// NextAuth example:
import { getServerSession } from "next-auth";
export const getServerSideProps = async (ctx) => {
  const session = await getServerSession(ctx.req, ctx.res, authOptions);
  if (!session) return { redirect: { destination: "/login" } };
  return { props: { user: session.user } };
};
```

### Auth Checklist for New Projects

- [ ] AuthProvider wrapping app
- [ ] useAuth hook with user/loading/login/logout
- [ ] withUser HOC for client protection
- [ ] withUserSSR HOC for server protection  
- [ ] /api/login and /api/logout routes
- [ ] Cookie or token-based session
- [ ] Unprotected routes config
- [ ] Token refresh mechanism
- [ ] Profile/subscription queries (optional)

## Step 6: Project Structure

### Monorepo (Full Stack)

```
packages/
  ui/              # Pure UI components (shadcn/radix)
  shared/          # Forms, hooks, reusable business logic
  api/             # Infrastructure + hooks by domain
  types/           # TypeScript interfaces (camelCase)
  auth/            # Auth context, HOCs, config
  hooks/           # Shared custom hooks
  contexts/        # Shared React contexts

apps/
  {app}/
    src/
      components/{domain}/   # App-specific components
      pages/ or app/         # Routes
```

### Single App (Partial/Minimal)

```
src/
  components/
    ui/            # Base UI components
    shared/        # Reusable components
    {domain}/      # Domain-specific components
  lib/
    api/           # API infrastructure + hooks
    auth/          # Auth utilities
  types/           # TypeScript interfaces
```

### Import Patterns

```tsx
// ✅ Workspace packages
import { Button } from "@vambe/ui";
import { useContacts } from "@vambe/api";

// ✅ Internal subpath imports
import { api } from "#api.ts";
import { ContactDomain } from "#contact/domain/contact.domain.ts";

// ❌ Relative cross-package
import { Button } from "../../../packages/ui";
```

## Step 7: Styling

### Tailwind + HSL Variables

```css
/* globals.css */
:root {
  --background: 0 0% 100%;
  --foreground: 222 47% 11%;
  --primary: 222 47% 11%;
  --primary-foreground: 210 40% 98%;
  --muted: 210 40% 96%;
  --muted-foreground: 215 16% 47%;
  --destructive: 0 84% 60%;
}
```

```tsx
// ✅ Semantic colors
className="bg-primary text-primary-foreground"
className="text-muted-foreground"
className="bg-destructive"

// ❌ Hardcoded hex
className="bg-[#1a1a2e]"
```

### Images from public/

```tsx
// ✅ String path from public folder
<Image src="/images/logo.svg" alt="Logo" width={80} height={80} />

// ❌ Direct import
import logo from "@/../../public/images/logo.svg";
```

**Without Tailwind:** Use CSS variables with same semantic naming:

```css
:root {
  --color-primary: hsl(222, 47%, 11%);
  --color-primary-foreground: hsl(210, 40%, 98%);
}
```

## Step 8: Portable Checklist

When stack is `partial` or `minimal`, create these foundations:

### 1. UI Kit Mínimo
- [ ] Button with `isLoading`, `variant` props
- [ ] Icon wrapper with `size`, `emphasis` props
- [ ] Card with Header/Content/Footer
- [ ] AlertDialog for confirmations

### 2. Form System
- [ ] Form wrapper component
- [ ] Controlled input components
- [ ] Validation integration (zod or equivalent)

### 3. API Layer
- [ ] Axios/fetch instance with interceptors
- [ ] Camelize utility for response transformation
- [ ] Query key pattern (const functions)
- [ ] Hook pattern (useQuery/useMutation wrappers)

### 4. Auth System
- [ ] AuthProvider context
- [ ] withAuth HOC for route protection
- [ ] useAuth hook

### 5. Token System
- [ ] CSS variables for colors
- [ ] Semantic naming (primary, muted, destructive)
- [ ] Size scale (xs, sm, md, lg, xl)

## Quick Reference

| Pattern | Vambe Way | Portable Alternative |
|---------|-----------|---------------------|
| Icons | `<Icon icon="x" />` | Wrapper over lucide/heroicons |
| Buttons | `isLoading={isPending}` | Same prop API |
| Delete | AlertDialog required | Any confirm dialog |
| Forms | RHF + Zod | Formik, native forms |
| API | React Query + camelize | SWR, custom hooks |
| Auth | Firebase + HOCs | NextAuth, Clerk + HOCs |
| Styling | Tailwind + HSL vars | CSS vars + semantic names |
