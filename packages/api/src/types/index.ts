export type AuthResponse = {
  message: string
  state: boolean
  token: string | null
}

export type BaseResponse = Omit<AuthResponse, 'token'>
