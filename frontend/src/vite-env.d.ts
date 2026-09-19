/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Browser-facing API base. Leave unset for same-origin /api. */
  readonly VITE_API_URL?: string
  /** Astro-era name for the same thing; takes precedence when both are set. */
  readonly PUBLIC_API_URL?: string
  /** Absolute API base for server-side fetching during the static build. */
  readonly API_BASE_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
