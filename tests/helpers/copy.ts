import { copyFileSync, existsSync, mkdirSync } from 'node:fs'
import { dirname } from 'node:path'

export default function copy(source: string, target: string) {
    const targetDir = dirname(target)

    if (!existsSync(targetDir)) {
        mkdirSync(targetDir, { recursive: true })
    }

    copyFileSync(source, target)
}
