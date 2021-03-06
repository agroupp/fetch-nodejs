class Response {
    constructor({headers, statusCode, statusMessage, url, data}) {
        this.headers = headers;
        this.status = statusCode;
        this.statusText = statusMessage;
        this.url = url;
        this.body = data;
    }

    json() {
        return new Promise((resolve, reject) => {
            try {
                const dataObj = JSON.parse(this.body);
                resolve(dataObj);
            } catch(parseError) {
                reject('JSON parsing error: ' + parseError);
            }    
        })
    }
}
module.exports = Response;