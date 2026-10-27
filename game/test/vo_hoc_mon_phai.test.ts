import { describe, expect, it } from 'vitest'
import { napTuDia } from '../src/du_lieu/nap_node'

// Danh sách tên copy nguyên văn từ HS02 I.1 (Thiếu Lâm, Võ Đang, Cái Bang) và HS02 I.4 (Hoa Sơn)
const VO_HOC_HS02_THIEU_LAM = [
  'La Hán Quyền',
  'Vi Đà Chử',
  'Phổ Môn Đao Pháp',
  'Long Trảo Thủ',
  'Đại Lực Kim Cương Chỉ',
  'Như Lai Thiên Diệp Thủ',
  'Đạt Ma Kiếm Pháp',
  'Nhiên Mộc Đao Pháp',
  'Vô Tướng Kiếp Chỉ',
  'Dịch Cân Kinh',
  'Tẩy Tủy Kinh',
  'Kim Cương Bất Hoại Thể',
]

const VO_HOC_HS02_VO_DANG = [
  'Võ Đang Trường Quyền',
  'Nhu Vân Kiếm Pháp',
  'Miên Chưởng',
  'Thần Môn Thập Tam Kiếm',
  'Huyền Hư Đao Pháp',
  'Hổ Trảo Tuyệt Hộ Thủ',
  'Thê Vân Tung',
  'Thái Cực Quyền',
  'Thái Cực Kiếm',
  'Thuần Dương Vô Cực Công',
]

const VO_HOC_HS02_CAI_BANG = [
  'Thái Tổ Trường Quyền',
  'Liên Hoa Lạc',
  'Đồng Chùy Thủ',
  'Phong Ma Trượng Pháp',
  'Tiêu Dao Du',
  'Tỏa Hầu Cầm Nã Thủ',
  'Hàng Long Thập Bát Chưởng',
  'Đả Cẩu Bổng Pháp',
]

const VO_HOC_HS02_HOA_SON = [
  'Hoa Sơn Kiếm Pháp',
  'Hỗn Nguyên Chưởng',
  'Tử Hà Thần Công',
]

