// 01 mục 7.5, 7.6: Mẫu văn bản và điền biến.
import type { DuLieu } from '../du_lieu/luoc_do'
import type { TrangThaiGame } from './kieu'

const REGEX_BIEN = /\{([^{}]+)\}/g

/** Trích xuất mọi tên biến nằm trong ngoặc nhọn `{...}` của mẫu. */
export function bienTrongMau(mau: string): string[] {
  const kq: string[] = []
  let khop: RegExpExecArray | null
  const re = new RegExp(REGEX_BIEN)
  while ((khop = re.exec(mau)) !== null) {
    if (khop[1]) kq.push(khop[1])
  }
  return kq
}

/** Điền giá trị thực vào mẫu văn bản sự kiện hoặc Biên Niên Sử. */
export function dienMau(
  mau: string,
  d: TrangThaiGame,
  dl: DuLieu,
  bien?: Record<string, string>,
): string {
  return mau.replace(REGEX_BIEN, (_, noiDung: string) => {
    // 1. Phân nhánh theo giới tính người chơi: {gt:nam|nu}
    if (noiDung.startsWith('gt:')) {
      const phan = noiDung.slice(3).split('|')
      const nam = phan[0] ?? ''
      const nu = phan[1] ?? ''
      return d.nhan_vat.gioi_tinh === 'nu' ? nu : nam
    }

    // 2. Phân nhánh theo giới tính NPC gắn vai: {gt_vai:ten_vai:nam|nu}
    if (noiDung.startsWith('gt_vai:')) {
      const phan = noiDung.slice(7).split(':')
      const tenVai = phan[0] ?? ''
      const tuyChon = (phan[1] ?? '').split('|')
      const nam = tuyChon[0] ?? ''
      const nu = tuyChon[1] ?? ''
      const gioiTinhNpc = bien?.[`gt_${tenVai}`] ?? 'nam'
      return gioiTinhNpc === 'nu' ? nu : nam
    }

    // 3. Tên vai NPC: {vai:ten_vai}
    if (noiDung.startsWith('vai:')) {
      const tenVai = noiDung.slice(4)
      return bien?.[tenVai] ?? tenVai
    }

    // 4. Tên hiển thị võ học: {vo_hoc:ma}
    if (noiDung.startsWith('vo_hoc:')) {
      const ma = noiDung.slice(7)
      const ds = (dl as unknown as { vo_hoc?: Record<string, { ten: string }> }).vo_hoc
      return ds?.[ma]?.ten ?? ma
    }

    // 5. Tên hiển thị vật phẩm: {vat_pham:ma}
    if (noiDung.startsWith('vat_pham:')) {
      const ma = noiDung.slice(9)
      const ds = (dl as unknown as { vat_pham?: Record<string, { ten: string }> }).vat_pham
      return ds?.[ma]?.ten ?? ma
    }

    // 6. Các biến dựng sẵn
    switch (noiDung) {
      case 'ten':
        return d.nhan_vat.ten
      case 'tuoi':
        return String(d.nhan_vat.tuoi)
      case 'vung':
        return dl.vung[d.nhan_vat.vung]?.ten ?? d.nhan_vat.vung
      case 'mon_phai': {
        const mp = d.nhan_vat.mon_phai
        if (!mp) return 'vô môn vô phái'
        const ds = (dl as unknown as { mon_phai?: Record<string, { ten: string }> }).mon_phai
        return ds?.[mp.ma]?.ten ?? mp.ma
      }
      case 'su_phu':
        return bien?.['su_phu'] ?? 'Sư phụ'
      case 'cha_me':
        return bien?.['cha_me'] ?? 'cha mẹ'
      default:
        return bien?.[noiDung] ?? `{${noiDung}}`
    }
  })
}
