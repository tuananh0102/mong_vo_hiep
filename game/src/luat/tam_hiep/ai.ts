// AI NPC chọn hướng tiếp cận Hiệp 1 (HS02 V.1). Đối chiếu Python: chon_ai.

import { AI_H1, KHAC_H1 } from '../hang_so'
import type { Rng } from '../rng'
import type { VoGiaTran } from './toan'

export type Huong = 'T' | 'Q' | 'D'
const HUONG: Huong[] = ['T', 'Q', 'D']
const SAN = 10

/** Chọn theo trọng số (tổng bất kỳ). */
function gieo(rng: Rng, w: Record<Huong, number>): Huong {
  const tong = HUONG.reduce((s, h) => s + w[h], 0)
  let x = rng.so() * tong
  for (const h of HUONG) {
    if (x < w[h]) return h
    x -= w[h]
  }
  return 'D'
}

/** Kéo mọi trọng số lên sàn 10%, phần thiếu lấy từ trọng số lớn nhất; tổng giữ nguyên. */
function chuanHoa(w: Record<Huong, number>): void {
  for (const h of HUONG) {
    if (w[h] >= SAN) continue
    const cao = HUONG.reduce((a, b) => (w[a] >= w[b] ? a : b))
    w[cao] -= SAN - w[h]
    w[h] = SAN
  }
}

/**
 * HS02 V.1: trọng số theo bản mệnh + 3 điều chỉnh:
 * - Khinh công NPC hơn >= 3 cấp: chuyển 15% từ Tiên Hạ Thủ sang Thân Pháp.
 * - Ngộ tính NPC hơn >= 20: +20% cho hướng khắc chế hướng người chơi dùng nhiều nhất
 *   trong 5 trận gần nhất, lấy đều từ hai hướng còn lại.
 * - Chuẩn hóa tổng 100, sàn 10% mỗi hướng.
 */
export function trongSoHiep1(
  npc: VoGiaTran,
  nguoiChoi: VoGiaTran,
  lichSu5Tran: Huong[],
): Record<Huong, number> {
  const w = { ...(AI_H1[npc.ban_menh] ?? AI_H1['chinh_truc']!) }
  if (npc.khinh_cong - nguoiChoi.khinh_cong >= 3) {
    const chuyen = Math.min(15, w.T - SAN)
    w.T -= chuyen
    w.D += chuyen
  }
  const gan = lichSu5Tran.slice(-5)
  if (npc.ngo_tinh - nguoiChoi.ngo_tinh >= 20 && gan.length > 0) {
    const dem: Record<Huong, number> = { T: 0, Q: 0, D: 0 }
    for (const h of gan) dem[h]++
    const nhieuNhat = HUONG.reduce((a, b) => (dem[a] >= dem[b] ? a : b))
    const khac = HUONG.find((h) => KHAC_H1[h] === nhieuNhat)!
    w[khac] += 20
    for (const h of HUONG) if (h !== khac) w[h] -= 10
  }
  chuanHoa(w)
  return w
}

export function aiChonHiep1(
  npc: VoGiaTran,
  nguoiChoi: VoGiaTran,
  lichSu5Tran: Huong[],
  rng: Rng,
): Huong {
  return gieo(rng, trongSoHiep1(npc, nguoiChoi, lichSu5Tran))
}
