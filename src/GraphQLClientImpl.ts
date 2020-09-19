import { promiseTimeout } from './tools';
import { AuthError, AuthErrorCode } from './errors';
import { GraphQLClient } from './GraphQLClient';

export default class GraphQLClientImpl implements GraphQLClient {

  constructor(private graphqlEndpoint: string, private timeoutInMsec: number) {}

  async executeRequest(query: string, variables: any): Promise<any> {
    const authRequest = {
      query: query,
      variables: variables,
      operationName: null,
    };
    const res = await promiseTimeout(
      this.timeoutInMsec,
      fetch(this.graphqlEndpoint, {
        method: 'POST',
        credentials: 'omit',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
        },
        body: JSON.stringify(authRequest),
      })
    );
    if (!(res.status >= 200 && res.status <= 300)) {
      throw new AuthError(AuthErrorCode.NETWORK, `Response status is invalid: ${res.status}`);
    }

    const contentType = res.headers.get('content-type');
    if (contentType?.includes('application/json') !== true) {
      throw new AuthError(AuthErrorCode.NETWORK, `Invalid response content type: ${contentType}`);
    }
    const result = await res.json();
    if (result.errors?.length > 0) {
      // TODO parse error code, check for BAD_CREDENTIALS
      throw new AuthError(AuthErrorCode.BAD_CREDENTIALS, 'There is an error in response: ' + result.errors[0].message);
    }

    return result.data;
  }
}
