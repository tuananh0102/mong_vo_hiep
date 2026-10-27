import { describe, expect, it } from 'vitest'
import { napDuLieu } from '../src/du_lieu/nap'
import { napTuDia } from '../src/du_lieu/nap_node'
import { congChiSo, datChiSo, docChiSo, taoNhanVatRong, taoTrangThaiRong } from '../src/luat/chi_so'

const dl = napTuDia()
// Thiên phú thử: Tư Chất Ngu Độn khóa Ngộ tính (HS01 III.2). Dữ liệu thật ở M1-02.
const dlNgu = napDuLieu({
  'chi_so.json': Object.values(dl.chi_so),
  'thien_phu.json': [
    { ma: 'tu_chat_ngu_don', ten: 'Tư Chất Ngu Độn', nguon: 'HS01 III.2', do_hiem: 3, dac_biet: ['khoa_ngo_tinh'] },
  ],
})

describe('chi_so', () => {
  it('can_cot vượt 150 thì dừng ở 150', () => {
    const nv = taoNhanVatRong()
    datChiSo(dl, nv, 'can_cot', 90)
    congChiSo(dl, nv, 'can_cot', 100)
    expect(nv.can_cot).toBe(150)
  })

  it('can_cot_dinh không giảm khi can_cot giảm', () => {
    const nv = taoNhanVatRong()
    datChiSo(dl, nv, 'can_cot', 80)
    congChiSo(dl, nv, 'can_cot', -30)
    expect(nv.can_cot).toBe(50)
    expect(nv.can_cot_dinh).toBe(80)
  })

  it('hiệp nghĩa kẹp [-1000, 1000], danh vọng kẹp [0, 1000]', () => {
    const nv = taoNhanVatRong()
    congChiSo(dl, nv, 'hiep_nghia', 5000)
    expect(nv.hiep_nghia).toBe(1000)
    congChiSo(dl, nv, 'hiep_nghia', -5000)
    expect(nv.hiep_nghia).toBe(-1000)
    congChiSo(dl, nv, 'danh_vong', -5)
    expect(nv.danh_vong).toBe(0)
    congChiSo(dl, nv, 'danh_vong', 5000)
    expect(nv.danh_vong).toBe(1000)
  })

  it('ngộ tính không đổi khi có Tư Chất Ngu Độn', () => {
    const nv = taoNhanVatRong()
    nv.thien_phu = ['tu_chat_ngu_don']
    datChiSo(dlNgu, nv, 'ngo_tinh', 10)
    congChiSo(dlNgu, nv, 'ngo_tinh', 20)
    expect(nv.ngo_tinh).toBe(10)
    congChiSo(dlNgu, nv, 'can_cot', 5)
    expect(nv.can_cot).toBe(5)
  })

  it('tạp học kẹp [0, 100]', () => {
    const nv = taoNhanVatRong()
    congChiSo(dl, nv, 'y_thuat', 150)
    expect(nv.y_thuat).toBe(100)
  })

  it('mã phái sinh chờ M1-04, mã lạ báo lỗi', () => {
    const nv = taoNhanVatRong()
    expect(() => docChiSo(dl, nv, 'hp_max')).toThrow('M1-04')
    expect(() => docChiSo(dl, nv, 'khong_co')).toThrow(/không tồn tại/)
    expect(docChiSo(dl, nv, 'tuoi')).toBe(0)
  })

  it('mọi mã lưu trong chi_so.json có trường trong NhanVat', () => {
    const nv = taoNhanVatRong()
    for (const d of Object.values(dl.chi_so))
      if (!d.phai_sinh) expect(typeof (nv as unknown as Record<string, unknown>)[d.ma], d.ma).toBe('number')
  })

  it('trạng thái rỗng có RNG theo seed', () => {
    const s = taoTrangThaiRong(7)
    expect(s.seed).toBe(7)
    expect(s.rng).toHaveLength(4)
  })
})
