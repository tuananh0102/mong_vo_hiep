// 01 mục 6: sfc32 khởi tạo bằng splitmix32. Không dùng Math.random.

export type TrangThaiRng = [number, number, number, number]

export interface Rng {
  /** Số thực trong [0, 1). */
  so(): number
  /** Số nguyên trong [a, b], gồm cả hai đầu. */
  nguyen(a: number, b: number): number
  /** true với xác suất p. */
  trung(p: number): boolean
  layTrangThai(): TrangThaiRng
}

function splitmix32(seed: number): TrangThaiRng {
  let s = seed >>> 0
  const kq: number[] = []
  for (let i = 0; i < 4; i++) {
    s = (s + 0x9e3779b9) >>> 0
    let z = s
    z = Math.imul(z ^ (z >>> 16), 0x85ebca6b) >>> 0
    z = Math.imul(z ^ (z >>> 13), 0xc2b2ae35) >>> 0
    kq.push((z ^ (z >>> 16)) >>> 0)
  }
  return kq as TrangThaiRng
}

class Sfc32 implements Rng {
  private a: number
  private b: number
  private c: number
  private d: number

  constructor([a, b, c, d]: TrangThaiRng) {
    this.a = a >>> 0
    this.b = b >>> 0
    this.c = c >>> 0
    this.d = d >>> 0
  }

  khoiDong(): this {
    for (let i = 0; i < 12; i++) this.buoc()
    return this
  }

  private buoc(): number {
    const t = (((this.a + this.b) >>> 0) + this.d) >>> 0
    this.d = (this.d + 1) >>> 0
    this.a = this.b ^ (this.b >>> 9)
    this.b = (this.c + (this.c << 3)) >>> 0
    this.c = ((this.c << 21) | (this.c >>> 11)) >>> 0
    this.c = (this.c + t) >>> 0
    return t
  }

  so(): number {
    return this.buoc() / 4294967296
  }

  nguyen(a: number, b: number): number {
    return a + Math.floor(this.so() * (b - a + 1))
  }

  trung(p: number): boolean {
    return this.so() < p
  }

  layTrangThai(): TrangThaiRng {
    return [this.a, this.b, this.c, this.d]
  }
}

export function rngTuSeed(seed: number): Rng {
  return new Sfc32(splitmix32(seed)).khoiDong()
}

/** Dựng lại từ trạng thái đã lưu: tiếp tục đúng dãy, không khởi động lại. */
export function taoRng(trangThai: TrangThaiRng): Rng {
  return new Sfc32(trangThai)
}

export function chonTheoTrongSo<T>(rng: Rng, ds: { gia_tri: T; trong_so: number }[]): T | null {
  const tong = ds.reduce((s, x) => s + x.trong_so, 0)
  if (tong <= 0) return null
  let x = rng.so() * tong
  for (const m of ds) {
    if (x < m.trong_so) return m.gia_tri
    x -= m.trong_so
  }
  return ds[ds.length - 1]?.gia_tri ?? null
}
