// M1-14: nội dung 0 - 15 tuổi (HS03). Kiểm số lượng, tham chiếu cờ / sự kiện, và 2.000 kiếp giả lập.
import { describe, expect, it } from 'vitest'
import type { DieuKien, HieuUng, KetQuaLuaChon, SuKien } from '../src/du_lieu/luoc_do'
import { napDuLieu } from '../src/du_lieu/nap'
import { docTepDia } from '../src/du_lieu/nap_node'
import { taoTrangThaiRong } from '../src/luat/chi_so'
import { apDung } from '../src/luat/dong_co'
import type { TrangThaiGame } from '../src/luat/kieu'
import { taoRng } from '../src/luat/rng'
import { xemSuKien } from '../src/luat/xem'

const tep = docTepDia()
const dl = napDuLieu(tep)

/** Sự kiện M1-14: các tệp du_lieu/su_kien/{0_5,6_10,11_15}/. */
const NHOM = ['0_5', '6_10', '11_15'] as const
const suKienTheoNhom = (nhom: string): SuKien[] =>
  Object.entries(tep)
    .filter(([duong]) => duong.startsWith(`su_kien/${nhom}/`))
    .map(([, nd]) => dl.su_kien![(nd as { ma: string }).ma]!)

const tatCa = NHOM.flatMap(suKienTheoNhom)

function moiKetQua(sk: SuKien): KetQuaLuaChon[] {
  return sk.lua_chon.flatMap((lc) => [
    ...(lc.ket_qua ? [lc.ket_qua] : []),
    ...(lc.thanh_cong ? [lc.thanh_cong] : []),
    ...(lc.that_bai ? [lc.that_bai] : []),
    ...(lc.kiem_dinh?.loai === 'ngau_nhien' ? lc.kiem_dinh.nhanh.map((n) => n.ket_qua) : []),
  ])
}

const moiHieuUng = (sk: SuKien): HieuUng[] => moiKetQua(sk).flatMap((kq) => kq.hieu_ung)

function coTrongDieuKien(dk: DieuKien | null | undefined, ra: Set<string>): void {
  if (!dk) return
  if ('co' in dk) ra.add(dk.co)
  else if ('va' in dk) dk.va.forEach((c) => coTrongDieuKien(c, ra))
  else if ('hoac' in dk) dk.hoac.forEach((c) => coTrongDieuKien(c, ra))
  else if ('khong' in dk) coTrongDieuKien(dk.khong, ra)
}

describe('M1-14: số lượng sự kiện', () => {
  it('đủ 35 sự kiện, đúng định mức từng nhóm tuổi', () => {
    expect(tatCa.length).toBeGreaterThanOrEqual(35)
    expect(suKienTheoNhom('0_5').length).toBeGreaterThanOrEqual(8)
    const nhom610 = suKienTheoNhom('6_10')
    expect(nhom610.length).toBeGreaterThanOrEqual(12)
    expect(nhom610.filter((s) => s.loai === 'ky_ngo').length).toBeGreaterThanOrEqual(3)
    const nhom1115 = suKienTheoNhom('11_15').filter((s) => s.tuoi[0] <= 15)
    expect(nhom1115.length).toBeGreaterThanOrEqual(15)
    const khaoNghiem = ['quy_truoc_son_mon_thieu_lam', 'quy_truoc_son_mon_vo_dang', 'ty_thi_nhap_mon_hoa_son', 'chen_com_thua_cai_bang']
    for (const ma of khaoNghiem) expect(dl.su_kien![ma], ma).toBeDefined()
  })

  it('mỗi gia cảnh có ít nhất 2 sự kiện riêng', () => {
    const riengCua = (gc: string) =>
      tatCa.filter((sk) => {
        const dk = sk.dieu_kien
        return dk && 'la' in dk && dk.la === 'gia_canh' && dk.trong.length <= 2 && dk.trong.includes(gc)
      })
    for (const gc of Object.keys(dl.gia_canh!)) expect(riengCua(gc).length, gc).toBeGreaterThanOrEqual(2)
  })

  it('không sự kiện nào có hiệu ứng chet', () => {
    for (const sk of tatCa) expect(moiHieuUng(sk).some((h) => 'chet' in h), sk.ma).toBe(false)
  })
})

