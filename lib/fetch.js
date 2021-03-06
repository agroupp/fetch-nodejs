const http = require('http');
const https = require('https');
const { URL } = require('url');

const Response = require('./response.class');
const Params = require('./params.class');
const Headers = require('./headers.class');

function _upper(str) {
    return str.slice(0, 1).toUpperCase() + str.slice(1);
}

/**
 * fetch() method implementation
 * @param {string} urlString
 * @param {object} options {params, headers}
 * @returns {Promise<Response>}
 */
module.exports = (urlString, options) => {
    return new Promise((resolve, reject) => {
        if (!urlString || urlString.length < 1) reject('url is not provided');
        if (options && options.params && options.params.size > 0) {
            let q = '?';
            let index = 0;
            for(let param of options.params) {
                q += (index > 0) ? `&${param[0]}=${param[1]}` : `${param[0]}=${param[1]}`;
                index++;
            }
            urlString += q;
        }
        const _url = new URL(urlString);
        const requestOptions = {
            protocol: _url.protocol,
            port: _url.port,
            hostname: _url.hostname,
            path: _url.pathname + _url.search,
            method: 'GET'
        }
        const protocol = (requestOptions.protocol === 'http:') ? http : https;
        const request = protocol.request(requestOptions, (res) => {
            // const contentType = res.headers['content-type'] || undefined;
            if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
                /** Buffer for collecting data from response */
                let dataStream = '';
                res.on('data', (data) => {
                    dataStream += data;
                });

                /** After all chunks collected result can be resolved */
                res.on('end', () => {
                    /** Headers adduction */
                    const headers = {};
                    for (let key in res.headers) {
                        const value = res.headers[key];
                        let k = key.split('-');
                        k = k.map((_k, index) => (index > 0) ? _upper(_k) : _k);
                        key = k.join('');
                        headers[key] = value;
                    }

                    /** Return Response object */
                    resolve(new Response({
                        headers: headers,
                        statusCode: res.statusCode,
                        statusMessage: res.statusMessage,
                        url: res.url,
                        data: dataStream.toString('binary')
                    }));
                });
            } else {
                reject({statusCode: res.statusCode, message: res.statusMessage});
            }
            res.on('error', (err) => reject(err));
        });

        if (options && options.headers && options.headers.size > 0) {
            for(const header of options.headers) {
                request.setHeader(header[0], header[1]);
            }    
        }

        request.on('error', (err) => reject(err));
        request.end();
    });
}