import React, { useState } from 'react';
import { X, FileCheck, Copy, Download, Check, AlertTriangle, ShieldCheck, ShieldAlert, Sparkles } from 'lucide-react';
import { ProgramCurriculum, CurriculumMetrics, SheetData } from '../types';
import { calculateMetrics } from '../utils/curriculumAnalyzer';

interface AuditReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  program: ProgramCurriculum;
}

export const AuditReportModal: React.FC<AuditReportModalProps> = ({
  isOpen,
  onClose,
  program
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Calculate metrics for each sheet
  const sheetMetrics = Object.entries(program.sheets).map(([sheetName, sheetData]) => {
    const data = sheetData as SheetData;
    return {
      sheetName,
      metrics: calculateMetrics(data.modules, program.level),
      recordsCount: data.modules.length
    };
  });

  // Calculate overall program metrics
  const allModules = (Object.values(program.sheets) as SheetData[]).flatMap(s => s.modules);
  const overallMetrics = calculateMetrics(allModules, program.level);

  // Generate plain text report mirroring Python script terminal output
  const generateTextReport = () => {
    let text = `==========================================\n`;
    text += ` REPORT SUMMARY: ${program.name.toUpperCase()}\n`;
    text += ` Level: ${program.level === 'cao_dang' ? 'CAO ĐẲNG' : 'TRUNG CẤP'}\n`;
    text += ` Date Generated: ${new Date().toLocaleDateString('vi-VN')}\n`;
    text += `==========================================\n\n`;

    sheetMetrics.forEach(({ sheetName, metrics, recordsCount }) => {
      text += `Sheet: [${sheetName}] - ${recordsCount} total records\n`;
      text += `  • Total Credits: ${metrics.totalCredits.toFixed(1)}\n`;
      text += `  • Total Hours: ${metrics.totalHours.toFixed(1)}\n`;
      text += `  • Theory Hours: ${metrics.totalTheoryHours.toFixed(1)}\n`;
      text += `  • Practice Hours: ${metrics.totalPracticeHours.toFixed(1)}\n`;
      text += `  • Practical Ratio: ${metrics.practicalRatio.toFixed(1)}%\n`;
      text += `  • Status Breakdown:\n`;
      Object.entries(metrics.statusBreakdown).forEach(([status, val]) => {
        if (val > 0) {
          text += `    - ${status}: ${val}\n`;
        }
      });
      text += `\n`;
    });

    text += `==========================================\n`;
    text += ` AUDIT & COMPLIANCE SUMMARY\n`;
    text += `==========================================\n`;
    text += `  • Practical Ratio Compliance: ${overallMetrics.isCompliant ? 'PASSED (ĐẠT CHUẨN GDNN)' : 'WARNING (CHƯA ĐẠT CHUẨN GDNN)'}\n`;
    text += `  • Total Issues Detected: ${overallMetrics.auditIssues.length}\n`;
    overallMetrics.auditIssues.forEach((issue, idx) => {
      text += `  [${idx + 1}] ${issue.type.toUpperCase()}: ${issue.message}\n`;
      text += `      Gợi ý: ${issue.suggestion}\n`;
    });

    return text;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateTextReport());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const text = generateTextReport();
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Report_Audit_${program.name.replace(/\s+/g, '_')}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-3xl w-full overflow-hidden my-8">
        
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-bold">Báo Cáo Kiểm Định Khung Chương Trình Đào Tạo</h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto text-xs">
          
          {/* Compliance Status Banner */}
          <div className={`p-4 rounded-xl border flex items-start gap-3 ${
            overallMetrics.isCompliant ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-amber-50 border-amber-200 text-amber-900'
          }`}>
            {overallMetrics.isCompliant ? (
              <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <ShieldAlert className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
            )}
            <div>
              <h4 className="font-bold text-sm">
                {overallMetrics.isCompliant 
                  ? 'Đạt Chuẩn Quy Định Giáo Dục Nghề Nghiệp (GDNN)' 
                  : 'Cần Điều Chỉnh Cấu Trúc Khung Chương Trình'}
              </h4>
              <p className="mt-1 text-xs opacity-90">
                Tỷ lệ giờ thực hành/bài tập lớn toàn chương trình đạt{' '}
                <strong className="font-bold">{overallMetrics.practicalRatio.toFixed(1)}%</strong>{' '}
                (Ngưỡng quy định tối thiểu đối với hệ {program.level === 'cao_dang' ? 'Cao đẳng là ≥60%' : 'Trung cấp là ≥50%'}).
              </p>
            </div>
          </div>

          {/* Sheet Statistics Cards */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 uppercase text-2xs tracking-wider">Thống Kê Chi Tiết Theo Danh Mục Sheet</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {sheetMetrics.map(({ sheetName, metrics, recordsCount }) => (
                <div key={sheetName} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between font-bold text-slate-900">
                    <span>Sheet: [{sheetName}]</span>
                    <span className="text-2xs px-2 py-0.5 bg-slate-200 text-slate-700 rounded-full">{recordsCount} môn</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-2xs text-slate-600">
                    <div>Tổng Tín Chỉ: <strong className="text-blue-700">{metrics.totalCredits} TC</strong></div>
                    <div>Tổng Thời Lượng: <strong className="text-slate-900">{metrics.totalHours} giờ</strong></div>
                    <div>Lý Thuyết: <strong>{metrics.totalTheoryHours}g</strong></div>
                    <div>Thực Hành: <strong className="text-emerald-700">{metrics.totalPracticeHours}g ({metrics.practicalRatio.toFixed(1)}%)</strong></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Audit Issues Checklist */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 uppercase text-2xs tracking-wider flex items-center justify-between">
              <span>Danh Sách Cảnh Báo Phát Hiện ({overallMetrics.auditIssues.length})</span>
            </h4>

            {overallMetrics.auditIssues.length === 0 ? (
              <div className="p-4 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200 font-medium text-center">
                ✓ Khung chương trình hoàn toàn hợp lệ, không phát hiện lỗi logic giờ hoặc tín chỉ.
              </div>
            ) : (
              <div className="space-y-2">
                {overallMetrics.auditIssues.map((issue) => (
                  <div 
                    key={issue.id} 
                    className={`p-3 rounded-xl border space-y-1 text-2xs ${
                      issue.type === 'error'
                        ? 'bg-red-50/70 border-red-200 text-red-900'
                        : issue.type === 'warning'
                        ? 'bg-amber-50/70 border-amber-200 text-amber-900'
                        : 'bg-blue-50/70 border-blue-200 text-blue-900'
                    }`}
                  >
                    <div className="font-bold flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                      <span>{issue.moduleName ? `[${issue.moduleName}]` : ''} {issue.message}</span>
                    </div>
                    <p className="text-2xs opacity-85 pl-5">
                      💡 <strong>Gợi ý khắc phục:</strong> {issue.suggestion}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Terminal Style Report Preview */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 uppercase text-2xs tracking-wider">Báo Cáo Văn Bản Python Terminal Format</h4>
            <pre className="p-3 bg-slate-900 text-emerald-400 font-mono text-2xs rounded-xl overflow-x-auto max-h-40 whitespace-pre-wrap">
              {generateTextReport()}
            </pre>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-2xs text-slate-500 font-medium">Định dạng chuẩn theo Thông tư GDNN</span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-100 font-medium inline-flex items-center gap-1 text-xs"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Đã Copy!' : 'Copy Báo Cáo'}</span>
            </button>
            <button
              onClick={handleDownload}
              className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-bold inline-flex items-center gap-1 text-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Tải File .TXT</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
