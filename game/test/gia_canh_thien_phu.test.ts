import { describe, expect, it } from 'vitest'
import { kiemTraNguNghia } from '../src/du_lieu/kiem_tra_ngu_nghia'
import { napDuLieu } from '../src/du_lieu/nap'
import { napTuDia } from '../src/du_lieu/nap_node'

const dl = napTuDia()

describe('M1-02: Gia cảnh, Thiên phú, Trạng thái, Nhãn', () => {
  describe('Gia cảnh (HS01 III.1, HS06 II.4, G06)', () => {
    it('có đúng 4 nhóm gia cảnh', () => {
      expect(Object.keys(dl.gia_canh ?? {})).toHaveLength(4)
      expect(dl.gia_canh).toHaveProperty('han_vi')
      expect(dl.gia_canh).toHaveProperty('binh_dan')
      expect(dl.gia_canh).toHaveProperty('phu_thuong')
      expect(dl.gia_canh).toHaveProperty('vo_lam_the_gia')
    })

    it('tổng tỷ lệ gia cảnh bằng đúng 100 và tỷ lệ từng nhóm 35 / 35 / 20 / 10', () => {
      const cacGiaCanh = Object.values(dl.gia_canh ?? {})
      const tong = cacGiaCanh.reduce((s, gc) => s + gc.ti_le, 0)
      expect(tong).toBe(100)

      expect(dl.gia_canh?.['han_vi']?.ti_le).toBe(35)
      expect(dl.gia_canh?.['binh_dan']?.ti_le).toBe(35)
      expect(dl.gia_canh?.['phu_thuong']?.ti_le).toBe(20)
      expect(dl.gia_canh?.['vo_lam_the_gia']?.ti_le).toBe(10)
    })

    it('ngân lượng khởi đầu và thu nhập gia đình đúng HS06 II.4', () => {
      expect(dl.gia_canh?.['han_vi']?.ngan_luong_khoi_dau).toEqual([0, 0])
      expect(dl.gia_canh?.['han_vi']?.thu_nhap_gia_dinh).toBe(0)

      expect(dl.gia_canh?.['binh_dan']?.ngan_luong_khoi_dau).toEqual([10, 30])
      expect(dl.gia_canh?.['binh_dan']?.thu_nhap_gia_dinh).toBe(5)

      expect(dl.gia_canh?.['phu_thuong']?.ngan_luong_khoi_dau).toEqual([500, 1500])
      expect(dl.gia_canh?.['phu_thuong']?.thu_nhap_gia_dinh).toBe(50)

      expect(dl.gia_canh?.['vo_lam_the_gia']?.ngan_luong_khoi_dau).toEqual([200, 800])
      expect(dl.gia_canh?.['vo_lam_the_gia']?.thu_nhap_gia_dinh).toBe(20)
    })

    it('điều chỉnh chỉ số gốc đúng G06 / HS01 III.1', () => {
      expect(dl.gia_canh?.['han_vi']?.dieu_chinh_chi_so).toEqual({
        can_cot: -10,
        ngo_tinh: 0,
        phuc_duyen: 15,
        mi_luc: 0,
      })

      expect(dl.gia_canh?.['binh_dan']?.dieu_chinh_chi_so).toEqual({
        can_cot: 0,
        ngo_tinh: 0,
        phuc_duyen: 0,
        mi_luc: 0,
      })

      expect(dl.gia_canh?.['phu_thuong']?.dieu_chinh_chi_so).toEqual({
        can_cot: -5,
        ngo_tinh: 10,
        phuc_duyen: 0,
        mi_luc: 10,
      })

      expect(dl.gia_canh?.['vo_lam_the_gia']?.dieu_chinh_chi_so).toEqual({
        can_cot: 10,
        ngo_tinh: 5,
        phuc_duyen: 0,
        mi_luc: 0,
      })
    })

    it('Võ Lâm Thế Gia có cờ võ công gia truyền năm 5 tuổi và kẻ thù truyền kiếp', () => {
      const co = dl.gia_canh?.['vo_lam_the_gia']?.dac_biet
      expect(co).toContain('vo_cong_gia_truyen_5_tuoi')
      expect(co).toContain('ke_thu_truyen_kiep')
    })
  })

  describe('Thiên phú (HS01 III.2, HS05 IV.1, G05)', () => {
    it('đủ 12 thiên phú Tuổi 0', () => {
      expect(Object.keys(dl.thien_phu)).toHaveLength(12)
    })

    it('phân bố độ hiếm đúng: 4 Trắng, 4 Lam, 2 Tím, 2 Đỏ', () => {
      const cacTp = Object.values(dl.thien_phu)
      const demTheoDoHiem = (dh: number) => cacTp.filter((t) => t.do_hiem === dh).length

      expect(demTheoDoHiem(1)).toBe(4) // Trắng
      expect(demTheoDoHiem(2)).toBe(4) // Lam
      expect(demTheoDoHiem(3)).toBe(2) // Tím
      expect(demTheoDoHiem(4)).toBe(2) // Đỏ
    })

    it('4 thiên phú gốc từ GDD và 8 thiên phú đề xuất từ G05 có nguồn chuẩn', () => {
      expect(dl.thien_phu['dao_hoa_kiep']?.nguon).toBe('HS01 III.2')
      expect(dl.thien_phu['tu_chat_ngu_don']?.nguon).toBe('HS01 III.2')
      expect(dl.thien_phu['cuu_duong_tuyet_mach']?.nguon).toBe('HS01 III.2')
      expect(dl.thien_phu['tien_thien_vo_the']?.nguon).toBe('HS05 IV.1')

      const dsG05 = [
        'than_the_cuong_trang',
        'thong_minh_lanh_loi',
        'mat_mui_khoi_ngo',
        'so_huong',
        'thien_sinh_than_luc',
        'doc_nhanh_nho_lau',
        'kim_khau',
        'kinh_mach_ky_di',
      ]
      for (const ma of dsG05) {
        expect(dl.thien_phu[ma]?.nguon).toBe('G05')
      }
    })

    it('Tư Chất Ngu Độn có cờ khóa ngộ tính và cộng căn cốt, phúc duyên mỗi năm', () => {
      const tc = dl.thien_phu['tu_chat_ngu_don']
      expect(tc?.dac_biet).toContain('khoa_ngo_tinh')
      expect(tc?.hieu_ung_moi_nam).toEqual([{ cong: { can_cot: 2, phuc_duyen: 3 } }])
    })
  })

  describe('Trạng thái (HS01 II.7, HS03, HS04 II - III)', () => {
    it('đủ 5 trạng thái HS01 II.7 cùng 2 trạng thái sự kiện 0 - 15 tuổi (M1-14)', () => {
      expect(Object.keys(dl.trang_thai ?? {})).toHaveLength(7)
      expect(dl.trang_thai).toHaveProperty('bach_doc_bat_xam')
      expect(dl.trang_thai).toHaveProperty('minh_dong_da_sat')
      expect(dl.trang_thai).toHaveProperty('han_doc_phe_phoi')
      expect(dl.trang_thai).toHaveProperty('tam_ma_dut_ruot')
      expect(dl.trang_thai).toHaveProperty('kinh_mach_nghich_hanh')
    })

    it('Tâm Ma Đứt Ruột mỗi năm giảm 5 Căn cốt', () => {
      const tm = dl.trang_thai?.['tam_ma_dut_ruot']
      expect(tm?.hieu_ung_moi_nam).toEqual([{ cong: { can_cot: -5 } }])
      expect(tm?.dac_biet).toContain('uy_luc_he_am_50')
    })

    it('Bách Độc Bất Xâm có cờ miễn độc cấp Trung trở xuống', () => {
      expect(dl.trang_thai?.['bach_doc_bat_xam']?.dac_biet).toContain('mien_doc_trung_tro_xuong')
    })
  })

  describe('Nhãn tính cách (HS01 II.7, HS03, HS04 II - III)', () => {
    it('đủ 5 nhãn tính cách HS01 II.7 cùng nhãn Diệu Thủ Không Không (M1-14)', () => {
      expect(Object.keys(dl.nhan ?? {})).toHaveLength(6)
      expect(dl.nhan).toHaveProperty('ac_mong_dem_mua')
      expect(dl.nhan).toHaveProperty('nhan_nhin_tham_sau')
      expect(dl.nhan).toHaveProperty('quat_cuong')
      expect(dl.nhan).toHaveProperty('pha_gia_chi_tu')
      expect(dl.nhan).toHaveProperty('kieu_ngao')
    })
  })

  describe('Kiểm tra ngữ nghĩa và ràng buộc lỗi', () => {
    it('báo lỗi khi tổng tỷ lệ gia cảnh khác 100', () => {
      const giaCanhSai = [
        {
          ma: 'han_vi',
          ten: 'Hàn Vi',
          nguon: 'HS01 III.1',
          ti_le: 40,
          ngan_luong_khoi_dau: [0, 0],
          thu_nhap_gia_dinh: 0,
          dieu_chinh_chi_so: {},
        },
      ]
      expect(() =>
        napDuLieu({
          'gia_canh.json': giaCanhSai,
        }),
      ).toThrow(/tổng ti_le của các gia cảnh/)
    })

    it('báo lỗi khi hiệu ứng them_trang_thai tham chiếu trạng thái không tồn tại', () => {
      const dlMau = {
        ...dl,
        su_kien: {
          sk_thu: {
            ma: 'sk_thu',
            nguon: 'test',
            ten: 'Thử',
            loai: 'thuong' as const,
            tuoi: [10, 20] as [number, number],
            lap_lai: 'mot_lan' as const,
            mo_ta: 'Thử nghiệm',
            lua_chon: [
              {
                ma: 'a',
                nhan: 'Nút A',
                ket_qua: {
                  van_ban: 'A',
                  hieu_ung: [{ them_trang_thai: 'trang_thai_khong_ton_tai' }],
                },
              },
              {
                ma: 'b',
                nhan: 'Nút B',
                ket_qua: { van_ban: 'B', hieu_ung: [] },
              },
            ],
          },
        },
      }
      const loi = kiemTraNguNghia(dlMau)
      expect(loi.some((m) => m.includes('trang_thai_khong_ton_tai'))).toBe(true)
    })

    it('báo lỗi khi hiệu ứng them_nhan tham chiếu nhãn không tồn tại', () => {
      const dlMau = {
        ...dl,
        su_kien: {
          sk_thu: {
            ma: 'sk_thu',
            nguon: 'test',
            ten: 'Thử',
            loai: 'thuong' as const,
            tuoi: [10, 20] as [number, number],
            lap_lai: 'mot_lan' as const,
            mo_ta: 'Thử nghiệm',
            lua_chon: [
              {
                ma: 'a',
                nhan: 'Nút A',
                ket_qua: {
                  van_ban: 'A',
                  hieu_ung: [{ them_nhan: 'nhan_khong_ton_tai' }],
                },
              },
              {
                ma: 'b',
                nhan: 'Nút B',
                ket_qua: { van_ban: 'B', hieu_ung: [] },
              },
            ],
          },
        },
      }
      const loi = kiemTraNguNghia(dlMau)
      expect(loi.some((m) => m.includes('nhan_khong_ton_tai'))).toBe(true)
    })
  })
})
