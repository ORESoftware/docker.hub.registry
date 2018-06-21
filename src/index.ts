'use strict';

import * as https from 'https';
import * as url from 'url';
import * as qs from 'querystring';
import * as assert from "assert";

export const r2gSmokeTest = function () {
  // r2g command line app uses this exported function
  return true;
};

export type EVCallback = (err: any, val?: any) => void;

export const httpGetRequest = function (options: any, cb: EVCallback) {

  let opts = Object.assign({
    headers: {},
    protocol: 'https:',
    hostname: 'registry.hub.docker.com',
    path: '/v1/repositories/node/tags'
  }, options);

  const req = https.get(opts, (res) => {

    res.once('error', cb);
    res.setEncoding('utf8');

    let data = '';
    res.on('data', function (d) {
      data += d;
    });

    res.once('end', function () {

      try {
        return cb(null, JSON.parse(data));
      }
      catch (err) {
        return cb(err);
      }

    });
  });

  req.end();
};

export const getToken = function (v: any, cb: EVCallback) {

  const req = https.get({
      protocol: 'https:',
      hostname: 'auth.docker.io',
      path: '/token?service=registry.docker.io&scope=repository:library/ubuntu:pull'
    },

    function (res) {

      res.once('error', cb);
      res.setEncoding('utf8');

      let data = '';

      res.on('data', function (d) {
        data += d;
      });

      res.once('end', function () {

        try {
          const r = JSON.parse(data) as any;
          assert(typeof r.token === 'string', 'no token property available in JSON response.');
          return cb(null, r.token || r);
        }
        catch (err) {
          return cb(err);
        }

      });

    });

  req.end();

};

export const getTokenp = function (v: any): Promise<string> {
  return new Promise((resolve, reject) => {
    getToken(v, function (err, result) {
      err ? reject(err) : resolve(result);
    });
  });
};

export const makeGetRequestWithToken = function (token: string, options: any, cb: EVCallback) {

  try {
    assert(options && options.path, 'Must pass a "path" property, which points to a Docker hub resource/endpoint.')
  }
  catch (err) {
    return process.nextTick(cb, err);
  }

  let opts = Object.assign({
    headers: {'Authorization': `Bearer ${token}`},
    protocol: 'https:',
    hostname: 'registry-1.docker.io',
    path: '/v2/ubuntu/manifests/latest'
  }, options);

  const req = https.get(opts, (res) => {

    res.once('error', cb);
    res.setEncoding('utf8');

    let data = '';
    res.on('data', function (d) {
      data += d;
    });

    res.once('end', function () {

      console.log('here is the end data:', data);

      try {
        const r = JSON.parse(data) as any;
        return cb(null, r);
      }
      catch (err) {
        return cb(err);
      }

    });
  });

  req.end();

};

// https://hub.docker.com/v2/repositories/library/node/tags

export const makeGetRequestWithTokenp = function (token: string, options: any): Promise<any> {
  return new Promise((resolve, reject) => {
    makeGetRequestWithToken(token, options, function (err, val) {
      err ? reject(err) : resolve(val);
    });
  });
};

export const makeGetRequestp = function (opts: any) {
  return getTokenp(opts).then(token => {
    return makeGetRequestWithTokenp(token, opts);
  });
};

export const makeGetRequest = function (opts: any, cb: EVCallback) {
  getToken(opts, function (err, token) {

    if (err) {
      return cb(err);
    }

    makeGetRequestWithToken(token, opts, cb);
  });
};

// makeGetRequest({path: '/v2/ubuntu/manifests/latest'}, function (err, result) {
//   if (err) throw err;
//   console.log('here is end result:', result);
// });

export const getNodeList = function (options: any, cb: EVCallback) {

  httpGetRequest({
    path: '/v1/repositories/node/tags'
  }, function (err, result) {

    if (err) {
      return cb(err);
    }

    // console.log('results:', result);
    cb(null, result);

  });
};


getNodeList({}, function(err, result){
    if (err) throw err;

    const results = result.map(function(v: any){
        return v.name;
    });

    results.forEach((v:string) => console.log(v));

});
