import  GraphQLClientImpl  from '../GraphQLClientImpl';
import 'whatwg-fetch';
import { AuthError } from '../errors';
const client = new GraphQLClientImpl('', 1000);
const data = { data: 'some_data' };
const errorData = {errors: [{message: "bad credentials"}]}
const header = new Headers({ 'Content-Type': 'application/json' });
const badHeader = new Headers({ 'Content-Type': 'image/jpeg' });
const myBlob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
const badBlob = new Blob([JSON.stringify(errorData, null, 2)], { type: 'application/json' });
const init = { status: 200, statusText: 'ok' };
const validResponse = new Response(myBlob, init);
const errorResponse = new Response(badBlob, init)

async function mockFetch<T>(configure: (fetchMock: jest.Mock<any, any>) => void, block: () => Promise<T>): Promise<T> {
  const oldFetch = window.fetch;
  try {
    const newFetch = jest.fn();
    window.fetch = newFetch;
    configure(newFetch);

    return block();
  } finally {
    window.fetch = oldFetch;
  }
}

test('Test GraphQLClient bad status', async () => {
  return mockFetch(
    fetch => {
      fetch.mockReturnValueOnce(Promise.resolve({ data, status: 400, headers: header }));
    },
    async () => {
      try {
        return await client.executeRequest('', {});
      } catch (e) {
        expect(e).toBeInstanceOf(AuthError);
        expect(e.message).toMatch('Response status is invalid');
      }
    }
  );
});

test('Test GraphQLClient bad content-type', async () => {
  return mockFetch(
    fetch => {
      fetch.mockReturnValueOnce(Promise.resolve({ data, status: 200, headers: badHeader }));
    },
    async () => {
      try {
        return await client.executeRequest('', {});
      } catch (e) {
        expect(e).toBeInstanceOf(AuthError);
        expect(e.message).toMatch('Invalid response content type');
      }
    }
  );
});
test('Test GraphQLClient server error', async () => {
  return mockFetch(
    fetch => {
      fetch.mockReturnValueOnce(Promise.resolve(errorResponse));
    },
    async () => {
      try {
        return await client.executeRequest('', {});
      } catch (e) {
        expect(e).toBeInstanceOf(AuthError);
        expect(e.message).toMatch('There is an error in response');
      }
    }
  );
});
test('Test GraphQLClient timeout', async () => {
  return mockFetch(
    fetch => {
      fetch.mockReturnValueOnce(
        new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve({ data, status: 400, headers: header });
          }, 1100);
        })
      );
    },
    async () => {
      try {
        return await client.executeRequest('', {});
      } catch (e) {
        expect(e).toBeInstanceOf(AuthError);
        expect(e.message).toMatch('Timed out in');
      }
    }
  );
});
test('Test GraphQLClient valid response', async () => {
  return mockFetch(
    fetch => {
      fetch.mockReturnValueOnce(Promise.resolve(validResponse));
    },
    async () => {
      const data = await client.executeRequest('', {});
      expect(data).toBe('some_data');
    }
  );
});
