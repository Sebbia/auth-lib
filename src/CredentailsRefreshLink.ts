import { TokenRefreshLink } from 'apollo-link-token-refresh';
import AuthClient from './AuthClient'


export function createTokenRefreshLink(authClient: AuthClient): TokenRefreshLink {
    return new TokenRefreshLink ({
        accessTokenField: 'idToken',
        isTokenValidOrUndefined: () => {
            return authClient.isCredentialsValidOrUndefined()
        },
        fetchAccessToken: async () => {
            await authClient.refresh()
            const myBlob = new Blob([JSON.stringify(authClient.credentials, null, 2)], { type: 'application/json' });
            const init = { status: 200, statusText: 'ok' };
            return new Response(myBlob, init)
        },
        handleFetch: () => {},
        handleError: async err => {
            throw new Error('RefreshTokenLink error: ' + err)
        }
    })
}