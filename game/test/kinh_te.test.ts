import { describe, expect, it } from 'vitest'
import { napDuLieu } from '../src/du_lieu/nap'
import { docTepDia } from '../src/du_lieu/nap_node'
import { taoNhanVatRong } from '../src/luat/chi_so'
import { hpMax } from '../src/luat/cong_thuc'
import { apDung } from '../src/luat/dong_co'
import type { TrangThaiGame } from '../src/luat/kieu'
import {
  apTieu,
  chi,
  chiSinhHoat,
  hetKhangHanTam,
  CHU_NO_TIEU_CUC,
  sinhHoatPhi,
  thu,
  thuNhapGiaDinh,
  xuLyNo,
} from '../src/luat/kinh_te'
import { rngTuSeed, taoRng, type Rng } from '../src/luat/rng'
import { ketThucTran } from '../src/luat/tam_hiep/hau_qua'
import { tuChiSo } from '../src/luat/tam_hiep/toan'
import { taoTranDau } from '../src/luat/tam_hiep/tran'
import { quaNam } from '../src/luat/vong_nam'
import { hocVoHoc } from '../src/luat/vo_hoc'

const dl = napDuLieu(docTepDia())

function taoD(mo: Partial<ReturnType<typeof taoNhanVatRong>> = {}): TrangThaiGame {
  return {
    phien_ban: 1,
    seed: 1,
    rng: taoRng([1, 0, 0, 0]).layTrangThai(),
    nam_the_gioi: 0,
    nhan_vat: { ...taoNhanVatRong(), tuoi: 20, can_cot: 60, ngo_tinh: 60, phuc_duyen: 50, ap_con_lai: 3, ...mo },
    the_gioi: { npc: {} },
    cho: null,
    hang_doi_su_kien: [],
    lich_hen: [],
    bien_nien: [],
    ket_thuc: null,
    dong_toc: { doi_truoc: [] },
  }
}

/** RNG theo kịch bản: `so()` lấy lần lượt từ danh sách (hết thì dùng giá trị cuối). */
function rngKichBan(...v: number[]): Rng {
  let i = 0
  const lay = (): number => v[Math.min(i++, v.length - 1)]!
  return {
    so: lay,
    nguyen: (a, b) => a + Math.floor(lay() * (b - a + 1)),
    trung: (p) => lay() < p,
    layTrangThai: () => [0, 0, 0, 0],
  }
}

describe('thu và chi (HS06 II.3)', () => {
  it('không có Nợ: nhận đủ', () => {
    const d = taoD()
    const kq = thu(d, 100, 'Thử')
    expect(kq).toMatchObject({ nhan: 100, tra_no: 0 })
    expect(d.nhan_vat.ngan_luong).toBe(100)
  })

  it('có Nợ: chủ nợ thu trước 50%', () => {
    const d = taoD({ no: { chu_a: { goc: 500, nam_vay: 18 } } })
    const kq = thu(d, 100, 'Thử')
    expect(kq).toMatchObject({ nhan: 50, tra_no: 50 })
    expect(d.nhan_vat.ngan_luong).toBe(50)
    expect(d.nhan_vat.no['chu_a']?.goc).toBe(450)
  })

  it('Nợ nhỏ hơn 50% khoản thu: chỉ trả đúng số Nợ và xóa khoản Nợ', () => {
    const d = taoD({ no: { chu_a: { goc: 10, nam_vay: 18 } } })
    thu(d, 100, 'Thử')
    expect(d.nhan_vat.ngan_luong).toBe(90)
    expect(d.nhan_vat.no['chu_a']).toBeUndefined()
  })

  it('chi đủ tiền thì trừ, không ghi Nợ', () => {
    const d = taoD({ ngan_luong: 100 })
    expect(chi(d, 60, 'chu_a')).toEqual({ tra: 60, no_them: 0 })
    expect(d.nhan_vat.ngan_luong).toBe(40)
    expect(d.nhan_vat.no).toEqual({})
  })

  it('chi thiếu tiền: phần thiếu thành Nợ đúng chủ, giữ năm vay cũ', () => {
    const d = taoD({ ngan_luong: 30, tuoi: 20 })
    expect(chi(d, 100, 'chu_a')).toEqual({ tra: 30, no_them: 70 })
    expect(d.nhan_vat.ngan_luong).toBe(0)
    expect(d.nhan_vat.no['chu_a']).toEqual({ goc: 70, nam_vay: 20 })
    d.nhan_vat.tuoi = 22
    chi(d, 10, 'chu_a')
    expect(d.nhan_vat.no['chu_a']).toEqual({ goc: 80, nam_vay: 20 })
  })
})

