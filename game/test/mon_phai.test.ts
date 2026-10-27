import { describe, expect, it } from 'vitest'
import type { DuLieu, SuKien } from '../src/du_lieu/luoc_do'
import { napDuLieu } from '../src/du_lieu/nap'
import { docTepDia } from '../src/du_lieu/nap_node'
import { taoNhanVatRong } from '../src/luat/chi_so'
import { danhVongHienThi } from '../src/luat/cong_thuc'
import { apDung } from '../src/luat/dong_co'
import {
  doiTangKinhCac,
  giaNhap,
  hangTangKinhCac,
  roiPhai,
  suKienThuThach,
  troCapNam,
} from '../src/luat/mon_phai'
import type { TrangThaiGame } from '../src/luat/kieu'
import { rngTuSeed, taoRng } from '../src/luat/rng'
import { moSuKien } from '../src/luat/su_kien'
import { quaNam } from '../src/luat/vong_nam'

const dlGoc = napDuLieu(docTepDia())

/** Sự kiện thử thách giả: lựa chọn `thang` đặt bậc N, lựa chọn `bai` không làm gì (M1-15 viết bản thật). */
function suKienThuThach_(bac: number): SuKien {
  return {
    ma: `thang_bac_${bac}`,
    nguon: 'Test',
    ten: `Thử thách Bậc ${bac}`,
    loai: 'noi_tiep',
    tuoi: [0, 200],
    lap_lai: 'moi_nam',
    mo_ta: 'Thử thách',
    lua_chon: [
      { ma: 'thang', nhan: 'Thắng', ket_qua: { van_ban: 'Thắng.', hieu_ung: [{ thang_bac: bac }] } },
      { ma: 'bai', nhan: 'Bại', ket_qua: { van_ban: 'Bại.', hieu_ung: [] } },
    ],
  }
}

const dl: DuLieu = structuredClone(dlGoc)
dl.su_kien = { ...(dl.su_kien ?? {}) }
for (const b of [2, 3, 4]) dl.su_kien[`thang_bac_${b}`] = suKienThuThach_(b)

function taoD(mo: Partial<ReturnType<typeof taoNhanVatRong>> = {}): TrangThaiGame {
  return {
    phien_ban: 1,
    seed: 1,
    rng: taoRng([1, 0, 0, 0]).layTrangThai(),
    nam_the_gioi: 0,
    nhan_vat: { ...taoNhanVatRong(), tuoi: 12, can_cot: 60, ngo_tinh: 60, thanh_danh: 100, ...mo },
    the_gioi: { npc: {} },
    cho: null,
    hang_doi_su_kien: [],
    lich_hen: [],
    bien_nien: [],
    ket_thuc: null,
    dong_toc: { doi_truoc: [] },
  }
}

function vaoPhai(ma: string, bac: number, mo: Partial<ReturnType<typeof taoNhanVatRong>> = {}): TrangThaiGame {
  const d = taoD(mo)
  d.nhan_vat.mon_phai = { ma, bac, cong_hien: 0, tu_tuoi: 12 }
  return d
}

/** Mở sự kiện thử thách và chọn một lựa chọn bằng lệnh thật. */
function thuThach(d: TrangThaiGame, ma: string, lc: 'thang' | 'bai'): TrangThaiGame {
  moSuKien(d, rngTuSeed(1), dl, ma)
  const kq = apDung(d, { loai: 'chon', ma_lua_chon: lc }, dl)
  expect(kq.loi).toBeNull()
  return kq.trang_thai
}

