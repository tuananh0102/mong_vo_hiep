import { describe, expect, it } from 'vitest'
import { napTuDia } from '../src/du_lieu/nap_node'
import { kiemTraBatBien } from '../src/luat/bat_bien'
import { taoTrangThaiRong } from '../src/luat/chi_so'
import { docBanLuu, PHIEN_BAN, tuanTuHoa, type BanLuu } from '../src/luat/luu'
import { xemManHinh } from '../src/luat/xem'

const dl = napTuDia()

describe('luu_game và bat_bien', () => {
  it('tuanTuHoa rồi docBanLuu trả lại dữ liệu bằng nhau', () => {
    const sDau = taoTrangThaiRong(77)
    sDau.nhan_vat.ten = 'Quách Tĩnh'
    const sHienTai = structuredClone(sDau)
    sHienTai.nhan_vat.tuoi = 18
    sHienTai.nhan_vat.ngan_luong = 200

    const banLuu: BanLuu = {
      phien_ban: PHIEN_BAN,
      trang_thai_dau: sDau,
      lenh: [{ loai: 'qua_nam' }],
      trang_thai: sHienTai,
    }

    const chuoi = tuanTuHoa(banLuu)
    const docLai = docBanLuu(chuoi)

    expect(docLai).toEqual(banLuu)
    expect(docLai.trang_thai.nhan_vat.ten).toBe('Quách Tĩnh')
    expect(docLai.trang_thai.nhan_vat.tuoi).toBe(18)
  })

  it('xemManHinh trích xuất đúng các trường cho giao diện', () => {
    const s = taoTrangThaiRong(1)
    s.nhan_vat.ten = 'Dương Quá'
    s.nhan_vat.tuoi = 20
    s.nhan_vat.ap_con_lai = 3
    s.nhan_vat.hp = 150
    s.nhan_vat.noi_tuc = 100
    s.nhan_vat.ngan_luong = 50
    s.nhan_vat.vung = 'giang_nam'

    const mh = xemManHinh(s, dl)
    expect(mh.ten).toBe('Dương Quá')
    expect(mh.tuoi).toBe(20)
    expect(mh.ap).toBe(3)
    expect(mh.hp).toBe(150)
    expect(mh.noi_tuc).toBe(100)
    expect(mh.ngan_luong).toBe(50)
    expect(mh.vung).toBe('Giang Nam')
  })

  it('kiemTraBatBien phát hiện các vi phạm bất biến', () => {
    const s = taoTrangThaiRong(1)
    expect(kiemTraBatBien(s, dl)).toEqual([])

    // Vi phạm căn cốt vượt trần
    s.nhan_vat.can_cot = 155
    expect(kiemTraBatBien(s, dl).some((m) => m.includes('can_cot'))).toBe(true)
    s.nhan_vat.can_cot = 50

    // Vi phạm ngân lượng âm
    s.nhan_vat.ngan_luong = -10
    expect(kiemTraBatBien(s, dl).some((m) => m.includes('ngan_luong'))).toBe(true)
    s.nhan_vat.ngan_luong = 0

    // Vi phạm ap_con_lai âm
    s.nhan_vat.ap_con_lai = -1
    expect(kiemTraBatBien(s, dl).some((m) => m.includes('ap_con_lai'))).toBe(true)
  })
})
