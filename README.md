# Ping Keeper Action

[![GitHub Super-Linter](https://github.com/hohoonsong/actions-ping-keeper/actions/workflows/linter.yml/badge.svg)](https://github.com/super-linter/super-linter)
![CI](https://github.com/hohoonsong/actions-ping-keeper/actions/workflows/ci.yml/badge.svg)

## Description
This Action make http GET request to given url.
you can add header and basic auth.
assert response status, header, json body.
it can work with 6 match indicators.
* c_ : check if value contains given word
* nc_ : check if value does not contain given word
* e_ : check if given key exists
* ne_ : check if given key does not exist
* r_ : check if value matches given regex
* nr_ check if value does not match given regex

## Usage
### Inputs
| name     | required | type                 | default | description |
|----------|----------|----------------------|----| ----------- |
| url      | yes      | string               |    | The url which you want to test
| max-attempts | no       | string formatted number | `1` | Max attempts to retry
| retry-delay   | no       | string formatted number | `3` | Delay between retries
| follow-redirect   | no       | string formatted boolean | `false` | Flag for follow redirect response
| headers   | no       | string |    | Headers you want to attatch to request. it's format is `Name=Value,Name=Value`
| basic-auth   | no       | string |    | Credentials used with request. it's format is `login:password`. Recommanded to use github secrets
| expected-status   | no       | string | `200` | Http status codes you expect. it's format is `200,301`
| expected-header   | no       | string |    | Response headers you expect. it's format is `key:c_value,key2:e_,key3:r_*alu*`
| expected-body   | no       | string |  | Response bodies you expect. it only accept json body. it's format is `key:c_value,key2:e_,key3:r_*alu*`

### Outputs
| name      | type                  | description |
|----------|----------------------| ----------- |
| assert-status  | string          | Boolean value for if response status code is what you expected
| assert-header  | string          | Boolean value for if response header is what you expected
| assert-body  | string          | Boolean value for if response body is what you expected
| actual-status  | string          | Actual Http status code you received
| actual-header  | string          | Actual Http response headers you received
| actual-data  | string          | Actual Http response bodies you received

## Example usage

Check out [`EXAMPLE_TEMPLATE.md`](./EXAMPLE_TEMPLATE.md) and [`EXAMPLE_OUTPUT.md`](./EXAMPLE_OUTPUT.md) for more examples and their outputs.

Workflow:

```yml
name: Ping keeper
on:
  schedule:
    - cron: '0 */2 * * *' # every 2 hours
  push:
    branches: [ master ]
jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
      with:
        fetch-depth: 0
    - name: Ping my service
      uses: hohoonsong/actions-ping-keeper@v1
      with:
        url: http://echo.jsontest.com/key/value/one/two
        max-attempts: "2"
        retry-delay: "5"
        follow-redirect: true
        expected-status: 200,301
        expected-header: content-type:nc_json
        expected-body: key:r_*al*,one:c_two,three:ne_
```
