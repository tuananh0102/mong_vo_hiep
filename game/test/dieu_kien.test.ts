import { describe, expect, it } from 'vitest'
import { napTuDia } from '../src/du_lieu/nap_node'
import { taoTrangThaiRong } from '../src/luat/chi_so'
import { danhGia, moTaThieu } from '../src/luat/dieu_kien'

const dl = napTuDia()

describe('dieu_kien', () => {
  it('đánh giá điều kiện so: >=, <=, >, <, ==, !=', () => {
    const d = taoTrangThaiRong(1)
    d.nhan_vat.can_cot = 50

    expect(danhGia({ so: 'can_cot', op: '>=', gt: 50 }, d, dl)).toBe(true)
    expect(danhGia({ so: 'can_cot', op: '>=', gt: 51 }, d, dl)).toBe(false)
    expect(danhGia({ so: 'can_cot', op: '<=', gt: 50 }, d, dl)).toBe(true)
    expect(danhGia({ so: 'can_cot', op: '<=', gt: 49 }, d, dl)).toBe(false)
    expect(danhGia({ so: 'can_cot', op: '>', gt: 49 }, d, dl)).toBe(true)
    expect(danhGia({ so: 'can_cot', op: '>', gt: 50 }, d, dl)).toBe(false)
    expect(danhGia({ so: 'can_cot', op: '<', gt: 51 }, d, dl)).toBe(true)
    expect(danhGia({ so: 'can_cot', op: '<', gt: 50 }, d, dl)).toBe(false)
    expect(danhGia({ so: 'can_cot', op: '==', gt: 50 }, d, dl)).toBe(true)
    expect(danhGia({ so: 'can_cot', op: '==', gt: 51 }, d, dl)).toBe(false)
    expect(danhGia({ so: 'can_cot', op: '!=', gt: 40 }, d, dl)).toBe(true)
    expect(danhGia({ so: 'can_cot', op: '!=', gt: 50 }, d, dl)).toBe(false)
  })

  it('đánh giá điều kiện la: gioi_tinh, vung, mon_phai', () => {
    const d = taoTrangThaiRong(1)
    d.nhan_vat.gioi_tinh = 'nu'
    d.nhan_vat.vung = 'giang_nam'

    expect(danhGia({ la: 'gioi_tinh', trong: ['nu'] }, d, dl)).toBe(true)
    expect(danhGia({ la: 'gioi_tinh', trong: ['nam'] }, d, dl)).toBe(false)
    expect(danhGia({ la: 'vung', trong: ['giang_nam', 'trung_nguyen'] }, d, dl)).toBe(true)
    expect(danhGia({ la: 'vung', trong: ['tay_vuc'] }, d, dl)).toBe(false)
  })

  it('đánh giá điều kiện co: cờ cốt truyện', () => {
    const d = taoTrangThaiRong(1)
    d.nhan_vat.co_su_kien['gap_quai_nhan'] = true

    expect(danhGia({ co: 'gap_quai_nhan' }, d, dl)).toBe(true)
    expect(danhGia({ co: 'chua_gap' }, d, dl)).toBe(false)
  })

  it('đánh giá thien_phu, trang_thai, nhan', () => {
    const d = taoTrangThaiRong(1)
    d.nhan_vat.thien_phu = ['tu_chat_ngu_don']
    d.nhan_vat.trang_thai['bach_doc_bat_xam'] = { tu_tuoi: 10 }
    d.nhan_vat.nhan = ['nhan_nhin']

    expect(danhGia({ thien_phu: 'tu_chat_ngu_don' }, d, dl)).toBe(true)
    expect(danhGia({ thien_phu: 'thong_minh' }, d, dl)).toBe(false)

    expect(danhGia({ trang_thai: 'bach_doc_bat_xam' }, d, dl)).toBe(true)
    expect(danhGia({ trang_thai: 'trong_thuong' }, d, dl)).toBe(false)

    expect(danhGia({ nhan: 'nhan_nhin' }, d, dl)).toBe(true)
    expect(danhGia({ nhan: 'nong_nay' }, d, dl)).toBe(false)
  })

  it('đánh giá vo_hoc và vat_pham', () => {
    const d = taoTrangThaiRong(1)
    d.nhan_vat.vo_hoc['thai_cuc_quyen'] = { cap: 3, tien_do: 50, hoan_thien: 100 }
    d.nhan_vat.hanh_trang['thiet_kiem'] = 2

    expect(danhGia({ vo_hoc: 'thai_cuc_quyen', cap_toi_thieu: 3 }, d, dl)).toBe(true)
    expect(danhGia({ vo_hoc: 'thai_cuc_quyen', cap_toi_thieu: 4 }, d, dl)).toBe(false)
    expect(danhGia({ vo_hoc: 'hang_long_chuong' }, d, dl)).toBe(false)

    expect(danhGia({ vat_pham: 'thiet_kiem', so_luong: 2 }, d, dl)).toBe(true)
    expect(danhGia({ vat_pham: 'thiet_kiem', so_luong: 3 }, d, dl)).toBe(false)
    expect(danhGia({ vat_pham: 'bi_kip' }, d, dl)).toBe(false)
  })

  it('va, hoac, khong lồng nhau phức tạp', () => {
    const d = taoTrangThaiRong(1)
    d.nhan_vat.can_cot = 60
    d.nhan_vat.ngo_tinh = 40
    d.nhan_vat.gioi_tinh = 'nam'

    // va: (can_cot >= 50 && ngo_tinh >= 50) -> false
    expect(
      danhGia(
        {
          va: [
            { so: 'can_cot', op: '>=', gt: 50 },
            { so: 'ngo_tinh', op: '>=', gt: 50 },
          ],
        },
        d,
        dl,
      ),
    ).toBe(false)

    // hoac: (can_cot >= 50 || ngo_tinh >= 50) -> true
    expect(
      danhGia(
        {
          hoac: [
            { so: 'can_cot', op: '>=', gt: 50 },
            { so: 'ngo_tinh', op: '>=', gt: 50 },
          ],
        },
        d,
        dl,
      ),
    ).toBe(true)

    // khong: !(gioi_tinh == 'nu') -> true
    expect(
      danhGia(
        {
          khong: { la: 'gioi_tinh', trong: ['nu'] },
        },
        d,
        dl,
      ),
    ).toBe(true)

    // Lồng nhau: va(can_cot >= 50, hoac(ngo_tinh >= 50, khong(gioi_tinh == 'nu'))) -> true
    expect(
      danhGia(
        {
          va: [
            { so: 'can_cot', op: '>=', gt: 50 },
            {
              hoac: [
                { so: 'ngo_tinh', op: '>=', gt: 50 },
                { khong: { la: 'gioi_tinh', trong: ['nu'] } },
              ],
            },
          ],
        },
        d,
        dl,
      ),
    ).toBe(true)
  })

  it('moTaThieu trả về null khi đạt, chuỗi mô tả khi thiếu', () => {
    const d = taoTrangThaiRong(1)
    d.nhan_vat.ngan_luong = 30

    expect(moTaThieu({ so: 'ngan_luong', op: '>=', gt: 20 }, d, dl)).toBeNull()
    expect(moTaThieu({ so: 'ngan_luong', op: '>=', gt: 50 }, d, dl)).toBe('Cần Ngân Lượng 50')
    expect(moTaThieu({ vat_pham: 'bi_kip', so_luong: 1 }, d, dl)).toBe('Cần vật phẩm bi_kip')
  })
})
