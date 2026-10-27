import { describe, expect, it } from 'vitest'
import type { DuLieu, SuKien } from '../src/du_lieu/luoc_do'
import { napDuLieu } from '../src/du_lieu/nap'
import { docTepDia } from '../src/du_lieu/nap_node'
import { taoNhanVatRong } from '../src/luat/chi_so'
import type { TrangThaiGame } from '../src/luat/kieu'
import { rngTuSeed, taoRng } from '../src/luat/rng'
import { chonSuKienNam, duDieuKien } from '../src/luat/su_kien'
import { quaNam } from '../src/luat/vong_nam'

const dlGoc = napDuLieu(docTepDia())

function taoTrangThaiTest(seed = 1): TrangThaiGame {
  const rng = taoRng([seed, 0, 0, 0])
  return {
    phien_ban: 1,
    seed,
    rng: rng.layTrangThai(),
    nam_the_gioi: 0,
    nhan_vat: {
      ...taoNhanVatRong(),
      tuoi: 15,
      vung: 'trung_nguyen',
      phuc_duyen: 50,
      ap_con_lai: 3,
    },
    the_gioi: { npc: {} },
    cho: null,
    hang_doi_su_kien: [],
    lich_hen: [],
    bien_nien: [],
    ket_thuc: null,
    dong_toc: { doi_truoc: [] },
  }
}

function taoSuKienMau(
  ma: string,
  loai: 'co_dinh' | 'thuong' | 'ky_ngo' | 'noi_tiep',
  tuoi: [number, number] = [1, 100],
  lapLai: 'mot_lan' | 'moi_nam' = 'moi_nam',
  vung: string[] | null = null,
): SuKien {
  return {
    ma,
    nguon: 'Test',
    ten: `Sự kiện ${ma}`,
    loai,
    tuoi,
    vung,
    dieu_kien: null,
    trong_so: 10,
    lap_lai: lapLai,
    mo_ta: `Mô tả sự kiện ${ma}`,
    lua_chon: [
      {
        ma: 'a',
        nhan: 'Đồng ý',
        ket_qua: {
          van_ban: 'Kết quả lựa chọn A.',
          hieu_ung: [],
        },
      },
    ],
  }
}

