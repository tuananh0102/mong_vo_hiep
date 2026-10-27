// M0-04: ví dụ trong ho_so_08_luoc_do_du_lieu.md phải qua lược đồ zod.
// Mới có lược đồ cho vung.json; ví dụ loại khác thêm vào đây khi task tương ứng thêm lược đồ.
import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { napDuLieu } from '../src/du_lieu/nap'

const hs08 = readFileSync(new URL('../../ho_so_08_luoc_do_du_lieu.md', import.meta.url), 'utf8')

/** Lấy khối json đầu tiên sau tiêu đề mục. */
function khoiJson(tieuDe: string): unknown {
  const sau = hs08.slice(hs08.indexOf(tieuDe))
  const m = /```json\r?\n([\s\S]*?)```/.exec(sau)
  if (!m?.[1]) throw new Error(`không có khối json sau "${tieuDe}"`)
  return JSON.parse(m[1])
}

describe('ví dụ HS08', () => {
  it('II.1 vung.json qua lược đồ', () => {
    const dl = napDuLieu({ 'vung.json': khoiJson('### II.1.') })
    expect(Object.keys(dl.vung)).toEqual(['trung_nguyen', 'giang_nam'])
  })

  it('II.2 chi_so.json qua lược đồ', () => {
    const dl = napDuLieu({ 'chi_so.json': khoiJson('### II.2.') })
    expect(dl.chi_so['hp_max']?.phai_sinh).toBe(true)
    expect(dl.chi_so['can_cot']?.tran_cung).toBe(150)
  })

  it('II.3 vo_hoc qua lược đồ', () => {
    const dl = napDuLieu({ 'vo_hoc/vi_du.json': khoiJson('### II.3.') })
    expect(dl.vo_hoc?.['thieu_lam_tam_phap']?.tru_cot).toBe('noi_cong')
    expect(dl.vo_hoc?.['thieu_lam_tam_phap']?.he_noi_luc).toBe('duong')
  })

  it('II.4 mon_phai qua lược đồ', () => {
    const dsChiSo = [
      ...(khoiJson('### II.2.') as object[]),
      {
        ma: 'ngo_tinh',
        ten: 'Ngộ Tính',
        nhom: 'thien_phu',
        min: 0,
        max: 100,
        tran_cung: 150,
        hien_thi: 'hien',
        nguon: 'HS01 II.8',
      },
      {
        ma: 'hiep_nghia',
        ten: 'Hiệp Nghĩa',
        nhom: 'xa_hoi',
        min: -1000,
        max: 1000,
        tran_cung: null,
        hien_thi: 'hien',
        nguon: 'HS01 II.8',
      },
    ]
    const dl = napDuLieu({
      'vung.json': khoiJson('### II.1.'),
      'chi_so.json': dsChiSo,
      'vo_hoc/vi_du.json': [
        {
          ma: 'hoa_son_kiem_phap',
          ten: 'Hoa Sơn Kiếm Pháp',
          nguon: 'HS02 I.4',
          nguon_ten: 'nguyen_tac',
          tru_cot: 'ngoai_cong',
          tier: 1,
          loai_binh_khi: 'kiem',
        },
        {
          ma: 'hoa_son_tam_phap',
          ten: 'Hoa Sơn Tâm Pháp',
          nguon: 'G15',
          nguon_ten: 'phong_tac',
          tru_cot: 'noi_cong',
          tier: 1,
          he_noi_luc: 'duong',
        },
        {
          ma: 'hoa_son_than_phap',
          ten: 'Hoa Sơn Thân Pháp',
          nguon: 'G15',
          nguon_ten: 'phong_tac',
          tru_cot: 'khinh_cong',
          tier: 1,
          tran_cap: 4,
        },
        {
          ma: 'hon_nguyen_chuong',
          ten: 'Hỗn Nguyên Chưởng',
          nguon: 'HS02 I.4',
          nguon_ten: 'nguyen_tac',
          tru_cot: 'ngoai_cong',
          tier: 2,
          loai_binh_khi: 'quyen_chuong',
        },
        {
          ma: 'tu_ha_than_cong',
          ten: 'Tử Hà Thần Công',
          nguon: 'HS02 I.4',
          nguon_ten: 'nguyen_tac',
          tru_cot: 'noi_cong',
          tier: 3,
          he_noi_luc: 'duong',
        },
      ],
      'mon_phai/hoa_son.json': khoiJson('### II.4.'),
    })
    expect(dl.mon_phai?.['hoa_son']?.phe).toBe('chinh')
    expect(dl.mon_phai?.['hoa_son']?.quy_mo).toBe('vua')
  })

  it('II.5 gia_canh.json qua lược đồ', () => {
    const dsChiSo = [
      ...(khoiJson('### II.2.') as object[]),
      { ma: 'ngo_tinh', ten: 'Ngộ Tính', nhom: 'thien_phu', min: 0, max: 100, tran_cung: 150, hien_thi: 'hien', nguon: 'HS01 II.8' },
      { ma: 'phuc_duyen', ten: 'Phúc Duyên', nhom: 'thien_phu', min: 0, max: 100, tran_cung: 150, hien_thi: 'ban_an', nguon: 'HS01 II.8' },
      { ma: 'mi_luc', ten: 'Mị Lực', nhom: 'thien_phu', min: 0, max: 100, tran_cung: 150, hien_thi: 'hien', nguon: 'HS01 II.8' },
    ]
    const dl = napDuLieu({
      'chi_so.json': dsChiSo,
      'gia_canh.json': khoiJson('### II.5.'),
    })
    expect(dl.gia_canh?.['han_vi']?.ti_le).toBe(35)
    expect(dl.gia_canh?.['vo_lam_the_gia']?.dac_biet).toContain('vo_cong_gia_truyen_5_tuoi')
  })

  it('II.6 thien_phu.json qua lược đồ', () => {
    const dsChiSo = [
      ...(khoiJson('### II.2.') as object[]),
      { ma: 'ngo_tinh', ten: 'Ngộ Tính', nhom: 'thien_phu', min: 0, max: 100, tran_cung: 150, hien_thi: 'hien', nguon: 'HS01 II.8' },
      { ma: 'phuc_duyen', ten: 'Phúc Duyên', nhom: 'thien_phu', min: 0, max: 100, tran_cung: 150, hien_thi: 'ban_an', nguon: 'HS01 II.8' },
    ]
    const dl = napDuLieu({
      'chi_so.json': dsChiSo,
      'thien_phu.json': khoiJson('### II.6.'),
    })
    expect(dl.thien_phu['than_the_cuong_trang']?.do_hiem).toBe(1)
    expect(dl.thien_phu['tu_chat_ngu_don']?.do_hiem).toBe(3)
  })

  it('II.7 trang_thai.json qua lược đồ', () => {
    const dl = napDuLieu({
      'chi_so.json': khoiJson('### II.2.'),
      'trang_thai.json': khoiJson('### II.7.'),
    })
    expect(dl.trang_thai?.['bach_doc_bat_xam']?.dac_biet).toContain('mien_doc_trung_tro_xuong')
    expect(dl.trang_thai?.['tam_ma_dut_ruot']?.hieu_ung_moi_nam).toHaveLength(1)
  })

  it('II.8 nhan.json qua lược đồ', () => {
    const dl = napDuLieu({
      'nhan.json': khoiJson('### II.8.'),
    })
    expect(dl.nhan?.['nhan_nhin_tham_sau']?.dac_biet).toContain('tang_sat_thuong_danh_len_am_khi')
    expect(dl.nhan?.['quat_cuong']?.ten).toBe('Quật Cường')
  })

  it('II.9 vat_pham qua lược đồ', () => {
    const dl = napDuLieu({
      'chi_so.json': khoiJson('### II.2.'),
      'vat_pham/vi_du.json': khoiJson('### II.9.'),
    })
    expect(dl.vat_pham?.['kim_sang_duoc']?.dung_trong_tran).toBe(true)
    expect(dl.vat_pham?.['thiet_kiem']?.loai).toBe('binh_khi')
  })

  it('II.10 hanh_dong.json qua lược đồ', () => {
    const dl = napDuLieu({
      'chi_so.json': khoiJson('### II.2.'),
      'hanh_dong.json': khoiJson('### II.10.'),
    })
    expect(dl.hanh_dong?.['nam_noi']?.ap).toBe(1)
    expect(dl.hanh_dong?.['mua_sam']?.mien_phi).toBe(true)
  })

  it('không có dấu gạch dài', () => {
    expect(hs08).not.toContain('—')
  })
})
