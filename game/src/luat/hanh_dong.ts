// HS01 II.5, IV; HS03 I; HS06 II.1, II.5; G07, G08: Hành động tiêu thụ AP và hành động miễn phí
import type { DuLieu } from '../du_lieu/luoc_do'
import { congChiSo } from './chi_so'
import { hpMax, timMonNgoaiCongTotNhat } from './cong_thuc'
import { danhGia } from './dieu_kien'
import { TIER_SAN_TIEN_THUONG } from './hang_so'
import { apHieuUng } from './hieu_ung'
import { lanRoll, pRoll } from './kiem_dinh'
import type { DongBienNien, TrangThaiGame } from './kieu'
import { apTieu, dungVatPham, nghiTro, sanTienThuong, thu } from './kinh_te'
import type { Rng } from './rng'
import { doiTangKinhCac, roiPhai, saiPhaiSuMon } from './mon_phai'
import { luyenCong } from './vo_hoc'

export type HamXuLyHanhDong = (
  d: TrangThaiGame,
  rng: Rng,
  dl: DuLieu,
  thamSo?: Record<string, string | number>,
) => { dong_moi: DongBienNien[]; loi?: string | null }

/**
 * HS03 I, G07: cần thầy hoặc sách để học Tạp học:
 * gia cảnh Phú Thương / Thế Gia, đang ở môn phái, hoặc mang theo sách.
 */
export function coThayTapHoc(d: TrangThaiGame, thamSo?: Record<string, string | number>): boolean {
  return (
    d.nhan_vat.gia_canh === 'phu_thuong' ||
    d.nhan_vat.gia_canh === 'vo_lam_the_gia' ||
    d.nhan_vat.mon_phai !== null ||
    Boolean(thamSo?.co_sach)
  )
}

