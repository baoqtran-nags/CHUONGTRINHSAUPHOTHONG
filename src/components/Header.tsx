import React, { useRef } from 'react';
import { 
  FileSpreadsheet, 
  Upload, 
  Download, 
  Sparkles, 
  FileCheck, 
  GitCompare, 
  Layers, 
  BookOpen, 
  Award,
  RefreshCw,
  ShieldCheck,
  Laptop,
  GraduationCap
} from 'lucide-react';
import { ProgramCurriculum } from '../types';

interface HeaderProps {
  currentProgram: ProgramCurriculum;
  onSelectSample: (type: 'trung_cap' | 'cao_dang') => void;
  onFileUpload: (file: File) => void;
  onExportExcel: () => void;
  activeSheet: string;
  onSheetChange: (sheetName: string) => void;
  activeTab: 'checklist' | 'majors_list' | 'moet_2026' | 'lms_online' | 'analytics' | 'comparison' | 'ai_advisor';
  onTabChange: (tab: 'checklist' | 'majors_list' | 'moet_2026' | 'lms_online' | 'analytics' | 'comparison' | 'ai_advisor') => void;
  onOpenAuditModal: () => void;
  onReset: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentProgram,
  onSelectSample,
  onFileUpload,
  onExportExcel,
  activeSheet,
  onSheetChange,
  activeTab,
  onTabChange,
  onOpenAuditModal,
  onReset
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileUpload(e.target.files[0]);
    }
  };

  const sheets = Object.keys(currentProgram.sheets);

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-2xs">
      {/* Top Banner Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-wrap items-center justify-between gap-3">
        
        {/* Brand & Program Info */}
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-[#1C1F26] text-blue-400 rounded-lg shadow-xs flex items-center justify-center">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-slate-900 tracking-tight leading-tight">
                CURRICULUM <span className="text-blue-600">AI</span> <span className="text-xs font-semibold text-slate-500 font-normal">| Academic Analysis Engine</span>
              </h1>
              <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded ${
                currentProgram.level === 'trung_cap' 
                  ? 'bg-blue-100 text-blue-800' 
                  : currentProgram.level === 'cao_dang'
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-purple-100 text-purple-800'
              }`}>
                {currentProgram.level === 'trung_cap' ? 'Hệ Trung Cấp' : currentProgram.level === 'cao_dang' ? 'Hệ Cao Đẳng' : 'Chương trình Tùy chỉnh'}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium flex items-center gap-1.5 mt-0.5">
              <span className="font-semibold text-slate-800">{currentProgram.name}</span>
              {currentProgram.fileName && (
                <span className="text-slate-400 font-mono text-[10px]">({currentProgram.fileName})</span>
              )}
            </p>
          </div>
        </div>

        {/* Quick Program Selector & Action Buttons */}
        <div className="flex items-center flex-wrap gap-2">
          
          {/* Preset Buttons */}
          <div className="bg-[#1C1F26] p-1 rounded-lg flex items-center gap-1 text-[11px] font-medium text-slate-300">
            <button
              onClick={() => onSelectSample('trung_cap')}
              className={`px-2.5 py-1 rounded transition-all ${
                currentProgram.level === 'trung_cap' 
                  ? 'bg-blue-600 text-white font-semibold' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              Trung Cấp
            </button>
            <button
              onClick={() => onSelectSample('cao_dang')}
              className={`px-2.5 py-1 rounded transition-all ${
                currentProgram.level === 'cao_dang' 
                  ? 'bg-blue-600 text-white font-semibold' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              Cao Đẳng
            </button>
          </div>

          {/* Hidden File Input */}
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept=".xlsx, .xls, .csv" 
            className="hidden" 
          />

          {/* Upload Button */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition-colors shadow-2xs"
            title="Tải lên file Excel (.xlsx, .xls, .csv)"
          >
            <Upload className="w-3.5 h-3.5 text-slate-500" />
            <span>Tải Excel</span>
          </button>

          {/* Export Button */}
          <button
            onClick={onExportExcel}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-md hover:bg-emerald-100 transition-colors"
            title="Xuất dữ liệu ra Excel"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Xuất XLSX</span>
          </button>

          {/* Audit Report Button */}
          <button
            onClick={onOpenAuditModal}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 transition-colors"
          >
            <FileCheck className="w-3.5 h-3.5" />
            <span>Kiểm Định</span>
          </button>

          {/* Reset Button */}
          <button
            onClick={onReset}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md transition-colors"
            title="Đặt lại dữ liệu ban đầu"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Sub-header: Navigation Tabs & Sheet Selector */}
      <div className="bg-[#1C1F26] text-white px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-2 py-1.5">
        
        {/* Main View Navigation Tabs */}
        <div className="flex items-center space-x-1">
          <button
            onClick={() => onTabChange('checklist')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded transition-colors ${
              activeTab === 'checklist'
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Checklist & Danh Sách Mô-đun</span>
          </button>

          <button
            onClick={() => onTabChange('majors_list')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded transition-colors ${
              activeTab === 'majors_list'
                ? 'bg-blue-600 text-white font-bold'
                : 'text-sky-300 hover:text-sky-200 hover:bg-slate-800'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5 text-sky-400" />
            <span>🎓 Ngành Đào Tạo & Khung Môn</span>
          </button>

          <button
            onClick={() => onTabChange('moet_2026')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded transition-colors ${
              activeTab === 'moet_2026'
                ? 'bg-emerald-600 text-white font-bold'
                : 'text-emerald-400 hover:text-emerald-300 hover:bg-slate-800'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Đối Soát Chuẩn 2026 (Bộ & Sở TP.HCM)</span>
          </button>

          <button
            onClick={() => onTabChange('lms_online')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded transition-colors ${
              activeTab === 'lms_online'
                ? 'bg-indigo-600 text-white font-bold'
                : 'text-indigo-300 hover:text-indigo-200 hover:bg-slate-800'
            }`}
          >
            <Laptop className="w-3.5 h-3.5 text-indigo-400" />
            <span>Triển Khai LMS Online Learning</span>
          </button>

          <button
            onClick={() => onTabChange('analytics')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded transition-colors ${
              activeTab === 'analytics'
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Biểu Đồ & Thống Kê Struct</span>
          </button>

          <button
            onClick={() => onTabChange('comparison')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded transition-colors ${
              activeTab === 'comparison'
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <GitCompare className="w-3.5 h-3.5" />
            <span>So Sánh Trung Cấp vs Cao Đẳng</span>
          </button>

          <button
            onClick={() => onTabChange('ai_advisor')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded transition-colors ${
              activeTab === 'ai_advisor'
                ? 'bg-blue-600 text-white'
                : 'text-amber-400 hover:text-amber-300 hover:bg-slate-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>AI Review Gemini</span>
          </button>
        </div>

        {/* Sheet Tabs Switcher */}
        {sheets.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
              <Layers className="w-3 h-3" /> Active Sheet:
            </span>
            <div className="flex items-center gap-1 bg-[#16191E] p-0.5 rounded border border-slate-700">
              {sheets.map(sheet => (
                <button
                  key={sheet}
                  onClick={() => onSheetChange(sheet)}
                  className={`px-2.5 py-0.5 text-xs font-medium rounded transition-all ${
                    activeSheet === sheet
                      ? 'bg-slate-700 text-white font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {sheet}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