describe('M1-14: tham chiếu', () => {
  it('tiep và len_lich trỏ tới sự kiện có thật', () => {
    for (const sk of tatCa)
      for (const h of moiHieuUng(sk)) {
        if ('tiep' in h) expect(dl.su_kien![h.tiep], `${sk.ma} -> ${h.tiep}`).toBeDefined()
        if ('len_lich' in h) expect(dl.su_kien![h.len_lich.su_kien], sk.ma).toBeDefined()
      }
  })

  it('mọi cờ được đọc đều có chỗ đặt', () => {
    const dat = new Set<string>()
    for (const sk of Object.values(dl.su_kien!))
      for (const h of moiHieuUng(sk)) {
        if ('dat_co' in h) (typeof h.dat_co === 'string' ? [h.dat_co] : Object.keys(h.dat_co)).forEach((c) => dat.add(c))
        if ('ghi_ke_thu' in h) dat.add(`ke_thu_${h.ghi_ke_thu}`)
      }
    const doc = new Set<string>()
    for (const sk of tatCa) {
      coTrongDieuKien(sk.dieu_kien, doc)
      for (const lc of sk.lua_chon) {
        coTrongDieuKien(lc.cong, doc)
        coTrongDieuKien(lc.cong_an, doc)
      }
    }
    for (const c of doc) expect(dat.has(c), `cờ "${c}" được đọc nhưng không nơi nào đặt`).toBe(true)
  })
})

/**
 * Sự kiện mà mô phỏng thật chưa tới được, kèm hàm ép đúng điều kiện ở tuổi trước năm sự kiện.
 * thoi_noi_ngu_guc: Cổng Ngộ tính dưới 25, nhưng Tư Chất Ngu Độn chưa khóa Ngộ tính ở 10 (REVIEW mục 9).
 */
const CHUA_DAT_DUOC: Record<string, (s: TrangThaiGame) => void> = {
  thoi_noi_ngu_guc: (s) => {
    s.nhan_vat.ngo_tinh = 10
  },
}

describe('M1-14: 2.000 kiếp giả lập qua tuổi 0 - 16', () => {
  const SO_KIEP = 2000
  const thongKe = new Map<string, number>()

  function chayMotKiep(seed: number): void {
    const rng = taoRng([seed, 11, 22, 33])
    let s: TrangThaiGame = taoTrangThaiRong(seed)
    const lenh = (l: Parameters<typeof apDung>[1]) => {
      const kq = apDung(s, l, dl)
      expect(kq.loi, `seed ${seed}: ${JSON.stringify(l)}`).toBeNull()
      s = kq.trang_thai
    }
    lenh({ loai: 'tao_kiep', seed, gioi_tinh: seed % 2 === 0 ? 'nam' : 'nu', ten: '', uu_dai: [] })
    const choTP = s.cho
    if (choTP?.loai !== 'chon_thien_phu') throw new Error('thiếu chọn thiên phú')
    lenh({ loai: 'chon_thien_phu', ma: choTP.lua_chon[rng.nguyen(0, 2)]! })

    while (s.nhan_vat.tuoi < 17) {
      lenh({ loai: 'qua_nam' })
      expect(s.ket_thuc, `seed ${seed}: chết sớm tuổi ${s.nhan_vat.tuoi}`).toBeNull()
      let canh = 0
      for (let cho = s.cho; cho !== null; cho = s.cho) {
        expect(++canh, `seed ${seed}: vòng sự kiện không dừng`).toBeLessThan(20)
        if (cho.loai !== 'su_kien') throw new Error(`seed ${seed}: gặp ${cho.loai} ở tuổi ${s.nhan_vat.tuoi}`)
        thongKe.set(cho.ma, (thongKe.get(cho.ma) ?? 0) + 1)
        const hien = xemSuKien(s, dl)!
        const duocChon = hien.lua_chon.filter((c) => !c.bi_khoa)
        expect(duocChon.length, `seed ${seed}: ${cho.ma} không còn lựa chọn mở`).toBeGreaterThan(0)
        lenh({ loai: 'chon', ma_lua_chon: duocChon[rng.nguyen(0, duocChon.length - 1)]!.ma })
      }
    }
  }

  it('không lỗi, không chết sớm, mỗi sự kiện xuất hiện ít nhất 1 lần', () => {
    for (let i = 1; i <= SO_KIEP; i++) chayMotKiep(i)
    const thieu = tatCa.map((sk) => sk.ma).filter((ma) => !thongKe.has(ma) && !(ma in CHUA_DAT_DUOC))
    expect(thieu, `chưa từng gặp: ${thieu.join(', ')}`).toEqual([])
  }, 300_000)

  it('sự kiện chưa đạt được trong mô phỏng thì mở đúng khi đủ điều kiện', () => {
    for (const [ma, ep] of Object.entries(CHUA_DAT_DUOC)) {
      let s = apDung(taoTrangThaiRong(7), { loai: 'tao_kiep', seed: 7, gioi_tinh: 'nam', ten: '', uu_dai: [] }, dl).trang_thai
      if (s.cho?.loai !== 'chon_thien_phu') throw new Error('thiếu chọn thiên phú')
      s = apDung(s, { loai: 'chon_thien_phu', ma: s.cho.lua_chon[0] }, dl).trang_thai
      ep(s)
      s = apDung(s, { loai: 'qua_nam' }, dl).trang_thai
      expect(s.cho, ma).toMatchObject({ loai: 'su_kien', ma })
    }
  })
})
