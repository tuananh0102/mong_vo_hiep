// 01 mục 10.3: bot "lối chơi mẫu" bám chính sách Chính phái của mo_phong/mo_phong.py (LOI_CHOI, song_mot_doi).
// Dùng: npm run mo-phong [-- --n 2000]
import { napTuDia } from '../src/du_lieu/nap_node'
import { CHINH_PHAI, chayKiep, demTheo, pct, soNguyenArg, trungVi } from './choi_bot'

const N = soNguyenArg('--n', 2000)
const dl = napTuDia()
const ds = Array.from({ length: N }, (_, i) => chayKiep(i + 1, dl, CHINH_PHAI))
const loi = ds.flatMap((k) => k.loi)
const xong = ds.filter((k) => k.tuoi_chet >= 0)

console.log(`Lối chơi mẫu Chính phái: ${N} kiếp, kết thúc ${xong.length}, lỗi ${loi.length}`)
for (const l of loi.slice(0, 10)) console.log('  LỖI', l)
const tuoi = xong.map((k) => k.tuoi_chet).sort((a, b) => a - b)
const q = (p: number) => tuoi[Math.min(tuoi.length - 1, Math.floor(p * tuoi.length))]
console.log(`Tuổi mất trung vị: ${trungVi(tuoi)}, P10 / P90: ${q(0.1)} / ${q(0.9)}`)
console.log(`Sống tới 50 / 70 / 80: ${[50, 70, 80].map((t) => pct(tuoi.filter((x) => x >= t).length, xong.length)).join(' / ')}`)
console.log('Nguyên nhân mất:')
for (const [k, v] of demTheo(xong, (x) => x.nguyen_nhan)) console.log(`  ${k}: ${pct(v, xong.length)}`)
console.log('Tử trận theo nguồn (lệnh gần nhất trước trận):')
for (const [k, v] of demTheo(xong.filter((x) => x.nguyen_nhan === 'tu_tran'), (x) => x.nguon_cuoi)) console.log(`  ${k}: ${pct(v, xong.length)}`)
for (const m of [40, 60]) {
  const c = ds.map((k) => k.moc[m]).filter((x) => x !== undefined)
  console.log(`Lúc ${m} tuổi (${c.length} người còn sống): cấp cao nhất trung vị ${trungVi(c.map((x) => x.cap))}, tier cao nhất trung vị ${trungVi(c.map((x) => x.tier))}`)
}
console.log('Gia cảnh:', demTheo(ds, (x) => x.gia_canh).map(([k, v]) => `${k} ${pct(v, N)}`).join(', '))
console.log('Kết cục:', demTheo(xong, (x) => x.ket_cuc).map(([k, v]) => `${k} ${pct(v, N)}`).join(', '))
if (loi.length > 0 || xong.length !== N) process.exit(1)
