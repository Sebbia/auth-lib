import Credentials from './Credentials';
import CredentialStorage from './CredentialStorage';
import { MUTATION_LOGIN, MUTATION_REFRESH_TOKEN } from './queries';
import { GraphQLClient } from './GraphQLClient';

export default class AuthClient {
  private credentials_: Credentials | null = null;

  constructor(private graphQLClient: GraphQLClient, private credentialStorage: CredentialStorage) {}

  get credentials() {
    return this.credentials_;
  }

  async setCredentials(value: Credentials) {
    this.credentials_ = value;
    await this.credentialStorage.setCredentials(value);
  }

  async init() {
    this.credentials_ = await this.credentialStorage.getCredentials();
  }

  isAuthorized(): boolean {
    return Boolean(this.credentials);
  }

  isCredentialsValidOrUndefined() {
    return !this.credentials || this.credentials.expiresAt > Date.now();
  }

  async login(login: string, password: string) {
    const response = await this.graphQLClient.executeRequest(MUTATION_LOGIN, {
      login,
      password,
    });
    const loginResponse = response.auth.login;
    await this.setCredentials({
      idToken: loginResponse.idToken,
      refreshToken: loginResponse.refreshToken,
      expiresAt: loginResponse.expiresIn * 1000 + Date.now(),
    });
  }

  async logout() {
    this.credentials_ = null;
    await this.credentialStorage.clearCredentials();
  }

  async tryToRefreshToken() {
    if (!this.credentials) {
      return;
    }
    if (this.credentials.expiresAt > Date.now()) {
      return;
    }
    await this.refresh();
  }

  async refresh() {
    if (!this.credentials) {
      throw new Error('Not authorized');
    }
    const response = await this.graphQLClient.executeRequest(MUTATION_REFRESH_TOKEN, {
      refreshToken: this.credentials.refreshToken,
    });
    const refreshResponse = response.auth.refreshToken;
    await this.setCredentials({
      refreshToken: refreshResponse.refreshToken,
      idToken: refreshResponse.idToken,
      expiresAt: refreshResponse.expiresIn * 1000 + Date.now(),
    });
  }
}
