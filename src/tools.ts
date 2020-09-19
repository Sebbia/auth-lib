import { AuthError, AuthErrorCode } from './errors';

export function promiseTimeout<T>(timeoutInMsec: number, promise: Promise<T>): Promise<T> {
  let timeout = new Promise<T>((resolve, reject) => {
    setTimeout(() => {
      reject(new AuthError(AuthErrorCode.TIMEOUT, `Timed out in ${timeoutInMsec} ms.`));
    }, timeoutInMsec);
  });

  return Promise.race([promise, timeout]);
}
