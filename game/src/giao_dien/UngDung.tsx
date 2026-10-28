import { useTroChoi } from './dung_tro_choi'
import { ChonThienPhu } from './ChonThienPhu'
import { ManDauThai } from './ManDauThai'
import { ManHinh } from './ManHinh'

export function UngDung() {
  const { duLieuManHinh, phat } = useTroChoi()

  if (duLieuManHinh.man === 'dau_thai') {
    return <ManDauThai phat={phat} />
  }

  if (duLieuManHinh.man === 'chon_thien_phu') {
    return <ChonThienPhu duLieu={duLieuManHinh} phat={phat} />
  }

  if (duLieuManHinh.man === 'ket_thuc') {
    // M1-18 thay màn này bằng Văn bia
    return (
      <div className="vk-mo-man">
        <h1 className="vk-mo-man__tieu-de">{duLieuManHinh.ten}</h1>
        <p className="vk-mo-man__than">
          Hưởng thọ {duLieuManHinh.tuoi} tuổi. Kiếp này đã khép lại.
        </p>
      </div>
    )
  }

  return <ManHinh duLieu={duLieuManHinh} phat={phat} />
}
