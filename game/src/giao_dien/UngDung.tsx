import { useTroChoi } from './dung_tro_choi'
import { ManHinh } from './ManHinh'

export function UngDung() {
  const { duLieuManHinh, phat } = useTroChoi()

  return <ManHinh duLieu={duLieuManHinh} phat={phat} />
}
