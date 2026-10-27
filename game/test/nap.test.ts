import { describe, expect, it } from 'vitest'
import { napDuLieu } from '../src/du_lieu/nap'
import { napTuDia } from '../src/du_lieu/nap_node'

describe('nạp dữ liệu', () => {
  it('nạp bộ dữ liệu thật thành công', () => {
    const dl = napTuDia()
    expect(Object.keys(dl.vung)).toHaveLength(5)
    expect(dl.vung['giang_nam']?.he_so_ky_ngo).toBe(0.01)
    expect(Object.isFrozen(dl.vung['giang_nam'])).toBe(true)
  })

  it('file sai lược đồ làm napDuLieu ném lỗi có tên file', () => {
    const tep = { 'vung.json': [{ ma: 'x', ten: 'X', he_so_ky_ngo: 'abc' }] }
    expect(() => napDuLieu(tep)).toThrow(/vung\.json/)
  })

  it('ma trùng bị bắt', () => {
    const v = { ma: 'x', ten: 'X', nguon: 'HS01 I', he_so_ky_ngo: 0 }
    expect(() => napDuLieu({ 'vung.json': [v, v] })).toThrow(/trùng/)
  })

  it('đường dẫn lạ bị bắt', () => {
    expect(() => napDuLieu({ 'la.json': [] })).toThrow(/la\.json/)
  })

  it('dấu gạch dài bị bắt', () => {
    const v = { ma: 'x', ten: 'X — Y', nguon: 'HS01 I', he_so_ky_ngo: 0 }
    expect(() => napDuLieu({ 'vung.json': [v] })).toThrow(/gạch dài/)
  })
})
