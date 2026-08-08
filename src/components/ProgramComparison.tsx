import React from 'react';
import { 
  GitCompare, 
  CheckCircle2, 
  Award, 
  Clock, 
  PieChart, 
  BookOpen, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { CurriculumMetrics, ProgramCurriculum, SheetData } from '../types';
import { calculateMetrics } from '../utils/curriculumAnalyzer';

interface ProgramComparisonProps {
  trungCapProgram: ProgramCurriculum;
  caoDangProgram: ProgramCurriculum;
}

export const ProgramComparison: React.FC<ProgramComparisonProps> = ({
  trungCapProgram,
  caoDangProgram
}) => {
  // Aggregate modules across all sheets for Trung Cấp
  const tcModules = (Object.values(trungCapProgram.sheets) as SheetData[]).flatMap(s => s.modules);
  const cdModules = (Object.values(caoDangProgram.sheets) as SheetData[]).flatMap(s => s.modules);

  const tcMetrics: CurriculumMetrics = calculateMetrics(tcModules, 'trung_cap');
  const cdMetrics: CurriculumMetrics = calculateMetrics(cdModules, 'cao_dang');

  return (
    <div className="space-y-6">
      
      {/* Title Banner */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-xs font-semibold mb-2">
            <GitCompare className="w-3.5 h-3.5" />
            <span>Đối Sánh Chuẩn Khung Khối Lượng Kiến Thức GDNN</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight">So Sánh Chương Trình Trung Cấp vs Cao Đẳng</h2>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            Phân tích điểm khác biệt về thời lượng, tổng số tín chỉ, tỷ lệ lý thuyết/thực hành và yêu cầu chuẩn đầu ra theo Thông tư Bộ LĐTBXH.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700 text-center min-w-[120px]">
            <span className="text-2xs text-slate-400 uppercase font-semibold block">Chênh lệch TC</span>
            <span className="text-lg font-black text-emerald-400">+{cdMetrics.totalCredits - tcMetrics.totalCredits} TC</span>
          </div>
          <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700 text-center min-w-[120px]">
            <span className="text-2xs text-slate-400 uppercase font-semibold block">Chênh lệch Giờ</span>
            <span className="text-lg font-black text-blue-400">+{cdMetrics.totalHours - tcMetrics.totalHours}g</span>
          </div>
        </div>
      </div>

      {/* Metric Side-by-Side Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* TRUNG CẤP CARD */}
        <div className="bg-white p-5 rounded-2xl border-2 border-blue-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-lg text-xs font-bold">
                HỆ TRUNG CẤP
              </span>
              <h3 className="text-sm font-bold text-slate-900">{trungCapProgram.name}</h3>
            </div>
            <span className="text-2xs font-semibold text-slate-500">Thời gian: 1.5 - 2 năm (4 HK)</span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl">
              <span className="text-slate-500 block text-2xs uppercase">Tổng Tín Chỉ</span>
              <span className="text-xl font-black text-blue-700">{tcMetrics.totalCredits} TC</span>
              <span className="text-2xs text-slate-400 block mt-0.5">Chuẩn TC: 60 - 75 TC</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl">
              <span className="text-slate-500 block text-2xs uppercase">Tổng Số Giờ</span>
              <span className="text-xl font-black text-slate-800">{tcMetrics.totalHours}g</span>
              <span className="text-2xs text-slate-400 block mt-0.5">LT: {tcMetrics.totalTheoryHours}g | TH: {tcMetrics.totalPracticeHours}g</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl">
              <span className="text-slate-500 block text-2xs uppercase">Tỷ Lệ Thực Hành</span>
              <span className="text-xl font-black text-emerald-700">{tcMetrics.practicalRatio.toFixed(1)}%</span>
              <span className="text-2xs font-medium text-emerald-600 block mt-0.5">✓ Quy định GDNN ≥50%</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl">
              <span className="text-slate-500 block text-2xs uppercase">Số Lượng Mô-đun</span>
              <span className="text-xl font-black text-slate-800">{tcMetrics.totalModules} môn</span>
              <span className="text-2xs text-slate-400 block mt-0.5">Đã hoàn thành: {tcMetrics.statusBreakdown['Đã hoàn thành'] || 0}</span>
            </div>
          </div>

          <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100 text-xs space-y-1.5 text-blue-900">
            <div className="font-bold text-blue-900 flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-blue-600" /> Đặc điểm khung Trung cấp:
            </div>
            <p className="text-2xs text-blue-800">
              • Tập trung rèn luyện kỹ năng thực hành tay nghề cốt lõi.<br />
              • Thời lượng rút gọn, thích hợp học sinh tốt nghiệp THCS / THPT học nghề nhanh.<br />
              • Khối lượng lý thuyết vừa đủ để nắm vững thao tác kỹ thuật.
            </p>
          </div>
        </div>

        {/* CAO ĐẲNG CARD */}
        <div className="bg-white p-5 rounded-2xl border-2 border-emerald-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-lg text-xs font-bold">
                HỆ CAO ĐẲNG
              </span>
              <h3 className="text-sm font-bold text-slate-900">{caoDangProgram.name}</h3>
            </div>
            <span className="text-2xs font-semibold text-slate-500">Thời gian: 2.5 - 3 năm (6 HK)</span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl">
              <span className="text-slate-500 block text-2xs uppercase">Tổng Tín Chỉ</span>
              <span className="text-xl font-black text-emerald-700">{cdMetrics.totalCredits} TC</span>
              <span className="text-2xs text-slate-400 block mt-0.5">Chuẩn TC: 85 - 110 TC</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl">
              <span className="text-slate-500 block text-2xs uppercase">Tổng Số Giờ</span>
              <span className="text-xl font-black text-slate-800">{cdMetrics.totalHours}g</span>
              <span className="text-2xs text-slate-400 block mt-0.5">LT: {cdMetrics.totalTheoryHours}g | TH: {cdMetrics.totalPracticeHours}g</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl">
              <span className="text-slate-500 block text-2xs uppercase">Tỷ Lệ Thực Hành</span>
              <span className="text-xl font-black text-emerald-700">{cdMetrics.practicalRatio.toFixed(1)}%</span>
              <span className="text-2xs font-medium text-emerald-600 block mt-0.5">✓ Quy định GDNN ≥60%</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl">
              <span className="text-slate-500 block text-2xs uppercase">Số Lượng Mô-đun</span>
              <span className="text-xl font-black text-slate-800">{cdMetrics.totalModules} môn</span>
              <span className="text-2xs text-slate-400 block mt-0.5">Đã hoàn thành: {cdMetrics.statusBreakdown['Đã hoàn thành'] || 0}</span>
            </div>
          </div>

          <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100 text-xs space-y-1.5 text-emerald-900">
            <div className="font-bold text-emerald-900 flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600" /> Đặc điểm khung Cao đẳng:
            </div>
            <p className="text-2xs text-emerald-800">
              • Tích hợp khối kiến thức quản lý, tư duy thiết kế & giải quyết vấn đề phức tạp.<br />
              • Bổ sung các môn công nghệ mới (DevOps, Mobile App, AI, Cloud, Cybersecurity).<br />
              • Yêu cầu Đồ án tốt nghiệp Kỹ sư thực hành / Thực tập doanh nghiệp mở rộng.
            </p>
          </div>
        </div>

      </div>

      {/* Structural Comparison Matrix Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-5 space-y-4">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <GitCompare className="w-4 h-4 text-emerald-600" />
          Bảng Ma Trận So Sánh Chỉ Tiêu Khung Đào Tạo
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                <th className="p-3">Tieu chí kiểm định</th>
                <th className="p-3 text-blue-800">Hệ Trung Cấp</th>
                <th className="p-3 text-emerald-800">Hệ Cao Đẳng</th>
                <th className="p-3">Đánh giá chuẩn GDNN</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-800">
              <tr>
                <td className="p-3 font-semibold">Tổng Tín Chỉ</td>
                <td className="p-3 font-bold text-blue-700">{tcMetrics.totalCredits} TC</td>
                <td className="p-3 font-bold text-emerald-700">{cdMetrics.totalCredits} TC</td>
                <td className="p-3 text-slate-600">Cao đẳng mở rộng thêm {cdMetrics.totalCredits - tcMetrics.totalCredits} TC chuyên sâu</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold">Tổng Số Giờ</td>
                <td className="p-3 font-bold">{tcMetrics.totalHours} giờ</td>
                <td className="p-3 font-bold">{cdMetrics.totalHours} giờ</td>
                <td className="p-3 text-slate-600">Thời lượng học tập Cao đẳng gấp 1.5 lần Trung cấp</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold">Tỷ lệ Thực hành (TH)</td>
                <td className="p-3 font-bold text-emerald-700">{tcMetrics.practicalRatio.toFixed(1)}% (Chuẩn ≥50%)</td>
                <td className="p-3 font-bold text-emerald-700">{cdMetrics.practicalRatio.toFixed(1)}% (Chuẩn ≥60%)</td>
                <td className="p-3 text-slate-600 font-medium text-emerald-700">✓ Cả 2 hệ đều tuân thủ chuẩn GDNN</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold">Môn học Chung & Bắt buộc</td>
                <td className="p-3">Chính trị, Pháp luật, Thể chất, GDQP, Tin học, Tiếng Anh I</td>
                <td className="p-3">Chính trị nâng cao, Pháp luật đại cương, Tiếng Anh B1, Kỹ năng mềm</td>
                <td className="p-3 text-slate-600">Đáp ứng khối lượng môn chung theo Bộ LĐTBXH</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold">Thực tập & Đồ án Tốt nghiệp</td>
                <td className="p-3">Thực tập doanh nghiệp 8 tuần (5 TC) + Thi tốt nghiệp (3 TC)</td>
                <td className="p-3">Thực tập doanh nghiệp 12 tuần (8 TC) + Đồ án Capstone (6 TC)</td>
                <td className="p-3 text-slate-600">Cao đẳng đòi hỏi sản phẩm hoàn chỉnh và bảo vệ hội đồng</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
