import React, { useState } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Sparkles, 
  PlusCircle, 
  CheckCircle2, 
  AlertTriangle, 
  Layers, 
  BookOpen, 
  Building2, 
  Cpu, 
  Leaf, 
  Globe, 
  BarChart2, 
  ArrowRight,
  Download,
  RotateCcw,
  Bot
} from 'lucide-react';
import { ProgramCurriculum, CurriculumModule, SheetData } from '../types';
import { analyze2026Standards } from '../utils/moet2026Standards';

interface Moet2026AuditPanelProps {
  program: ProgramCurriculum;
  activeSheetName: string;
  onAddModules: (newModules: CurriculumModule[]) => void;
  onUpdateModules: (updatedModules: CurriculumModule[]) => void;
  onSwitchToAiTab?: () => void;
}

export const Moet2026AuditPanel: React.FC<Moet2026AuditPanelProps> = ({
  program,
  activeSheetName,
  onAddModules,
  onUpdateModules,
  onSwitchToAiTab
}) => {
  const [copied, setCopied] = useState(false);
  const [addedSuccess, setAddedSuccess] = useState<string | null>(null);

  const activeSheet = program.sheets[activeSheetName] || {
    sheetName: activeSheetName,
    modules: [],
    rawColumns: []
  };

  const auditResult = analyze2026Standards(activeSheet.modules, program.level);

  // Quick Action 1: Add all recommended 2026 modules
  const handleAddAllSuggestedModules = () => {
    if (auditResult.suggested2026Modules.length === 0) return;
    onAddModules(auditResult.suggested2026Modules);
    setAddedSuccess(`Đã tự động thêm ${auditResult.suggested2026Modules.length} mô-đun chuẩn 2026 vào danh sách môn học!`);
    setTimeout(() => setAddedSuccess(null), 4000);
  };

  // Quick Action 2: Auto-balance hours for recommended modules
  const handleApplyHourAdjustments = () => {
    if (auditResult.suggestedHourAdjustments.length === 0) return;

    const updated = activeSheet.modules.map(mod => {
      const adj = auditResult.suggestedHourAdjustments.find(a => a.moduleId === mod.id);
      if (adj) {
        return {
          ...mod,
          theoryHours: adj.recommendedTheory,
          practiceHours: adj.recommendedPractice,
          notes: (mod.notes ? mod.notes + ' | ' : '') + 'Đã điều chỉnh theo Chuẩn 2026 (TH ≥ 60%)'
        };
      }
      return mod;
    });

    onUpdateModules(updated);
    setAddedSuccess(`Đã tự động điều chỉnh tỷ lệ giờ LT/TH cho ${auditResult.suggestedHourAdjustments.length} mô-đun!`);
    setTimeout(() => setAddedSuccess(null), 4000);
  };

  // Copy report summary text
  const handleCopyReportText = () => {
    let reportText = `=== BÁO CÁO ĐỐI SOÁT CHUẨN MỚI BỘ GD&ĐT & SỞ GD&ĐT TP.HCM (TỪ NĂM 2026) ===\n`;
    reportText += `Tên chương trình: ${program.name} (${program.level === 'cao_dang' ? 'Hệ Cao Đẳng' : 'Hệ Trung Cấp'})\n`;
    reportText += `Sheet phân tích: ${activeSheetName}\n`;
    reportText += `Đánh giá tổng thể: ${auditResult.overallScore}/100 - ${auditResult.ratingText}\n\n`;
    reportText += `--- CHI TIẾT CÁC HẠNG MỤC ĐỐI SOÁT ---\n`;

    auditResult.rules.forEach((r, idx) => {
      reportText += `${idx + 1}. [${r.standardAuthority}] ${r.title}\n`;
      reportText += `   - Trạng thái: ${r.status === 'passed' ? 'ĐẠT' : r.status === 'warning' ? 'CẦN ĐIỀU CHỈNH' : 'CHƯA ĐẠT'}\n`;
      reportText += `   - Thực trạng: ${r.currentFinding}\n`;
      reportText += `   - Yêu cầu điều chỉnh: ${r.requiredAdjustment}\n\n`;
    });

    if (auditResult.suggested2026Modules.length > 0) {
      reportText += `--- ĐỀ XUẤT MÔ-ĐUN BỔ SUNG CHUẨN 2026 ---\n`;
      auditResult.suggested2026Modules.forEach(m => {
        reportText += `+ Môn: ${m.name} (${m.credits} TC - ${m.totalHours}g: ${m.theoryHours}g LT / ${m.practiceHours}g TH)\n`;
      });
    }

    navigator.clipboard.writeText(reportText);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'digital_ai': return <Cpu className="w-5 h-5 text-blue-600" />;
      case 'green_skills': return <Leaf className="w-5 h-5 text-emerald-600" />;
      case 'hcmc_enterprise': return <Building2 className="w-5 h-5 text-purple-600" />;
      case 'foreign_language': return <Globe className="w-5 h-5 text-amber-600" />;
      case 'vnf_structure': return <BarChart2 className="w-5 h-5 text-indigo-600" />;
      default: return <BookOpen className="w-5 h-5 text-slate-600" />;
    }
  };

  return (
    <div className="space-y-6">

      {/* Notification banner */}
      {addedSuccess && (
        <div className="p-3 bg-emerald-100 border border-emerald-300 text-emerald-900 rounded-lg text-xs font-semibold flex items-center justify-between shadow-xs animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
            <span>{addedSuccess}</span>
          </div>
          <button onClick={() => setAddedSuccess(null)} className="text-emerald-700 hover:text-emerald-900 font-bold">✕</button>
        </div>
      )}

      {/* Top Banner & Overall Score Card */}
      <div className="bg-[#1C1F26] text-white rounded-xl p-5 border border-slate-800 shadow-md relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 bg-blue-500/20 text-blue-400 border border-blue-500/30 text-[10px] font-bold uppercase tracking-wider rounded">
                Chuẩn Mới 2026 - Bộ GD&ĐT & Sở TP.HCM
              </span>
              <span className="px-2 py-0.5 bg-slate-800 text-slate-300 text-[10px] font-mono rounded">
                Chỉ thị Chuyển đổi Số & Đào tạo Xanh
              </span>
            </div>
            
            <h2 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
              <span>Kiểm Tra & Điều Chỉnh Theo Chuẩn GDNN Mới 2026</span>
            </h2>

            <p className="text-xs text-slate-300 leading-relaxed">
              Hệ thống tự động đối soát cấu trúc chương trình đào tạo của trường với các quy định mới ban hành áp dụng từ năm 2026:
              Tích hợp Năng lực AI, Kỹ năng Xanh & ESG, Liên kết Doanh nghiệp TP.HCM, và Khung trình độ Quốc gia VNF.
            </p>
          </div>

          {/* Score Badge */}
          <div className="bg-[#16191E] p-4 rounded-xl border border-slate-700 flex items-center gap-4 min-w-[240px]">
            <div className={`w-14 h-14 rounded-full flex items-center justify-center font-black text-xl border-4 ${
              auditResult.overallScore >= 90
                ? 'border-emerald-500 text-emerald-400 bg-emerald-950/40'
                : auditResult.overallScore >= 75
                ? 'border-blue-500 text-blue-400 bg-blue-950/40'
                : auditResult.overallScore >= 50
                ? 'border-amber-500 text-amber-400 bg-amber-950/40'
                : 'border-red-500 text-red-400 bg-red-950/40'
            }`}>
              {auditResult.overallScore}%
            </div>
            
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Chỉ Số Tuân Thủ 2026</p>
              <p className={`text-sm font-bold mt-0.5 ${
                auditResult.overallScore >= 75 ? 'text-emerald-400' : 'text-amber-400'
              }`}>
                {auditResult.ratingText}
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">
                {auditResult.rules.filter(r => r.status === 'passed').length} / {auditResult.rules.length} Tiêu chí Đạt
              </p>
            </div>
          </div>

        </div>

        {/* Quick Action Toolbar */}
        <div className="mt-5 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 text-[11px]">Thao tác nhanh chuẩn 2026:</span>
            
            {auditResult.suggested2026Modules.length > 0 && (
              <button
                onClick={handleAddAllSuggestedModules}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-md transition-colors inline-flex items-center gap-1.5 shadow-2xs"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Thêm {auditResult.suggested2026Modules.length} Mô-đun Chuẩn 2026</span>
              </button>
            )}

            {auditResult.suggestedHourAdjustments.length > 0 && (
              <button
                onClick={handleApplyHourAdjustments}
                className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white font-semibold rounded-md transition-colors inline-flex items-center gap-1.5 shadow-2xs"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Cân Bằng Tỷ Lệ Giờ LT/TH ({auditResult.suggestedHourAdjustments.length} môn)</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyReportText}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium rounded-md transition-colors inline-flex items-center gap-1.5 border border-slate-700"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{copied ? 'Đã sao chép!' : 'Sao chép Báo cáo Đối soát'}</span>
            </button>

            {onSwitchToAiTab && (
              <button
                onClick={onSwitchToAiTab}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-md transition-colors inline-flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Hỏi AI Gemini về Chuẩn 2026</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Grid of 5 Category Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {auditResult.rules.map(rule => (
          <div 
            key={rule.id}
            className={`p-3.5 rounded-xl border bg-white shadow-2xs flex flex-col justify-between ${
              rule.status === 'passed'
                ? 'border-emerald-200 hover:border-emerald-300'
                : rule.status === 'warning'
                ? 'border-amber-200 hover:border-amber-300'
                : 'border-red-200 hover:border-red-300'
            }`}
          >
            <div>
              <div className="flex items-center justify-between">
                <div className="p-1.5 rounded-lg bg-slate-100">
                  {getCategoryIcon(rule.category)}
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                  rule.status === 'passed'
                    ? 'bg-emerald-100 text-emerald-800'
                    : rule.status === 'warning'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {rule.status === 'passed' ? 'ĐẠT' : rule.status === 'warning' ? 'CẦN ĐIỀU CHỈNH' : 'CHƯA ĐẠT'}
                </span>
              </div>

              <h4 className="text-xs font-bold text-slate-900 mt-2.5 leading-snug">
                {rule.categoryName}
              </h4>

              <p className="text-[10px] text-slate-500 font-medium mt-1">
                {rule.standardAuthority}
              </p>
            </div>

            <div className="mt-3 pt-2 border-t border-slate-100 text-[11px]">
              <span className="font-bold text-slate-800">Điểm: </span>
              <span className={rule.earnedScore === rule.scoreImpact ? 'text-emerald-700 font-bold' : 'text-amber-700 font-bold'}>
                {rule.earnedScore} / {rule.scoreImpact} đ
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Breakdown: Detailed Rules & Adjustments Needed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left Column: Detailed 5 Rule Analysis (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  <span>Chi Tiết Đánh Giá Đối Soát Theo Tiêu Chí 2026</span>
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Phân tích thực trạng môn học hiện có và giải pháp đáp ứng quy định mới
                </p>
              </div>

              <span className="px-2.5 py-1 bg-slate-100 text-slate-700 text-xs font-semibold rounded-md border border-slate-200">
                Sheet: {activeSheetName}
              </span>
            </div>

            <div className="divide-y divide-slate-100">
              {auditResult.rules.map((rule, idx) => (
                <div key={rule.id} className="p-4 hover:bg-slate-50/50 transition-colors">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>

                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-sm font-bold text-slate-900">{rule.title}</h4>
                          <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-semibold rounded border border-slate-200">
                            {rule.standardAuthority}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">{rule.description}</p>
                      </div>
                    </div>

                    <span className={`px-2.5 py-1 rounded text-xs font-bold uppercase shrink-0 ${
                      rule.status === 'passed'
                        ? 'bg-emerald-100 text-emerald-800'
                        : rule.status === 'warning'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {rule.status === 'passed' ? 'Đạt Chuẩn' : rule.status === 'warning' ? 'Khuyên Điều Chỉnh' : 'Bắt Buộc Bổ Sung'}
                    </span>
                  </div>

                  {/* Finding vs Adjustment Box */}
                  <div className="mt-3 ml-9 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                        <span>🔍 Thực trạng hiện tại:</span>
                      </p>
                      <p className="text-slate-800 font-medium mt-1 leading-relaxed">
                        {rule.currentFinding}
                      </p>
                      {rule.targetModules && rule.targetModules.length > 0 && (
                        <p className="text-[11px] text-blue-700 font-medium mt-1.5">
                          Môn liên quan: {rule.targetModules.join(', ')}
                        </p>
                      )}
                    </div>

                    <div className={`p-3 rounded-lg border ${
                      rule.status === 'passed'
                        ? 'bg-emerald-50/60 border-emerald-200 text-emerald-950'
                        : rule.status === 'warning'
                        ? 'bg-amber-50/70 border-amber-200 text-amber-950'
                        : 'bg-red-50/70 border-red-200 text-red-950'
                    }`}>
                      <p className="text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                        <span>🛠️ Nội dung cần điều chỉnh (Chuẩn 2026):</span>
                      </p>
                      <p className="font-semibold mt-1 leading-relaxed">
                        {rule.requiredAdjustment}
                      </p>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Auto-Suggested Action Recommendations (1 col) */}
        <div className="space-y-4">
          
          {/* Card 1: Suggested New 2026 Modules */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5 uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span>Mô-đun Khuyến Nghị Bổ Sung (2026)</span>
              </h3>
              <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                {auditResult.suggested2026Modules.length} môn
              </span>
            </div>

            {auditResult.suggested2026Modules.length === 0 ? (
              <p className="text-xs text-slate-500 py-4 text-center">
                🎉 Chương trình đã đầy đủ các mô-đun cốt lõi theo Chuẩn 2026!
              </p>
            ) : (
              <div className="mt-3 space-y-3">
                {auditResult.suggested2026Modules.map(mod => (
                  <div key={mod.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1.5">
                    <div className="flex items-center justify-between font-bold text-slate-900">
                      <span>{mod.name}</span>
                      <span className="px-1.5 py-0.5 bg-blue-100 text-blue-800 text-[10px] font-bold rounded">
                        {mod.credits} TC
                      </span>
                    </div>

                    <div className="text-slate-600 text-[11px] flex items-center justify-between">
                      <span>Thời lượng: {mod.totalHours}g ({mod.theoryHours}g LT / {mod.practiceHours}g TH)</span>
                      <span className="text-slate-500">HK {mod.semester}</span>
                    </div>

                    <p className="text-[10px] text-slate-500 italic">
                      {mod.notes}
                    </p>

                    <button
                      onClick={() => {
                        onAddModules([mod]);
                        setAddedSuccess(`Đã thêm môn "${mod.name}" vào chương trình!`);
                        setTimeout(() => setAddedSuccess(null), 3000);
                      }}
                      className="w-full mt-1 py-1 px-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded text-[11px] transition-colors flex items-center justify-center gap-1"
                    >
                      <PlusCircle className="w-3 h-3" />
                      <span>Thêm môn này vào Checklist</span>
                    </button>
                  </div>
                ))}

                <button
                  onClick={handleAddAllSuggestedModules}
                  className="w-full py-2 bg-[#1C1F26] hover:bg-slate-800 text-white font-bold rounded-lg text-xs transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
                >
                  <PlusCircle className="w-3.5 h-3.5 text-blue-400" />
                  <span>Thêm Tất Cả {auditResult.suggested2026Modules.length} Môn Vào Khung</span>
                </button>
              </div>
            )}
          </div>

          {/* Card 2: Recommended Theory/Practice Hour Adjustments */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5 uppercase tracking-wider">
                <RotateCcw className="w-4 h-4 text-amber-600" />
                <span>Môn Cần Điều Chỉnh Tỷ Lệ Giờ</span>
              </h3>
              <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                {auditResult.suggestedHourAdjustments.length} môn
              </span>
            </div>

            {auditResult.suggestedHourAdjustments.length === 0 ? (
              <p className="text-xs text-slate-500 py-4 text-center">
                ✨ Tỷ lệ giờ Lý thuyết / Thực hành của các môn học hiện tại đã đạt chuẩn.
              </p>
            ) : (
              <div className="mt-3 space-y-3">
                {auditResult.suggestedHourAdjustments.map((adj, i) => (
                  <div key={i} className="p-3 bg-amber-50/60 rounded-lg border border-amber-200 text-xs space-y-1">
                    <p className="font-bold text-slate-900">{adj.moduleName}</p>

                    <div className="flex items-center justify-between text-[11px] text-slate-700 pt-1">
                      <span className="line-through text-slate-400">Hiện tại: {adj.currentTheory}g LT / {adj.currentPractice}g TH</span>
                      <ArrowRight className="w-3 h-3 text-amber-600" />
                      <span className="font-bold text-emerald-800">Mới: {adj.recommendedTheory}g LT / {adj.recommendedPractice}g TH</span>
                    </div>

                    <p className="text-[10px] text-amber-900 mt-1">
                      💡 {adj.reason}
                    </p>
                  </div>
                ))}

                <button
                  onClick={handleApplyHourAdjustments}
                  className="w-full py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg text-xs transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Áp Dụng Tự Động Điều Chỉnh Tỷ Lệ Giờ</span>
                </button>
              </div>
            )}
          </div>

          {/* Card 3: Direct Link to AI Advisor */}
          <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white rounded-xl p-4 border border-indigo-700 shadow-sm space-y-2">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-amber-300" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300">Tư Vấn Chuyên Sâu Gemini 2026</h4>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed">
              Nhận phản biện chi tiết và gợi ý soạn thảo đề cương môn học đáp ứng yêu cầu Kiểm định Chất lượng GDNN năm 2026.
            </p>
            {onSwitchToAiTab && (
              <button
                onClick={onSwitchToAiTab}
                className="w-full mt-2 py-1.5 bg-white text-slate-900 hover:bg-indigo-50 font-bold rounded-md text-xs transition-colors flex items-center justify-center gap-1"
              >
                <span>Chuyển sang Tab AI Review</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};