describe('Vòng năm: thu nhập, sinh hoạt phí, Nợ', () => {
  it('thu nhập gia đình đến 15 tuổi theo gia cảnh, hết 15 thì dừng', () => {
    const d = taoD({ tuoi: 15, gia_canh: 'phu_thuong' })
    thuNhapGiaDinh(d, dl)
    expect(d.nhan_vat.ngan_luong).toBe(50)
    d.nhan_vat.tuoi = 16
    thuNhapGiaDinh(d, dl)
    expect(d.nhan_vat.ngan_luong).toBe(50)
  })

  it('thu nhập gia đình bị chủ nợ thu 50%, và cờ gia_dao_suy_vi cắt khoản này', () => {
    const d = taoD({ tuoi: 10, gia_canh: 'phu_thuong', no: { chu_a: { goc: 100, nam_vay: 5 } } })
    thuNhapGiaDinh(d, dl)
    expect(d.nhan_vat.ngan_luong).toBe(25)
    d.nhan_vat.co_su_kien['gia_dao_suy_vi'] = true
    thuNhapGiaDinh(d, dl)
    expect(d.nhan_vat.ngan_luong).toBe(25)
  })

  it('sinh hoạt phí theo Danh vọng: 10 / 50 / 150 / 300', () => {
    const phi = (dv: number): number => sinhHoatPhi(taoD({ danh_vong: dv }))
    expect([phi(0), phi(99), phi(100), phi(399), phi(400), phi(699), phi(700), phi(1000)]).toEqual([
      10, 10, 50, 50, 150, 150, 300, 300,
    ])
  })

  it('còn ở môn phái: sinh hoạt phí tối đa 50; Chưởng môn cũng vậy', () => {
    const d = taoD({ danh_vong: 800 })
    d.nhan_vat.mon_phai = { ma: 'thieu_lam', bac: 2, cong_hien: 0, tu_tuoi: 12 }
    expect(sinhHoatPhi(d)).toBe(50)
    d.nhan_vat.danh_vong = 50 // Danh vọng thấp: vẫn theo bảng (10), không bị nâng lên 50
    expect(sinhHoatPhi(d)).toBe(10)
  })

  it('dưới 16 tuổi không bị trừ; từ 16 tuổi thiếu tiền thì ghi Nợ', () => {
    const d = taoD({ tuoi: 15, danh_vong: 150 })
    chiSinhHoat(d)
    expect(d.nhan_vat.no).toEqual({})
    d.nhan_vat.tuoi = 16
    d.nhan_vat.ngan_luong = 20
    chiSinhHoat(d)
    expect(d.nhan_vat.ngan_luong).toBe(0)
    expect(d.nhan_vat.no['chu_tro']).toEqual({ goc: 30, nam_vay: 16 })
  })

  it('lãi Nợ 20% mỗi năm, khoản vay trong chính năm nay chưa tính lãi', () => {
    const d = taoD({ tuoi: 20, no: { chu_a: { goc: 100, nam_vay: 19 }, chu_b: { goc: 100, nam_vay: 20 } } })
    xuLyNo(d, rngKichBan(0), dl)
    expect(d.nhan_vat.no['chu_a']?.goc).toBe(120)
    expect(d.nhan_vat.no['chu_b']?.goc).toBe(100)
  })

  it('quá hạn 3 năm: đòi nợ, thua mất 30% HP và Thanh danh -30; thắng thì không mất', () => {
    const mo = { tuoi: 23, thanh_danh: 100, no: { chu_a: { goc: 100, nam_vay: 20 } } }
    const thua = taoD(mo)
    thua.nhan_vat.hp = hpMax(thua.nhan_vat, dl)
    const hp0 = thua.nhan_vat.hp
    xuLyNo(thua, rngKichBan(0.999), dl)
    expect(thua.nhan_vat.thanh_danh).toBe(70)
    expect(thua.nhan_vat.hp).toBe(hp0 - Math.round(hp0 * 0.3))

    const thang = taoD(mo)
    thang.nhan_vat.hp = hp0
    xuLyNo(thang, rngKichBan(0), dl)
    expect(thang.nhan_vat.thanh_danh).toBe(100)
    expect(thang.nhan_vat.hp).toBe(hp0)
  })

  it('chưa quá 3 năm: không đòi nợ', () => {
    const d = taoD({ tuoi: 22, thanh_danh: 100, no: { chu_a: { goc: 100, nam_vay: 20 } } })
    xuLyNo(d, rngKichBan(0.999), dl)
    expect(d.nhan_vat.thanh_danh).toBe(100)
  })

  it('quá hạn 5 năm: báo quan, Thanh danh -100 một lần', () => {
    const d = taoD({ tuoi: 25, thanh_danh: 300, no: { chu_a: { goc: 100, nam_vay: 20 } } })
    xuLyNo(d, rngKichBan(0), dl) // thắng đòi nợ, chỉ còn báo quan
    expect(d.nhan_vat.thanh_danh).toBe(200)
    d.nhan_vat.tuoi = 26
    xuLyNo(d, rngKichBan(0), dl)
    expect(d.nhan_vat.thanh_danh).toBe(200)
  })

  it('qua năm thật: Danh vọng thấp 16+ tuổi trả 10 lạng và thu nhập đi qua bước 3 - 4', () => {
    const d = taoD({ tuoi: 17, gia_canh: 'binh_dan', ngan_luong: 100, danh_vong: 0 })
    const s0 = structuredClone(d)
    quaNam(s0, rngTuSeed(3), dl)
    expect(s0.nhan_vat.ngan_luong).toBe(90)
  })
})

