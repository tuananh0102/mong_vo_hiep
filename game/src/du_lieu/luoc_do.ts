// 01 mục 7, 8: lược đồ zod cho mọi file JSON.
import { z } from 'zod'

// HS01 I (vùng), HS06 I.3 (hệ số vùng đất cộng vào P_KyNgo)
export const LuocDoVung = z.object({
  ma: z.string().min(1),
  ten: z.string().min(1),
  nguon: z.string().min(1),
  he_so_ky_ngo: z.number().min(0).max(1),
})
export type Vung = z.infer<typeof LuocDoVung>

// HS01 II.8: một dòng cho mỗi chỉ số số. `max` là thang danh nghĩa, `tran_cung` là trần thật (nếu có).
export const LuocDoChiSo = z.object({
  ma: z.string().min(1),
  ten: z.string().min(1),
  nhom: z.enum(['nhan_than', 'thien_phu', 'xa_hoi', 'noi_cong', 'chien_dau', 'sinh_ton', 'tap_hoc']),
  min: z.number(),
  max: z.number().nullable(),
  tran_cung: z.number().nullable(),
  hien_thi: z.enum(['hien', 'ban_an', 'an']),
  phai_sinh: z.boolean().default(false),
  nguon: z.string().min(1),
})
export type DinhNghiaChiSo = z.infer<typeof LuocDoChiSo>

// HS01 III.1: 4 nhóm gia cảnh Tuổi 0, tỷ lệ và điều chỉnh chỉ số
export const LuocDoGiaCanh = z.object({
  ma: z.string().min(1),
  ten: z.string().min(1),
  nguon: z.string().min(1),
  ti_le: z.number().int().min(1).max(100),
  ngan_luong_khoi_dau: z.tuple([z.number().int().min(0), z.number().int().min(0)]),
  thu_nhap_gia_dinh: z.number().int().min(0),
  dieu_chinh_chi_so: z.record(z.string(), z.number().int()),
  dac_biet: z.array(z.string()).default([]),
  mo_ta: z.string().default(''),
})
export type GiaCanh = z.infer<typeof LuocDoGiaCanh>

// --- 01 mục 7.2: Điều kiện (`DieuKien`) ---
export type DieuKien =
  | { so: string; op: '>=' | '<=' | '>' | '<' | '==' | '!='; gt: number }
  | { la: string; trong: string[] }
  | { co: string }
  | { thien_phu: string }
  | { trang_thai: string }
  | { nhan: string }
  | { vo_hoc: string; cap_toi_thieu?: number }
  | { vat_pham: string; so_luong?: number }
  | { va: DieuKien[] }
  | { hoac: DieuKien[] }
  | { khong: DieuKien }

export const LuocDoDieuKien: z.ZodType<DieuKien> = z.lazy(() =>
  z.union([
    z.object({
      so: z.string(),
      op: z.enum(['>=', '<=', '>', '<', '==', '!=']),
      gt: z.number(),
    }),
    z.object({
      la: z.string(),
      trong: z.array(z.string()),
    }),
    z.object({ co: z.string() }),
    z.object({ thien_phu: z.string() }),
    z.object({ trang_thai: z.string() }),
    z.object({ nhan: z.string() }),
    z.object({
      vo_hoc: z.string(),
      cap_toi_thieu: z.number().int().min(1).default(1).optional(),
    }),
    z.object({
      vat_pham: z.string(),
      so_luong: z.number().int().min(1).default(1).optional(),
    }),
    z.object({ va: z.array(LuocDoDieuKien) }),
    z.object({ hoac: z.array(LuocDoDieuKien) }),
    z.object({ khong: LuocDoDieuKien }),
  ]),
)

// --- 01 mục 7.3: Hiệu ứng (`HieuUng`) ---
export const LuocDoHieuUng = z.union([
  z.object({
    cong: z.record(z.string(), z.number()),
    no_neu_thieu: z.string().optional(),
  }),
  z.object({ cong_phan_tram: z.record(z.string(), z.number()) }),
  z.object({
    hiep_nghia: z.number(),
    am: z.enum(['vat', 'lon']).optional(),
    nan_nhan: z.string().optional(),
  }),
  z.object({ thanh_danh: z.number() }),
  z.object({ danh_vong: z.number() }),
  z.object({
    dat_co: z.union([
      z.string(),
      z.record(z.string(), z.union([z.boolean(), z.number(), z.string()])),
    ]),
  }),
  z.object({ xoa_co: z.string() }),
  z.object({ them_trang_thai: z.string(), so_nam: z.number().optional() }),
  z.object({ xoa_trang_thai: z.string() }),
  z.object({ them_nhan: z.string() }),
  z.object({
    hoc_vo_hoc: z.string(),
    cap: z.number().int().default(1).optional(),
    hoan_thien: z.number().optional(),
  }),
  z.object({
    nhan_vat_pham: z.string(),
    so_luong: z.number().int().default(1).optional(),
  }),
  z.object({
    mat_vat_pham: z.string(),
    so_luong: z.number().int().default(1).optional(),
  }),
  z.object({
    gia_nhap_mon_phai: z.string(),
    bac: z.number().int().default(1).optional(),
  }),
  z.object({ roi_mon_phai: z.enum(['tu_roi', 'truc_xuat', 'phan_mon']) }),
  z.object({ cong_hien: z.number() }),
  z.object({ thang_bac: z.number().int() }),
  z.object({ doi_gia_canh: z.string() }),
  z.object({ trong_thuong: z.boolean() }),
  z.object({ mat_ap_nam_sau: z.number().int() }),
  z.object({
    len_lich: z.object({
      su_kien: z.string(),
      sau_nam: z.number().int(),
      han_nam: z.number().int(),
    }),
  }),
  z.object({ tiep: z.string() }),
  z.object({ hao_cam: z.object({ vai: z.string(), doi: z.number() }) }),
  z.object({ cuu_gia: z.string() }),
  z.object({ ghi_ke_thu: z.string() }),
  z.object({ chet: z.string() }),
  z.object({
    dong: z.object({
      van_ban: z.string(),
      loai_hien_thi: z
        .enum(['thuong', 'giao-chien', 'tinh-duyen', 'ky-ngo', 'dao-gia'])
        .default('thuong')
        .optional(),
    }),
  }),
])
export type HieuUng = z.infer<typeof LuocDoHieuUng>

