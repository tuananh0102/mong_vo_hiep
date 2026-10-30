import { describe, expect, it } from 'vitest'
import { DU_LIEU } from '../src/du_lieu/nap_vite'
import type { DuLieu, VoHoc } from '../src/du_lieu/luoc_do'
import { taoTrangThaiRong } from '../src/luat/chi_so'
import { chienLuc } from '../src/luat/cong_thuc'
import { apDung } from '../src/luat/dong_co'
import type { TrangThaiGame } from '../src/luat/kieu'
import { hocVoHoc } from '../src/luat/vo_hoc'
import {
  moTaPhucDuyen,
  xemBatTu,
  xemMonPhai,
  xemNhanMach,
  xemTabTuLuyen,
  xemTabVoHoc,
} from '../src/luat/xem'

/** M1-17: người chơi 20 tuổi ở Hoa Sơn Bậc 2 (Nội môn) có 4 môn võ. */
function taoNguoiChoiHoaSon(tuoi = 20): TrangThaiGame {
  const d = taoTrangThaiRong(11)
  const nv = d.nhan_vat
  nv.ten = 'Lý Tiêu Dao'
  nv.gia_canh = 'binh_dan'
  nv.vung = 'trung_nguyen'
  nv.tuoi = tuoi
  nv.can_cot = 60
  nv.can_cot_dinh = 60
  nv.ngo_tinh = 50
  nv.phuc_duyen = 45
  nv.mi_luc = 30
  nv.ngan_luong = 1_000
  nv.hp = 500
  nv.noi_tuc = 200
  nv.ap_con_lai = 3
  nv.viec_mien_phi_con_lai = 2
  nv.mon_phai = { ma: 'hoa_son', bac: 2, cong_hien: 120, tu_tuoi: 16 }
  for (const ma of [
    'hoa_son_kiem_phap',
    'hoa_son_tam_phap',
    'hoa_son_than_phap',
    'hon_nguyen_chuong',
  ]) {
    hocVoHoc(d, DU_LIEU, ma)
  }
  return d
}

/** Bản sao dữ liệu có thêm một bí kíp Hoa Sơn không nằm trong phần sư phụ truyền. */
function duLieuCoBiKipThem(): { dl: DuLieu; ma: string } {
  const ma = 'bi_kip_thu_nghiem'
  const vh: VoHoc = {
    ma,
    ten: 'Bí Kíp Thử Nghiệm',
    nguon: 'test',
    nguon_ten: 'phong_tac',
    tru_cot: 'ngoai_cong',
    tier: 2,
    he_noi_luc: null,
    loai_binh_khi: 'kiem',
    uy_luc_lech: 0,
    tran_cap: 10,
    dac_biet: [],
    mon_phai: 'hoa_son',
    mo_ta: '',
  }
  return { dl: { ...DU_LIEU, vo_hoc: { ...DU_LIEU.vo_hoc, [ma]: vh } }, ma }
}

