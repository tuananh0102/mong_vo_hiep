// Nạp cho trình duyệt: Vite gom mọi JSON trong du_lieu/ lúc build.
import { napDuLieu } from './nap'

const tep = import.meta.glob('../../../du_lieu/**/*.json', { eager: true, import: 'default' })
const chuanHoa = Object.fromEntries(
  Object.entries(tep).map(([k, v]) => [k.replace(/^.*\/du_lieu\//, ''), v]),
)

export const DU_LIEU = napDuLieu(chuanHoa)
