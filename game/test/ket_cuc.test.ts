import { describe, expect, it } from 'vitest'
import { napDuLieu } from '../src/du_lieu/nap'
import { docTepDia } from '../src/du_lieu/nap_node'
import { taoTrangThaiRong } from '../src/luat/chi_so'
import { apDung } from '../src/luat/dong_co'
import { canChi, KIEM_TRA, ketThucKiep, vanBia, xetKetCuc } from '../src/luat/ket_cuc'
import type { TrangThaiGame } from '../src/luat/kieu'
import { diemLuanHoi } from '../src/luat/luan_hoi'
import { rngTuSeed } from '../src/luat/rng'
import { xemManHinh } from '../src/luat/xem'

const dl = napDuLieu(docTepDia())

function chet(tuoi: number, lyDo: string, sua?: (d: TrangThaiGame) => void): TrangThaiGame {
  const d = taoTrangThaiRong(1)
  d.nhan_vat.ten = 'Lý Tiêu Dao'
  d.nhan_vat.tuoi = tuoi
  d.nam_the_gioi = 1150 + tuoi
  sua?.(d)
  ketThucKiep(d, rngTuSeed(1), dl, lyDo)
  return d
}

describe('ket_cuc.json', () => {
  it('đủ 18 kết cục + mặc định, mọi dieu_kien có hàm xét', () => {
    const ds = Object.values(dl.ket_cuc ?? {})
    expect(ds).toHaveLength(19)
    for (const kc of ds) expect(KIEM_TRA[kc.dieu_kien], kc.ma).toBeTypeOf('function')
  })
})

describe('ketThucKiep / xetKetCuc (HS07 IV)', () => {
  it('chết ở 5 tuổi → #18 và +50 an ủi', () => {
    const d = chet(5, 'tu_tran')
    expect(d.ket_thuc?.ket_cuc).toBe('kc_18')
    expect(d.ket_thuc?.diem_luan_hoi).toBe(5 * 2 + 50)
    expect(d.cho).toEqual({ loai: 'chuyen_giai_doan', ma: 'van_bia' })
  })

  it('chết ở 22 tuổi có Thiên phú Đỏ → #15', () => {
    const d = chet(22, 'trung_doc', (x) => {
      x.nhan_vat.thien_phu = ['cuu_duong_tuyet_mach']
    })
    expect(d.ket_thuc?.ket_cuc).toBe('kc_15')
  })

  it('chết ở 22 tuổi không Thiên phú Đỏ, không Thần công → mặc định', () => {
    const d = chet(22, 'trung_doc')
    expect(d.ket_thuc?.ket_cuc).toBe('kc_mac_dinh')
    expect(d.ket_thuc?.diem_luan_hoi).toBe(44)
  })

  it('nhảy vực Phúc duyên thấp → #17 dù có Thiên phú Đỏ', () => {
    const d = chet(20, 'khong_coc_day_vuc', (x) => {
      x.nhan_vat.thien_phu = ['cuu_duong_tuyet_mach']
    })
    expect(d.ket_thuc?.ket_cuc).toBe('kc_17')
  })

  it('thọ chung ở 80 tuổi → mặc định, kết cục khác đạt được ghi thành danh hiệu phụ (G24)', () => {
    const d = chet(80, 'tho_chung')
    expect(d.ket_thuc?.ket_cuc).toBe('kc_mac_dinh')
    const e = taoTrangThaiRong(2)
    e.nhan_vat.tuoi = 8
    e.ket_thuc = { nguyen_nhan: 'tu_tran', tuoi: 8, ket_cuc: '', diem_luan_hoi: 0, danh_hieu_phu: [] }
    e.nhan_vat.thien_phu = ['cuu_duong_tuyet_mach']
    expect(xetKetCuc(e, dl).chinh.ma).toBe('kc_18')
  })

  it('kiếp nào cũng vào Văn bia rồi về màn Đầu thai', () => {
    const d = chet(30, 'tu_tran')
    expect(xemManHinh(d, dl).man).toBe('ket_thuc')
    const kq = apDung(d, { loai: 'tiep_tuc' }, dl)
    expect(kq.loi).toBeNull()
    expect(kq.trang_thai.ket_thuc).toBeNull()
    expect(xemManHinh(kq.trang_thai, dl).man).toBe('dau_thai')
  })
})

describe('diemLuanHoi (HS07 II.1)', () => {
  it('khớp tính tay: 78 tuổi, Hiệp nghĩa -460, 2 môn cấp 10, 1 Đại sự kiện, kết cục SS 350', () => {
    const d = taoTrangThaiRong(1)
    d.nhan_vat.tuoi = 78
    d.ket_thuc = { nguyen_nhan: 'tho_chung', tuoi: 78, ket_cuc: '', diem_luan_hoi: 0, danh_hieu_phu: [] }
    d.nhan_vat.hiep_nghia = -460
    d.nhan_vat.vo_hoc = {
      a: { cap: 10, tien_do: 0, hoan_thien: 0 },
      b: { cap: 10, tien_do: 0, hoan_thien: 0 },
      c: { cap: 9, tien_do: 0, hoan_thien: 0 },
    }
    d.nhan_vat.thong_ke['dai_su_kien_vuot_qua'] = 1
    // 156 + 92 + 100 + 100 + 350
    expect(diemLuanHoi(d, { diem: 350 })).toBe(798)
  })
})

describe('Văn bia (HS07 II, G20)', () => {
  it('năm Can Chi: dư 4 là Giáp Tý', () => {
    expect(canChi(1144, dl)).toBe('Giáp Tý')
    expect(canChi(1145, dl)).toBe('Ất Sửu')
    expect(canChi(1143, dl)).toBe('Quý Hợi')
  })

  it('đủ 4 đoạn, đoạn 1 ghi năm sinh Can Chi', () => {
    const d = chet(40, 'tu_tran', (x) => {
      x.nam_the_gioi = 1184 // sinh 1144
      x.nhan_vat.gia_canh = Object.keys(dl.gia_canh ?? {})[0] ?? ''
    })
    const doan = vanBia(d, dl)
    expect(doan).toHaveLength(4)
    expect(doan[0]).toContain('Giáp Tý')
    expect(doan[3]).toContain('40 tuổi')
    expect(doan.every((x) => !x.includes('{'))).toBe(true)
  })
})

describe('Kết cục #13 Tạp dịch', () => {
  it('Tạp dịch 60 năm có Dịch Cân Kinh cấp 10 → #13; thiếu một điều kiện thì không', () => {
    const lap = (sua: (d: TrangThaiGame) => void): TrangThaiGame =>
      chet(80, 'tho_chung', (d) => {
        d.nhan_vat.mon_phai = { ma: 'thieu_lam', bac: 1, cong_hien: 0, tu_tuoi: 16 }
        d.nhan_vat.co_su_kien['tap_dich'] = true
        d.nhan_vat.vo_hoc['dich_can_kinh'] = { cap: 10, tien_do: 0, hoan_thien: 0 }
        sua(d)
      })
    expect(lap(() => undefined).ket_thuc?.ket_cuc).toBe('kc_13')
    expect(lap((d) => { d.nhan_vat.vo_hoc['dich_can_kinh']!.cap = 9 }).ket_thuc?.ket_cuc).toBe('kc_mac_dinh')
    expect(lap((d) => { d.nhan_vat.mon_phai!.tu_tuoi = 30 }).ket_thuc?.ket_cuc).toBe('kc_mac_dinh')
    expect(lap((d) => { d.nhan_vat.mon_phai!.bac = 2 }).ket_thuc?.ket_cuc).toBe('kc_mac_dinh')
  })
})
