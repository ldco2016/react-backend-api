import {
  defaultFetchHeaders,
  callApiFactory,
  callApi,
  DEFAULT_URL,
} from './index';
var mockFetch;

jest.mock('whatwg-fetch', () => {
  mockFetch = require('jest-fetch-mock');
  // set default response
  mockFetch.mockResponse(JSON.stringify({}));
  fetch = mockFetch; //eslint-disable-line no-global-assign
});

describe('callApi', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  it('should call fetch with defaultOptions and default url', () => {
    callApi();
    expect(mockFetch).toBeCalled();
    expect(mockFetch).lastCalledWith('http://localhost/', defaultFetchHeaders);
  });

  it('should merge user defined options with defaultOptions', () => {
    const options = {
      headers: {
        authorizationtoken: 'dfsdfsdf',
      },
    };
    callApi(undefined, options);
    expect(mockFetch).toBeCalled();
    expect(mockFetch).lastCalledWith('http://localhost/', {
      compress: false,
      credentials: 'same-origin',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        authorizationtoken: 'dfsdfsdf',
      },
    });
  });

  it('should make accept relative urls', () => {
    callApi('/api/entity');
    expect(mockFetch).toBeCalled();
    expect(mockFetch).lastCalledWith(
      'http://localhost/api/entity',
      defaultFetchHeaders
    );
  });

  it('should return a promise', () => {
    const results = callApi('/api/entity');
    expect(results).toBeDefined();
    expect(typeof results).toBe('object');
    expect(typeof results.then).toBe('function');
  });

  it('should resolve to an object, containing the resp and parse json', () => {
    const responseJson = { id: 1 };
    mockFetch.mockResponseOnce(JSON.stringify(responseJson), { status: 200 });
    return callApi('/api/entity').then(results => {
      expect(results).toBeDefined();
      expect(typeof results).toBe('object');
      const { resp, json } = results;
      expect(json).toBeDefined();
      expect(json).toEqual(responseJson);
      expect(resp).toBeDefined();
      expect(resp.ok).toBe(true);
    });
  });

  it('should return json as null for 204 response', () => {
    mockFetch.mockResponseOnce('', { status: 204 });
    return callApi('/api/entity').then(({ json }) => {
      expect(json).toBe(null);
    });
  });

  // This may feel odd, but the return json can be used
  // for messaging to the user. Also sometimes failure is ok!
  it('should resolve with parse json even on `!response.ok`', () => {
    const responseJson = { message: 'Invalid or missing token' };
    mockFetch.mockResponseOnce(JSON.stringify(responseJson), { status: 403 });
    return callApi('/api/entity').then(({ json, resp }) => {
      expect(json).toEqual(responseJson);
      expect(resp.ok).toBe(false);
      expect(resp.status).toBe(403);
    });
  });

  it('should return message on bad request', () => {
    const message = 'Bad Request';
    mockFetch.mockResponseOnce(message, { status: 400 });
    return callApi('/api/entity').then(({ json, resp }) => {
      expect(json).toEqual({message});
      expect(typeof json).toBe('object');
      expect(resp.status).toBe(400);
    });
  });

  it('should return error on 500 (Internal Server Error)', () => {
    mockFetch.mockResponseOnce('Internal Server Error', { status: 500 });
    return callApi('/api/entity').then(
      () => {
        expect.fail('It should have return an Internal Server Error message');
      },
      err => {
        expect(err).toBeDefined();
        expect(typeof err).toBe('object');
        expect(err.json.message).toEqual('Internal Server Error');
      }
    );
  });

  it('should normalize json as camelCase values deeply', () => {
    const sampleObject = {
      Id: 1,
      FirstName: 'Kyle',
      Addresses: [{ city: 'Nashville' }, { State: 'TN' }],
    };
    const sampleArray = [
      {
        Id: 1,
        First_Name: 'Kyle',
        Addresses: [{ City: 'Nashville' }, { State: 'TN' }],
        1: { Name: 'Bill' },
        '2': { Name: 'Jane' },
      },
      'Joe',
      {
        Foo: {
          BAR: {
            Fizz: [{ Buzz: 1 }],
          },
        },
      },
    ];
    mockFetch.mockResponses(
      [JSON.stringify(sampleObject)],
      [JSON.stringify(sampleArray)]
    );
    return Promise.all([
      callApi().then(({ json }) => expect(json).toMatchSnapshot()),
      callApi().then(({ json }) => expect(json).toMatchSnapshot()),
    ]);
  });

  it('should allow for normalize json to be toggled off', () => {
    const sampleObject = {
      Id: 1,
      FirstName: 'Kyle',
      Addresses: [{ city: 'Nashville' }, { State: 'TN' }],
    };
    const sampleArray = [
      {
        Id: 1,
        First_Name: 'Kyle',
        Addresses: [{ City: 'Nashville' }, { State: 'TN' }],
        1: { Name: 'Bill' },
        '2': { Name: 'Jane' },
      },
      'Joe',
      {
        Foo: {
          BAR: {
            Fizz: [{ Buzz: 1 }],
          },
        },
      },
    ];
    mockFetch.mockResponses(
      [JSON.stringify(sampleObject)],
      [JSON.stringify(sampleArray)]
    );
    return Promise.all([
      callApi(null, {}, { normalize: false }).then(({ json }) =>
        expect(json).toMatchSnapshot()
      ),
      callApi(null, {}, { normalize: false }).then(({ json }) =>
        expect(json).toMatchSnapshot()
      ),
    ]);
  });

  it('should handle null/empty array/undefined within results', () => {
    const sampleObject = {
      Id: 1,
      FirstName: 'Kyle',
      Organization: null,
      Addresses: [],
      Phones: undefined,
      LastName: 'Welch',
    };
    mockFetch.mockResponseOnce(JSON.stringify(sampleObject));
    return callApi().then(({ json }) => expect(json).toMatchSnapshot());
  });
});

