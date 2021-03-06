import executeTests from './execute-tests'
import { SUPPRESS_TESTS } from '../../regexp'
import TESTS from '../../../assets/testRef'
import wontTimeout from './loop-protect';
/* eslint-disable no-eval */

export default (code, id) => {

  // import funcs used in executeTests so in
  // scope during eval, see ./execute-tests.js

  /* eslint-disable no-unused-vars */
  const assert = require('assert')
  const { forEach, invoke } = require('lodash')
  const { beginTests, logTestReport } = require('./testReport')
  const isTestDisabled = require('../common/is-test-disabled')
  /* eslint-enable no-unused-vars */

  let prepend = 'const tests = ', tail = '', tests = ''

  // if suppressTests is true or tests do not exist
  // only eval code, otherwise eval & execute tests
  if (!SUPPRESS_TESTS.test(code) && TESTS[id]) {
    tests = prepend + JSON.stringify(TESTS[id].tests)
    if (TESTS[id].tail) tail += TESTS[id].tail
  }

  // run loop-protect first
  if (wontTimeout(code)) {
    try {
      eval(
        code +
        tail +
        tests +
        executeTests
      )
    } catch (e) {
      console.log(e.toString())
    }
  }
}
