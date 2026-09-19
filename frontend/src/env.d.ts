/// <reference types="astro/client" />

interface ImportMetaEnv {
  /** Browser-facing API base. Leave unset for same-origin /api. */
  readonly PUBLIC_API_URL?: string;
  /** Legacy name for PUBLIC_API_URL, kept so existing environments keep working. */
  readonly VITE_API_URL?: string;
  /** Absolute API base for server-side fetching during the static build. */
  readonly API_BASE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
