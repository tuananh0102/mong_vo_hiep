// Quyết Đấu Tam Hiệp chạy tự động với AI hai bên (HS02 V, HS06 I.4).
// Đối chiếu Python: quyet_dau. Cùng luật, không cùng dòng số ngẫu nhiên: so khớp theo tỷ lệ.
// Chạy trên máy trạng thái của tran.ts nên không có công thức riêng.

import type { Rng } from '../rng'
import { aiChonHiep1, type Huong } from './ai'
import type { VoGiaTran } from './toan'
import { apDungBuocTai, chayHiep1, phanTramHp, taoTranDau, type CheDoTran, type TranDau } from './tran'

export interface KetQuaQuyetDau {
  thang: boolean
  hoa: boolean
  thua: boolean
  /** Phần trăm HP còn lại của bên thắng (0 - 1), góc nhìn bên thắng. */
  hp_con: number
  ko_h1: boolean
  ko_som: boolean
  bat_phan: boolean
  hp_yeu_h2: number
}

function tomTat(t: TranDau): KetQuaQuyetDau {
  // Không có bước Hiệp 3 nào do người chơi chọn: bên Áp đảo thắng.
  const kq = t.ket_qua
  const thangA = (kq?.nguoi_thang ?? t.ben_ap_dao) === 'a'
  const p = thangA ? 'a' : 'b'
  return {
    thang: thangA,
    hoa: false,
    thua: !thangA,
    hp_con: Math.max(0, phanTramHp(t, p)),
    ko_h1: t.ko_h1,
    ko_som: t.ko_som,
    bat_phan: t.bat_phan,
    hp_yeu_h2: t.hp_yeu_h2,
  }
}

/** Một trận Tam Hiệp, góc nhìn bên a. `chonA` / `chonB` ép hướng Hiệp 1 (không thì AI chọn). */
export function quyetDauTuDong(
  a: VoGiaTran,
  b: VoGiaTran,
  rng: Rng,
  chonA?: Huong,
  chonB?: Huong,
  cheDo: CheDoTran = 'sinh_tu',
): KetQuaQuyetDau {
  const t = taoTranDau({ a, b, che_do: cheDo })
  const ca = chonA ?? aiChonHiep1(a, b, [], rng)
  const cb = chonB ?? aiChonHiep1(b, a, [], rng)
  chayHiep1(t, ca, cb, rng)

  while (t.buoc !== 'xong') {
    let buoc
    if (t.buoc === 'giua_hiep') buoc = { loai: 'bo_qua' } as const
    else if (t.buoc === 'chon_chieu') buoc = { loai: 'chieu', ma: t.a.chieu_dang } as const
    else if (t.ben_ap_dao === null) buoc = { loai: 'phan_dinh', ma: 'lieu_mang' } as const // Bất phân: đánh tiếp
    else break // đã có bên Áp đảo: kết quả theo bên đó
    const loi = apDungBuocTai(t, buoc, rng)
    if (loi) throw new Error(`quyetDauTuDong: ${loi}`)
  }
  return tomTat(t)
}
