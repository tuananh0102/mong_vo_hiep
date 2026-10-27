import { describe, expect, it } from 'vitest'
import { kiemTraNguNghia } from '../src/du_lieu/kiem_tra_ngu_nghia'
import { napDuLieu } from '../src/du_lieu/nap'
import { napTuDia } from '../src/du_lieu/nap_node'

const dl = napTuDia()

describe('M1-03: Dữ liệu vật phẩm và hành động', () => {
  describe('Đan dược (HS06 III)', () => {
    it('có đúng 9 loại đan dược chính tông theo HS06 III', () => {
      const danhSach9DanDuoc = [
        'kim_sang_duoc',
        'tieu_hoan_dan',
        'dai_hoan_dan',
        'cuu_hoa_ngoc_lo_hoan',
        'hac_ngoc_doan_tuc_cao',
        'thien_vuong_bao_tam_dan',
        'bach_hung_dam_hoan',
        'bach_van_hung_dam_hoan',
        'tuc_menh_bat_hoan',
      ]

      for (const ma of danhSach9DanDuoc) {
        expect(dl.vat_pham, `Vật phẩm ${ma} phải tồn tại`).toHaveProperty(ma)
        expect(dl.vat_pham?.[ma]?.loai).toBe('dan_duoc')
      }
    })

    it('giá và kênh bán đúng HS06 III', () => {
      expect(dl.vat_pham?.['kim_sang_duoc']?.gia).toBe(15)
      expect(dl.vat_pham?.['kim_sang_duoc']?.ban_o).toBe('cho')
      expect(dl.vat_pham?.['kim_sang_duoc']?.dung_trong_tran).toBe(true)

      expect(dl.vat_pham?.['tieu_hoan_dan']?.gia).toBe(150)
      expect(dl.vat_pham?.['tieu_hoan_dan']?.ban_o).toBe('cho')
      expect(dl.vat_pham?.['tieu_hoan_dan']?.khang_thuoc).toBe(true)

      expect(dl.vat_pham?.['dai_hoan_dan']?.gia).toBe(2500)
      expect(dl.vat_pham?.['dai_hoan_dan']?.ban_o).toBe('khong_ban')
      expect(dl.vat_pham?.['dai_hoan_dan']?.khang_thuoc).toBe(true)

      expect(dl.vat_pham?.['cuu_hoa_ngoc_lo_hoan']?.gia).toBe(800)
      expect(dl.vat_pham?.['cuu_hoa_ngoc_lo_hoan']?.ban_o).toBe('cho')

      expect(dl.vat_pham?.['hac_ngoc_doan_tuc_cao']?.gia).toBe(1500)
      expect(dl.vat_pham?.['hac_ngoc_doan_tuc_cao']?.ban_o).toBe('hac_thi')

      expect(dl.vat_pham?.['thien_vuong_bao_tam_dan']?.gia).toBe(1200)
      expect(dl.vat_pham?.['thien_vuong_bao_tam_dan']?.ban_o).toBe('hac_thi')
      expect(dl.vat_pham?.['thien_vuong_bao_tam_dan']?.dac_biet).toContain('thien_vuong_bao_tam')

      expect(dl.vat_pham?.['bach_hung_dam_hoan']?.gia).toBe(600)
      expect(dl.vat_pham?.['bach_hung_dam_hoan']?.ban_o).toBe('cho')

      expect(dl.vat_pham?.['bach_van_hung_dam_hoan']?.gia).toBe(350)
      expect(dl.vat_pham?.['bach_van_hung_dam_hoan']?.ban_o).toBe('cho')

      expect(dl.vat_pham?.['tuc_menh_bat_hoan']?.gia).toBe(2000)
      expect(dl.vat_pham?.['tuc_menh_bat_hoan']?.ban_o).toBe('hac_thi')
      expect(dl.vat_pham?.['tuc_menh_bat_hoan']?.dac_biet).toContain('keo_dai_tuoi_tho_10')
    })
  })

  describe('Vật phẩm sự kiện và kịch bản (HS03, HS04)', () => {
    it('chứa các vật phẩm kịch bản đặc trưng', () => {
      const dsSuKien = [
        'khan_lua_chua_mat_do',
        'de_thiet_dau_tuong_quan',
        'lenh_bai_huyen_thiet',
        'chu_tinh_bang_thiem',
        'quan_co_tran_lung',
        'thiet_kiem',
      ]
      for (const ma of dsSuKien) {
        expect(dl.vat_pham, `Vật phẩm sự kiện ${ma} phải tồn tại`).toHaveProperty(ma)
      }
    })
  })

  describe('Hành động (HS01 IV, HS03 I, HS04 I, G08, G32)', () => {
    it('đầy đủ các hành động tuổi 0 - 5 theo HS03 I và G08', () => {
      const ds0_5 = ['nam_noi', 'tap_bo', 'nghe_ke_chuyen', 'luc_loi_do_dac']
      for (const ma of ds0_5) {
        const hd = dl.hanh_dong?.[ma]
        expect(hd, `Hành động ${ma} phải tồn tại`).toBeDefined()
        expect(hd?.tuoi).toEqual([0, 5])
        expect(hd?.ap).toBe(1)
        expect(hd?.nhom_tab).toBe('sinh_hoat')
      }
    })

    it('đầy đủ các hành động tuổi 6 - 10 theo HS03 I và G08', () => {
      const ds6_10 = [
        'doc_sach_vo_long',
        'ren_the_luc',
        'choi_cung_tre',
        'phu_giup_gia_dinh',
        'di_an_trom_vat',
        'hoc_tap_hoc_dong_nien',
      ]
      for (const ma of ds6_10) {
        const hd = dl.hanh_dong?.[ma]
        expect(hd, `Hành động ${ma} phải tồn tại`).toBeDefined()
        expect(hd?.tuoi).toEqual([6, 10])
        expect(hd?.ap).toBe(1)
      }
    })

    it('đầy đủ các hành động tuổi 11+ theo HS01 IV và HS04 I', () => {
      const ds11 = [
        'luyen_cong',
        'hoc_tap_hoc',
        'lam_thue_vat',
        'tieu_thuong',
        'ap_tieu',
        'san_tien_thuong',
        'nhiem_vu_su_mon',
        'sai_phai_su_mon',
        'kham_pha',
        'tri_thuong',
        'be_quan',
        'duong_gia',
      ]
      for (const ma of ds11) {
        expect(dl.hanh_dong, `Hành động ${ma} phải tồn tại`).toHaveProperty(ma)
      }

      expect(dl.hanh_dong?.['lam_thue_vat']?.tuoi).toEqual([11, 18])
      expect(dl.hanh_dong?.['tieu_thuong']?.tuoi[0]).toBe(16)
      expect(dl.hanh_dong?.['ap_tieu']?.tuoi[0]).toBe(16)
      expect(dl.hanh_dong?.['be_quan']?.tuoi[0]).toBe(71)
      expect(dl.hanh_dong?.['duong_gia']?.tuoi[0]).toBe(71)
    })

    it('hành động miễn phí 0 AP (tối đa 2/năm) và hành động tiện ích không tính giới hạn', () => {
      const hdMuaSam = dl.hanh_dong?.['mua_sam']
      expect(hdMuaSam?.ap).toBe(0)
      expect(hdMuaSam?.mien_phi).toBe(true)
      expect(hdMuaSam?.khong_tinh_gioi_han).toBe(false)

      const hdTroChuyen = dl.hanh_dong?.['tro_chuyen']
      expect(hdTroChuyen?.ap).toBe(0)
      expect(hdTroChuyen?.mien_phi).toBe(true)

      const hdThayTrangBi = dl.hanh_dong?.['thay_trang_bi']
      expect(hdThayTrangBi?.ap).toBe(0)
      expect(hdThayTrangBi?.khong_tinh_gioi_han).toBe(true)

      const hdUongThuoc = dl.hanh_dong?.['uong_dan_duoc']
      expect(hdUongThuoc?.ap).toBe(0)
      expect(hdUongThuoc?.khong_tinh_gioi_han).toBe(true)

      const hdXemBangTin = dl.hanh_dong?.['xem_bang_tin']
      expect(hdXemBangTin?.ap).toBe(0)
      expect(hdXemBangTin?.khong_tinh_gioi_han).toBe(true)
    })
  })

  describe('Ràng buộc và kiểm tra ngữ nghĩa', () => {
    it('báo lỗi khi hành động có khoảng tuổi min > max', () => {
      const hdSai = [
        {
          ma: 'hd_sai',
          ten: 'Hành Động Sai',
          nguon: 'test',
          tuoi: [20, 10],
          ap: 1,
          xu_ly: 'hd_sai',
          nhom_tab: 'sinh_hoat',
        },
      ]
      expect(() =>
        napDuLieu({
          'hanh_dong.json': hdSai,
        }),
      ).toThrow(/khoảng tuổi/)
    })

    it('báo lỗi khi sự kiện tham chiếu vật phẩm không tồn tại', () => {
      const dlMau = {
        ...dl,
        su_kien: {
          sk_thu_vp: {
            ma: 'sk_thu_vp',
            nguon: 'test',
            ten: 'Thử Vật Phẩm',
            loai: 'thuong' as const,
            tuoi: [10, 20] as [number, number],
            lap_lai: 'mot_lan' as const,
            mo_ta: 'Thử nghiệm vật phẩm',
            lua_chon: [
              {
                ma: 'a',
                nhan: 'Lấy đồ',
                ket_qua: {
                  van_ban: 'A',
                  hieu_ung: [{ nhan_vat_pham: 'vat_pham_khong_he_co' }],
                },
              },
              {
                ma: 'b',
                nhan: 'Bỏ qua',
                ket_qua: { van_ban: 'B', hieu_ung: [] },
              },
            ],
          },
        },
      }
      const loi = kiemTraNguNghia(dlMau)
      expect(loi.some((m) => m.includes('vat_pham_khong_he_co'))).toBe(true)
    })
  })
})
