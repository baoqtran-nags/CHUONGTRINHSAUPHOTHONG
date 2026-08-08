export type ProgramLevel = 'trung_cap' | 'cao_dang' | 'custom';

export type ModuleStatus = 'Đã hoàn thành' | 'Đang biên soạn' | 'Chưa thực hiện' | 'Cần chỉnh sửa' | 'Cần nghiệm thu';

export type KnowledgeBlock = 'Môn học chung' | 'Cơ sở ngành' | 'Chuyên môn' | 'Thực tập / Tốt nghiệp' | 'Tự chọn';

export interface CurriculumModule {
  id: string;
  code: string; // Mã môn/mô-đun
  name: string; // Tên môn/mô-đun
  credits: number; // Số tín chỉ
  totalHours: number; // Tổng số giờ
  theoryHours: number; // Lý thuyết
  practiceHours: number; // Thực hành / Bài tập / Thảo luận
  examHours: number; // Thi / Kiểm tra
  semester: number; // Học kỳ (1, 2, 3, 4, 5, 6)
  block: KnowledgeBlock; // Khối kiến thức
  status: ModuleStatus; // Trạng thái biên soạn
  author?: string; // Người phụ trách / Tác giả
  notes?: string; // Ghi chú
  deliveryMode?: 'Online 100%' | 'Blended Learning' | 'Trực tiếp (Offline)';
  lmsFeasibilityScore?: number;
  rawRowData?: Record<string, any>; // Lưu lại dữ liệu gốc từ file Excel
}

export interface SheetData {
  sheetName: string;
  modules: CurriculumModule[];
  rawColumns: string[];
}

export interface ProgramCurriculum {
  id: string;
  name: string; // e.g. "Trung Cấp - Công Nghệ Thông Tin"
  level: ProgramLevel;
  fileName?: string;
  sheets: Record<string, SheetData>;
  activeSheet: string;
  updatedAt: string;
}

export interface CurriculumMetrics {
  totalModules: number;
  totalCredits: number;
  totalHours: number;
  totalTheoryHours: number;
  totalPracticeHours: number;
  totalExamHours: number;
  practicalRatio: number; // percentage (Practice / (Theory + Practice) * 100)
  statusBreakdown: Record<ModuleStatus, number>;
  semesterBreakdown: Record<number, { credits: number; hours: number; modulesCount: number }>;
  blockBreakdown: Record<string, { credits: number; hours: number; modulesCount: number }>;
  isCompliant: boolean; // Practice >= 50% for Intermediate, >= 60% for College
  auditIssues: AuditIssue[];
}

export interface AuditIssue {
  id: string;
  moduleId?: string;
  moduleName?: string;
  type: 'error' | 'warning' | 'info';
  message: string;
  suggestion: string;
}

export interface ComparisonSummary {
  programA: {
    name: string;
    metrics: CurriculumMetrics;
  };
  programB: {
    name: string;
    metrics: CurriculumMetrics;
  };
  keyDifferences: string[];
}

export interface AiReviewResponse {
  summary: string;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  proposedAdjustments?: Array<{
    moduleName: string;
    currentHours: string;
    suggestedHours: string;
    reason: string;
  }>;
}

export type Moet2026RuleCategory = 
  | 'digital_ai' 
  | 'green_skills' 
  | 'hcmc_enterprise' 
  | 'foreign_language' 
  | 'vnf_structure';

export interface Moet2026RuleCheck {
  id: string;
  category: Moet2026RuleCategory;
  categoryName: string;
  title: string;
  standardAuthority: 'Bộ GD&ĐT / Bộ LĐTBXH' | 'Sở GD&ĐT TP.HCM' | 'Khung VNF 2026';
  status: 'passed' | 'warning' | 'failed';
  scoreImpact: number; // Max score points (e.g. 20)
  earnedScore: number;
  description: string;
  currentFinding: string;
  requiredAdjustment: string;
  targetModules?: string[];
}

export interface Moet2026AuditResult {
  overallScore: number; // 0 to 100
  ratingText: 'Đạt Chuẩn Xuất Sắc 2026' | 'Đạt Chuẩn Cơ Bản' | 'Cần Điều Chỉnh Bắt Buộc' | 'Chưa Đạt Chuẩn';
  rules: Moet2026RuleCheck[];
  suggested2026Modules: CurriculumModule[];
  suggestedHourAdjustments: Array<{
    moduleId: string;
    moduleName: string;
    currentTheory: number;
    currentPractice: number;
    recommendedTheory: number;
    recommendedPractice: number;
    reason: string;
  }>;
}

export interface LmsModuleAnalysis {
  moduleId: string;
  moduleName: string;
  code: string;
  credits: number;
  totalHours: number;
  theoryHours: number;
  practiceHours: number;
  block: KnowledgeBlock;
  deliveryMode: 'Online 100%' | 'Blended Learning' | 'Trực tiếp (Offline)';
  feasibilityScore: number; // 0 - 100
  onlineTheoryHours: number;
  offlinePracticeHours: number;
  recommendedLmsActivities: string[];
  reasons: string;
  suggestedNote: string;
}

export interface LmsAuditResult {
  totalModules: number;
  online100Count: number;
  blendedCount: number;
  offlineCount: number;
  totalOnlineHoursPercentage: number;
  analyzedModules: LmsModuleAnalysis[];
}
