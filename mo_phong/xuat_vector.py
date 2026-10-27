"""Xuất vector đối chiếu số từ mo_phong.py sang game/test/vector/*.json.

Chạy:
    python mo_phong/xuat_vector.py

Chỉ dùng thư viện chuẩn Python. Seed cố định nên kết quả lặp lại được.
"""

from __future__ import annotations

import datetime
import json
import os
import random
import sys

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8")

# Đảm bảo import được mo_phong dù chạy từ thư mục nào.
DIR_MO_PHONG = os.path.dirname(os.path.abspath(__file__))
if DIR_MO_PHONG not in sys.path:
    sys.path.insert(0, DIR_MO_PHONG)

import mo_phong  # noqa: E402

DIR_GOC = os.path.dirname(DIR_MO_PHONG)
DIR_VECTOR = os.path.join(DIR_GOC, "game", "test", "vector")
NGAY_SINH = datetime.date.today().isoformat()
NGUON = "mo_phong/xuat_vector.py"


def ghi_json(ten_tep: str, noi_dung: dict) -> None:
    os.makedirs(DIR_VECTOR, exist_ok=True)
    duong_dan = os.path.join(DIR_VECTOR, ten_tep)
    with open(duong_dan, "w", encoding="utf-8") as f:
        json.dump(noi_dung, f, indent=2, ensure_ascii=False)
    print(f"Đã ghi: {ten_tep}")


def xuat_p_roll() -> None:
    """HS06 I.2: lưới x 0-150 bước 5, n 0-100 bước 5, phúc duyên, ngược."""
    du_lieu = []
    cac_x = list(range(0, 151, 5))
    cac_n = list(range(0, 101, 5))
    cac_pd = [0, 30, 50, 70, 100, 150]
    cac_nguoc = [False, True]

    for pd in cac_pd:
        for ng in cac_nguoc:
            for n in cac_n:
                for x in cac_x:
                    du_lieu.append({
                        "x": x,
                        "n": n,
                        "phuc_duyen": pd,
                        "nguoc": ng,
                        "ket_qua": mo_phong.p_roll(x, n, phuc_duyen=pd, nguoc=ng),
                    })

    ghi_json("p_roll.json", {
        "nguon": NGUON,
        "ngay_sinh": NGAY_SINH,
        "so_luong": len(du_lieu),
        "du_lieu": du_lieu,
    })


def xuat_bonus_tuoi() -> None:
    """HS06 I.1: Bonus độ tuổi cho tuổi 0 - 120."""
    du_lieu = [
        {"tuoi": t, "ket_qua": mo_phong.bonus_tuoi(t)}
        for t in range(121)
    ]
    ghi_json("bonus_tuoi.json", {
        "nguon": NGUON,
        "ngay_sinh": NGAY_SINH,
        "so_luong": len(du_lieu),
        "du_lieu": du_lieu,
    })


def xuat_ap_moi_nam() -> None:
    """HS01 IV: AP mỗi năm cho tuổi 0 - 100 x cảnh giới 0 - 10."""
    du_lieu = []
    for t in range(101):
        for cg in range(11):
            du_lieu.append({
                "tuoi": t,
                "canh_gioi": cg,
                "ket_qua": mo_phong.ap_moi_nam(t, cg),
            })
    ghi_json("ap_moi_nam.json", {
        "nguon": NGUON,
        "ngay_sinh": NGAY_SINH,
        "so_luong": len(du_lieu),
        "du_lieu": du_lieu,
    })


def xuat_tien_do() -> None:
    """HS06 I.1: tiến độ mỗi AP và số AP lên 10."""
    tien_do = []
    for nt in range(0, 151, 5):
        for csp in range(11):
            for tr in [1, 2, 3, 4]:
                tien_do.append({
                    "ngo_tinh": nt,
                    "cap_su_phu": csp,
                    "tier": tr,
                    "ket_qua": mo_phong.tien_do(nt, csp, tr),
                })

    ap_len_10 = []
    for nt in range(10, 101, 10):
        for csp in [0, 6, 10]:
            for tr in [1, 2, 3, 4]:
                ap_len_10.append({
                    "ngo_tinh": nt,
                    "cap_su_phu": csp,
                    "tier": tr,
                    "ket_qua": mo_phong.ap_len_10(nt, csp, tr),
                })

    ghi_json("tien_do.json", {
        "nguon": NGUON,
        "ngay_sinh": NGAY_SINH,
        "tien_do": tien_do,
        "ap_len_10": ap_len_10,
    })


