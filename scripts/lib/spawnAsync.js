const { spawn } = require('child_process')

module.exports = (cmd, args = [], opts = {}) =>
  new Promise((resolve, reject) => {
    const proc = spawn(cmd, args, Object.assign({ stdio: 'inherit' }, opts))
    proc.on('close', code => (code === 0 ? resolve(code) : reject(code)))
  })
