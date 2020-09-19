import CredentialStorage from './CredentialStorage';
import Credentials from './Credentials';

export default class LocalCredentialStorage implements CredentialStorage {

  constructor(private credentialsKey: string) {}

  async getCredentials(): Promise<Credentials | null> {
    const value = localStorage.getItem(this.credentialsKey);
    if (!value) {
      return null;
    }
    const credentials: Credentials = JSON.parse(value);
    return credentials;
  }

  async setCredentials(credentials: Credentials): Promise<void> {
    localStorage.setItem(this.credentialsKey, JSON.stringify(credentials));
  }

  async clearCredentials(): Promise<void> {
    localStorage.removeItem(this.credentialsKey);
  }
}
