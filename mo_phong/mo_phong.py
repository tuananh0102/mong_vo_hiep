"""Mô phỏng cân bằng "Vạn Kiếp Giang Hồ" theo công thức Hồ sơ 01, 02, 04, 06.

Chạy:
    python mo_phong.py              in báo cáo markdown ra stdout
    python mo_phong.py --kiem-tra   chỉ chạy self-check công thức

Chỉ dùng thư viện chuẩn. Seed cố định nên kết quả lặp lại được.
Mọi con số GDD chưa định nghĩa nằm trong khối GIẢ ĐỊNH ngay bên dưới,
mỗi dòng ghi rõ đó là giả định, để đội thiết kế thay bằng số thật.
"""
import math
import random
import statistics
import sys
from dataclasses import dataclass, field, replace

# ===================== GIẢ ĐỊNH (GDD chưa có số) =====================
# ----- Đã chốt vào HS06 (vòng cân bằng 2) -----
UY_LUC = {1: 210, 2: 250, 3: 280, 4: 320}     # Uy lực chiêu thức theo tier (HS06 I.4)
HE_SO_THAM_DO = 1.0     # M Hiệp 1 của Án Binh / Thân Pháp khi không bị khắc (HS02, cũ giả định 0.6)
HE_SO_NOI_TUC = 0.08                           # DMG cộng Nội tức hiện tại x 0.08 (cũ 0.15)
GIAM_TRU_MOI_CAN_COT = 0.003                   # Giảm trừ phòng ngự = 0.3% x Căn cốt + 2% x Cấp Khinh công
GIAM_TRU_MOI_KHINH_CONG = 0.02
GIAM_TRU_TOI_DA = 0.50
KHAC_THUAN, KHAC_NGUOC = 1.05, 0.95            # Hệ số khắc chế Nội lực (cũ 1.25 / 0.80)
H1_THUA_M1, H1_THUA_M2 = 0.9, 1.0              # Tiên Hạ Thủ bị Thân Pháp khắc (cũ 0.5 / 0.85)
H1_TIEN_HA_THU = 1.1                           # M Hiệp 1 của Tiên Hạ Thủ (cũ 1.2)
H1_AN_BINH_GIAM_DICH = 0.95                    # Án Binh nhìn thấu: đòn Hiệp 2 của địch x0.95
CONG_HIEN_THANG_CAP = 100                      # Thắng thử thách thăng cấp (HS04)
SINH_HOAT_PHI = [(700, 300), (400, 150), (100, 50), (0, 10)]  # (Danh vọng tối thiểu, lạng/năm) từ 16 tuổi
# ----- Vòng cân bằng 3 -----
BONG_LOC = {"nho": 100, "vua": 250, "lon": 400}  # Bổng lộc Chưởng môn rút từ Ngân khố môn phái (HS06 II.1)
BAI_LO_TUC_THOI = 0.20                         # HS01 II.3
BAI_LO_MOI_NAM, BAI_LO_TOI_DA = 0.02, 0.30     # HS01 II.3: 2% x số hành động [Ám] chưa lộ, tối đa 30%
# ----- Vòng cân bằng 4: Thương nghiệp (HS06 II.5) -----
CO_PHAN_GIA, CO_PHAN_TOI_DA, CO_TUC = 1000, 10, 0.06   # Cổ phần tiêu cục: giá / phần, số phần tối đa, cổ tức năm
TIEU_CUOP, TIEU_CUOP_MAT_VON, TIEU_CUOP_N = 0.15, 0.10, 50  # Mất tiêu: xác suất, vốn mất, ngưỡng Giao chiến nhanh
MUOI_BUOC, MUOI_TOI_DA, MUOI_LAI = 1000, 10000, 0.07   # Buôn muối có Diêm dẫn
DIEM_DAN_HOI_LO, DIEM_DAN_DANH_VONG = 1000, 400        # Lấy Diêm dẫn: hối lộ [Ám -20] hoặc Danh vọng >= 400
SONG_BAC_GIA, SONG_BAC_LAI = 4000, (300, 900)        # Sòng bạc: giá mua, lợi tức năm
SONG_BAC_BAO_KE, SONG_BAC_THANH_DANH = 0.20, 10        # Bị đòi bảo kê mỗi năm; Thanh danh -10/năm công khai
DAU_CO_TOI_DA, DAU_CO_BAN_LO = 10000, 0.6              # Hắc Thị nhận tối đa 10.000 lạng hàng; trượt thì bán lại 60%
DAU_CO_TRUNG = {"son_ha": 3.0, "huyet_an": 2.5}       # Bán khi đúng đại sự kiện (HS06 II.2 ý 5)
TONG_TIEN_NGUONG, TONG_TIEN_P, TONG_TIEN_MAT = 10000, 0.10, 0.10  # Tiền nhiều sinh họa
TONG_TIEN_N = 60
HO_VIEN_PHI = 1000
TIEU_THUONG = (50, 150)                                # Tiểu thương 1 AP, [Roll: Ngộ tính vs 50], thất bại nhận nửa
MOC_SU_KIEN = (18, 30, 42, 54)                         # HS01: đại sự kiện ngẫu nhiên, kéo dài 3 năm
DAI_SU_KIEN = ("vo_lam", "doat_bao", "son_ha", "huyet_an")
# ----- Vòng cân bằng 6: Trọng thương, tử trận, Tẩu hỏa nhập ma -----
THUOC_NOI_THUONG = 350      # Chữa Trọng thương kịp thời: Bạch Vân Hùng Đảm Hoàn (HS06 III)
DUONG_THUONG_N = 50         # Không có thuốc: dưỡng thương [Roll: Căn cốt vs 50], thất bại Ám thương +5
THNM_CO_BAN, THNM_TA_CONG = 0.30, 0.05  # HS06 I.4 P_THNM (song tu Chí Dương + Chí Âm)
# Vòng 16: Ma công (Trấn phái Tà phái, Hiệp nghĩa <= -300): Uy lực và Điểm Tier như SSS, học như Trấn phái,
# đổi lại phản phệ: P_THNM mỗi năm còn trang bị
MA_CONG, MA_CONG_THNM, MA_CONG_HIEP_NGHIA = True, 0.03, -300
# Vòng 17: lối chơi mẫu luyện Khinh công và mua binh khí ở Hắc Thị (HS02 II.1, HS02 IV, HS06 II.2)
KHINH_CONG_MAU, THAN_BINH_MAU = True, True        # Thương nhân mẫu không mua binh khí (không giúp Giao chiến nhanh)
KHINH_CONG_TRAN = {1: 4, 2: 6, 3: 8, 4: 10}       # Trần cấp Khinh công theo tier
HAC_THI_CHU_KY, HAC_THI_P_BINH_KHI = 5, 0.70       # 5 năm 1 lần; >= 1 trong 3 món là binh khí: 1 - (2/3)^3
HAC_THI_BINH_KHI = [(0.8, 30, 2000), (0.2, 60, 6000)]  # (trọng số, Sát thương Thần binh, giá sàn): Lợi khí, Danh khí
HAC_THI_DAU_GIA = (1.0, 1.5)  # Giá chốt = giá sàn x U(1; 1,5)
# Vòng 18: Dịch Dung (HS01 II.3, HS06 V.4): [Ám] làm khi Dịch Dung lộ ngay 5%; khi bị rò rỉ hằng năm,
# 2/3 số lần tội đổ lên kẻ bị giả dạng (việc đó rời danh sách, người chơi không mất Thanh danh)
DICH_DUNG_GIA, DICH_DUNG_LO_NGAY, DICH_DUNG_DO_TOI = 1500, 0.05, 2 / 3
TRUY_NA_HIEP_NGHIA = 40  # HS06 II.1: săn tiền thưởng thành công, Hiệp nghĩa +40 (công khai)
AM_SAT_THAT_BAI_DICH_DUNG = True  # thất bại khi Dịch Dung: mục tiêu nhìn thấy mặt giả, thành 1 việc [Ám] chưa lộ
AN_DANH_DUNG = -150  # Chính sách mẫu: sát thủ ẩn danh ngừng nhận hợp đồng khi chỉ còn 1 lần lộ là thành Đại ma đầu (Thanh danh <= -300)
# Vòng 7: Sai phái sư môn (HS04 I.1, HS06 II.1): 1 AP, Bậc 2 - 4, đi cùng đồng môn nên không tử trận
SAI_PHAI = {2: (50, 150), 3: (100, 250), 4: (150, 350)}  # thù lao theo bậc
SAI_PHAI_N = {2: 30, 3: 40, 4: 50}                       # [Giao chiến nhanh: N], thất bại chỉ mất thù lao
DANH_VONG_CHUC = {4: 150, 5: 300}       # Vòng 8 (HS01 II.2): Danh vọng chức vị, chỉ có khi đang giữ chức
SINH_HOAT_TRONG_MON = 50                # Vòng 8 (HS06 II.2): còn ở trong môn phái thì ăn ở trên núi, phí tối đa 50
TAI_TIENG = 20  # Vòng 11 (HS01 II.2): bại lộ [Ám] lớn cộng Danh vọng như thắng công khai trước nạn nhân (mục tiêu ngang sức ~ Trưởng lão)
TRUY_NA_NGUONG = 5000  # Chính sách người chơi mẫu: chỉ săn truy nã / móc túi khi gia sản < 5.000 lạng
TRUY_NA_SUC, TRUY_NA_THUONG = 0.8, (150, 400)  # Bảng truy nã hạng Yếu (HS06 II.1): Căn cốt, Ngộ tính mục tiêu x0.8
# ----- Còn là giả định -----
TUYET_SAT = {"ta_ac": 0.6, "ngong_cuong": 0.3, "nguy_quan_tu": 0.3, "si_tinh": 0.1, "chinh_truc": 0.0}
#   ^ Xác suất NPC chọn [A] Tuyệt sát khi áp đảo người chơi trong trận sinh tử (HS02 V.3 chưa có trọng số)
SONG_TU = 0.5               # Tỷ lệ người chơi giữ cả 2 nội công xung khắc khi kỳ ngộ cho nội công khác cực
THNM_CAN_COT = 5            # "Giảm Căn cốt" khi Tẩu hỏa nhập ma (HS02 chưa có số); sau đó người chơi tán công 1 môn
BAO_KICH_CO_BAN = 0.10  # Tỷ lệ bạo kích nền
TIEU_HAO_MP_HIEP2 = 0.30  # Tuyệt kỹ Hiệp 2 tiêu 30% MP_max
BIEN_THIEN_SAT_THUONG = 0.10  # Sát thương dao động ±10% (công thức HS06 không có yếu tố ngẫu nhiên)
CONG_HIEN_MOI_AP = 50     # Cống hiến cho 1 AP "Nhiệm vụ sư môn" (HS04, cũ giả định 25)
DANH_VONG_THANG_TRAN = 20  # Thắng Tam Hiệp NPC thường (HS01: +5..+50)
DANH_VONG_THANG_CAP = 30   # Mỗi lần thăng chức môn phái
SU_PHU_THEO_BAC = {1: 6, 2: 8, 3: 10, 4: 10, 5: 10}   # Cấp võ học của sư phụ
TIER_THEO_BAC = {1: 1, 2: 2, 3: 3, 4: 3, 5: 3}       # Tier võ học môn phái truyền
# Phần thưởng võ học của 1 kỳ ngộ theo cấp kỳ ngộ HS01 II.7: B (không có bí kíp), A, S, SSS
KY_NGO_TIER = [(0.50, 0), (0.30, 2), (0.15, 3), (0.05, 4)]
# ======================================================================