describe('Áp Tiêu (HS06 II.1)', () => {
  it('không gặp cướp: nhận thù lao', () => {
    const d = taoD({ ngan_luong: 0 })
    apTieu(d, rngKichBan(0, 0.9), dl) // 100 lạng, p_cuop không trúng
    expect(d.nhan_vat.ngan_luong).toBe(100)
  })

  it('gặp cướp và thắng: giữ thù lao, Danh vọng +20', () => {
    const d = taoD()
    apTieu(d, rngKichBan(0.5, 0.1, 0), dl)
    expect(d.nhan_vat.ngan_luong).toBe(200) // nguyen(100, 300) với 0.5
    expect(d.nhan_vat.danh_vong).toBe(20)
  })

  it('gặp cướp và thua: không thù lao, đền gấp đôi, thiếu thì ghi Nợ tiêu cục', () => {
    const d = taoD({ ngan_luong: 50 })
    // nguyen(100, 300) với so = 0 -> 100; đền 200, có 50 -> nợ 150
    apTieu(d, rngKichBan(0, 0.1, 0.999), dl)
    expect(d.nhan_vat.ngan_luong).toBe(0)
    expect(d.nhan_vat.no[CHU_NO_TIEU_CUC]?.goc).toBe(150)
  })

  it('đủ tiền thì đền thẳng, không Nợ', () => {
    const d = taoD({ ngan_luong: 500 })
    apTieu(d, rngKichBan(0, 0.1, 0.999), dl)
    expect(d.nhan_vat.ngan_luong).toBe(300)
    expect(d.nhan_vat.no).toEqual({})
  })

  it('Cổng Căn cốt >= 50 qua lệnh thật', () => {
    const d = taoD({ can_cot: 40 })
    expect(apDung(d, { loai: 'hanh_dong', ma: 'ap_tieu' }, dl).loi).toBe('khong_du_dieu_kien')
  })
})

describe('Nghỉ trọ (HS06 II.2)', () => {
  it('trừ 20 lạng và hồi đầy HP / Nội tức; thiếu tiền bị từ chối và không mất AP', () => {
    const d = taoD({ ngan_luong: 25, hp: 1, noi_tuc: 0 })
    const kq = apDung(d, { loai: 'hanh_dong', ma: 'tri_thuong' }, dl)
    expect(kq.loi).toBeNull()
    expect(kq.trang_thai.nhan_vat.ngan_luong).toBe(5)
    expect(kq.trang_thai.nhan_vat.hp).toBe(hpMax(kq.trang_thai.nhan_vat, dl))
    expect(kq.trang_thai.nhan_vat.noi_tuc).toBeGreaterThan(0)

    const ngheo = apDung(taoD({ ngan_luong: 19 }), { loai: 'hanh_dong', ma: 'tri_thuong' }, dl)
    expect(ngheo.loi).toBe('khong_du_ngan_luong')
  })
})

