import { describe, expect, it } from 'vitest'
import { napDuLieu } from '../src/du_lieu/nap'
import { docTepDia } from '../src/du_lieu/nap_node'
import {
  canhGioiNoiCong,
  capKhinhCong,
  chienLuc,
  danhVongHienThi,
  heNoiLuc,
  hpMax,
  noiTucMax,
  pKyNgo,
  soO,
  tienDoMoiAp,
  tinhChienLuc,
  tinhTuoiBatDauLaoHoa,
  tinhTuoiThoMax,
  tinhVoLuc,
  tuoiBatDauLaoHoa,
  tuoiThoMax,
  voLuc,
} from '../src/luat/cong_thuc'
import { docChiSo, taoNhanVatRong } from '../src/luat/chi_so'

describe('Công thức phái sinh (M1-04)', () => {
  const dl = napDuLieu(docTepDia())

  describe('HS06 I.1: Tuổi thọ tối đa (Age_max)', () => {
    it('ví dụ số trong GDD: Căn cốt 55, Cảnh giới 10 -> 83 tuổi', () => {
      // 65 + floor(min(55, 100) * 0.15) + 10 - 0 = 65 + 8 + 10 = 83
      expect(tinhTuoiThoMax(55, 10, 0)).toBe(83)
    })

    it('ví dụ số trong GDD: Căn cốt 45, Cảnh giới 7 -> 78 tuổi', () => {
      // 65 + floor(min(45, 100) * 0.15) + 7 - 0 = 65 + 6 + 7 = 78
      expect(tinhTuoiThoMax(45, 7, 0)).toBe(78)
    })

    it('tính đúng cho NhanVat và có cộng thêm tuổi thọ từ đan dược (Tục Mệnh Bát Hoàn +10)', () => {
      const nv = taoNhanVatRong()
      nv.can_cot_dinh = 55
      nv.am_thuong = 2
      nv.tuoi_tho_cong_them = 10
      nv.trang_bi.noi_cong = 'dich_can_kinh'
      nv.vo_hoc['dich_can_kinh'] = { cap: 10, tien_do: 0, hoan_thien: 100 }

      // 65 + 8 + 10 - 2 + 10 = 91
      expect(tuoiThoMax(nv, dl)).toBe(91)
      expect(docChiSo(dl, nv, 'tuoi_tho_max')).toBe(91)
    })
  })

  describe('HS06 I.5: Điểm Chiến Lực (Thiên Hạ Phong Vân Bảng)', () => {
    it('ví dụ số trong GDD: Trấn phái cấp 10, Cảnh giới 10, Căn cốt 60, 40 tuổi -> 365', () => {
      // Điểm Tier (Trấn phái = 30) + 10 * 10 + 10 * 10 + 2 * 60 + 150 / 10 = 30 + 100 + 100 + 120 + 15 = 365
      const cl = tinhChienLuc({
        tier: 3,
        capVo: 10,
        canhGioi: 10,
        canCot: 60,
        tuoi: 40,
        khinhCong: 0,
        thanBinh: 0,
      })
      expect(cl).toBe(365)
    })

    it('ví dụ số trong GDD: thêm Khinh công cấp 4 và Ỷ Thiên Kiếm -> 405', () => {
      // 365 + 5 * 4 + 100 / 5 = 365 + 20 + 20 = 405
      const cl = tinhChienLuc({
        tier: 3,
        capVo: 10,
        canhGioi: 10,
        canCot: 60,
        tuoi: 40,
        khinhCong: 4,
        thanBinh: 100,
      })
      expect(cl).toBe(405)
    })

    it('tính Chiến Lực cho NhanVat thông qua chienLuc và docChiSo', () => {
      const nv = taoNhanVatRong()
      nv.can_cot = 60
      nv.tuoi = 40
      nv.trang_bi.noi_cong = 'dich_can_kinh'
      nv.vo_hoc['dich_can_kinh'] = { cap: 10, tien_do: 0, hoan_thien: 100 }
      nv.trang_bi.ngoai_cong = ['hang_long_thap_bat_chuong']
      nv.vo_hoc['hang_long_thap_bat_chuong'] = { cap: 10, tien_do: 0, hoan_thien: 100 }

      const cl = chienLuc(nv, dl)
      expect(cl).toBe(365)
      expect(docChiSo(dl, nv, 'chien_luc')).toBe(365)
    })
  })

  describe('HS02 II.1: Số ô trang bị theo trụ cột', () => {
    it('ví dụ số trong GDD: số ô Ngoại công ở Ngộ tính 10 -> 2, Ngộ tính 100 -> 6', () => {
      const nv10 = taoNhanVatRong()
      nv10.ngo_tinh = 10
      expect(soO(nv10, 'ngoai_cong')).toBe(2)

      const nv100 = taoNhanVatRong()
      nv100.ngo_tinh = 100
      expect(soO(nv100, 'ngoai_cong')).toBe(6)
    })

    it('Song Thủ Hỗ Bác cộng thêm 1 ô Ngoại công', () => {
      const nv = taoNhanVatRong()
      nv.ngo_tinh = 100
      nv.thien_phu.push('song_thu_ho_bac')
      expect(soO(nv, 'ngoai_cong')).toBe(7)
    })

    it('Nội công phụ trợ theo ngưỡng Ngộ tính', () => {
      const nv = taoNhanVatRong()
      nv.ngo_tinh = 30
      expect(soO(nv, 'noi_cong_phu')).toBe(0)

      nv.ngo_tinh = 50
      expect(soO(nv, 'noi_cong_phu')).toBe(1)

      nv.ngo_tinh = 80
      expect(soO(nv, 'noi_cong_phu')).toBe(2)
    })

    it('Tuyệt kỹ theo ngưỡng Căn cốt', () => {
      const nv = taoNhanVatRong()
      nv.can_cot = 20
      expect(soO(nv, 'tuyet_ky')).toBe(1)

      nv.can_cot = 60
      expect(soO(nv, 'tuyet_ky')).toBe(2)

      nv.can_cot = 100
      expect(soO(nv, 'tuyet_ky')).toBe(3)
    })

    it('Nội công chủ đạo và Khinh công luôn có 1 ô', () => {
      const nv = taoNhanVatRong()
      expect(soO(nv, 'noi_cong_chu_dao')).toBe(1)
      expect(soO(nv, 'khinh_cong')).toBe(1)
    })
  })

  describe('HS06 I.1: Sinh Mệnh và Nội Tức tối đa', () => {
    it('tính đúng hpMax và docChiSo("hp_max")', () => {
      const nv = taoNhanVatRong()
      nv.can_cot = 50
      nv.tuoi = 20
      nv.trang_bi.noi_cong = 'dich_can_kinh'
      nv.vo_hoc['dich_can_kinh'] = { cap: 5, tien_do: 0, hoan_thien: 100 }

      // hp_max = 100 + 50 * 12 + 5 * 80 + 5 * 20 = 100 + 600 + 400 + 100 = 1200
      expect(hpMax(nv, dl)).toBe(1200)
      expect(docChiSo(dl, nv, 'hp_max')).toBe(1200)
    })

    it('tính đúng noiTucMax và docChiSo("noi_tuc_max")', () => {
      const nv = taoNhanVatRong()
      nv.can_cot = 50
      nv.noi_tuc_cong_them = 30
      nv.trang_bi.noi_cong = 'dich_can_kinh'
      nv.vo_hoc['dich_can_kinh'] = { cap: 4, tien_do: 0, hoan_thien: 100 }

      // mp_max = 50 + 50 * 8 + 4 * 150 + 30 = 50 + 400 + 600 + 30 = 1080
      expect(noiTucMax(nv, dl)).toBe(1080)
      expect(docChiSo(dl, nv, 'noi_tuc_max')).toBe(1080)
    })
  })

  describe('HS06 I.1: Võ Lực', () => {
    it('tính đúng võ lực và kẹp thang 100', () => {
      expect(tinhVoLuc(50, 5)).toBe(50) // 25 + 25 = 50
      expect(tinhVoLuc(100, 10)).toBe(100) // 50 + 50 = 100
      expect(tinhVoLuc(120, 10)).toBe(100) // 60 + 50 = 110 -> 100

      const nv = taoNhanVatRong()
      nv.can_cot = 40
      nv.trang_bi.ngoai_cong = ['hang_long_thap_bat_chuong']
      nv.vo_hoc['hang_long_thap_bat_chuong'] = { cap: 6, tien_do: 0, hoan_thien: 100 }

      // 20 + 30 = 50
      expect(voLuc(nv, dl)).toBe(50)
      expect(docChiSo(dl, nv, 'vo_luc')).toBe(50)
    })
  })

  describe('HS06 I.1: Tiến độ lĩnh ngộ võ học đặc biệt', () => {
    it('Thái Huyền Kinh / Không Minh Quyền đảo ngược tử số', () => {
      // Ngộ tính 10, tự học (cấp sư phụ 0), Tier 4
      // Tử số: (100 - 10) * 1.5 = 135. Mẫu số: 5.0 -> 27%
      expect(tienDoMoiAp(10, 0, 4, { daoNguoc: true })).toBe(27)

      // Ngộ tính 90, tự học, Tier 4
      // Tử số: (100 - 90) * 1.5 = 15. Mẫu số: 5.0 -> 3%
      expect(tienDoMoiAp(90, 0, 4, { daoNguoc: true })).toBe(3)
    })

    it('Hàn Ngọc Sàng nhân đôi tiến độ', () => {
      const bth = tienDoMoiAp(50, 0, 2)
      const coGiuong = tienDoMoiAp(50, 0, 2, { hanNgocSang: true })
      expect(coGiuong).toBe(bth * 2)
    })
  })

  describe('HS04 III: Tuổi bắt đầu lão hóa', () => {
    it('Cảnh giới < 8 lão hóa từ sau 50 tuổi; Cảnh giới >= 8 lão hóa từ sau 60 tuổi', () => {
      expect(tinhTuoiBatDauLaoHoa(5)).toBe(50)
      expect(tinhTuoiBatDauLaoHoa(8)).toBe(60)
      expect(tinhTuoiBatDauLaoHoa(10)).toBe(60)
    })

    it('học Dịch Cân Kinh hoặc Cửu Dương Thần Công thì không lão hóa (Infinity)', () => {
      const nv = taoNhanVatRong()
      nv.vo_hoc['dich_can_kinh'] = { cap: 1, tien_do: 0, hoan_thien: 100 }
      expect(tuoiBatDauLaoHoa(0, nv, dl)).toBe(Infinity)
    })
  })

  describe('HS01 II.2: Danh vọng hiển thị', () => {
    it('cộng thêm danh vọng chức vị và kẹp trần 1000', () => {
      const nv = taoNhanVatRong()
      nv.danh_vong = 200

      // Không ở môn phái
      expect(danhVongHienThi(nv)).toBe(200)

      // Trưởng lão (bậc 4)
      nv.mon_phai = { ma: 'thieu_lam', bac: 4, cong_hien: 700, tu_tuoi: 28 }
      expect(danhVongHienThi(nv)).toBe(350)

      // Chưởng môn (bậc 5)
      nv.mon_phai.bac = 5
      expect(danhVongHienThi(nv)).toBe(500)

      // Kẹp trần 1000
      nv.danh_vong = 800
      expect(danhVongHienThi(nv)).toBe(1000)
    })
  })

  describe('HS06 I.3: Tỷ lệ xuất hiện Kỳ Ngộ (pKyNgo)', () => {
    it('tính đúng theo Phúc Duyên và Hệ số Vùng đất', () => {
      const nv = taoNhanVatRong()
      nv.phuc_duyen = 50
      nv.vung = 'trung_nguyen'
      // 0.02 + 50 * 0.0012 + 0.0 = 0.08 (8%)
      expect(pKyNgo(nv, dl)).toBeCloseTo(0.08, 5)

      nv.vung = 'giang_nam'
      // 0.08 + 0.01 = 0.09 (9%)
      expect(pKyNgo(nv, dl)).toBeCloseTo(0.09, 5)

      nv.vung = 'tay_vuc'
      // 0.08 + 0.04 = 0.12 (12%)
      expect(pKyNgo(nv, dl)).toBeCloseTo(0.12, 5)
    })
  })

  describe('HS01 II.4: Cảnh giới nội công, cấp khinh công, hệ nội lực', () => {
    it('trả về 0 hoặc "ngoai" khi chưa trang bị', () => {
      const nv = taoNhanVatRong()
      expect(canhGioiNoiCong(nv)).toBe(0)
      expect(capKhinhCong(nv)).toBe(0)
      expect(heNoiLuc(nv, dl)).toBe('ngoai')
      expect(docChiSo(dl, nv, 'canh_gioi_noi_cong')).toBe(0)
      expect(docChiSo(dl, nv, 'cap_khinh_cong')).toBe(0)
    })

    it('trả về đúng cấp và hệ khi trang bị', () => {
      const nv = taoNhanVatRong()
      nv.trang_bi.noi_cong = 'dich_can_kinh'
      nv.vo_hoc['dich_can_kinh'] = { cap: 8, tien_do: 0, hoan_thien: 100 }
      nv.trang_bi.khinh_cong = 'thao_thuong_phi'
      nv.vo_hoc['thao_thuong_phi'] = { cap: 4, tien_do: 0, hoan_thien: 100 }

      expect(canhGioiNoiCong(nv)).toBe(8)
      expect(capKhinhCong(nv)).toBe(4)
      expect(heNoiLuc(nv, dl)).toBe('duong')
      expect(docChiSo(dl, nv, 'canh_gioi_noi_cong')).toBe(8)
      expect(docChiSo(dl, nv, 'cap_khinh_cong')).toBe(4)
    })
  })
})
