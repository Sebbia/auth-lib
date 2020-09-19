import LocalCredentialStorage from '../LocalCredentialStorage';

test('Test LocalCredentialStorage', async () => {
  const storage = new LocalCredentialStorage('credentials');

  await storage.setCredentials({ idToken: 'idToken', expiresAt: 10, refreshToken: 'refreshToken' });

  const credentials = await storage.getCredentials();
  expect(credentials?.idToken).toBe('idToken');
  expect(credentials?.refreshToken).toBe('refreshToken');

  await storage.clearCredentials();

  expect(await storage.getCredentials()).toBeNull();
});
