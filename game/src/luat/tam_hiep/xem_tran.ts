// Dữ liệu hiển thị của trận Tam Hiệp cho giao diện (01 mục 5.1): chỉ đọc, không tính luật.

import type { DuLieu } from '../../du_lieu/luoc_do'
import { nhanDoKho, pRoll, type NhanDoKho } from '../kiem_dinh'
import type { BuocTamHiep, LuaChonPhanDinh } from '../kieu'
import type { Huong } from './ai'
import {
  luaChonPhanDinh,
  pBoChay,
  phanTramHp,
  type BuocTran,
  type CheDoTran,
  type DongNhatKy,
  type KetQuaTran,
  type Phe,
  type TranDau,
} from './tran'

export interface LuaChonTran {
  buoc: BuocTamHiep
  nhan: string
  /** Tên chỉ số của Roll kèm độ khó (chỉ có khi lựa chọn là Roll). */
  chi_so?: string
  do_kho?: NhanDoKho
  nguy: boolean
}

export interface BenHienThi {
  hp_pct: number
  mp_pct: number
}

export interface TranHienThi {
  ten_doi_thu: string
  che_do: CheDoTran
  hiep: 1 | 2 | 3
  buoc: BuocTran
  a: BenHienThi
  b: BenHienThi
  lua_chon: LuaChonTran[]
  nhat_ky: string[]
  ket_qua: KetQuaTran | null
}

const HUONG: [Huong, 'tien_ha_thu' | 'an_binh' | 'than_phap'][] = [
  ['T', 'tien_ha_thu'],
  ['Q', 'an_binh'],
  ['D', 'than_phap'],
]
const NGUY: LuaChonPhanDinh[] = ['tuyet_sat', 'phe_vo_cong', 'lieu_mang', 'nhay_vuc']

const pct = (x: number): number => Math.max(0, Math.min(100, Math.round(x * 100)))

function dien(mau: string, bien: Record<string, string | number>): string {
  return mau.replace(/\{([^{}]+)\}/g, (_, k: string) => String(bien[k] ?? `{${k}}`))
}

function xemBen(t: TranDau, p: Phe): BenHienThi {
  return { hp_pct: pct(phanTramHp(t, p)), mp_pct: pct(t[p].mp / t[p].vg.mp_max) }
}

function luaChonHienTai(t: TranDau, mau: (k: string) => string): LuaChonTran[] {
  switch (t.buoc) {
    case 'chon_huong':
      return HUONG.map(([h, ma]) => ({
        buoc: { loai: 'huong', huong: ma },
        nhan: mau(`nhan.huong.${h}`),
        // Án Binh có Roll Ngộ tính vs Ngộ tính địch (HS02 V.1)
        ...(h === 'Q'
          ? {
              chi_so: 'Ngộ tính',
              do_kho: nhanDoKho(pRoll(t.a.vg.ngo_tinh, t.b.vg.ngo_tinh, t.a.vg.phuc_duyen)),
            }
          : {}),
        nguy: false,
      }))
    case 'giua_hiep':
      return [
        { buoc: { loai: 'vat_pham', ma: 'kim_sang_duoc' }, nhan: mau('nhan.vat_pham.kim_sang_duoc'), nguy: false },
        { buoc: { loai: 'bo_qua' }, nhan: mau('nhan.bo_qua'), nguy: false },
      ]
    case 'chon_chieu':
      return t.a.chieu.map((c) => ({ buoc: { loai: 'chieu', ma: c.ma }, nhan: c.ten, nguy: false }))
    case 'phan_dinh':
      return luaChonPhanDinh(t).map((ma) => ({
        buoc: { loai: 'phan_dinh', ma },
        nhan: mau(`nhan.phan_dinh.${ma}`),
        ...(ma === 'bo_chay' ? { chi_so: 'Võ lực', do_kho: nhanDoKho(pBoChay(t)) } : {}),
        nguy: NGUY.includes(ma),
      }))
    default:
      return []
  }
}

function dongNhatKy(e: DongNhatKy, mau: (k: string, v?: Record<string, string | number>) => string): string {
  const ben = (p: Phe | null): string => (p ? mau(`ben.${p}`) : '')
  switch (e.loai) {
    case 'huong':
      return mau(`nhat_ky.huong.${e.huong}`, { ben: ben(e.ben) })
    case 'quan_sat':
      return mau(`nhat_ky.quan_sat.${e.thanh_cong ? 'ok' : 'hong'}`, { ben: ben(e.ben) })
    case 'don':
      return mau(e.bao_kich ? 'nhat_ky.don_bao_kich' : 'nhat_ky.don', {
        ben: ben(e.ben),
        hiep: e.hiep,
        sat_thuong: e.sat_thuong,
      })
    case 'vat_pham':
      return mau('nhat_ky.vat_pham', { hoi: e.hoi })
    case 'phan_dinh':
      return e.ma === 'ha_guc'
        ? mau('nhat_ky.ha_guc', { ben: ben(e.ben) })
        : mau(`nhat_ky.phan_dinh.${e.ma}`, { ben: ben(e.ben) })
  }
}

/** Hàm điền mẫu văn bản Tam Hiệp (`van_ban/he_thong.json`); thiếu khóa thì trả chính khóa. */
export function taoMauTamHiep(
  dl: DuLieu,
  tenDoiThu: string,
): (k: string, v?: Record<string, string | number>) => string {
  const kho = dl.van_ban_he_thong?.tam_hiep ?? {}
  return (k, v = {}) => dien(kho[k] ?? k, { ten: tenDoiThu, ...v })
}

/** HP / Nội tức dạng phần trăm, hiệp hiện tại, lựa chọn hợp lệ kèm độ khó, nhật ký đòn dạng câu văn. */
export function xemTranDau(t: TranDau, dl: DuLieu, tenDoiThu = 'Đối thủ'): TranHienThi {
  const mau = taoMauTamHiep(dl, tenDoiThu)
  return {
    ten_doi_thu: tenDoiThu,
    che_do: t.che_do,
    hiep: t.hiep,
    buoc: t.buoc,
    a: xemBen(t, 'a'),
    b: xemBen(t, 'b'),
    lua_chon: luaChonHienTai(t, mau),
    nhat_ky: t.nhat_ky.map((e) => dongNhatKy(e, mau)),
    ket_qua: t.ket_qua,
  }
}
