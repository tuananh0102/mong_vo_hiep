// 01 mục 10.6: lõi bot dùng chung cho bot.ts và mo_phong.ts. Chỉ gọi apDung và hàm xem.ts, không tính luật.
import type { DuLieu } from '../src/du_lieu/luoc_do'
import { kiemTraBatBien } from '../src/luat/bat_bien'
import { taoTrangThaiRong } from '../src/luat/chi_so'
import { apDung } from '../src/luat/dong_co'
import type { Lenh, TrangThaiGame } from '../src/luat/kieu'
import { rngTuSeed, type Rng } from '../src/luat/rng'
import type { LuaChonTran } from '../src/luat/tam_hiep/xem_tran'
import { xemHanhDong, xemManHinh, xemMonPhai, xemSuKien, type HanhDongHienThi, type LuaChonHienThi } from '../src/luat/xem'

/** Hành động cần UI riêng (chọn vật phẩm, trang bị...), bot không gọi. */
const BO_QUA = new Set(['thay_trang_bi', 'uong_dan_duoc', 'xem_bang_tin', 'mua_sam', 'tro_chuyen', 'roi_mon_phai', 'tang_kinh_cac'])
const TOI_DA_LENH_MOI_NAM = 12
const TOI_DA_NAM = 200

export interface Chinh {
  /** Chọn hành động tiếp theo trong năm; null = qua năm. */
  hanhDong(s: TrangThaiGame, dl: DuLieu, rng: Rng, kheNam: KheNam): Lenh | null
  /** Chỉ số lựa chọn trong danh sách mở của sự kiện. */
  suKien(mo: LuaChonHienThi[], rng: Rng): number
  /** Chỉ số bước trong danh sách bước Tam Hiệp. */
  tamHiep(lc: LuaChonTran[], rng: Rng): number
}

export interface KheNam {
  /** Số lệnh hành động đã làm trong năm này. */
  soLenh: number
}

export interface KetQuaKiep {
  seed: number
  gia_canh: string
  tuoi_chet: number
  nguyen_nhan: string
  ket_cuc: string
  loi: string[]
  su_kien: string[]
  /** Ảnh chụp lúc 40 / 60 tuổi: cấp cao nhất và tier cao nhất. */
  moc: Record<number, { cap: number; tier: number } | undefined>
  mon_phai_cuoi: boolean
  /** Lệnh hành động / lựa chọn sự kiện gần nhất trước khi chết (chẩn đoán nguồn tử trận). */
  nguon_cuoi: string
}

export const hanhDongMo = (s: TrangThaiGame, dl: DuLieu): HanhDongHienThi[] =>
  Object.values(xemHanhDong(s, dl))
    .flat()
    .filter((h) => h.trong_tuoi && !h.bi_khoa && !BO_QUA.has(h.ma) && h.ap <= s.nhan_vat.ap_con_lai)

/** Tàng Kinh Các: tham số lấy từ xemMonPhai (Tab Môn Phái), không có trong danh sách Tab 1. */
export function lenhTangKinhCac(s: TrangThaiGame, dl: DuLieu, rng: Rng): Lenh | null {
  const mo = xemMonPhai(s, dl).tang_kinh_cac.filter((t) => !t.bi_khoa)
  const hd = xemHanhDong(s, dl)['mon_phai']?.find((h) => h.ma === 'tang_kinh_cac')
  if (mo.length === 0 || !hd || hd.bi_khoa || !hd.trong_tuoi) return null
  return { loai: 'hanh_dong', ma: 'tang_kinh_cac', tham_so: { vo_hoc: mo[rng.nguyen(0, mo.length - 1)]!.ma } }
}

/** Lệnh `hanh_dong` kèm tham số đầu tiên còn mở nếu hành động cần chọn. */
export function lenhHanhDong(h: HanhDongHienThi, rng: Rng): Lenh {
  if (h.tham_so === null || h.khoa_tham_so === null) return { loai: 'hanh_dong', ma: h.ma }
  const mo = h.tham_so.filter((t) => !t.bi_khoa)
  const t = mo[rng.nguyen(0, mo.length - 1)]!
  return { loai: 'hanh_dong', ma: h.ma, tham_so: { [h.khoa_tham_so]: t.ma } }
}