def xuat_khac_che() -> None:
    """HS06 I.4: hệ số khắc chế giữa 4 hệ nội lực."""
    he_ds = ["duong", "am", "hoa", "ngoai"]
    du_lieu = []
    for ha in he_ds:
        for hb in he_ds:
            du_lieu.append({
                "he_a": ha,
                "he_b": hb,
                "ket_qua": mo_phong.khac_che(ha, hb),
            })
    ghi_json("khac_che.json", {
        "nguon": NGUON,
        "ngay_sinh": NGAY_SINH,
        "so_luong": len(du_lieu),
        "du_lieu": du_lieu,
    })


def xuat_vo_gia() -> None:
    """500 bộ tham số ngẫu nhiên cho VoGia (seed 7)."""
    rng = random.Random(7)
    du_lieu = []
    for _ in range(500):
        can_cot = round(rng.uniform(10, 120), 2)
        ngo_tinh = round(rng.uniform(10, 120), 2)
        tuoi = rng.randint(0, 100)
        canh_gioi = rng.randint(0, 10)
        tier = rng.randint(1, 4)
        cap_vo = rng.randint(1, 10)
        khinh_cong = rng.randint(0, 10)
        than_binh = rng.choice([0, 0, 30, 60, 100])
        he = rng.choice(["duong", "am", "hoa", "ngoai"])
        ban_menh = rng.choice(list(mo_phong.AI_H1.keys()))
        phuc_duyen = round(rng.uniform(0, 100), 2)

        vg = mo_phong.VoGia(
            can_cot=can_cot,
            ngo_tinh=ngo_tinh,
            tuoi=tuoi,
            canh_gioi=canh_gioi,
            tier=tier,
            cap_vo=cap_vo,
            khinh_cong=khinh_cong,
            than_binh=than_binh,
            he=he,
            ban_menh=ban_menh,
            phuc_duyen=phuc_duyen,
        )

        du_lieu.append({
            "dau_vao": {
                "can_cot": can_cot,
                "ngo_tinh": ngo_tinh,
                "tuoi": tuoi,
                "canh_gioi": canh_gioi,
                "tier": tier,
                "cap_vo": cap_vo,
                "khinh_cong": khinh_cong,
                "than_binh": than_binh,
                "he": he,
                "ban_menh": ban_menh,
                "phuc_duyen": phuc_duyen,
            },
            "hp_max": vg.hp_max,
            "mp_max": vg.mp_max,
            "vo_luc": vg.vo_luc,
            "chien_luc": vg.chien_luc,
        })

    ghi_json("vo_gia.json", {
        "nguon": NGUON,
        "ngay_sinh": NGAY_SINH,
        "so_luong": len(du_lieu),
        "du_lieu": du_lieu,
    })


def xuat_age_max() -> None:
    """HS06 I.1: lưới Căn cốt đỉnh x Cảnh giới x Ám thương; và tuổi bắt đầu lão hóa."""
    du_lieu = []
    for ccd in range(0, 151, 5):
        for cg in range(11):
            for at in [0, 1, 3, 5, 10, 20]:
                tuoi_tho = 65 + int(min(ccd, 100) * 0.15) + cg - at
                du_lieu.append({
                    "can_cot_dinh": ccd,
                    "canh_gioi": cg,
                    "am_thuong": at,
                    "ket_qua": tuoi_tho,
                })

    lao_hoa = [
        {"canh_gioi": cg, "ket_qua": mo_phong.tuoi_bat_dau_lao_hoa(cg)}
        for cg in range(11)
    ]

    ghi_json("age_max.json", {
        "nguon": NGUON,
        "ngay_sinh": NGAY_SINH,
        "so_luong": len(du_lieu),
        "du_lieu": du_lieu,
        "lao_hoa": lao_hoa,
    })


