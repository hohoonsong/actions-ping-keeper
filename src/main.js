const core = require('@actions/core')
const { wait } = require('./wait')
const request = require('sync-request-curl')
const anymatch = require('anymatch');

function run() {
  try {
    // request inputs
    const url = core.getInput('url', { required: true })
    const maxAttemptsString = core.getInput('max-attempts', { required: false })
    const maxAttempts = parseInt(maxAttemptsString)
    const retryDelayString = core.getInput('retry-delay', { required: false })
    const retryDelay = parseInt(retryDelayString)
    const followRedirect = core.getBooleanInput('follow-redirect')
    const headersString = core.getInput('headers', { required: false })
    const headers = headersString.length > 0 ? headersString.split(',') : []
    const basicAuth = core.getInput('basic-auth', { required: false })
    // expected response inputs
    const expectedHeaderString = core.getInput('expected-header')
    const expectedHeader =
      expectedHeaderString.length > 0 ? expectedHeaderString.split(',') : []
    const expectedStatusString = core.getInput('expected-status')
    const expectedStatus = expectedStatusString.split(',')
    const expectedBodyString = core.getInput('expected-body')
    const expectedBody =
      expectedBodyString.length > 0 ? expectedBodyString.split(',') : []

    const assertResponse = (actualStatus, actualData, actualHeader) => {
      core.setOutput('actual-status', actualStatus)
      core.setOutput('actual-header', actualHeader)
      core.setOutput('actual-data', actualData)

      // Assert status code
      if (expectedStatus.includes(actualStatus.toString())) {
        core.setOutput('assert-status', true)
      } else {
        core.setOutput('assert-status', false)
        return false
      }

      // Assert header
      for (const eHeader in expectedHeader) {
        const eHeaderKey = expectedHeader[eHeader].split(':')[0]
        let eHeaderValue = expectedHeader[eHeader].split(':')[1]
        const compare = eHeaderValue.split('_')[0]
        eHeaderValue = eHeaderValue.replace(compare.concat('_'), '')

        // e(exist), ne(not exist)
        if (compare === 'e') {
          if (Object.keys(actualHeader).includes(eHeaderKey)) {
            core.setOutput('assert-header', true)
          } else {
            core.setOutput('assert-header', false)
            return false
          }
        }

        if (compare === 'ne') {
          if (!Object.keys(actualHeader).includes(eHeaderKey)) {
            core.setOutput('assert-header', true)
          } else {
            core.setOutput('assert-header', false)
            return false
          }
        }

        // c(contains), r(regex match), nc(not contains), nr(not regex match)
        for (const aHeaderKey in actualHeader) {
          const aHeaderValue = actualHeader[aHeaderKey]
          if (eHeaderKey !== aHeaderKey) {
            continue
          }

          if (compare === 'c') {
            if (aHeaderValue.includes(eHeaderValue)) {
              core.setOutput('assert-header', true)
            } else {
              core.setOutput('assert-header', false)
              return false
            }
          }

          if (compare === 'nc') {
            if (!aHeaderValue.includes(eHeaderValue)) {
              core.setOutput('assert-header', true)
            } else {
              core.setOutput('assert-header', false)
              return false
            }
          }

          if (compare === 'r') {
            if (anymatch(eHeaderValue, aHeaderValue)) {
              core.setOutput('assert-header', true)
            } else {
              core.setOutput('assert-header', false)
              return false
            }
          }

          if (compare === 'nr') {
            if (!anymatch(eHeaderValue, aHeaderValue)) {
              core.setOutput('assert-header', true)
            } else {
              core.setOutput('assert-header', false)
              return false
            }
          }
        }
      }

      // Assert body data
      const responseData = actualData
      try {
        if (typeof responseData === 'object' && responseData !== null) {
          for (const eBody in expectedBody) {
            const eBodyKey = expectedBody[eBody].split(':')[0]
            let eBodyValue = expectedBody[eBody].split(':')[1]
            const compare = eBodyValue.split('_')[0]
            eBodyValue = eBodyValue.replace(compare.concat('_'), '')

            let targetValue = responseData
            let isKeyExist = true
            if (Object.prototype.hasOwnProperty.call(targetValue, eBodyKey)) {
              targetValue = targetValue[eBodyKey]
            } else {
              isKeyExist = false
            }

            // e(exist), ne(not exist)
            if (compare === 'e') {
              if (isKeyExist) {
                core.setOutput('assert-body', true)
                continue
              } else {
                core.setOutput('assert-body', false)
                return false
              }
            }
            if (compare === 'ne') {
              if (!isKeyExist) {
                core.setOutput('assert-body', true)
                continue
              } else {
                core.setOutput('assert-body', false)
                return false
              }
            }

            // c(contains), r(regex match), nc(not contains), nr(not regex match)
            if (compare === 'c') {
              if (targetValue.includes(eBodyValue)) {
                core.setOutput('assert-body', true)
                continue
              } else {
                core.setOutput('assert-body', false)
                return false
              }
            }

            if (compare === 'nc') {
              if (!targetValue.includes(eBodyValue)) {
                core.setOutput('assert-body', true)
                continue
              } else {
                core.setOutput('assert-body', false)
                return false
              }
            }

            if (compare === 'r') {
              if (anymatch(eBodyValue, targetValue)) {
                core.setOutput('assert-body', true)
                continue
              } else {
                core.setOutput('assert-body', false)
                return false
              }
            }

            if (compare === 'nr') {
              if (!anymatch(eBodyValue, targetValue)) {
                core.setOutput('assert-body', true)
              } else {
                core.setOutput('assert-body', false)
                return false
              }
            }
          }
        } else {
          core.setOutput('assert-body', false)
          return false
        }
      } catch (error) {
        core.setOutput('assert-body', false)
        return false
      }

      return true
    }
    for (let i = 0; i < maxAttempts; i++) {
      const res = request('GET', url, {
        setEasyOptions: (curl, options) => {
          curl.setOpt(options.FOLLOWLOCATION, followRedirect)
          if (headers.length > 0) {
            curl.setOpt(options.HTTPHEADER, headers)
          }
          if (basicAuth.length > 0) {
            curl.setOpt(options.USERPWD, basicAuth)
          }
        }
      })

      const isSuccess = assertResponse(
        res.statusCode,
        JSON.parse(res.body.toString()),
        res.headers
      )

      if (isSuccess) {
        return
      } else {
        wait(retryDelay)
      }
    }
  } catch (error) {
    // Fail the workflow run if an error occurs
    core.setFailed(error.message)
  }
  core.setFailed()
}

module.exports = {
  run
}
