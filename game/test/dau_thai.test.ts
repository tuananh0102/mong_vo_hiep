import { describe, expect, it } from 'vitest'
import { napDuLieu } from '../src/du_lieu/nap'
import { docTepDia } from '../src/du_lieu/nap_node'
import { apDung } from '../src/luat/dong_co'
import { khoiTaoKiep, quayGiaCanh, rut3ThienPhu, thucHienChonThienPhu } from '../src/luat/dau_thai'
import type { TrangThaiGame } from '../src/luat/kieu'
import { rngTuSeed, taoRng } from '../src/luat/rng'
import { taoNhanVatRong } from '../src/luat/chi_so'

const dl = napDuLieu(docTepDia())

function taoTrangThaiTrang(): TrangThaiGame {
  const rng = taoRng([1, 0, 0, 0])
  return {
    phien_ban: 1,
    seed: 1,
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

describe('Đầu thai và Thiên phú đầu đời (M1-06)', () => {
  it('10.000 kiếp: tỷ lệ gia cảnh đúng ±1.5% và Hàn Vi luôn 0 lạng', () => {
    const demGiaCanh: Record<string, number> = {
      han_vi: 0,
      binh_dan: 0,
      phu_thuong: 0,
      vo_lam_the_gia: 0,
    }

    const tongSo = 10000
    const rng = rngTuSeed(999)

    for (let i = 0; i < tongSo; i++) {
      const gc = quayGiaCanh(rng, dl)
      demGiaCanh[gc] = (demGiaCanh[gc] ?? 0) + 1

      // Kiểm tra ngân lượng nếu là hàn vi
      if (gc === 'han_vi') {
        const s = taoTrangThaiTrang()
        khoiTaoKiep(s, rng, dl, {
          seed: i,
          gioi_tinh: 'nam',
          ten: 'Test',
          uu_dai: [],
        })
        if (s.nhan_vat.gia_canh === 'han_vi') {
          expect(s.nhan_vat.ngan_luong).toBe(0)
        }
      }
    }

    // Tỷ lệ chuẩn: Hàn Vi 35%, Bình Dân 35%, Phú Thương 20%, Võ Lâm Thế Gia 10%
    // Sai số cho phép: ±1.5%
    const tyLeHanVi = demGiaCanh['han_vi']! / tongSo
    const tyLeBinhDan = demGiaCanh['binh_dan']! / tongSo
    const tyLePhuThuong = demGiaCanh['phu_thuong']! / tongSo
    const tyLeTheGia = demGiaCanh['vo_lam_the_gia']! / tongSo

    expect(tyLeHanVi).toBeGreaterThanOrEqual(0.335)
    expect(tyLeHanVi).toBeLessThanOrEqual(0.365)

    expect(tyLeBinhDan).toBeGreaterThanOrEqual(0.335)
    expect(tyLeBinhDan).toBeLessThanOrEqual(0.365)

    expect(tyLePhuThuong).toBeGreaterThanOrEqual(0.185)
    expect(tyLePhuThuong).toBeLessThanOrEqual(0.215)

    expect(tyLeTheGia).toBeGreaterThanOrEqual(0.085)
    expect(tyLeTheGia).toBeLessThanOrEqual(0.115)
  })

  it('10.000 lần rút: 3 Thiên phú luôn luôn khác nhau', () => {
    const rng = rngTuSeed(555)
    const tongSo = 10000

    for (let i = 0; i < tongSo; i++) {
      const [tp1, tp2, tp3] = rut3ThienPhu(rng, dl)
      expect(tp1).not.toBe(tp2)
      expect(tp1).not.toBe(tp3)
      expect(tp2).not.toBe(tp3)
      const tapHop = new Set([tp1, tp2, tp3])
      expect(tapHop.size).toBe(3)
    }
  })

  it('bẩm sinh ghi sau Thiên phú (ví dụ Đào Hoa Kiếp cộng 25 Mị lực)', () => {
    const s = taoTrangThaiTrang()
    const rng = rngTuSeed(7)

    // Khởi tạo kiếp
    khoiTaoKiep(s, rng, dl, {
      seed: 7,
      gioi_tinh: 'nu',
      ten: 'Hoàng Dung',
      uu_dai: [],
    })

    const miLucTruoc = s.nhan_vat.mi_luc
    // Gán thiên phú dao_hoa_kiep vào lựa chọn để chọn
    s.cho = {
      loai: 'chon_thien_phu',
      lua_chon: ['dao_hoa_kiep', 'so_huong', 'than_the_cuong_trang'],
    }

    const kq = thucHienChonThienPhu(s, rng, dl, 'dao_hoa_kiep')
    expect(kq.loi).toBeNull()

    // Đào Hoa Kiếp cộng 25 Mị lực (HS01 III.2)
    expect(s.nhan_vat.mi_luc).toBe(miLucTruoc + 25)
    // HS05 IV.1: Chỉ số bẩm sinh phải bằng chỉ số sau khi đã tính Thiên phú
    expect(s.nhan_vat.mi_luc_bam_sinh).toBe(s.nhan_vat.mi_luc)
    expect(s.nhan_vat.can_cot_bam_sinh).toBe(s.nhan_vat.can_cot)
    expect(s.nhan_vat.ngo_tinh_bam_sinh).toBe(s.nhan_vat.ngo_tinh)

    // Căn cốt đỉnh bằng Căn cốt tuổi 0
    expect(s.nhan_vat.can_cot_dinh).toBe(s.nhan_vat.can_cot)

    // HP và Nội tức hồi đầy
    expect(s.nhan_vat.hp).toBeGreaterThan(0)
    expect(s.nhan_vat.noi_tuc).toBeGreaterThan(0)

    // Có dòng Biên Niên Sử chào đời
    expect(kq.dongMoi).toHaveLength(1)
    expect(kq.dongMoi[0]?.van_ban).toContain('bạn chào đời tại Trung Nguyên')
  })

  it('Võ Lâm Thế Gia: có lịch hẹn võ công năm 5 tuổi và cờ kẻ thù truyền kiếp', () => {
    const s = taoTrangThaiTrang()
    const rng = rngTuSeed(12)

    khoiTaoKiep(s, rng, dl, {
      seed: 12,
      gioi_tinh: 'nam',
      ten: 'Mộ Dung Phục',
      uu_dai: [],
    })

    // Ép gia cảnh sang Võ Lâm Thế Gia
    s.nhan_vat.gia_canh = 'vo_lam_the_gia'
    const tpChon = s.cho?.loai === 'chon_thien_phu' ? s.cho.lua_chon[0] : 'than_the_cuong_trang'

    const kq = thucHienChonThienPhu(s, rng, dl, tpChon)
    expect(kq.loi).toBeNull()

    // Kiểm tra lịch hẹn năm 5 tuổi
    const henVoCong = s.lich_hen.find((h) => h.su_kien === 'vo_cong_gia_truyen_5_tuoi')
    expect(henVoCong).toBeDefined()
    expect(henVoCong?.nam_mo).toBe(5)

    // Kiểm tra cờ kẻ thù truyền kiếp
    expect(s.nhan_vat.co_su_kien['ke_thu_truyen_kiep']).toBe(true)
  })

  it('lệnh tao_kiep và chon_thien_phu qua động cơ apDung', () => {
    const s = taoTrangThaiTrang()

    // 1. Gửi lệnh tao_kiep với tên rỗng -> tự sinh tên ngẫu nhiên
    const kqTao = apDung(
      s,
      {
        loai: 'tao_kiep',
        seed: 777,
        gioi_tinh: 'nam',
        ten: '',
        uu_dai: [],
      },
      dl,
    )

    expect(kqTao.loi).toBeNull()
    expect(kqTao.trang_thai.nhan_vat.ten.trim().length).toBeGreaterThan(0)
    expect(kqTao.trang_thai.cho?.loai).toBe('chon_thien_phu')

    const luaChon = (kqTao.trang_thai.cho as { lua_chon: string[] }).lua_chon
    expect(luaChon).toHaveLength(3)

    // 2. Gửi lệnh chon_thien_phu
    const maTp = luaChon[0]!
    const kqChon = apDung(
      kqTao.trang_thai,
      {
        loai: 'chon_thien_phu',
        ma: maTp,
      },
      dl,
    )

    expect(kqChon.loi).toBeNull()
    expect(kqChon.trang_thai.nhan_vat.thien_phu).toContain(maTp)
    expect(kqChon.trang_thai.cho).toBeNull()
    expect(kqChon.dong_moi).toHaveLength(1)
    expect(kqChon.trang_thai.bien_nien).toHaveLength(1)
  })
})