describe('M1-17 Tab 1 - Tu Luyện & Hành Động', () => {
  it('chỉ hiện việc trong độ tuổi, đủ 4 nhóm và không lặp việc của Tab Môn Phái', () => {
    const d = taoNguoiChoiHoaSon(20)
    const nhom = xemTabTuLuyen(d, DU_LIEU)

    expect(nhom.map((g) => g.nhom)).toEqual(['sinh_hoat', 'tu_luyen', 'giang_ho', 'mon_phai'])
    const tatCa = nhom.flatMap((g) => g.hanh_dong)
    expect(tatCa.every((hd) => hd.trong_tuoi)).toBe(true)
    expect(tatCa.some((hd) => hd.ma === 'nam_noi')).toBe(false)
    expect(tatCa.some((hd) => hd.ma === 'luyen_cong')).toBe(true)
    expect(tatCa.some((hd) => hd.ma === 'nhiem_vu_su_mon')).toBe(true)
    expect(tatCa.some((hd) => hd.ma === 'tang_kinh_cac')).toBe(false)
    expect(tatCa.some((hd) => hd.ma === 'roi_mon_phai')).toBe(false)
    expect(tatCa.some((hd) => hd.ma === 'uong_dan_duoc')).toBe(false)
  })

  it('đứa trẻ 5 tuổi chỉ thấy 4 việc sinh hoạt, 0 việc giang hồ', () => {
    const d = taoNguoiChoiHoaSon(5)
    d.nhan_vat.mon_phai = null
    const nhom = xemTabTuLuyen(d, DU_LIEU)
    expect(nhom).toHaveLength(1)
    expect(nhom[0]?.nhom).toBe('sinh_hoat')
    expect(nhom[0]?.hanh_dong.map((hd) => hd.ma).sort()).toEqual([
      'luc_loi_do_dac',
      'nam_noi',
      'nghe_ke_chuyen',
      'tap_bo',
    ])
  })

  it('hành động cần tham số có danh sách con đúng khóa lệnh', () => {
    const d = taoNguoiChoiHoaSon(20)
    const tatCa = xemTabTuLuyen(d, DU_LIEU).flatMap((g) => g.hanh_dong)

    const luyenCong = tatCa.find((hd) => hd.ma === 'luyen_cong')!
    expect(luyenCong.bi_khoa).toBe(false)
    expect(luyenCong.khoa_tham_so).toBe('vo_hoc')
    expect(luyenCong.nhan_chon).toBeTruthy()
    expect(luyenCong.tham_so?.map((ts) => ts.ma).sort()).toEqual([
      'hoa_son_kiem_phap',
      'hoa_son_tam_phap',
      'hoa_son_than_phap',
      'hon_nguyen_chuong',
    ])

    const hocTapHoc = tatCa.find((hd) => hd.ma === 'hoc_tap_hoc')!
    expect(hocTapHoc.khoa_tham_so).toBe('tap_hoc')
    expect(hocTapHoc.tham_so).toHaveLength(7)

    const sanTienThuong = tatCa.find((hd) => hd.ma === 'san_tien_thuong')!
    expect(sanTienThuong.khoa_tham_so).toBe('hang')
    expect(sanTienThuong.tham_so?.map((ts) => ts.ma)).toEqual(['yeu', 'ngang', 'manh'])

    // Lệnh sinh ra từ lựa chọn con chạy được trong động cơ
    const maVoHoc = luyenCong.tham_so![0]!.ma
    const kq = apDung(d, { loai: 'hanh_dong', ma: 'luyen_cong', tham_so: { vo_hoc: maVoHoc } }, DU_LIEU)
    expect(kq.loi).toBeNull()
    expect(kq.trang_thai.nhan_vat.vo_hoc[maVoHoc]?.tien_do).toBeGreaterThan(0)
  })

  it('khóa trước các trường hợp động cơ sẽ từ chối (thiếu thầy, thiếu tiền, hết AP)', () => {
    const d = taoNguoiChoiHoaSon(20)
    d.nhan_vat.mon_phai = null
    d.nhan_vat.gia_canh = 'binh_dan'
    d.nhan_vat.ap_con_lai = 0
    d.nhan_vat.ngan_luong = 0
    const tatCa = xemTabTuLuyen(d, DU_LIEU).flatMap((g) => g.hanh_dong)

    const hocTapHoc = tatCa.find((hd) => hd.ma === 'hoc_tap_hoc')!
    expect(hocTapHoc.bi_khoa).toBe(true)
    expect(hocTapHoc.ly_do).toBe('Hết AP')

    // Không còn AP nên AP là lý do đầu tiên; hết AP xong vẫn thấy lý do thiếu thầy khi còn AP
    const d2 = taoNguoiChoiHoaSon(20)
    d2.nhan_vat.mon_phai = null
    d2.nhan_vat.gia_canh = 'binh_dan'
    const hocTapHoc2 = xemTabTuLuyen(d2, DU_LIEU)
      .flatMap((g) => g.hanh_dong)
      .find((hd) => hd.ma === 'hoc_tap_hoc')!
    expect(hocTapHoc2.bi_khoa).toBe(true)
    expect(hocTapHoc2.ly_do).toBe('Cần thầy hoặc sách')

    const d3 = taoNguoiChoiHoaSon(20)
    d3.nhan_vat.ngan_luong = 5
    const nghiTro = xemTabTuLuyen(d3, DU_LIEU)
      .flatMap((g) => g.hanh_dong)
      .find((hd) => hd.ma === 'tri_thuong')!
    expect(nghiTro.bi_khoa).toBe(true)
    expect(nghiTro.ly_do).toBe('Cần 20 lạng')
  })
})

