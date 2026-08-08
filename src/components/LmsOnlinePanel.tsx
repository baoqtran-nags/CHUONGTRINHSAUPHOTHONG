import React, { useState } from 'react';
import { 
  Laptop, 
  Globe, 
  CheckCircle2, 
  Layers, 
  Sparkles, 
  Download, 
  BookOpen, 
  FileText, 
  Filter, 
  Search,
  Check,
  Video,
  HelpCircle,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { ProgramCurriculum, CurriculumModule } from '../types';
import { analyzeLmsFeasibility } from '../utils/lmsOnlineStandards';

interface LmsOnlinePanelProps {
  program: ProgramCurriculum;
  activeSheetName: string;
  onUpdateModules: (updatedModules: CurriculumModule[]) => void;
  onSwitchToAiTab?: () => void;
}

export const LmsOnlinePanel: React.FC<LmsOnlinePanelProps> = ({
  program,
  activeSheetName,
  onUpdateModules,
  onSwitchToAiTab
}) => {
  const [filterMode, setFilterMode] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [appliedNotification, setAppliedNotification] = useState<string | null>(null);
  const [copiedReport, setCopiedReport] = useState<boolean>(false);

  const activeSheet = program.sheets[activeSheetName] || {
    sheetName: activeSheetName,
    modules: [],
    rawColumns: []
  };

  const lmsResult = analyzeLmsFeasibility(activeSheet.modules);

  // Filter modules
  const filteredList = lmsResult.analyzedModules.filter(m => {
    const matchesSearch = m.moduleName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          m.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMode = filterMode === 'all' || m.deliveryMode === filterMode;
    return matchesSearch && matchesMode;
  });

  // Action: Apply LMS Notes & DeliveryMode to ALL modules in system
  const handleApplyAllLmsNotes = () => {
    const updated = activeSheet.modules.map(mod => {
      const analysis = lmsResult.analyzedModules.find(a => a.moduleId === mod.id);
      if (analysis) {
        // Clean up previous LMS tag if exists
        let cleanNotes = (mod.notes || '').replace(/\[LMS:.*?\]/g, '').trim();
        const newNotes = cleanNotes 
          ? `${cleanNotes} | ${analysis.suggestedNote}`
          : analysis.suggestedNote;

        return {
          ...mod,
          deliveryMode: analysis.deliveryMode,
          lmsFeasibilityScore: analysis.feasibilityScore,
          notes: newNotes
        };
      }
      return mod;
    });

    onUpdateModules(updated);
    setAppliedNotification(`Đã ghi chú và đánh dấu hình thức triển khai LMS thành công cho ${activeSheet.modules.length} môn học!`);
    setTimeout(() => setAppliedNotification(null), 4000);
  };

  // Action: Apply LMS Note to single module
  const handleApplySingleModuleNote = (moduleId: string) => {
    const updated = activeSheet.modules.map(mod => {
      if (mod.id === moduleId) {
        const analysis = lmsResult.analyzedModules.find(a => a.moduleId === mod.id);
        if (analysis) {
          let cleanNotes = (mod.notes || '').replace(/\[LMS:.*?\]/g, '').trim();
          const newNotes = cleanNotes 
            ? `${cleanNotes} | ${analysis.suggestedNote}`
            : analysis.suggestedNote;

          return {
            ...mod,
            deliveryMode: analysis.deliveryMode,
            lmsFeasibilityScore: analysis.feasibilityScore,
            notes: newNotes
          };
        }
      }
      return mod;
    });

    onUpdateModules(updated);
    setAppliedNotification(`Đã ghi chú LMS cho môn học!`);
    setTimeout(() => setAppliedNotification(null), 3000);
  };

  // Action: Copy LMS Implementation Plan
  const handleCopyLmsPlan = () => {
    let report = `=== KẾ HOẠCH TRIỂN KHAI ONLINE LEARNING TRÊN LMS ===\n`;
    report += `Tên chương trình: ${program.name}\n`;
    report += `Sheet dữ liệu: ${activeSheetName}\n`;
    report += `Tỷ lệ thời lượng đào tạo trên LMS: ${lmsResult.totalOnlineHoursPercentage}% tổng giờ chương trình\n`;
    report += `Phân bổ môn học: ${lmsResult.online100Count} môn Online 100% | ${lmsResult.blendedCount} môn Blended Learning | ${lmsResult.offlineCount} môn Trực tiếp tại Xưởng\n\n`;

    report += `--- DANH SÁCH CHI TIẾT MÔN HỌC & HÌNH THỨC TRIỂN KHAI LMS ---\n`;
    lmsResult.analyzedModules.forEach((m, idx) => {
      report += `${idx + 1}. [${m.code}] ${m.moduleName} (${m.credits} TC - ${m.totalHours}g)\n`;
      report += `   - Hình thức LMS: ${m.deliveryMode} (Độ phù hợp LMS: ${m.feasibilityScore}%)\n`;
      report += `   - Phân bổ giờ: ${m.onlineTheoryHours}g LMS E-learning / ${m.offlinePracticeHours}g Xưởng-Lab\n`;
      report += `   - Hoạt động LMS đề xuất: ${m.recommendedLmsActivities.join(', ')}\n`;
      report += `   - Ghi chú hệ thống: ${m.suggestedNote}\n\n`;
    });

    navigator.clipboard.writeText(report);
    setCopiedReport(true);
    setTimeout(() => setCopiedReport(false), 3000);
  };

  const getModeBadge = (mode: string) => {
    switch (mode) {
      case 'Online 100%':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300 font-bold';
      case 'Blended Learning':
        return 'bg-blue-100 text-blue-800 border-blue-300 font-bold';
      case 'Trực tiếp (Offline)':
      default:
        return 'bg-slate-100 text-slate-700 border-slate-300 font-medium';
    }
  };

  return (
    <div className="space-y-6">

      {/* Success Banner */}
      {appliedNotification && (
        <div className="p-3 bg-emerald-100 border border-emerald-300 text-emerald-950 rounded-lg text-xs font-semibold flex items-center justify-between shadow-xs animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
            <span>{appliedNotification}</span>
          </div>
          <button onClick={() => setAppliedNotification(null)} className="text-emerald-700 hover:text-emerald-900 font-bold">✕</button>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-[#101827] text-white rounded-xl p-5 border border-slate-800 shadow-md relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-bold uppercase tracking-wider rounded flex items-center gap-1">
                <Laptop className="w-3 h-3" /> E-Learning & LMS Standard 2026
              </span>
              <span className="px-2 py-0.5 bg-slate-800 text-slate-300 text-[10px] font-mono rounded">
                Moodle / Canvas / LMS Integration
              </span>
            </div>

            <h2 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
              <span>Đánh Giá & Đề Xuất Mô Hình Online Learning Trên LMS</span>
            </h2>

            <p className="text-xs text-slate-300 leading-relaxed">
              Tự động phân tích toàn bộ khung chương trình đào tạo để xác định các môn học có thể đưa lên hệ thống LMS (Online 100% hoặc Blended Learning), giúp chuyển đổi số bài giảng và tối ưu hóa thời lượng học tập.
            </p>
          </div>

          {/* Metric Summary Card */}
          <div className="bg-[#1E293B] p-4 rounded-xl border border-slate-700 flex items-center gap-4 min-w-[260px]">
            <div className="w-14 h-14 rounded-full bg-indigo-950 border-4 border-indigo-500 flex items-center justify-center font-black text-xl text-indigo-300">
              {lmsResult.totalOnlineHoursPercentage}%
            </div>

            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Tỷ Lệ Giờ Trên LMS</p>
              <p className="text-sm font-bold text-white mt-0.5">
                {lmsResult.online100Count + lmsResult.blendedCount} / {lmsResult.totalModules} Môn Học LMS
              </p>
              <p className="text-[10px] text-emerald-400 mt-0.5 font-medium">
                {lmsResult.online100Count} môn Online 100% • {lmsResult.blendedCount} môn Blended
              </p>
            </div>
          </div>

        </div>

        {/* Global Actions Toolbar */}
        <div className="mt-5 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={handleApplyAllLmsNotes}
              className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-md transition-colors inline-flex items-center gap-1.5 shadow-2xs"
            >
              <Zap className="w-3.5 h-3.5 text-amber-300" />
              <span>Ghi Chú & Tự Động Đánh Dấu LMS Vào Hệ Thống</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLmsPlan}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium rounded-md transition-colors inline-flex items-center gap-1.5 border border-slate-700"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{copiedReport ? 'Đã Sao Chép Kế Hoạch!' : 'Sao Chép Kế Hoạch Triển Khai LMS'}</span>
            </button>

            {onSwitchToAiTab && (
              <button
                onClick={onSwitchToAiTab}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-md transition-colors inline-flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Hỏi AI Xây Đề Cương LMS</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 3 Summary Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Card 1: 100% Online */}
        <div className="p-4 bg-emerald-50/80 border border-emerald-200 rounded-xl space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-emerald-700" /> Triển Khai Online 100%
            </span>
            <span className="px-2 py-0.5 bg-emerald-200 text-emerald-900 text-xs font-black rounded-full">
              {lmsResult.online100Count} môn
            </span>
          </div>
          <p className="text-xs text-emerald-800 leading-relaxed pt-1">
            Gồm các môn đại cương, lý thuyết thuần túy, ngoại ngữ, pháp luật, kỹ năng mềm. Học viên học 100% video/SCORM & làm trắc nghiệm trên LMS.
          </p>
        </div>

        {/* Card 2: Blended Learning */}
        <div className="p-4 bg-blue-50/80 border border-blue-200 rounded-xl space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-900 flex items-center gap-1.5">
              <Laptop className="w-4 h-4 text-blue-700" /> Blended Learning (LMS + Xưởng)
            </span>
            <span className="px-2 py-0.5 bg-blue-200 text-blue-900 text-xs font-black rounded-full">
              {lmsResult.blendedCount} môn
            </span>
          </div>
          <p className="text-xs text-blue-800 leading-relaxed pt-1">
            Học lý thuyết và trắc nghiệm trên LMS (50%), sau đó lên lớp thực hành Lab/Workshop trực tiếp (50%).
          </p>
        </div>

        {/* Card 3: Offline Preferred */}
        <div className="p-4 bg-slate-100 border border-slate-200 rounded-xl space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-slate-600" /> Trực Tiếp Tại Xưởng / Doanh Nghiệp
            </span>
            <span className="px-2 py-0.5 bg-slate-200 text-slate-800 text-xs font-black rounded-full">
              {lmsResult.offlineCount} môn
            </span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed pt-1">
            Thực tập tốt nghiệp hoặc mô-đun xưởng chuyên sâu. LMS hỗ trợ giao bài tập và nộp báo cáo tiến độ tuần.
          </p>
        </div>

      </div>

      {/* Main Table Container */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        
        {/* Table Filters Toolbar */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
          
          <div className="relative flex-1 min-w-[240px] max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm theo tên môn học hoặc mã môn..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 shadow-2xs"
            />
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500 font-medium">Lọc hình thức:</span>
            <button
              onClick={() => setFilterMode('all')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                filterMode === 'all'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
              }`}
            >
              Tất cả ({lmsResult.totalModules})
            </button>

            <button
              onClick={() => setFilterMode('Online 100%')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                filterMode === 'Online 100%'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
              }`}
            >
              Online 100% ({lmsResult.online100Count})
            </button>

            <button
              onClick={() => setFilterMode('Blended Learning')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                filterMode === 'Blended Learning'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
              }`}
            >
              Blended ({lmsResult.blendedCount})
            </button>

            <button
              onClick={() => setFilterMode('Trực tiếp (Offline)')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                filterMode === 'Trực tiếp (Offline)'
                  ? 'bg-slate-700 text-white'
                  : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
              }`}
            >
              Trực tiếp ({lmsResult.offlineCount})
            </button>
          </div>

        </div>

        {/* Modules Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100/90 border-b border-slate-200 text-slate-700 font-semibold uppercase tracking-wider">
                <th className="py-3 px-3 w-12 text-center">STT</th>
                <th className="py-3 px-3 w-28 font-mono">Mã Môn</th>
                <th className="py-3 px-3 min-w-[200px]">Tên Môn Học / Mô-đun</th>
                <th className="py-3 px-2 text-center w-20">Số Giờ</th>
                <th className="py-3 px-3 text-center">Đề Xuất Mô Hình LMS</th>
                <th className="py-3 px-3 text-center">Phân Bổ LMS / Xưởng</th>
                <th className="py-3 px-3 min-w-[220px]">Hoạt Động LMS Khuyên Dùng</th>
                <th className="py-3 px-3 text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-800">
              {filteredList.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-slate-500">
                    Không tìm thấy môn học nào phù hợp với điều kiện tìm kiếm.
                  </td>
                </tr>
              ) : (
                filteredList.map((m, idx) => (
                  <tr key={m.moduleId} className="hover:bg-slate-50/80 transition-colors">
                    
                    <td className="py-3 px-3 text-center font-mono text-slate-400">
                      {idx + 1}
                    </td>

                    <td className="py-3 px-3 font-mono font-bold text-slate-900">
                      {m.code}
                    </td>

                    <td className="py-3 px-3">
                      <p className="font-semibold text-slate-900">{m.moduleName}</p>
                      <p className="text-[10px] text-slate-500 italic mt-0.5">{m.reasons}</p>
                    </td>

                    <td className="py-3 px-2 text-center font-mono font-semibold">
                      {m.totalHours}g
                    </td>

                    <td className="py-3 px-3 text-center">
                      <span className={`inline-block px-2.5 py-1 text-2xs rounded-full border ${getModeBadge(m.deliveryMode)}`}>
                        {m.deliveryMode}
                      </span>
                    </td>

                    <td className="py-3 px-3 text-center font-mono text-2xs">
                      <div className="flex items-center justify-center gap-1">
                        <span className="px-1.5 py-0.5 bg-indigo-50 text-indigo-700 font-bold rounded">
                          LMS: {m.onlineTheoryHours}g
                        </span>
                        <span className="text-slate-300">/</span>
                        <span className="px-1.5 py-0.5 bg-slate-100 text-slate-700 font-medium rounded">
                          Xưởng: {m.offlinePracticeHours}g
                        </span>
                      </div>
                    </td>

                    <td className="py-3 px-3">
                      <div className="flex flex-wrap gap-1">
                        {m.recommendedLmsActivities.map((act, i) => (
                          <span key={i} className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[10px] font-medium rounded border border-slate-200">
                            • {act}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => handleApplySingleModuleNote(m.moduleId)}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 font-semibold rounded border border-slate-200 text-[11px] transition-colors"
                        title="Ghi chú hình thức LMS này vào thông tin môn học trên hệ thống"
                      >
                        + Ghi Chú LMS
                      </button>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Summary Bar */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 text-xs text-slate-600 flex items-center justify-between">
          <span>Hiển thị <strong>{filteredList.length}</strong> / {lmsResult.totalModules} môn học trong khung</span>
          <span className="font-semibold text-indigo-700">Tối ưu hóa bài giảng số trên LMS Moodle / Canvas</span>
        </div>

      </div>

    </div>
  );
};
