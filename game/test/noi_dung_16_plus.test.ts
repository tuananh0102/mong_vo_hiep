// M1-15: nội dung 16+ tuổi (HS04). Kiểm số lượng, tham chiếu, và mô phỏng nhiều kiếp để tìm sự kiện "chết".
import { describe, expect, it } from 'vitest'
import type { DieuKien, HieuUng, KetQuaLuaChon, SuKien } from '../src/du_lieu/luoc_do'
import { napDuLieu } from '../src/du_lieu/nap'
import { docTepDia } from '../src/du_lieu/nap_node'
import { taoTrangThaiRong } from '../src/luat/chi_so'
import { apDung } from '../src/luat/dong_co'
import type { BuocTamHiep, HuongTamHiep, Lenh, TrangThaiGame } from '../src/luat/kieu'
import { taoRng } from '../src/luat/rng'
import { duDieuKien } from '../src/luat/su_kien'
import { luaChonPhanDinh } from '../src/luat/tam_hiep/tran'
import { xemSuKien } from '../src/luat/xem'

const tep = docTepDia()
const dl = napDuLieu(tep)

/** Sự kiện do M1-15 viết: 4 thư mục dưới du_lieu/su_kien/. */
const NHOM = ['16_30', '31_50', '51_plus', 'mon_phai'] as const

const suKienTheoNhom = (nhom: string): SuKien[] =>
  Object.entries(tep)
    .filter(([duong]) => duong.startsWith(`su_kien/${nhom}/`))
    .map(([, nd]) => dl.su_kien![(nd as { ma: string }).ma]!)

const tatCa = NHOM.flatMap(suKienTheoNhom)
const tatCaM1 = Object.entries(tep)
  .filter(([duong]) => duong.startsWith('su_kien/'))
  .map(([, nd]) => dl.su_kien![(nd as { ma: string }).ma]!)

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

describe('M1-15: số lượng sự kiện', () => {
  it('đủ định mức từng nhóm tuổi và tổng M1 ≥ 60', () => {
    expect(suKienTheoNhom('16_30').length).toBeGreaterThanOrEqual(10)
    expect(suKienTheoNhom('31_50').length).toBeGreaterThanOrEqual(8)
    expect(suKienTheoNhom('51_plus').length).toBeGreaterThanOrEqual(7)
    expect(tatCaM1.length).toBeGreaterThanOrEqual(60)
  })

  it('có đủ 3 sự kiện thử thách thăng cấp Bậc 2 - 4', () => {
    for (const ma of ['thang_bac_2', 'thang_bac_3', 'thang_bac_4']) {
      expect(dl.su_kien![ma], ma).toBeDefined()
    }
  })

  it('có đủ sự kiện HS04 II và các sự kiện nối tiếp', () => {
    const batBuoc = [
      'nhiem_vu_xuat_son',
      'nhiem_vu_xuat_son_lang_khach',
      'giai_cuu_ca_nu',
      'cam_do_tang_kinh_cac',
      'bay_su_thuc',
      'dai_bien_co_ke_vi',
    ]
    for (const ma of batBuoc) expect(dl.su_kien![ma], ma).toBeDefined()
    expect(dl.su_kien!['giai_cuu_ca_nu']!.loai).toBe('noi_tiep')
    expect(dl.su_kien!['bay_su_thuc']!.loai).toBe('thuong')
  })

  it('mỗi nhóm tuổi có ít nhất 1 biến thể Lãng khách (không môn phái)', () => {
    const laLangKhach = (sk: SuKien): boolean => {
      const dk = sk.dieu_kien
      return Boolean(dk && 'la' in dk && dk.la === 'mon_phai' && dk.trong.includes(''))
    }
    for (const nhom of ['16_30', '31_50', '51_plus'] as const) {
      expect(suKienTheoNhom(nhom).filter(laLangKhach).length, nhom).toBeGreaterThanOrEqual(1)
    }
  })

  it('không sự kiện nào 16+ dùng hiệu ứng chet', () => {
    for (const sk of tatCa) expect(moiHieuUng(sk).some((h) => 'chet' in h), sk.ma).toBe(false)
  })
})

