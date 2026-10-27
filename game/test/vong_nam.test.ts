import { describe, expect, it } from 'vitest'
import { napDuLieu } from '../src/du_lieu/nap'
import { docTepDia } from '../src/du_lieu/nap_node'
import { taoNhanVatRong } from '../src/luat/chi_so'
import { tuoiThoMax } from '../src/luat/cong_thuc'
import type { TrangThaiGame } from '../src/luat/kieu'
import { rngTuSeed, taoRng } from '../src/luat/rng'
import { quaNam, xemAp } from '../src/luat/vong_nam'

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

describe('Vòng năm và AP (M1-07)', () => {
  describe('Điểm hành động (AP) và việc miễn phí theo tuổi (HS01 IV)', () => {
    it('AP đúng ở các mốc tuổi 10, 11, 30, 31, 51 (cảnh giới 7 và 8), 71', () => {
      const rng = rngTuSeed(42)

      // Tuổi 9 -> 10: 2 AP, 0 việc miễn phí (dưới 11 tuổi)
      const d10 = taoTrangThaiTest()
      d10.nhan_vat.tuoi = 9
      quaNam(d10, rng, dl)
      expect(d10.nhan_vat.tuoi).toBe(10)
      expect(d10.nhan_vat.ap_con_lai).toBe(2)
      expect(d10.nhan_vat.viec_mien_phi_con_lai).toBe(0)

      // Tuổi 10 -> 11: 3 AP, 2 việc miễn phí (từ 11 tuổi)
      const d11 = taoTrangThaiTest()
      d11.nhan_vat.tuoi = 10
      quaNam(d11, rng, dl)
      expect(d11.nhan_vat.tuoi).toBe(11)
      expect(d11.nhan_vat.ap_con_lai).toBe(3)
      expect(d11.nhan_vat.viec_mien_phi_con_lai).toBe(2)

      // Tuổi 29 -> 30: 3 AP, 2 việc miễn phí
      const d30 = taoTrangThaiTest()
      d30.nhan_vat.tuoi = 29
      quaNam(d30, rng, dl)
      expect(d30.nhan_vat.tuoi).toBe(30)
      expect(d30.nhan_vat.ap_con_lai).toBe(3)
      expect(d30.nhan_vat.viec_mien_phi_con_lai).toBe(2)

      // Tuổi 30 -> 31: 4 AP, 2 việc miễn phí
      const d31 = taoTrangThaiTest()
      d31.nhan_vat.tuoi = 30
      quaNam(d31, rng, dl)
      expect(d31.nhan_vat.tuoi).toBe(31)
      expect(d31.nhan_vat.ap_con_lai).toBe(4)
      expect(d31.nhan_vat.viec_mien_phi_con_lai).toBe(2)

      // Tuổi 50 -> 51: Cảnh giới < 8 (ví dụ cảnh giới 7) -> 3 AP
      const d51_cg7 = taoTrangThaiTest()
      d51_cg7.nhan_vat.tuoi = 50
      d51_cg7.nhan_vat.trang_bi.noi_cong = 'noi_cong_7'
      d51_cg7.nhan_vat.vo_hoc['noi_cong_7'] = { cap: 7, tien_do: 0, hoan_thien: 100 }
      quaNam(d51_cg7, rng, dl)
      expect(d51_cg7.nhan_vat.tuoi).toBe(51)
      expect(d51_cg7.nhan_vat.ap_con_lai).toBe(3)
      expect(d51_cg7.nhan_vat.viec_mien_phi_con_lai).toBe(2)

      // Tuổi 50 -> 51: Cảnh giới >= 8 (ví dụ cảnh giới 8) -> 4 AP
      const d51_cg8 = taoTrangThaiTest()
      d51_cg8.nhan_vat.tuoi = 50
      d51_cg8.nhan_vat.trang_bi.noi_cong = 'noi_cong_8'
      d51_cg8.nhan_vat.vo_hoc['noi_cong_8'] = { cap: 8, tien_do: 0, hoan_thien: 100 }
      quaNam(d51_cg8, rng, dl)
      expect(d51_cg8.nhan_vat.tuoi).toBe(51)
      expect(d51_cg8.nhan_vat.ap_con_lai).toBe(4)
      expect(d51_cg8.nhan_vat.viec_mien_phi_con_lai).toBe(2)

      // Tuổi 70 -> 71: 2 AP, 2 việc miễn phí (cần căn cốt / tuổi thọ để không chết thọ chung ở 65)
      const d71 = taoTrangThaiTest()
      d71.nhan_vat.tuoi = 70
      d71.nhan_vat.can_cot = 80
      d71.nhan_vat.can_cot_dinh = 80
      d71.nhan_vat.tuoi_tho_cong_them = 10
      quaNam(d71, rng, dl)
      expect(d71.nhan_vat.tuoi).toBe(71)
      expect(d71.nhan_vat.ap_con_lai).toBe(2)
      expect(d71.nhan_vat.viec_mien_phi_con_lai).toBe(2)
    })

    it('Trừ ap_bi_tru_nam_sau và reset về 0 (không âm)', () => {
      const rng = rngTuSeed(1)
      const d = taoTrangThaiTest()
      d.nhan_vat.tuoi = 30 // Lên 31 bình thường là 4 AP
      d.nhan_vat.ap_bi_tru_nam_sau = 1
      quaNam(d, rng, dl)
      expect(d.nhan_vat.ap_con_lai).toBe(3) // 4 - 1 = 3
      expect(d.nhan_vat.ap_bi_tru_nam_sau).toBe(0)

      // Trường hợp bị phạt quá nhiều AP
      const d2 = taoTrangThaiTest()
      d2.nhan_vat.tuoi = 30
      d2.nhan_vat.ap_bi_tru_nam_sau = 10
      quaNam(d2, rng, dl)
      expect(d2.nhan_vat.ap_con_lai).toBe(0)
      expect(d2.nhan_vat.ap_bi_tru_nam_sau).toBe(0)
    })

    it('xemAp trả thông tin cho Dock và cờ nen_qua_nam', () => {
      const d = taoTrangThaiTest()
      d.nhan_vat.tuoi = 20
      d.nhan_vat.ap_con_lai = 3
      d.nhan_vat.viec_mien_phi_con_lai = 2

      let thongTin = xemAp(d)
      expect(thongTin.ap_con_lai).toBe(3)
      expect(thongTin.tong_ap_nam).toBe(3)
      expect(thongTin.viec_mien_phi_con_lai).toBe(2)
      expect(thongTin.nen_qua_nam).toBe(false)

      // Dùng hết AP nhưng còn việc miễn phí
      d.nhan_vat.ap_con_lai = 0
      thongTin = xemAp(d)
      expect(thongTin.nen_qua_nam).toBe(false)

      // Dùng hết cả 2
      d.nhan_vat.viec_mien_phi_con_lai = 0
      thongTin = xemAp(d)
      expect(thongTin.nen_qua_nam).toBe(true)

      // Nếu đang có việc chờ quyết định (d.cho !== null) thì không nên qua năm
      d.cho = { loai: 'su_kien', ma: 'sk_test', bien: {} }
      thongTin = xemAp(d)
      expect(thongTin.nen_qua_nam).toBe(false)
    })
  })

  describe('Lão hóa Căn cốt (HS01 II.8, HS04 III)', () => {
    it('Cảnh giới < 8: giảm Căn cốt từ tuổi 51, không giảm can_cot_dinh, không giảm dưới 0', () => {
      const rng = rngTuSeed(1)
      const d = taoTrangThaiTest()
      d.nhan_vat.tuoi = 49
      d.nhan_vat.can_cot = 50
      d.nhan_vat.can_cot_dinh = 50
      d.nhan_vat.trang_bi.noi_cong = 'noi_cong_5'
      d.nhan_vat.vo_hoc['noi_cong_5'] = { cap: 5, tien_do: 0, hoan_thien: 100 }

      // 49 -> 50: Chưa lão hóa
      quaNam(d, rng, dl)
      expect(d.nhan_vat.tuoi).toBe(50)
      expect(d.nhan_vat.can_cot).toBe(50)
      expect(d.nhan_vat.can_cot_dinh).toBe(50)

      // 50 -> 51: Bắt đầu lão hóa (-2)
      quaNam(d, rng, dl)
      expect(d.nhan_vat.tuoi).toBe(51)
      expect(d.nhan_vat.can_cot).toBe(48)
      expect(d.nhan_vat.can_cot_dinh).toBe(50)

      // 51 -> 52: Giảm tiếp (-2)
      quaNam(d, rng, dl)
      expect(d.nhan_vat.tuoi).toBe(52)
      expect(d.nhan_vat.can_cot).toBe(46)
      expect(d.nhan_vat.can_cot_dinh).toBe(50)

      // Chặn dưới 0
      d.nhan_vat.can_cot = 1
      quaNam(d, rng, dl)
      expect(d.nhan_vat.can_cot).toBe(0)
      expect(d.nhan_vat.can_cot_dinh).toBe(50)
    })

    it('Cảnh giới >= 8: giảm Căn cốt từ tuổi 61', () => {
      const rng = rngTuSeed(1)
      const d = taoTrangThaiTest()
      d.nhan_vat.tuoi = 59
      d.nhan_vat.can_cot = 60
      d.nhan_vat.can_cot_dinh = 60
      d.nhan_vat.trang_bi.noi_cong = 'noi_cong_8'
      d.nhan_vat.vo_hoc['noi_cong_8'] = { cap: 8, tien_do: 0, hoan_thien: 100 }

      // 59 -> 60: Chưa lão hóa
      quaNam(d, rng, dl)
      expect(d.nhan_vat.tuoi).toBe(60)
      expect(d.nhan_vat.can_cot).toBe(60)

      // 60 -> 61: Bắt đầu lão hóa (-2)
      quaNam(d, rng, dl)
      expect(d.nhan_vat.tuoi).toBe(61)
      expect(d.nhan_vat.can_cot).toBe(58)
    })

    it('Nội công Bất lão (Dịch Cân Kinh): không bao giờ bị giảm Căn cốt do lão hóa', () => {
      const rng = rngTuSeed(1)
      const d = taoTrangThaiTest()
      d.nhan_vat.tuoi = 50
      d.nhan_vat.can_cot = 80
      d.nhan_vat.can_cot_dinh = 80
      d.nhan_vat.trang_bi.noi_cong = 'dich_can_kinh'
      d.nhan_vat.vo_hoc['dich_can_kinh'] = { cap: 5, tien_do: 0, hoan_thien: 100 }

      // 50 -> 51
      quaNam(d, rng, dl)
      expect(d.nhan_vat.tuoi).toBe(51)
      expect(d.nhan_vat.can_cot).toBe(80)

      // Đến tuổi 75 vẫn không giảm
      d.nhan_vat.tuoi = 74
      quaNam(d, rng, dl)
      expect(d.nhan_vat.tuoi).toBe(75)
      expect(d.nhan_vat.can_cot).toBe(80)
    })
  })

  describe('Tư Chất Ngu Độn (HS01 III.2)', () => {
    it('Cộng Căn cốt +2, Phúc duyên +3 mỗi năm đến 15 tuổi rồi dừng (tổng +32 / +48)', () => {
      const rng = rngTuSeed(1)
      const d = taoTrangThaiTest()
      d.nhan_vat.tuoi = 0
      d.nhan_vat.can_cot = 10
      d.nhan_vat.can_cot_dinh = 10
      d.nhan_vat.phuc_duyen = 20
      d.nhan_vat.ngo_tinh = 10
      d.nhan_vat.thien_phu.push('tu_chat_ngu_don')

      // Chạy 16 năm từ tuổi 0 đến tuổi 16
      for (let i = 0; i < 16; i++) {
        quaNam(d, rng, dl)
      }
      expect(d.nhan_vat.tuoi).toBe(16)
      // Tổng tăng đúng +32 Căn cốt, +48 Phúc duyên
      expect(d.nhan_vat.can_cot).toBe(10 + 32)
      expect(d.nhan_vat.can_cot_dinh).toBe(10 + 32)
      expect(d.nhan_vat.phuc_duyen).toBe(20 + 48)

      // Sang tuổi 17: dừng lại không cộng nữa
      quaNam(d, rng, dl)
      expect(d.nhan_vat.tuoi).toBe(17)
      expect(d.nhan_vat.can_cot).toBe(10 + 32)
      expect(d.nhan_vat.phuc_duyen).toBe(20 + 48)

      // Sang tuổi 18: tiếp tục không đổi
      quaNam(d, rng, dl)
      expect(d.nhan_vat.tuoi).toBe(18)
      expect(d.nhan_vat.can_cot).toBe(10 + 32)
      expect(d.nhan_vat.phuc_duyen).toBe(20 + 48)
    })
  })

  describe('Dưỡng thương ở Bước 2 (HS06 I.1)', () => {
    it('Trọng thương chưa chữa: xóa cờ trọng thương; thất bại tăng Ám thương +5', () => {
      // Tìm hạt giống thất bại và thành công với can_cot = 10 (Roll vs 50)
      let seedThatBai = -1
      let seedThanhCong = -1

      for (let s = 1; s <= 200; s++) {
        const testRng = rngTuSeed(s)
        const d = taoTrangThaiTest()
        d.nhan_vat.trong_thuong = true
        d.nhan_vat.can_cot = 10
        d.nhan_vat.phuc_duyen = 0
        d.nhan_vat.am_thuong = 0
        quaNam(d, testRng, dl)
        if (d.nhan_vat.am_thuong === 5 && seedThatBai === -1) {
          seedThatBai = s
        }
        if (d.nhan_vat.am_thuong === 0 && seedThanhCong === -1) {
          seedThanhCong = s
        }
        if (seedThatBai !== -1 && seedThanhCong !== -1) break
      }

      expect(seedThatBai).toBeGreaterThan(0)
      expect(seedThanhCong).toBeGreaterThan(0)

      // Kiểm tra trường hợp thất bại
      const dFail = taoTrangThaiTest()
      dFail.nhan_vat.trong_thuong = true
      dFail.nhan_vat.can_cot = 10
      dFail.nhan_vat.phuc_duyen = 0
      dFail.nhan_vat.am_thuong = 2
      const sinhFail = quaNam(dFail, rngTuSeed(seedThatBai), dl)
      expect(dFail.nhan_vat.trong_thuong).toBe(false)
      expect(dFail.nhan_vat.am_thuong).toBe(7) // 2 + 5
      expect(sinhFail.some((b) => b.van_ban.includes('Ám thương +5'))).toBe(true)

      // Kiểm tra trường hợp thành công
      const dWin = taoTrangThaiTest()
      dWin.nhan_vat.trong_thuong = true
      dWin.nhan_vat.can_cot = 10
      dWin.nhan_vat.phuc_duyen = 0
      dWin.nhan_vat.am_thuong = 2
      const sinhWin = quaNam(dWin, rngTuSeed(seedThanhCong), dl)
      expect(dWin.nhan_vat.trong_thuong).toBe(false)
      expect(dWin.nhan_vat.am_thuong).toBe(2) // Giữ nguyên
      expect(sinhWin.some((b) => b.van_ban.includes('chữa lành trọng thương'))).toBe(true)
    })
  })

  describe('Hồi phục đầu năm (Bước 12 / G03)', () => {
    it('Hồi đầy HP và Nội tức đầu năm', () => {
      const rng = rngTuSeed(1)
      const d = taoTrangThaiTest()
      d.nhan_vat.tuoi = 20
      d.nhan_vat.hp = 10
      d.nhan_vat.noi_tuc = 5

      quaNam(d, rng, dl)
      expect(d.nhan_vat.hp).toBeGreaterThan(10)
      expect(d.nhan_vat.noi_tuc).toBeGreaterThan(5)
    })
  })

  describe('Chết vì tuổi thọ (Bước 11 / HS06 I.1)', () => {
    it('Chết đúng năm tuoi >= tuoiThoMax, dừng pipeline', () => {
      const rng = rngTuSeed(1)
      const d = taoTrangThaiTest()
      const maxTuoi = tuoiThoMax(d.nhan_vat, dl)

      // Đặt tuổi ngay sát tuổi thọ tối đa
      d.nhan_vat.tuoi = maxTuoi - 1
      quaNam(d, rng, dl)

      expect(d.nhan_vat.tuoi).toBe(maxTuoi)
      expect(d.ket_thuc).not.toBeNull()
      expect(d.ket_thuc?.nguyen_nhan).toBe('tho_chung')
      expect(d.ket_thuc?.tuoi).toBe(maxTuoi)
      expect(d.cho).toEqual({ loai: 'chuyen_giai_doan', ma: 'van_bia' })

      // Pipeline dừng: bước 14 (đặt AP) không được chạy nữa
      // Nếu không dừng, d.nhan_vat.ap_con_lai sẽ được cập nhật
      expect(d.bien_nien.some((b) => b.van_ban.includes('Tuổi thọ đã tận'))).toBe(false) // dòng biên niên trả về qua return
    })
  })

  describe('Hết hạn Trạng thái theo tuổi (Bước 9)', () => {
    it('Trạng thái có den_tuoi bị xóa khi nhân vật đạt den_tuoi', () => {
      const rng = rngTuSeed(1)
      const d = taoTrangThaiTest()
      d.nhan_vat.tuoi = 18
      d.nhan_vat.trang_thai['tam_ma'] = { tu_tuoi: 18, den_tuoi: 20 }

      // 18 -> 19: chưa hết hạn
      quaNam(d, rng, dl)
      expect(d.nhan_vat.tuoi).toBe(19)
      expect(d.nhan_vat.trang_thai['tam_ma']).toBeDefined()

      // 19 -> 20: hết hạn -> xóa
      quaNam(d, rng, dl)
      expect(d.nhan_vat.tuoi).toBe(20)
      expect(d.nhan_vat.trang_thai['tam_ma']).toBeUndefined()
    })
  })
})
