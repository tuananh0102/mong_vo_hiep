import { describe, expect, it } from 'vitest'
import type { DuLieu, SuKien } from '../src/du_lieu/luoc_do'
import { LuocDoSuKien } from '../src/du_lieu/luoc_do'
import { napDuLieu } from '../src/du_lieu/nap'
import { docTepDia } from '../src/du_lieu/nap_node'
import { taoNhanVatRong } from '../src/luat/chi_so'
import { pKyNgo } from '../src/luat/cong_thuc'
import { apDung } from '../src/luat/dong_co'
import type { LuaChonPhanDinh, TrangThaiGame } from '../src/luat/kieu'
import { rngTuSeed, taoRng } from '../src/luat/rng'
import { kichHoatCuuMang, type HieuUngCuuMang } from '../src/luat/tam_hiep/cuu_mang'
import { ketThucTran } from '../src/luat/tam_hiep/hau_qua'
import { tuChiSo } from '../src/luat/tam_hiep/toan'
import { taoTranDau, type CheDoTran, type KetQuaTran, type TranDau } from '../src/luat/tam_hiep/tran'
import { xemManHinh } from '../src/luat/xem'

const dlGoc = napDuLieu(docTepDia())

function taoD(phucDuyen = 50): TrangThaiGame {
  return {
    phien_ban: 1,
    seed: 1,
    rng: taoRng([1, 0, 0, 0]).layTrangThai(),
    nam_the_gioi: 0,
    nhan_vat: {
      ...taoNhanVatRong(),
      ten: 'Thử',
      tuoi: 25,
      gia_canh: 'nong_dan',
      vung: 'trung_nguyen',
      can_cot: 50,
      ngo_tinh: 50,
      phuc_duyen: phucDuyen,
      hp: 300,
      noi_tuc: 200,
      danh_vong: 100,
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

const tuong = tuChiSo({ can_cot: 50, ngo_tinh: 50, canh_gioi: 0, tuoi: 25, tier: 1, cap_vo: 1 })

/** Trận đã xong với kết quả chỉ định, đặt vào `cho` của d. */
function dungTran(
  d: TrangThaiGame,
  kq: KetQuaTran,
  cheDo: CheDoTran,
  tuyetSat = false,
  mau: Partial<TranDau> = {},
): TranDau {
  const tran = taoTranDau({ a: { ...tuong, hp: 300, noi_tuc: 200 }, b: tuong, che_do: cheDo })
  Object.assign(tran, { buoc: 'xong', hiep: 3, ket_qua: kq, npc_tuyet_sat: tuyetSat }, mau)
  d.cho = { loai: 'tam_hiep', tran }
  return tran
}

const kqPd = (lua: LuaChonPhanDinh, nguoiThang: 'a' | 'b' | null, thoat?: boolean): KetQuaTran => ({
  nguoi_thang: nguoiThang,
  lua_chon: lua,
  ko: false,
  ...(thoat === undefined ? {} : { thoat }),
})

describe('Hậu quả trận: từng nhánh HS02 V.3', () => {
  it('Tuyệt sát: thắng, giết NPC, Danh vọng +20', () => {
    const d = taoD()
    dungTran(d, kqPd('tuyet_sat', 'a'), 'sinh_tu')
    const dong = ketThucTran(d, rngTuSeed(1), dlGoc)
    expect(d.nhan_vat.danh_vong).toBe(120)
    expect(d.nhan_vat.thong_ke['tran_thang']).toBe(1)
    expect(d.nhan_vat.thong_ke['npc_da_giet']).toBe(1)
    expect(d.cho).toBeNull()
    expect(dong.every((x) => x.loai_hien_thi === 'giao-chien')).toBe(true)
    expect(dong.length).toBe(2)
  })

  it('Thu kiếm / Phế võ công: thắng, không giết', () => {
    for (const lua of ['thu_kiem', 'phe_vo_cong'] as const) {
      const d = taoD()
      dungTran(d, kqPd(lua, 'a'), 'sinh_tu')
      ketThucTran(d, rngTuSeed(1), dlGoc)
      expect(d.nhan_vat.thong_ke['tran_thang']).toBe(1)
      expect(d.nhan_vat.thong_ke['npc_da_giet'] ?? 0).toBe(0)
    }
  })

  it('Hòa: không đổi Danh vọng và thống kê', () => {
    const d = taoD()
    dungTran(d, kqPd('hoa', null), 'sinh_tu')
    ketThucTran(d, rngTuSeed(1), dlGoc)
    expect(d.nhan_vat.danh_vong).toBe(100)
    expect(d.nhan_vat.thong_ke['tran_thang'] ?? 0).toBe(0)
    expect(d.nhan_vat.thong_ke['tran_thua'] ?? 0).toBe(0)
  })

  it('Tỷ thí thua bị hạ gục: Danh vọng -10, không chết', () => {
    const d = taoD()
    dungTran(d, { nguoi_thang: 'b', lua_chon: 'ha_guc', ko: true }, 'ty_thi', false, { a: { ...taoTranDau({ a: tuong, b: tuong, che_do: 'ty_thi' }).a, hp: -20 } })
    ketThucTran(d, rngTuSeed(1), dlGoc)
    expect(d.nhan_vat.danh_vong).toBe(90)
    expect(d.nhan_vat.hp).toBeGreaterThanOrEqual(1)
    expect(d.ket_thuc).toBeNull()
    expect(d.nhan_vat.thong_ke['tran_thua']).toBe(1)
  })

  it('Sinh tử bị hạ gục không Cứu Mạng: tử trận', () => {
    const d = taoD()
    dungTran(d, { nguoi_thang: 'b', lua_chon: 'ha_guc', ko: true }, 'sinh_tu')
    ketThucTran(d, rngTuSeed(1), dlGoc)
    expect(d.ket_thuc?.nguyen_nhan).toBe('tu_tran')
    expect(d.nhan_vat.hp).toBe(0)
    expect(d.cho).toEqual({ loai: 'chuyen_giai_doan', ma: 'van_bia' })
  })

  it('Đầu hàng: NPC không Tuyệt sát thì Trọng thương, có Tuyệt sát thì tử trận', () => {
    const tha = taoD()
    dungTran(tha, kqPd('dau_hang', 'b'), 'sinh_tu', false)
    ketThucTran(tha, rngTuSeed(1), dlGoc)
    expect(tha.ket_thuc).toBeNull()
    expect(tha.nhan_vat.trong_thuong).toBe(true)

    const giet = taoD()
    dungTran(giet, kqPd('dau_hang', 'b'), 'sinh_tu', true)
    ketThucTran(giet, rngTuSeed(1), dlGoc)
    expect(giet.ket_thuc?.nguyen_nhan).toBe('tu_tran')
  })

  it('Bỏ chạy: thoát thì sống nguyên vẹn, thất bại thì NPC định đoạt', () => {
    const thoat = taoD()
    dungTran(thoat, kqPd('bo_chay', null, true), 'sinh_tu', true)
    ketThucTran(thoat, rngTuSeed(1), dlGoc)
    expect(thoat.ket_thuc).toBeNull()
    expect(thoat.nhan_vat.trong_thuong).toBe(false)

    const hong = taoD()
    dungTran(hong, kqPd('bo_chay', 'b', false), 'sinh_tu', true)
    ketThucTran(hong, rngTuSeed(1), dlGoc)
    expect(hong.ket_thuc?.nguyen_nhan).toBe('tu_tran')
  })

  it('Trụ vững: đủ 3 hiệp mà không đầu hàng là thắng', () => {
    const d = taoD()
    dungTran(d, kqPd('hoa', null), 'tru_vung')
    ketThucTran(d, rngTuSeed(1), dlGoc)
    expect(d.nhan_vat.thong_ke['tran_thang']).toBe(1)

    const hang = taoD()
    dungTran(hang, kqPd('dau_hang', 'b'), 'tru_vung')
    ketThucTran(hang, rngTuSeed(1), dlGoc)
    expect(hang.nhan_vat.thong_ke['tran_thang'] ?? 0).toBe(0)
    expect(hang.ket_thuc).toBeNull()
  })

  it('Kim Sáng Dược đã dùng bị trừ khỏi Hành Trang', () => {
    const d = taoD()
    d.nhan_vat.hanh_trang['kim_sang_duoc'] = 2
    dungTran(d, kqPd('hoa', null), 'ty_thi', false, { da_dung_vat_pham: ['kim_sang_duoc'] })
    ketThucTran(d, rngTuSeed(1), dlGoc)
    expect(d.nhan_vat.hanh_trang['kim_sang_duoc']).toBe(1)
  })
})

describe('Nhảy vực (HS06 I.3)', () => {
  const nhay = (pd: number, seed: number): TrangThaiGame => {
    const d = taoD(pd)
    dungTran(d, kqPd('nhay_vuc', 'b'), 'sinh_tu')
    ketThucTran(d, rngTuSeed(seed), dlGoc)
    return d
  }

  it('Phúc duyên >= 60: sống tối đa 95%, sống thì +50% P_KyNgo', () => {
    let song = 0
    for (let s = 1; s <= 2000; s++) {
      const d = nhay(70, s)
      if (d.ket_thuc === null) {
        song++
        expect(d.nhan_vat.co_su_kien['tuyet_canh']).toBe(true)
        expect(pKyNgo(d.nhan_vat)).toBeCloseTo(0.02 + 70 * 0.0012 + 0.5, 9)
      } else {
        expect(d.nhan_vat.co_su_kien['tuyet_canh']).toBeUndefined()
      }
    }
    expect(song / 2000).toBeGreaterThan(0.93)
    expect(song / 2000).toBeLessThan(0.97)
  })

  it('Phúc duyên 30 - 59: Roll sinh tồn; sống thì Ám thương +5, Trọng thương, không cộng P_KyNgo', () => {
    let song = 0
    for (let s = 1; s <= 600; s++) {
      const d = nhay(45, s)
      if (d.ket_thuc === null) {
        song++
        expect(d.nhan_vat.am_thuong).toBe(5)
        expect(d.nhan_vat.trong_thuong).toBe(true)
        expect(d.nhan_vat.co_su_kien['tuyet_canh']).toBeUndefined()
      }
    }
    expect(song).toBeGreaterThan(0)
    expect(song).toBeLessThan(600)
  })

  it('Phúc duyên < 30: tử vong ngay, kết cục khong_coc_day_vuc, kể cả có Cứu Mạng', () => {
    for (let s = 1; s <= 50; s++) {
      const d = taoD(20)
      dungTran(d, kqPd('nhay_vuc', 'b'), 'sinh_tu')
      const cuu: HieuUngCuuMang = { ma: 'x', uu_tien: 1, du_dieu_kien: () => true, ap: () => [] }
      ketThucTran(d, rngTuSeed(s), dlGoc, [cuu])
      expect(d.ket_thuc?.nguyen_nhan).toBe('khong_coc_day_vuc')
    }
  })

  it('Cờ Tuyệt Cảnh chỉ cộng cho một lượt chọn sự kiện', () => {
    const nv = { ...taoNhanVatRong(), phuc_duyen: 50 }
    const co = pKyNgo(nv)
    nv.co_su_kien['tuyet_canh'] = true
    expect(pKyNgo(nv)).toBeCloseTo(co + 0.5, 9)
  })
})

describe('Quy tắc Cứu Mạng (HS02 V.4)', () => {
  const hu = (ma: string, uuTien: number, dk = true): HieuUngCuuMang => ({
    ma,
    uu_tien: uuTien,
    du_dieu_kien: () => dk,
    ap: () => [{ tuoi: 25, van_ban: `cứu bởi ${ma}`, loai_hien_thi: 'thuong' }],
  })

  it('chọn hiệu ứng đủ điều kiện đầu tiên theo ưu tiên', () => {
    const tran = taoTranDau({ a: tuong, b: tuong, che_do: 'sinh_tu' })
    const kq = kichHoatCuuMang(tran, taoD(), dlGoc, rngTuSeed(1), [hu('thu_ba', 3), hu('thu_nhat', 1), hu('thu_hai', 2)])
    expect(kq.ma).toBe('thu_nhat')
    expect(kq.dong_moi[0]?.van_ban).toBe('cứu bởi thu_nhat')
  })

  it('bỏ qua hiệu ứng không đủ điều kiện hoặc người chơi đã tắt', () => {
    const tran = taoTranDau({ a: tuong, b: tuong, che_do: 'sinh_tu' })
    const ds = [hu('a', 1, false), hu('b', 2), hu('c', 3)]
    expect(kichHoatCuuMang(tran, taoD(), dlGoc, rngTuSeed(1), ds, new Set(['b'])).ma).toBe('c')
  })

  it('chỉ 1 lần mỗi trận', () => {
    const tran = taoTranDau({ a: tuong, b: tuong, che_do: 'sinh_tu' })
    const ds = [hu('a', 1), hu('b', 2)]
    expect(kichHoatCuuMang(tran, taoD(), dlGoc, rngTuSeed(1), ds).ma).toBe('a')
    expect(tran.cuu_mang_da_dung).toBe(true)
    expect(kichHoatCuuMang(tran, taoD(), dlGoc, rngTuSeed(1), ds).ma).toBeNull()
  })

  it('M1 không có hiệu ứng thật nên không cứu ai', () => {
    const tran = taoTranDau({ a: tuong, b: tuong, che_do: 'sinh_tu' })
    expect(kichHoatCuuMang(tran, taoD(), dlGoc, rngTuSeed(1)).ma).toBeNull()
  })

  it('hiệu ứng cứu được: người chơi sống, Trọng thương, không kết thúc kiếp', () => {
    const d = taoD()
    dungTran(d, { nguoi_thang: 'b', lua_chon: 'ha_guc', ko: true }, 'sinh_tu')
    const dong = ketThucTran(d, rngTuSeed(1), dlGoc, [hu('than_chieu_kinh', 1)])
    expect(d.ket_thuc).toBeNull()
    expect(d.nhan_vat.trong_thuong).toBe(true)
    expect(d.nhan_vat.hp).toBeGreaterThanOrEqual(1)
    expect(dong.some((x) => x.van_ban === 'cứu bởi than_chieu_kinh')).toBe(true)
  })
})

describe('Nối vào động cơ: sự kiện mở trận, lệnh tam_hiep, nhánh thành công / thất bại', () => {
  const sk: SuKien = LuocDoSuKien.parse({
    ma: 'thu_tam_hiep',
    nguon: 'HS02 V',
    ten: 'Thử tỷ thí',
    loai: 'thuong',
    loai_hien_thi: 'giao-chien',
    tuoi: [10, 60],
    vung: null,
    dieu_kien: null,
    trong_so: 1,
    lap_lai: 'mot_lan',
    mo_ta: 'Một cao thủ thách đấu.',
    lua_chon: [
      {
        ma: 'danh',
        nhan: 'Nhận lời [Tam Hiệp]',
        kiem_dinh: { loai: 'tam_hiep', doi_thu: 'cao_thu', che_do: 'ty_thi' },
        thanh_cong: { van_ban: 'NHANH_THANG', hieu_ung: [{ cong: { can_cot: 1 } }] },
        that_bai: { van_ban: 'NHANH_THUA', hieu_ung: [] },
      },
    ],
  })
  const dl: DuLieu = { ...dlGoc, su_kien: { ...(dlGoc.su_kien ?? {}), [sk.ma]: sk } }

  function choiTrọn(seed: number): TrangThaiGame {
    let s = taoD()
    s.rng = taoRng([seed, 7, 0, 0]).layTrangThai()
    s.nhan_vat.hp = 825 // đầy HP và Nội tức (Căn cốt 50, Cảnh giới 0, 25 tuổi)
    s.nhan_vat.noi_tuc = 450
    s.cho = { loai: 'su_kien', ma: sk.ma, bien: {} }
    const kq = apDung(s, { loai: 'chon', ma_lua_chon: 'danh' }, dl)
    expect(kq.loi).toBeNull()
    s = kq.trang_thai
    expect(s.cho?.loai).toBe('tam_hiep')
    for (let i = 0; i < 12 && s.cho?.loai === 'tam_hiep'; i++) {
      const man = xemManHinh(s, dl)
      expect(man.tam_hiep?.lua_chon.length).toBeGreaterThan(0)
      const r = apDung(s, { loai: 'tam_hiep', buoc: man.tam_hiep!.lua_chon[0]!.buoc }, dl)
      expect(r.loi).toBeNull()
      s = r.trang_thai
    }
    return s
  }

  it('lệnh sai bước bị từ chối, trận giữ nguyên', () => {
    const s = taoD()
    s.cho = { loai: 'su_kien', ma: sk.ma, bien: {} }
    const trong = apDung(s, { loai: 'chon', ma_lua_chon: 'danh' }, dl).trang_thai
    const r = apDung(trong, { loai: 'tam_hiep', buoc: { loai: 'phan_dinh', ma: 'tuyet_sat' } }, dl)
    expect(r.loi).toBe('sai_buoc')
    expect(r.trang_thai).toBe(trong)
  })

  it('chơi trọn trận: kết thúc, áp đúng một nhánh, sự kiện được ghi nhận', () => {
    let thang = 0
    let thua = 0
    for (let seed = 1; seed <= 60; seed++) {
      const s = choiTrọn(seed)
      expect(s.cho?.loai === 'tam_hiep').toBe(false)
      const vb = s.bien_nien.map((x) => x.van_ban)
      const coThang = vb.includes('NHANH_THANG')
      const coThua = vb.includes('NHANH_THUA')
      expect(coThang && coThua).toBe(false)
      expect(coThang || coThua).toBe(true)
      expect(s.nhan_vat.su_kien_da_gap[sk.ma]).toBe(1)
      expect(s.cho).toBeNull()
      if (coThang) thang++
      else thua++
    }
    expect(thang).toBeGreaterThan(0)
    expect(thua).toBeGreaterThan(0)
  })
})
