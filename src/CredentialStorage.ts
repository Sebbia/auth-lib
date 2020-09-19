import Credentials from './Credentials';

export default interface CredentialStorage {
  getCredentials(): Promise<Credentials | null>;
  setCredentials(credentials: Credentials): Promise<void>;
  clearCredentials(): Promise<void>;
}