export const BANG_XU_LY: Record<string, HamXuLyHanhDong> = {
  // G08: Hành động trẻ em 0 - 5 tuổi
  nam_noi: (d, _rng, dl) => {
    d.nhan_vat.hp = hpMax(d.nhan_vat, dl)
    d.nhan_vat.can_cot = Math.min(150, d.nhan_vat.can_cot + 1)
    d.nhan_vat.can_cot_dinh = Math.max(d.nhan_vat.can_cot_dinh, d.nhan_vat.can_cot)
    return {
      dong_moi: [
        {
          tuoi: d.nhan_vat.tuoi,
          van_ban: 'Ngoan ngoãn nằm trong nôi nghỉ ngơi, tinh thần sảng khoái (Căn cốt +1).',
          loai_hien_thi: 'thuong',
        },
      ],
    }
  },

  tap_bo: (d) => {
    d.nhan_vat.can_cot = Math.min(150, d.nhan_vat.can_cot + 1)
    d.nhan_vat.can_cot_dinh = Math.max(d.nhan_vat.can_cot_dinh, d.nhan_vat.can_cot)
    return {
      dong_moi: [
        {
          tuoi: d.nhan_vat.tuoi,
          van_ban: 'Chập chững tập bò, tay chân cứng cáp hơn (Căn cốt +1).',
          loai_hien_thi: 'thuong',
        },
      ],
    }
  },

  nghe_ke_chuyen: (d) => {
    d.nhan_vat.ngo_tinh = Math.min(150, d.nhan_vat.ngo_tinh + 1)
    return {
      dong_moi: [
        {
          tuoi: d.nhan_vat.tuoi,
          van_ban: 'Lắng nghe chuyện giang hồ từ người lớn, tâm trí mở mang (Ngộ tính +1).',
          loai_hien_thi: 'thuong',
        },
      ],
    }
  },

  luc_loi_do_dac: (d, rng) => {
    if (rng.trung(0.1)) {
      const tien = rng.nguyen(3, 8)
      const kq = thu(d, tien, 'Nhặt được')
      return {
        dong_moi: [
          {
            tuoi: d.nhan_vat.tuoi,
            van_ban: `Lục lọi đồ đạc trong nhà, tình cờ nhặt được ${tien} lạng bạc!`,
            loai_hien_thi: 'thuong',
          },
          ...kq.dong_moi,
        ],
      }
    }
    return {
      dong_moi: [
        {
          tuoi: d.nhan_vat.tuoi,
          van_ban: 'Lục lọi khắp các xó xỉnh trong nhà nhưng không tìm thấy thứ gì thú vị.',
          loai_hien_thi: 'thuong',
        },
      ],
    }
  },

  // G08: Hành động 6 - 10 tuổi
  doc_sach_vo_long: (d) => {
    d.nhan_vat.ngo_tinh = Math.min(150, d.nhan_vat.ngo_tinh + 2)
    return {
      dong_moi: [
        {
          tuoi: d.nhan_vat.tuoi,
          van_ban: 'Chăm chỉ đọc sách vỡ lòng khai tâm mở trí (Ngộ tính +2).',
          loai_hien_thi: 'thuong',
        },
      ],
    }
  },

  ren_the_luc: (d) => {
    d.nhan_vat.can_cot = Math.min(150, d.nhan_vat.can_cot + 2)
    d.nhan_vat.can_cot_dinh = Math.max(d.nhan_vat.can_cot_dinh, d.nhan_vat.can_cot)
    return {
      dong_moi: [
        {
          tuoi: d.nhan_vat.tuoi,
          van_ban: 'Chạy nhảy rèn luyện thân thể gân cốt dẻo dai (Căn cốt +2).',
          loai_hien_thi: 'thuong',
        },
      ],
    }
  },

  choi_cung_tre: (d) => {
    d.nhan_vat.mi_luc = Math.min(150, d.nhan_vat.mi_luc + 2)
    return {
      dong_moi: [
        {
          tuoi: d.nhan_vat.tuoi,
          van_ban: 'Vui chơi hòa đồng cùng lũ trẻ hàng xóm, tính tình hoạt bát (Mị lực +2).',
          loai_hien_thi: 'thuong',
        },
      ],
    }
  },

  phu_giup_gia_dinh: (d, _rng, dl) => {
    const kq = thu(d, 2, 'Phụ giúp')
    congChiSo(dl, d.nhan_vat, 'hiep_nghia', 2)
    return {
      dong_moi: [
        {
          tuoi: d.nhan_vat.tuoi,
          van_ban: 'Chăm chỉ phụ giúp cha mẹ việc nhà (Ngân lượng +2, Hiệp nghĩa +2).',
          loai_hien_thi: 'thuong',
        },
        ...kq.dong_moi,
      ],
    }
  },

  di_an_trom_vat: (d, rng, dl) => {
    const tien = rng.nguyen(5, 15)
    const kq = thu(d, tien, 'Ăn trộm vặt')
    congChiSo(dl, d.nhan_vat, 'hiep_nghia', -5)
    return {
      dong_moi: [
        {
          tuoi: d.nhan_vat.tuoi,
          van_ban: `Lén lút đi ăn trộm vặt, kiếm được ${tien} lạng bạc nhưng cắn rứt lương tâm (Hiệp nghĩa -5).`,
          loai_hien_thi: 'thuong',
        },
        ...kq.dong_moi,
      ],
    }
  },

  // 11+ tuổi: Luyện công
  luyen_cong: (d, _rng, dl, thamSo) => {
    const maVoHoc = String(thamSo?.vo_hoc ?? '')
    if (!maVoHoc || !d.nhan_vat.vo_hoc[maVoHoc]) {
      return { dong_moi: [], loi: 'chua_hoc_vo_hoc' }
    }
    // Đã trừ AP ở tiền xử lý hành động nên truyền daTruAp: true
    const sinh = luyenCong(d, dl, maVoHoc, { daTruAp: true })
    return { dong_moi: sinh }
  },

  // G07: Học Tạp học
  hoc_tap_hoc: (d, _rng, dl, thamSo) => {
    // HS03 I, G07: cần thầy hoặc sách (xem coThayTapHoc)
    if (!coThayTapHoc(d, thamSo)) {
      return { dong_moi: [], loi: 'thieu_dieu_kien_hoc' }
    }

    const maTap = String(thamSo?.tap_hoc ?? 'y_thuat')
    const luongTang = Math.min(15, 5 + Math.floor(d.nhan_vat.ngo_tinh / 10))
    congChiSo(dl, d.nhan_vat, maTap, luongTang)
    const tenTapHoc = dl.chi_so?.[maTap]?.ten ?? maTap

    return {
      dong_moi: [
        {
          tuoi: d.nhan_vat.tuoi,
          van_ban: `Chuyên tâm nghiên cứu ${tenTapHoc}, lĩnh hội được ${luongTang} điểm.`,
          loai_hien_thi: 'thuong',
        },
      ],
    }
  },

  // HS06 II.1: Làm thuê vặt (11 - 18 tuổi)
  lam_thue_vat: (d, rng) => {
    const tien = rng.nguyen(5, 15)
    const kq = thu(d, tien, 'Làm thuê')
    d.nhan_vat.can_cot = Math.min(150, d.nhan_vat.can_cot + 1)
    d.nhan_vat.can_cot_dinh = Math.max(d.nhan_vat.can_cot_dinh, d.nhan_vat.can_cot)
    return {
      dong_moi: [
        {
          tuoi: d.nhan_vat.tuoi,
          van_ban: `Bạn làm thuê vặt bổ củi rửa bát, nhận được ${tien} lạng bạc (Căn cốt +1).`,
          loai_hien_thi: 'thuong',
        },
        ...kq.dong_moi,
      ],
    }
  },

  // HS06 II.1, II.5: Tiểu thương (16+ tuổi)
  tieu_thuong: (d, rng) => {
    const tienGoc = rng.nguyen(50, 150)
    const p = pRoll(d.nhan_vat.ngo_tinh, 50, d.nhan_vat.phuc_duyen)
    const thanhCong = lanRoll(rng, p)

    if (thanhCong) {
      const kq = thu(d, tienGoc, 'Tiểu thương')
      return {
        dong_moi: [
          {
            tuoi: d.nhan_vat.tuoi,
            van_ban: `Bạn buôn bán nhỏ nhanh nhạy, đắt khách, kiếm được ${tienGoc} lạng bạc.`,
            loai_hien_thi: 'thuong',
          },
          ...kq.dong_moi,
        ],
      }
    }

    const tienThua = Math.floor(tienGoc / 2)
    const kq = thu(d, tienThua, 'Tiểu thương')
    return {
      dong_moi: [
        {
          tuoi: d.nhan_vat.tuoi,
          van_ban: `Chợ vắng vẻ buôn bán ế ẩm, chỉ thu về ${tienThua} lạng bạc.`,
          loai_hien_thi: 'thuong',
        },
        ...kq.dong_moi,
      ],
    }
  },

  // HS06 II.1: Áp tiêu, Săn tiền thưởng
  ap_tieu: (d, rng, dl) => apTieu(d, rng, dl),
  san_tien_thuong: (d, rng, dl, thamSo) => {
    // HS06 II.1: "Võ công Thượng thừa trở lên"
    if (timMonNgoaiCongTotNhat(d.nhan_vat, dl).tier < TIER_SAN_TIEN_THUONG) {
      return { dong_moi: [], loi: 'khong_du_vo_cong' }
    }
    return sanTienThuong(d, rng, dl, String(thamSo?.hang ?? 'yeu'))
  },

  // HS06 II.2: Nghỉ trọ 20 lạng, hồi đầy HP / Nội tức
  nghi_tro: (d, _rng, dl) => nghiTro(d, dl),

  // HS04 I.1: Sai phái sư môn (Bậc 2 - 4)
  sai_phai_su_mon: (d, rng, dl) => saiPhaiSuMon(d, rng, dl),

  // HS02 I (G19): đổi Cống hiến lấy võ học ở Tàng Kinh Các
  tang_kinh_cac: (d, _rng, dl, thamSo) => doiTangKinhCac(d, dl, String(thamSo?.vo_hoc ?? '')),

  // HS01 II.6: tự rời môn phái
  roi_mon_phai: (d) => {
    roiPhai(d, 'tu_roi')
    return {
      dong_moi: [{ tuoi: d.nhan_vat.tuoi, van_ban: 'Bạn từ biệt sư môn, xuống núi làm Lãng khách.', loai_hien_thi: 'thuong' }],
    }
  },

  // Hành động miễn phí (0 AP, tối đa 2/năm từ 11 tuổi)
  mua_sam: (d) => {
    return {
      dong_moi: [
        {
          tuoi: d.nhan_vat.tuoi,
          van_ban: 'Bạn dạo quanh các phường chợ sầm uất ngắm nghía hàng hóa.',
          loai_hien_thi: 'thuong',
        },
      ],
    }
  },

  tro_chuyen: (d) => {
    return {
      dong_moi: [
        {
          tuoi: d.nhan_vat.tuoi,
          van_ban: 'Bạn ngồi quán trà trò chuyện hàn huyên cùng người giang hồ.',
          loai_hien_thi: 'thuong',
        },
      ],
    }
  },

  // Không tính giới hạn (0 AP)
  thay_trang_bi: () => ({ dong_moi: [] }),
  uong_dan_duoc: (d, rng, dl, thamSo) => dungVatPham(d, dl, rng, String(thamSo?.vat_pham ?? '')),
  xem_bang_tin: (d) => {
    return {
      dong_moi: [
        {
          tuoi: d.nhan_vat.tuoi,
          van_ban: 'Bạn đứng xem Thiên Hạ Phong Vân Bảng nắm bắt tình hình võ lâm.',
          loai_hien_thi: 'thuong',
        },
      ],
    }
  },
}

