"""Kiểm tra tương phản WCAG AA cho mọi cặp chữ / nền trong tokens.css.

Chạy: python giao_dien/kiem_tra_tuong_phan.py
Thoát mã 1 nếu có cặp không đạt. Thêm token chữ hoặc nền mới thì thêm vào CHU / NEN bên dưới.
"""
import re
import sys
from pathlib import Path

TOKENS = Path(__file__).with_name("tokens.css")

# Token chữ phải đạt 4.5:1 trên mọi nền trong NEN.
CHU = ["--chu", "--chu-phu", "--chu-lien-ket", "--vo-hieu-chu",
       "--su-kien-thuong", "--su-kien-giao-chien", "--su-kien-tinh-duyen",
       "--su-kien-ky-ngo", "--su-kien-dao-gia",
       "--pham-1", "--pham-2", "--pham-3", "--pham-4",
       "--do-kho-de", "--do-kho-kha", "--do-kho-kho", "--do-kho-hiem"]
NEN = ["--nen", "--be-mat-noi", "--be-mat-lom"]
# Cặp riêng: (chữ, nền, ngưỡng). Viền điều khiển chỉ cần 3:1 (WCAG 1.4.11).
CAP_RIENG = [("--hanh-dong-chu", "--hanh-dong", 4.5),
             ("--hanh-dong-chu", "--hanh-dong-nguy", 4.5),
             ("--mau-muc", "--mau-kim-sang", 4.5),
             ("--vien-dieu-khien", "--nen", 3.0),
             ("--vien-dieu-khien", "--be-mat-noi", 3.0)]


def doc_khoi(css):
    """Trả về {selector: {token: giá trị}} cho :root và từng chủ đề."""
    khoi = {}
    for sel, than in re.findall(r"([^{}]+)\{([^{}]*)\}", re.sub(r"/\*.*?\*/", "", css, flags=re.S)):
        khoi[sel.strip()] = dict(re.findall(r"(--[\w-]+)\s*:\s*([^;]+);", than))
    return khoi


def giai(token, bang):
    gia_tri = bang[token].strip()
    m = re.fullmatch(r"var\((--[\w-]+)\)", gia_tri)
    return giai(m.group(1), bang) if m else gia_tri


def do_sang(hex_):
    r, g, b = (int(hex_.lstrip("#")[i:i + 2], 16) / 255 for i in (0, 2, 4))
    kenh = [c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4 for c in (r, g, b)]
    return 0.2126 * kenh[0] + 0.7152 * kenh[1] + 0.0722 * kenh[2]


def ti_le(a, b):
    la, lb = sorted((do_sang(a), do_sang(b)), reverse=True)
    return (la + 0.05) / (lb + 0.05)


def main():
    khoi = doc_khoi(TOKENS.read_text(encoding="utf-8"))
    goc = khoi[":root"]
    loi = 0
    for sel, ghi_de in khoi.items():
        bang = {**goc, **ghi_de}
        cap = [(c, n, 4.5) for c in CHU for n in NEN] + CAP_RIENG
        for chu, nen, nguong in cap:
            r = ti_le(giai(chu, bang), giai(nen, bang))
            if r < nguong:
                loi += 1
                print(f"KHÔNG ĐẠT [{sel}] {chu} trên {nen}: {r:.2f}:1 < {nguong}:1")
    print("Tất cả cặp đạt WCAG AA." if not loi else f"{loi} cặp không đạt.")
    return 1 if loi else 0


assert abs(ti_le("#000000", "#FFFFFF") - 21) < 0.01

if __name__ == "__main__":
    sys.exit(main())