export const LuocDoKetQuaLuaChon = z.object({
  van_ban: z.string(),
  hieu_ung: z.array(LuocDoHieuUng).default([]),
})
export type KetQuaLuaChon = z.infer<typeof LuocDoKetQuaLuaChon>

// HS01 III.2, HS05 IV.1, G05: Thiên phú Tuổi 0 và di truyền
export const LuocDoThienPhu = z.object({
  ma: z.string().min(1),
  ten: z.string().min(1),
  nguon: z.string().min(1),
  do_hiem: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)]),
  hieu_ung_tuoi_0: z.array(LuocDoHieuUng).default([]),
  hieu_ung_moi_nam: z.array(LuocDoHieuUng).default([]),
  dac_biet: z.array(z.string()).default([]),
  mo_ta: z.string().default(''),
})
export type ThienPhuDuLieu = z.infer<typeof LuocDoThienPhu>

// HS01 II.7: Trạng thái nhận trong đời qua sự kiện, có thể bị xóa hoặc chữa khỏi
export const LuocDoTrangThai = z.object({
  ma: z.string().min(1),
  ten: z.string().min(1),
  nguon: z.string().min(1),
  hieu_ung_moi_nam: z.array(LuocDoHieuUng).default([]),
  dac_biet: z.array(z.string()).default([]),
  mo_ta: z.string().default(''),
})
export type TrangThaiDuLieu = z.infer<typeof LuocDoTrangThai>

// HS01 II.7: Nhãn tính cách, dấu ấn hành vi, ảnh hưởng lựa chọn và phản ứng NPC
export const LuocDoNhan = z.object({
  ma: z.string().min(1),
  ten: z.string().min(1),
  nguon: z.string().min(1),
  dac_biet: z.array(z.string()).default([]),
  mo_ta: z.string().default(''),
})
export type NhanDuLieu = z.infer<typeof LuocDoNhan>

// --- 01 mục 7.1: Kiểm định (`KiemDinh`) ---
export const LuocDoKiemDinhRoll = z.object({
  loai: z.literal('roll'),
  chi_so: z.string().optional(),
  nguong: z.number().optional(),
  va: z.array(z.object({ chi_so: z.string(), nguong: z.number() })).optional(),
  hoac: z.array(z.object({ chi_so: z.string(), nguong: z.number() })).optional(),
})

export const LuocDoKiemDinhRollNguoc = z.object({
  loai: z.literal('roll_nguoc'),
  chi_so: z.string().optional(),
  nguong: z.number().optional(),
  va: z.array(z.object({ chi_so: z.string(), nguong: z.number() })).optional(),
  hoac: z.array(z.object({ chi_so: z.string(), nguong: z.number() })).optional(),
})

export const LuocDoKiemDinhRollDoiKhang = z.object({
  loai: z.literal('roll_doi_khang'),
  chi_so: z.string(),
  doi_thu: z.string(),
})

export const LuocDoKiemDinhGiaoChienNhanh = z.object({
  loai: z.literal('giao_chien_nhanh'),
  nguong: z.number(),
})

export const LuocDoKiemDinhTamHiep = z.object({
  loai: z.literal('tam_hiep'),
  doi_thu: z.string(),
  che_do: z.enum(['ty_thi', 'sinh_tu']),
  thang_khi: z.enum(['tru_vung']).optional(),
})

export const LuocDoKiemDinhNgauNhien = z.object({
  loai: z.literal('ngau_nhien'),
  nhanh: z.array(
    z.object({
      ti_le: z.number(),
      ket_qua: LuocDoKetQuaLuaChon,
    }),
  ),
})