describe('M1-01: Dữ liệu võ học và 4 môn phái', () => {
  const dl = napTuDia()

  it('đếm đủ 12 võ học Thiếu Lâm liệt kê trong HS02 I.1.A', () => {
    const dsTen = Object.values(dl.vo_hoc ?? {})
      .filter((v) => v.mon_phai === 'thieu_lam' && v.nguon_ten === 'nguyen_tac')
      .map((v) => v.ten)

    for (const ten of VO_HOC_HS02_THIEU_LAM) {
      expect(dsTen).toContain(ten)
    }
    expect(dsTen).toHaveLength(VO_HOC_HS02_THIEU_LAM.length)
  })

  it('đếm đủ 10 võ học Võ Đang liệt kê trong HS02 I.1.B', () => {
    const dsTen = Object.values(dl.vo_hoc ?? {})
      .filter((v) => v.mon_phai === 'vo_dang' && v.nguon_ten === 'nguyen_tac')
      .map((v) => v.ten)

    for (const ten of VO_HOC_HS02_VO_DANG) {
      expect(dsTen).toContain(ten)
    }
    expect(dsTen).toHaveLength(VO_HOC_HS02_VO_DANG.length)
  })

  it('đếm đủ 8 võ học Cái Bang liệt kê trong HS02 I.1.D', () => {
    const dsTen = Object.values(dl.vo_hoc ?? {})
      .filter((v) => v.mon_phai === 'cai_bang' && v.nguon_ten === 'nguyen_tac')
      .map((v) => v.ten)

    for (const ten of VO_HOC_HS02_CAI_BANG) {
      expect(dsTen).toContain(ten)
    }
    expect(dsTen).toHaveLength(VO_HOC_HS02_CAI_BANG.length)
  })

  it('đếm đủ 3 võ học Hoa Sơn liệt kê trong HS02 I.4', () => {
    const dsTen = Object.values(dl.vo_hoc ?? {})
      .filter((v) => v.mon_phai === 'hoa_son' && v.nguon_ten === 'nguyen_tac')
      .map((v) => v.ten)

    for (const ten of VO_HOC_HS02_HOA_SON) {
      expect(dsTen).toContain(ten)
    }
    expect(dsTen).toHaveLength(VO_HOC_HS02_HOA_SON.length)
  })

  it('mỗi môn phái có ít nhất 1 nội công nhập môn và 1 khinh công theo G15', () => {
    const cacPhai = ['thieu_lam', 'vo_dang', 'cai_bang', 'hoa_son']
    for (const phai of cacPhai) {
      const mp = dl.mon_phai?.[phai]
      expect(mp).toBeDefined()

      const dsB1 = mp?.vo_hoc_theo_bac['1'] ?? []
      const coNoiCong = dsB1.some((m) => dl.vo_hoc?.[m]?.tru_cot === 'noi_cong')
      const coKhinhCong = dsB1.some((m) => dl.vo_hoc?.[m]?.tru_cot === 'khinh_cong')

      expect(coNoiCong).toBe(true)
      expect(coKhinhCong).toBe(true)
    }
  })

  it('cấp võ học sư phụ theo bậc tuân thủ G17', () => {
    const cacPhai = ['thieu_lam', 'vo_dang', 'cai_bang', 'hoa_son']
    for (const phai of cacPhai) {
      const mp = dl.mon_phai?.[phai]
      expect(mp?.cap_su_phu_theo_bac).toEqual({
        '1': 6,
        '2': 8,
        '3': 10,
        '4': 10,
        '5': 10,
      })
    }
  })

  it('hệ nội lực tuân thủ HS02 II.2 và G16', () => {
    // Thiếu Lâm: Chí Dương
    expect(dl.vo_hoc?.['dich_can_kinh']?.he_noi_luc).toBe('duong')
    expect(dl.vo_hoc?.['thieu_lam_tam_phap']?.he_noi_luc).toBe('duong')

    // Võ Đang: Thuần Dương Vô Cực Công Chí Dương, Tâm pháp Trung Hòa
    expect(dl.vo_hoc?.['thuan_duong_vo_cuc_cong']?.he_noi_luc).toBe('duong')
    expect(dl.vo_hoc?.['vo_dang_tam_phap']?.he_noi_luc).toBe('hoa')

    // Cái Bang: Chí Dương
    expect(dl.vo_hoc?.['cai_bang_tam_phap']?.he_noi_luc).toBe('duong')

    // Hoa Sơn: Tử Hà Thần Công Chí Dương
    expect(dl.vo_hoc?.['tu_ha_than_cong']?.he_noi_luc).toBe('duong')
    expect(dl.vo_hoc?.['hoa_son_tam_phap']?.he_noi_luc).toBe('duong')
  })

  it('trần cấp khinh công tuân thủ HS02 II.1', () => {
    expect(dl.vo_hoc?.['thieu_lam_than_phap']?.tran_cap).toBe(4)
    expect(dl.vo_hoc?.['the_van_tung']?.tran_cap).toBe(6)
    expect(dl.vo_hoc?.['tieu_dao_du']?.tran_cap).toBe(6)
  })

  it('có đủ võ học tự do trong kịch bản M1', () => {
    expect(dl.vo_hoc?.['song_thu_ho_bac']).toBeDefined()
    expect(dl.vo_hoc?.['song_thu_ho_bac']?.tier).toBe(4)
    expect(dl.vo_hoc?.['song_thu_ho_bac']?.tru_cot).toBe('tuyet_ky')

    expect(dl.vo_hoc?.['khong_minh_quyen']).toBeDefined()
    expect(dl.vo_hoc?.['khong_minh_quyen']?.tier).toBe(3)

    expect(dl.vo_hoc?.['hu_thi_doc_chuong']).toBeDefined()
    expect(dl.vo_hoc?.['hu_thi_doc_chuong']?.tier).toBe(2)

    expect(dl.vo_hoc?.['doc_co_cuu_kiem']).toBeDefined()
    expect(dl.vo_hoc?.['doc_co_cuu_kiem']?.tier).toBe(4)
  })
})
