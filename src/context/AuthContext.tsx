import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  ReactNode,
} from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";

// ── Types ─────────────────────────────────────────────────────────────────────
interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAdmin: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

// ── Context ───────────────────────────────────────────────────────────────────
const AuthContext = createContext<AuthContextType | null>(null);

// ── Internal helpers (not exported — keeps HMR boundary clean) ────────────────

// Supabase error code for missing table — silently ignored
const TABLE_NOT_FOUND = "42P01";

// Fetches the admin role for a given userId from user_roles.
// Has its own try/catch — auth flow must never crash over a role check.
// Uses a ref guard to prevent duplicate fetches for the same userId.
const fetchIsAdmin = async (
  userId: string,
  lastCheckedRef: React.MutableRefObject<string | null>
): Promise<boolean> => {
  // Skip if we already fetched for this exact userId this session
  if (lastCheckedRef.current === userId) return false;

  // Mark as in-flight BEFORE the await — prevents concurrent duplicate calls
  // even if fetchIsAdmin is called twice in quick succession
  lastCheckedRef.current = userId;

  try {
    const { data, error } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .eq("role", "admin")
      .maybeSingle();

    if (error) {
      if (error.code !== TABLE_NOT_FOUND) {
        console.warn("[AuthContext] fetchIsAdmin:", error.message);
      }
      // TABLE_NOT_FOUND is silently swallowed — expected in early setup
      return false;
    }

    return !!data;
  } catch (err) {
    console.warn("[AuthContext] fetchIsAdmin unexpected:", err);
    return false;
  }
};

// ── Provider ──────────────────────────────────────────────────────────────────
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  // Tracks the last userId we fetched a role for.
  // Passed into fetchIsAdmin to prevent triple-fetch:
  //   (1) initializeSession  (2) INITIAL_SESSION event  (3) StrictMode remount
  const lastCheckedUserIdRef = useRef<string | null>(null);

  useEffect(() => {
    // isMounted guard — prevents setState calls after unmount (StrictMode safe)
    let isMounted = true;

    // ── Step 1: Initialize session on mount ───────────────────────────────
    // This is the SINGLE owner of setLoading(false).
    // The finally block guarantees it fires regardless of success or failure.
    // onAuthStateChange below handles FUTURE changes only — it never
    // touches the loading state.
    const initializeSession = async () => {
      try {
        console.log("[AuthContext] Fetching session...");

        // Failsafe: If getSession hangs (usually corrupted localStorage token), 
        // force resolve it after 3s so the app can boot anonymously.
        const sessionPromise = supabase.auth.getSession();
        const timeoutPromise = new Promise<{ data: { session: null }, error: null }>((resolve) =>
          setTimeout(() => {
            console.warn("[AuthContext] getSession hung for 3s. Wiping corrupted local storage to unblock app.");
            localStorage.removeItem("supabase.auth.token");
            resolve({ data: { session: null }, error: null });
          }, 3000)
        );

        const {
          data: { session },
          error,
        } = await Promise.race([sessionPromise, timeoutPromise]);

        if (error) throw error;

        if (!isMounted) return;

        if (session?.user) {
          // Session found — populate state and fetch role
          setSession(session);
          setUser(session.user);

          const admin = await fetchIsAdmin(session.user.id, lastCheckedUserIdRef);
          if (isMounted) setIsAdmin(admin);
        } else {
          // No session — user is anonymous guest
          setSession(null);
          setUser(null);
          setIsAdmin(false);
        }
      } catch (err) {
        // getSession() failed (network error, corrupted localStorage, etc.)
        // Log it but never block the app — user proceeds as anonymous guest.
        console.warn("[AuthContext] initializeSession error:", err);
        if (isMounted) {
          setSession(null);
          setUser(null);
          setIsAdmin(false);
        }
      } finally {
        // CRITICAL: This is the ONLY place setLoading(false) is called.
        // Runs unconditionally — success path, error path, or throw.
        // The app is guaranteed to exit the loading state after this.
        if (isMounted) setLoading(false);
      }
    };

    initializeSession();

    // ── Step 2: Listen for FUTURE auth state changes ──────────────────────
    // Handles sign-in and sign-out events that happen AFTER initial load.
    // Does NOT call setLoading — that concern belongs only to initializeSession.
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!isMounted) return;

      // Skip INITIAL_SESSION — initializeSession already handled it above.
      // Without this guard, INITIAL_SESSION would trigger a duplicate
      // role fetch and potentially race with initializeSession's setState calls.
      if (event === "INITIAL_SESSION") return;

      try {
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          // New sign-in or token refresh — reset ref so role is re-fetched
          // for the new user (handles account switching correctly)
          if (lastCheckedUserIdRef.current !== session.user.id) {
            lastCheckedUserIdRef.current = null;
          }
          const admin = await fetchIsAdmin(session.user.id, lastCheckedUserIdRef);
          if (isMounted) setIsAdmin(admin);
        } else {
          // SIGNED_OUT — clear everything
          lastCheckedUserIdRef.current = null;
          setIsAdmin(false);
        }
      } catch (err) {
        console.warn("[AuthContext] onAuthStateChange handler error:", err);
        if (isMounted) setIsAdmin(false);
      }
    });

    // ── Cleanup ───────────────────────────────────────────────────────────
    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []); // Empty dep array — runs once on mount only

  // ── signIn ────────────────────────────────────────────────────────────────
  // onAuthStateChange fires SIGNED_IN after this resolves —
  // state update is handled there automatically.
  const signIn = async (
    email: string,
    password: string
  ): Promise<{ error: string | null }> => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error?.message ?? null };
  };

  // ── signOut ───────────────────────────────────────────────────────────────
  // onAuthStateChange fires SIGNED_OUT after this resolves —
  // state clear is handled there automatically.
  // We also eagerly clear local state for instant UI response.
  const signOut = async (): Promise<void> => {
    lastCheckedUserIdRef.current = null;
    setUser(null);
    setSession(null);
    setIsAdmin(false);
    await supabase.auth.signOut();
  };

  console.log("Auth State:", loading);

  return (
    <AuthContext.Provider
      value={{ user, session, isAdmin, loading, signIn, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ── Hook (exported at bottom — clean HMR boundary for Vite React-SWC) ────────
export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};