export const LuocDoKiemDinh = z.discriminatedUnion('loai', [
  LuocDoKiemDinhRoll,
  LuocDoKiemDinhRollNguoc,
  LuocDoKiemDinhRollDoiKhang,
  LuocDoKiemDinhGiaoChienNhanh,
  LuocDoKiemDinhTamHiep,
  LuocDoKiemDinhNgauNhien,
])
export type KiemDinh = z.infer<typeof LuocDoKiemDinh>

// --- 01 mục 7.1: Lựa chọn & Sự kiện ---
export const LuocDoLuaChon = z.object({
  ma: z.string(),
  nhan: z.string(),
  cong: LuocDoDieuKien.nullable().optional(),
  cong_an: LuocDoDieuKien.nullable().optional(),
  kiem_dinh: LuocDoKiemDinh.nullable().optional(),
  nguy: z.boolean().optional(),
  chi_phi: z
    .object({
      ap: z.number().optional(),
      ngan_luong: z.number().optional(),
    })
    .optional(),
  ket_qua: LuocDoKetQuaLuaChon.optional(),
  thanh_cong: LuocDoKetQuaLuaChon.optional(),
  that_bai: LuocDoKetQuaLuaChon.optional(),
})
export type LuaChon = z.infer<typeof LuocDoLuaChon>

export const LuocDoLapLai = z.union([
  z.literal('mot_lan'),
  z.literal('moi_nam'),
  z.object({ cach_nam: z.number().int().min(1) }),
  z.object({ toi_da: z.number().int().min(1) }),
])
export type LapLaiSuKien = z.infer<typeof LuocDoLapLai>

export const LuocDoSuKien = z.object({
  ma: z.string().min(1),
  nguon: z.string().min(1),
  ten: z.string().min(1),
  loai: z.enum(['co_dinh', 'thuong', 'ky_ngo', 'noi_tiep', 'dai_su_kien']),
  cap_ky_ngo: z.enum(['B', 'A', 'S', 'SSS']).optional(),
  loai_hien_thi: z
    .enum(['thuong', 'giao-chien', 'tinh-duyen', 'ky-ngo', 'dao-gia'])
    .default('thuong')
    .optional(),
  tuoi: z.tuple([z.number().int(), z.number().int()]),
  vung: z.array(z.string()).nullable().optional(),
  dieu_kien: LuocDoDieuKien.nullable().optional(),
  trong_so: z.number().min(0).default(0).optional(),
  lap_lai: LuocDoLapLai,
  vai: z.record(z.string(), z.unknown()).optional(),
  mo_ta: z.string(),
  lua_chon: z.array(LuocDoLuaChon),
})
export type SuKien = z.infer<typeof LuocDoSuKien>

// --- 01 mục 8: Võ học ---
export const LuocDoVoHoc = z.object({
  ma: z.string().min(1),
  ten: z.string().min(1),
  nguon: z.string().min(1),
  nguon_ten: z.enum(['nguyen_tac', 'phong_tac']),
  tru_cot: z.enum(['noi_cong', 'ngoai_cong', 'khinh_cong', 'tuyet_ky']),
  tier: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)]),
  he_noi_luc: z.enum(['duong', 'am', 'hoa']).nullable().default(null),
  loai_binh_khi: z
    .enum(['quyen_chuong', 'chi_trao', 'kiem', 'dao', 'bong', 'am_khi'])
    .nullable()
    .default(null),
  uy_luc_lech: z.number().min(-0.1).max(0.1).default(0),
  tran_cap: z.number().int().min(1).max(10).default(10),
  dieu_kien_hoc: LuocDoDieuKien.nullable().optional(),
  dac_biet: z.array(z.string()).default([]),
  mon_phai: z.string().nullable().default(null),
  mo_ta: z.string().default(''),
})
export type VoHoc = z.infer<typeof LuocDoVoHoc>

// --- 01 mục 8: Môn phái ---
export const LuocDoMonPhai = z.object({
  ma: z.string().min(1),
  ten: z.string().min(1),
  nguon: z.string().min(1),
  nguon_ten: z.enum(['nguyen_tac', 'phong_tac']),
  phe: z.enum(['chinh', 'ta', 'trung_lap']),
  vung: z.string().min(1),
  quy_mo: z.enum(['nho', 'vua', 'lon']),
  dieu_kien_gia_nhap: LuocDoDieuKien,
  vo_hoc_theo_bac: z.record(z.string(), z.array(z.string())),
  cap_su_phu_theo_bac: z.record(z.string(), z.number().int()),
  khao_nghiem: z.string().nullable().default(null),
  dac_quyen: z.array(z.string()).default([]),
  mo_ta: z.string().default(''),
})
export type MonPhai = z.infer<typeof LuocDoMonPhai>

export interface DuLieu {
  vung: Record<string, Vung>
  chi_so: Record<string, DinhNghiaChiSo>
  gia_canh?: Record<string, GiaCanh>
  thien_phu: Record<string, ThienPhuDuLieu>
  trang_thai?: Record<string, TrangThaiDuLieu>
  nhan?: Record<string, NhanDuLieu>
  vo_hoc?: Record<string, VoHoc>
  mon_phai?: Record<string, MonPhai>
  su_kien?: Record<string, SuKien>
}