describe('M1-17 Tab 2 - Võ Học & Hành Trang', () => {
  it('4 trụ cột đúng số ô thật và môn đang trang bị', () => {
    const d = taoNguoiChoiHoaSon(20)
    const tab = xemTabVoHoc(d, DU_LIEU)

    expect(tab.tru_cot.map((tc) => tc.tru_cot)).toEqual([
      'noi_cong',
      'ngoai_cong',
      'khinh_cong',
      'tuyet_ky',
    ])
    const noiCong = tab.tru_cot.find((tc) => tc.tru_cot === 'noi_cong')!
    expect(noiCong.so_o).toBe(1)
    expect(noiCong.o).toHaveLength(1)
    expect(noiCong.o[0]?.ma).toBe('hoa_son_tam_phap')
    expect(noiCong.thao_duoc).toBe(true)

    // Ngộ tính 50: Ngoại công 2 + floor(50/25) = 4 ô (HS02 II.1)
    const ngoaiCong = tab.tru_cot.find((tc) => tc.tru_cot === 'ngoai_cong')!
    expect(ngoaiCong.so_o).toBe(4)
    expect(ngoaiCong.o).toHaveLength(4)
    expect(ngoaiCong.o.every((o) => o.trong)).toBe(true)
    expect(ngoaiCong.thao_duoc).toBe(false)

    const tuyetKy = tab.tru_cot.find((tc) => tc.tru_cot === 'tuyet_ky')!
    expect(tuyetKy.so_o).toBe(1 + Math.floor(60 / 50))
    expect(tuyetKy.o).toHaveLength(tuyetKy.so_o)
  })

  it('lệnh trang bị sinh từ lựa chọn của ô chạy được', () => {
    const d = taoNguoiChoiHoaSon(20)
    const tab = xemTabVoHoc(d, DU_LIEU)
    const ngoaiCong = tab.tru_cot.find((tc) => tc.tru_cot === 'ngoai_cong')!
    expect(ngoaiCong.lua_chon.map((lc) => lc.ma).sort()).toEqual([
      'hoa_son_kiem_phap',
      'hon_nguyen_chuong',
    ])

    const kq = apDung(
      d,
      { loai: 'trang_bi', o: 'ngoai_cong', ma: 'hoa_son_kiem_phap' },
      DU_LIEU,
    )
    expect(kq.loi).toBeNull()
    expect(kq.trang_thai.nhan_vat.trang_bi.ngoai_cong).toContain('hoa_son_kiem_phap')

    const sauTab = xemTabVoHoc(kq.trang_thai, DU_LIEU)
    const sauNgoaiCong = sauTab.tru_cot.find((tc) => tc.tru_cot === 'ngoai_cong')!
    expect(sauNgoaiCong.o[0]?.ma).toBe('hoa_son_kiem_phap')
    expect(sauNgoaiCong.lua_chon.find((lc) => lc.ma === 'hoa_son_kiem_phap')?.dang_dung).toBe(true)
  })

  it('hành trang lọc đan dược dùng được; chợ chỉ bán đan dược và chặn khi thiếu tiền', () => {
    const d = taoNguoiChoiHoaSon(20)
    d.nhan_vat.hanh_trang['kim_sang_duoc'] = 2
    d.nhan_vat.hanh_trang['thien_vuong_bao_tam_dan'] = 1
    d.nhan_vat.hanh_trang['khan_lua_chua_mat_do'] = 1

    let tab = xemTabVoHoc(d, DU_LIEU)
    expect(tab.hanh_trang.map((vp) => vp.ma).sort()).toEqual([
      'kim_sang_duoc',
      'thien_vuong_bao_tam_dan',
    ])
    expect(tab.hanh_trang.find((vp) => vp.ma === 'kim_sang_duoc')?.dung_duoc).toBe(true)
    expect(tab.hanh_trang.find((vp) => vp.ma === 'thien_vuong_bao_tam_dan')?.dung_duoc).toBe(false)

    // Chợ M1 chỉ đan dược; binh khí vào cùng ô trang bị ở M2-13
    expect(tab.cho.some((vp) => vp.ma === 'thiet_kiem')).toBe(false)
    expect(tab.cho.every((vp) => vp.mua_duoc)).toBe(true)
    expect(tab.cho[0]?.ma).toBe('kim_sang_duoc') // rẻ nhất lên trước

    d.nhan_vat.ngan_luong = 10
    tab = xemTabVoHoc(d, DU_LIEU)
    const kimSang = tab.cho.find((vp) => vp.ma === 'kim_sang_duoc')!
    expect(kimSang.mua_duoc).toBe(false)
    expect(kimSang.ly_do).toBe('Thiếu 5 lạng')

    // Lệnh dùng và lệnh mua chạy được
    const dung = apDung(d, { loai: 'dung_vat_pham', ma: 'kim_sang_duoc' }, DU_LIEU)
    expect(dung.loi).toBeNull()
    expect(dung.trang_thai.nhan_vat.hanh_trang['kim_sang_duoc']).toBe(1)

    d.nhan_vat.ngan_luong = 1_000
    const mua = apDung(d, { loai: 'mua', ma: 'tieu_hoan_dan', so_luong: 1 }, DU_LIEU)
    expect(mua.loi).toBeNull()
    expect(mua.trang_thai.nhan_vat.hanh_trang['tieu_hoan_dan']).toBe(1)
    expect(mua.trang_thai.nhan_vat.ngan_luong).toBe(850)
  })
})

