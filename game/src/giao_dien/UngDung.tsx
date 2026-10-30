import { useTroChoi } from './dung_tro_choi'
import { ChonThienPhu } from './ChonThienPhu'
import { ManDauThai } from './ManDauThai'
import { ManHinh } from './ManHinh'
import { VanBia } from './VanBia'

export function UngDung() {
  const { duLieuManHinh, xemTab, phat } = useTroChoi()

  if (duLieuManHinh.man === 'dau_thai') {
    return <ManDauThai phat={phat} />
  }

  if (duLieuManHinh.man === 'chon_thien_phu') {
    return <ChonThienPhu duLieu={duLieuManHinh} phat={phat} />
  }

  if (duLieuManHinh.man === 'ket_thuc') {
    return <VanBia duLieu={duLieuManHinh} phat={phat} />
  }

  return <ManHinh duLieu={duLieuManHinh} xemTab={xemTab} phat={phat} />
}
