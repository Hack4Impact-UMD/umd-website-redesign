/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

interface ImportMetaEnv {
  readonly VITE_ROOT_URL: string
  readonly VITE_API_URL: string
  readonly VITE_EMAILJS_SERVICE_ID?: string
  readonly VITE_EMAILJS_TEMPLATE_ID?: string
  readonly VITE_EMAILJS_PUBLIC_KEY?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
