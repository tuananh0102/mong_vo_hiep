import { useEffect, useRef, type ReactNode } from 'react'

export interface PropsSheet {
  idTieuDe: string
  tieuDe: string
  /** Chip chi phí ở góc phải (ví dụ "0 AP"), bỏ trống nếu không có. */
  chiPhi?: string
  onDong: () => void
  /** Nút quay lại danh sách cha khi Sheet đang hiện danh sách con. */
  onQuayLai?: () => void
  children: ReactNode
}

/**
 * M1-17, thiết kế mục 6.2 và 7: khung Sheet nội dung Tab.
 * `role="tabpanel"`, đóng bằng nút hoặc phím Esc; nơi gọi tự trả focus về chỗ cũ.
 */
export function Sheet({ idTieuDe, tieuDe, chiPhi, onDong, onQuayLai, children }: PropsSheet) {
  const khungRef = useRef<HTMLElement>(null)

  // Thiết kế mục 10: mở Sheet thì đưa focus vào trong khung.
  useEffect(() => {
    khungRef.current?.focus()
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onDong()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
    }
  }, [onDong])

  return (
    <section
      ref={khungRef}
      className="vk-sheet"
      role="tabpanel"
      aria-labelledby={idTieuDe}
      tabIndex={-1}
    >
      <div className="vk-sheet__tay-cam" aria-hidden="true" />
      <div className="vk-sheet__dau">
        <h2 className="vk-sheet__tieu-de" id={idTieuDe}>
          {tieuDe}
        </h2>
        <div className="vk-sheet__dau-phu">
          {chiPhi && <span className="vk-chi-phi">{chiPhi}</span>}
          {onQuayLai && (
            <button
              className="vk-nut"
              type="button"
              aria-label="Quay lại danh sách"
              onClick={onQuayLai}
            >
              ←
            </button>
          )}
          <button className="vk-nut" type="button" onClick={onDong}>
            Đóng
          </button>
        </div>
      </div>
      <div className="vk-sheet__than">{children}</div>
    </section>
  )
}
