import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { kiemTraNguNghia } from '../src/du_lieu/kiem_tra_ngu_nghia'
import { LuocDoSuKien, type DuLieu, type SuKien } from '../src/du_lieu/luoc_do'
import { napTuDia } from '../src/du_lieu/nap_node'

const dlGoc = napTuDia()
const THU_MUC_MAU = fileURLToPath(new URL('./mau_du_lieu', import.meta.url))

function docSuKienMau(tenTep: string): SuKien {
  const duongDan = join(THU_MUC_MAU, tenTep)
  const noiDung: unknown = JSON.parse(readFileSync(duongDan, 'utf8'))
  return LuocDoSuKien.parse(noiDung)
}

function taoDuLieuVoiSuKien(sk: SuKien): DuLieu {
  return {
    ...dlGoc,
    su_kien: { [sk.ma]: sk },
  }
}

describe('kiem_tra_ngu_nghia', () => {
  it('3 sự kiện mẫu đúng đều vượt qua kiểm tra không có lỗi', () => {
    const dsDung = ['dung_roll.json', 'dung_cong.json', 'dung_ngau_nhien.json']
    for (const tep of dsDung) {
      const sk = docSuKienMau(tep)
      const dl = taoDuLieuVoiSuKien(sk)
      const loi = kiemTraNguNghia(dl)
      expect(loi, `Sự kiện đúng ${tep} không được có lỗi`).toEqual([])
    }
  })

  it('sai_thieu_that_bai: bắt đúng lỗi thiếu nhánh that_bai', () => {
    const sk = docSuKienMau('sai_thieu_that_bai.json')
    const dl = taoDuLieuVoiSuKien(sk)
    const loi = kiemTraNguNghia(dl)
    expect(loi.some((msg) => msg.includes('thiếu nhánh that_bai'))).toBe(true)
  })

  it('sai_that_bai_rong: bắt đúng lỗi nhánh that_bai rỗng', () => {
    const sk = docSuKienMau('sai_that_bai_rong.json')
    const dl = taoDuLieuVoiSuKien(sk)
    const loi = kiemTraNguNghia(dl)
    expect(loi.some((msg) => msg.includes('nhánh that_bai rỗng không có hiệu ứng nào'))).toBe(true)
  })

  it('sai_tong_ti_le: bắt đúng lỗi tổng ti_le khác 100', () => {
    const sk = docSuKienMau('sai_tong_ti_le.json')
    const dl = taoDuLieuVoiSuKien(sk)
    const loi = kiemTraNguNghia(dl)
    expect(loi.some((msg) => msg.includes('tổng ti_le = 90; bắt buộc phải bằng 100'))).toBe(true)
  })

  it('sai_5_lua_chon: bắt đúng lỗi có 5 lựa chọn', () => {
    const sk = docSuKienMau('sai_5_lua_chon.json')
    const dl = taoDuLieuVoiSuKien(sk)
    const loi = kiemTraNguNghia(dl)
    expect(loi.some((msg) => msg.includes('5 lựa chọn; chỉ được từ 2 đến 4'))).toBe(true)
  })

  it('sai_em_dash: bắt đúng lỗi chứa dấu gạch dài', () => {
    const sk = docSuKienMau('sai_em_dash.json')
    const dl = taoDuLieuVoiSuKien(sk)
    const loi = kiemTraNguNghia(dl)
    expect(loi.some((msg) => msg.includes('chứa dấu gạch dài'))).toBe(true)
  })

  it('sai_cong_hiep_nghia: bắt đúng lỗi cong trên hiep_nghia', () => {
    const sk = docSuKienMau('sai_cong_hiep_nghia.json')
    const dl = taoDuLieuVoiSuKien(sk)
    const loi = kiemTraNguNghia(dl)
    expect(loi.some((msg) => msg.includes('cong không được dùng trên "hiep_nghia"'))).toBe(true)
  })
})