describe('callApiFactory', () => {
  it('should return a function', () => {
    expect(typeof callApiFactory()).toBe('function');
  });
  it('should accept/prepend base url', () => {
    const baseUrl = 'https://test';
    const restUrl = '/rest-of-url';
    const callApi = callApiFactory(baseUrl);

    callApi(restUrl);
    expect(mockFetch).lastCalledWith(baseUrl + restUrl, defaultFetchHeaders);
  });
  it('should prefer call url if both it and baseUrl are absolute', () => {
    const baseUrl = 'https://base';
    const restUrl = 'https://call/';
    const callApi = callApiFactory(baseUrl);

    callApi(restUrl);
    expect(mockFetch).lastCalledWith(restUrl, defaultFetchHeaders);
  });
  it('should merge base options with call options', () => {
    const baseOptions = {
      base: 'test',
      headers: {
        appId: '1',
      },
    };
    const restOptions = {
      headers: {
        'x-something': 'stuff',
      },
      stuff: 'more-stuff',
    };

    const callApi = callApiFactory(null, baseOptions);

    callApi(null, restOptions);
    expect(mockFetch).lastCalledWith(
      DEFAULT_URL + '/',
      expect.objectContaining({
        base: 'test',
        headers: expect.objectContaining({
          appId: '1',
          'x-something': 'stuff',
        }),
        stuff: 'more-stuff',
      })
    );
  });
  it('should give call options precedence over base options', () => {
    const baseOptions = {
      base: 'test',
      headers: {
        appId: '1',
      },
    };
    const restOptions = {
      base: 'overwrite',
      headers: {
        appId: '2',
      },
      stuff: 'more-stuff',
    };

    const callApi = callApiFactory(null, baseOptions);

    callApi(null, restOptions);
    expect(mockFetch).lastCalledWith(
      DEFAULT_URL + '/',
      expect.objectContaining({
        base: 'overwrite',
        headers: expect.objectContaining({
          appId: '2',
        }),
        stuff: 'more-stuff',
      })
    );
  });

  it('should be able to called twice with different options', () => {
    const baseOptions = {
      base: 'test',
      headers: {
        appId: '1',
      },
    };
    const optionsA = {
      base: 'overwrite',
      headers: {
        appId: '2',
      },
      stuff: 'more-stuff',
    };

    const optionsB = {
      base: 'repeated',
      headers: {
        appId: '3',
      },
      body: JSON.stringify({ test: 'pass' }),
    };

    const callApi = callApiFactory(null, baseOptions);

    callApi(null, optionsA);
    expect(mockFetch).lastCalledWith(
      DEFAULT_URL + '/',
      expect.objectContaining({
        base: 'overwrite',
        headers: expect.objectContaining({
          appId: '2',
        }),
        stuff: 'more-stuff',
      })
    );

    callApi(null, optionsB);
    expect(mockFetch).lastCalledWith(
      DEFAULT_URL + '/',
      expect.objectContaining({
        base: 'repeated',
        headers: expect.objectContaining({
          appId: '3',
        }),
        body: '{"test":"pass"}',
      })
    );

    callApi(null, {});
    expect(mockFetch).lastCalledWith(
      DEFAULT_URL + '/',
      expect.objectContaining({
        base: 'test',
        headers: expect.objectContaining({
          appId: '1',
        }),
      })
    );
  });
});
