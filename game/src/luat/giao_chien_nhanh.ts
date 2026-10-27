// HS02 V (Giao chiến Nhanh): một đoạn văn, một lần `[Roll: Võ Lực vs N]`.
// Đối chiếu Python: giao_chien_nhanh.

import type { DuLieu } from '../du_lieu/luoc_do'
import { voLuc } from './cong_thuc'
import { pRoll } from './kiem_dinh'
import type { TrangThaiGame } from './kieu'
import type { Rng } from './rng'

export function giaoChienNhanh(d: TrangThaiGame, rng: Rng, nguong: number, dl?: DuLieu): boolean {
  return rng.so() < pRoll(voLuc(d.nhan_vat, dl), nguong, d.nhan_vat.phuc_duyen)
}
