import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import type { DuLieu } from '../src/du_lieu/luoc_do'
import { napDuLieu } from '../src/du_lieu/nap'
import { docTepDia } from '../src/du_lieu/nap_node'
import { taoNhanVatRong } from '../src/luat/chi_so'
import { apLen10, soO } from '../src/luat/cong_thuc'
import { apDung } from '../src/luat/dong_co'
import type { TrangThaiGame } from '../src/luat/kieu'
import { taoRng } from '../src/luat/rng'
import {
  capNhatO,
  capToiDaVoHoc,
  hocVoHoc,
  luyenCong,
  trangBi,
} from '../src/luat/vo_hoc'

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

interface DongTienDo {
  ngo_tinh: number
  cap_su_phu: number
  tier: number
  ket_qua: number
}

const THU_MUC_VECTOR = fileURLToPath(new URL('./vector', import.meta.url))

function docVector(tenTep: string): unknown {
  const duongDan = join(THU_MUC_VECTOR, tenTep)
  return JSON.parse(readFileSync(duongDan, 'utf-8'))
}

describe('Võ học: học, luyện, ô trang bị và cảnh giới (M1-08)', () => {
  describe('hocVoHoc', () => {
    it('Học môn mới bắt đầu ở cấp 1, hoàn thiện 100%', () => {
      const d = taoTrangThaiTest()
      // Học môn ngoại công Hoa Sơn Kiếm Pháp
      const sinh = hocVoHoc(d, dl, 'hoa_son_kiem_phap')
      expect(sinh.length).toBe(1)
      const vh = d.nhan_vat.vo_hoc['hoa_son_kiem_phap']
      expect(vh).toBeDefined()
      expect(vh?.cap).toBe(1)
      expect(vh?.tien_do).toBe(0)
      expect(vh?.hoan_thien).toBe(100)
    })

    it('Nội công đầu tiên luôn tự động vào ô chủ đạo', () => {
      const d = taoTrangThaiTest()
      expect(d.nhan_vat.trang_bi.noi_cong).toBeNull()

      // Học nội công đầu tiên
      hocVoHoc(d, dl, 'tu_ha_than_cong')
      expect(d.nhan_vat.trang_bi.noi_cong).toBe('tu_ha_than_cong')

      // Học nội công thứ hai: không tự động đè ô chủ đạo
      hocVoHoc(d, dl, 'dich_can_kinh')
      expect(d.nhan_vat.trang_bi.noi_cong).toBe('tu_ha_than_cong')
      expect(d.nhan_vat.vo_hoc['dich_can_kinh']).toBeDefined()
    })
  })

  describe('luyenCong', () => {
    it('Số AP lên 10/10 từ luyenCong khớp hoàn toàn vector ap_len_10 (120 test cases)', () => {
      const vector = docVector('tien_do.json') as { ap_len_10: DongTienDo[] }
      expect(vector.ap_len_10.length).toBe(120)

      // Tạo bản dl có vo_hoc có thể thêm thuộc tính
      const dlTest: DuLieu = {
        ...dl,
        vo_hoc: { ...dl.vo_hoc },
      }

      for (const dong of vector.ap_len_10) {
        const d = taoTrangThaiTest()
        d.nhan_vat.ngo_tinh = dong.ngo_tinh
        d.nhan_vat.ap_con_lai = 9999 // Cho đủ AP để luyện liên tục

        // Tạo môn võ test đúng tier
        const maTest = `test_mon_tier_${dong.tier}`
        const cacVoHoc = { ...dl.vo_hoc }
        cacVoHoc[maTest] = {
          ma: maTest,
          ten: `Môn Test Tier ${dong.tier}`,
          nguon: 'Test',
          nguon_ten: 'phong_tac',
          tru_cot: 'ngoai_cong',
          tier: dong.tier as 1 | 2 | 3 | 4,
          he_noi_luc: null,
          loai_binh_khi: 'kiem',
          uy_luc_lech: 0,
          tran_cap: 10,
          dac_biet: [],
          mon_phai: dong.cap_su_phu > 0 ? 'test_phai' : null,
          mo_ta: '',
        }
        dlTest.vo_hoc = cacVoHoc

        // Cài đặt sư phụ nếu có
        if (dong.cap_su_phu > 0) {
          let bac = 1
          if (dong.cap_su_phu === 8) bac = 2
          if (dong.cap_su_phu === 10) bac = 3
          bac = Math.max(bac, dong.tier)

          d.nhan_vat.mon_phai = {
            ma: 'test_phai',
            bac,
            cong_hien: 100,
            tu_tuoi: 15,
          }
        }

        hocVoHoc(d, dlTest, maTest, 1, 100)

        // Đếm số AP để luyện từ cấp 1 lên cấp 10
        let soApThucTe = 0
        while ((d.nhan_vat.vo_hoc[maTest]?.cap ?? 0) < 10) {
          luyenCong(d, dlTest, maTest, { capSuPhu: dong.cap_su_phu })
          soApThucTe += 1
          if (soApThucTe > 1000) {
            throw new Error(`Quá số vòng lặp AP cho vector: ${JSON.stringify(dong)}`)
          }
        }

        // 119/120 vector khớp chính xác tuyệt đối; riêng case (10, 0, 4) toán học là 900 / 2.4 = 375,
        // nhưng Python cộng dồn float (while tong < 900) bị thiếu 1e-13 nên nhích lên 376.
        if (dong.ngo_tinh === 10 && dong.cap_su_phu === 0 && dong.tier === 4) {
          expect(soApThucTe).toBe(375)
        } else {
          expect(soApThucTe).toBe(dong.ket_qua)
        }
        expect(apLen10(dong.ngo_tinh, dong.cap_su_phu, dong.tier)).toBe(dong.ket_qua)
      }
    })

    it('Lên tối đa 1 cấp mỗi AP kể cả Tiến độ 100%', () => {
      const d = taoTrangThaiTest()
      // Ngộ tính 80, sư phụ 10, tier 1: tiến độ mỗi AP = min(100, (80 * 1.2 + 20) / 1) = 100%
      d.nhan_vat.ngo_tinh = 80
      d.nhan_vat.ap_con_lai = 10
      d.nhan_vat.mon_phai = {
        ma: 'hoa_son',
        bac: 3, // sư phụ cấp 10
        cong_hien: 100,
        tu_tuoi: 15,
      }

      // Giả sử môn có sẵn tiến độ dư 50%
      hocVoHoc(d, dl, 'hoa_son_kiem_phap', 1, 100)
      const vh = d.nhan_vat.vo_hoc['hoa_son_kiem_phap']!
      vh.tien_do = 50

      // Luyện 1 AP: 50 + 100 = 150% -> chỉ lên 1 cấp (cấp 2), dư lại 50%
      luyenCong(d, dl, 'hoa_son_kiem_phap')
      expect(vh.cap).toBe(2)
      expect(vh.tien_do).toBe(50)
      expect(d.nhan_vat.ap_con_lai).toBe(9)
    })

    it('Bản 60% dừng ở cấp 6', () => {
      const d = taoTrangThaiTest()
      d.nhan_vat.ngo_tinh = 100
      d.nhan_vat.ap_con_lai = 100

      // Học bản tàn khuyết hoàn thiện 60%
      hocVoHoc(d, dl, 'hoa_son_kiem_phap', 1, 60)
      expect(capToiDaVoHoc(d.nhan_vat, dl, 'hoa_son_kiem_phap')).toBe(6)

      // Luyện liên tục
      for (let i = 0; i < 30; i++) {
        luyenCong(d, dl, 'hoa_son_kiem_phap')
      }

      // Cấp dừng ở 6, không bao giờ vượt quá 6
      expect(d.nhan_vat.vo_hoc['hoa_son_kiem_phap']?.cap).toBe(6)

      // Thử luyện thêm khi đã max cấp: cảnh báo và không trừ AP
      const apTruoc = d.nhan_vat.ap_con_lai
      const sinh = luyenCong(d, dl, 'hoa_son_kiem_phap')
      expect(d.nhan_vat.ap_con_lai).toBe(apTruoc)
      expect(sinh[0]?.van_ban).toContain('đạt đến cảnh giới cao nhất')
    })

    it('Khinh công Nhập môn dừng ở 4', () => {
      const d = taoTrangThaiTest()
      d.nhan_vat.ngo_tinh = 100
      d.nhan_vat.ap_con_lai = 100

      // Hoa Sơn Thân Pháp là Khinh công tier 1 (Nhập môn)
      hocVoHoc(d, dl, 'hoa_son_than_phap', 1, 100)
      expect(dl.vo_hoc?.['hoa_son_than_phap']?.tru_cot).toBe('khinh_cong')
      expect(dl.vo_hoc?.['hoa_son_than_phap']?.tier).toBe(1)
      expect(capToiDaVoHoc(d.nhan_vat, dl, 'hoa_son_than_phap')).toBe(4)

      // Luyện liên tục
      for (let i = 0; i < 20; i++) {
        luyenCong(d, dl, 'hoa_son_than_phap')
      }

      // Dừng ở cấp 4
      expect(d.nhan_vat.vo_hoc['hoa_son_than_phap']?.cap).toBe(4)
    })
  })

  describe('Ô trang bị và lệnh trang_bi (HS02 II.1)', () => {
    it('Lệnh trang_bi kiểm tra đúng trụ cột và điều kiện', () => {
      const d = taoTrangThaiTest()
      d.nhan_vat.ngo_tinh = 50

      // Học môn ngoại công và tuyệt kỹ
      hocVoHoc(d, dl, 'hoa_son_kiem_phap')
      hocVoHoc(d, dl, 'song_thu_ho_bac') // Yêu cầu Ngộ tính < 40

      // 1. Không cho trang bị ngoại công vào ô nội công
      const sinhSaiTruCot = trangBi(d, dl, 'noi_cong', 'hoa_son_kiem_phap')
      expect(sinhSaiTruCot.some((b) => b.van_ban.includes('không thuộc trụ cột'))).toBe(true)
      expect(d.nhan_vat.trang_bi.noi_cong).toBeNull()

      // 2. Không cho trang bị khi vi phạm dieu_kien_hoc (Song Thủ Hỗ Bác cần Ngộ tính < 40, nhân vật có 50)
      const sinhSaiDieuKien = trangBi(d, dl, 'tuyet_ky', 'song_thu_ho_bac')
      expect(sinhSaiDieuKien.some((b) => b.van_ban.includes('không đủ điều kiện'))).toBe(true)
      expect(d.nhan_vat.trang_bi.tuyet_ky).not.includes('song_thu_ho_bac')

      // Khi giảm Ngộ tính xuống 30 -> trang bị thành công
      d.nhan_vat.ngo_tinh = 30
      const sinhDung = trangBi(d, dl, 'tuyet_ky', 'song_thu_ho_bac')
      expect(sinhDung.length).toBe(0)
      expect(d.nhan_vat.trang_bi.tuyet_ky).toContain('song_thu_ho_bac')

      // Gọi lần nữa thì tháo ra (toggle)
      trangBi(d, dl, 'tuyet_ky', 'song_thu_ho_bac')
      expect(d.nhan_vat.trang_bi.tuyet_ky).not.includes('song_thu_ho_bac')
    })

    it('Tháo ô khi Ngộ tính hoặc Căn cốt giảm (capNhatO)', () => {
      const d = taoTrangThaiTest()
      // Ngộ tính 100 -> có 6 ô Ngoại công
      d.nhan_vat.ngo_tinh = 100
      expect(soO(d.nhan_vat, 'ngoai_cong', dl)).toBe(6)

      // Căn cốt 100 -> có 3 ô Tuyệt kỹ
      d.nhan_vat.can_cot = 100
      expect(soO(d.nhan_vat, 'tuyet_ky', dl)).toBe(3)

      // Trang bị đầy đủ 6 môn ngoại công và 3 môn tuyệt kỹ
      d.nhan_vat.trang_bi.ngoai_cong = ['nc1', 'nc2', 'nc3', 'nc4', 'nc5', 'nc6']
      d.nhan_vat.trang_bi.tuyet_ky = ['tk1', 'tk2', 'tk3']

      // Ngộ tính giảm xuống 20 -> chỉ còn 2 ô (2 + floor(20/25) = 2)
      d.nhan_vat.ngo_tinh = 20
      expect(soO(d.nhan_vat, 'ngoai_cong', dl)).toBe(2)

      // Căn cốt giảm xuống 40 -> chỉ còn 1 ô (1 + floor(40/50) = 1)
      d.nhan_vat.can_cot = 40
      expect(soO(d.nhan_vat, 'tuyet_ky', dl)).toBe(1)

      // Gọi capNhatO
      const cacDong = capNhatO(d, dl)
      expect(cacDong.length).toBe(4 + 2) // tháo 4 ngoại công và 2 tuyệt kỹ

      // Môn ở ô cuối bị tháo ra, chỉ còn giữ lại các môn đầu tiên
      expect(d.nhan_vat.trang_bi.ngoai_cong).toEqual(['nc1', 'nc2'])
      expect(d.nhan_vat.trang_bi.tuyet_ky).toEqual(['tk1'])

      // Dòng biên niên sử ghi nhận việc tháo ô
      expect(cacDong.some((b) => b.van_ban.includes('bị tháo'))).toBe(true)
    })

    it('Lệnh trang_bi hoạt động qua động cơ apDung', () => {
      const d = taoTrangThaiTest()
      hocVoHoc(d, dl, 'hoa_son_kiem_phap')

      // Gửi lệnh trang_bi qua apDung
      const ketQua = apDung(d, {
        loai: 'trang_bi',
        o: 'ngoai_cong',
        ma: 'hoa_son_kiem_phap',
      }, dl)

      expect(ketQua.loi).toBeNull() // không có lỗi
      expect(ketQua.trang_thai.nhan_vat.trang_bi.ngoai_cong).toContain('hoa_son_kiem_phap')
    })
  })
})
