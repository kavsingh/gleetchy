import { spawn } from 'child_process'

import type { SpawnOptions } from 'child_process'

const spawnAsync = (
  cmd: string,
  args: string[] = [],
  opts: SpawnOptions = {},
) =>
  new Promise((resolve, reject) => {
    const proc = spawn(cmd, args, Object.assign({ stdio: 'inherit' }, opts))
    proc.on('close', (code) => (code === 0 ? resolve(code) : reject(code)))
  })

export default spawnAsync
