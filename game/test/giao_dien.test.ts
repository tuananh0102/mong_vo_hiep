import { describe, expect, it } from 'vitest'
import { DU_LIEU } from '../src/du_lieu/nap_vite'
import { khoiTaoTroChoi, reducer, taoTrangThaiMacDinh, type BoNho } from '../src/giao_dien/dung_tro_choi'
import { datTranThu } from '../src/giao_dien/thu_tam_hiep'
import { xemManHinh, xemSuKien } from '../src/luat/xem'

/** M1-16: chạy màn Đầu thai + chọn Thiên phú đầu tiên, trả về bộ nhớ đang ở màn chơi. */
function taoKiep(seed = 7): BoNho {
  const s = taoTrangThaiMacDinh(seed)
  let boNho: BoNho = { trang_thai_dau: s, lenh: [], hien_tai: s, loi: null }
  boNho = reducer(boNho, { loai: 'tao_kiep', seed, gioi_tinh: 'nam', ten: '', uu_dai: [] })

  const chon = xemManHinh(boNho.hien_tai, DU_LIEU).thien_phu_chon
  expect(chon).toHaveLength(3)
  return reducer(boNho, { loai: 'chon_thien_phu', ma: chon[0]!.ma })
}

describe('giao_dien / dung_tro_choi', () => {
  it('khoiTaoTroChoi trả trạng thái rỗng để mở màn Đầu thai', () => {
    const boNho = khoiTaoTroChoi()
    expect(boNho.hien_tai.nhan_vat.ten).toBe('')
    expect(boNho.lenh).toEqual([])
    expect(boNho.loi).toBeNull()
  })

  it('đầu thai: tạo kiếp rồi chọn Thiên phú mới vào màn chơi', () => {
    const s = taoTrangThaiMacDinh(7)
    let boNho: BoNho = { trang_thai_dau: s, lenh: [], hien_tai: s, loi: null }
    expect(xemManHinh(boNho.hien_tai, DU_LIEU).man).toBe('dau_thai')

    boNho = reducer(boNho, { loai: 'tao_kiep', seed: 7, gioi_tinh: 'nu', ten: '', uu_dai: [] })
    expect(boNho.loi).toBeNull()
    expect(xemManHinh(boNho.hien_tai, DU_LIEU).man).toBe('chon_thien_phu')
    expect(boNho.hien_tai.nhan_vat.gioi_tinh).toBe('nu')

    const chon = xemManHinh(boNho.hien_tai, DU_LIEU).thien_phu_chon
    expect(new Set(chon.map((t) => t.ma)).size).toBe(3)

    boNho = reducer(boNho, { loai: 'chon_thien_phu', ma: chon[0]!.ma })
    expect(boNho.loi).toBeNull()
    const manHinh = xemManHinh(boNho.hien_tai, DU_LIEU)
    expect(manHinh.man).toBe('choi')
    expect(manHinh.ten.length).toBeGreaterThan(0)
    expect(manHinh.tuoi).toBe(0)
    expect(manHinh.ap).toBe(2)
  })

  it('reducer xử lý lệnh qua_nam tăng tuổi và ghi lại danh sách lệnh', () => {
    const s0 = taoKiep()
    const s1 = reducer(s0, { loai: 'qua_nam' })

    expect(s1.hien_tai.nhan_vat.tuoi).toBe(1)
    expect(s1.lenh.at(-1)).toEqual({ loai: 'qua_nam' })
    expect(s1.loi).toBeNull()
    expect(s1.hien_tai.bien_nien.length).toBeGreaterThan(s0.hien_tai.bien_nien.length)

    // Tuổi 1 có Lễ Thôi Nôi (M1-14) chặn qua_nam: chọn lựa chọn mở đầu tiên rồi mới qua năm.
    expect(s1.hien_tai.cho?.loai).toBe('su_kien')
    const ma = xemSuKien(s1.hien_tai, DU_LIEU)!.lua_chon.find((c) => !c.bi_khoa)!.ma
    const s1b = reducer(s1, { loai: 'chon', ma_lua_chon: ma })
    expect(s1b.hien_tai.cho).toBeNull()
    const s2 = reducer(s1b, { loai: 'qua_nam' })
    expect(s2.hien_tai.nhan_vat.tuoi).toBe(2)
    expect(s2.lenh.filter((l) => l.loai === 'qua_nam')).toHaveLength(2)
  })

  it('trận Tam Hiệp thử: chơi đủ 3 hiệp qua reducer, xong thì ghi Biên Niên Sử', () => {
    const s = datTranThu(taoTrangThaiMacDinh(5))
    let boNho: BoNho = { trang_thai_dau: s, lenh: [], hien_tai: s, loi: null }
    const hiepDaThay = new Set<number>()
    for (let i = 0; i < 12 && boNho.hien_tai.cho?.loai === 'tam_hiep'; i++) {
      const tran = xemManHinh(boNho.hien_tai, DU_LIEU).tam_hiep!
      hiepDaThay.add(tran.hiep)
      expect(tran.lua_chon.length).toBeGreaterThan(0)
      boNho = reducer(boNho, { loai: 'tam_hiep', buoc: tran.lua_chon[0]!.buoc })
      expect(boNho.loi).toBeNull()
    }
    expect([...hiepDaThay].sort()).toEqual([1, 2, 3])
    expect(boNho.hien_tai.cho).toBeNull()
    expect(boNho.hien_tai.bien_nien.some((d) => d.loai_hien_thi === 'giao-chien')).toBe(true)
  })

  it('reducer từ chối lệnh không hợp lệ và báo lỗi', () => {
    const s0 = taoKiep()
    // Lệnh chon không hợp lệ khi không có quyết định chờ
    const s1 = reducer(s0, { loai: 'chon', ma_lua_chon: 'a' })

    expect(s1.loi).toBe('khong_co_quyet_dinh_cho')
    expect(s1.hien_tai).toBe(s0.hien_tai)
  })
})
