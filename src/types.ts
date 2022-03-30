declare global {
  interface Window {
    __userPoolId__?: string
    __user__?: any
  }
}

export interface GSGLConfig {
  defaultSite?: string
  defaultPage?: string
  defaultBlock?: string
  defaultElement?: string
  defaultUserPoolId?: string
  defaultUserId?: string
}