describe('M1-17 Tab 4 - Môn Phái', () => {
  it('bậc, Cống hiến / mốc bậc kế và phần trăm tiến độ', () => {
    const d = taoNguoiChoiHoaSon(20)
    const mp = xemMonPhai(d, DU_LIEU)
    expect(mp.co_mon_phai).toBe(true)
    expect(mp.ten).toBe('Hoa Sơn Phái')
    expect(mp.ten_bac).toBe('Nội môn')
    expect(mp.moc_ke?.bac).toBe(3)
    expect(mp.moc_ke?.ten_bac).toBe('Chân truyền')
    expect(mp.moc_ke?.tuoi).toBe(20)
    expect(mp.moc_ke?.cong_hien).toBe(300)
    expect(mp.moc_ke?.qua_su_kien).toBe(false)
    expect(mp.tien_do).toBe(40) // 120 / 300
    expect(mp.roi_duoc).toBe(true)
  })

  it('Bậc 4 nhìn thấy mốc Chưởng môn qua đại sự kiện; Bậc 5 không rời phái được', () => {
    const d = taoNguoiChoiHoaSon(30)
    d.nhan_vat.mon_phai!.bac = 4
    d.nhan_vat.mon_phai!.cong_hien = 700
    const mp = xemMonPhai(d, DU_LIEU)
    expect(mp.moc_ke?.bac).toBe(5)
    expect(mp.moc_ke?.ten_bac).toBe('Chưởng môn')
    expect(mp.moc_ke?.qua_su_kien).toBe(true)

    d.nhan_vat.mon_phai!.bac = 5
    d.nhan_vat.mon_phai!.cong_hien = 1_500
    const bac5 = xemMonPhai(d, DU_LIEU)
    expect(bac5.moc_ke).toBeNull()
    expect(bac5.tien_do).toBe(100)
    expect(bac5.roi_duoc).toBe(false)
  })

  it('Tàng Kinh Các: giá theo tier, khóa khi thiếu Cống hiến', () => {
    const d = taoNguoiChoiHoaSon(20)
    const { dl, ma } = duLieuCoBiKipThem()
    const mp = xemMonPhai(d, dl)

    const hang = mp.tang_kinh_cac.find((h) => h.ma === ma)!
    expect(hang).toBeDefined()
    expect(hang.tier).toBe(2)
    expect(hang.gia).toBe(150) // HS02 I G19
    expect(hang.bi_khoa).toBe(true)
    expect(hang.ly_do).toBe('Thiếu 30 Cống hiến')

    d.nhan_vat.mon_phai!.cong_hien = 200
    const du = xemMonPhai(d, dl).tang_kinh_cac.find((h) => h.ma === ma)!
    expect(du.bi_khoa).toBe(false)

    const kq = apDung(
      d,
      { loai: 'hanh_dong', ma: 'tang_kinh_cac', tham_so: { vo_hoc: ma } },
      dl,
    )
    expect(kq.loi).toBeNull()
    expect(kq.trang_thai.nhan_vat.vo_hoc[ma]).toBeDefined()
    expect(kq.trang_thai.nhan_vat.mon_phai?.cong_hien).toBe(50)
  })

  it('chưa gia nhập phái thì Tab khóa và dữ liệu rỗng', () => {
    const d = taoNguoiChoiHoaSon(20)
    d.nhan_vat.mon_phai = null
    const mp = xemMonPhai(d, DU_LIEU)
    expect(mp.co_mon_phai).toBe(false)
    expect(mp.moc_ke).toBeNull()
    expect(mp.tang_kinh_cac).toEqual([])
    expect(mp.roi_duoc).toBe(false)
  })
})