describe('Chợ và đan dược (HS06 III)', () => {
  it('mua: trừ tiền, thêm vào hành trang; không bán ở chợ / thiếu tiền thì từ chối', () => {
    const d = taoD({ ngan_luong: 100 })
    const kq = apDung(d, { loai: 'mua', ma: 'kim_sang_duoc', so_luong: 3 }, dl)
    expect(kq.loi).toBeNull()
    expect(kq.trang_thai.nhan_vat.ngan_luong).toBe(55)
    expect(kq.trang_thai.nhan_vat.hanh_trang['kim_sang_duoc']).toBe(3)
    expect(apDung(d, { loai: 'mua', ma: 'kim_sang_duoc', so_luong: 7 }, dl).loi).toBe('khong_du_ngan_luong')
    expect(apDung(taoD({ ngan_luong: 9999 }), { loai: 'mua', ma: 'dai_hoan_dan', so_luong: 1 }, dl).loi).toBe(
      'khong_ban_o_cho',
    )
    expect(apDung(d, { loai: 'mua', ma: 'kim_sang_duoc', so_luong: 0 }, dl).loi).toBe('so_luong_khong_hop_le')
  })

  it('mua không tốn AP', () => {
    const d = taoD({ ngan_luong: 100, ap_con_lai: 2 })
    expect(apDung(d, { loai: 'mua', ma: 'kim_sang_duoc', so_luong: 1 }, dl).trang_thai.nhan_vat.ap_con_lai).toBe(2)
  })

  it('Kim Sáng Dược hồi 30% HP, mất 1 viên, không xóa Trọng thương', () => {
    const d = taoD({ hanh_trang: { kim_sang_duoc: 2 }, trong_thuong: true })
    d.nhan_vat.hp = 10
    const kq = apDung(d, { loai: 'dung_vat_pham', ma: 'kim_sang_duoc' }, dl)
    expect(kq.loi).toBeNull()
    expect(kq.trang_thai.nhan_vat.hp).toBeGreaterThan(10)
    expect(kq.trang_thai.nhan_vat.hanh_trang['kim_sang_duoc']).toBe(1)
    expect(kq.trang_thai.nhan_vat.trong_thuong).toBe(true)
  })

  it('thuốc trị nội thương (>= 350 lạng, hồi HP) xóa Trọng thương: cuối năm không còn dưỡng thương', () => {
    const d = taoD({ hanh_trang: { bach_van_hung_dam_hoan: 1 }, trong_thuong: true })
    d.nhan_vat.hp = 10
    const kq = apDung(d, { loai: 'dung_vat_pham', ma: 'bach_van_hung_dam_hoan' }, dl)
    expect(kq.trang_thai.nhan_vat.trong_thuong).toBe(false)
    expect(kq.trang_thai.nhan_vat.am_thuong).toBe(0)
  })

  it('Kháng Thuốc: Tiểu Hoàn Đan lần 1 / 2 / 3 cho Nội tức tối đa +100 / +50 / +0', () => {
    let s = taoD({ hanh_trang: { tieu_hoan_dan: 3 } })
    const them: number[] = []
    for (let i = 0; i < 3; i++) {
      const truoc = s.nhan_vat.noi_tuc_cong_them
      const kq = apDung(s, { loai: 'dung_vat_pham', ma: 'tieu_hoan_dan' }, dl)
      expect(kq.loi).toBeNull()
      s = kq.trang_thai
      them.push(s.nhan_vat.noi_tuc_cong_them - truoc)
    }
    expect(them).toEqual([100, 50, 0])
    expect(s.nhan_vat.hanh_trang['tieu_hoan_dan']).toBeUndefined()
  })

  it('Kháng Thuốc cũng áp cho Căn cốt: +2 / +1 / +0', () => {
    let s = taoD({ hanh_trang: { tieu_hoan_dan: 3 }, can_cot: 40 })
    const cc: number[] = []
    for (let i = 0; i < 3; i++) {
      s = apDung(s, { loai: 'dung_vat_pham', ma: 'tieu_hoan_dan' }, dl).trang_thai
      cc.push(s.nhan_vat.can_cot)
    }
    expect(cc).toEqual([42, 43, 43])
  })

  it('Đại Hoàn Đan: xóa Ám thương; vật phẩm không có hoặc không dùng được thì từ chối', () => {
    const d = taoD({ hanh_trang: { dai_hoan_dan: 1, thien_vuong_bao_tam_dan: 1 }, am_thuong: 15 })
    expect(apDung(d, { loai: 'dung_vat_pham', ma: 'dai_hoan_dan' }, dl).trang_thai.nhan_vat.am_thuong).toBe(0)
    expect(apDung(d, { loai: 'dung_vat_pham', ma: 'tieu_hoan_dan' }, dl).loi).toBe('khong_co_vat_pham')
    expect(apDung(d, { loai: 'dung_vat_pham', ma: 'thien_vuong_bao_tam_dan' }, dl).loi).toBe('khong_dung_duoc')
  })

  it('Tục Mệnh Bát Hoàn kéo dài tuổi thọ tối đa +10', () => {
    const d = taoD({ hanh_trang: { tuc_menh_bat_hoan: 1 } })
    expect(apDung(d, { loai: 'dung_vat_pham', ma: 'tuc_menh_bat_hoan' }, dl).trang_thai.nhan_vat.tuoi_tho_cong_them).toBe(10)
  })

  it('hành động uong_dan_duoc (0 AP) gọi cùng luật', () => {
    const d = taoD({ hanh_trang: { kim_sang_duoc: 1 } })
    d.nhan_vat.hp = 5
    const kq = apDung(d, { loai: 'hanh_dong', ma: 'uong_dan_duoc', tham_so: { vat_pham: 'kim_sang_duoc' } }, dl)
    expect(kq.loi).toBeNull()
    expect(kq.trang_thai.nhan_vat.hp).toBeGreaterThan(5)
  })
})

