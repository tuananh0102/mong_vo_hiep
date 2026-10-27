import { describe, expect, it } from 'vitest'
import { napDuLieu } from '../src/du_lieu/nap'
import { docTepDia } from '../src/du_lieu/nap_node'
import { taoNhanVatRong } from '../src/luat/chi_so'
import { apDung } from '../src/luat/dong_co'
import type { TrangThaiGame } from '../src/luat/kieu'
import { rngTuSeed, taoRng } from '../src/luat/rng'
import { hocVoHoc } from '../src/luat/vo_hoc'
import { xemHanhDong } from '../src/luat/xem'

const dl = napDuLieu(docTepDia())

function taoTrangThaiTest(seed = 1): TrangThaiGame {
  const rng = taoRng([seed, 0, 0, 0])
  return {
    phien_ban: 1,
    seed,
    rng: rng.layTrangThai(),
    nam_the_gioi: 0,
    nhan_vat: taoNhanVatRong(),
    the_gioi: { npc: {} },
    cho: null,
    hang_doi_su_kien: [],
    lich_hen: [],
    bien_nien: [],
    ket_thuc: null,
    dong_toc: { doi_truoc: [] },
  }
}

describe('Hành động AP và miễn phí (M1-09)', () => {
  describe('Quy tắc AP và Lượt miễn phí', () => {
    it('Hết AP thì lệnh trả lỗi het_ap', () => {
      const d = taoTrangThaiTest()
      d.nhan_vat.tuoi = 2
      d.nhan_vat.ap_con_lai = 0 // Hết AP

      const kq = apDung(d, { loai: 'hanh_dong', ma: 'tap_bo' }, dl)
      expect(kq.loi).toBe('het_ap')
      expect(kq.dong_moi.length).toBe(0)
      expect(d.nhan_vat.can_cot).toBe(0) // Không thay đổi
    })

    it('Miễn phí không trừ AP và tối đa 2 lượt / năm từ 11 tuổi', () => {
      const d = taoTrangThaiTest()
      d.nhan_vat.tuoi = 15
      d.nhan_vat.ap_con_lai = 3
      d.nhan_vat.viec_mien_phi_con_lai = 2

      // Lượt 1: mua_sam (miễn phí)
      const kq1 = apDung(d, { loai: 'hanh_dong', ma: 'mua_sam' }, dl)
      expect(kq1.loi).toBeNull()
      expect(kq1.trang_thai.nhan_vat.ap_con_lai).toBe(3) // Không trừ AP
      expect(kq1.trang_thai.nhan_vat.viec_mien_phi_con_lai).toBe(1)

      // Lượt 2: tro_chuyen (miễn phí)
      const kq2 = apDung(kq1.trang_thai, { loai: 'hanh_dong', ma: 'tro_chuyen' }, dl)
      expect(kq2.loi).toBeNull()
      expect(kq2.trang_thai.nhan_vat.ap_con_lai).toBe(3) // Vẫn còn 3 AP
      expect(kq2.trang_thai.nhan_vat.viec_mien_phi_con_lai).toBe(0)

      // Lượt 3: hết lượt miễn phí -> trả lỗi het_luot_mien_phi
      const kq3 = apDung(kq2.trang_thai, { loai: 'hanh_dong', ma: 'mua_sam' }, dl)
      expect(kq3.loi).toBe('het_luot_mien_phi')
      expect(kq3.trang_thai.nhan_vat.ap_con_lai).toBe(3) // AP vẫn không bị trừ
    })

    it('Hành động không tính giới hạn (như xem_bang_tin) không tốn AP và không tốn lượt', () => {
      const d = taoTrangThaiTest()
      d.nhan_vat.tuoi = 15
      d.nhan_vat.ap_con_lai = 0
      d.nhan_vat.viec_mien_phi_con_lai = 0

      // Vẫn thực hiện được bình thường
      const kq = apDung(d, { loai: 'hanh_dong', ma: 'xem_bang_tin' }, dl)
      expect(kq.loi).toBeNull()
    })
  })

  describe('Độ tuổi và Điều kiện hành động', () => {
    it('Hành động sai tuổi bị từ chối với lỗi sai_tuoi', () => {
      const d = taoTrangThaiTest()
      d.nhan_vat.tuoi = 25
      d.nhan_vat.ap_con_lai = 3

      // Nằm nôi chỉ dành cho tuổi 0 - 5
      const kq1 = apDung(d, { loai: 'hanh_dong', ma: 'nam_noi' }, dl)
      expect(kq1.loi).toBe('sai_tuoi')

      // Tiểu thương chỉ từ 16 tuổi trở lên
      d.nhan_vat.tuoi = 8
      const kq2 = apDung(d, { loai: 'hanh_dong', ma: 'tieu_thuong' }, dl)
      expect(kq2.loi).toBe('sai_tuoi')
    })

    it('Học Tạp học cộng đúng khoảng G07 theo Ngộ tính', () => {
      // Công thức G07: + min(15, 5 + floor(ngo_tinh / 10))
      // 1. Gia cảnh Hàn Vi không có thầy -> thieu_dieu_kien_hoc
      const dHanVi = taoTrangThaiTest()
      dHanVi.nhan_vat.tuoi = 12
      dHanVi.nhan_vat.ap_con_lai = 2
      dHanVi.nhan_vat.gia_canh = 'han_vi'
      const kqHanVi = apDung(dHanVi, { loai: 'hanh_dong', ma: 'hoc_tap_hoc', tham_so: { tap_hoc: 'y_thuat' } }, dl)
      expect(kqHanVi.loi).toBe('thieu_dieu_kien_hoc')

      // 2. Gia cảnh Phú Thương (có thầy) và Ngộ tính 10 -> 5 + 1 = +6
      const d1 = taoTrangThaiTest()
      d1.nhan_vat.tuoi = 12
      d1.nhan_vat.ap_con_lai = 2
      d1.nhan_vat.gia_canh = 'phu_thuong'
      d1.nhan_vat.ngo_tinh = 10
      d1.nhan_vat.y_thuat = 0
      const kq1 = apDung(d1, { loai: 'hanh_dong', ma: 'hoc_tap_hoc', tham_so: { tap_hoc: 'y_thuat' } }, dl)
      expect(kq1.loi).toBeNull()
      expect(kq1.trang_thai.nhan_vat.y_thuat).toBe(6)

      // 3. Gia cảnh Thế Gia và Ngộ tính 50 -> 5 + 5 = +10
      const d2 = taoTrangThaiTest()
      d2.nhan_vat.tuoi = 12
      d2.nhan_vat.ap_con_lai = 2
      d2.nhan_vat.gia_canh = 'vo_lam_the_gia'
      d2.nhan_vat.ngo_tinh = 50
      d2.nhan_vat.doc_thuat = 10
      const kq2 = apDung(d2, { loai: 'hanh_dong', ma: 'hoc_tap_hoc', tham_so: { tap_hoc: 'doc_thuat' } }, dl)
      expect(kq2.loi).toBeNull()
      expect(kq2.trang_thai.nhan_vat.doc_thuat).toBe(10 + 10)

      // 4. Đang ở môn phái và Ngộ tính 120 -> trần cứng +15
      const d3 = taoTrangThaiTest()
      d3.nhan_vat.tuoi = 15
      d3.nhan_vat.ap_con_lai = 2
      d3.nhan_vat.mon_phai = { ma: 'hoa_son', bac: 1, cong_hien: 10, tu_tuoi: 12 }
      d3.nhan_vat.ngo_tinh = 120
      d3.nhan_vat.cam = 0
      const kq3 = apDung(d3, { loai: 'hanh_dong', ma: 'hoc_tap_hoc', tham_so: { tap_hoc: 'cam' } }, dl)
      expect(kq3.loi).toBeNull()
      expect(kq3.trang_thai.nhan_vat.cam).toBe(15) // trần 15
    })
  })

  describe('Các hành động cụ thể', () => {
    it('Làm thuê vặt (11 - 18 tuổi): nhận 5 - 15 lạng và Căn cốt +1', () => {
      const d = taoTrangThaiTest()
      d.nhan_vat.tuoi = 14
      d.nhan_vat.ap_con_lai = 2
      d.nhan_vat.ngan_luong = 0
      d.nhan_vat.can_cot = 20

      const kq = apDung(d, { loai: 'hanh_dong', ma: 'lam_thue_vat' }, dl)
      expect(kq.loi).toBeNull()
      expect(kq.trang_thai.nhan_vat.ap_con_lai).toBe(1)
      expect(kq.trang_thai.nhan_vat.ngan_luong).toBeGreaterThanOrEqual(5)
      expect(kq.trang_thai.nhan_vat.ngan_luong).toBeLessThanOrEqual(15)
      expect(kq.trang_thai.nhan_vat.can_cot).toBe(21)
      expect(kq.trang_thai.nhan_vat.can_cot_dinh).toBe(21)
    })

    it('Tiểu thương (16+ tuổi): Roll Ngộ tính vs 50, kiểm tra cả thành công và thất bại', () => {
      // Tìm seed thắng và thua
      let seedThang = -1
      let seedThua = -1

      for (let s = 1; s <= 200; s++) {
        const testRng = rngTuSeed(s)
        const d = taoTrangThaiTest()
        d.rng = testRng.layTrangThai()
        d.nhan_vat.tuoi = 20
        d.nhan_vat.ap_con_lai = 2
        d.nhan_vat.ngo_tinh = 50 // p = 50%
        const kq = apDung(d, { loai: 'hanh_dong', ma: 'tieu_thuong' }, dl)
        if (kq.dong_moi.some((b) => b.van_ban.includes('đắt khách'))) {
          if (seedThang === -1) seedThang = s
        } else if (kq.dong_moi.some((b) => b.van_ban.includes('ế ẩm'))) {
          if (seedThua === -1) seedThua = s
        }
        if (seedThang !== -1 && seedThua !== -1) break
      }

      expect(seedThang).toBeGreaterThan(0)
      expect(seedThua).toBeGreaterThan(0)

      // Test nhánh thắng: nhận đủ 50 - 150 lạng
      const dWin = taoTrangThaiTest()
      dWin.rng = rngTuSeed(seedThang).layTrangThai()
      dWin.nhan_vat.tuoi = 20
      dWin.nhan_vat.ap_con_lai = 2
      dWin.nhan_vat.ngo_tinh = 50
      const kqWin = apDung(dWin, { loai: 'hanh_dong', ma: 'tieu_thuong' }, dl)
      expect(kqWin.loi).toBeNull()
      expect(kqWin.trang_thai.nhan_vat.ngan_luong).toBeGreaterThanOrEqual(50)
      expect(kqWin.trang_thai.nhan_vat.ngan_luong).toBeLessThanOrEqual(150)
      expect(kqWin.dong_moi[0]?.van_ban).toContain('đắt khách')

      // Test nhánh thua: nhận một nửa (25 - 75 lạng)
      const dFail = taoTrangThaiTest()
      dFail.rng = rngTuSeed(seedThua).layTrangThai()
      dFail.nhan_vat.tuoi = 20
      dFail.nhan_vat.ap_con_lai = 2
      dFail.nhan_vat.ngo_tinh = 50
      const kqFail = apDung(dFail, { loai: 'hanh_dong', ma: 'tieu_thuong' }, dl)
      expect(kqFail.loi).toBeNull()
      expect(kqFail.trang_thai.nhan_vat.ngan_luong).toBeGreaterThanOrEqual(25)
      expect(kqFail.trang_thai.nhan_vat.ngan_luong).toBeLessThanOrEqual(75)
      expect(kqFail.dong_moi[0]?.van_ban).toContain('ế ẩm')
    })

    it('Luyện công qua hành động luyen_cong với tham số vo_hoc', () => {
      const d = taoTrangThaiTest()
      d.nhan_vat.tuoi = 16
      d.nhan_vat.ap_con_lai = 2
      d.nhan_vat.ngo_tinh = 50
      hocVoHoc(d, dl, 'hoa_son_kiem_phap')

      // Luyện công qua hành động AP
      const kq = apDung(d, {
        loai: 'hanh_dong',
        ma: 'luyen_cong',
        tham_so: { vo_hoc: 'hoa_son_kiem_phap' },
      }, dl)

      expect(kq.loi).toBeNull()
      expect(kq.trang_thai.nhan_vat.ap_con_lai).toBe(1) // trừ đúng 1 AP
      expect(kq.trang_thai.nhan_vat.vo_hoc['hoa_son_kiem_phap']?.tien_do).toBeGreaterThan(0)
    })
  })

  describe('xemHanhDong', () => {
    it('Nhóm hành động theo tab, hiển thị trạng thái khóa và độ khó Roll', () => {
      const d = taoTrangThaiTest()
      d.nhan_vat.tuoi = 20
      d.nhan_vat.ap_con_lai = 1
      d.nhan_vat.viec_mien_phi_con_lai = 0
      d.nhan_vat.ngo_tinh = 50

      const danhSach = xemHanhDong(d, dl)

      // Kiểm tra có các tab
      expect(danhSach['sinh_hoat']).toBeDefined()
      expect(danhSach['tu_luyen']).toBeDefined()
      expect(danhSach['giang_ho']).toBeDefined()

      // Hành động tiểu thương có nhãn độ khó
      const tieuThuong = danhSach['giang_ho']?.find((h) => h.ma === 'tieu_thuong')
      expect(tieuThuong).toBeDefined()
      expect(tieuThuong?.do_kho).toBeDefined()

      // Hành động trẻ em bị khóa vì quá tuổi
      const namNoi = danhSach['sinh_hoat']?.find((h) => h.ma === 'nam_noi')
      expect(namNoi?.bi_khoa).toBe(true)
      expect(namNoi?.ly_do).toContain('Đã quá tuổi')

      // Hành động mua_sam bị khóa vì hết lượt miễn phí
      const muaSam = danhSach['giang_ho']?.find((h) => h.ma === 'mua_sam')
      expect(muaSam?.bi_khoa).toBe(true)
      expect(muaSam?.ly_do).toContain('Hết lượt miễn phí')
    })
  })
})