describe('Môn phái (M1-12)', () => {
  describe('Gia nhập (HS02 I)', () => {
    it('nữ không vào được Thiếu Lâm', () => {
      const d = taoD({ gioi_tinh: 'nu' })
      const kq = giaNhap(d, dl, 'thieu_lam')
      expect(kq.loi).not.toBeNull()
      expect(d.nhan_vat.mon_phai).toBeNull()
    })

    it('nam đủ điều kiện vào Thiếu Lâm, được dạy võ học Bậc 1 và ghi bản ghi thành viên', () => {
      const d = taoD()
      const kq = giaNhap(d, dl, 'thieu_lam')
      expect(kq.loi).toBeNull()
      expect(d.nhan_vat.mon_phai).toEqual({ ma: 'thieu_lam', bac: 1, cong_hien: 0, tu_tuoi: 12 })
      for (const ma of dl.mon_phai!['thieu_lam']!.vo_hoc_theo_bac['1']!) {
        expect(d.nhan_vat.vo_hoc[ma]).toBeDefined()
      }
      expect(d.nhan_vat.vo_hoc['dich_can_kinh']).toBeUndefined()
    })

    it('sư môn xét Thanh danh, không phải Hiệp nghĩa thật (HS02 I)', () => {
      const thapTD = taoD({ thanh_danh: 10, hiep_nghia: 500 })
      expect(giaNhap(thapTD, dl, 'vo_dang').loi).not.toBeNull()
      const caoTD = taoD({ thanh_danh: 60, hiep_nghia: -500 })
      expect(giaNhap(caoTD, dl, 'vo_dang').loi).toBeNull()
    })

    it('đã có môn phái thì không gia nhập thêm', () => {
      const d = vaoPhai('thieu_lam', 1)
      expect(giaNhap(d, dl, 'hoa_son').loi).toBe('dang_o_mon_phai')
    })

    it('hiệu ứng gia_nhap_mon_phai của sự kiện cũng dạy võ học', () => {
      const x: DuLieu = structuredClone(dl)
      x.su_kien!['x'] = {
        ...suKienThuThach_(2),
        ma: 'x',
        lua_chon: [{ ma: 'a', nhan: 'a', ket_qua: { van_ban: 'v', hieu_ung: [{ gia_nhap_mon_phai: 'hoa_son' }] } }],
      }
      const d = taoD()
      moSuKien(d, rngTuSeed(1), x, 'x')
      const kq = apDung(d, { loai: 'chon', ma_lua_chon: 'a' }, x)
      expect(kq.trang_thai.nhan_vat.vo_hoc['hoa_son_kiem_phap']).toBeDefined()
    })
  })

  describe('Thăng cấp (HS04 I.1)', () => {
    it('đủ Cống hiến mà thiếu tuổi thì chưa mở thử thách', () => {
      const d = vaoPhai('thieu_lam', 1, { tuoi: 15 })
      d.nhan_vat.mon_phai!.cong_hien = 500
      expect(suKienThuThach(d, dl)).toBeNull()
      d.nhan_vat.tuoi = 16
      expect(suKienThuThach(d, dl)).toBe('thang_bac_2')
    })

    it('đủ tuổi mà thiếu Cống hiến thì chưa mở', () => {
      const d = vaoPhai('thieu_lam', 1, { tuoi: 30 })
      d.nhan_vat.mon_phai!.cong_hien = 99
      expect(suKienThuThach(d, dl)).toBeNull()
    })

    it('bậc kế là Chưởng môn thì không tự mở (chỉ qua sự kiện Kế Vị)', () => {
      const d = vaoPhai('thieu_lam', 4, { tuoi: 50 })
      d.nhan_vat.mon_phai!.cong_hien = 5000
      expect(suKienThuThach(d, dl)).toBeNull()
    })

    it('thắng: lên bậc, +100 Cống hiến, +Danh vọng, được dạy võ học bậc mới', () => {
      const d = vaoPhai('thieu_lam', 1, { tuoi: 16 })
      d.nhan_vat.mon_phai!.cong_hien = 100
      const sau = thuThach(d, 'thang_bac_2', 'thang')
      expect(sau.nhan_vat.mon_phai!.bac).toBe(2)
      expect(sau.nhan_vat.mon_phai!.cong_hien).toBe(200)
      expect(sau.nhan_vat.danh_vong).toBe(30)
      expect(sau.nhan_vat.vo_hoc['long_trao_thu']).toBeDefined()
    })

    it('thất bại lần đầu giữ nguyên bậc và Cống hiến, thử lại sau 1 năm', () => {
      const d = vaoPhai('thieu_lam', 1, { tuoi: 16 })
      d.nhan_vat.mon_phai!.cong_hien = 120
      const sau = thuThach(d, 'thang_bac_2', 'bai')
      expect(sau.nhan_vat.mon_phai!.bac).toBe(1)
      expect(sau.nhan_vat.mon_phai!.cong_hien).toBe(120)
      expect(suKienThuThach(sau, dl)).toBeNull()
      sau.nhan_vat.tuoi = 17
      expect(suKienThuThach(sau, dl)).toBe('thang_bac_2')
    })

    it('thất bại 2 lần liên tiếp: Cống hiến -50; thắng giữa chừng xóa đếm', () => {
      let d = vaoPhai('thieu_lam', 1, { tuoi: 16 })
      d.nhan_vat.mon_phai!.cong_hien = 200
      d = thuThach(d, 'thang_bac_2', 'bai')
      d.nhan_vat.tuoi = 17
      d = thuThach(d, 'thang_bac_2', 'bai')
      expect(d.nhan_vat.mon_phai!.cong_hien).toBe(150)
      expect(d.nhan_vat.mon_phai!.bac).toBe(1)
      // đếm đã về 0: một lần thất bại nữa chưa trừ
      d.nhan_vat.tuoi = 18
      d = thuThach(d, 'thang_bac_2', 'bai')
      expect(d.nhan_vat.mon_phai!.cong_hien).toBe(150)
    })

    it('thất bại thử thách Bậc 4: trợ cấp năm sau bằng 0, rồi trở lại bình thường', () => {
      let d = vaoPhai('thieu_lam', 3, { tuoi: 30 })
      d.nhan_vat.mon_phai!.cong_hien = 800
      d = thuThach(d, 'thang_bac_4', 'bai')
      troCapNam(d)
      expect(d.nhan_vat.ngan_luong).toBe(0)
      troCapNam(d)
      expect(d.nhan_vat.ngan_luong).toBe(50)
    })

    it('1 AP sư môn mỗi năm từ 12 tuổi đạt 1.500 Cống hiến khoảng 35 - 36 tuổi', () => {
      let d = taoD({ tuoi: 12 })
      d.nhan_vat.mon_phai = { ma: 'thieu_lam', bac: 1, cong_hien: 0, tu_tuoi: 12 }
      let tuoiDat = -1
      for (; d.nhan_vat.tuoi <= 45 && tuoiDat < 0; d.nhan_vat.tuoi++) {
        const ma = suKienThuThach(d, dl)
        if (ma) d = thuThach(d, ma, 'thang')
        d.nhan_vat.ap_con_lai = 1
        const kq = apDung(d, { loai: 'hanh_dong', ma: 'nhiem_vu_su_mon' }, dl)
        expect(kq.loi).toBeNull()
        d = kq.trang_thai
        if (d.nhan_vat.mon_phai!.cong_hien >= 1500) tuoiDat = d.nhan_vat.tuoi
      }
      expect(tuoiDat).toBeGreaterThanOrEqual(35)
      expect(tuoiDat).toBeLessThanOrEqual(36)
      expect(d.nhan_vat.mon_phai!.bac).toBe(4)
    })

    it('vòng năm đưa thử thách đến hạn vào hàng đợi sự kiện', () => {
      const d = vaoPhai('thieu_lam', 1, { tuoi: 15 })
      d.nhan_vat.mon_phai!.cong_hien = 150
      quaNam(d, rngTuSeed(3), dl)
      expect(d.nhan_vat.tuoi).toBe(16)
      const dangMo = d.cho?.loai === 'su_kien' ? d.cho.ma : null
      expect([dangMo, ...d.hang_doi_su_kien]).toContain('thang_bac_2')
    })
  })

  describe('Vòng năm bước 3 (HS06 II.1, HS04 I.1)', () => {
    it('trợ cấp theo bậc 10 / 30 / 50 / 200; Chưởng môn và Lãng khách không nhận', () => {
      const nhan = (bac: number | null) => {
        const d = bac ? vaoPhai('thieu_lam', bac) : taoD()
        troCapNam(d)
        return d.nhan_vat.ngan_luong
      }
      expect([1, 2, 3, 4, 5].map(nhan)).toEqual([10, 30, 50, 200, 0])
      expect(nhan(null)).toBe(0)
    })

    it('Ngoại môn quá 18 tuổi bị mời xuống núi (sau khi nhận trợ cấp)', () => {
      const d = vaoPhai('thieu_lam', 1, { tuoi: 18, ngan_luong: 100 })
      quaNam(d, rngTuSeed(5), dl)
      expect(d.nhan_vat.tuoi).toBe(19)
      expect(d.nhan_vat.mon_phai).toBeNull()
      expect(d.nhan_vat.lich_su_mon_phai.at(-1)?.ma).toBe('thieu_lam')
      expect(d.nhan_vat.ngan_luong).toBe(100) // +10 trợ cấp (bước 3), -10 sinh hoạt phí Vô danh (bước 4)
    })

    it('Ngoại môn 17 tuổi, Nội môn 18 tuổi và Tạp dịch 18 tuổi ở lại', () => {
      const ngoai17 = vaoPhai('thieu_lam', 1, { tuoi: 17 })
      const noi18 = vaoPhai('thieu_lam', 2, { tuoi: 18 })
      const tapDich = vaoPhai('thieu_lam', 1, { tuoi: 40 })
      tapDich.nhan_vat.co_su_kien['tap_dich'] = true
      for (const d of [ngoai17, noi18, tapDich]) {
        quaNam(d, rngTuSeed(5), dl)
        expect(d.nhan_vat.mon_phai).not.toBeNull()
      }
    })
  })

  describe('Sai phái sư môn (HS04 I.1)', () => {
    const sai = (bac: number | null) => {
      const d = bac ? vaoPhai('thieu_lam', bac, { tuoi: 30, can_cot: 50, ngo_tinh: 50, phuc_duyen: 50 }) : taoD({ tuoi: 30 })
      d.nhan_vat.ap_con_lai = 1
      return apDung(d, { loai: 'hanh_dong', ma: 'sai_phai_su_mon' }, dl)
    }

    it('Ngoại môn, Chưởng môn và Lãng khách không nhận được việc', () => {
      for (const bac of [1, 5, null]) expect(sai(bac).loi).toBe('khong_du_dieu_kien')
    })

    it('Bậc 2 - 4: thù lao đúng khoảng, thất bại chỉ mất thù lao, không Trọng thương', () => {
      const khoang: Record<number, [number, number]> = { 2: [50, 150], 3: [100, 250], 4: [150, 350] }
      for (const bac of [2, 3, 4]) {
        let thang = 0
        let bai = 0
        for (let seed = 1; seed <= 200; seed++) {
          const d = vaoPhai('thieu_lam', bac, { tuoi: 30, can_cot: 5, ngo_tinh: 5, phuc_duyen: 0 })
          d.nhan_vat.ap_con_lai = 1
          d.rng = rngTuSeed(seed).layTrangThai()
          const kq = apDung(d, { loai: 'hanh_dong', ma: 'sai_phai_su_mon' }, dl)
          expect(kq.loi).toBeNull()
          const t = kq.trang_thai.nhan_vat
          expect(t.ap_con_lai).toBe(0)
          expect(t.trong_thuong).toBe(false)
          expect(t.hp).toBe(d.nhan_vat.hp)
          if (t.ngan_luong === 0) bai++
          else {
            thang++
            expect(t.ngan_luong).toBeGreaterThanOrEqual(khoang[bac]![0])
            expect(t.ngan_luong).toBeLessThanOrEqual(khoang[bac]![1])
          }
        }
        expect(thang).toBeGreaterThan(0)
        expect(bai).toBeGreaterThan(0)
      }
    })
  })

  describe('Tàng Kinh Các (HS02 I, G19)', () => {
    const them = (): DuLieu => {
      const x: DuLieu = structuredClone(dl)
      const mau = x.vo_hoc!['dich_can_kinh']!
      x.vo_hoc!['mon_ngoai_1'] = { ...mau, ma: 'mon_ngoai_1', tier: 1 }
      x.vo_hoc!['mon_ngoai_2'] = { ...mau, ma: 'mon_ngoai_2', tier: 2 }
      x.vo_hoc!['mon_ngoai_3'] = { ...mau, ma: 'mon_ngoai_3', tier: 3 }
      return x
    }

    it('chỉ bán môn khác của phái, tier không quá bậc hiện tại; giá 50 / 150 / 400', () => {
      const x = them()
      const b1 = vaoPhai('thieu_lam', 1)
      const b2 = vaoPhai('thieu_lam', 2)
      const b3 = vaoPhai('thieu_lam', 3)
      expect(hangTangKinhCac(b1, x)).toEqual([{ ma: 'mon_ngoai_1', gia: 50 }])
      expect(hangTangKinhCac(b2, x)).toEqual([
        { ma: 'mon_ngoai_1', gia: 50 },
        { ma: 'mon_ngoai_2', gia: 150 },
      ])
      expect(hangTangKinhCac(b3, x).map((h) => h.gia).sort((a, b) => a - b)).toEqual([50, 150, 400])
    })

    it('đổi đủ Cống hiến thì nhận võ học và trừ Cống hiến; thiếu thì từ chối', () => {
      const x = them()
      const d = vaoPhai('thieu_lam', 2)
      d.nhan_vat.mon_phai!.cong_hien = 149
      expect(doiTangKinhCac(d, x, 'mon_ngoai_2').loi).toBe('khong_du_cong_hien')
      d.nhan_vat.mon_phai!.cong_hien = 150
      expect(doiTangKinhCac(d, x, 'mon_ngoai_2').loi).toBeNull()
      expect(d.nhan_vat.mon_phai!.cong_hien).toBe(0)
      expect(d.nhan_vat.vo_hoc['mon_ngoai_2']).toBeDefined()
      expect(doiTangKinhCac(d, x, 'mon_ngoai_3').loi).toBe('khong_ban_o_tang_kinh_cac')
    })

    it('hành động tang_kinh_cac không tốn AP', () => {
      const x = them()
      const d = vaoPhai('thieu_lam', 1)
      d.nhan_vat.mon_phai!.cong_hien = 50
      d.nhan_vat.ap_con_lai = 0
      const kq = apDung(d, { loai: 'hanh_dong', ma: 'tang_kinh_cac', tham_so: { vo_hoc: 'mon_ngoai_1' } }, x)
      expect(kq.loi).toBeNull()
      expect(kq.trang_thai.nhan_vat.vo_hoc['mon_ngoai_1']).toBeDefined()
    })
  })

  describe('Rời phái (HS01 II.6, II.2)', () => {
    it('Cống hiến về 0, mất Danh vọng chức vị, giữ võ công, ghi lịch sử', () => {
      const d = vaoPhai('thieu_lam', 4, { danh_vong: 100 })
      d.nhan_vat.mon_phai!.cong_hien = 800
      d.nhan_vat.vo_hoc['la_han_quyen'] = { cap: 3, tien_do: 0, hoan_thien: 100 }
      expect(danhVongHienThi(d.nhan_vat)).toBe(250)
      roiPhai(d, 'truc_xuat')
      expect(d.nhan_vat.mon_phai).toBeNull()
      expect(danhVongHienThi(d.nhan_vat)).toBe(100)
      expect(d.nhan_vat.vo_hoc['la_han_quyen'].cap).toBe(3)
      expect(d.nhan_vat.lich_su_mon_phai.at(-1)).toMatchObject({ ma: 'thieu_lam', cach_roi: 'truc_xuat' })
    })

    it('hành động roi_mon_phai: tự rời, rồi vào phái khác được', () => {
      const d = vaoPhai('thieu_lam', 2)
      const kq = apDung(d, { loai: 'hanh_dong', ma: 'roi_mon_phai' }, dl)
      expect(kq.loi).toBeNull()
      expect(kq.trang_thai.nhan_vat.mon_phai).toBeNull()
      expect(kq.trang_thai.nhan_vat.lich_su_mon_phai.at(-1)?.cach_roi).toBe('tu_roi')
      expect(giaNhap(kq.trang_thai, dl, 'hoa_son').loi).toBeNull()
    })
  })
})