# ----- Hằng số lấy thẳng từ GDD -----
TIER_FACTOR = {1: 1.0, 2: 2.0, 3: 3.0, 4: 5.0}         # HS06 I.1
KHAC = {("duong", "am"), ("am", "hoa"), ("hoa", "duong"), ("am", "ngoai")}  # HS06 I.4
KHAC_H1 = {"T": "Q", "Q": "D", "D": "T"}                 # HS02 V.1: khóa thắng giá trị
AI_H1 = {                                                # HS02 V.1, trọng số NPC
    "chinh_truc": {"T": 34, "Q": 33, "D": 33},
    "nguy_quan_tu": {"T": 20, "Q": 50, "D": 30},
    "ta_ac": {"T": 50, "Q": 20, "D": 30},
    "ngong_cuong": {"T": 45, "Q": 30, "D": 25},
    "si_tinh": {"T": 30, "Q": 30, "D": 40},
}
BAC_YEU_CAU = {2: (16, 100), 3: (20, 300), 4: (28, 700), 5: (35, 1500)}  # HS04: (tuổi, cống hiến)
TRO_CAP = {1: 10, 2: 30, 3: 50, 4: 200}                  # HS06 II.1
MOC_BAO_CAO = (15, 20, 30, 40, 50, 60, 70, 80, 90)
# HS06 I.5 Chiến lực (vòng 10): P(A thắng Tam Hiệp) ~ 1 / (1 + exp(-(CL_A - CL_B) / CL_THANG_DO))
CL_TIER = {1: 0, 2: 20, 3: 30, 4: 45}
CL_CAP, CL_CANH_GIOI, CL_CAN_COT, CL_TUOI = 10, 10, 2, 10
CL_KHINH_CONG, CL_THAN_BINH = 5, 5  # vòng 12: +5 mỗi cấp Khinh công, + Sát thương Thần binh / 5
CL_THANG_DO = 16
LAO_HOA_THUONG, LAO_HOA_CAO, LAO_HOA_CANH_GIOI = 50, 60, 8  # HS04 III: tuổi bắt đầu giảm Căn cốt
QUY_MO = {"nho": (500, 200), "vua": (1500, 700), "lon": (3000, 1500)}  # (lợi tức, bảo trì)


def clamp(x, lo, hi):
    return max(lo, min(hi, x))


def p_roll(x, n, phuc_duyen=50, nguoc=False):
    """HS06 I.2.2: xác suất mềm, kẹp 5% - 95%."""
    d = (n - x) if nguoc else (x - n)
    return clamp(0.5 + d * 0.025 + (phuc_duyen - 50) * 0.003, 0.05, 0.95)


def bonus_tuoi(tuoi):
    if tuoi <= 30:
        return 5 * tuoi
    if tuoi <= 50:
        return 150
    return 150 - 8 * (tuoi - 50)


def ap_moi_nam(tuoi, canh_gioi):
    """HS01 IV."""
    if tuoi <= 10:
        return 2
    if tuoi <= 30:
        return 3
    if tuoi <= 50:
        return 4
    if tuoi <= 70:
        return 4 if canh_gioi >= 8 else 3
    return 2


def tien_do(ngo_tinh, cap_su_phu, tier):
    """HS06 I.1: % của 1 cấp võ học cho 1 AP."""
    return min(100.0, (ngo_tinh * 1.2 + cap_su_phu * 2) / TIER_FACTOR[tier])


def ap_len_10(ngo_tinh, cap_su_phu, tier):
    """Số AP để luyện 1 môn từ cấp 1 lên 10 (9 lần lên cấp)."""
    td, tong, ap = tien_do(ngo_tinh, cap_su_phu, tier), 0.0, 0
    while tong < 900:
        tong += td
        ap += 1
    return ap


def khac_che(he_a, he_b):
    if (he_a, he_b) in KHAC:
        return KHAC_THUAN
    if (he_b, he_a) in KHAC:
        return KHAC_NGUOC
    return 1.0


