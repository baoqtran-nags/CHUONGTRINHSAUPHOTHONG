import { CurriculumModule, CurriculumMetrics, AuditIssue, ModuleStatus, ProgramLevel } from '../types';

export function calculateMetrics(modules: CurriculumModule[], level: ProgramLevel = 'trung_cap'): CurriculumMetrics {
  let totalCredits = 0;
  let totalHours = 0;
  let totalTheoryHours = 0;
  let totalPracticeHours = 0;
  let totalExamHours = 0;

  const statusBreakdown: Record<ModuleStatus, number> = {
    'Đã hoàn thành': 0,
    'Đang biên soạn': 0,
    'Chưa thực hiện': 0,
    'Cần chỉnh sửa': 0,
    'Cần nghiệm thu': 0
  };

  const semesterBreakdown: Record<number, { credits: number; hours: number; modulesCount: number }> = {};
  for (let sem = 1; sem <= 6; sem++) {
    semesterBreakdown[sem] = { credits: 0, hours: 0, modulesCount: 0 };
  }

  const blockBreakdown: Record<string, { credits: number; hours: number; modulesCount: number }> = {};

  const auditIssues: AuditIssue[] = [];

  modules.forEach(m => {
    totalCredits += m.credits;
    totalHours += m.totalHours;
    totalTheoryHours += m.theoryHours;
    totalPracticeHours += m.practiceHours;
    totalExamHours += m.examHours;

    // Status breakdown
    if (statusBreakdown[m.status] !== undefined) {
      statusBreakdown[m.status] += 1;
    } else {
      statusBreakdown['Chưa thực hiện'] += 1;
    }

    // Semester breakdown
    const semKey = m.semester || 1;
    if (!semesterBreakdown[semKey]) {
      semesterBreakdown[semKey] = { credits: 0, hours: 0, modulesCount: 0 };
    }
    semesterBreakdown[semKey].credits += m.credits;
    semesterBreakdown[semKey].hours += m.totalHours;
    semesterBreakdown[semKey].modulesCount += 1;

    // Block breakdown
    const blockKey = m.block || 'Chuyên môn';
    if (!blockBreakdown[blockKey]) {
      blockBreakdown[blockKey] = { credits: 0, hours: 0, modulesCount: 0 };
    }
    blockBreakdown[blockKey].credits += m.credits;
    blockBreakdown[blockKey].hours += m.totalHours;
    blockBreakdown[blockKey].modulesCount += 1;

    // Individual module audits
    // 1. Check hour breakdown match
    const computedSum = m.theoryHours + m.practiceHours + m.examHours;
    if (m.totalHours > 0 && Math.abs(computedSum - m.totalHours) > 1 && (m.theoryHours > 0 || m.practiceHours > 0)) {
      auditIssues.push({
        id: `audit-hours-${m.id}`,
        moduleId: m.id,
        moduleName: m.name,
        type: 'warning',
        message: `Tổng số giờ (${m.totalHours}g) không khớp với Lý thuyết + Thực hành + Thi (${computedSum}g).`,
        suggestion: `Cập nhật lại tổng số giờ bằng ${computedSum}g hoặc điều chỉnh lại phân bổ giờ.`
      });
    }

    // 2. Check 0 credits or 0 hours
    if (m.credits <= 0) {
      auditIssues.push({
        id: `audit-cred-${m.id}`,
        moduleId: m.id,
        moduleName: m.name,
        type: 'error',
        message: `Môn/Mô-đun chưa được cấu hình số tín chỉ (hiện tại = 0).`,
        suggestion: `Quy đổi số giờ sang tín chỉ (thông thường 15g LT = 1TC, 30g TH = 1TC).`
      });
    }

    // 3. Unassigned author check
    if (!m.author || m.author === 'Chưa phân công' || m.author === 'Đang phân công') {
      auditIssues.push({
        id: `audit-author-${m.id}`,
        moduleId: m.id,
        moduleName: m.name,
        type: 'info',
        message: `Chưa phân công giảng viên/tác giả phụ trách biên soạn.`,
        suggestion: `Gán giảng viên/khoa chuyên môn chịu trách nhiệm tiến độ.`
      });
    }
  });

  // Calculate practical ratio
  const theoryPlusPractice = totalTheoryHours + totalPracticeHours;
  const practicalRatio = theoryPlusPractice > 0 ? (totalPracticeHours / theoryPlusPractice) * 100 : 0;

  // Vocational education standard compliance threshold:
  // Trung Cấp requirement: >= 50% practical hours
  // Cao Đẳng requirement: >= 60% practical hours
  const requiredRatio = level === 'cao_dang' ? 60 : 50;
  const isCompliant = practicalRatio >= requiredRatio;

  if (!isCompliant && modules.length > 0) {
    auditIssues.push({
      id: 'audit-compliance-ratio',
      type: 'warning',
      message: `Tỷ lệ thực hành toàn chương trình (${practicalRatio.toFixed(1)}%) chưa đạt chuẩn GDNN tối thiểu (${requiredRatio}% áp dụng cho hệ ${level === 'cao_dang' ? 'Cao đẳng' : 'Trung cấp'}).`,
      suggestion: `Tăng số giờ thực hành/bài tập lớn các mô-đun chuyên môn để đáp ứng chuẩn kỹ năng nghề.`
    });
  }

  return {
    totalModules: modules.length,
    totalCredits,
    totalHours,
    totalTheoryHours,
    totalPracticeHours,
    totalExamHours,
    practicalRatio,
    statusBreakdown,
    semesterBreakdown,
    blockBreakdown,
    isCompliant,
    auditIssues
  };
}
