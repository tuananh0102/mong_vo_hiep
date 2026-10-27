import { describe, expect, it } from 'vitest'
import { napDuLieu } from '../src/du_lieu/nap'
import { docTepDia } from '../src/du_lieu/nap_node'
import type { BuocTamHiep } from '../src/luat/kieu'
import { rngTuSeed } from '../src/luat/rng'
import { tuChiSo } from '../src/luat/tam_hiep/toan'
import { apDungBuoc, taoTranDau, type CheDoTran, type TranDau } from '../src/luat/tam_hiep/tran'
import { quyetDauTuDong } from '../src/luat/tam_hiep/tu_dong'
import { xemTranDau } from '../src/luat/tam_hiep/xem_tran'

const dl = napDuLieu(docTepDia())

const trung = { can_cot: 60, ngo_tinh: 60, canh_gioi: 5, tuoi: 30, tier: 2, cap_vo: 5 }
const A = tuChiSo({ ...trung, he: 'duong', khinh_cong: 2 })
const B = tuChiSo({ ...trung, he: 'am', ban_menh: 'ta_ac' })

/** Chơi tới hết trận, luôn chọn lựa chọn đầu tiên (trừ `chonHuong` cho bước đầu). */
function choiHet(t0: TranDau, seed: number, chon: (t: TranDau) => BuocTamHiep): TranDau {
  const rng = rngTuSeed(seed)
  let t = t0
  for (let i = 0; i < 10 && t.buoc !== 'xong'; i++) {
    const kq = apDungBuoc(t, chon(t), rng)
    expect(kq.loi).toBeNull()
    t = kq.tran
  }
  return t
}

const dauTien = (t: TranDau): BuocTamHiep => xemTranDau(t, dl).lua_chon[0]!.buoc

describe('Tam Hiệp tương tác: khớp quyetDauTuDong', () => {
  it('cùng seed và ép Tiên Hạ Thủ cho cùng kết quả (300 trận)', () => {
    for (let seed = 1; seed <= 300; seed++) {
      const t = choiHet(taoTranDau({ a: A, b: B, che_do: 'sinh_tu' }), seed, (x) =>
        x.buoc === 'chon_huong'
          ? { loai: 'huong', huong: 'tien_ha_thu' }
          : x.buoc === 'phan_dinh' && x.ben_ap_dao === null
            ? { loai: 'phan_dinh', ma: 'lieu_mang' }
            : dauTien(x),
      )
      const tuDong = quyetDauTuDong(A, B, rngTuSeed(seed), 'T')
      const thangA = (t.ket_qua?.nguoi_thang ?? t.ben_ap_dao) === 'a'
      expect(thangA, `seed ${seed}`).toBe(tuDong.thang)
      expect(t.ko_som).toBe(tuDong.ko_som)
      expect(t.bat_phan).toBe(tuDong.bat_phan)
    }
  })
})

