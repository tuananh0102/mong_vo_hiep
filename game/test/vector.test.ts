// Đối chiếu vector sinh từ Python (mo_phong/xuat_vector.py) với TypeScript.
// M0-07: kiểm tra p_roll; M1-04: kiểm tra các hàm phái sinh.
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import {
  apLen10,
  apMoiNam,
  khacChe,
  thuongHpTheoTuoi,
  tienDoMoiAp,
  tinhChienLuc,
  tinhHpMax,
  tinhNoiTucMax,
  tinhTuoiThoMax,
  tinhVoLuc,
  tuoiBatDauLaoHoa,
} from '../src/luat/cong_thuc.ts'
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

interface DongBonusTuoi {
  tuoi: number
  ket_qua: number
}

interface DongApMoiNam {
  tuoi: number
  canh_gioi: number
  ket_qua: number
}

interface DongTienDo {
  ngo_tinh: number
  cap_su_phu: number
  tier: number
  ket_qua: number
}

interface DongKhacChe {
  he_a: string
  he_b: string
  ket_qua: number
}

interface DauVaoVoGia {
  can_cot: number
  ngo_tinh: number
  tuoi: number
  canh_gioi: number
  tier: number
  cap_vo: number
  khinh_cong: number
  than_binh: number
  he: string
  ban_menh: string
  phuc_duyen: number
}

interface DongVoGia {
  dau_vao: DauVaoVoGia
  hp_max: number
  mp_max: number
  vo_luc: number
  chien_luc: number
}

interface DongAgeMax {
  can_cot_dinh: number
  canh_gioi: number
  am_thuong: number
  ket_qua: number
}

interface DongLaoHoa {
  canh_gioi: number
  ket_qua: number
}

describe('Vector đối chiếu Python (M0-07, M1-04)', () => {
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

  it('bonus_tuoi khớp Python (thuongHpTheoTuoi)', () => {
    const vector = docVector('bonus_tuoi.json') as { du_lieu: DongBonusTuoi[] }
    expect(vector.du_lieu.length).toBe(121)

    for (const dong of vector.du_lieu) {
      const thucTe = thuongHpTheoTuoi(dong.tuoi)
      expect(thucTe).toBe(dong.ket_qua)
    }
  })

  it('ap_moi_nam khớp Python (apMoiNam)', () => {
    const vector = docVector('ap_moi_nam.json') as { du_lieu: DongApMoiNam[] }
    expect(vector.du_lieu.length).toBe(1111)

    for (const dong of vector.du_lieu) {
      const thucTe = apMoiNam(dong.tuoi, dong.canh_gioi)
      expect(thucTe).toBe(dong.ket_qua)
    }
  })

  it('tien_do khớp Python (tienDoMoiAp)', () => {
    const vector = docVector('tien_do.json') as { tien_do: DongTienDo[] }
    expect(vector.tien_do.length).toBe(1364)

    for (const dong of vector.tien_do) {
      const thucTe = tienDoMoiAp(dong.ngo_tinh, dong.cap_su_phu, dong.tier)
      expect(Math.abs(thucTe - dong.ket_qua)).toBeLessThanOrEqual(1e-9)
    }
  })

  it('ap_len_10 khớp Python (apLen10)', () => {
    const vector = docVector('tien_do.json') as { ap_len_10: DongTienDo[] }
    expect(vector.ap_len_10.length).toBe(120)

    for (const dong of vector.ap_len_10) {
      const thucTe = apLen10(dong.ngo_tinh, dong.cap_su_phu, dong.tier)
      expect(thucTe).toBe(dong.ket_qua)
    }
  })

  it('khac_che khớp Python (khacChe)', () => {
    const vector = docVector('khac_che.json') as { du_lieu: DongKhacChe[] }
    expect(vector.du_lieu.length).toBe(16)

    for (const dong of vector.du_lieu) {
      const thucTe = khacChe(dong.he_a, dong.he_b)
      expect(thucTe).toBe(dong.ket_qua)
    }
  })

  it('vo_gia.hp_max khớp Python (hpMax)', () => {
    const vector = docVector('vo_gia.json') as { du_lieu: DongVoGia[] }
    expect(vector.du_lieu.length).toBe(500)

    for (const dong of vector.du_lieu) {
      const thucTe = tinhHpMax(dong.dau_vao.can_cot, dong.dau_vao.canh_gioi, dong.dau_vao.tuoi)
      expect(Math.abs(thucTe - dong.hp_max)).toBeLessThanOrEqual(1e-9)
    }
  })

  it('vo_gia.mp_max khớp Python (noiTucMax)', () => {
    const vector = docVector('vo_gia.json') as { du_lieu: DongVoGia[] }
    expect(vector.du_lieu.length).toBe(500)

    for (const dong of vector.du_lieu) {
      const thucTe = tinhNoiTucMax(dong.dau_vao.can_cot, dong.dau_vao.canh_gioi)
      expect(Math.abs(thucTe - dong.mp_max)).toBeLessThanOrEqual(1e-9)
    }
  })

  it('vo_gia.vo_luc khớp Python (voLuc)', () => {
    const vector = docVector('vo_gia.json') as { du_lieu: DongVoGia[] }
    expect(vector.du_lieu.length).toBe(500)

    for (const dong of vector.du_lieu) {
      const thucTe = tinhVoLuc(dong.dau_vao.can_cot, dong.dau_vao.cap_vo)
      expect(thucTe).toBe(dong.vo_luc)
    }
  })

  it('vo_gia.chien_luc khớp Python (chienLuc)', () => {
    const vector = docVector('vo_gia.json') as { du_lieu: DongVoGia[] }
    expect(vector.du_lieu.length).toBe(500)

    for (const dong of vector.du_lieu) {
      const thucTe = tinhChienLuc({
        tier: dong.dau_vao.tier,
        capVo: dong.dau_vao.cap_vo,
        canhGioi: dong.dau_vao.canh_gioi,
        canCot: dong.dau_vao.can_cot,
        tuoi: dong.dau_vao.tuoi,
        khinhCong: dong.dau_vao.khinh_cong,
        thanBinh: dong.dau_vao.than_binh,
      })
      expect(Math.abs(thucTe - dong.chien_luc)).toBeLessThanOrEqual(1e-9)
    }
  })

  it('age_max khớp Python (tuoiThoMax)', () => {
    const vector = docVector('age_max.json') as { du_lieu: DongAgeMax[] }
    expect(vector.du_lieu.length).toBe(2046)

    for (const dong of vector.du_lieu) {
      const thucTe = tinhTuoiThoMax(dong.can_cot_dinh, dong.canh_gioi, dong.am_thuong)
      expect(thucTe).toBe(dong.ket_qua)
    }
  })

  it('tuoi_bat_dau_lao_hoa khớp Python (tuoiBatDauLaoHoa)', () => {
    const vector = docVector('age_max.json') as { lao_hoa: DongLaoHoa[] }
    expect(vector.lao_hoa.length).toBe(11)

    for (const dong of vector.lao_hoa) {
      const thucTe = tuoiBatDauLaoHoa(dong.canh_gioi)
      expect(thucTe).toBe(dong.ket_qua)
    }
  })
})
