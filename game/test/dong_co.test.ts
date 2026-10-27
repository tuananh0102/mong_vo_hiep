import { describe, expect, it } from 'vitest'
import { napTuDia } from '../src/du_lieu/nap_node'
import { taoTrangThaiRong } from '../src/luat/chi_so'
import { apDung } from '../src/luat/dong_co'
import type { TrangThaiGame } from '../src/luat/kieu'
import { xemSuKien } from '../src/luat/xem'

const dl = napTuDia()

function dongBangSau<T>(v: T): T {
  if (v && typeof v === 'object' && !Object.isFrozen(v)) {
    Object.freeze(v)
    for (const x of Object.values(v)) dongBangSau(x)
  }
  return v
}

describe('dong_co (apDung)', () => {
  it('apDung không sửa object đầu vào (đóng băng sâu đầu vào)', () => {
    const s = taoTrangThaiRong(42)
    s.nhan_vat.ten = 'Trương Vô Kỵ'
    dongBangSau(s)

    // apDung không được làm văng lỗi đóng băng đối tượng đầu vào
    const res = apDung(s, { loai: 'qua_nam' }, dl)
    expect(res.loi).toBeNull()
    expect(res.trang_thai.nhan_vat.tuoi).toBe(1)
    expect(s.nhan_vat.tuoi).toBe(0) // trạng thái cũ không bị thay đổi
  })

  it('lệnh sai lúc đang cho trả loi và trạng thái cùng tham chiếu', () => {
    const s = taoTrangThaiRong(10)
    s.cho = { loai: 'su_kien', ma: 'thoi_noi', bien: {} }

    const res = apDung(s, { loai: 'qua_nam' }, dl)
    expect(res.loi).toBe('cho_su_kien')
    expect(res.trang_thai).toBe(s) // cùng tham chiếu đối tượng
    expect(res.dong_moi).toEqual([])
  })

  it('khi đã kết thúc, chỉ nhận lệnh tiep_tuc', () => {
    const s = taoTrangThaiRong(10)
    s.ket_thuc = { nguyen_nhan: 'thọ chung', tuoi: 80 }
    s.cho = { loai: 'chuyen_giai_doan', ma: 'van_bia' }

    const resSai = apDung(s, { loai: 'qua_nam' }, dl)
    expect(resSai.loi).toBe('da_ket_thuc')
    expect(resSai.trang_thai).toBe(s)

    const resDung = apDung(s, { loai: 'tiep_tuc' }, dl)
    expect(resDung.loi).toBeNull()
    expect(resDung.trang_thai.cho?.loai).toBe('chuyen_giai_doan')
  })

  it('lệnh qua_nam tăng tuổi và đặt lại AP', () => {
    let s = taoTrangThaiRong(1)
    expect(s.nhan_vat.tuoi).toBe(0)

    const res1 = apDung(s, { loai: 'qua_nam' }, dl)
    s = res1.trang_thai
    expect(s.nhan_vat.tuoi).toBe(1)
    expect(s.nhan_vat.ap_con_lai).toBe(2)
    expect(res1.dong_moi.length).toBeGreaterThan(0)
    expect(res1.dong_moi[0]?.van_ban).toBe('Năm 1 tuổi.')
  })

  it('replay 50 lệnh qua_nam từ cùng seed ra cùng trạng thái giống hệt', () => {
    const seed = 999
    let s1: TrangThaiGame = taoTrangThaiRong(seed)
    let s2: TrangThaiGame = taoTrangThaiRong(seed)

    // Sự kiện năm mới (M1-14) chặn qua_nam: giải bằng lựa chọn mở đầu tiên rồi qua năm tiếp.
    const giaiSuKien = (s: TrangThaiGame): TrangThaiGame => {
      while (s.cho?.loai === 'su_kien') {
        const mo = xemSuKien(s, dl)!.lua_chon.find((c) => !c.bi_khoa)!
        s = apDung(s, { loai: 'chon', ma_lua_chon: mo.ma }, dl).trang_thai
      }
      return s
    }
    for (let i = 0; i < 50; i++) {
      s1 = giaiSuKien(apDung(s1, { loai: 'qua_nam' }, dl).trang_thai)
      s2 = giaiSuKien(apDung(s2, { loai: 'qua_nam' }, dl).trang_thai)
    }

    expect(s1.nhan_vat.tuoi).toBe(50)
    expect(s2.nhan_vat.tuoi).toBe(50)
    expect(JSON.stringify(s1)).toBe(JSON.stringify(s2))
  })
})
