import  AuthClient  from '../AuthClient';
import LocalCredentialStorage from '../LocalCredentialStorage';
import { GraphQLClient } from '../GraphQLClient';

const storage = new LocalCredentialStorage('credentials');

async function mockGraphQLClient<T>(
  configure: (clientMock: jest.Mock<any, any>) => void,
  block: (client: AuthClient) => Promise<T>
): Promise<T> {
  const executeRequest = jest.fn();
  configure(executeRequest);

  const graphQLClient: GraphQLClient = {
    executeRequest: executeRequest,
  };

  const authClient = new AuthClient(graphQLClient, storage);
  return block(authClient);
}

test('AuthClient test login', async () => {
  return mockGraphQLClient(
    fn => {
      fn.mockReturnValueOnce(
        Promise.resolve({ auth: { login: { idToken: 'idToken', expiresAt: 10, refreshToken: 'refreshToken' } } })
      );
    },
    async authClient => {
      await authClient.login('test', 'test');
      expect(authClient.credentials).not.toBeNull();
    }
  );
});

test('AuthСlient throw error on refresh without credentials', async () => {
  return mockGraphQLClient(
    fn => {
      fn.mockReturnValueOnce(JSON.stringify({ idToken: 'idToken', expiresAt: 10, refreshToken: 'refreshToken' }));
    },
    async authClient => {
      try {
        return await authClient.refresh();
      } catch (e) {
        expect(e.message).toMatch('Not authorized');
      }
    }
  );
});

test('AuthClient refreshes with old credentials', async () => {
  return mockGraphQLClient(
    fn => {
      fn.mockReturnValueOnce(
        Promise.resolve({ auth: { login: { idToken: 'idToken', expiresAt: 10, refreshToken: 'refreshToken' } } })
      ).mockReturnValueOnce(
        Promise.resolve({ auth: { idToken: 'anotherIdToken', expiresAt: 10, refreshToken: 'anotherRefreshToken' } })
      );
    },
    async authClient => {
      return await authClient
        .login('test', 'test')
        .then(async () => {
          const oldCredentials = authClient.credentials;
          await authClient.refresh();
          return oldCredentials;
        })
        .then(oldCredentials => {
          expect(oldCredentials).not.toEqual(authClient.credentials);
        });
    }
  );
});
