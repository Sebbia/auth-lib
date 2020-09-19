export enum AuthErrorCode {
  NETWORK,
  TIMEOUT,
  BAD_CREDENTIALS,
}

export class AuthError extends Error {
  code: AuthErrorCode;

  constructor(code: AuthErrorCode, message: string) {
    super(message);
    this.code = code;
  }
}