describe('Tam Hiệp tương tác: bước và lựa chọn', () => {
  it('không lệnh sai bước nào được nhận, trận giữ nguyên', () => {
    const t = taoTranDau({ a: A, b: B, che_do: 'sinh_tu', kim_sang_duoc: 1 })
    const rng = rngTuSeed(5)
    const sai: BuocTamHiep[] = [
      { loai: 'bo_qua' },
      { loai: 'vat_pham', ma: 'kim_sang_duoc' },
      { loai: 'chieu', ma: 'chinh' },
      { loai: 'phan_dinh', ma: 'tuyet_sat' },
    ]
    for (const b of sai) {
      const kq = apDungBuoc(t, b, rng)
      expect(kq.loi, JSON.stringify(b)).toBe('sai_buoc')
      expect(kq.tran).toBe(t)
    }
    // Sau Hiệp 1 (còn Kim Sáng Dược) chỉ nhận vật phẩm / bỏ qua
    let g = apDungBuoc(t, { loai: 'huong', huong: 'than_phap' }, rngTuSeed(9)).tran
    if (g.buoc === 'xong') g = apDungBuoc(taoTranDau({ a: A, b: B, che_do: 'ty_thi', kim_sang_duoc: 1 }), { loai: 'huong', huong: 'an_binh' }, rngTuSeed(2)).tran
    expect(g.buoc).toBe('giua_hiep')
    expect(apDungBuoc(g, { loai: 'huong', huong: 'an_binh' }, rng).loi).toBe('sai_buoc')
    expect(apDungBuoc(g, { loai: 'chieu', ma: 'chinh' }, rng).loi).toBe('sai_buoc')
  })

  it('trận xong không nhận thêm bước', () => {
    const t = choiHet(taoTranDau({ a: A, b: B, che_do: 'ty_thi' }), 3, dauTien)
    expect(t.buoc).toBe('xong')
    expect(apDungBuoc(t, { loai: 'bo_qua' }, rngTuSeed(1)).loi).toBe('tran_da_xong')
  })

  it('Kim Sáng Dược hồi 30% HP tối đa, tiêu 1 viên, không vượt HP tối đa', () => {
    const yeu = { ...A, hp: A.hp_max * 0.5 }
    for (let seed = 1; seed < 50; seed++) {
      const t = apDungBuoc(
        taoTranDau({ a: yeu, b: B, che_do: 'sinh_tu', kim_sang_duoc: 1 }),
        { loai: 'huong', huong: 'tien_ha_thu' },
        rngTuSeed(seed),
      ).tran
      if (t.buoc !== 'giua_hiep') continue
      const truoc = t.a.hp
      const sau = apDungBuoc(t, { loai: 'vat_pham', ma: 'kim_sang_duoc' }, rngTuSeed(1)).tran
      expect(sau.a.hp).toBeCloseTo(Math.min(A.hp_max, truoc + 0.3 * A.hp_max), 9)
      expect(sau.kim_sang_duoc).toBe(0)
      expect(sau.da_dung_vat_pham).toEqual(['kim_sang_duoc'])
      expect(sau.buoc).toBe('chon_chieu')
      return
    }
    throw new Error('không gặp trận nào còn tới giữa Hiệp 1 và 2')
  })

  it('Hiệp 3 chỉ hiện lựa chọn hợp lệ theo thế trận và chế độ', () => {
    const gom = (cheDo: CheDoTran): Map<string, Set<string>> => {
      const m = new Map<string, Set<string>>()
      for (let seed = 1; seed <= 400; seed++) {
        let t = taoTranDau({ a: A, b: B, che_do: cheDo })
        const rng = rngTuSeed(seed)
        for (let i = 0; i < 6 && t.buoc !== 'phan_dinh' && t.buoc !== 'xong'; i++) {
          t = apDungBuoc(t, t.buoc === 'chon_huong' ? { loai: 'huong', huong: 'an_binh' } : dauTien(t), rng).tran
        }
        if (t.buoc !== 'phan_dinh') continue
        const the = t.ben_ap_dao ?? 'bat_phan'
        const ds = m.get(the) ?? new Set<string>()
        for (const l of xemTranDau(t, dl).lua_chon) ds.add(l.buoc.loai === 'phan_dinh' ? l.buoc.ma : '?')
        m.set(the, ds)
      }
      return m
    }
    const sinh = gom('sinh_tu')
    if (sinh.has('a')) expect([...sinh.get('a')!].sort()).toEqual(['phe_vo_cong', 'thu_kiem', 'tuyet_sat'])
    if (sinh.has('b')) expect([...sinh.get('b')!].sort()).toEqual(['bo_chay', 'dau_hang', 'nhay_vuc'])
    if (sinh.has('bat_phan')) expect([...sinh.get('bat_phan')!].sort()).toEqual(['hoa', 'lieu_mang'])
    const ty = gom('ty_thi')
    // Tỷ thí không có Tuyệt sát, Phế võ công, Bỏ chạy, Nhảy vực
    for (const ds of ty.values()) {
      for (const cam of ['tuyet_sat', 'phe_vo_cong', 'bo_chay', 'nhay_vuc']) expect(ds.has(cam)).toBe(false)
    }
    expect(sinh.size + ty.size).toBeGreaterThan(0)
  })

  it('lựa chọn Hiệp 3 không thuộc thế trận bị từ chối', () => {
    for (let seed = 1; seed <= 400; seed++) {
      let t = taoTranDau({ a: A, b: B, che_do: 'sinh_tu' })
      const rng = rngTuSeed(seed)
      for (let i = 0; i < 6 && t.buoc !== 'phan_dinh' && t.buoc !== 'xong'; i++) {
        t = apDungBuoc(t, t.buoc === 'chon_huong' ? { loai: 'huong', huong: 'than_phap' } : dauTien(t), rng).tran
      }
      if (t.buoc !== 'phan_dinh') continue
      const kq = apDungBuoc(t, { loai: 'phan_dinh', ma: t.ben_ap_dao === 'a' ? 'dau_hang' : 'tuyet_sat' }, rng)
      expect(kq.loi).toBe('lua_chon_khong_hop_le')
      return
    }
  })

  it('xemTranDau: phần trăm, nhật ký là câu văn, độ khó Án Binh', () => {
    const t0 = taoTranDau({ a: A, b: B, che_do: 'sinh_tu' })
    const v0 = xemTranDau(t0, dl, 'Lão Ma')
    expect(v0.hiep).toBe(1)
    expect(v0.a).toEqual({ hp_pct: 100, mp_pct: 100 })
    expect(v0.lua_chon.map((l) => l.nhan)).toEqual([
      'Tiên Hạ Thủ Vi Cường - tấn công dồn dập',
      'Án Binh Bất Động - quan sát chiêu lộ',
      'Thân Pháp Quỷ Mị - du đấu tiêu hao',
    ])
    expect(v0.lua_chon[1]!.do_kho).toBe('kha')
    const t1 = apDungBuoc(t0, { loai: 'huong', huong: 'tien_ha_thu' }, rngTuSeed(4)).tran
    const v1 = xemTranDau(t1, dl, 'Lão Ma')
    expect(v1.nhat_ky.length).toBeGreaterThan(0)
    for (const dong of v1.nhat_ky) {
      expect(dong).not.toMatch(/[{}]|^nhat_ky|^ben\./)
    }
    expect(v1.nhat_ky.join(' ')).toContain('Lão Ma')
    expect(v1.a.hp_pct).toBeLessThanOrEqual(100)
  })

  it('bỏ chạy ghi kết quả Roll, Đầu hàng thua', () => {
    for (let seed = 1; seed <= 600; seed++) {
      const yeu = tuChiSo({ can_cot: 50, ngo_tinh: 50, canh_gioi: 2, tuoi: 18, tier: 1, cap_vo: 3 })
      let t = taoTranDau({ a: yeu, b: B, che_do: 'sinh_tu' })
      const rng = rngTuSeed(seed)
      for (let i = 0; i < 6 && t.buoc !== 'phan_dinh' && t.buoc !== 'xong'; i++) {
        t = apDungBuoc(t, t.buoc === 'chon_huong' ? { loai: 'huong', huong: 'than_phap' } : dauTien(t), rng).tran
      }
      if (t.buoc !== 'phan_dinh' || t.ben_ap_dao !== 'b') continue
      const chay = apDungBuoc(t, { loai: 'phan_dinh', ma: 'bo_chay' }, rng).tran.ket_qua!
      expect(typeof chay.thoat).toBe('boolean')
      expect(chay.nguoi_thang).toBe(chay.thoat ? null : 'b')
      const hang = apDungBuoc(t, { loai: 'phan_dinh', ma: 'dau_hang' }, rng).tran.ket_qua!
      expect(hang.nguoi_thang).toBe('b')
      return
    }
    throw new Error('không gặp thế Thất thế')
  })
})