describe('M1-15: tham chiếu', () => {
  it('tiep và len_lich trỏ tới sự kiện có thật', () => {
    for (const sk of tatCa)
      for (const h of moiHieuUng(sk)) {
        if ('tiep' in h) expect(dl.su_kien![h.tiep], `${sk.ma} -> ${h.tiep}`).toBeDefined()
        if ('len_lich' in h) expect(dl.su_kien![h.len_lich.su_kien], sk.ma).toBeDefined()
      }
  })

  it('mọi cờ được đọc đều có chỗ đặt trong dữ liệu sự kiện', () => {
    const dat = new Set<string>()
    for (const sk of Object.values(dl.su_kien!))
      for (const h of moiHieuUng(sk)) {
        if ('dat_co' in h)
          (typeof h.dat_co === 'string' ? [h.dat_co] : Object.keys(h.dat_co)).forEach((c) => dat.add(c))
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

  it('mọi hiệu ứng thêm trạng thái / nhãn / võ học đều có trong dữ liệu', () => {
    for (const sk of tatCa)
      for (const h of moiHieuUng(sk)) {
        if ('them_trang_thai' in h) expect(dl.trang_thai![h.them_trang_thai], sk.ma).toBeDefined()
        if ('them_nhan' in h) expect(dl.nhan![h.them_nhan], sk.ma).toBeDefined()
        if ('hoc_vo_hoc' in h) expect(dl.vo_hoc![h.hoc_vo_hoc], sk.ma).toBeDefined()
      }
  })
})

// ======================================================================
// Mô phỏng: chạy nhiều kiếp bằng chính sách ngẫu nhiên hợp lệ
// ======================================================================

const HUONG: HuongTamHiep[] = ['tien_ha_thu', 'an_binh', 'than_phap']

/** Đọc `cho` qua hàm để TypeScript không thu hẹp kiểu sau các lần gán trong closure. */
function layCho(s: TrangThaiGame): TrangThaiGame['cho'] {
  return s.cho
}

/** Sự kiện mà mô phỏng không chạm tới, kèm hàm ép trạng thái để chứng minh vẫn mở được. */
const CHUA_DAT_DUOC: Record<string, (s: TrangThaiGame) => void> = {}

describe('M1-15: 600 kiếp giả lập qua 16 tuổi tới lúc chết', () => {
  const SO_KIEP = 600
  const thongKe = new Map<string, number>()

  function chayMotKiep(seed: number): void {
    const rng = taoRng([seed, 15, 31, 47])
    let s: TrangThaiGame = taoTrangThaiRong(seed)
    const lenh = (l: Lenh): boolean => {
      const kq = apDung(s, l, dl)
      if (kq.loi) return false
      s = kq.trang_thai
      return true
    }

    lenh({ loai: 'tao_kiep', seed, gioi_tinh: seed % 3 === 0 ? 'nu' : 'nam', ten: '', uu_dai: [] })
    if (s.cho?.loai !== 'chon_thien_phu') throw new Error(`seed ${seed}: thiếu chọn thiên phú`)
    lenh({ loai: 'chon_thien_phu', ma: s.cho.lua_chon[rng.nguyen(0, 2)]! })

    for (let nam = 0; nam < 130; nam++) {
      // 1. Giải hết quyết định đang chờ
      let canh = 0
      while (s.cho !== null && s.ket_thuc === null) {
        if (++canh > 40) throw new Error(`seed ${seed}: vòng quyết định không dừng ở tuổi ${s.nhan_vat.tuoi}`)
        const cho = layCho(s)
        if (cho === null) break
        if (cho.loai === 'su_kien') {
          thongKe.set(cho.ma, (thongKe.get(cho.ma) ?? 0) + 1)
          const hien = xemSuKien(s, dl)
          const mo = hien?.lua_chon.filter((c) => !c.bi_khoa) ?? []
          if (mo.length === 0) throw new Error(`seed ${seed}: ${cho.ma} không còn lựa chọn mở`)
          const chon = mo[rng.nguyen(0, mo.length - 1)]!
          if (!lenh({ loai: 'chon', ma_lua_chon: chon.ma }))
            throw new Error(`seed ${seed}: không chọn được "${chon.ma}" ở ${cho.ma}`)
        } else if (cho.loai === 'tam_hiep') {
          const t = cho.tran
          let buoc: BuocTamHiep | null = null
          if (t.buoc === 'chon_huong') buoc = { loai: 'huong', huong: HUONG[rng.nguyen(0, 2)]! }
          else if (t.buoc === 'giua_hiep') buoc = { loai: 'bo_qua' }
          else if (t.buoc === 'chon_chieu')
            buoc = { loai: 'chieu', ma: t.a.chieu[rng.nguyen(0, t.a.chieu.length - 1)]!.ma }
          else if (t.buoc === 'phan_dinh') {
            const ds = luaChonPhanDinh(t)
            if (ds.length > 0) buoc = { loai: 'phan_dinh', ma: ds[rng.nguyen(0, ds.length - 1)]! }
          }
          if (buoc === null || !lenh({ loai: 'tam_hiep', buoc }))
            throw new Error(`seed ${seed}: kẹt ở bước trận "${t.buoc}"`)
        } else {
          // chon_thien_phu / chuyen_giai_doan: M1-18 chưa nối màn Văn Bia
          break
        }
      }
      if (s.ket_thuc !== null) break

      // 2. Tiêu AP: ưu tiên việc sư môn để mở các thử thách thăng cấp
      let guard = 0
      while (s.nhan_vat.ap_con_lai > 0 && s.ket_thuc === null && guard++ < 12) {
        const mp = s.nhan_vat.mon_phai
        const coTheSuMon = mp !== null && mp.bac >= 1 && mp.bac < 5
        const dsVo = Object.keys(s.nhan_vat.vo_hoc)
        const ungVien: Lenh[] = []
        if (coTheSuMon) {
          ungVien.push({ loai: 'hanh_dong', ma: 'nhiem_vu_su_mon' })
          if (s.nhan_vat.tuoi >= 16) ungVien.push({ loai: 'hanh_dong', ma: 'sai_phai_su_mon' })
        }
        if (dsVo.length > 0)
          ungVien.push({
            loai: 'hanh_dong',
            ma: 'luyen_cong',
            tham_so: { vo_hoc: dsVo[rng.nguyen(0, dsVo.length - 1)]! },
          })
        if (s.nhan_vat.tuoi >= 16) ungVien.push({ loai: 'hanh_dong', ma: 'tieu_thuong' })
        if (s.nhan_vat.tuoi >= 11 && s.nhan_vat.tuoi <= 18)
          ungVien.push({ loai: 'hanh_dong', ma: 'lam_thue_vat' })
        if (ungVien.length === 0) break
        const chon = ungVien[rng.nguyen(0, ungVien.length - 1)]!
        if (!lenh(chon)) break
      }

      if (s.ket_thuc !== null) break
      if (!lenh({ loai: 'qua_nam' })) throw new Error(`seed ${seed}: qua_nam lỗi ở tuổi ${s.nhan_vat.tuoi}`)
    }

    if (s.ket_thuc === null) throw new Error(`seed ${seed}: sống quá 130 tuổi mà chưa kết thúc`)
  }

  it('không lỗi và mỗi sự kiện 16+ xuất hiện ít nhất 1 lần', () => {
    const loi: string[] = []
    for (let i = 1; i <= SO_KIEP; i++) {
      try {
        chayMotKiep(i)
      } catch (e) {
        loi.push(String(e instanceof Error ? e.message : e))
        if (loi.length > 10) break
      }
    }
    expect(loi, loi.join('\n')).toEqual([])

    const thieu = tatCa.map((sk) => sk.ma).filter((ma) => !thongKe.has(ma) && !(ma in CHUA_DAT_DUOC))
    expect(thieu, `chưa từng gặp: ${thieu.join(', ')}`).toEqual([])
  }, 600_000)

  it('sự kiện chưa đạt được trong mô phỏng thì mở đúng khi ép đủ điều kiện', () => {
    for (const [ma, ep] of Object.entries(CHUA_DAT_DUOC)) {
      const sk = dl.su_kien![ma]!
      let s = taoTrangThaiRong(7)
      s = apDung(s, { loai: 'tao_kiep', seed: 7, gioi_tinh: 'nam', ten: '', uu_dai: [] }, dl).trang_thai
      if (s.cho?.loai !== 'chon_thien_phu') throw new Error('thiếu chọn thiên phú')
      s = apDung(s, { loai: 'chon_thien_phu', ma: s.cho.lua_chon[0] }, dl).trang_thai
      s.nhan_vat.tuoi = sk.tuoi[0]
      ep(s)
      expect(duDieuKien(sk, s, dl), ma).toBe(true)
    }
  })
})
