// @flow
import 'whatwg-fetch';
import { RequestInit } from 'whatwg-fetch';
import { merge } from 'lodash/fp';
import { camelCase } from 'lodash';
import urlLib from 'url';

export const DEFAULT_URL = 'http://localhost';

const normalizeCasing = object => {
  if (!object || typeof object !== 'object') {
    return object;
  }
  if (Array.isArray(object)) {
    return object.map(normalizeCasing);
  }

  return Object.keys(object).reduce((acc, key) => {
    return {
      ...acc,
      [camelCase(key)]: normalizeCasing(object[key]),
    };
  }, {});
};

export const defaultFetchHeaders: { [key: string]: any } = {
  compress: false,
  credentials: 'same-origin',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
};

const cleanBody = entity =>
  Object.keys(entity).reduce((acc, key: string) => {
    const value = entity[key];
    if (value == null || (typeof value === 'string' && !value.trim().length)) {
      return acc;
    }
    if (typeof value === 'object') {
      if (!Object.keys(value).length) {
        return acc;
      }
      return {
        ...acc,
        [key]: cleanBody(value),
      };
    }
    return {
      ...acc,
      [key]: value,
    };
  }, {});

export const isServerError = (status: number) => {
  if (status >= 500 && status < 600) {
    return true;
  }
  return false;
};

type CallApiInit = RequestInit & {
  params?: { [key: string]: string | number },
};

type CallApiOptions = {
  normalize: boolean,
};

const isAbsolutePath = (url: string) => {
  return /https?:\/\//.test(url);
};

export const resolveUrl = (baseUrl: string, url?: string = '') => {
  if (!url) {
    return baseUrl;
  }
  if (baseUrl && isAbsolutePath(baseUrl) && !isAbsolutePath(url)) {
    return urlLib.resolve(baseUrl, url);
  }
  return url;
};

export const callApi = (
  url: string = '',
  options?: CallApiInit = {},
  { normalize = true }?: CallApiOptions = { normalize: true }
) => {
  const apiUrl = resolveUrl(DEFAULT_URL, url);
  const { params, ...restOptions } = options;
  const urlObj = urlLib.parse(apiUrl);
  urlObj.query = urlObj.query || params || '';
  const urlString = urlLib.format(urlObj);
  const fetchOptions = merge(defaultFetchHeaders)(restOptions);
  return fetch(urlString, cleanBody(fetchOptions)).then(resp => {
    if (resp.status !== 204) {
      return resp.json().then(json => {
        const results = {
          json: normalize ? normalizeCasing(json) : json,
          resp,
        };
        return isServerError(resp.status) ? Promise.reject(results) : results;
      });
    }
    return { json: null, resp };
  });
};

export const callApiFactory = (
  baseUrl: string = '',
  baseOptions?: CallApiInit = {}
) => (url: string = '', options?: CallApiInit = {}) => {
  return callApi(resolveUrl(baseUrl, url), merge(baseOptions)(options));
};

export default callApiFactory;
