import { docTepDia } from '../src/du_lieu/nap_node'
import { napDuLieu } from '../src/du_lieu/nap'

const tep = docTepDia()
try {
  napDuLieu(tep)
  console.log(`OK (${Object.keys(tep).length} tệp)`)
} catch (e) {
  console.error((e as Error).message)
  process.exit(1)
}
