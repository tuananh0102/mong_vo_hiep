import { describe, expect, it } from 'vitest'
import { napTuDia } from '../src/du_lieu/nap_node'
import { taoTrangThaiRong } from '../src/luat/chi_so'
import { apHieuUng } from '../src/luat/hieu_ung'
import { rngTuSeed } from '../src/luat/rng'

const dl = napTuDia()
const rng = rngTuSeed(42)

describe('hieu_ung', () => {
  it('hiep_nghia công khai đổi cả hiep_nghia và thanh_danh (HS01 II.2)', () => {
    const d = taoTrangThaiRong(1)
    d.nhan_vat.hiep_nghia = 50
    d.nhan_vat.thanh_danh = 50

    apHieuUng({ hiep_nghia: 20 }, d, rng, dl)
    expect(d.nhan_vat.hiep_nghia).toBe(70)
    expect(d.nhan_vat.thanh_danh).toBe(70)
  })

  it('thanh_danh chỉ đổi thanh_danh, hiep_nghia giữ nguyên', () => {
    const d = taoTrangThaiRong(1)
    d.nhan_vat.hiep_nghia = 50
    d.nhan_vat.thanh_danh = 50

    apHieuUng({ thanh_danh: -30 }, d, rng, dl)
    expect(d.nhan_vat.hiep_nghia).toBe(50)
    expect(d.nhan_vat.thanh_danh).toBe(20)
  })

  it('cong chỉ số thông thường', () => {
    const d = taoTrangThaiRong(1)
    d.nhan_vat.can_cot = 50
    d.nhan_vat.ngan_luong = 100

    apHieuUng({ cong: { can_cot: 5, ngan_luong: 50 } }, d, rng, dl)
    expect(d.nhan_vat.can_cot).toBe(55)
    expect(d.nhan_vat.ngan_luong).toBe(150)
  })

  it('cong không được dùng trên hiep_nghia / thanh_danh', () => {
    const d = taoTrangThaiRong(1)
    expect(() => apHieuUng({ cong: { hiep_nghia: 10 } }, d, rng, dl)).toThrow(/hiep_nghia/)
    expect(() => apHieuUng({ cong: { thanh_danh: 10 } }, d, rng, dl)).toThrow(/thanh_danh/)
  })

  it('cong ngan_luong âm: không đủ tiền và không có no_neu_thieu thì ném lỗi lập trình', () => {
    const d = taoTrangThaiRong(1)
    d.nhan_vat.ngan_luong = 30
    expect(() => apHieuUng({ cong: { ngan_luong: -50 } }, d, rng, dl)).toThrow(/không đủ ngân lượng/)
  })

  it('cong ngan_luong âm: không đủ tiền có no_neu_thieu thì chuyển phần thiếu thành nợ', () => {
    const d = taoTrangThaiRong(1)
    d.nhan_vat.tuoi = 20
    d.nhan_vat.ngan_luong = 30

    apHieuUng({ cong: { ngan_luong: -50 }, no_neu_thieu: 'chu_no_a' }, d, rng, dl)
    expect(d.nhan_vat.ngan_luong).toBe(0)
    expect(d.nhan_vat.no['chu_no_a']?.goc).toBe(20)
    expect(d.nhan_vat.no['chu_no_a']?.nam_vay).toBe(20)
  })

  it('hiệu ứng M2-06 (hao_cam, cuu_gia, hiep_nghia [Ám]) ném lỗi chưa hỗ trợ', () => {
    const d = taoTrangThaiRong(1)
    expect(() => apHieuUng({ hao_cam: { vai: 'truong_lao', doi: 10 } }, d, rng, dl)).toThrow(/M2-06/)
    expect(() => apHieuUng({ cuu_gia: 'npc_1' }, d, rng, dl)).toThrow(/M2-06/)
    expect(() => apHieuUng({ hiep_nghia: -50, am: 'vat' }, d, rng, dl)).toThrow(/M2-06/)
  })

  it('dat_co và xoa_co', () => {
    const d = taoTrangThaiRong(1)
    apHieuUng({ dat_co: 'da_cuu_nguoi' }, d, rng, dl)
    expect(d.nhan_vat.co_su_kien['da_cuu_nguoi']).toBe(true)

    apHieuUng({ dat_co: { diem_so: 10, da_gap: true } }, d, rng, dl)
    expect(d.nhan_vat.co_su_kien['diem_so']).toBe(10)
    expect(d.nhan_vat.co_su_kien['da_gap']).toBe(true)

    apHieuUng({ xoa_co: 'da_cuu_nguoi' }, d, rng, dl)
    expect(d.nhan_vat.co_su_kien['da_cuu_nguoi']).toBeUndefined()
  })

  it('them_trang_thai, xoa_trang_thai, them_nhan', () => {
    const d = taoTrangThaiRong(1)
    d.nhan_vat.tuoi = 25

    apHieuUng({ them_trang_thai: 'bach_doc_bat_xam', so_nam: 10 }, d, rng, dl)
    expect(d.nhan_vat.trang_thai['bach_doc_bat_xam']).toEqual({ tu_tuoi: 25, den_tuoi: 35 })

    apHieuUng({ xoa_trang_thai: 'bach_doc_bat_xam' }, d, rng, dl)
    expect(d.nhan_vat.trang_thai['bach_doc_bat_xam']).toBeUndefined()

    apHieuUng({ them_nhan: 'hao_hiep' }, d, rng, dl)
    expect(d.nhan_vat.nhan).toContain('hao_hiep')
  })

  it('hoc_vo_hoc, nhan_vat_pham, mat_vat_pham', () => {
    const d = taoTrangThaiRong(1)
    apHieuUng({ hoc_vo_hoc: 'thai_cuc_quyen', cap: 2, hoan_thien: 80 }, d, rng, dl)
    expect(d.nhan_vat.vo_hoc['thai_cuc_quyen']).toEqual({ cap: 2, tien_do: 0, hoan_thien: 80 })

    apHieuUng({ nhan_vat_pham: 'thiet_kiem', so_luong: 3 }, d, rng, dl)
    expect(d.nhan_vat.hanh_trang['thiet_kiem']).toBe(3)

    apHieuUng({ mat_vat_pham: 'thiet_kiem', so_luong: 2 }, d, rng, dl)
    expect(d.nhan_vat.hanh_trang['thiet_kiem']).toBe(1)

    apHieuUng({ mat_vat_pham: 'thiet_kiem', so_luong: 1 }, d, rng, dl)
    expect(d.nhan_vat.hanh_trang['thiet_kiem']).toBeUndefined()
  })

  it('gia_nhap_mon_phai, cong_hien, thang_bac, roi_mon_phai', () => {
    const d = taoTrangThaiRong(1)
    d.nhan_vat.tuoi = 16

    apHieuUng({ gia_nhap_mon_phai: 'vo_dang', bac: 1 }, d, rng, dl)
    expect(d.nhan_vat.mon_phai?.ma).toBe('vo_dang')
    expect(d.nhan_vat.mon_phai?.bac).toBe(1)

    apHieuUng({ cong_hien: 100 }, d, rng, dl)
    expect(d.nhan_vat.mon_phai?.cong_hien).toBe(100)

    apHieuUng({ thang_bac: 2 }, d, rng, dl)
    expect(d.nhan_vat.mon_phai?.bac).toBe(2)

    apHieuUng({ roi_mon_phai: 'tu_roi' }, d, rng, dl)
    expect(d.nhan_vat.mon_phai).toBeNull()
    expect(d.nhan_vat.lich_su_mon_phai[0]).toEqual({
      ma: 'vo_dang',
      tu_tuoi: 16,
      den_tuoi: 16,
      cach_roi: 'tu_roi',
    })
  })

  it('len_lich, tiep, chet, dong', () => {
    const d = taoTrangThaiRong(1)
    d.nhan_vat.tuoi = 30

    apHieuUng({ len_lich: { su_kien: 'dai_hoi_vo_lam', sau_nam: 2, han_nam: 3 } }, d, rng, dl)
    expect(d.lich_hen[0]).toEqual({
      su_kien: 'dai_hoi_vo_lam',
      nam_mo: 32,
      han_nam: 35,
    })

    apHieuUng({ tiep: 'su_kien_2' }, d, rng, dl, { vai_a: 'Npc' })
    expect(d.cho).toEqual({ loai: 'su_kien', ma: 'su_kien_2', bien: { vai_a: 'Npc' } })

    const dongKq = apHieuUng({ dong: { van_ban: 'Một dòng sự kiện mới.', loai_hien_thi: 'ky-ngo' } }, d, rng, dl)
    expect(dongKq).toEqual([
      { tuoi: 30, van_ban: 'Một dòng sự kiện mới.', loai_hien_thi: 'ky-ngo' },
    ])

    apHieuUng({ chet: 'trung_doc' }, d, rng, dl)
    expect(d.ket_thuc).toEqual({ nguyen_nhan: 'trung_doc', tuoi: 30 })
    expect(d.cho).toEqual({ loai: 'chuyen_giai_doan', ma: 'van_bia' })
  })
})
