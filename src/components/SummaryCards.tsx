import React from 'react';
import { 
  Award, 
  Clock, 
  PieChart, 
  CheckCircle2, 
  AlertTriangle, 
  BookOpen, 
  UserCheck, 
  ShieldCheck, 
  ShieldAlert
} from 'lucide-react';
import { CurriculumMetrics, ProgramLevel } from '../types';

interface SummaryCardsProps {
  metrics: CurriculumMetrics;
  level: ProgramLevel;
  onOpenAuditModal: () => void;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({
  metrics,
  level,
  onOpenAuditModal
}) => {
  const targetRatio = level === 'cao_dang' ? 60 : 50;
  const completedCount = metrics.statusBreakdown['Đã hoàn thành'] || 0;
  const progressPercent = metrics.totalModules > 0 ? Math.round((completedCount / metrics.totalModules) * 100) : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
      
      {/* 1. Total Credits & Modules */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs relative overflow-hidden flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Tổng Tín Chỉ & Môn</span>
            <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-1.5 flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-slate-900 tracking-tight">{metrics.totalCredits}</span>
            <span className="text-[11px] font-bold text-slate-500">tín chỉ</span>
          </div>
        </div>
        <div className="mt-2.5 pt-2 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
          <span>Tổng số mô-đun:</span>
          <span className="font-bold text-slate-800">{metrics.totalModules} môn</span>
        </div>
      </div>

      {/* 2. Total Hours & Split */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs relative overflow-hidden flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Tổng Số Giờ Đào Tạo</span>
            <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-1.5 flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-slate-900 tracking-tight">{metrics.totalHours.toLocaleString()}</span>
            <span className="text-[11px] font-bold text-slate-500">giờ</span>
          </div>
        </div>
        <div className="mt-2.5 pt-2 border-t border-slate-100 text-[11px] text-slate-600 flex items-center justify-between">
          <span>Phân bổ LT / TH:</span>
          <span className="font-bold text-slate-800">{metrics.totalTheoryHours}h LT / {metrics.totalPracticeHours}h TH</span>
        </div>
      </div>

      {/* 3. Practical Ratio & GDNN Compliance */}
      <div className={`p-3.5 rounded-xl border shadow-2xs relative overflow-hidden flex flex-col justify-between ${
        metrics.isCompliant ? 'bg-emerald-50/70 border-emerald-200' : 'bg-amber-50/70 border-amber-200'
      }`}>
        <div>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Tỷ Lệ Thực Hành</span>
            <div className={`p-1.5 rounded-lg ${metrics.isCompliant ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
              <PieChart className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-1.5 flex items-baseline gap-1.5">
            <span className={`text-2xl font-black tracking-tight ${metrics.isCompliant ? 'text-emerald-900' : 'text-amber-900'}`}>
              {metrics.practicalRatio.toFixed(1)}%
            </span>
            <span className="text-[10px] font-semibold text-slate-600">TH/Tổng giờ</span>
          </div>
        </div>
        <div className="mt-2.5 pt-2 border-t border-emerald-200/50 flex items-center justify-between text-[11px]">
          {metrics.isCompliant ? (
            <span className="inline-flex items-center gap-1 font-bold text-emerald-800">
              <ShieldCheck className="w-3.5 h-3.5" /> Đạt (≥{targetRatio}%)
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 font-bold text-amber-800">
              <ShieldAlert className="w-3.5 h-3.5" /> Chưa đạt (&lt;{targetRatio}%)
            </span>
          )}
        </div>
      </div>

      {/* 4. Drafting Completion Progress */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs relative overflow-hidden flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Tiến Độ Biên Soạn</span>
            <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-1.5 flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-slate-900 tracking-tight">{progressPercent}%</span>
            <span className="text-[11px] font-bold text-slate-500">hoàn thành</span>
          </div>
        </div>
        <div className="mt-2.5 pt-2 border-t border-slate-100 text-[11px] text-slate-600 flex items-center justify-between">
          <span>Hoàn thành:</span>
          <span className="font-bold text-slate-800">{completedCount} / {metrics.totalModules} môn</span>
        </div>
      </div>

      {/* 5. Audit Issues Alert Card */}
      <div 
        onClick={onOpenAuditModal}
        className={`p-3.5 rounded-xl border shadow-2xs cursor-pointer transition-all hover:border-slate-400 flex flex-col justify-between ${
          metrics.auditIssues.length === 0
            ? 'bg-emerald-50/40 border-emerald-200'
            : metrics.auditIssues.some(i => i.type === 'error')
            ? 'bg-red-50/60 border-red-200 hover:bg-red-100/80'
            : 'bg-amber-50/60 border-amber-200 hover:bg-amber-100/80'
        }`}
      >
        <div>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Cảnh Báo Kiểm Định</span>
            <div className={`p-1.5 rounded-lg ${
              metrics.auditIssues.length === 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
            }`}>
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-1.5 flex items-baseline gap-1.5">
            <span className={`text-2xl font-black tracking-tight ${
              metrics.auditIssues.length === 0 ? 'text-emerald-800' : 'text-red-900'
            }`}>
              {metrics.auditIssues.length}
            </span>
            <span className="text-[11px] font-bold text-slate-600">vấn đề cần chú ý</span>
          </div>
        </div>
        <div className="mt-2.5 pt-2 border-t border-slate-200/50 text-[11px] font-semibold text-blue-700 flex items-center justify-between">
          <span>Xem chi tiết báo cáo</span>
          <span>→</span>
        </div>
      </div>

    </div>
  );
};
