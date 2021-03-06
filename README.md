# fetch-nodejs
Implementation of Fetch API.

API implemented according to recomendations on [MDN Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API).

## Installation
Install Fetch as an npm module and save it to your package.json file as a dependency:
    
    npm install --save fetch-nodejs



## Usage
Library provides `fetch()` method. It accepts string url as necessary parameter and optional object
with properties `param: Params` and `headers: Headers`. `Params` and `Headers` types extend `Map`, therefore to set params or headers of request use `set()` method with the name and value arguments.

`fetch()` method returns promise that resolves to `Response` type object. Use `res.json()` to get json result.

## Example

```javascript
    const { fetch, Params } = require('fetch-nodejs');

    const params = new Params()
        .set('page_index', 12)
        .set('page_size', 10)

    fetch('http://test-api.tech/rest/users', { params: params })
    .then(res => res.json())
    .then(
        res => console.log(res), 
        err => console.log('Error', err)
    )
```

