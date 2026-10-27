import { describe, expect, it } from 'vitest'
import { DU_LIEU } from '../src/du_lieu/nap_vite'
import { khoiTaoTroChoi, reducer, taoTrangThaiMacDinh, type BoNho } from '../src/giao_dien/dung_tro_choi'
import { datTranThu } from '../src/giao_dien/thu_tam_hiep'
import { xemManHinh } from '../src/luat/xem'

describe('giao_dien / dung_tro_choi', () => {
  it('khoiTaoTroChoi tạo trạng thái ban đầu tuổi 0', () => {
    const boNho = khoiTaoTroChoi()
    expect(boNho.hien_tai.nhan_vat.tuoi).toBe(0)
    expect(boNho.hien_tai.nhan_vat.ten).toBe('Lý Tiêu Dao')
    expect(boNho.lenh).toEqual([])
    expect(boNho.loi).toBeNull()
  })

  it('reducer xử lý lệnh qua_nam tăng tuổi và ghi lại danh sách lệnh', () => {
    const s0 = khoiTaoTroChoi()
    const s1 = reducer(s0, { loai: 'qua_nam' })

    expect(s1.hien_tai.nhan_vat.tuoi).toBe(1)
    expect(s1.lenh).toEqual([{ loai: 'qua_nam' }])
    expect(s1.loi).toBeNull()
    expect(s1.hien_tai.bien_nien.length).toBeGreaterThan(s0.hien_tai.bien_nien.length)

    const s2 = reducer(s1, { loai: 'qua_nam' })
    expect(s2.hien_tai.nhan_vat.tuoi).toBe(2)
    expect(s2.lenh.length).toBe(2)
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
    const s0 = khoiTaoTroChoi()
    // Lệnh chon không hợp lệ khi không có quyết định chờ
    const s1 = reducer(s0, { loai: 'chon', ma_lua_chon: 'a' })

    expect(s1.loi).toBe('khong_co_quyet_dinh_cho')
    expect(s1.hien_tai).toBe(s0.hien_tai)
  })
})
