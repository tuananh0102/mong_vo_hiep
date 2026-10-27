// Đối chiếu vector sinh từ Python (mo_phong/xuat_vector.py) với TypeScript.
// M0-07: kiểm tra p_roll (đã có ở kiem_dinh.ts); các hàm phái sinh khác dùng it.todo (sẽ bật ở M1-04).
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { pRoll } from '../src/luat/kiem_dinh.ts'

const THU_MUC_VECTOR = fileURLToPath(new URL('./vector', import.meta.url))

function docVector(tenTep: string): Record<string, unknown> {
  const duongDan = join(THU_MUC_VECTOR, tenTep)
  return JSON.parse(readFileSync(duongDan, 'utf8')) as Record<string, unknown>
}

interface DongPRoll {
  x: number
  n: number
  phuc_duyen: number
  nguoc: boolean
  ket_qua: number
}

describe('Vector đối chiếu Python (M0-07)', () => {
  it('đầy đủ 8 tệp vector với nguồn gốc và ngày sinh', () => {
    const cacTep = [
      'p_roll.json',
      'bonus_tuoi.json',
      'ap_moi_nam.json',
      'tien_do.json',
      'khac_che.json',
      'vo_gia.json',
      'age_max.json',
      'tam_hiep_ti_le.json',
    ]

    for (const tep of cacTep) {
      const duongDan = join(THU_MUC_VECTOR, tep)
      expect(existsSync(duongDan), `Tệp vector ${tep} phải tồn tại`).toBe(true)
      const noiDung = docVector(tep)
      expect(noiDung['nguon']).toBe('mo_phong/xuat_vector.py')
      expect(typeof noiDung['ngay_sinh']).toBe('string')
      expect(noiDung['ngay_sinh']).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    }
  })

  it('p_roll khớp tuyệt đối Python (sai số <= 1e-9)', () => {
    const vector = docVector('p_roll.json') as { du_lieu: DongPRoll[] }
    expect(vector.du_lieu.length).toBe(7812)

    for (const dong of vector.du_lieu) {
      const thucTe = pRoll(dong.x, dong.n, dong.phuc_duyen, dong.nguoc)
      expect(Math.abs(thucTe - dong.ket_qua)).toBeLessThanOrEqual(1e-9)
    }
  })

  // Các hàm phái sinh sẽ cài đặt ở M1-04 (cong_thuc.ts) và bật các todo bên dưới.
  it.todo('bonus_tuoi khớp Python (chờ M1-04: thuongHpTheoTuoi)')
  it.todo('ap_moi_nam khớp Python (chờ M1-04: apMoiNam)')
  it.todo('tien_do khớp Python (chờ M1-04: tienDoMoiAp)')
  it.todo('ap_len_10 khớp Python (chờ M1-04: apLen10)')
  it.todo('khac_che khớp Python (chờ M1-04: khacChe)')
  it.todo('vo_gia.hp_max khớp Python (chờ M1-04: hpMax)')
  it.todo('vo_gia.mp_max khớp Python (chờ M1-04: noiTucMax)')
  it.todo('vo_gia.vo_luc khớp Python (chờ M1-04: voLuc)')
  it.todo('vo_gia.chien_luc khớp Python (chờ M1-04: chienLuc)')
  it.todo('age_max khớp Python (chờ M1-04: tuoiThoMax)')
  it.todo('tuoi_bat_dau_lao_hoa khớp Python (chờ M1-04: tuoiBatDauLaoHoa)')
})
