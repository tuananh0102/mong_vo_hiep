import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import type { DuLieu, SuKien } from '../src/du_lieu/luoc_do'
import { LuocDoSuKien } from '../src/du_lieu/luoc_do'
import { napDuLieu } from '../src/du_lieu/nap'
import { docTepDia } from '../src/du_lieu/nap_node'
import { apDung } from '../src/luat/dong_co'
import { nhanDoKho, pRoll } from '../src/luat/kiem_dinh'
import type { TrangThaiGame } from '../src/luat/kieu'
import { taoRng } from '../src/luat/rng'
import { moSuKien, tomTatThayDoi, xuLyChon } from '../src/luat/su_kien'
import { xemSuKien } from '../src/luat/xem'
import { taoNhanVatRong } from '../src/luat/chi_so'

const THU_MUC_MAU = fileURLToPath(new URL('./mau_du_lieu', import.meta.url))
const dlGoc = napDuLieu(docTepDia())

function docSuKienMau(tenTep: string): SuKien {
  const duongDan = join(THU_MUC_MAU, tenTep)
  const noiDung: unknown = JSON.parse(readFileSync(duongDan, 'utf8'))
  return LuocDoSuKien.parse(noiDung)
}

function taoTrangThaiMau(seed = 42): TrangThaiGame {
  const rng = taoRng([seed, 0, 0, 0])
  return {
    phien_ban: 1,
    seed,
    rng: rng.layTrangThai(),
    nam_the_gioi: 0,
    nhan_vat: {
      ...taoNhanVatRong(),
      ten: 'Trương Vô Kỵ',
      gioi_tinh: 'nam',
      tuoi: 15,
      gia_canh: 'nong_dan',
      vung: 'trung_nguyen',
      can_cot: 50,
      ngo_tinh: 50,
      phuc_duyen: 50,
      mi_luc: 50,
      ngan_luong: 0,
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

function napVaoDuLieu(dsSuKien: SuKien[]): DuLieu {
  const suKienMap: Record<string, SuKien> = { ...(dlGoc.su_kien ?? {}) }
  for (const sk of dsSuKien) {
    suKienMap[sk.ma] = sk
  }
  return {
    ...dlGoc,
    su_kien: suKienMap,
  }
}

describe('Bộ chạy sự kiện (M1-05)', () => {
  const skDungCong = docSuKienMau('dung_cong.json')
  const skDungRoll = docSuKienMau('dung_roll.json')
  const skDungNgauNhien = docSuKienMau('dung_ngau_nhien.json')

  it('Cổng chưa đạt bị khóa, ly_do hiển thị rõ và lệnh chon trả lỗi', () => {
    const dl = napVaoDuLieu([skDungCong])
    const s = taoTrangThaiMau()
    s.nhan_vat.ngan_luong = 20 // Cần 50

    const rng = taoRng(s.rng)
    moSuKien(s, rng, dl, 'dung_cong')

    // 1. Kiểm tra xemSuKien
    const hienThi = xemSuKien(s, dl)
    expect(hienThi).not.toBeNull()
    expect(hienThi?.tieu_de).toBe(skDungCong.ten)

    const lcA = hienThi?.lua_chon.find((c) => c.ma === 'a')
    expect(lcA).toBeDefined()
    expect(lcA?.bi_khoa).toBe(true)
    expect(lcA?.ly_do).toBe('Cần Ngân Lượng 50')

    const lcB = hienThi?.lua_chon.find((c) => c.ma === 'b')
    expect(lcB).toBeDefined()
    expect(lcB?.bi_khoa).toBe(false)

    // 2. Cố gắng chọn lựa chọn bị khóa -> trả lỗi lua_chon_bi_khoa
    const kq = apDung(s, { loai: 'chon', ma_lua_chon: 'a' }, dl)
    expect(kq.loi).toBe('lua_chon_bi_khoa')
    expect(kq.trang_thai.nhan_vat.ngan_luong).toBe(20)
  })

  it('Cổng đạt thì được chọn bình thường và trừ chi phí', () => {
    const dl = napVaoDuLieu([skDungCong])
    const s = taoTrangThaiMau()
    s.nhan_vat.ngan_luong = 60

    const rng = taoRng(s.rng)
    moSuKien(s, rng, dl, 'dung_cong')

    const hienThi = xemSuKien(s, dl)
    const lcA = hienThi?.lua_chon.find((c) => c.ma === 'a')
    expect(lcA?.bi_khoa).toBe(false)

    const kq = apDung(s, { loai: 'chon', ma_lua_chon: 'a' }, dl)
    expect(kq.loi).toBeNull()
    expect(kq.trang_thai.nhan_vat.ngan_luong).toBe(10) // 60 - 50 = 10
    expect(kq.trang_thai.nhan_vat.hanh_trang['thiet_kiem']).toBe(1)
    expect(kq.trang_thai.cho).toBeNull()
    // Có dòng Biên Niên Sử kết quả + dòng tóm tắt chỉ số
    expect(kq.dong_moi.length).toBeGreaterThanOrEqual(2)
    expect(kq.dong_moi[0]?.van_ban).toContain('Bạn trả 50 lượng bạc')
    expect(kq.dong_moi[1]?.van_ban).toContain('Ngân Lượng -50, Nhận Thiết Kiếm')
  })

  it('Cổng ẩn không đạt: không xuất hiện trong xemSuKien và lệnh chon trả lỗi', () => {
    const skCoCongAn: SuKien = {
      ...skDungCong,
      ma: 'sk_cong_an',
      lua_chon: [
        ...skDungCong.lua_chon,
        {
          ma: 'an',
          nhan: 'Tuyệt chiêu bí ẩn',
          cong_an: { so: 'can_cot', op: '>=', gt: 90 },
          ket_qua: { van_ban: 'Bí mật!', hieu_ung: [] },
        },
      ],
    }

    const dl = napVaoDuLieu([skCoCongAn])
    const s = taoTrangThaiMau()
    s.nhan_vat.can_cot = 50 // < 90

    const rng = taoRng(s.rng)
    moSuKien(s, rng, dl, 'sk_cong_an')

    const hienThi = xemSuKien(s, dl)
    const lcAn = hienThi?.lua_chon.find((c) => c.ma === 'an')
    expect(lcAn).toBeUndefined() // Không render

    // Cố tình gửi lệnh chon với mã 'an' -> lỗi lua_chon_khong_hop_le
    const kq = apDung(s, { loai: 'chon', ma_lua_chon: 'an' }, dl)
    expect(kq.loi).toBe('lua_chon_khong_hop_le')
  })

  it('nhãn độ khó khớp pRoll', () => {
    const dl = napVaoDuLieu([skDungRoll])
    const s = taoTrangThaiMau()

    // Kiểm tra trực tiếp hàm nhanDoKho
    expect(nhanDoKho(0.10)).toBe('hiem')
    expect(nhanDoKho(0.24)).toBe('hiem')
    expect(nhanDoKho(0.25)).toBe('kho')
    expect(nhanDoKho(0.49)).toBe('kho')
    expect(nhanDoKho(0.50)).toBe('kha')
    expect(nhanDoKho(0.74)).toBe('kha')
    expect(nhanDoKho(0.75)).toBe('de')
    expect(nhanDoKho(0.95)).toBe('de')

    // dung_roll: [Roll: Căn cốt vs 30]
    // Nếu căn cốt = 30, phúc duyên = 50 -> p = 0.50 -> nhãn 'kha'
    s.nhan_vat.can_cot = 30
    s.nhan_vat.phuc_duyen = 50
    const rng = taoRng(s.rng)
    moSuKien(s, rng, dl, 'dung_roll')

    const ht1 = xemSuKien(s, dl)
    const lcA1 = ht1?.lua_chon.find((c) => c.ma === 'a')
    expect(lcA1?.do_kho).toBe('kha')
    expect(lcA1?.chi_so_hien).toBe('Căn Cốt')

    // Nếu căn cốt = 50, ngưỡng = 30 -> hiệu = +20 -> p = 0.5 + 20 * 0.025 = 1.0 -> clamp 0.95 -> nhãn 'de'
    s.nhan_vat.can_cot = 50
    const ht2 = xemSuKien(s, dl)
    const lcA2 = ht2?.lua_chon.find((c) => c.ma === 'a')
    expect(lcA2?.do_kho).toBe('de')

    // Nếu căn cốt = 10, ngưỡng = 30 -> hiệu = -20 -> p = 0.5 - 20 * 0.025 = 0.0 -> clamp 0.05 -> nhãn 'hiem'
    s.nhan_vat.can_cot = 10
    const ht3 = xemSuKien(s, dl)
    const lcA3 = ht3?.lua_chon.find((c) => c.ma === 'a')
    expect(lcA3?.do_kho).toBe('hiem')
  })

  it('10.000 lần chọn Roll với p = 0.70 cho tỷ lệ thành công 70% ± 1.5%', () => {
    // Để p = 0.70: pRoll(canCot = 58, nguong = 50, phucDuyen = 50)
    // d = 58 - 50 = +8 -> 0.5 + 8 * 0.025 = 0.70 (70%)
    const skRoll70: SuKien = {
      ma: 'sk_roll_70',
      nguon: 'test',
      ten: 'Thử nghiệm xác suất 70%',
      loai: 'thuong',
      tuoi: [1, 100],
      lap_lai: 'moi_nam',
      mo_ta: 'Thử nghiệm roll xác suất',
      lua_chon: [
        {
          ma: 'roll',
          nhan: 'Roll 70%',
          kiem_dinh: { loai: 'roll', chi_so: 'can_cot', nguong: 50 },
          thanh_cong: { van_ban: 'Thành công', hieu_ung: [{ cong: { mi_luc: 1 } }] },
          that_bai: { van_ban: 'Thất bại', hieu_ung: [{ cong: { mi_luc: -1 } }] },
        },
        {
          ma: 'bo_qua',
          nhan: 'Bỏ qua',
          ket_qua: { van_ban: 'Bỏ qua', hieu_ung: [] },
        },
      ],
    }

    const dl = napVaoDuLieu([skRoll70])
    let soLanThanhCong = 0
    const tongSo = 10000

    const s = taoTrangThaiMau(12345)
    s.nhan_vat.can_cot = 58
    s.nhan_vat.phuc_duyen = 50
    const rng = taoRng(s.rng)

    // Xác nhận p = 0.70
    expect(pRoll(58, 50, 50)).toBeCloseTo(0.7, 5)

    for (let i = 0; i < tongSo; i++) {
      s.cho = { loai: 'su_kien', ma: 'sk_roll_70', bien: {} }
      const kq = xuLyChon(s, rng, dl, 'roll')
      expect(kq.loi).toBeNull()
      if (kq.dongMoi[0]?.van_ban === 'Thành công') {
        soLanThanhCong++
      }
    }

    const tyLe = soLanThanhCong / tongSo
    expect(tyLe).toBeGreaterThanOrEqual(0.685)
    expect(tyLe).toBeLessThanOrEqual(0.715)
  })

  it('tiep mở đúng sự kiện tiếp theo ngay lập tức', () => {
    const skTiepB: SuKien = {
      ma: 'sk_b',
      nguon: 'test',
      ten: 'Sự kiện B',
      loai: 'thuong',
      tuoi: [1, 100],
      lap_lai: 'moi_nam',
      mo_ta: 'Đây là sự kiện B',
      lua_chon: [
        {
          ma: 'xong',
          nhan: 'Kết thúc sự kiện B',
          ket_qua: { van_ban: 'Đã hoàn tất sự kiện B', hieu_ung: [] },
        },
        {
          ma: 'bo_qua',
          nhan: 'Bỏ qua',
          ket_qua: { van_ban: 'Bỏ qua B', hieu_ung: [] },
        },
      ],
    }

    const skTiepA: SuKien = {
      ma: 'sk_a',
      nguon: 'test',
      ten: 'Sự kiện A',
      loai: 'thuong',
      tuoi: [1, 100],
      lap_lai: 'moi_nam',
      mo_ta: 'Đây là sự kiện A',
      lua_chon: [
        {
          ma: 'den_b',
          nhan: 'Đi tới sự kiện B',
          ket_qua: {
            van_ban: 'Chuyển sang B',
            hieu_ung: [{ tiep: 'sk_b' }],
          },
        },
        {
          ma: 'dung_lai',
          nhan: 'Dừng lại',
          ket_qua: { van_ban: 'Dừng lại ở A', hieu_ung: [] },
        },
      ],
    }

    const dl = napVaoDuLieu([skTiepA, skTiepB])
    const s = taoTrangThaiMau()
    const rng = taoRng(s.rng)
    moSuKien(s, rng, dl, 'sk_a')

    expect(s.cho).toEqual({ loai: 'su_kien', ma: 'sk_a', bien: {} })

    const kq = apDung(s, { loai: 'chon', ma_lua_chon: 'den_b' }, dl)
    expect(kq.loi).toBeNull()
    // Sau khi chọn, sự kiện chuyển ngay thành sk_b
    expect(kq.trang_thai.cho).toEqual({ loai: 'su_kien', ma: 'sk_b', bien: {} })
  })

  it('hết hàng đợi sự kiện thì cho = null', () => {
    const dl = napVaoDuLieu([skDungCong, skDungRoll])
    const s = taoTrangThaiMau()
    s.nhan_vat.ngan_luong = 100

    // Đặt sự kiện dung_cong và xếp dung_roll vào hàng đợi
    const rng = taoRng(s.rng)
    moSuKien(s, rng, dl, 'dung_cong')
    s.hang_doi_su_kien = ['dung_roll']

    // Chọn lựa chọn của dung_cong -> hoàn thành dung_cong, mở dung_roll từ hàng đợi
    const kq1 = apDung(s, { loai: 'chon', ma_lua_chon: 'b' }, dl)
    expect(kq1.loi).toBeNull()
    expect(kq1.trang_thai.cho).toEqual({ loai: 'su_kien', ma: 'dung_roll', bien: {} })
    expect(kq1.trang_thai.hang_doi_su_kien).toEqual([])

    // Chọn lựa chọn của dung_roll -> hàng đợi rỗng -> cho = null
    const kq2 = apDung(kq1.trang_thai, { loai: 'chon', ma_lua_chon: 'b' }, dl)
    expect(kq2.loi).toBeNull()
    expect(kq2.trang_thai.cho).toBeNull()
  })

  it('sự kiện ngẫu nhiên chọn nhánh theo tỉ lệ', () => {
    const dl = napVaoDuLieu([skDungNgauNhien])
    const s = taoTrangThaiMau(777)
    const rng = taoRng(s.rng)
    moSuKien(s, rng, dl, 'dung_ngau_nhien')

    const kq = apDung(s, { loai: 'chon', ma_lua_chon: 'a' }, dl)
    expect(kq.loi).toBeNull()
    expect(kq.dong_moi.length).toBeGreaterThanOrEqual(1)
  })

  it('tóm tắt thay đổi chỉ số hoạt động chính xác', () => {
    const tomTat = tomTatThayDoi(
      [
        { cong: { can_cot: 5, ngan_luong: -20 } },
        { hiep_nghia: 10 },
        { nhan_vat_pham: 'thiet_kiem' },
      ],
      dlGoc,
    )
    expect(tomTat).toContain('Căn Cốt +5')
    expect(tomTat).toContain('Ngân Lượng -20')
    expect(tomTat).toContain('Hiệp nghĩa +10')
    expect(tomTat).toContain('Thanh danh +10')
    expect(tomTat).toContain('Nhận Thiết Kiếm')
  })
})