describe('Chọn sự kiện năm mới và kỳ ngộ (M1-10)', () => {
  describe('duDieuKien', () => {
    it('Sự kiện nối tiếp (noi_tiep) không bao giờ đủ điều kiện bốc ngẫu nhiên', () => {
      const d = taoTrangThaiTest()
      const sk = taoSuKienMau('sk_noi_tiep', 'noi_tiep')
      expect(duDieuKien(sk, d, dlGoc)).toBe(false)
    })

    it('Kiểm tra đúng khoảng tuổi', () => {
      const d = taoTrangThaiTest()
      d.nhan_vat.tuoi = 15

      const skTuoi10_20 = taoSuKienMau('sk_10_20', 'thuong', [10, 20])
      const skTuoi20_30 = taoSuKienMau('sk_20_30', 'thuong', [20, 30])

      expect(duDieuKien(skTuoi10_20, d, dlGoc)).toBe(true)
      expect(duDieuKien(skTuoi20_30, d, dlGoc)).toBe(false)
    })

    it('Kiểm tra vùng đất', () => {
      const d = taoTrangThaiTest()
      d.nhan_vat.vung = 'trung_nguyen'

      const skTrungNguyen = taoSuKienMau('sk_tn', 'thuong', [1, 100], 'moi_nam', ['trung_nguyen'])
      const skTayVuc = taoSuKienMau('sk_tv', 'thuong', [1, 100], 'moi_nam', ['tay_vuc'])

      expect(duDieuKien(skTrungNguyen, d, dlGoc)).toBe(true)
      expect(duDieuKien(skTayVuc, d, dlGoc)).toBe(false)
    })

    it('Sự kiện mot_lan không bao giờ lặp lại sau khi đã gặp', () => {
      const d = taoTrangThaiTest()
      const skMotLan = taoSuKienMau('sk_mot_lan', 'thuong', [1, 100], 'mot_lan')

      // Chưa gặp
      expect(duDieuKien(skMotLan, d, dlGoc)).toBe(true)

      // Đã gặp 1 lần
      d.nhan_vat.su_kien_da_gap['sk_mot_lan'] = 1
      expect(duDieuKien(skMotLan, d, dlGoc)).toBe(false)
    })
  })

  describe('chonSuKienNam', () => {
    it('Sự kiện cố định luôn xuất hiện đúng tuổi', () => {
      const dlTest: DuLieu = {
        ...dlGoc,
        su_kien: {
          thoi_noi: taoSuKienMau('thoi_noi', 'co_dinh', [1, 1], 'mot_lan'),
        },
      }

      const rng = rngTuSeed(42)

      // Tuổi 1: sự kiện cố định xuất hiện
      const d1 = taoTrangThaiTest()
      d1.nhan_vat.tuoi = 1
      chonSuKienNam(d1, rng, dlTest)
      expect(d1.cho?.loai).toBe('su_kien')
      if (d1.cho?.loai === 'su_kien') {
        expect(d1.cho.ma).toBe('thoi_noi')
      }

      // Tuổi 2: không xuất hiện
      const d2 = taoTrangThaiTest()
      d2.nhan_vat.tuoi = 2
      const sinh = chonSuKienNam(d2, rng, dlTest)
      expect(d2.cho).toBeNull()
      expect(sinh.some((b) => b.van_ban.includes('sóng yên biển lặng'))).toBe(true)
    })

    it('Sự kiện trong lich_hen đến hạn được đưa vào hàng đợi', () => {
      const dlTest: DuLieu = {
        ...dlGoc,
        su_kien: {
          sk_hen: taoSuKienMau('sk_hen', 'noi_tiep', [10, 30]),
        },
      }

      const rng = rngTuSeed(1)
      const d = taoTrangThaiTest()
      d.nhan_vat.tuoi = 14
      d.lich_hen = [{ su_kien: 'sk_hen', nam_mo: 15, han_nam: 18 }]

      // Tuổi 14: chưa đến hạn
      chonSuKienNam(d, rng, dlTest)
      expect(d.lich_hen.length).toBe(1)
      expect(d.cho).toBeNull()

      // Tuổi 15: đến hạn -> mở sự kiện
      d.nhan_vat.tuoi = 15
      chonSuKienNam(d, rng, dlTest)
      expect(d.lich_hen.length).toBe(0)
      expect(d.cho?.loai === 'su_kien' && d.cho.ma === 'sk_hen').toBe(true)
    })

    it('Tối đa 2 sự kiện cá nhân mỗi năm', () => {
      const dlTest: DuLieu = {
        ...dlGoc,
        su_kien: {
          cd_1: taoSuKienMau('cd_1', 'co_dinh', [15, 15]),
          cd_2: taoSuKienMau('cd_2', 'co_dinh', [15, 15]),
          cd_3: taoSuKienMau('cd_3', 'co_dinh', [15, 15]),
        },
      }

      const rng = rngTuSeed(1)
      const d = taoTrangThaiTest()
      d.nhan_vat.tuoi = 15

      chonSuKienNam(d, rng, dlTest)

      // Tổng số sự kiện được mở hoặc xếp hàng đợi không quá 2
      const tongSo = (d.cho ? 1 : 0) + d.hang_doi_su_kien.length
      expect(tongSo).toBeLessThanOrEqual(2)
    })

    it('Tỷ lệ kỳ ngộ với Phúc duyên 50 ở Trung Nguyên ≈ 8% (±0.5% trên 100.000 năm giả lập)', () => {
      // P_KyNgo = 2% + 50 * 0.12% + 0% (Trung Nguyên) = 8.0%
      const dlTest: DuLieu = {
        ...dlGoc,
        su_kien: {
          ky_ngo_mau: taoSuKienMau('ky_ngo_mau', 'ky_ngo', [1, 100]),
          thuong_mau: taoSuKienMau('thuong_mau', 'thuong', [1, 100]),
        },
      }

      const tongSoNam = 100000
      let soLanKyNgo = 0
      const rng = rngTuSeed(123456)

      const d = taoTrangThaiTest()
      d.nhan_vat.vung = 'trung_nguyen'
      d.nhan_vat.phuc_duyen = 50
      d.nhan_vat.tuoi = 20

      for (let i = 0; i < tongSoNam; i++) {
        // Reset trạng thái chờ và hàng đợi trước mỗi năm
        d.cho = null
        d.hang_doi_su_kien = []
        d.nhan_vat.su_kien_da_gap = {} // để không bị chặn bởi lap_lai

        chonSuKienNam(d, rng, dlTest)

        const choHienTai = d.cho as { loai: string; ma: string } | null
        if (
          (choHienTai?.loai === 'su_kien' && choHienTai.ma === 'ky_ngo_mau') ||
          d.hang_doi_su_kien.includes('ky_ngo_mau')
        ) {
          soLanKyNgo += 1
        }
      }

      const tyLe = soLanKyNgo / tongSoNam
      // Kỳ vọng 8.0% ± 0.5% ([0.075, 0.085])
      expect(tyLe).toBeGreaterThanOrEqual(0.075)
      expect(tyLe).toBeLessThanOrEqual(0.085)
    })

    it('Tích hợp trong vòng năm quaNam (Bước 15)', () => {
      const dlTest: DuLieu = {
        ...dlGoc,
        su_kien: {
          sk_tuoi_1: taoSuKienMau('sk_tuoi_1', 'co_dinh', [1, 1], 'mot_lan'),
        },
      }

      const rng = rngTuSeed(1)
      const d = taoTrangThaiTest()
      d.nhan_vat.tuoi = 0

      // Qua năm từ 0 lên 1 tuổi
      quaNam(d, rng, dlTest)
      expect(d.nhan_vat.tuoi).toBe(1)
      expect(d.cho?.loai === 'su_kien' && d.cho.ma === 'sk_tuoi_1').toBe(true)
    })
  })
})
