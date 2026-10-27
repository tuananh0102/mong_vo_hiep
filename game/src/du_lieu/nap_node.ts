// Nạp cho Node (script trong cong_cu/ và test): đọc đệ quy du_lieu/ bằng node:fs.
import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { napDuLieu } from './nap'

const GOC = fileURLToPath(new URL('../../../du_lieu', import.meta.url))

export function docTepDia(): Record<string, unknown> {
  const tep: Record<string, unknown> = {}
  for (const f of readdirSync(GOC, { recursive: true, encoding: 'utf8' })) {
    const duong = f.replaceAll('\\', '/')
    if (duong.endsWith('.json')) tep[duong] = JSON.parse(readFileSync(join(GOC, f), 'utf8'))
  }
  return tep
}

export function napTuDia() {
  return napDuLieu(docTepDia())
}
