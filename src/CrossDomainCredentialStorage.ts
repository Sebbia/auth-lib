import { RPC } from '@mixer/postmessage-rpc';
import AuthRPC from './AuthRPC'
import CredentialStorage from './CredentialStorage';
import { promiseTimeout } from './tools';
import Credentials from './Credentials';

declare global {
  interface Window {
    authClientIframe: any;
  }
}

export default class CrossDomainCredentialStorage implements CredentialStorage {
  private rpc: AuthRPC;
  private isIframeLoaded: boolean = false;

  constructor(
    credentialStorageUrl: string,
    serviceId: string,
    private timeoutValue: number
  ) {
    const iframe: any = window.document.createElement('iframe');
    iframe.style.height = 0;
    iframe.style.width = 0;
    iframe.name = 'authClientIframe';
    document.body.appendChild(iframe);
    iframe.src = credentialStorageUrl;
    iframe.onload = () => {
      this.isIframeLoaded = true;
    };
    const iframeWin = window.frames.authClientIframe;
    this.rpc = new RPC({
      target: iframeWin,
      serviceId,
    });
  }

  private delay(msec: number): Promise<void> {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve();
      }, msec);
    });
  }

  private async waitForIframe() {
    while (!this.isIframeLoaded) {
      await this.delay(100);
    }
  }

  async setCredentials(credentials: Credentials) {
    return await promiseTimeout(
      this.timeoutValue,
      this.waitForIframe().then(res => {
        this.rpc.call('set', credentials);
      })
    );
  }
  async getCredentials() {
    return await promiseTimeout(
      this.timeoutValue,
      this.waitForIframe().then(res => {
        return this.rpc.call('get', {});
      })
    );
  }
  async clearCredentials() {
    return await promiseTimeout(
      this.timeoutValue,
      this.waitForIframe().then(res => {
        this.rpc.call('clear', {});
      })
    );
  }
}