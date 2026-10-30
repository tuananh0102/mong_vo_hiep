// 01 mục 10.6: bot chơi trọn kiếp bằng chính sách ngẫu nhiên hợp lệ. Dùng: npm run bot [-- --n 1000]
import { napTuDia } from '../src/du_lieu/nap_node'
import { chayKiep, demTheo, NGAU_NHIEN, pct, soNguyenArg, trungVi } from './choi_bot'

const N = soNguyenArg('--n', 1000)
const dl = napTuDia()
const ds = Array.from({ length: N }, (_, i) => chayKiep(i + 1, dl, NGAU_NHIEN))
const loi = ds.flatMap((k) => k.loi)
const xong = ds.filter((k) => k.tuoi_chet >= 0)

console.log(`Số kiếp: ${N}, kết thúc: ${xong.length}, lỗi: ${loi.length}`)
for (const l of loi.slice(0, 20)) console.log('  LỖI', l)

console.log(`Tuổi chết: trung vị ${trungVi(xong.map((k) => k.tuoi_chet))}`)
const nhom = (t: number) => (t <= 10 ? '0-10' : t <= 25 ? '11-25' : t <= 40 ? '26-40' : t <= 60 ? '41-60' : '61+')
for (const [k, v] of demTheo(xong, (x) => nhom(x.tuoi_chet)).sort()) console.log(`  ${k}: ${pct(v, xong.length)}`)
console.log('Nguyên nhân:')
for (const [k, v] of demTheo(xong, (x) => x.nguyen_nhan)) console.log(`  ${k}: ${pct(v, xong.length)}`)
console.log('Kết cục:')
for (const [k, v] of demTheo(xong, (x) => x.ket_cuc)) console.log(`  ${k}: ${v}`)

const gap = new Set(ds.flatMap((k) => k.su_kien))
const chua = Object.keys(dl.su_kien ?? {}).filter((ma) => !gap.has(ma))
console.log(`Sự kiện chưa từng gặp: ${chua.length}/${Object.keys(dl.su_kien ?? {}).length}`)
if (chua.length > 0) console.log('  ' + chua.join(', '))

if (loi.length > 0 || xong.length !== N) process.exit(1)