/**
 * Thực hiện một hành động của người chơi:
 * 1. Kiểm tra tồn tại trong hanh_dong.json.
 * 2. Kiểm tra độ tuổi [tuoi_min, tuoi_max].
 * 3. Kiểm tra điều kiện riêng (dieu_kien).
 * 4. Kiểm tra chi phí AP và lượt hành động miễn phí.
 * 5. Trừ AP / lượt miễn phí.
 * 6. Gọi hàm xử lý tương ứng hoặc áp dụng hieu_ung có sẵn.
 */
export function thucHienHanhDong(
  d: TrangThaiGame,
  rng: Rng,
  dl: DuLieu,
  ma: string,
  thamSo?: Record<string, string | number>,
): { dong_moi: DongBienNien[]; loi: string | null } {
  const hd = dl.hanh_dong?.[ma]
  if (!hd) {
    return { dong_moi: [], loi: 'hanh_dong_khong_ton_tai' }
  }

  // 1. Kiểm tra tuổi
  if (d.nhan_vat.tuoi < hd.tuoi[0] || d.nhan_vat.tuoi > hd.tuoi[1]) {
    return { dong_moi: [], loi: 'sai_tuoi' }
  }

  // 2. Kiểm tra điều kiện riêng
  if (hd.dieu_kien && !danhGia(hd.dieu_kien, d, dl)) {
    return { dong_moi: [], loi: 'khong_du_dieu_kien' }
  }

  // 3. Kiểm tra AP và lượt miễn phí
  if (hd.ap > 0) {
    if (d.nhan_vat.ap_con_lai < hd.ap) {
      return { dong_moi: [], loi: 'het_ap' }
    }
    // Trừ AP
    d.nhan_vat.ap_con_lai -= hd.ap
  } else if (hd.mien_phi && !hd.khong_tinh_gioi_han) {
    if (d.nhan_vat.viec_mien_phi_con_lai < 1) {
      return { dong_moi: [], loi: 'het_luot_mien_phi' }
    }
    // Trừ lượt miễn phí (không trừ AP)
    d.nhan_vat.viec_mien_phi_con_lai -= 1
  }

  // 4. Gọi hàm xử lý
  const hamXuLy = BANG_XU_LY[hd.xu_ly]
  if (hamXuLy) {
    const kq = hamXuLy(d, rng, dl, thamSo)
    if (kq.loi) {
      // Hoàn trả lại AP / lượt miễn phí nếu hàm xử lý báo lỗi
      if (hd.ap > 0) {
        d.nhan_vat.ap_con_lai += hd.ap
      } else if (hd.mien_phi && !hd.khong_tinh_gioi_han) {
        d.nhan_vat.viec_mien_phi_con_lai += 1
      }
      return { dong_moi: [], loi: kq.loi }
    }
    return { dong_moi: kq.dong_moi, loi: null }
  }

  // Nếu không có hàm xử lý riêng nhưng có hieu_ung trong json
  const dongMoi: DongBienNien[] = []
  if (hd.hieu_ung && hd.hieu_ung.length > 0) {
    for (const hu of hd.hieu_ung) {
      const sinh = apHieuUng(hu, d, rng, dl)
      dongMoi.push(...sinh)
    }
  }

  return { dong_moi: dongMoi, loi: null }
}