describe('Kháng hàn tạm và hồi HP', () => {
  it('Bạch Hùng Đảm Hoàn +30 Kháng hàn, hết sau 10 năm', () => {
    const d = taoD({ tuoi: 30, hanh_trang: { bach_hung_dam_hoan: 1 } })
    const s = apDung(d, { loai: 'dung_vat_pham', ma: 'bach_hung_dam_hoan' }, dl).trang_thai
    expect(s.nhan_vat.khang_han).toBe(30)
    s.nhan_vat.tuoi = 39
    hetKhangHanTam(s)
    expect(s.nhan_vat.khang_han).toBe(30)
    s.nhan_vat.tuoi = 40
    hetKhangHanTam(s)
    expect(s.nhan_vat.khang_han).toBe(0)
  })

  it('Kim Sáng Dược hồi 30% theo HP tối đa thật (cảnh giới / tuổi)', () => {
    const d = taoD({ tuoi: 40, hanh_trang: { kim_sang_duoc: 1 } })
    d.nhan_vat.hp = 1
    const max = hpMax(d.nhan_vat, dl)
    const hp = apDung(d, { loai: 'dung_vat_pham', ma: 'kim_sang_duoc' }, dl).trang_thai.nhan_vat.hp
    expect(hp).toBe(1 + Math.round(max * 0.3))
  })
})

