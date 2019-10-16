const compare = require('js-functions').Utility.compare

const constants = {
  LOG_LEVEL: {
    'ERROR': 1,
    'WARN': 2,
    'INFO': 3,
    'DEBUG': 4
  }
}
function getLogLevel () {
  let logCandidates = {
    node: null,
    browser: null,
    constant: constants.LOG_LEVEL.DEBUG
  }

  if (typeof process === 'object' && typeof process.env === 'object' && process.env.LOG_LEVEL) {
    logCandidates.node = process.env.LOG_LEVEL
  }

  if (typeof window === 'object' && typeof window.env === 'object' && window.env.LOG_LEVEL) {
    logCandidates.browser = window.env.LOG_LEVEL
  }

  return logCandidates.node || logCandidates.browser || logCandidates.constant
}
let LOG_LEVEL = getLogLevel()// Not constant because may be editable through non static methods in future.

function checkComparator (comparator) {
  const ALLOWED = ['<=', '<', '=', '>', '>=']
  return ALLOWED.indexOf(comparator) >= 0
}

function makeErrorJsonable (item) {
  var jsonable = {}

  Object.getOwnPropertyNames(item).forEach((key) => {
    jsonable[key] = item[key]
  })

  return jsonable
}

/**
 * Log handling
 * @public
 */
class Log {
  constructor () {
    // constructor reserved for ability for dynamic settings.
  }

  /**
     * Logging by set log level.
     *
     * @param {String} level Log level(constants.LOG_LEVEL key)
     * @param {Function} h Log function
     * @param {Array} args Arguments list
     */
  static _log (level, h, args = []) {
    const setLevel = LOG_LEVEL
    const setConstLevel = constants.LOG_LEVEL[setLevel]
    const curLevel = (setConstLevel !== undefined) ? setConstLevel : constants.LOG_LEVEL.DEBUG

    const targetLevel = constants.LOG_LEVEL[level]
    const bool = compare(curLevel, targetLevel, '=')

    if (bool) {
      args = Array.prototype.slice.call(args)// Arguments List => array
      args = args.map((item) => {
        // JSON stringify => parse formats object in full format.
        if (item instanceof Error) {
          item = makeErrorJsonable(item)

          return JSON.parse(JSON.stringify(item))
        } else {
          return item
        }
      })
      h(...args)
    }
  }

  /**
     * Sets current log level with comparator for filtering logs.
     * @param {String} level
     * @param {String} comparator operator for comparison. Default is =.
     */
  static setLevel (level, comparator = '=') {
    const bool = checkComparator(comparator)
    if (bool) {
      LOG_LEVEL = comparator
    }
    return bool
  }

  /**
     * catch / error event logging
     */
  static error () {
    Log._log('ERROR', console.error, arguments)
  }

  /**
     * Deprecations, etc.
     */
  static warn () {
    Log._log('WARN', console.warn, arguments)
  }

  /**
     * Info logging. For important logging.
     */
  static info () {
    Log._log('INFO', console.info, arguments)
  }

  /**
     * Debug logging.
     */
  static debug () {
    Log._log('DEBUG', console.info, arguments)
  }
}

if (typeof window === 'object') {
  window.Log = Log
}
if (typeof module === 'object') {
  module.exports = Log
}
