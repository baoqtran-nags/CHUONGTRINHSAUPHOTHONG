import React, { useState } from 'react';
import { 
  SAMPLE_TRUNG_CAP_PROGRAM, 
  SAMPLE_CAO_DANG_PROGRAM 
} from './data/sampleCurriculum';
import { 
  ProgramCurriculum, 
  CurriculumModule, 
  ModuleStatus 
} from './types';
import { parseExcelFile, exportProgramToExcel } from './utils/excelParser';
import { calculateMetrics } from './utils/curriculumAnalyzer';
import { Header } from './components/Header';
import { SummaryCards } from './components/SummaryCards';
import { CurriculumCharts } from './components/CurriculumCharts';
import { ChecklistTable } from './components/ChecklistTable';
import { ProgramComparison } from './components/ProgramComparison';
import { ModuleEditModal } from './components/ModuleEditModal';
import { AuditReportModal } from './components/AuditReportModal';
import { AiCurriculumAdvisor } from './components/AiCurriculumAdvisor';
import { Moet2026AuditPanel } from './components/Moet2026AuditPanel';
import { LmsOnlinePanel } from './components/LmsOnlinePanel';
import { MajorsCatalogPanel } from './components/MajorsCatalogPanel';

export default function App() {
  const [currentProgram, setCurrentProgram] = useState<ProgramCurriculum>(SAMPLE_TRUNG_CAP_PROGRAM);
  const [activeSheetName, setActiveSheetName] = useState<string>('Khung Chương Trình Trung Cấp');
  const [activeTab, setActiveTab] = useState<'checklist' | 'majors_list' | 'moet_2026' | 'lms_online' | 'analytics' | 'comparison' | 'ai_advisor'>('checklist');

  // Modals
  const [isModuleModalOpen, setIsModuleModalOpen] = useState(false);
  const [editingModule, setEditingModule] = useState<CurriculumModule | null>(null);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);

  // Switch preset sample
  const handleSelectSample = (type: 'trung_cap' | 'cao_dang') => {
    if (type === 'trung_cap') {
      setCurrentProgram(SAMPLE_TRUNG_CAP_PROGRAM);
      setActiveSheetName(Object.keys(SAMPLE_TRUNG_CAP_PROGRAM.sheets)[0] || '');
    } else {
      setCurrentProgram(SAMPLE_CAO_DANG_PROGRAM);
      setActiveSheetName(Object.keys(SAMPLE_CAO_DANG_PROGRAM.sheets)[0] || '');
    }
  };

  // Upload Excel File
  const handleFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        try {
          const parsed = parseExcelFile(e.target.result as ArrayBuffer, file.name);
          setCurrentProgram(parsed);
          setActiveSheetName(parsed.activeSheet);
        } catch (err) {
          alert('Không thể đọc file Excel này. Vui lòng kiểm tra lại định dạng file (.xlsx, .xls, .csv).');
        }
      }
    };
    reader.readAsArrayBuffer(file);
  };

  // Export to Excel
  const handleExportExcel = () => {
    exportProgramToExcel(currentProgram);
  };

  // Reset to initial state
  const handleReset = () => {
    handleSelectSample('trung_cap');
  };

  // Sheet Data & Metrics for active sheet
  const activeSheetData = currentProgram.sheets[activeSheetName] || {
    sheetName: activeSheetName,
    modules: [],
    rawColumns: []
  };

  const activeMetrics = calculateMetrics(activeSheetData.modules, currentProgram.level);

  // CRUD Operations on Modules
  const handleSaveModule = (savedModule: CurriculumModule) => {
    const existingIndex = activeSheetData.modules.findIndex(m => m.id === savedModule.id);
    let updatedModules = [...activeSheetData.modules];

    if (existingIndex >= 0) {
      updatedModules[existingIndex] = savedModule;
    } else {
      updatedModules.unshift(savedModule);
    }

    setCurrentProgram(prev => ({
      ...prev,
      sheets: {
        ...prev.sheets,
        [activeSheetName]: {
          ...activeSheetData,
          modules: updatedModules
        }
      }
    }));
  };

  const handleDeleteModule = (moduleId: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa môn học này khỏi danh sách?')) return;

    const updatedModules = activeSheetData.modules.filter(m => m.id !== moduleId);
    setCurrentProgram(prev => ({
      ...prev,
      sheets: {
        ...prev.sheets,
        [activeSheetName]: {
          ...activeSheetData,
          modules: updatedModules
        }
      }
    }));
  };

  const handleQuickStatusChange = (moduleId: string, newStatus: ModuleStatus) => {
    const updatedModules = activeSheetData.modules.map(m => {
      if (m.id === moduleId) {
        return { ...m, status: newStatus };
      }
      return m;
    });

    setCurrentProgram(prev => ({
      ...prev,
      sheets: {
        ...prev.sheets,
        [activeSheetName]: {
          ...activeSheetData,
          modules: updatedModules
        }
      }
    }));
  };

  // Batch Add New Modules (e.g. 2026 standards auto-insertion)
  const handleAddBatchModules = (newModules: CurriculumModule[]) => {
    setCurrentProgram(prev => {
      const sheet = prev.sheets[activeSheetName] || activeSheetData;
      return {
        ...prev,
        sheets: {
          ...prev.sheets,
          [activeSheetName]: {
            ...sheet,
            modules: [...newModules, ...sheet.modules]
          }
        }
      };
    });
  };

  // Replace/Update entire module list (e.g. 2026 hour balancing)
  const handleUpdateModules = (updatedModules: CurriculumModule[]) => {
    setCurrentProgram(prev => ({
      ...prev,
      sheets: {
        ...prev.sheets,
        [activeSheetName]: {
          ...activeSheetData,
          modules: updatedModules
        }
      }
    }));
  };

  return (
    <div className="min-h-screen bg-[#F1F3F6] font-sans text-slate-900 flex flex-col antialiased">
      
      {/* App Header */}
      <Header
        currentProgram={currentProgram}
        onSelectSample={handleSelectSample}
        onFileUpload={handleFileUpload}
        onExportExcel={handleExportExcel}
        activeSheet={activeSheetName}
        onSheetChange={(sheet) => setActiveSheetName(sheet)}
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab)}
        onOpenAuditModal={() => setIsAuditModalOpen(true)}
        onReset={handleReset}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Top Summary Stats Bar */}
        <SummaryCards
          metrics={activeMetrics}
          level={currentProgram.level}
          onOpenAuditModal={() => setIsAuditModalOpen(true)}
        />

        {/* Tab Views */}
        {activeTab === 'checklist' && (
          <ChecklistTable
            modules={activeSheetData.modules}
            onAddModule={() => {
              setEditingModule(null);
              setIsModuleModalOpen(true);
            }}
            onEditModule={(mod) => {
              setEditingModule(mod);
              setIsModuleModalOpen(true);
            }}
            onDeleteModule={handleDeleteModule}
            onQuickStatusChange={handleQuickStatusChange}
          />
        )}

        {activeTab === 'majors_list' && (
          <MajorsCatalogPanel
            onSelectMajorToLoad={(loadedProgram) => {
              setCurrentProgram(loadedProgram);
              setActiveSheetName(Object.keys(loadedProgram.sheets)[0] || '');
            }}
            onSwitchToTab={(targetTab) => setActiveTab(targetTab)}
          />
        )}

        {activeTab === 'moet_2026' && (
          <Moet2026AuditPanel
            program={currentProgram}
            activeSheetName={activeSheetName}
            onAddModules={handleAddBatchModules}
            onUpdateModules={handleUpdateModules}
            onSwitchToAiTab={() => setActiveTab('ai_advisor')}
          />
        )}

        {activeTab === 'lms_online' && (
          <LmsOnlinePanel
            program={currentProgram}
            activeSheetName={activeSheetName}
            onUpdateModules={handleUpdateModules}
            onSwitchToAiTab={() => setActiveTab('ai_advisor')}
          />
        )}

        {activeTab === 'analytics' && (
          <CurriculumCharts metrics={activeMetrics} />
        )}

        {activeTab === 'comparison' && (
          <ProgramComparison
            trungCapProgram={SAMPLE_TRUNG_CAP_PROGRAM}
            caoDangProgram={SAMPLE_CAO_DANG_PROGRAM}
          />
        )}

        {activeTab === 'ai_advisor' && (
          <AiCurriculumAdvisor
            program={currentProgram}
            metrics={activeMetrics}
          />
        )}

      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 px-4 sm:px-6 lg:px-8 text-center text-xs text-slate-500">
        <p>Hệ thống Quản lý & Phân tích Khung Chương trình Đào tạo Giáo dục Nghề nghiệp • Tuân thủ Thông tư Bộ LĐTBXH</p>
      </footer>

      {/* Modals */}
      <ModuleEditModal
        isOpen={isModuleModalOpen}
        onClose={() => setIsModuleModalOpen(false)}
        onSave={handleSaveModule}
        editingModule={editingModule}
      />

      <AuditReportModal
        isOpen={isAuditModalOpen}
        onClose={() => setIsAuditModalOpen(false)}
        program={currentProgram}
      />

    </div>
  );
}