describe('M1-17 Tab 3 - Nhân Mạch', () => {
  it('có sư phụ theo bậc và NPC đã gặp qua sự kiện', () => {
    const d = taoNguoiChoiHoaSon(20)
    d.nhan_vat.su_kien_da_gap['thang_bac_3'] = 1
    d.nhan_vat.su_kien_da_gap['dai_bien_co_ke_vi'] = 1

    const ds = xemNhanMach(d, DU_LIEU)
    expect(ds[0]?.ma).toBe('su_phu')
    expect(ds[0]?.vai_tro).toBe('Hoa Sơn Phái')
    expect(ds[0]?.mo_ta).toContain('cấp sư phụ 8')

    const daiSuHuynh = ds.filter((n) => n.ten === 'Đại Sư Huynh')
    expect(daiSuHuynh).toHaveLength(1) // trùng tên chỉ giữ một dòng
    expect(daiSuHuynh[0]?.vai_tro).toBe('Đối thủ')
    expect(daiSuHuynh[0]?.mo_ta).toContain('Thử Thách Bậc 3')
  })

  it('lãng khách chưa gặp ai thì danh sách rỗng', () => {
    const d = taoNguoiChoiHoaSon(20)
    d.nhan_vat.mon_phai = null
    expect(xemNhanMach(d, DU_LIEU)).toEqual([])
  })
})

describe('M1-17 Sheet Bát Tự', () => {
  it('chỉ hiện chỉ số hien_thi = hien, đúng nhóm và giá trị phái sinh', () => {
    const d = taoNguoiChoiHoaSon(20)
    const bt = xemBatTu(d, DU_LIEU)

    const maHienThi = Object.values(DU_LIEU.chi_so)
      .filter((cs) => cs.hien_thi === 'hien')
      .map((cs) => cs.ma)
      .sort()
    const maBatTu = bt.nhom.flatMap((g) => g.chi_so.map((cs) => cs.ma)).sort()
    expect(maBatTu).toEqual(maHienThi)
    expect(maBatTu).not.toContain('phuc_duyen')
    expect(maBatTu).not.toContain('can_cot_dinh')

    const lay = (ten: string): string | undefined =>
      bt.nhom.flatMap((g) => g.chi_so).find((cs) => cs.ten === ten)?.gia_tri
    expect(lay('Tuổi')).toBe('20')
    expect(lay('Căn Cốt')).toBe('60')
    expect(lay('Chiến Lực')).toBe(
      Math.round(chienLuc(d.nhan_vat, DU_LIEU)).toLocaleString('vi-VN'),
    )
    expect(lay('Võ Lực')).toBeDefined()

    // HS01 II.2: Danh vọng hiển thị cộng Danh vọng chức vị
    expect(lay('Danh Vọng')).toBe('0')
    d.nhan_vat.mon_phai!.bac = 4
    expect(
      xemBatTu(d, DU_LIEU)
        .nhom.flatMap((g) => g.chi_so)
        .find((cs) => cs.ma === 'danh_vong')?.gia_tri,
    ).toBe('150')
  })

  it('Phúc duyên chỉ hiện mô tả theo G02', () => {
    expect(moTaPhucDuyen(29)).toBe('Bạc mệnh')
    expect(moTaPhucDuyen(30)).toBe('Bình thường')
    expect(moTaPhucDuyen(59)).toBe('Bình thường')
    expect(moTaPhucDuyen(60)).toBe('Hồng phúc')
    expect(moTaPhucDuyen(89)).toBe('Hồng phúc')
    expect(moTaPhucDuyen(90)).toBe('Thiên mệnh')

    const d = taoNguoiChoiHoaSon(20)
    d.nhan_vat.phuc_duyen = 95
    expect(xemBatTu(d, DU_LIEU).phuc_duyen).toBe('Thiên mệnh')
  })

  it('Thiên phú, Trạng thái, Nhãn ra đúng tên và phẩm cấp', () => {
    const d = taoNguoiChoiHoaSon(20)
    d.nhan_vat.thien_phu = ['dao_hoa_kiep']
    d.nhan_vat.trang_thai = { bach_doc_bat_xam: { tu_tuoi: 18 } }
    d.nhan_vat.nhan = ['kieu_ngao']

    const bt = xemBatTu(d, DU_LIEU)
    expect(bt.thien_phu).toEqual([{ ma: 'dao_hoa_kiep', ten: 'Đào Hoa Kiếp', do_hiem: 2 }])
    expect(bt.trang_thai).toEqual([{ ma: 'bach_doc_bat_xam', ten: 'Bách Độc Bất Xâm' }])
    expect(bt.nhan).toEqual([{ ma: 'kieu_ngao', ten: 'Kiêu Ngạo' }])
  })
})