describe('Săn Tiền Thưởng (HS06 II.1)', () => {
  const VO_THUONG_THUA = 'long_trao_thu' // ngoại công Thượng thừa (tier 2)

  function coVo(): TrangThaiGame {
    const d = taoD({ tuoi: 25 })
    hocVoHoc(d, dl, VO_THUONG_THUA)
    return d
  }

  it('Cổng võ Thượng thừa: chưa có thì bị khóa và không mất AP', () => {
    const d = taoD({ tuoi: 25 })
    expect(apDung(d, { loai: 'hanh_dong', ma: 'san_tien_thuong', tham_so: { hang: 'yeu' } }, dl).loi).toBe(
      'khong_du_dieu_kien',
    )
  })

  it('mở Tam Hiệp sinh tử; hạng sai bị từ chối và hoàn AP', () => {
    const d = coVo()
    const sai = apDung(d, { loai: 'hanh_dong', ma: 'san_tien_thuong', tham_so: { hang: 'khung' } }, dl)
    expect(sai.loi).toBe('hang_khong_hop_le')
    expect(sai.trang_thai.nhan_vat.ap_con_lai).toBe(3)

    const kq = apDung(d, { loai: 'hanh_dong', ma: 'san_tien_thuong', tham_so: { hang: 'manh' } }, dl)
    expect(kq.loi).toBeNull()
    expect(kq.trang_thai.cho?.loai).toBe('tam_hiep')
    if (kq.trang_thai.cho?.loai !== 'tam_hiep') throw new Error('cần trận Tam Hiệp')
    expect(kq.trang_thai.cho.tran.che_do).toBe('sinh_tu')
    expect(kq.trang_thai.cho.tran.ngu_canh?.truy_na).toBe('manh')
    // hạng Mạnh cao hơn 1 cấp võ học
    expect(kq.trang_thai.cho.tran.b.vg.cap_vo).toBe(kq.trang_thai.cho.tran.a.vg.cap_vo + 1)
  })

  it('hạng Yếu: Căn cốt / Ngộ tính mục tiêu quanh 80% người chơi', () => {
    const d = coVo()
    const kq = apDung(d, { loai: 'hanh_dong', ma: 'san_tien_thuong', tham_so: { hang: 'yeu' } }, dl)
    if (kq.trang_thai.cho?.loai !== 'tam_hiep') throw new Error('cần trận Tam Hiệp')
    const { a, b } = kq.trang_thai.cho.tran
    expect(b.vg.can_cot).toBeGreaterThanOrEqual(a.vg.can_cot * 0.8 * 0.9)
    expect(b.vg.can_cot).toBeLessThanOrEqual(a.vg.can_cot * 0.8 * 1.1)
  })

  function ketTran(hang: string, nguoiThang: 'a' | 'b', luaChon: 'tuyet_sat' | 'ha_guc', d: TrangThaiGame): void {
    const tuong = tuChiSo({ can_cot: 50, ngo_tinh: 50, canh_gioi: 0, tuoi: 25, tier: 1, cap_vo: 1 })
    const tran = taoTranDau({
      a: { ...tuong, hp: 300, noi_tuc: 200 },
      b: tuong,
      che_do: 'sinh_tu',
      ngu_canh: {
        su_kien: '',
        lua_chon: '',
        doi_thu: 'toi_pham',
        hang: 'truong_lao',
        bien: { toi_pham: 'Tội phạm truy nã' },
        truy_na: hang,
      },
    })
    Object.assign(tran, { buoc: 'xong', hiep: 3, ket_qua: { nguoi_thang: nguoiThang, lua_chon: luaChon, ko: false } })
    d.cho = { loai: 'tam_hiep', tran }
    ketThucTran(d, rngTuSeed(7), dl)
  }

  it('thắng: nhận tiền thưởng đúng khoảng của hạng và Hiệp nghĩa +40', () => {
    for (const [hang, lo, hi] of [['yeu', 150, 400], ['ngang', 250, 800], ['manh', 600, 1500]] as const) {
      const d = taoD({ tuoi: 25 })
      ketTran(hang, 'a', 'tuyet_sat', d)
      expect(d.nhan_vat.ngan_luong).toBeGreaterThanOrEqual(lo)
      expect(d.nhan_vat.ngan_luong).toBeLessThanOrEqual(hi)
      expect(d.nhan_vat.hiep_nghia).toBe(40)
      expect(d.cho).toBeNull()
    }
  })

  it('tiền thưởng cũng bị chủ nợ thu 50%', () => {
    const d = taoD({ tuoi: 25, no: { chu_a: { goc: 10000, nam_vay: 24 } } })
    ketTran('yeu', 'a', 'tuyet_sat', d)
    expect(d.nhan_vat.ngan_luong).toBeGreaterThanOrEqual(75)
    expect(d.nhan_vat.ngan_luong).toBeLessThanOrEqual(200)
    expect(d.nhan_vat.no['chu_a']!.goc).toBeLessThan(10000)
  })

  it('thua: không tiền thưởng, không Hiệp nghĩa', () => {
    const d = taoD({ tuoi: 25 })
    ketTran('yeu', 'b', 'ha_guc', d)
    expect(d.nhan_vat.ngan_luong).toBe(0)
    expect(d.nhan_vat.hiep_nghia).toBe(0)
  })
})