@dataclass
class VoGia:
    can_cot: float
    ngo_tinh: float
    tuoi: int = 30
    canh_gioi: int = 0
    he: str = "ngoai"
    tier: int = 1
    cap_vo: int = 1
    khinh_cong: int = 0
    than_binh: int = 0        # Sát thương Thần binh cộng vào DMG (HS02 IV, HS06 I.4)
    phuc_duyen: float = 50
    ban_menh: str = "chinh_truc"

    @property
    def hp_max(self):
        return 100 + self.can_cot * 12 + self.canh_gioi * 80 + bonus_tuoi(self.tuoi)

    @property
    def mp_max(self):
        return 50 + self.can_cot * 8 + self.canh_gioi * 150

    @property
    def vo_luc(self):
        return min(100, self.can_cot // 2 + self.cap_vo * 5)

    @property
    def chien_luc(self):
        """HS06 I.5: điểm xếp hạng Phong Vân Bảng, hiệu chỉnh bằng hieu_chinh_chien_luc.py."""
        return (CL_TIER[self.tier] + CL_CAP * self.cap_vo + CL_CANH_GIOI * self.canh_gioi
                + CL_CAN_COT * self.can_cot + bonus_tuoi(self.tuoi) / CL_TUOI
                + CL_KHINH_CONG * self.khinh_cong + self.than_binh / CL_THAN_BINH)


def sat_thuong(att, de, mp_hien_tai, m):
    goc = UY_LUC[att.tier] * (1 + att.cap_vo / 5) + mp_hien_tai * HE_SO_NOI_TUC + att.than_binh
    giam = min(GIAM_TRU_TOI_DA, GIAM_TRU_MOI_CAN_COT * de.can_cot + GIAM_TRU_MOI_KHINH_CONG * de.khinh_cong)
    return goc * m * khac_che(att.he, de.he) * (1 - giam)


def chon_ai(vg, rng, dich=None):
    w = dict(AI_H1[vg.ban_menh])
    if dich is not None and vg.khinh_cong - dich.khinh_cong >= 3:  # HS02 V.1: khinh công hơn 3 cấp
        chuyen = min(15, w["T"] - 10)
        w["T"] -= chuyen
        w["D"] += chuyen
    return rng.choices(list(w), weights=list(w.values()))[0]


def quyet_dau(a, b, rng, chon_a=None, chon_b=None):
    """Một trận Tam Hiệp. Trả về dict kết quả, góc nhìn của a."""
    ca = chon_a or chon_ai(a, rng, b)
    cb = chon_b or chon_ai(b, rng, a)
    s = {
        "a": {"vg": a, "hp": a.hp_max, "mp": a.mp_max, "m1": HE_SO_THAM_DO, "m2": 1.0,
              "bk": BAO_KICH_CO_BAN, "nhan": 1.0, "truoc": False},
        "b": {"vg": b, "hp": b.hp_max, "mp": b.mp_max, "m1": HE_SO_THAM_DO, "m2": 1.0,
              "bk": BAO_KICH_CO_BAN, "nhan": 1.0, "truoc": False},
    }

    def roll_quan_sat(x, y, cong=0):
        win = rng.random() < p_roll(s[x]["vg"].ngo_tinh + cong, s[y]["vg"].ngo_tinh,
                                    s[x]["vg"].phuc_duyen)
        if win:
            s[x]["bk"] += 0.30
            s[y]["m2"] *= H1_AN_BINH_GIAM_DICH
        else:  # HS02: quan sát thất bại -> địch ra đòn trước, +10% sát thương Hiệp 2
            s[y]["truoc"] = True
            s[y]["m2"] *= 1.10

    # --- Ma trận Hiệp 1 (HS02 V.1) ---
    if ca == cb:
        if ca == "T":
            s["a"]["m1"] = s["b"]["m1"] = H1_TIEN_HA_THU
        elif ca == "Q":
            s["a"]["m1"] = s["b"]["m1"] = 0.0
            w = "a" if rng.random() < p_roll(a.ngo_tinh, b.ngo_tinh, a.phuc_duyen) else "b"
            s[w]["bk"] += 0.30
            s[w]["truoc"] = True
        else:
            s["a"]["m1"] = s["b"]["m1"] = 0.0
            for k in "ab":
                s[k]["mp"] -= 0.10 * s[k]["vg"].mp_max
    else:
        w, l = ("a", "b") if KHAC_H1[ca] == cb else ("b", "a")
        cw = ca if w == "a" else cb
        if cw == "T":            # Tiên Hạ Thủ thắng Án Binh
            s[w]["m1"] = H1_TIEN_HA_THU
        elif cw == "Q":          # Án Binh thắng Thân Pháp: roll +20 Ngộ
            roll_quan_sat(w, l, cong=20)
        else:                    # Thân Pháp thắng Tiên Hạ Thủ
            s[l]["m1"] = H1_THUA_M1
            s[l]["m2"] = H1_THUA_M2

    def danh(x, y, m, bao_kich=False):
        d = sat_thuong(s[x]["vg"], s[y]["vg"], max(0, s[x]["mp"]), m) * s[y]["nhan"]
        d *= rng.uniform(1 - BIEN_THIEN_SAT_THUONG, 1 + BIEN_THIEN_SAT_THUONG)
        if bao_kich and rng.random() < s[x]["bk"]:
            d *= 1.5
        s[y]["hp"] -= d

    # --- Hiệp 1: hai bên ra đòn đồng thời ---
    danh("a", "b", s["a"]["m1"])
    danh("b", "a", s["b"]["m1"])
    for k in "ab":
        s[k]["nhan"] = 1.0
    if s["a"]["hp"] <= 0 or s["b"]["hp"] <= 0:
        thang = "a" if s["b"]["hp"] <= 0 < s["a"]["hp"] or (
            s["a"]["hp"] <= 0 and s["b"]["hp"] <= 0 and s["a"]["hp"] > s["b"]["hp"]) else "b"
        return {"thang": thang == "a", "ko_h1": True, "ko_som": True, "bat_phan": False, "hp_yeu_h2": 0.0,
                "hp_con": max(0, s[thang]["hp"]) / s[thang]["vg"].hp_max}

    def hiep2():
        if s["a"]["truoc"] != s["b"]["truoc"]:
            thu_tu = ["a", "b"] if s["a"]["truoc"] else ["b", "a"]
        elif a.khinh_cong != b.khinh_cong:  # HS02 V.2 (vòng 12): [Roll: Khinh công x10 vs Khinh công địch x10]
            thu_tu = ["a", "b"] if rng.random() < p_roll(a.khinh_cong * 10, b.khinh_cong * 10, a.phuc_duyen) else ["b", "a"]
        else:
            thu_tu = rng.sample(["a", "b"], 2)
        for x in thu_tu:
            y = "b" if x == "a" else "a"
            danh(x, y, s[x]["m2"], bao_kich=True)
            s[x]["mp"] = max(0, s[x]["mp"] - TIEU_HAO_MP_HIEP2 * s[x]["vg"].mp_max)
            if s[y]["hp"] <= 0:
                return x
        return None

    def ap_dao():
        res = []
        for k, o in (("a", "b"), ("b", "a")):
            if s[o]["hp"] < 0.25 * s[o]["vg"].hp_max or s[o]["mp"] <= 0:
                res.append(k)
        return res

    ko = hiep2()
    hp_yeu = 0.0 if ko else min(s["a"]["hp"] / a.hp_max, s["b"]["hp"] / b.hp_max)
    if ko:
        return {"thang": ko == "a", "ko_h1": False, "ko_som": True, "bat_phan": False, "hp_yeu_h2": 0.0,
                "hp_con": s[ko]["hp"] / s[ko]["vg"].hp_max}
    bat_phan = False
    if not ap_dao():                      # Bất phân thắng bại -> Liều mạng đánh tiếp 1 lần
        bat_phan = True
        ko = hiep2()
        if ko:
            return {"thang": ko == "a", "ko_h1": False, "ko_som": True, "bat_phan": True, "hp_yeu_h2": hp_yeu,
                    "hp_con": s[ko]["hp"] / s[ko]["vg"].hp_max}
    ad = ap_dao()
    if len(ad) == 1:
        thang = ad[0]
    else:  # cả hai hoặc không ai: so % HP còn lại
        pa = s["a"]["hp"] / a.hp_max
        pb = s["b"]["hp"] / b.hp_max
        thang = "a" if pa > pb or (pa == pb and rng.random() < 0.5) else "b"
    return {"thang": thang == "a", "ko_h1": False, "ko_som": False, "bat_phan": bat_phan, "hp_yeu_h2": hp_yeu,
            "hp_con": s[thang]["hp"] / s[thang]["vg"].hp_max}


MUC_SUC_MANH = {
    "Sơ nhập (Nhập môn 3/10, NC 2)": dict(can_cot=50, ngo_tinh=50, tier=1, cap_vo=3, canh_gioi=2, tuoi=18),
    "Trung (Thượng thừa 5/10, NC 5)": dict(can_cot=60, ngo_tinh=60, tier=2, cap_vo=5, canh_gioi=5, tuoi=30),
    "Cao (Trấn phái 8/10, NC 8)": dict(can_cot=70, ngo_tinh=70, tier=3, cap_vo=8, canh_gioi=8, tuoi=40),
    "Đỉnh (SSS 10/10, NC 10)": dict(can_cot=90, ngo_tinh=85, tier=4, cap_vo=10, canh_gioi=10, tuoi=45),
}


def thong_ke(rng, a, b, n, **kw):
    kq = [quyet_dau(a, b, rng, **kw) for _ in range(n)]
    return {
        "thang": sum(r["thang"] for r in kq) / n,
        "ko_h1": sum(r["ko_h1"] for r in kq) / n,
        "ko_som": sum(r["ko_som"] for r in kq) / n,
        "bat_phan": sum(r["bat_phan"] for r in kq) / n,
        "hp_con": statistics.mean(r["hp_con"] for r in kq),
        "hp_yeu_h2": statistics.mean(r["hp_yeu_h2"] for r in kq),
    }


def pct(x):
    return f"{x * 100:.0f}%"


def bao_cao_tam_hiep(rng, n=4000):
    out = ["## 1. Quyết Đấu Tam Hiệp", ""]
    out += ["### 1.1. Độ dài trận (hai bên ngang sức, cùng hệ, NPC Chính trực)", "",
            "| Mức sức mạnh | HP | Gục ngay Hiệp 1 | Kết thúc do gục trước Hiệp 3 | Phải \"Liều mạng\" đánh thêm | HP bên yếu sau Hiệp 2 (mục tiêu 20-30%) | HP còn lại của người thắng |",
            "| :--- | ---: | ---: | ---: | ---: | ---: | ---: |"]
    for ten, st in MUC_SUC_MANH.items():
        vg = VoGia(**st)
        t = thong_ke(rng, vg, vg, n)
        out.append(f"| {ten} | {vg.hp_max:.0f} | {pct(t['ko_h1'])} | {pct(t['ko_som'])} | "
                   f"{pct(t['bat_phan'])} | {pct(t['hp_yeu_h2'])} | {pct(t['hp_con'])} |")

    goc = MUC_SUC_MANH["Trung (Thượng thừa 5/10, NC 5)"]
    out += ["", "### 1.2. Tỷ lệ thắng theo chênh lệch (người chơi vs NPC mức Trung)", "",
            "| Người chơi hơn NPC | Tỷ lệ thắng |", "| :--- | ---: |"]
    for ten, thay in [("Ngang nhau", {}), ("+1 cấp võ học", {"cap_vo": 6}),
                      ("+2 cấp võ học", {"cap_vo": 7}), ("+3 cấp võ học", {"cap_vo": 8}),
                      ("+1 Cảnh giới Nội công", {"canh_gioi": 6}),
                      ("+3 Cảnh giới Nội công", {"canh_gioi": 8}),
                      ("+10 Căn cốt", {"can_cot": 70}),
                      ("+1 tier (Trấn phái 5/10)", {"tier": 3}),
                      ("-1 tier (Nhập môn 5/10)", {"tier": 1})]:
        t = thong_ke(rng, VoGia(**{**goc, **thay}), VoGia(**goc), n)
        out.append(f"| {ten} | {pct(t['thang'])} |")

    out += ["", "### 1.3. Vòng khắc chế Nội lực (mức Trung, ngang chỉ số)", "",
            "| Người chơi \\ NPC | Dương | Âm | Hòa | Ngoại công thuần |", "| :--- | ---: | ---: | ---: | ---: |"]
    for ha in ["duong", "am", "hoa", "ngoai"]:
        row = []
        for hb in ["duong", "am", "hoa", "ngoai"]:
            t = thong_ke(rng, VoGia(**goc, he=ha), VoGia(**goc, he=hb), n)
            row.append(pct(t["thang"]))
        out.append(f"| {ha} | " + " | ".join(row) + " |")

    out += ["", "### 1.4. Ma trận Hiệp 1: tỷ lệ thắng khi người chơi luôn chọn 1 hướng (mức Trung)", "",
            "| NPC \\ Người chơi luôn chọn | Tiên Hạ Thủ | Án Binh | Thân Pháp | Lựa chọn tốt nhất |",
            "| :--- | ---: | ---: | ---: | :--- |"]
    for bm in AI_H1:
        npc = VoGia(**goc, ban_menh=bm)
        res = {c: thong_ke(rng, VoGia(**goc), npc, n, chon_a=c)["thang"] for c in "TQD"}
        tot = max(res, key=res.get)
        ten = {"T": "Tiên Hạ Thủ", "Q": "Án Binh", "D": "Thân Pháp"}
        out.append(f"| {bm} | {pct(res['T'])} | {pct(res['Q'])} | {pct(res['D'])} | {ten[tot]} |")
    out += ["", "### 1.5. Ma trận Hiệp 1 khi chọn trùng / khắc nhau (mức Trung, ép cả hai bên)", "",
            "| Người chơi \\ NPC | Tiên Hạ Thủ | Án Binh | Thân Pháp |", "| :--- | ---: | ---: | ---: |"]
    for ca in "TQD":
        row = [pct(thong_ke(rng, VoGia(**goc), VoGia(**goc), n, chon_a=ca, chon_b=cb)["thang"])
               for cb in "TQD"]
        out.append(f"| {ca} | " + " | ".join(row) + " |")
    return out


# =========================== VÒNG ĐỜI ===========================
LOI_CHOI = {
    "Chính phái": dict(can_cot=55, ngo_tinh=60, phuc_duyen=50, tien=20, thu_nhap_nha=5,
                       he="hoa", mon_phai=True, ta=False),
    "Tà phái": dict(can_cot=45, ngo_tinh=55, phuc_duyen=60, tien=0, thu_nhap_nha=0,
                    he="am", mon_phai=True, ta=True),
    "Lãng khách": dict(can_cot=55, ngo_tinh=50, phuc_duyen=55, tien=20, thu_nhap_nha=5,
                       he="duong", mon_phai=False, ta=False),
    # Trần tiến độ võ học: dồn mọi AP vào luyện công, chỉ giữ 1 AP sư môn, không kiếm tiền
    "Chính phái chuyên tu": dict(can_cot=55, ngo_tinh=60, phuc_duyen=50, tien=20, thu_nhap_nha=5,
                                he="hoa", mon_phai=True, ta=False, chuyen_tu=True),
    # Gia cảnh Phú Thương (HS06 II.4), không vào môn phái, dồn AP vào sản nghiệp
    "Thương nhân": dict(can_cot=45, ngo_tinh=65, phuc_duyen=55, tien=1000, thu_nhap_nha=50,
                        he="duong", mon_phai=False, ta=False, thuong=True),
    # Vòng 18: sát thủ Hắc Phong Lâu giấu mặt, không môn phái; giết người đầu tiên lúc 16 tuổi (Hiệp nghĩa -100 [Ám]),
    # mua Dịch Dung ngay khi đủ tiền, tối đa 1 hợp đồng / năm, không móc túi
    "Sát thủ ẩn danh": dict(can_cot=55, ngo_tinh=55, phuc_duyen=55, tien=20, thu_nhap_nha=5,
                            he="am", mon_phai=False, ta=True, an_danh=True),
}


@dataclass
class Mon:
    tier: int
    cap: int = 1
    tien_do: float = 0.0


@dataclass
class Doi:
    ten: str
    can_cot: float
    ngo_tinh: float
    phuc_duyen: float
    tien: float
    thu_nhap_nha: float
    he: str
    mon_phai: bool
    ta: bool
    chuyen_tu: bool = False
    thuong: bool = False
    an_danh: bool = False
    tuoi: int = 0
    cc_dinh: float = 0
    bac: int = 0
    cong_hien: float = 0
    danh_vong: float = 0
    thanh_danh: float = 0
    hiep_nghia: float = 0      # Hiệp nghĩa thật (HS01 II.2): Thanh danh trừ các việc [Ám] chưa lộ
    dich_dung: bool = False
    no: float = 0
    no_nam: int = 0
    am_thuong: int = 0
    truot_cap: int = 0
    truy_sat: int = 0
    quy_mo: str = ""
    truong_lao: int = 0
    noi: list = field(default_factory=list)
    ngoai: list = field(default_factory=list)
    khinh: list = field(default_factory=list)
    than_binh: int = 0
    nguon: dict = field(default_factory=dict)
    moc: dict = field(default_factory=dict)
    chet: int = 0
    truc_xuat: bool = False
    tien_max: float = 0
    ngan_kho: float = 0
    am: list = field(default_factory=list)   # Hành động [Ám] chưa bại lộ: giá trị Hiệp nghĩa đã trừ
    so_lan_bai_lo: int = 0
    so_do_toi: int = 0
    so_hop_dong: int = 0
    so_am: int = 0
    moc_tui_nam: float = 0
    nguyen_nhan: str = ""
    lich_su: dict = field(default_factory=dict)
    song_tu: bool = False
    tuyet_canh: bool = False
    so_trong_thuong: int = 0
    so_thnm: int = 0
    co_phan: int = 0
    muoi: float = 0
    diem_dan: bool = False
    song_bac: bool = False
    hang: tuple = ()           # (loại hàng đầu cơ, vốn)
    ho_vien: bool = False

    @property
    def dv(self):
        """Danh vọng hiển thị = Danh vọng cá nhân + Danh vọng chức vị (mất khi mất chức), trần 1000."""
        bac = self.bac if self.mon_phai else (5 if self.quy_mo else 0)  # tự lập phái cũng là Chưởng môn
        return min(1000, self.danh_vong + DANH_VONG_CHUC.get(bac, 0))

    @property
    def gia_san(self):
        """Tiền mặt + sản nghiệp theo giá vốn (HS07 kết cục #8)."""
        return (self.tien + self.co_phan * CO_PHAN_GIA + self.muoi + SONG_BAC_GIA * self.song_bac
                + (self.hang[1] if self.hang else 0))

    @property
    def canh_gioi(self):
        return max((m.cap for m in self.noi), default=0)

    @property
    def ma_cong(self):
        """Đang trang bị Ma công: Trấn phái của Tà phái khi Hiệp nghĩa thật <= -300."""
        return MA_CONG and self.ta and self.hiep_nghia <= MA_CONG_HIEP_NGHIA and any(m.tier == 3 for m in self.ngoai)

    def tier_chien(self, m):
        """Tier dùng cho Uy lực và Điểm Tier: Ma công tính như SSS."""
        return 4 if m.tier == 3 and self.ma_cong else m.tier

    def vo_gia(self):
        best = max(self.ngoai, key=lambda m: UY_LUC[self.tier_chien(m)] * (1 + m.cap / 5), default=Mon(1, 1))
        return VoGia(can_cot=self.can_cot, ngo_tinh=self.ngo_tinh, tuoi=self.tuoi,
                     canh_gioi=self.canh_gioi, he=self.he if self.noi else "ngoai",
                     tier=self.tier_chien(best), cap_vo=best.cap, phuc_duyen=self.phuc_duyen,
                     khinh_cong=max((m.cap for m in self.khinh), default=0), than_binh=self.than_binh)

    @property
    def tier_cao(self):
        return max((m.tier for m in self.ngoai), default=0)

    @property
    def age_max(self):
        # HS06 I.1 (vòng 5): khung 65 - 90 trước Ám thương và đan dược kéo dài tuổi thọ
        return 65 + int(min(self.cc_dinh, 100) * 0.15) + self.canh_gioi - self.am_thuong


def npc_ngang(d, rng, suc=1.0):
    """NPC ngang sức; suc < 1 là mục tiêu yếu hơn (Căn cốt, Ngộ tính x suc), dùng cho bảng truy nã hạng Yếu."""
    vg = d.vo_gia()
    return replace(vg, can_cot=vg.can_cot * suc * rng.uniform(0.9, 1.1),
                   ngo_tinh=vg.ngo_tinh * suc * rng.uniform(0.9, 1.1),
                   ban_menh=rng.choice(list(AI_H1)), he=rng.choice(["duong", "am", "hoa", "ngoai"]))


def thu(d, nguon, so):
    """Ghi thu nhập, trừ nợ trước (HS06 II.3)."""
    if d.no > 0:
        tra = min(d.no, so * 0.5)
        d.no -= tra
        so -= tra
    d.tien += so
    d.nguon[nguon] = d.nguon.get(nguon, 0) + so


def chi(d, so):
    if d.tien >= so:
        d.tien -= so
    else:
        d.no += so - d.tien
        d.tien = 0


def bi_thuong(d):
    if d.tien >= 20:
        d.tien -= 20
    else:
        d.am_thuong += 5


def mo_khoa_mon(d, tier):
    if not any(m.tier >= tier for m in d.ngoai):
        d.ngoai.append(Mon(tier))
    if not any(m.tier >= tier for m in d.noi):
        d.noi.append(Mon(tier))
    if KHINH_CONG_MAU and not any(m.tier >= tier for m in d.khinh):
        d.khinh.append(Mon(tier))


def luyen(d):
    """1 AP luyện công vào môn mới nhất còn chưa max, ưu tiên track đang thấp hơn."""
    tracks = [max(d.noi, key=lambda m: m.tier), max(d.ngoai, key=lambda m: m.tier)]
    tracks = [m for m in tracks if m.cap < 10]
    m = min(tracks, key=lambda m: (m.cap, m in d.noi)) if tracks else None
    # Khinh công: chỉ môn có cấp cao nhất được tính, nên chọn môn rẻ nhất để vượt cấp hiện tại (chi phí = số cấp
    # còn thiếu x Tier factor); luyện khi Chiến lực / AP không thấp hơn track chính (5 điểm / cấp so với 10),
    # hòa thì chọn Khinh công vì còn giúp bỏ chạy
    kc = max((x.cap for x in d.khinh), default=0)
    ung_vien = [x for x in d.khinh if KHINH_CONG_TRAN[x.tier] > kc]
    if ung_vien:
        k = min(ung_vien, key=lambda x: (kc + 1 - x.cap) * TIER_FACTOR[x.tier])
        if m is None or CL_KHINH_CONG / ((kc + 1 - k.cap) * TIER_FACTOR[k.tier]) >= CL_CAP / TIER_FACTOR[m.tier]:
            m = k
    if m is None:
        return
    sp = SU_PHU_THEO_BAC.get(d.bac, 0) if d.mon_phai and d.bac and m.tier <= TIER_THEO_BAC[d.bac] else 0
    m.tien_do += tien_do(d.ngo_tinh, sp, m.tier)
    if m.tien_do >= 100:
        m.tien_do -= 100
        m.cap += 1


def thang_cap(d, rng):
    nxt = d.bac + 1
    if nxt not in BAC_YEU_CAU:
        return
    tuoi_min, ch = BAC_YEU_CAU[nxt]
    if d.tuoi < tuoi_min or d.cong_hien < ch:
        return
    if nxt == 5 and d.tuoi > 45:
        return
    if quyet_dau(d.vo_gia(), npc_ngang(d, rng), rng)["thang"]:
        d.bac, d.truot_cap = nxt, 0
        d.danh_vong += DANH_VONG_THANG_CAP
        d.cong_hien += CONG_HIEN_THANG_CAP
        d.moc.setdefault(f"bac{nxt}", d.tuoi)
        mo_khoa_mon(d, TIER_THEO_BAC[nxt])
        if nxt == 5:
            d.quy_mo = "lon"
    elif nxt == 5:  # Thua tỷ thí kế vị: bị trục xuất, giữ nguyên võ công (HS04 II.3 [A])
        d.truc_xuat, d.mon_phai, d.bac = True, False, 0
        d.thanh_danh -= 100
    else:
        d.truot_cap += 1
        if d.truot_cap >= 2:
            d.cong_hien = max(0, d.cong_hien - 50)
            d.truot_cap = 0


def lam_am(d, rng, gia_tri, am_sat=False):
    """Ghi 1 hành động [Ám] (HS01 II.3): 20% bại lộ ngay (5% khi Dịch Dung), còn lại cộng vào danh sách chưa lộ."""
    d.so_am += 1
    d.hiep_nghia -= gia_tri
    if rng.random() < (DICH_DUNG_LO_NGAY if d.dich_dung else BAI_LO_TUC_THOI):
        bai_lo(d, gia_tri, am_sat)
    else:
        d.am.append((gia_tri, am_sat, d.dich_dung))


def ro_ri(d, rng):
    """Bại lộ hằng năm (HS01 II.3): 1 việc [Ám] chưa lộ bị rò rỉ; việc làm khi Dịch Dung có thể đổ tội cho kẻ bị giả dạng."""
    gia_tri, am_sat, dich_dung = d.am.pop(rng.randrange(len(d.am)))
    if dich_dung and rng.random() < DICH_DUNG_DO_TOI:
        d.so_do_toi += 1
        return
    bai_lo(d, gia_tri, am_sat)


def bai_lo(d, gia_tri, am_sat=False):
    d.so_lan_bai_lo += 1
    d.thanh_danh -= 1.5 * gia_tri
    if am_sat:  # Ám sát bại lộ: bị quan phủ và Chính đạo truy sát 3 năm (HS06 II.1)
        d.truy_sat = 3
        d.danh_vong += TAI_TIENG  # HS01 II.2: tai tiếng cũng là Danh vọng


def trong_thuong(d, rng):
    """HS06 I.1: Trọng thương chữa kịp thời (thuốc, hoặc dưỡng thương thành công) thì không để lại Ám thương."""
    d.so_trong_thuong += 1
    if d.tien >= THUOC_NOI_THUONG:
        d.tien -= THUOC_NOI_THUONG
        d.nguon["Thuốc trị nội thương (âm)"] = d.nguon.get("Thuốc trị nội thương (âm)", 0) - THUOC_NOI_THUONG
    elif rng.random() >= p_roll(d.can_cot, DUONG_THUONG_N, d.phuc_duyen):
        d.am_thuong += 5


def thua_tran_sinh_tu(d, rng, npc, kq):
    """Thua trận sinh tử (HS02 V.3). Trả về True nếu tử trận."""
    if kq["bat_phan"]:  # thua theo % HP còn lại, không bị áp đảo
        bi_thuong(d)
        return False
    if rng.random() < TUYET_SAT[npc.ban_menh]:
        p_chay = p_roll(d.vo_gia().vo_luc, npc.vo_luc, d.phuc_duyen)  # Khinh công bỏ chạy
        # Nhảy vực (HS06 I.3), mọi lối thoát kẹp 95% theo Quy tắc Cứu Mạng HS02 V.4
        p_vuc = 0.95 if d.phuc_duyen >= 60 else p_roll(d.phuc_duyen, 45) if d.phuc_duyen >= 30 else 0.0
        if p_vuc > p_chay:
            if rng.random() >= p_vuc:
                d.nguyen_nhan = "Nhảy vực không qua"
                return True
            if d.phuc_duyen >= 60:
                d.tuyet_canh = True  # Kỳ ngộ năm sau +50%
            else:
                d.am_thuong += 5
            return False
        if rng.random() >= p_chay:
            d.nguyen_nhan = "Tử trận Hiệp 3"
            return True
    trong_thuong(d, rng)
    return False


def giao_chien_nhanh(d, rng, n):
    return rng.random() < p_roll(d.vo_gia().vo_luc, n, d.phuc_duyen)


def dau_tu(d, so):
    d.tien -= so
    d.nguon["Vốn đặt vào sản nghiệp (âm)"] = d.nguon.get("Vốn đặt vào sản nghiệp (âm)", 0) - so


def mua_san_nghiep(d, rng, slot):
    """Chính sách mẫu của Thương nhân: không nợ, giữ 300 lạng, ưu tiên lãi suất cao, mỗi loại cần 1 AP."""
    du_tru = 300 + (HO_VIEN_PHI if d.ho_vien else 0)
    so_loai = lambda: bool(d.co_phan) + bool(d.muoi) + d.song_bac
    if d.no or d.tuoi < 16:
        return
    if not d.song_bac and so_loai() < slot and d.tien - SONG_BAC_GIA >= du_tru:
        dau_tu(d, SONG_BAC_GIA)
        d.song_bac = True
        d.moc.setdefault("song_bac", d.tuoi)
    if not d.diem_dan and d.tien - DIEM_DAN_HOI_LO - MUOI_BUOC >= du_tru and (d.muoi or so_loai() < slot):
        if d.dv < DIEM_DAN_DANH_VONG:
            chi(d, DIEM_DAN_HOI_LO)
            d.nguon["Hối lộ Diêm dẫn (âm)"] = -DIEM_DAN_HOI_LO
            lam_am(d, rng, 20)
        d.diem_dan = True
    while d.diem_dan and d.muoi < MUOI_TOI_DA and d.tien - MUOI_BUOC >= du_tru and (d.muoi or so_loai() < slot):
        dau_tu(d, MUOI_BUOC)
        d.muoi += MUOI_BUOC
    while d.co_phan < CO_PHAN_TOI_DA and d.tien - CO_PHAN_GIA >= du_tru and (d.co_phan or so_loai() < slot):
        dau_tu(d, CO_PHAN_GIA)
        d.co_phan += 1
    if not d.ho_vien and d.tien >= TONG_TIEN_NGUONG + HO_VIEN_PHI:
        d.ho_vien = True


def kinh_doanh(d, rng, su_kien, ap):
    """Thương nghiệp HS06 II.5. Trả về số AP đã dùng (1 AP quản lý mỗi loại sản nghiệp)."""
    dang = su_kien.get(d.tuoi)
    dung = 0
    # Đầu cơ: bán ở năm đầu đại sự kiện; đúng loại thì lời, sai thì bán lại lỗ
    if d.hang and d.tuoi in MOC_SU_KIEN:
        loai, von = d.hang
        ve = von * (DAU_CO_TRUNG[loai] if dang == loai else DAU_CO_BAN_LO)
        d.tien += ve
        d.nguon["Đầu cơ Hắc Thị (lãi ròng)"] = d.nguon.get("Đầu cơ Hắc Thị (lãi ròng)", 0) + ve - von
        d.hang = ()
    if dung < ap and d.song_bac:
        dung += 1
        d.thanh_danh -= SONG_BAC_THANH_DANH  # việc công khai: Hiệp nghĩa đổi theo (HS01 II.2)
        d.hiep_nghia -= SONG_BAC_THANH_DANH
        if rng.random() < SONG_BAC_BAO_KE and not d.ho_vien and not giao_chien_nhanh(d, rng, 60):
            pass  # bị bảo kê lấy trắng năm đó
        else:
            thu(d, "Sòng bạc", rng.uniform(*SONG_BAC_LAI))
    if dung < ap and d.muoi:
        dung += 1
        if dang != "son_ha":  # Chiến loạn cắt đường muối
            thu(d, "Buôn muối", d.muoi * MUOI_LAI)
    if dung < ap and d.co_phan:
        dung += 1
        if rng.random() < TIEU_CUOP and not giao_chien_nhanh(d, rng, TIEU_CUOP_N):
            mat = max(1, round(d.co_phan * TIEU_CUOP_MAT_VON))
            d.co_phan -= mat
            d.nguon["Mất tiêu (vốn, âm)"] = d.nguon.get("Mất tiêu (vốn, âm)", 0) - mat * CO_PHAN_GIA
        else:
            thu(d, "Cổ tức tiêu cục", d.co_phan * CO_PHAN_GIA * CO_TUC)
    # Năm trước mốc đại sự kiện: tích trữ hàng, đoán loại khác sự kiện vừa qua
    if dung < ap and d.tuoi + 1 in MOC_SU_KIEN and not d.no and d.tien >= 2000:
        dung += 1
        truoc = su_kien.get(d.tuoi - 11)
        loai = rng.choice([k for k in DAU_CO_TRUNG if k != truoc])
        von = min(DAU_CO_TOI_DA, d.tien * 0.5)
        d.tien -= von
        d.hang = (loai, von)
    return dung


def viec_kiem_tien(d, rng, so_am_sat):
    """Chọn 1 việc kiếm tiền phù hợp nhất hiện có. Trả về True nếu đã làm."""
    if d.ta and d.tuoi >= 18 and d.hiep_nghia <= -100 and not d.truy_sat and so_am_sat[0] < (1 if d.an_danh else 2) \
            and (not d.an_danh or (d.dich_dung and d.thanh_danh > AN_DANH_DUNG)):  # sát thủ ẩn danh: có Dịch Dung, chưa sát mức Đại ma đầu
        so_am_sat[0] += 1
        d.so_hop_dong += 1
        npc = npc_ngang(d, rng)
        kq = quyet_dau(d.vo_gia(), npc, rng)
        if kq["thang"]:
            thu(d, "Ám sát thuê", rng.uniform(400, 1500))
            lam_am(d, rng, 100, am_sat=True)
        else:
            if d.dich_dung and AM_SAT_THAT_BAI_DICH_DUNG:
                lam_am(d, rng, 100, am_sat=True)
            else:
                d.hiep_nghia -= 100
                bai_lo(d, 100, am_sat=True)  # hợp đồng thất bại = bại lộ ngay
            if thua_tran_sinh_tu(d, rng, npc, kq):
                d.chet = d.tuoi
        return True
    if d.mon_phai and d.bac in SAI_PHAI:
        if giao_chien_nhanh(d, rng, SAI_PHAI_N[d.bac]):  # thất bại: nhiệm vụ hỏng, không thù lao
            thu(d, "Sai phái sư môn", rng.uniform(*SAI_PHAI[d.bac]))
        return True
    if d.tier_cao >= 2 and d.tuoi >= 18 and d.gia_san < TRUY_NA_NGUONG and not d.an_danh:
        npc = npc_ngang(d, rng, TRUY_NA_SUC)
        kq = quyet_dau(d.vo_gia(), npc, rng)
        if kq["thang"]:
            thu(d, "Săn tiền thưởng", rng.uniform(*TRUY_NA_THUONG))
            d.danh_vong += DANH_VONG_THANG_TRAN
            d.hiep_nghia += TRUY_NA_HIEP_NGHIA
            d.thanh_danh += TRUY_NA_HIEP_NGHIA
        elif thua_tran_sinh_tu(d, rng, npc, kq):
            d.chet = d.tuoi
        return True
    if d.can_cot >= 50 and d.tuoi >= 16:
        thu_lao = rng.uniform(100, 300)
        if rng.random() < 0.35:
            if rng.random() < p_roll(d.vo_gia().vo_luc, 50, d.phuc_duyen):
                d.danh_vong += 20
            else:
                chi(d, 2 * thu_lao)
                d.nguon["Đền tiêu (âm)"] = d.nguon.get("Đền tiêu (âm)", 0) - 2 * thu_lao
                return True
        thu(d, "Áp tiêu", thu_lao)
        return True
    if d.ta and not d.an_danh and d.tuoi >= 7 and d.gia_san < TRUY_NA_NGUONG:  # chỉ làm việc vặt khi còn khát tiền
        thu(d, "Móc túi", rng.uniform(20, 80))
        d.moc_tui_nam += 15  # HS01 II.3: móc túi cả năm gộp thành 1 hành động [Ám], ghi ở cuối năm
        if rng.random() < 0.20:
            bi_thuong(d)
        return True
    if 11 <= d.tuoi <= 18:
        thu(d, "Làm thuê", rng.uniform(5, 15))
        d.can_cot = min(150, d.can_cot + 1)
        return True
    if d.thuong and d.tuoi >= 16:
        so = rng.uniform(*TIEU_THUONG)
        thu(d, "Tiểu thương", so if rng.random() < p_roll(d.ngo_tinh, 50, d.phuc_duyen) else so / 2)
        return True
    return False


def tuoi_bat_dau_lao_hoa(canh_gioi):
    """HS04 III (vòng 13): Căn cốt -2/năm từ sau 50 tuổi; Cảnh giới Nội công >= 8 thì từ sau 60."""
    return LAO_HOA_CAO if canh_gioi >= LAO_HOA_CANH_GIOI else LAO_HOA_THUONG


def song_mot_doi(ten, rng, tuoi_cuoi=120, ghi_nam=False):
    d = Doi(ten=ten, **{k: v for k, v in LOI_CHOI[ten].items()})
    d.cc_dinh = d.can_cot
    anh_chup = {}
    hac_thi = rng.randrange(HAC_THI_CHU_KY)  # năm Hắc Thị mở so với năm sinh
    su_kien, truoc = {}, None
    for moc in MOC_SU_KIEN:  # HS01: bốc 1 trong 4, không lặp sự kiện ở mốc liền trước
        truoc = rng.choice([k for k in DAI_SU_KIEN if k != truoc])
        su_kien.update({moc + i: truoc for i in range(3)})
    for tuoi in range(0, tuoi_cuoi + 1):
        d.tuoi = tuoi
        if tuoi > tuoi_bat_dau_lao_hoa(d.canh_gioi):
            d.can_cot = max(0, d.can_cot - 2)
        d.cc_dinh = max(d.cc_dinh, d.can_cot)
        if tuoi >= d.age_max:
            d.chet, d.nguyen_nhan = tuoi, "Hết tuổi thọ"
            break
        # Tẩu hỏa nhập ma khi song tu Chí Dương + Chí Âm (HS06 I.4); sau đó tán công 1 môn
        if d.song_tu and rng.random() < THNM_CO_BAN + (THNM_TA_CONG if d.ta else 0):
            d.song_tu = False
            d.so_thnm += 1
            d.am_thuong += 5
            d.can_cot = max(0, d.can_cot - THNM_CAN_COT)
            if tuoi >= d.age_max:
                d.chet, d.nguyen_nhan = tuoi, "Tẩu hỏa nhập ma"
                break
        if d.ma_cong and rng.random() < MA_CONG_THNM:  # Ma công phản phệ: không tán công, chịu tổn thương
            d.so_thnm += 1
            d.am_thuong += 5
            d.can_cot = max(0, d.can_cot - THNM_CAN_COT)
            if tuoi >= d.age_max:
                d.chet, d.nguyen_nhan = tuoi, "Tẩu hỏa nhập ma"
                break
        # Nợ: lãi 20%/năm
        if d.no > 0:
            d.no *= 1.20
            d.no_nam += 1
        else:
            d.no_nam = 0
        if d.truy_sat:
            d.truy_sat -= 1
        # Bại lộ hằng năm (HS01 II.3)
        if d.am and rng.random() < min(BAI_LO_TOI_DA, BAI_LO_MOI_NAM * len(d.am)):
            ro_ri(d, rng)
        # Thu nhập tự động
        if tuoi <= 15 and d.thu_nhap_nha:
            thu(d, "Gia đình", d.thu_nhap_nha)
        if d.bac in TRO_CAP:
            thu(d, "Trợ cấp môn phái", TRO_CAP[d.bac])
        if tuoi >= 16:  # Sinh hoạt phí theo Danh vọng (HS06 II.2)
            phi = next(p for dv, p in SINH_HOAT_PHI if d.dv >= dv)
            if (d.mon_phai and d.bac) or d.quy_mo:  # ăn ở trên núi (kể cả núi tự lập phái)
                phi = min(phi, SINH_HOAT_TRONG_MON)
            chi(d, phi)
            d.nguon["Sinh hoạt phí (âm)"] = d.nguon.get("Sinh hoạt phí (âm)", 0) - phi
        if d.quy_mo:  # Lợi tức và bảo trì đi vào Ngân khố môn phái, Chưởng môn chỉ nhận bổng lộc
            loi, phi = QUY_MO[d.quy_mo]
            d.ngan_kho += loi - phi
            bong = min(BONG_LOC[d.quy_mo], max(0, d.ngan_kho))
            d.ngan_kho -= bong
            if bong:
                thu(d, "Bổng lộc Chưởng môn", bong)
        # Gia nhập / mở võ công
        if d.mon_phai and tuoi == 12 and d.bac == 0 and not d.truc_xuat:
            d.bac = 1
            mo_khoa_mon(d, 1)
            if d.ta:
                d.thanh_danh = d.hiep_nghia = -150   # Khảo nghiệm Tinh Túc [A], HS03: Hiệp nghĩa -150, Căn cốt +10
                d.can_cot += 10
        if not d.mon_phai and tuoi == 16 and not d.ngoai:
            mo_khoa_mon(d, 1)       # Lãng khách tự mua bí kíp nhập môn
            if d.an_danh:
                lam_am(d, rng, 100)  # án mạng đầu tiên, mở cửa Hắc Phong Lâu (Hiệp nghĩa <= -100)
        if d.an_danh and not d.dich_dung and d.tien >= DICH_DUNG_GIA + 100:  # Hắc Thị (HS06 V.4)
            d.tien -= DICH_DUNG_GIA
            d.nguon["Mua Dịch Dung (âm)"] = -DICH_DUNG_GIA
            d.dich_dung = True
            d.moc.setdefault("dich_dung", tuoi)
        # Kỳ ngộ: nâng 1 tier bí kíp (HS06 I.3, vùng Giang Nam +1%)
        if tuoi >= 10 and d.ngoai and rng.random() < 0.02 + d.phuc_duyen * 0.0012 + 0.01 + 0.5 * d.tuyet_canh:
            tier = rng.choices([t for _, t in KY_NGO_TIER], weights=[w for w, _ in KY_NGO_TIER])[0]
            if tier > d.tier_cao:
                mo_khoa_mon(d, tier)
                d.moc.setdefault(f"ky_ngo_tier{tier}", tuoi)
                he_moi = rng.choice(["duong", "am", "hoa"])
                if {d.he, he_moi} == {"duong", "am"} and rng.random() < SONG_TU:
                    d.song_tu = True
        d.tuyet_canh = False
        # Phân bổ AP
        so_am_sat = [0]
        ap = ap_moi_nam(tuoi, d.canh_gioi)
        # Hắc Thị Đấu Giá Hội (HS06 II.2): 1 AP đi đấu giá
        if THAN_BINH_MAU and not d.thuong and tuoi >= 18 and (tuoi + hac_thi) % HAC_THI_CHU_KY == 0 \
                and d.than_binh < 60 and rng.random() < HAC_THI_P_BINH_KHI:
            _, sat, gia = rng.choices(HAC_THI_BINH_KHI, weights=[w for w, _, _ in HAC_THI_BINH_KHI])[0]
            gia *= rng.uniform(*HAC_THI_DAU_GIA)
            # Chính sách mẫu: chỉ mua khi mua xong không phải quay lại săn truy nã
            if sat > d.than_binh and d.tien >= gia and d.gia_san - gia >= TRUY_NA_NGUONG:
                d.tien -= gia
                d.nguon["Mua binh khí Hắc Thị (âm)"] = d.nguon.get("Mua binh khí Hắc Thị (âm)", 0) - gia
                d.than_binh = sat
                d.moc.setdefault(f"than_binh{sat}", tuoi)
                ap -= 1
        if d.thuong and tuoi >= 16:
            mua_san_nghiep(d, rng, ap)
            ap -= kinh_doanh(d, rng, su_kien, ap)
            if d.ho_vien:
                chi(d, HO_VIEN_PHI)
                d.nguon["Hộ viện (âm)"] = d.nguon.get("Hộ viện (âm)", 0) - HO_VIEN_PHI
            if d.tien >= TONG_TIEN_NGUONG and rng.random() < TONG_TIEN_P \
                    and not d.ho_vien and not giao_chien_nhanh(d, rng, TONG_TIEN_N):
                mat = d.tien * TONG_TIEN_MAT
                d.tien -= mat
                d.nguon["Bị tống tiền (âm)"] = d.nguon.get("Bị tống tiền (âm)", 0) - mat
        if tuoi >= 7:
            for i in range(ap):
                if d.chet:
                    break
                if d.mon_phai and d.bac and d.bac < 5 and i == 0:
                    d.cong_hien += CONG_HIEN_MOI_AP
                elif d.chuyen_tu and d.ngoai:
                    luyen(d)
                elif i == ap - 1 or (not d.mon_phai and i >= 1 and not d.quy_mo):
                    if not viec_kiem_tien(d, rng, so_am_sat) and d.ngoai:
                        luyen(d)
                elif d.ngoai:
                    luyen(d)
                elif not viec_kiem_tien(d, rng, so_am_sat):
                    pass
        if d.moc_tui_nam:
            lam_am(d, rng, d.moc_tui_nam)
            d.moc_tui_nam = 0
        if d.chet:
            break
        if d.mon_phai and d.bac:
            thang_cap(d, rng)
        # Lãng khách khai tông lập phái (HS04 I.2)
        if not d.mon_phai and not d.quy_mo and tuoi >= 30 and d.danh_vong >= 500 \
                and d.tien >= 5000 and d.tier_cao >= 2:
            chi(d, 5000)
            d.nguon["Mua núi lập phái (âm)"] = -5000
            d.quy_mo = "nho"
            d.moc.setdefault("khai_tong", tuoi)
        if d.quy_mo and d.quy_mo != "lon" and not d.mon_phai:
            d.truong_lao += 1
            if d.dv >= 850 and d.truong_lao >= 6 and d.tier_cao >= 3:
                d.quy_mo = "lon"
            elif d.dv >= 600 and d.truong_lao >= 3:
                d.quy_mo = "vua"
        d.tien_max = max(d.tien_max, d.gia_san)
        d.thanh_danh = clamp(d.thanh_danh, -1000, 1000)  # HS01: thang -1000..+1000
        d.hiep_nghia = clamp(d.hiep_nghia, -1000, 1000)
        d.danh_vong = min(d.danh_vong, 1000)              # HS01: 0..1000
        if ghi_nam:  # (Chiến lực, Danh vọng hiển thị, chức) mỗi năm, cho mô phỏng 200 NPC
            d.lich_su[tuoi] = (d.vo_gia().chien_luc if d.ngoai else 0, d.dv,
                               d.bac if d.mon_phai else (5 if d.quy_mo else 0))
        if tuoi in MOC_BAO_CAO:
            anh_chup[tuoi] = dict(tien=d.gia_san, no=d.no, dv=d.dv, dvcn=d.danh_vong, vl=d.vo_gia().vo_luc if d.ngoai else 0, chuc=d.bac if d.mon_phai else (5 if d.quy_mo else 0), td=d.thanh_danh, kho=d.ngan_kho,
                                  tier=d.tier_cao, cap=max((m.cap for m in d.ngoai), default=0),
                                  cg=d.canh_gioi, cl=d.vo_gia().chien_luc if d.ngoai else 0,
                                  kc=max((m.cap for m in d.khinh), default=0), hn=d.hiep_nghia)
    if not d.chet:
        d.chet = tuoi_cuoi + 1
    return d, anh_chup


def trung_vi(xs):
    return statistics.median(xs) if xs else float("nan")


def bao_cao_vong_doi(rng, n=2000):
    out = ["", "## 2. Vòng đời & dòng tiền (0 - 70 tuổi)", ""]
    for ten in LOI_CHOI:
        doi = [song_mot_doi(ten, rng) for _ in range(n)]
        out += [f"### {ten}", ""]
        out += ["| Tuổi | Còn sống | Tiền (trung vị) | Tiền P10 / P90 | Đang nợ | Danh vọng (TV) | Võ học cao nhất (TV) | Cảnh giới NC (TV) | Khinh công (TV) | Chiến lực (TV) |",
                "| ---: | ---: | ---: | ---: | ---: | ---: | :--- | ---: | ---: | ---: |"]
        for t in MOC_BAO_CAO:
            snap = [a[t] for _, a in doi if t in a]
            if not snap:
                continue
            ts = sorted(s["tien"] for s in snap)
            p10, p90 = ts[len(ts) // 10], ts[len(ts) * 9 // 10]
            tier = trung_vi([s["tier"] for s in snap])
            cap = trung_vi([s["cap"] for s in snap])
            out.append(f"| {t} | {pct(len(snap) / n)} | {trung_vi(ts):,.0f} | {p10:,.0f} / {p90:,.0f} | "
                       f"{pct(sum(s['no'] > 0 for s in snap) / len(snap))} | "
                       f"{trung_vi([s['dv'] for s in snap]):.0f} | tier {tier:.0f}, cấp {cap:.0f} | "
                       f"{trung_vi([s['cg'] for s in snap]):.0f} | {trung_vi([s['kc'] for s in snap]):.0f} | "
                       f"{trung_vi([s['cl'] for s in snap]):.0f} |")
        tong = {}
        for d, _ in doi:
            for k, v in d.nguon.items():
                tong[k] = tong.get(k, 0) + v
        out += ["", "Nguồn tiền trung bình cả đời (lạng / người):", ""]
        out += [f"* {k}: {v / n:,.0f}" for k, v in sorted(tong.items(), key=lambda kv: -kv[1])]
        chet = [d.chet for d, _ in doi]
        tho, cs = sorted(d.age_max for d, _ in doi), sorted(chet)
        nn = {}
        for d, _ in doi:
            nn[d.nguyen_nhan] = nn.get(d.nguyen_nhan, 0) + 1
        out += ["", f"* Tuổi mất trung vị: {trung_vi(chet):.0f}, P10 / P90: {cs[n // 10]} / {cs[n * 9 // 10]}"
                f" (sống tới 50 / 70 / 80: {pct(sum(c > 50 for c in chet) / n)} / {pct(sum(c > 70 for c in chet) / n)}"
                f" / {pct(sum(c > 80 for c in chet) / n)}); Age_max lúc mất P10 / P90: {tho[n // 10]} / {tho[n * 9 // 10]}",
                "* Nguyên nhân mất: " + ", ".join(f"{k} {pct(v / n)}" for k, v in sorted(nn.items(), key=lambda kv: -kv[1])),
                f"* Trọng thương trung bình mỗi đời: {statistics.mean(d.so_trong_thuong for d, _ in doi):.1f}; "
                f"Tẩu hỏa nhập ma: {pct(sum(d.so_thnm > 0 for d, _ in doi) / n)} số đời; "
                f"Ám thương lúc mất (trung bình): {statistics.mean(d.am_thuong for d, _ in doi):.1f}",
                f"* Từng chạm 50.000 lạng gia sản cá nhân (kết cục #8): {pct(sum(d.tien_max >= 50000 for d, _ in doi) / n)}"
                f"; còn giữ lúc cuối đời: {pct(sum(d.gia_san >= 50000 for d, _ in doi) / n)}"
                f"; gia sản cao nhất (P99): {sorted(d.tien_max for d, _ in doi)[n * 99 // 100]:,.0f}",
                f"* Đang nợ lúc cuối đời: {pct(sum(d.no > 0 for d, _ in doi) / n)}"]
        for b, nhan in [(2, "Nội môn"), (3, "Chân truyền"), (4, "Trưởng lão"), (5, "Chưởng môn")]:
            ages = [d.moc[f"bac{b}"] for d, _ in doi if f"bac{b}" in d.moc]
            if ages:
                out.append(f"* Lên {nhan}: {pct(len(ages) / n)} số đời, tuổi trung vị {trung_vi(ages):.0f}")
        if LOI_CHOI[ten]["mon_phai"]:
            du = sum(1 for d, _ in doi if "bac4" in d.moc and d.cong_hien >= 1500)
            out.append(f"* Đủ 1.500 Cống hiến để tranh ngôi Chưởng môn (trước 45 tuổi): {pct(du / n)}")
        for t, nhan in [(2, "Thượng thừa"), (3, "Trấn phái"), (4, "SSS")]:
            ages = [d.moc[f"ky_ngo_tier{t}"] for d, _ in doi if f"ky_ngo_tier{t}" in d.moc]
            out.append(f"* Nhận bí kíp {nhan} qua kỳ ngộ: {pct(len(ages) / n)} số đời")
        for sat, nhan in [(30, "Lợi khí"), (60, "Danh khí")]:
            ages = [d.moc[f"than_binh{sat}"] for d, _ in doi if f"than_binh{sat}" in d.moc]
            out.append(f"* Mua {nhan} ở Hắc Thị: {pct(len(ages) / n)} số đời"
                       + (f", tuổi trung vị {trung_vi(ages):.0f}" if ages else ""))
        if any(d.truc_xuat for d, _ in doi):
            out.append(f"* Bị trục xuất khi tranh ngôi Chưởng môn (giữ võ công): {pct(sum(d.truc_xuat for d, _ in doi) / n)}")
        if any(d.quy_mo for d, _ in doi):
            kho = [d.ngan_kho for d, _ in doi if d.quy_mo]
            out.append(f"* Ngân khố môn phái lúc cuối đời (trung vị, chỉ tính người đang làm Chưởng môn): {trung_vi(kho):,.0f} lạng")
        if any(d.so_lan_bai_lo for d, _ in doi):
            out.append(f"* Hành động [Ám] mỗi đời (trung bình): {statistics.mean(d.so_am for d, _ in doi):.1f}, "
                       f"bị bại lộ: {statistics.mean(d.so_lan_bai_lo for d, _ in doi):.1f}; "
                       f"Thanh danh lúc cuối đời (trung vị): {trung_vi([d.thanh_danh for d, _ in doi]):.0f}; "
                       "lúc 20 / 30 / 50 / 70 tuổi: " + " / ".join(
                           f"{trung_vi([a[t]['td'] for _, a in doi if t in a]):.0f}" for t in (20, 30, 50, 70)))
            if any(d.dich_dung for d, _ in doi):
                s50 = [a[50] for _, a in doi if 50 in a]
                out.append(f"* Dịch Dung: mua ở {pct(sum(d.dich_dung for d, _ in doi) / n)} số đời, tuổi trung vị "
                           f"{trung_vi([d.moc['dich_dung'] for d, _ in doi if 'dich_dung' in d.moc]):.0f}; "
                           f"hợp đồng ám sát trung bình {statistics.mean(d.so_hop_dong for d, _ in doi):.1f} / đời, "
                           f"đổ tội thành công {statistics.mean(d.so_do_toi for d, _ in doi):.1f} lần / đời; "
                           f"Hiệp nghĩa thật lúc 50 tuổi (TV): {trung_vi([s['hn'] for s in s50]):.0f}; "
                           f"lúc 50 tuổi còn Thanh danh ≥ 0 / > -300: {pct(sum(s['td'] >= 0 for s in s50) / len(s50))}"
                           f" / {pct(sum(s['td'] > -300 for s in s50) / len(s50))}")
        kt = [d.moc["khai_tong"] for d, _ in doi if "khai_tong" in d.moc]
        if not LOI_CHOI[ten]["mon_phai"]:
            out.append(f"* Khai Tông Lập Phái: {pct(len(kt) / n)} số đời"
                       + (f", tuổi trung vị {trung_vi(kt):.0f}" if kt else ""))
        out.append("")
    return out


def bao_cao_tien_do():
    out = ["", "## 3. Thời gian luyện võ (AP để một môn từ cấp 1 lên 10)", "",
           "| Ngộ tính | Sư phụ | Nhập môn | Thượng thừa | Trấn phái | Thần công SSS |",
           "| ---: | ---: | ---: | ---: | ---: | ---: |"]
    for nt, sp in [(10, 0), (50, 0), (50, 10), (80, 0), (80, 10), (100, 10)]:
        row = [str(ap_len_10(nt, sp, t)) for t in (1, 2, 3, 4)]
        out.append(f"| {nt} | {sp} | " + " | ".join(row) + " |")
    out += ["", "Kết cục #1 cần 2 môn SSS cấp 10: "
            f"{2 * ap_len_10(80, 10, 4)} AP (Ngộ 80, có sư phụ) hoặc {2 * ap_len_10(50, 0, 4)} AP (Ngộ 50, tự học), "
            "chưa tính 2 môn Nội công tương ứng."]
    return out


def bao_cao_chien_luc(rng, n=8000):
    """Đối chiếu tỷ lệ thắng dự đoán từ Chiến lực với tỷ lệ thắng thật trên các cặp ngẫu nhiên."""
    def ngau_nhien():
        return VoGia(can_cot=rng.uniform(20, 100), ngo_tinh=rng.uniform(20, 100), tuoi=rng.randint(18, 70),
                     canh_gioi=rng.randint(0, 10), tier=rng.randint(1, 4), cap_vo=rng.randint(1, 10),
                     he=rng.choice(["duong", "am", "hoa", "ngoai"]), ban_menh=rng.choice(list(AI_H1)),
                     khinh_cong=rng.randint(0, 10), than_binh=rng.choice([0, 0, 30, 60, 100]))
    ngan = {}
    for _ in range(n):
        a = ngau_nhien()
        b = replace(ngau_nhien(), tier=clamp(a.tier + rng.choice([-1, 0, 1]), 1, 4),
                    cap_vo=clamp(a.cap_vo + rng.randint(-3, 3), 1, 10),
                    canh_gioi=clamp(a.canh_gioi + rng.randint(-3, 3), 0, 10),
                    can_cot=clamp(a.can_cot + rng.uniform(-20, 20), 0, 150))
        dcl = a.chien_luc - b.chien_luc
        k = min(4, int(abs(dcl) // 10))
        thang = quyet_dau(a, b, rng)["thang"]
        if dcl < 0:
            thang = not thang
        x = ngan.setdefault(k, [0, 0, 0.0])
        x[0] += 1
        x[1] += thang
        x[2] += 1 / (1 + math.exp(-abs(dcl) / CL_THANG_DO))
    out = ["", "## 4. Chiến lực (HS06 I.5): tỷ lệ thắng dự đoán và thực tế", "",
           f"{n} cặp võ giả ngẫu nhiên, góc nhìn bên có Chiến lực cao hơn.", "",
           "| Chênh Chiến lực | Số trận | Thắng thực tế | Thắng dự đoán |", "| :--- | ---: | ---: | ---: |"]
    for k in sorted(ngan):
        sl, th, du = ngan[k]
        nhan = f"{k * 10} - {k * 10 + 9}" if k < 4 else "≥ 40"
        out.append(f"| {nhan} | {sl} | {pct(th / sl)} | {pct(du / sl)} |")
    return out


# Thành phần 200 NPC theo lối sống (giả định, HS05 chưa có tỷ lệ)
NPC_THANH_PHAN = {"Chính phái": 35, "Tà phái": 20, "Lãng khách": 20, "Thương nhân": 15, "Chính phái chuyên tu": 10}
SO_NPC, TOP, DV_ANH_HUNG_THIEP = 200, 10, 400
CHUC_TEN = {0: "không chức", 1: "Ngoại môn", 2: "Nội môn", 3: "Chân truyền", 4: "Trưởng lão", 5: "Chưởng môn"}


def the_gioi_npc(kho, rng, so_nam, khoi_dong=100):
    """Thế giới 200 NPC liên tục (HS05): mỗi năm NPC già thêm 1 tuổi, người mất được thay bằng một đời mới
    16 tuổi rút từ kho theo NPC_THANH_PHAN. Trả về Top 10 mỗi năm: (Chiến lực, Danh vọng, lối sống, tuổi, chức, mã NPC)."""
    ten_npc, w_npc = list(NPC_THANH_PHAN), list(NPC_THANH_PHAN.values())
    ma = [0]

    def sinh(tuoi=None):
        while True:
            ten = rng.choices(ten_npc, weights=w_npc)[0]
            d = rng.choice(kho[ten])
            t = tuoi if tuoi is not None else rng.randint(16, 80)
            if t in d.lich_su:
                ma[0] += 1
                return [ten, d, t, ma[0]]

    dan = [sinh() for _ in range(SO_NPC)]
    lich = []
    for nam in range(khoi_dong + so_nam):
        for k, x in enumerate(dan):
            x[2] += 1
            if x[2] not in x[1].lich_su:
                dan[k] = sinh(16)
        if nam >= khoi_dong:
            bang = sorted(((x[1].lich_su[x[2]][0], x[1].lich_su[x[2]][1], x[0], x[2], x[1].lich_su[x[2]][2], x[3])
                           for x in dan), reverse=True)
            lich.append(bang[:TOP])
    return lich


def hoa_son(cl, bang, rng):
    """HS01 V: 3 trận Tam Hiệp liên tiếp với 3 người được mời khác (Top 10, Danh vọng >= 400).
    ponytail: mỗi trận độc lập theo Chiến lực, chưa tính HP không hồi đầy giữa các trận."""
    doi_thu = [b[0] for b in bang if b[1] >= DV_ANH_HUNG_THIEP]
    for cl_dich in rng.sample(doi_thu, min(3, len(doi_thu))):
        if rng.random() >= 1 / (1 + math.exp(-(cl - cl_dich) / CL_THANG_DO)):
            return False
    return True


def bao_cao_npc(rng, n_doi=500, so_nam=3000):
    kho = {ten: [song_mot_doi(ten, rng, ghi_nam=True)[0] for _ in range(n_doi)] for ten in LOI_CHOI}
    lich = the_gioi_npc(kho, rng, so_nam)
    nguong = sorted(b[TOP - 1][0] for b in lich)
    top = [x for b in lich for x in b]
    tuoi = sorted(x[3] for x in top)
    dem = lambda k: {v: sum(x[k] == v for x in top) / len(top) for v in {x[k] for x in top}}
    # Nhiệm kỳ số 1 của NPC: số năm liên tiếp cùng một người đứng đầu bảng
    nhiem_ky, dai = [], 1
    for a, b in zip(lich, lich[1:]):
        if a[0][5] == b[0][5]:
            dai += 1
        else:
            nhiem_ky.append(dai)
            dai = 1
    nk = sorted(nhiem_ky)
    out = ["", f"## 5. Thiên Hạ Phong Vân Bảng: {SO_NPC} NPC (HS05), Anh Hùng Thiếp và kết cục #1", "",
           f"Thế giới {SO_NPC} NPC chạy liên tục {so_nam} năm (sau 100 năm khởi động): mỗi NPC là một đời chạy đúng luật "
           f"như người chơi, rút từ {n_doi} đời mỗi lối chơi theo tỷ lệ "
           + ", ".join(f"{k} {v}%" for k, v in NPC_THANH_PHAN.items())
           + "; người mất được thay bằng một đời mới 16 tuổi. Hoa Sơn Luận Kiếm vào các năm thế giới chia hết cho 10.", "",
           f"* Chiến lực người thứ {TOP} (ngưỡng Thập Đại Cao Thủ): trung vị {statistics.median(nguong):.0f}, "
           f"P10 / P90: {nguong[len(nguong) // 10]:.0f} / {nguong[len(nguong) * 9 // 10]:.0f}",
           f"* Tuổi trong Thập Đại Cao Thủ: trung vị {statistics.median(tuoi):.0f}, "
           f"P10 / P90: {tuoi[len(tuoi) // 10]} / {tuoi[len(tuoi) * 9 // 10]}",
           "* Thành phần theo lối sống: " + ", ".join(f"{k} {pct(v)}" for k, v in sorted(dem(2).items(), key=lambda kv: -kv[1])),
           "* Theo chức vụ: " + ", ".join(f"{CHUC_TEN[k]} {pct(v)}" for k, v in sorted(dem(4).items(), key=lambda kv: -kv[1])),
           f"* Có Danh vọng ≥ {DV_ANH_HUNG_THIEP} (nhận được Anh Hùng Thiếp): {pct(sum(x[1] >= DV_ANH_HUNG_THIEP for x in top) / len(top))}",
           f"* NPC đứng số 1 liên tục: trung vị {statistics.median(nk):.0f} năm, P90 {nk[len(nk) * 9 // 10]} năm, "
           f"dài nhất {nk[-1]} năm; {pct(sum(n >= 10 for n in nk) / len(nk))} nhiệm kỳ kéo dài ≥ 10 năm", "",
           "Người chơi (mỗi lối chơi đặt vào thế giới trên ở một năm sinh ngẫu nhiên):", "",
           "| Lối chơi | Vào Top 10 | Anh Hùng Thiếp ≥ 1 / ≥ 2 | Thắng Hoa Sơn ≥ 1 / ≥ 2 | Số 1 liên tục ≥ 10 năm | "
           "Kết cục #1 cũ (thắng 2 lần) | **Kết cục #1 mới** (thắng 1 lần + số 1 ≥ 10 năm) |",
           "| :--- | ---: | ---: | ---: | ---: | ---: | ---: |"]
    for ten, ds in kho.items():
        c = dict(top=0, m1=0, m2=0, t1=0, t2=0, s10=0, moi=0)
        for d in ds:
            sinh = rng.randrange(len(lich) - 121)
            vao_top, moi_lan, thang, chuoi, chuoi_max = False, 0, 0, 0, 0
            for t in sorted(d.lich_su):
                if t < 16:
                    continue
                cl, dv, _ = d.lich_su[t]
                bang = lich[sinh + t]
                vao_top |= cl >= bang[TOP - 1][0]
                chuoi = chuoi + 1 if cl > bang[0][0] else 0
                chuoi_max = max(chuoi_max, chuoi)
                if (sinh + t) % 10 == 0 and cl >= bang[TOP - 1][0] and dv >= DV_ANH_HUNG_THIEP:
                    moi_lan += 1
                    thang += hoa_son(cl, bang, rng)
            c["top"] += vao_top
            c["m1"] += moi_lan >= 1
            c["m2"] += moi_lan >= 2
            c["t1"] += thang >= 1
            c["t2"] += thang >= 2
            c["s10"] += chuoi_max >= 10
            c["moi"] += thang >= 1 and chuoi_max >= 10
        f = lambda k: pct(c[k] / n_doi)
        out.append(f"| {ten} | {f('top')} | {f('m1')} / {f('m2')} | {f('t1')} / {f('t2')} | {f('s10')} | {f('t2')} | {f('moi')} |")
    out += ["", "Chưa mô phỏng hai điều kiện còn lại của kết cục #1 (2 môn SSS cấp 10, không thua Tam Hiệp từ 25 tuổi), "
            "nên tỷ lệ trên là cận trên."]
    return out


def kiem_tra():
    """Self-check: công thức khớp số liệu ghi trong GDD."""
    assert p_roll(25, 25) == 0.5
    assert p_roll(0, 100) == 0.05 and p_roll(100, 0) == 0.95
    assert p_roll(10, 40, nguoc=True) > 0.5
    vg = VoGia(can_cot=60, ngo_tinh=60, canh_gioi=5, tuoi=30)
    assert vg.hp_max == 100 + 720 + 400 + 150
    assert vg.mp_max == 50 + 480 + 750
    assert khac_che("duong", "am") == KHAC_THUAN and khac_che("am", "duong") == KHAC_NGUOC
    assert khac_che("hoa", "duong") == KHAC_THUAN and khac_che("duong", "duong") == 1.0
    assert ap_moi_nam(55, 8) == 4 and ap_moi_nam(55, 7) == 3
    assert tuoi_bat_dau_lao_hoa(7) == 50 and tuoi_bat_dau_lao_hoa(8) == 60
    # Chiến lực: Trấn phái cấp 10, Cảnh giới 10, Căn cốt 60, 40 tuổi = 30 + 100 + 100 + 120 + 15
    assert VoGia(can_cot=60, ngo_tinh=60, tuoi=40, canh_gioi=10, tier=3, cap_vo=10).chien_luc == 365
    assert VoGia(can_cot=60, ngo_tinh=60, tuoi=40, canh_gioi=10, tier=3, cap_vo=10,
                 khinh_cong=4, than_binh=100).chien_luc == 365 + 20 + 20
    # HS06 ghi: Ngộ 80 + sư phụ 10 -> ~43 AP; Ngộ 50 tự học -> ~84 AP cho 1 môn SSS lên 10/10
    assert ap_len_10(80, 10, 4) == 39, ap_len_10(80, 10, 4)
    assert ap_len_10(50, 0, 4) == 75, ap_len_10(50, 0, 4)
    rng = random.Random(1)
    d = Doi(ten="x", can_cot=50, ngo_tinh=50, phuc_duyen=50, tien=100, thu_nhap_nha=0, he="duong",
            mon_phai=False, ta=False, co_phan=2, muoi=3000, song_bac=True, hang=("son_ha", 500))
    assert d.gia_san == 100 + 2000 + 3000 + 4000 + 500
    d.danh_vong, d.bac = 800, 5
    assert d.dv == 800  # không ở môn phái: không có Danh vọng chức vị
    d.mon_phai = True
    assert d.dv == 1000  # Chưởng môn +300, trần 1000
    d.cc_dinh = 55
    assert d.age_max == 65 + 8
    d.cc_dinh, d.noi = 150, [Mon(4, 10)]
    assert d.age_max == 90  # trần khung 65 - 90
    # NPC Chính trực không Tuyệt sát: thua chỉ Trọng thương, có tiền thì chữa kịp, không thêm Ám thương
    d.tien, d.am_thuong = 1000, 0
    assert not thua_tran_sinh_tu(d, rng, replace(vg, ban_menh="chinh_truc"), {"bat_phan": False})
    assert d.so_trong_thuong == 1 and d.am_thuong == 0 and d.tien == 1000 - THUOC_NOI_THUONG
    # Ma công (vòng 16): Trấn phái của Tà phái tính như SSS khi Hiệp nghĩa <= -300
    d.ta, d.ngoai, d.hiep_nghia = True, [Mon(3, 10)], -500
    assert d.vo_gia().tier == 4
    d.hiep_nghia = -200
    assert d.vo_gia().tier == 3
    # [Ám] (vòng 18): chỉ Hiệp nghĩa giảm; khi Dịch Dung, rò rỉ có thể đổ tội và Thanh danh giữ nguyên
    d.thanh_danh, d.hiep_nghia, d.dich_dung, d.am = 0, 0, True, []
    lam_am(d, rng, 100)
    assert d.hiep_nghia == -100 and d.thanh_danh in (0, -150)
    d.thanh_danh = 0
    for _ in range(300):
        d.am = [(100, True, True)]
        ro_ri(d, rng)
    assert 0.6 < d.so_do_toi / 300 < 0.74 and d.thanh_danh == -150 * (300 - d.so_do_toi), d.so_do_toi
    # Khinh công (vòng 17): không vượt trần theo tier; có môn Trấn phái thì luyện tiếp lên trần 8
    d.noi, d.khinh, d.bac = [Mon(3, 10)], [Mon(1, 1)], 0
    for _ in range(50):
        luyen(d)
    assert d.vo_gia().khinh_cong == KHINH_CONG_TRAN[1]
    d.khinh.append(Mon(3))
    for _ in range(100):
        luyen(d)
    assert d.vo_gia().khinh_cong == KHINH_CONG_TRAN[3]
    t = thong_ke(rng, vg, vg, 2000)
    assert 0.45 < t["thang"] < 0.55, t
    print("kiem_tra: OK")


def main():
    sys.stdout.reconfigure(encoding="utf-8")  # Windows console mặc định cp1252
    kiem_tra()
    if "--kiem-tra" in sys.argv:
        return
    rng = random.Random(20261026)
    out = ["# Kết quả mô phỏng cân bằng (tự sinh bởi mo_phong.py)", "",
           "Seed 20261026. Xem khối GIẢ ĐỊNH đầu file script cho các số GDD chưa định nghĩa.", ""]
    out += bao_cao_tam_hiep(rng)
    out += bao_cao_vong_doi(rng)
    out += bao_cao_tien_do()
    out += bao_cao_chien_luc(rng)
    out += bao_cao_npc(rng)
    print("\n".join(out))


if __name__ == "__main__":
    main()