/** Chính sách ngẫu nhiên hợp lệ (01 mục 10.6). */
export const NGAU_NHIEN: Chinh = {
  hanhDong(s, dl, rng, kheNam) {
    const ds = hanhDongMo(s, dl)
    if (kheNam.soLenh >= TOI_DA_LENH_MOI_NAM) return null
    if (s.nhan_vat.mon_phai !== null && rng.trung(0.1)) {
      const tk = lenhTangKinhCac(s, dl, rng)
      if (tk) return tk
    }
    if (ds.length === 0) return null
    return lenhHanhDong(ds[rng.nguyen(0, ds.length - 1)]!, rng)
  },
  suKien: (mo, rng) => rng.nguyen(0, mo.length - 1),
  tamHiep: (lc, rng) => rng.nguyen(0, lc.length - 1),
}

/** Python: tuổi >= 7 mỗi năm AP đầu làm việc sư môn (bậc < 5), AP cuối kiếm tiền, còn lại luyện công. */
export const CHINH_PHAI: Chinh = {
  hanhDong(s, dl, rng, kheNam) {
    const nv = s.nhan_vat
    const ds = hanhDongMo(s, dl)
    if (nv.tuoi < 11 || ds.length === 0) return nv.tuoi < 11 ? NGAU_NHIEN.hanhDong(s, dl, rng, kheNam) : null
    const tim = (ma: string) => ds.find((h) => h.ma === ma)
    const mo = (ma: string) => {
      const h = tim(ma)
      return h ? lenhHanhDong(h, rng) : null
    }
    if (nv.mon_phai !== null && rng.trung(0.5)) {
      const tk = lenhTangKinhCac(s, dl, rng)
      if (tk) return tk
    }
    const apConLai = nv.ap_con_lai
    if (nv.mon_phai !== null && nv.mon_phai.bac < 5 && kheNam.soLenh === 0) {
      const l = mo('nhiem_vu_su_mon')
      if (l) return l
    }
    if (apConLai === 1) {
      // Python viec_kiem_tien: Sai phái sư môn > Săn tiền thưởng (tier >= 2, gia sản < 5.000) > Áp tiêu > Làm thuê
      const tierCao = Math.max(0, ...Object.keys(nv.vo_hoc).map((ma) => dl.vo_hoc?.[ma]?.tier ?? 0))
      const l =
        (nv.mon_phai !== null && nv.mon_phai.bac >= 2 && nv.mon_phai.bac <= 4 ? mo('sai_phai_su_mon') : null) ??
        (tierCao >= 2 && nv.tuoi >= 18 && nv.ngan_luong < 5000 ? mo('san_tien_thuong') : null) ??
        (nv.can_cot >= 50 && nv.tuoi >= 16 ? mo('ap_tieu') : null) ??
        (nv.tuoi <= 18 ? mo('lam_thue_vat') : null)
      if (l) return l
    }
    return mo('luyen_cong') ?? mo('lam_thue_vat') ?? null
  },
  // Sự kiện: lựa chọn đầu tiên không nguy hiểm còn mở (quy ước "lựa chọn đầu tiên hợp lệ").
  suKien: (mo) => Math.max(0, mo.findIndex((c) => !c.nguy)),
  // Tam Hiệp: Tiên Hạ Thủ (Python: hướng tốt nhất vs đa số NPC), chiêu / vật phẩm đầu tiên, phán định không chọn nước nguy.
  tamHiep: (lc) => {
    const t = lc.findIndex((c) => c.buoc.loai === 'huong' && c.buoc.huong === 'tien_ha_thu')
    if (t >= 0) return t
    const an = lc.findIndex((c) => !c.nguy)
    return an >= 0 ? an : 0
  },
}

