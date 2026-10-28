import { describe, expect, it } from 'vitest'
import { DU_LIEU } from '../src/du_lieu/nap_vite'
import { taoTrangThaiRong } from '../src/luat/chi_so'
import {
  danhHieu,
  manHienThi,
  moTaTuoiTho,
  tenMonPhai,
  xemManHinh,
  xemVoHocDaHoc,
} from '../src/luat/xem'

describe('xem / manHienThi', () => {
  it('phân biệt 4 màn hình gốc (M1-16)', () => {
    const d = taoTrangThaiRong(1)
    expect(manHienThi(d)).toBe('dau_thai')

    d.nhan_vat.ten = 'Lý Tiêu Dao'
    expect(manHienThi(d)).toBe('choi')

    d.cho = { loai: 'chon_thien_phu', lua_chon: ['a', 'b', 'c'] }
    expect(manHienThi(d)).toBe('chon_thien_phu')

    d.cho = null
    d.ket_thuc = { nguyen_nhan: 'tho_chung', tuoi: 78 }
    expect(manHienThi(d)).toBe('ket_thuc')
  })
})

describe('xem / danhHieu (G31)', () => {
  it('mặc định là Vô danh tiểu tốt', () => {
    expect(danhHieu(taoTrangThaiRong(1).nhan_vat, DU_LIEU)).toBe('Vô danh tiểu tốt')
  })

  it('Thanh danh và Danh vọng đổi danh hiệu', () => {
    const nv = taoTrangThaiRong(1).nhan_vat
    nv.thanh_danh = 300
    expect(danhHieu(nv, DU_LIEU)).toBe('Chính Nhân Quân Tử')
    nv.thanh_danh = -300
    expect(danhHieu(nv, DU_LIEU)).toBe('Đại Ma Đầu')
    nv.thanh_danh = 0
    nv.danh_vong = 400
    expect(danhHieu(nv, DU_LIEU)).toBe('Danh hiệp')
    nv.danh_vong = 700
    expect(danhHieu(nv, DU_LIEU)).toBe('Đại hiệp')
  })

  it('chức vị môn phái đứng trước Thanh danh và Danh vọng', () => {
    const nv = taoTrangThaiRong(1).nhan_vat
    nv.thanh_danh = 900
    nv.danh_vong = 900
    nv.mon_phai = { ma: 'thieu_lam', bac: 4, cong_hien: 0, tu_tuoi: 20 }
    expect(danhHieu(nv, DU_LIEU)).toBe('Trưởng lão')
    nv.mon_phai.bac = 5
    expect(danhHieu(nv, DU_LIEU)).toBe('Chưởng môn')
  })

  it('môn phái Tà thì Bậc 5 là Giáo chủ', () => {
    const dlTa = {
      ...DU_LIEU,
      mon_phai: {
        ...DU_LIEU.mon_phai,
        thieu_lam: { ...DU_LIEU.mon_phai!['thieu_lam']!, phe: 'ta' as const },
      },
    }
    const nv = taoTrangThaiRong(1).nhan_vat
    nv.mon_phai = { ma: 'thieu_lam', bac: 5, cong_hien: 0, tu_tuoi: 35 }
    expect(danhHieu(nv, dlTa)).toBe('Giáo chủ')
  })
})

describe('xem / tuổi thọ, môn phái, võ học', () => {
  it('mô tả tuổi thọ theo số năm còn lại (G02)', () => {
    expect(moTaTuoiTho(80, 60)).toBe('Khí huyết dồi dào')
    expect(moTaTuoiTho(80, 61)).toBe('Thân thể vững vàng')
    expect(moTaTuoiTho(80, 70)).toBe('Thân thể vững vàng')
    expect(moTaTuoiTho(80, 71)).toBe('Tuổi xế chiều')
    expect(moTaTuoiTho(80, 75)).toBe('Tuổi xế chiều')
    expect(moTaTuoiTho(80, 76)).toBe('Đèn cạn dầu')
  })

  it('tên môn phái kèm bậc (HS04 I.1)', () => {
    const nv = taoTrangThaiRong(1).nhan_vat
    expect(tenMonPhai(nv, DU_LIEU)).toBe('Vô môn vô phái')
    nv.mon_phai = { ma: 'thieu_lam', bac: 2, cong_hien: 0, tu_tuoi: 16 }
    expect(tenMonPhai(nv, DU_LIEU)).toBe('Thiếu Lâm Tự · Nội môn')
  })

  it('xemVoHocDaHoc trả tier, cấp và mô tả cho popover', () => {
    const nv = taoTrangThaiRong(1).nhan_vat
    nv.vo_hoc['hoa_son_kiem_phap'] = { cap: 3, tien_do: 0, hoan_thien: 100 }
    const ds = xemVoHocDaHoc(nv, DU_LIEU)
    expect(ds).toHaveLength(1)
    expect(ds[0]!.ten).toBe('Hoa Sơn Kiếm Pháp')
    expect(ds[0]!.cap).toBe(3)
    expect(ds[0]!.tier).toBe(1)
    expect(ds[0]!.mo_ta.length).toBeGreaterThan(0)
  })

  it('xemManHinh đổ đủ dữ liệu Header', () => {
    const d = taoTrangThaiRong(3)
    d.nhan_vat.ten = 'Lý Tiêu Dao'
    d.nhan_vat.vung = 'trung_nguyen'
    const m = xemManHinh(d, DU_LIEU)
    expect(m.man).toBe('choi')
    expect(m.danh_hieu).toBe('Vô danh tiểu tốt')
    expect(m.vung).toBe('Trung Nguyên')
    expect(m.hp_max).toBeGreaterThan(0)
    expect(m.noi_tuc_max).toBeGreaterThan(0)
    expect(m.tuoi_tho.length).toBeGreaterThan(0)
  })
})
