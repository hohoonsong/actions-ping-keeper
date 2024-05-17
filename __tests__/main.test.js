/**
 * Unit tests for the action's main functionality, src/main.js
 */
const main = require('../src/main')
const core = require('@actions/core')

// Mock the GitHub Actions core library
const getInputMock = jest.spyOn(core, 'getInput')
const getBooleanInputMock = jest.spyOn(core, 'getBooleanInput')
const setOutputSpy = jest.spyOn(core, 'setOutput')
const setFailedSpy = jest.spyOn(core, 'setFailed')

describe('ping-keeper', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should assert status-code, header, multiple bodies', () => {
    getInputMock.mockImplementation(name => {
      switch (name) {
        case 'url':
          return 'http://echo.jsontest.com/key/value/one/two'
        case 'max-attempts':
          return '3'
        case 'retry-delay':
          return '3'
        case 'follow-redirect':
          return 'true'
        case 'expected-status':
          return '200,301'
        case 'expected-header':
          return 'content-type:c_json'
        case 'expected-body':
          return 'key:r_*al*,one:c_two,three:ne_'
        default:
          return ''
      }
    })
    getBooleanInputMock.mockImplementation(name => {
      switch (name) {
        case 'follow-redirect':
          return true
        default:
          return true
      }
    })

    main.run()
    expect(setOutputSpy).toHaveBeenCalledWith('assert-status', true)
    expect(setOutputSpy).toHaveBeenCalledWith('assert-header', true)
    expect(setOutputSpy).toHaveBeenCalledWith('assert-body', true)
    expect(setFailedSpy).not.toHaveBeenCalled()
  })

  it('should assert status-code, multiple header, multiple bodies', () => {
    getInputMock.mockImplementation(name => {
      switch (name) {
        case 'url':
          return 'http://echo.jsontest.com/key/value/one/two'
        case 'max-attempts':
          return '3'
        case 'retry-delay':
          return '3'
        case 'follow-redirect':
          return 'true'
        case 'expected-status':
          return '200,301'
        case 'expected-header':
          return 'content-type:c_json,server:r_Google*'
        case 'expected-body':
          return 'key:r_*al*,one:c_two,three:ne_'
        default:
          return ''
      }
    })
    getBooleanInputMock.mockImplementation(name => {
      switch (name) {
        case 'follow-redirect':
          return true
        default:
          return true
      }
    })

    main.run()
    expect(setOutputSpy).toHaveBeenCalledWith('assert-status', true)
    expect(setOutputSpy).toHaveBeenCalledWith('assert-header', true)
    expect(setOutputSpy).toHaveBeenCalledWith('assert-body', true)
    expect(setFailedSpy).not.toHaveBeenCalled()
  })

  it('should fail because expected status not match', () => {
    getInputMock.mockImplementation(name => {
      switch (name) {
        case 'url':
          return 'http://echo.jsontest.com/key/value/one/two'
        case 'max-attempts':
          return '3'
        case 'retry-delay':
          return '3'
        case 'follow-redirect':
          return 'true'
        // cause failure
        case 'expected-status':
          return '404,502'
        default:
          return ''
      }
    })
    getBooleanInputMock.mockImplementation(name => {
      switch (name) {
        case 'follow-redirect':
          return true
        default:
          return true
      }
    })

    main.run()
    expect(setFailedSpy).toHaveBeenCalled()
  })

  it('should fail because expected bodies assertion', () => {
    getInputMock.mockImplementation(name => {
      switch (name) {
        case 'url':
          return 'http://echo.jsontest.com/key/value/one/two'
        case 'max-attempts':
          return '3'
        case 'retry-delay':
          return '3'
        case 'follow-redirect':
          return 'true'
        case 'expected-status':
          return '200,301'
        // cause failure
        case 'expected-header':
          return 'content-type:nc_json'
        case 'expected-body':
          return 'key:r_*al*,one:c_two,three:ne_'
        default:
          return ''
      }
    })
    getBooleanInputMock.mockImplementation(name => {
      switch (name) {
        case 'follow-redirect':
          return true
        default:
          return true
      }
    })

    main.run()
    expect(setFailedSpy).toHaveBeenCalled()
  })
})
