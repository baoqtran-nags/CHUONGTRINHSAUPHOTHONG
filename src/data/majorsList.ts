import { ProgramCurriculum, CurriculumModule } from '../types';

export interface MajorInfo {
  id: string;
  code: string;
  name: string;
  level: 'cao_dang' | 'trung_cap';
  levelText: string;
  degreeText: string;
  durationText: string;
  department: string;
  description: string;
  totalCredits: number;
  totalHours: number;
  practiceRatioPercentage: number;
  modules: CurriculumModule[];
}

export const MAJORS_LIST: MajorInfo[] = [
  {
    id: 'major-cntt-cd',
    code: '6480201',
    name: 'Cao Đẳng - Lập Trình Máy Tính & Phát Triển Phần Mềm',
    level: 'cao_dang',
    levelText: 'Cao Đẳng',
    degreeText: 'Kỹ sư thực hành',
    durationText: '2.5 Năm (6 Học Kỳ)',
    department: 'Khoa Công Nghệ Thông Tin',
    description: 'Đào tạo cử nhân/kỹ sư thực hành có khả năng phân tích, thiết kế, phát triển ứng dụng Web Fullstack, App di động, quản trị CSDL SQL/NoSQL và tích hợp trí tuệ nhân tạo (AI) vào quy trình doanh nghiệp.',
    totalCredits: 85,
    totalHours: 1845,
    practiceRatioPercentage: 68,
    modules: [
      // HK1
      { id: 'm-cntt-1', code: 'MH01', name: 'Chính trị (Triết học & CNXHKH)', credits: 3, totalHours: 45, theoryHours: 30, practiceHours: 13, examHours: 2, semester: 1, block: 'Môn học chung', status: 'Đã hoàn thành', author: 'Khoa Lý luận', deliveryMode: 'Online 100%', notes: 'Nền tảng lý luận' },
      { id: 'm-cntt-2', code: 'MH02', name: 'Pháp luật đại cương & Luật An ninh mạng', credits: 2, totalHours: 30, theoryHours: 18, practiceHours: 10, examHours: 2, semester: 1, block: 'Môn học chung', status: 'Đã hoàn thành', author: 'Bộ môn Pháp Luật', deliveryMode: 'Online 100%', notes: 'Chuẩn GDNN 2026' },
      { id: 'm-cntt-3', code: 'MH03', name: 'Tiếng Anh Chuyên Ngành I (Level A2)', credits: 3, totalHours: 60, theoryHours: 20, practiceHours: 38, examHours: 2, semester: 1, block: 'Môn học chung', status: 'Đã hoàn thành', author: 'Khoa Ngoại Ngữ', deliveryMode: 'Blended Learning', notes: 'Tăng 60% nghe nói' },
      { id: 'm-cntt-4', code: 'MĐ04', name: 'Toán Rời Rạc & Lập Luận Thuật Toán', credits: 3, totalHours: 45, theoryHours: 30, practiceHours: 13, examHours: 2, semester: 1, block: 'Cơ sở ngành', status: 'Đã hoàn thành', author: 'ThS. Nguyễn Văn A', deliveryMode: 'Online 100%', notes: 'Tư duy logic' },
      { id: 'm-cntt-5', code: 'MĐ05', name: 'Nhập Môn Lập Trình C/C++ & Python', credits: 4, totalHours: 90, theoryHours: 25, practiceHours: 60, examHours: 5, semester: 1, block: 'Cơ sở ngành', status: 'Đã hoàn thành', author: 'TS. Lê Thị B', deliveryMode: 'Blended Learning', notes: 'Thực hành phòng máy' },
      // HK2
      { id: 'm-cntt-6', code: 'MĐ06', name: 'Lập Trình Hướng Đối Tượng (OOP Java/C#)', credits: 4, totalHours: 90, theoryHours: 25, practiceHours: 60, examHours: 5, semester: 2, block: 'Cơ sở ngành', status: 'Đã hoàn thành', author: 'ThS. Trần Văn C', deliveryMode: 'Blended Learning', notes: 'Thiết kế phần mềm' },
      { id: 'm-cntt-7', code: 'MĐ07', name: 'Cấu Trúc Dữ Liệu & Giải Thuật Ứng Dụng', credits: 4, totalHours: 90, theoryHours: 25, practiceHours: 60, examHours: 5, semester: 2, block: 'Cơ sở ngành', status: 'Đã hoàn thành', author: 'TS. Phạm Hoàng D', deliveryMode: 'Blended Learning', notes: 'Tối ưu hóa code' },
      { id: 'm-cntt-8', code: 'MĐ08', name: 'Cơ Sở Dữ Liệu Quan Hệ SQL Server / PostgreSQL', credits: 4, totalHours: 90, theoryHours: 25, practiceHours: 60, examHours: 5, semester: 2, block: 'Cơ sở ngành', status: 'Đã hoàn thành', author: 'ThS. Vũ Thị E', deliveryMode: 'Blended Learning', notes: 'Thiết kế ERD & Query' },
      { id: 'm-cntt-9', code: 'MĐ09', name: 'Kiến Trúc Mạng Máy Tính & TCP/IP', credits: 3, totalHours: 60, theoryHours: 20, practiceHours: 36, examHours: 4, semester: 2, block: 'Cơ sở ngành', status: 'Đang biên soạn', author: 'ThS. Bùi Văn G', deliveryMode: 'Blended Learning', notes: 'Cấu hình Router' },
      // HK3
      { id: 'm-cntt-10', code: 'MĐ10', name: 'Thiết Kế Web Front-End (HTML5, Tailwind, ReactJS)', credits: 5, totalHours: 120, theoryHours: 30, practiceHours: 85, examHours: 5, semester: 3, block: 'Chuyên môn', status: 'Đang biên soạn', author: 'Đỗ Minh F', deliveryMode: 'Blended Learning', notes: 'Dự án Website SPA' },
      { id: 'm-cntt-11', code: 'MĐ11', name: 'Lập Trình Web Back-End Node.js & RESTful API', credits: 5, totalHours: 120, theoryHours: 30, practiceHours: 85, examHours: 5, semester: 3, block: 'Chuyên môn', status: 'Đang biên soạn', author: 'ThS. Bùi Văn H', deliveryMode: 'Blended Learning', notes: 'Xây dựng Server API' },
      { id: 'm-cntt-12', code: 'MĐ12', name: 'Lập Trình Ứng Dụng Di Động Flutter / Android', credits: 4, totalHours: 90, theoryHours: 20, practiceHours: 65, examHours: 5, semester: 3, block: 'Chuyên môn', status: 'Chưa thực hiện', author: 'Đang phân công', deliveryMode: 'Blended Learning', notes: 'Cross-platform Mobile' },
      // HK4
      { id: 'm-cntt-13', code: 'MĐ13', name: 'Ứng Dụng Trí Tuệ Nhân Tạo (AI) & Prompt Engineering 2026', credits: 3, totalHours: 75, theoryHours: 20, practiceHours: 51, examHours: 4, semester: 4, block: 'Chuyên môn', status: 'Đang biên soạn', author: 'TS. Nguyễn AI', deliveryMode: 'Online 100%', notes: 'Môn chuẩn 2026' },
      { id: 'm-cntt-14', code: 'MĐ14', name: 'Điện Toán Đám Mây & Cloud Deployment (Docker/AWS)', credits: 3, totalHours: 75, theoryHours: 20, practiceHours: 51, examHours: 4, semester: 4, block: 'Chuyên môn', status: 'Chưa thực hiện', author: 'Chưa phân công', deliveryMode: 'Blended Learning', notes: 'CI/CD pipeline' },
      { id: 'm-cntt-15', code: 'MĐ15', name: 'An Toàn Thông Tin & Kiểm Thử Phần Mềm (QA/QC)', credits: 3, totalHours: 75, theoryHours: 20, practiceHours: 51, examHours: 4, semester: 4, block: 'Chuyên môn', status: 'Chưa thực hiện', author: 'Chưa phân công', deliveryMode: 'Blended Learning', notes: 'Automation test' },
      // HK5 & HK6
      { id: 'm-cntt-16', code: 'MĐ16', name: 'Thực Tập Doanh Nghiệp Công Nghệ (Enterprise Internship)', credits: 12, totalHours: 360, theoryHours: 0, practiceHours: 350, examHours: 10, semester: 5, block: 'Thực tập / Tốt nghiệp', status: 'Đã hoàn thành', author: 'Khoa CNTT & Doanh nghiệp', deliveryMode: 'Trực tiếp (Offline)', notes: 'Thực tập 12 tuần tại DN' },
      { id: 'm-cntt-17', code: 'MĐ17', name: 'Đồ Án Tốt Nghiệp Kỹ Sư Thực Hành (Capstone Project)', credits: 8, totalHours: 240, theoryHours: 20, practiceHours: 210, examHours: 10, semester: 6, block: 'Thực tập / Tốt nghiệp', status: 'Đã hoàn thành', author: 'Hội đồng Khoa học', deliveryMode: 'Trực tiếp (Offline)', notes: 'Bảo vệ đồ án hoàn chỉnh' }
    ]
  },

  {
    id: 'major-ks-cd',
    code: '6810201',
    name: 'Cao Đẳng - Quản Trị Khách Sạn & Nhà Hàng',
    level: 'cao_dang',
    levelText: 'Cao Đẳng',
    degreeText: 'Cử nhân thực hành',
    durationText: '2.5 Năm (6 Học Kỳ)',
    department: 'Khoa Du Lịch - Khách Sạn',
    description: 'Chương trình đào tạo nhân sự quản lý nhà hàng khách sạn theo tiêu chuẩn quốc tế VTOS. Học viên nắm vững nghiệp vụ Lễ tân, Buồng phòng, Ẩm thực (F&B), Quản trị sự kiện và Tiếng Anh giao tiếp phản xạ cao.',
    totalCredits: 78,
    totalHours: 1680,
    practiceRatioPercentage: 72,
    modules: [
      { id: 'm-ks-1', code: 'MH01', name: 'Chính trị & Văn hóa Giao tiếp Du lịch', credits: 3, totalHours: 45, theoryHours: 30, practiceHours: 13, examHours: 2, semester: 1, block: 'Môn học chung', status: 'Đã hoàn thành', author: 'Khoa Du lịch', deliveryMode: 'Online 100%', notes: 'Văn hóa ứng xử' },
      { id: 'm-ks-2', code: 'MH02', name: 'Tiếng Anh Khách Sạn & Nhà Hàng I', credits: 4, totalHours: 90, theoryHours: 25, practiceHours: 61, examHours: 4, semester: 1, block: 'Môn học chung', status: 'Đã hoàn thành', author: 'Khoa Ngoại ngữ', deliveryMode: 'Blended Learning', notes: 'Giao tiếp phản xạ' },
      { id: 'm-ks-3', code: 'MĐ03', name: 'Tổng Quan Ngành Du Lịch & Khách Sạn', credits: 3, totalHours: 45, theoryHours: 25, practiceHours: 18, examHours: 2, semester: 1, block: 'Cơ sở ngành', status: 'Đã hoàn thành', author: 'ThS. Lê Hoàng Yến', deliveryMode: 'Online 100%', notes: 'Tiêu chuẩn VTOS' },
      { id: 'm-ks-4', code: 'MĐ04', name: 'Nghiệp Vụ Lễ Tân Khách Sạn (Front Office Opera/Smile)', credits: 5, totalHours: 120, theoryHours: 25, practiceHours: 90, examHours: 5, semester: 2, block: 'Chuyên môn', status: 'Đã hoàn thành', author: 'ThS. Trần Thị Mai', deliveryMode: 'Blended Learning', notes: 'Thực hành phần mềm Opera' },
      { id: 'm-ks-5', code: 'MĐ05', name: 'Nghiệp Vụ Buồng Phòng (Housekeeping)', credits: 4, totalHours: 90, theoryHours: 20, practiceHours: 66, examHours: 4, semester: 2, block: 'Chuyên môn', status: 'Đã hoàn thành', author: 'Nguyễn Văn Nam', deliveryMode: 'Trực tiếp (Offline)', notes: 'Thực hành phòng mẫu 5 sao' },
      { id: 'm-ks-6', code: 'MĐ06', name: 'Nghiệp Vụ Nhà Hàng & Phục Vụ Ẩm Thực (F&B)', credits: 5, totalHours: 120, theoryHours: 25, practiceHours: 90, examHours: 5, semester: 3, block: 'Chuyên môn', status: 'Đang biên soạn', author: 'ThS. Phạm Quốc Tuấn', deliveryMode: 'Trực tiếp (Offline)', notes: 'Set up bàn tiệc Âu/Á' },
      { id: 'm-ks-7', code: 'MĐ07', name: 'Nghiệp Vụ Pha Chế Bar & Barista', credits: 3, totalHours: 75, theoryHours: 15, practiceHours: 56, examHours: 4, semester: 3, block: 'Chuyên môn', status: 'Đang biên soạn', author: 'Chuyên gia Barista', deliveryMode: 'Trực tiếp (Offline)', notes: 'Thực hành xưởng pha chế' },
      { id: 'm-ks-8', code: 'MĐ08', name: 'Quản Trị Nhân Sự & Chăm Sóc Khách Hàng 5 Tinh', credits: 3, totalHours: 60, theoryHours: 25, practiceHours: 32, examHours: 3, semester: 4, block: 'Cơ sở ngành', status: 'Chưa thực hiện', author: 'Khoa Du lịch', deliveryMode: 'Online 100%', notes: 'Kỹ năng giải quyết khiếu nại' },
      { id: 'm-ks-9', code: 'MĐ09', name: 'Thực Tập Nghiệp Vụ Tại Khách Sạn 4-5 Sao TP.HCM', credits: 12, totalHours: 360, theoryHours: 0, practiceHours: 350, examHours: 10, semester: 5, block: 'Thực tập / Tốt nghiệp', status: 'Đã hoàn thành', author: 'Doanh nghiệp đối tác', deliveryMode: 'Trực tiếp (Offline)', notes: 'Thực tập thực tế 3 tháng' },
      { id: 'm-ks-10', code: 'MĐ10', name: 'Báo Cáo Tốt Nghiệp Quản Trị Khách Sạn', credits: 6, totalHours: 180, theoryHours: 10, practiceHours: 165, examHours: 5, semester: 6, block: 'Thực tập / Tốt nghiệp', status: 'Đã hoàn thành', author: 'Hội đồng Khoa học', deliveryMode: 'Trực tiếp (Offline)', notes: 'Thẩm định đề tài tốt nghiệp' }
    ]
  },

  {
    id: 'major-oto-cd',
    code: '6520216',
    name: 'Cao Đẳng - Công Nghệ Ô Tô & Xe Điện (EV Auto Technology)',
    level: 'cao_dang',
    levelText: 'Cao Đẳng',
    degreeText: 'Kỹ sư thực hành',
    durationText: '2.5 Năm (6 Học Kỳ)',
    department: 'Khoa Cơ Khí - Động Lực',
    description: 'Chẩn đoán, bảo dưỡng, sửa chữa động cơ đốt trong, hệ thống gầm, điện - điện tử ô tô hiện đại và đón đầu xu hướng xe điện (EV), pin Lithium & kiểm tra mã lỗi OBD-II.',
    totalCredits: 82,
    totalHours: 1800,
    practiceRatioPercentage: 75,
    modules: [
      { id: 'm-oto-1', code: 'MH01', name: 'Chính trị & An toàn Lao động Xưởng Ô tô', credits: 3, totalHours: 45, theoryHours: 25, practiceHours: 18, examHours: 2, semester: 1, block: 'Môn học chung', status: 'Đã hoàn thành', author: 'Khoa Cơ khí', deliveryMode: 'Online 100%', notes: 'Kỹ năng Xanh & An toàn 2026' },
      { id: 'm-oto-2', code: 'MĐ02', name: 'Vẽ Kỹ Thuật Ô Tô & Cấu Tạo Động Cơ', credits: 4, totalHours: 90, theoryHours: 30, practiceHours: 55, examHours: 5, semester: 1, block: 'Cơ sở ngành', status: 'Đã hoàn thành', author: 'TS. Nguyễn Văn Cơ', deliveryMode: 'Blended Learning', notes: 'CAD 2D/3D ô tô' },
      { id: 'm-oto-3', code: 'MĐ03', name: 'Kỹ Thuật Điện - Điện Tử Ô Tô Cơ Bản', credits: 4, totalHours: 90, theoryHours: 25, practiceHours: 60, examHours: 5, semester: 1, block: 'Cơ sở ngành', status: 'Đã hoàn thành', author: 'ThS. Trần Điện', deliveryMode: 'Blended Learning', notes: 'Mạch điện ô tô' },
      { id: 'm-oto-4', code: 'MĐ04', name: 'Thực Hành Bảo Dưỡng Động Cơ Ô Tô', credits: 5, totalHours: 120, theoryHours: 20, practiceHours: 95, examHours: 5, semester: 2, block: 'Chuyên môn', status: 'Đã hoàn thành', author: 'Bộ môn Động lực', deliveryMode: 'Trực tiếp (Offline)', notes: 'Tháo lắp động cơ xưởng' },
      { id: 'm-oto-5', code: 'MĐ05', name: 'Hệ Thống Phanh, Lái, Treo (Chẩn Đoán Khung Gầm)', credits: 5, totalHours: 120, theoryHours: 20, practiceHours: 95, examHours: 5, semester: 2, block: 'Chuyên môn', status: 'Đang biên soạn', author: 'ThS. Lê Khung Gầm', deliveryMode: 'Trực tiếp (Offline)', notes: 'Cân chỉnh góc đặt bánh xe' },
      { id: 'm-oto-6', code: 'MĐ06', name: 'Hệ Thống Phun Xăng & Phun Dầu Điện Tử (EFI/CRDi)', credits: 5, totalHours: 120, theoryHours: 25, practiceHours: 90, examHours: 5, semester: 3, block: 'Chuyên môn', status: 'Đang biên soạn', author: 'TS. Hoàng Ô tô', deliveryMode: 'Blended Learning', notes: 'Sử dụng máy đọc lỗi G-Scan' },
      { id: 'm-oto-7', code: 'MĐ07', name: 'Công Nghệ Xe Điện (EV), Hybrid & Pin Lithium 2026', credits: 4, totalHours: 90, theoryHours: 25, practiceHours: 60, examHours: 5, semester: 4, block: 'Chuyên môn', status: 'Đang biên soạn', author: 'Chuyên gia VinFast/Toyota', deliveryMode: 'Blended Learning', notes: 'Môn đột phá 2026' },
      { id: 'm-oto-8', code: 'MĐ08', name: 'Thực Tập Doanh Nghiệp Tại Garage / Showroom Ô tô', credits: 12, totalHours: 360, theoryHours: 0, practiceHours: 350, examHours: 10, semester: 5, block: 'Thực tập / Tốt nghiệp', status: 'Đã hoàn thành', author: 'Garage đối tác TP.HCM', deliveryMode: 'Trực tiếp (Offline)', notes: 'Thực tập xưởng dịch vụ' },
      { id: 'm-oto-9', code: 'MĐ09', name: 'Đồ Án Tốt Nghiệp Kỹ Thuật Ô Tô', credits: 6, totalHours: 180, theoryHours: 10, practiceHours: 165, examHours: 5, semester: 6, block: 'Thực tập / Tốt nghiệp', status: 'Đã hoàn thành', author: 'Hội đồng Khoa học', deliveryMode: 'Trực tiếp (Offline)', notes: 'Bảo vệ mô hình ô tô' }
    ]
  },

  {
    id: 'major-ketoan-cd',
    code: '6340301',
    name: 'Cao Đẳng - Kế Toán Doanh Nghiệp & Thuế Điện Tử',
    level: 'cao_dang',
    levelText: 'Cao Đẳng',
    degreeText: 'Cử nhân thực hành',
    durationText: '2.5 Năm (6 Học Kỳ)',
    department: 'Khoa Tài Chính - Kế Toán',
    description: 'Thực hành hạch toán kế toán, lập báo cáo tài chính, kê khai thuế GTGT/TNDN/TNCN trên phần mềm MISA, FAST và ứng dụng hóa đơn điện tử, kiểm toán doanh nghiệp.',
    totalCredits: 76,
    totalHours: 1560,
    practiceRatioPercentage: 65,
    modules: [
      { id: 'm-kt-1', code: 'MH01', name: 'Chính trị & Luật Doanh Nghiệp / Luật Thuế', credits: 3, totalHours: 45, theoryHours: 30, practiceHours: 13, examHours: 2, semester: 1, block: 'Môn học chung', status: 'Đã hoàn thành', author: 'Khoa Kế toán', deliveryMode: 'Online 100%', notes: 'Cập nhật Thông tư mới' },
      { id: 'm-kt-2', code: 'MH02', name: 'Tiếng Anh Thương Mại & Kế Toán', credits: 3, totalHours: 60, theoryHours: 20, practiceHours: 38, examHours: 2, semester: 1, block: 'Môn học chung', status: 'Đã hoàn thành', author: 'Khoa Ngoại ngữ', deliveryMode: 'Blended Learning', notes: 'Thuật ngữ kế toán Anh-Việt' },
      { id: 'm-kt-3', code: 'MĐ03', name: 'Nguyên Lý Kế Toán & Tài Chính Doanh Nghiệp', credits: 4, totalHours: 90, theoryHours: 35, practiceHours: 50, examHours: 5, semester: 1, block: 'Cơ sở ngành', status: 'Đã hoàn thành', author: 'ThS. Nguyễn Thị Kế', deliveryMode: 'Online 100%', notes: 'Tài khoản & Hạch toán' },
      { id: 'm-kt-4', code: 'MĐ04', name: 'Kế Toán Tài Chính I (Hàng Hóa, Vốn Bằng Tiền)', credits: 4, totalHours: 90, theoryHours: 30, practiceHours: 55, examHours: 5, semester: 2, block: 'Chuyên môn', status: 'Đã hoàn thành', author: 'ThS. Trần Thuế', deliveryMode: 'Blended Learning', notes: 'Bài tập chứng từ thực tế' },
      { id: 'm-kt-5', code: 'MĐ05', name: 'Kế Toán Tài Chính II (Tài Sản Cố Định & Chi Phí)', credits: 4, totalHours: 90, theoryHours: 30, practiceHours: 55, examHours: 5, semester: 2, block: 'Chuyên môn', status: 'Đã hoàn thành', author: 'ThS. Phạm Sổ Sách', deliveryMode: 'Blended Learning', notes: 'Trích khấu hao & tính giá thành' },
      { id: 'm-kt-6', code: 'MĐ06', name: 'Thực Hành Kế Toán Trên Phần Mềm MISA / FAST', credits: 5, totalHours: 120, theoryHours: 20, practiceHours: 95, examHours: 5, semester: 3, block: 'Chuyên môn', status: 'Đang biên soạn', author: 'MISA Certified Trainer', deliveryMode: 'Blended Learning', notes: 'Nhập liệu chứng từ thực tế' },
      { id: 'm-kt-7', code: 'MĐ07', name: 'Kê Khai Thuế Điện Tử & Báo Cáo Tài Chính', credits: 4, totalHours: 90, theoryHours: 25, practiceHours: 60, examHours: 5, semester: 3, block: 'Chuyên môn', status: 'Đang biên soạn', author: 'Chuyên gia Thuế TP.HCM', deliveryMode: 'Blended Learning', notes: 'Sử dụng HTKK & hóa đơn điện tử' },
      { id: 'm-kt-8', code: 'MĐ08', name: 'Phân Tích Báo Cáo Tài Chính & Kiểm Toán Doanh Nghiệp', credits: 3, totalHours: 60, theoryHours: 25, practiceHours: 32, examHours: 3, semester: 4, block: 'Cơ sở ngành', status: 'Chưa thực hiện', author: 'Khoa Kế toán', deliveryMode: 'Online 100%', notes: 'Chỉ số tài chính' },
      { id: 'm-kt-9', code: 'MĐ09', name: 'Thực Tập Tốt Nghiệp Tại Công Ty / Văn Phòng Kế Toán', credits: 10, totalHours: 300, theoryHours: 0, practiceHours: 290, examHours: 10, semester: 5, block: 'Thực tập / Tốt nghiệp', status: 'Đã hoàn thành', author: 'Doanh nghiệp dịch vụ kế toán', deliveryMode: 'Trực tiếp (Offline)', notes: 'Cắt dán chứng từ & nộp báo cáo' },
      { id: 'm-kt-10', code: 'MĐ10', name: 'Khóa Luận Tốt Nghiệp Kế Toán', credits: 5, totalHours: 150, theoryHours: 10, practiceHours: 135, examHours: 5, semester: 6, block: 'Thực tập / Tốt nghiệp', status: 'Đã hoàn thành', author: 'Hội đồng Khoa học', deliveryMode: 'Trực tiếp (Offline)', notes: 'Bảo vệ chuyên đề kế toán' }
    ]
  },

  {
    id: 'major-dohoa-cd',
    code: '6210401',
    name: 'Cao Đẳng - Thiết Kế Đồ Họa & Truyền Thông Đa Phương Tiện',
    level: 'cao_dang',
    levelText: 'Cao Đẳng',
    degreeText: 'Cử nhân thực hành',
    durationText: '2.5 Năm (6 Học Kỳ)',
    department: 'Khoa Mỹ Thuật Ứng Dụng',
    description: 'Thành thạo phần mềm thiết kế thương hiệu Adobe Photoshop, Illustrator, InDesign, UI/UX Figma, dựng phim Premiere/After Effects và mỹ thuật số.',
    totalCredits: 80,
    totalHours: 1720,
    practiceRatioPercentage: 74,
    modules: [
      { id: 'm-dh-1', code: 'MH01', name: 'Chính trị & Trang Trí Mỹ Thuật Cơ Bản', credits: 3, totalHours: 45, theoryHours: 20, practiceHours: 23, examHours: 2, semester: 1, block: 'Môn học chung', status: 'Đã hoàn thành', author: 'Khoa Mỹ thuật', deliveryMode: 'Online 100%', notes: 'Tư duy màu sắc' },
      { id: 'm-dh-2', code: 'MĐ02', name: 'Mỹ Thuật Vô Hình & Nghiên Cứu Font Chữ (Typography)', credits: 4, totalHours: 90, theoryHours: 25, practiceHours: 60, examHours: 5, semester: 1, block: 'Cơ sở ngành', status: 'Đã hoàn thành', author: 'ThS. Nguyễn Graphic', deliveryMode: 'Blended Learning', notes: 'Thiết kế nhận diện chữ' },
      { id: 'm-dh-3', code: 'MĐ03', name: 'Xử Lý Ảnh Chuyên Nghiệp Với Adobe Photoshop', credits: 5, totalHours: 120, theoryHours: 25, practiceHours: 90, examHours: 5, semester: 1, block: 'Chuyên môn', status: 'Đã hoàn thành', author: 'Chuyên gia Design', deliveryMode: 'Blended Learning', notes: 'Photoshop retouch & banner' },
      { id: 'm-dh-4', code: 'MĐ04', name: 'Thiết Kế Vector Với Adobe Illustrator (AI)', credits: 5, totalHours: 120, theoryHours: 25, practiceHours: 90, examHours: 5, semester: 2, block: 'Chuyên môn', status: 'Đã hoàn thành', author: 'ThS. Lê Vector', deliveryMode: 'Blended Learning', notes: 'Thiết kế Logo & Mascot' },
      { id: 'm-dh-5', code: 'MĐ05', name: 'Thiết Kế Bộ Nhận Diện Thương Hiệu (Branding Systems)', credits: 5, totalHours: 120, theoryHours: 25, practiceHours: 90, examHours: 5, semester: 2, block: 'Chuyên môn', status: 'Đang biên soạn', author: 'Art Director', deliveryMode: 'Blended Learning', notes: 'Brand Guideline hoàn chỉnh' },
      { id: 'm-dh-6', code: 'MĐ06', name: 'Thiết Kế Giao Diện Người Dùng UI/UX Với Figma 2026', credits: 5, totalHours: 120, theoryHours: 25, practiceHours: 90, examHours: 5, semester: 3, block: 'Chuyên môn', status: 'Đang biên soạn', author: 'UX Lead', deliveryMode: 'Blended Learning', notes: 'Thiết kế App/Web Prototype' },
      { id: 'm-dh-7', code: 'MĐ07', name: 'Dựng Phim & Hiệu Ứng Chuyển Động (Premiere & After Effects)', credits: 5, totalHours: 120, theoryHours: 25, practiceHours: 90, examHours: 5, semester: 4, block: 'Chuyên môn', status: 'Chưa thực hiện', author: 'Video Editor Pro', deliveryMode: 'Blended Learning', notes: 'Motion Graphics 2D/3D' },
      { id: 'm-dh-8', code: 'MĐ08', name: 'Thực Tập Doanh Nghiệp Truyền Thông / Agency Quảng Cáo', credits: 10, totalHours: 300, theoryHours: 0, practiceHours: 290, examHours: 10, semester: 5, block: 'Thực tập / Tốt nghiệp', status: 'Đã hoàn thành', author: 'Agency đối tác TP.HCM', deliveryMode: 'Trực tiếp (Offline)', notes: 'Thực chiến dự án thực tế' },
      { id: 'm-dh-9', code: 'MĐ09', name: 'Đồ Án Tốt Nghiệp Thiết Kế Đồ Họa (Portfolio)', credits: 8, totalHours: 240, theoryHours: 15, practiceHours: 215, examHours: 10, semester: 6, block: 'Thực tập / Tốt nghiệp', status: 'Đã hoàn thành', author: 'Hội đồng Mỹ thuật', deliveryMode: 'Trực tiếp (Offline)', notes: 'Triển lãm sản phẩm đồ họa' }
    ]
  },

  {
    id: 'major-duoc-tc',
    code: '5720101',
    name: 'Trung Cấp - Dược Khoa & Quản Lý Nhà Thuốc',
    level: 'trung_cap',
    levelText: 'Trung Cấp',
    degreeText: 'Dược sĩ trung cấp',
    durationText: '1.5 Năm (4 Học Kỳ)',
    department: 'Khoa Y - Dược',
    description: 'Đào tạo dược sĩ trung cấp nắm vững kiến thức Dược lý, Dược lâm sàng, Bào chế thuốc, Kỹ năng tư vấn bán thuốc theo chuẩn GPP và thực hành tại nhà thuốc/bệnh viện.',
    totalCredits: 52,
    totalHours: 1250,
    practiceRatioPercentage: 66,
    modules: [
      { id: 'm-duoc-1', code: 'MH01', name: 'Chính trị & Dược Đức (Đạo Đức Nghề Y)', credits: 2, totalHours: 30, theoryHours: 18, practiceHours: 10, examHours: 2, semester: 1, block: 'Môn học chung', status: 'Đã hoàn thành', author: 'Khoa Y Dược', deliveryMode: 'Online 100%', notes: 'Đạo đức ngành y' },
      { id: 'm-duoc-2', code: 'MH02', name: 'Tin Học Y Dược & Quản Lý Nhà Thuốc', credits: 2, totalHours: 45, theoryHours: 15, practiceHours: 28, examHours: 2, semester: 1, block: 'Môn học chung', status: 'Đã hoàn thành', author: 'Bộ môn Tin học', deliveryMode: 'Online 100%', notes: 'Phần mềm bán thuốc GPP' },
      { id: 'm-duoc-3', code: 'MĐ03', name: 'Giải Phẫu Học & Sinh Lý Học Người', credits: 3, totalHours: 60, theoryHours: 35, practiceHours: 21, examHours: 4, semester: 1, block: 'Cơ sở ngành', status: 'Đã hoàn thành', author: 'BS. Nguyễn Văn Y', deliveryMode: 'Online 100%', notes: 'Mô hình cơ thể người' },
      { id: 'm-duoc-4', code: 'MĐ04', name: 'Dược Lý Học I (Nhóm Thuốc Kháng Sinh, Giảm Đau)', credits: 4, totalHours: 90, theoryHours: 35, practiceHours: 50, examHours: 5, semester: 1, block: 'Cơ sở ngành', status: 'Đã hoàn thành', author: 'DS. Trần Thị Thuốc', deliveryMode: 'Blended Learning', notes: 'Cơ chế tác dụng thuốc' },
      { id: 'm-duoc-5', code: 'MĐ05', name: 'Dược Bào Chế & Kiểm Nghiệm Thuốc', credits: 4, totalHours: 90, theoryHours: 25, practiceHours: 60, examHours: 5, semester: 2, block: 'Chuyên môn', status: 'Đã hoàn thành', author: 'DS. Phạm Bào Chế', deliveryMode: 'Trực tiếp (Offline)', notes: 'Thực hành phòng thí nghiệm' },
      { id: 'm-duoc-6', code: 'MĐ06', name: 'Dược Liệu & Thuốc Y Học Cổ Truyền', credits: 3, totalHours: 75, theoryHours: 25, practiceHours: 46, examHours: 4, semester: 2, block: 'Chuyên môn', status: 'Đang biên soạn', author: 'DS. Bùi Cổ Truyền', deliveryMode: 'Blended Learning', notes: 'Nhận biết thảo dược' },
      { id: 'm-duoc-7', code: 'MĐ07', name: 'Kỹ Năng Tư Vấn Thuốc & Tiêu Chuẩn Nhà Thuốc GPP', credits: 4, totalHours: 90, theoryHours: 25, practiceHours: 60, examHours: 5, semester: 3, block: 'Chuyên môn', status: 'Đang biên soạn', author: 'Chủ nhà thuốc GPP', deliveryMode: 'Blended Learning', notes: 'Thực hành tư vấn đơn thuốc' },
      { id: 'm-duoc-8', code: 'MĐ08', name: 'Thực Tập Tại Bệnh Viện & Nhà Thuốc Chuẩn GPP TP.HCM', credits: 8, totalHours: 240, theoryHours: 0, practiceHours: 230, examHours: 10, semester: 4, block: 'Thực tập / Tốt nghiệp', status: 'Đã hoàn thành', author: 'Bệnh viện & Nhà thuốc đối tác', deliveryMode: 'Trực tiếp (Offline)', notes: 'Thực tập 8 tuần thực tế' }
    ]
  }
];

export function getMajorById(id: string): MajorInfo | undefined {
  return MAJORS_LIST.find(m => m.id === id);
}

export function convertMajorToProgram(major: MajorInfo): ProgramCurriculum {
  return {
    id: `program-${major.id}`,
    name: major.name,
    level: major.level,
    fileName: `${major.name}.xlsx`,
    updatedAt: new Date().toISOString(),
    activeSheet: `Khung Đào Tạo - ${major.name.split('-')[1]?.trim() || major.name}`,
    sheets: {
      [`Khung Đào Tạo - ${major.name.split('-')[1]?.trim() || major.name}`]: {
        sheetName: `Khung Đào Tạo - ${major.name.split('-')[1]?.trim() || major.name}`,
        modules: major.modules,
        rawColumns: ['Mã môn', 'Tên môn học/mô đun', 'Số tín chỉ', 'Tổng giờ', 'Lý thuyết', 'Thực hành', 'Học kỳ', 'Khối kiến thức', 'Trạng thái', 'Người phụ trách', 'Ghi chú']
      }
    }
  };
}
