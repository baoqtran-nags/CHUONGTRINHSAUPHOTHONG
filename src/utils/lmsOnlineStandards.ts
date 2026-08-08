import { CurriculumModule, LmsAuditResult, LmsModuleAnalysis } from '../types';

/**
 * Evaluates curriculum modules for LMS / Online Learning feasibility,
 * determining suitable delivery modes (100% Online, Blended Learning, or Offline)
 * and generating structured notes for system-wide annotation.
 */
export function analyzeLmsFeasibility(modules: CurriculumModule[]): LmsAuditResult {
  const analyzedModules: LmsModuleAnalysis[] = modules.map(m => {
    const nameLower = m.name.toLowerCase();
    const isGeneralBlock = m.block === 'Môn học chung';
    const isInternBlock = m.block === 'Thực tập / Tốt nghiệp';
    const total = m.totalHours || (m.theoryHours + m.practiceHours);
    const theoryRatio = total > 0 ? (m.theoryHours / total) : 0;

    // High 100% Online candidates
    const highOnlineKeywords = [
      'tiếng anh', 'ngoại ngữ', 'pháp luật', 'tin học', 'chính trị', 
      'kỹ năng', 'khởi nghiệp', 'an toàn', 'triết học', 'lý thuyết',
      'ai', 'chuyển đổi số', 'nhập môn', 'tổng quan', 'quản trị'
    ];

    // High Offline / Workshop candidates
    const highOfflineKeywords = [
      'thực tập tốt nghiệp', 'thực tập doanh nghiệp', 'xưởng', 'lắp ráp', 
      'sửa chữa', 'hàn', 'điện xưởng', 'bảo trì phần cứng', 'mạng cáp'
    ];

    let deliveryMode: 'Online 100%' | 'Blended Learning' | 'Trực tiếp (Offline)' = 'Blended Learning';
    let feasibilityScore = 70;
    let recommendedLmsActivities: string[] = [];
    let reasons = '';

    const matchesHighOnline = highOnlineKeywords.some(kw => nameLower.includes(kw));
    const matchesHighOffline = highOfflineKeywords.some(kw => nameLower.includes(kw));

    if (matchesHighOffline || isInternBlock) {
      deliveryMode = 'Trực tiếp (Offline)';
      feasibilityScore = 20;
      recommendedLmsActivities = [
        'LMS Upload báo cáo tuần',
        'Video hướng dẫn thao tác an toàn',
        'Diễn đàn Q&A giải đáp thắc mắc'
      ];
      reasons = 'Môn thực tập/thực hành xưởng bắt buộc thao tác trực tiếp trên thiết bị hoặc tại doanh nghiệp.';
    } else if (matchesHighOnline || (isGeneralBlock && theoryRatio >= 0.5) || theoryRatio >= 0.7) {
      deliveryMode = 'Online 100%';
      feasibilityScore = 95;
      recommendedLmsActivities = [
        'Bài giảng SCORM / E-learning HD',
        'Trắc nghiệm Quiz tự động chấm điểm',
        'Virtual Classroom (Zoom/Teams LMS)',
        'Diễn đàn thảo luận Chuyên đề'
      ];
      reasons = 'Môn học có hàm lượng lý thuyết cao hoặc môn học chung, rất thích hợp triển khai 100% E-learning trên LMS.';
    } else {
      // Default: Blended Learning
      deliveryMode = 'Blended Learning';
      feasibilityScore = 80;
      recommendedLmsActivities = [
        'Lý thuyết LMS e-Learning (40%-50%)',
        'Bài tập cá nhân / Assignment nộp LMS',
        'Thực hành Lab trực tiếp / Workshop (50%)',
        'Kiểm tra định kỳ trên LMS'
      ];
      reasons = 'Môn kết hợp Lý thuyết & Thực hành: Triển khai LMS cho phần bài giảng & trắc nghiệm; phần Lab/Thực hành tổ chức trực tiếp.';
    }

    // Estimate online theory vs offline practice hours
    let onlineTheoryHours = m.theoryHours;
    let offlinePracticeHours = m.practiceHours;

    if (deliveryMode === 'Online 100%') {
      onlineTheoryHours = m.totalHours;
      offlinePracticeHours = 0;
    } else if (deliveryMode === 'Trực tiếp (Offline)') {
      onlineTheoryHours = Math.round(m.theoryHours * 0.3); // Minor online prep
      offlinePracticeHours = m.totalHours - onlineTheoryHours;
    } else {
      // Blended: Theory online + 20% practice quiz online, rest offline
      onlineTheoryHours = m.theoryHours + Math.round(m.practiceHours * 0.3);
      offlinePracticeHours = m.totalHours - onlineTheoryHours;
    }

    const suggestedNote = `[LMS: ${deliveryMode} | SCORM & Quiz | ${onlineTheoryHours}g LMS / ${offlinePracticeHours}g Xưởng]`;

    return {
      moduleId: m.id,
      moduleName: m.name,
      code: m.code,
      credits: m.credits,
      totalHours: m.totalHours,
      theoryHours: m.theoryHours,
      practiceHours: m.practiceHours,
      block: m.block,
      deliveryMode,
      feasibilityScore,
      onlineTheoryHours,
      offlinePracticeHours,
      recommendedLmsActivities,
      reasons,
      suggestedNote
    };
  });

  const totalModules = analyzedModules.length;
  const online100Count = analyzedModules.filter(m => m.deliveryMode === 'Online 100%').length;
  const blendedCount = analyzedModules.filter(m => m.deliveryMode === 'Blended Learning').length;
  const offlineCount = analyzedModules.filter(m => m.deliveryMode === 'Trực tiếp (Offline)').length;

  const totalCurriculumHours = modules.reduce((sum, m) => sum + m.totalHours, 0);
  const totalLmsHours = analyzedModules.reduce((sum, m) => sum + m.onlineTheoryHours, 0);
  const totalOnlineHoursPercentage = totalCurriculumHours > 0 
    ? Math.round((totalLmsHours / totalCurriculumHours) * 100) 
    : 0;

  return {
    totalModules,
    online100Count,
    blendedCount,
    offlineCount,
    totalOnlineHoursPercentage,
    analyzedModules
  };
}
