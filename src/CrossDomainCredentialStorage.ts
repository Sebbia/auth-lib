import { RPC } from '@mixer/postmessage-rpc';
import AuthRPC from './AuthRPC';
import Credentials from './Credentials';
import CredentialStorage from './CredentialStorage';
import { promiseTimeout } from './tools';

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
    iframe.onload = () => {
      console.log("<433b56d7> Frame loaded")
    }
    document.body.appendChild(iframe);
    const iframeWin = window.frames.authClientIframe;
    let rpc = new RPC({
      target: iframeWin,
      serviceId,
    });

    rpc.expose('storageReady', () => {
      console.log("<43a4b88b> Frame notified")
      this.isIframeLoaded = true;
    });

    iframe.src = credentialStorageUrl;
    this.rpc = rpc;
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
