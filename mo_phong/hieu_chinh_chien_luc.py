"""Hiệu chỉnh chỉ số Chiến lực (HS06 I.5) từ tỷ lệ thắng Tam Hiệp của mo_phong.py.

Chạy:  python hieu_chinh_chien_luc.py
Sinh ngẫu nhiên các cặp võ giả, đánh 1 trận mỗi cặp, fit hồi quy logistic
P(A thắng) = 1 / (1 + exp(-(w . (x_A - x_B)))) bằng Newton, không cần numpy.
"""
import math
import random
import sys

import mo_phong as m

THAN_BINH = [0, 0, 30, 60, 100]  # Không có / Lợi khí / Danh khí / Thần binh (HS02 IV)


def vo_gia_ngau_nhien(rng, goc=None):
    if goc is None or rng.random() < 0.5:
        return m.VoGia(can_cot=rng.uniform(20, 100), ngo_tinh=rng.uniform(20, 100), tuoi=rng.randint(18, 70),
                       canh_gioi=rng.randint(0, 10), tier=rng.randint(1, 4), cap_vo=rng.randint(1, 10),
                       he=rng.choice(["duong", "am", "hoa", "ngoai"]), ban_menh=rng.choice(list(m.AI_H1)),
                       khinh_cong=rng.randint(0, 10), than_binh=rng.choice(THAN_BINH))
    # Cặp gần sức: lệch nhẹ quanh võ giả gốc để có nhiều trận sát nút
    return m.replace(goc, can_cot=m.clamp(goc.can_cot + rng.uniform(-15, 15), 0, 150),
                     ngo_tinh=m.clamp(goc.ngo_tinh + rng.uniform(-15, 15), 0, 150),
                     tuoi=m.clamp(goc.tuoi + rng.randint(-10, 10), 16, 80),
                     canh_gioi=m.clamp(goc.canh_gioi + rng.randint(-2, 2), 0, 10),
                     tier=m.clamp(goc.tier + rng.choice([-1, 0, 0, 1]), 1, 4),
                     cap_vo=m.clamp(goc.cap_vo + rng.randint(-2, 2), 1, 10),
                     khinh_cong=m.clamp(goc.khinh_cong + rng.randint(-2, 2), 0, 10),
                     than_binh=rng.choice(THAN_BINH),
                     he=rng.choice(["duong", "am", "hoa", "ngoai"]), ban_menh=rng.choice(list(m.AI_H1)))


def giai(a, b):
    """Gauss khử, a là ma trận vuông, b vector."""
    n = len(b)
    a = [row[:] + [b[i]] for i, row in enumerate(a)]
    for c in range(n):
        p = max(range(c, n), key=lambda r: abs(a[r][c]))
        a[c], a[p] = a[p], a[c]
        for r in range(n):
            if r != c:
                f = a[r][c] / a[c][c]
                a[r] = [x - f * y for x, y in zip(a[r], a[c])]
    return [a[i][n] / a[i][i] for i in range(n)]


def fit(X, y, vong=25):
    w = [0.0] * len(X[0])
    for _ in range(vong):
        g = [0.0] * len(w)
        H = [[1e-9 * (i == j) for j in range(len(w))] for i in range(len(w))]
        for x, t in zip(X, y):
            p = 1 / (1 + math.exp(-sum(wi * xi for wi, xi in zip(w, x))))
            for i in range(len(w)):
                g[i] += (t - p) * x[i]
                for j in range(len(w)):
                    H[i][j] += p * (1 - p) * x[i] * x[j]
        w = [wi + di for wi, di in zip(w, giai(H, g))]
    return w


def log_loss(X, y, w):
    s = 0.0
    for x, t in zip(X, y):
        p = 1 / (1 + math.exp(-sum(wi * xi for wi, xi in zip(w, x))))
        p = min(max(p, 1e-9), 1 - 1e-9)
        s -= t * math.log(p) + (1 - t) * math.log(1 - p)
    return s / len(y)


def dac_trung_ly_thuyet(v):
    """ln(Sát thương gốc x HP hiệu dụng): đúng cấu trúc phân thắng bằng % HP của Tam Hiệp."""
    dmg = m.UY_LUC[v.tier] * (1 + v.cap_vo / 5) + v.mp_max * m.HE_SO_NOI_TUC + v.than_binh
    giam = min(m.GIAM_TRU_TOI_DA, m.GIAM_TRU_MOI_CAN_COT * v.can_cot + m.GIAM_TRU_MOI_KHINH_CONG * v.khinh_cong)
    return [math.log(dmg * v.hp_max / (1 - giam))]


def dac_trung_tuyen_tinh(v):
    return [v.tier == 2, v.tier == 3, v.tier == 4, v.cap_vo, v.canh_gioi, v.can_cot, v.ngo_tinh,
            m.bonus_tuoi(v.tuoi) / 10, v.khinh_cong, v.than_binh / 10]


def dac_trung_chien_luc(v):
    return [v.chien_luc]


def main():
    sys.stdout.reconfigure(encoding="utf-8")
    rng = random.Random(2026)
    cap = []
    for _ in range(30000):
        a = vo_gia_ngau_nhien(rng)
        cap.append((a, vo_gia_ngau_nhien(rng, a), None))
    cap = [(a, b, m.quyet_dau(a, b, rng)["thang"]) for a, b, _ in cap]
    train, test = cap[:24000], cap[24000:]
    for ten, f in [("vo_luc", lambda v: [v.vo_luc]), ("ly_thuyet", dac_trung_ly_thuyet),
                   ("tuyen_tinh", dac_trung_tuyen_tinh), ("chien_luc", dac_trung_chien_luc)]:
        Xtr = [[p - q for p, q in zip(f(a), f(b))] for a, b, _ in train]
        Xte = [[p - q for p, q in zip(f(a), f(b))] for a, b, _ in test]
        ytr, yte = [t for *_, t in train], [t for *_, t in test]
        w = fit(Xtr, ytr)
        acc = sum((sum(wi * xi for wi, xi in zip(w, x)) > 0) == t for x, t in zip(Xte, yte)) / len(yte)
        print(ten, "w =", [round(x, 4) for x in w], "log_loss test %.4f acc %.3f" % (log_loss(Xte, yte, w), acc),
              "thang_do %.1f" % (1 / w[0]) if len(w) == 1 else "")


if __name__ == "__main__":
    main()