def xuat_tam_hiep_ti_le() -> None:
    """Thống kê 20.000 trận Tam Hiệp cho các cặp MUC_SUC_MANH và chênh lệch Trung (seed 42)."""
    rng = random.Random(42)
    so_tran = 20000

    muc_suc_manh = []
    ten_cac_muc = list(mo_phong.MUC_SUC_MANH.keys())
    for ten_a in ten_cac_muc:
        for ten_b in ten_cac_muc:
            st_a = mo_phong.MUC_SUC_MANH[ten_a]
            st_b = mo_phong.MUC_SUC_MANH[ten_b]
            vg_a = mo_phong.VoGia(**st_a)
            vg_b = mo_phong.VoGia(**st_b)
            tk = mo_phong.thong_ke(rng, vg_a, vg_b, so_tran)
            muc_suc_manh.append({
                "ten_a": ten_a,
                "ten_b": ten_b,
                "dau_vao_a": st_a,
                "dau_vao_b": st_b,
                "ti_le_thang": tk["thang"],
                "ti_le_hoa": 0.0,
                "ti_le_thua": round(1.0 - tk["thang"], 6),
                "ko_h1": tk["ko_h1"],
                "ko_som": tk["ko_som"],
                "bat_phan": tk["bat_phan"],
                "hp_con": tk["hp_con"],
                "hp_yeu_h2": tk["hp_yeu_h2"],
            })

    # Các cặp so với mức Trung (báo cáo Tam Hiệp 1.2)
    goc = mo_phong.MUC_SUC_MANH["Trung (Thượng thừa 5/10, NC 5)"]
    cac_thay_doi = [
        ("Ngang nhau", {}),
        ("+1 cấp võ học", {"cap_vo": 6}),
        ("+2 cấp võ học", {"cap_vo": 7}),
        ("+3 cấp võ học", {"cap_vo": 8}),
        ("+1 Cảnh giới Nội công", {"canh_gioi": 6}),
        ("+3 Cảnh giới Nội công", {"canh_gioi": 8}),
        ("+10 Căn cốt", {"can_cot": 70}),
        ("+1 tier (Trấn phái 5/10)", {"tier": 3}),
        ("-1 tier (Nhập môn 5/10)", {"tier": 1}),
    ]
    chenh_lech_trung = []
    for nhan, thay in cac_thay_doi:
        st_a = {**goc, **thay}
        st_b = goc
        vg_a = mo_phong.VoGia(**st_a)
        vg_b = mo_phong.VoGia(**st_b)
        tk = mo_phong.thong_ke(rng, vg_a, vg_b, so_tran)
        chenh_lech_trung.append({
            "nhan": nhan,
            "dau_vao_a": st_a,
            "dau_vao_b": st_b,
            "ti_le_thang": tk["thang"],
            "ti_le_hoa": 0.0,
            "ti_le_thua": round(1.0 - tk["thang"], 6),
            "ko_h1": tk["ko_h1"],
            "ko_som": tk["ko_som"],
            "bat_phan": tk["bat_phan"],
            "hp_con": tk["hp_con"],
            "hp_yeu_h2": tk["hp_yeu_h2"],
        })

    ghi_json("tam_hiep_ti_le.json", {
        "nguon": NGUON,
        "ngay_sinh": NGAY_SINH,
        "so_tran": so_tran,
        "muc_suc_manh": muc_suc_manh,
        "chenh_lech_trung": chenh_lech_trung,
    })


def main() -> None:
    print(f"Bắt đầu xuất vector đối chiếu sang: {DIR_VECTOR}")
    xuat_p_roll()
    xuat_bonus_tuoi()
    xuat_ap_moi_nam()
    xuat_tien_do()
    xuat_khac_che()
    xuat_vo_gia()
    xuat_age_max()
    xuat_tam_hiep_ti_le()
    print("Hoàn tất xuất toàn bộ 8 tệp vector.")


if __name__ == "__main__":
    main()
