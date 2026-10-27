// Chỉ dùng khi phát triển (`?tam_hiep` trên URL dev): vào thẳng một trận Tam Hiệp để chơi thử giao diện.
// Sự kiện thật mở trận từ M1-14; màn hình sự kiện ở M1-16.
import { DU_LIEU } from '../du_lieu/nap_vite'
import { rngTuSeed } from '../luat/rng'
import { moTranTuSuKien } from '../luat/tam_hiep/mo_tran'
import type { TrangThaiGame } from '../luat/kieu'

export function datTranThu(s: TrangThaiGame): TrangThaiGame {
  const nv = s.nhan_vat
  nv.tuoi = 25
  nv.can_cot = 50
  nv.ngo_tinh = 50
  nv.phuc_duyen = 50
  nv.hp = 825
  nv.noi_tuc = 450
  nv.hanh_trang['kim_sang_duoc'] = 1
  const tran = moTranTuSuKien(
    s,
    rngTuSeed(s.seed),
    DU_LIEU,
    { su_kien: 'thu', lua_chon: 'thu', doi_thu: 'cao_thu', hang: 'truong_lao', bien: { cao_thu: 'Điền Bá Quang' } },
    'sinh_tu',
  )
  tran.ngu_canh = null // không có sự kiện thật để áp nhánh
  s.cho = { loai: 'tam_hiep', tran }
  return s
}

export const CO_TRAN_THU =
  import.meta.env.DEV && typeof window !== 'undefined' && window.location.search.includes('tam_hiep')