export function chayKiep(seed: number, dl: DuLieu, cs: Chinh, tuoiTan = TOI_DA_NAM): KetQuaKiep {
  const rng = rngTuSeed(seed ^ 0x5bd1e995)
  const kq: KetQuaKiep = {
    seed, gia_canh: '', tuoi_chet: -1, nguyen_nhan: '', ket_cuc: '', loi: [], su_kien: [], moc: {}, mon_phai_cuoi: false, nguon_cuoi: '',
  }
  let s: TrangThaiGame = taoTrangThaiRong(seed)
  let nam = 0
  let kheNam: KheNam = { soLenh: 0 }

  const gui = (l: Lenh): boolean => {
    try {
      const r = apDung(s, l, dl)
      if (r.loi !== null) {
        kq.loi.push(`seed ${seed} tuổi ${s.nhan_vat.tuoi}: ${JSON.stringify(l)} -> ${r.loi}`)
        return false
      }
      s = r.trang_thai
      const bb = kiemTraBatBien(s, dl)
      if (bb.length > 0) kq.loi.push(`seed ${seed} tuổi ${s.nhan_vat.tuoi}: bất biến: ${bb.join('; ')}`)
      return bb.length === 0
    } catch (e) {
      kq.loi.push(`seed ${seed} tuổi ${s.nhan_vat.tuoi}: ném lỗi ${(e as Error).message}`)
      return false
    }
  }
  const chup = (): void => {
    const t = s.nhan_vat.tuoi
    if (t !== 40 && t !== 60) return
    const vh = Object.entries(s.nhan_vat.vo_hoc)
    kq.moc[t] = {
      cap: Math.max(0, ...vh.map(([, v]) => v.cap)),
      tier: Math.max(0, ...vh.map(([ma]) => dl.vo_hoc?.[ma]?.tier ?? 0)),
    }
  }

  if (!gui({ loai: 'tao_kiep', seed, gioi_tinh: seed % 2 === 0 ? 'nam' : 'nu', ten: '', uu_dai: [] })) return kq
  kq.gia_canh = s.nhan_vat.gia_canh
  for (let buoc = 0; s.ket_thuc === null; buoc++) {
    if (buoc > 5000 || nam > tuoiTan) {
      kq.loi.push(`seed ${seed}: không kết thúc sau ${buoc} bước, tuổi ${s.nhan_vat.tuoi}`)
      return kq
    }
    const cho = s.cho
    let lenh: Lenh | null
    if (cho === null) {
      lenh = cs.hanhDong(s, dl, rng, kheNam)
      if (lenh === null) {
        lenh = { loai: 'qua_nam' }
        kheNam = { soLenh: 0 }
        nam++
      } else kheNam.soLenh++
    } else if (cho.loai === 'chon_thien_phu') {
      lenh = { loai: 'chon_thien_phu', ma: cho.lua_chon[rng.nguyen(0, 2)]! }
    } else if (cho.loai === 'su_kien') {
      kq.su_kien.push(cho.ma)
      const mo = xemSuKien(s, dl)!.lua_chon.filter((c) => !c.bi_khoa)
      if (mo.length === 0) {
        kq.loi.push(`seed ${seed}: sự kiện ${cho.ma} không còn lựa chọn mở`)
        return kq
      }
      lenh = { loai: 'chon', ma_lua_chon: mo[cs.suKien(mo, rng)]!.ma }
    } else if (cho.loai === 'tam_hiep') {
      const lc = xemManHinh(s, dl).tam_hiep!.lua_chon
      if (lc.length === 0) {
        kq.loi.push(`seed ${seed}: trận Tam Hiệp không có lựa chọn`)
        return kq
      }
      lenh = { loai: 'tam_hiep', buoc: lc[cs.tamHiep(lc, rng)]!.buoc }
    } else {
      lenh = { loai: 'tiep_tuc' }
    }
    if (lenh.loai === 'hanh_dong') kq.nguon_cuoi = lenh.ma
    if (lenh.loai === 'chon') kq.nguon_cuoi = `${s.cho?.loai === 'su_kien' ? s.cho.ma : '?'}/${lenh.ma_lua_chon}`
    if (!gui(lenh)) return kq
    chup()
  }
  const kt = s.ket_thuc
  kq.tuoi_chet = kt.tuoi
  kq.nguyen_nhan = kt.nguyen_nhan
  kq.ket_cuc = kt.ket_cuc
  kq.mon_phai_cuoi = s.nhan_vat.mon_phai !== null
  return kq
}

export const trungVi = (xs: number[]): number => {
  if (xs.length === 0) return NaN
  const a = [...xs].sort((x, y) => x - y)
  const m = a.length >> 1
  return a.length % 2 ? a[m]! : (a[m - 1]! + a[m]!) / 2
}

export function demTheo<T>(xs: T[], khoa: (x: T) => string): [string, number][] {
  const m = new Map<string, number>()
  for (const x of xs) m.set(khoa(x), (m.get(khoa(x)) ?? 0) + 1)
  return [...m].sort((a, b) => b[1] - a[1])
}

export const pct = (n: number, tong: number): string => `${((100 * n) / Math.max(1, tong)).toFixed(1)}%`

export function soNguyenArg(ten: string, mac: number): number {
  const i = process.argv.indexOf(ten)
  return i >= 0 ? Number(process.argv[i + 1]) : mac
}
