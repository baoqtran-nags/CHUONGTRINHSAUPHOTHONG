import { CurriculumModule, ProgramLevel, Moet2026AuditResult, Moet2026RuleCheck } from '../types';

/**
 * Evaluates a curriculum against the 2026 Standards of Vietnam MOET (Bộ GD&ĐT) / BLĐTBXH
 * and HCMC DOET (Sở GD&ĐT TP.HCM).
 */
export function analyze2026Standards(
  modules: CurriculumModule[],
  level: ProgramLevel = 'trung_cap'
): Moet2026AuditResult {
  const rules: Moet2026RuleCheck[] = [];
  const suggested2026Modules: CurriculumModule[] = [];
  const suggestedHourAdjustments: Moet2026AuditResult['suggestedHourAdjustments'] = [];

  const totalHours = modules.reduce((sum, m) => sum + m.totalHours, 0);
  const totalCredits = modules.reduce((sum, m) => sum + m.credits, 0);
  const totalTheory = modules.reduce((sum, m) => sum + m.theoryHours, 0);
  const totalPractice = modules.reduce((sum, m) => sum + m.practiceHours, 0);
  const totalExam = modules.reduce((sum, m) => sum + m.examHours, 0);

  // ----------------------------------------------------------------------
  // RULE 1: Digital Transformation & AI Integration (Chuẩn Chuyển đổi số & AI 2026)
  // ----------------------------------------------------------------------
  const aiKeywords = ['ai', 'trí tuệ nhân tạo', 'chuyển đổi số', 'công nghệ số', 'big data', 'dữ liệu lớn', 'đám mây', 'iot', 'robotics'];
  const digitalModules = modules.filter(m => 
    aiKeywords.some(kw => m.name.toLowerCase().includes(kw))
  );

  let digitalStatus: 'passed' | 'warning' | 'failed' = 'failed';
  let digitalScore = 0;
  let digitalFinding = '';
  let digitalAdjustment = '';

  if (digitalModules.length >= 2) {
    digitalStatus = 'passed';
    digitalScore = 20;
    digitalFinding = `Đã có ${digitalModules.length} môn tích hợp Kỹ năng số & AI (${digitalModules.map(m => m.name).join(', ')}).`;
    digitalAdjustment = 'Chương trình đáp ứng xuất sắc Chuẩn Chuyển đổi số & AI 2026 của Sở GD&ĐT TP.HCM.';
  } else if (digitalModules.length === 1) {
    digitalStatus = 'warning';
    digitalScore = 12;
    digitalFinding = `Đã có 1 môn tích hợp công nghệ (${digitalModules[0].name}).`;
    digitalAdjustment = 'Khuyên dùng: Bổ sung thêm 01 môn học chuyên đề "Ứng dụng AI & Công nghệ số trong công việc" (2 Tín chỉ - 30 giờ thực hành) theo Chỉ thị 2026.';
  } else {
    digitalStatus = 'failed';
    digitalScore = 0;
    digitalFinding = 'Chưa có môn học/mô-đun nào về Ứng dụng Trí tuệ Nhân tạo (AI) hoặc Chuyển đổi số.';
    digitalAdjustment = 'Bắt buộc bổ sung từ năm 2026: Thêm mô-đun bắt buộc "Ứng dụng Trí tuệ Nhân tạo (AI) & Công nghệ số 2026" (3 tín chỉ: 15g LT - 30g TH).';
    
    // Add recommended auto-addition module
    suggested2026Modules.push({
      id: 'suggested-ai-2026',
      code: 'MĐ-AI2026',
      name: 'Ứng dụng Trí tuệ Nhân tạo (AI) & Kỹ năng Số 2026',
      credits: 3,
      totalHours: 45,
      theoryHours: 15,
      practiceHours: 30,
      examHours: 0,
      semester: 2,
      block: 'Cơ sở ngành',
      status: 'Chưa thực hiện',
      author: 'Chuyên gia AI Sở GD&ĐT TP.HCM',
      notes: 'Môn học bắt buộc theo Chuẩn Khung 2026 của Bộ GD&ĐT & Sở TP.HCM'
    });
  }

  rules.push({
    id: 'rule-digital-ai-2026',
    category: 'digital_ai',
    categoryName: 'Kỹ Năng Số & Trí Tuệ Nhân Tạo (AI)',
    title: 'Năng Lực Số & AI Bắt Buộc 2026',
    standardAuthority: 'Sở GD&ĐT TP.HCM',
    status: digitalStatus,
    scoreImpact: 20,
    earnedScore: digitalScore,
    description: 'Chỉ thị 2026 của Sở GD&ĐT TP.HCM & Bộ GD&ĐT quy định tất cả chương trình GDNN/đào tạo nghề phải tích hợp môn/chuyên đề ứng dụng AI và chuyển đổi số.',
    currentFinding: digitalFinding,
    requiredAdjustment: digitalAdjustment,
    targetModules: digitalModules.map(m => m.name)
  });

  // ----------------------------------------------------------------------
  // RULE 2: Green Skills & ESG Sustainability (Chuẩn Kỹ Năng Xanh & Bền Vững)
  // ----------------------------------------------------------------------
  const greenKeywords = ['xanh', 'bền vững', 'môi trường', 'an toàn', 'esg', 'tiết kiệm năng lượng', 'sinh thái', '3r'];
  const greenModules = modules.filter(m => 
    greenKeywords.some(kw => m.name.toLowerCase().includes(kw))
  );

  let greenStatus: 'passed' | 'warning' | 'failed' = 'failed';
  let greenScore = 0;
  let greenFinding = '';
  let greenAdjustment = '';

  if (greenModules.length >= 1) {
    greenStatus = 'passed';
    greenScore = 20;
    greenFinding = `Đã có môn học/chuyên đề xanh/môi trường (${greenModules.map(m => m.name).join(', ')}).`;
    greenAdjustment = 'Đạt Chuẩn Chuyển đổi Xanh GDNN 2026.';
  } else {
    greenStatus = 'warning';
    greenScore = 8;
    greenFinding = 'Chưa tích hợp Chuyên đề Kỹ năng Xanh & An toàn Môi trường Lao động.';
    greenAdjustment = 'Đề xuất bổ sung: Tích hợp chuyên đề 15 giờ "Kỹ năng Xanh, Tiết kiệm Năng lượng & An toàn Môi trường TP.HCM" vào học kỳ 1 hoặc 2.';
    
    suggested2026Modules.push({
      id: 'suggested-green-2026',
      code: 'MĐ-GREEN2026',
      name: 'Kỹ năng Xanh & An toàn Môi trường Lao động TP.HCM',
      credits: 2,
      totalHours: 30,
      theoryHours: 10,
      practiceHours: 20,
      examHours: 0,
      semester: 1,
      block: 'Môn học chung',
      status: 'Chưa thực hiện',
      author: 'Ban GDNN Sở GD&ĐT TP.HCM',
      notes: 'Tích hợp Đề án Chuyển đổi Xanh TP.HCM 2026'
    });
  }

  rules.push({
    id: 'rule-green-skills-2026',
    category: 'green_skills',
    categoryName: 'Kỹ Năng Xanh & Phát Triển Bền Vững',
    title: 'Chương Trình Đào Tạo Xanh (Green Vocational Standards)',
    standardAuthority: 'Bộ GD&ĐT / Bộ LĐTBXH',
    status: greenStatus,
    scoreImpact: 20,
    earnedScore: greenScore,
    description: 'Chiến lược Phát triển Đào tạo Xanh 2026-2030 yêu cầu trang bị kiến thức về kinh tế tuần hoàn, giảm phát thải carbon và an toàn sinh thái.',
    currentFinding: greenFinding,
    requiredAdjustment: greenAdjustment,
    targetModules: greenModules.map(m => m.name)
  });

  // ----------------------------------------------------------------------
  // RULE 3: HCMC Enterprise Internship & Project-Based Learning (Thực Học - Doanh Nghiệp TP.HCM)
  // ----------------------------------------------------------------------
  const internKeywords = ['thực tập', 'doanh nghiệp', 'dự án tốt nghiệp', 'đồ án', 'thực tế'];
  const internModules = modules.filter(m => 
    internKeywords.some(kw => m.name.toLowerCase().includes(kw))
  );

  const internHours = internModules.reduce((sum, m) => sum + m.totalHours, 0);
  const minRequiredInternHours = level === 'cao_dang' ? 120 : 90;

  let internStatus: 'passed' | 'warning' | 'failed' = 'failed';
  let internScore = 0;
  let internFinding = '';
  let internAdjustment = '';

  if (internHours >= minRequiredInternHours && internModules.length >= 1) {
    internStatus = 'passed';
    internScore = 20;
    internFinding = `Có ${internModules.length} học phần Thực tập Doanh nghiệp / Dự án với tổng thời lượng ${internHours} giờ (Đạt chuẩn ≥${minRequiredInternHours}g).`;
    internAdjustment = 'Đáp ứng tốt mô hình Thực học - Thực nghiệp hợp tác với Doanh nghiệp TP.HCM.';
  } else if (internModules.length >= 1) {
    internStatus = 'warning';
    internScore = 12;
    internFinding = `Đã có môn thực tập (${internModules.map(m => m.name).join(', ')}), nhưng tổng số giờ (${internHours}g) chưa đủ ${minRequiredInternHours}g theo yêu cầu HCMC Enterprise Linkage 2026.`;
    internAdjustment = `Điều chỉnh: Tăng thời lượng Thực tập Doanh nghiệp từ ${internHours}g lên tối thiểu ${minRequiredInternHours}g ở học kỳ cuối.`;
  } else {
    internStatus = 'failed';
    internScore = 0;
    internFinding = 'Thiếu mô-đun Thực tập Doanh nghiệp / Đồ án Thực tế tại Doanh nghiệp TP.HCM.';
    internAdjustment = `Cần bổ sung ngay: Học phần "Thực tập Tốt nghiệp tại Doanh nghiệp TP.HCM" (Tối thiểu ${minRequiredInternHours} giờ thực tế).`;

    suggested2026Modules.push({
      id: 'suggested-internship-2026',
      code: 'MĐ-TTDN2026',
      name: 'Thực tập Tốt nghiệp tại Doanh nghiệp TP.HCM',
      credits: 6,
      totalHours: minRequiredInternHours,
      theoryHours: 0,
      practiceHours: minRequiredInternHours,
      examHours: 0,
      semester: level === 'cao_dang' ? 6 : 4,
      block: 'Thực tập / Tốt nghiệp',
      status: 'Chưa thực hiện',
      author: 'Hội đồng Doanh nghiệp Đối tác TP.HCM',
      notes: 'Gắn kết Doanh nghiệp trực tiếp tuyển dụng 2026'
    });
  }

  rules.push({
    id: 'rule-hcmc-enterprise-2026',
    category: 'hcmc_enterprise',
    categoryName: 'Gắn Kết Doanh Nghiệp TP.HCM & Thực Học',
    title: 'Chuẩn Thực Tập Doanh Nghiệp TP.HCM (Work-Based Learning)',
    standardAuthority: 'Sở GD&ĐT TP.HCM',
    status: internStatus,
    scoreImpact: 20,
    earnedScore: internScore,
    description: 'Chỉ tiêu 2026 tại TP.HCM yêu cầu trên 80% sinh viên tốt nghiệp có thời gian trải nghiệm thực tế ít nhất 15% tổng thời lượng chương trình tại doanh nghiệp địa phương.',
    currentFinding: internFinding,
    requiredAdjustment: internAdjustment,
    targetModules: internModules.map(m => m.name)
  });

  // ----------------------------------------------------------------------
  // RULE 4: Foreign Language Communicative Practical Ratio (Chuẩn Ngoại Ngữ 2026)
  // ----------------------------------------------------------------------
  const langKeywords = ['tiếng anh', 'ngoại ngữ', 'anh văn', 'english', 'tiếng nhật', 'tiếng hàn'];
  const langModules = modules.filter(m => 
    langKeywords.some(kw => m.name.toLowerCase().includes(kw))
  );

  let langStatus: 'passed' | 'warning' | 'failed' = 'passed';
  let langScore = 20;
  let langFinding = '';
  let langAdjustment = '';

  if (langModules.length === 0) {
    langStatus = 'warning';
    langScore = 10;
    langFinding = 'Chưa tìm thấy học phần Ngoại ngữ / Tiếng Anh chuyên ngành trong khung.';
    langAdjustment = 'Khuyên dùng: Bổ sung 1-2 mô-đun Tiếng Anh Giao tiếp Chuyên ngành (thực hành chiếm ≥60%).';
  } else {
    // Check theory vs practice in language modules
    const unbalancedLang = langModules.filter(m => m.practiceHours < m.theoryHours);
    if (unbalancedLang.length > 0) {
      langStatus = 'warning';
      langScore = 14;
      langFinding = `Có ${unbalancedLang.length} môn ngoại ngữ có số giờ lý thuyết lớn hơn thực hành (${unbalancedLang.map(m => m.name).join(', ')}).`;
      langAdjustment = 'Khung 2026 yêu cầu Ngoại ngữ nâng cao phản xạ giao tiếp: Điều chỉnh tỷ lệ Thực hành / Nghe - Nói đạt tối thiểu 60% tổng số giờ.';

      unbalancedLang.forEach(m => {
        const total = m.totalHours || (m.theoryHours + m.practiceHours);
        const newPractice = Math.round(total * 0.6);
        const newTheory = Math.max(0, total - newPractice);
        suggestedHourAdjustments.push({
          moduleId: m.id,
          moduleName: m.name,
          currentTheory: m.theoryHours,
          currentPractice: m.practiceHours,
          recommendedTheory: newTheory,
          recommendedPractice: newPractice,
          reason: 'Cân đối chuẩn Ngoại ngữ Giao tiếp 2026 (Thực hành ≥ 60%)'
        });
      });
    } else {
      langStatus = 'passed';
      langScore = 20;
      langFinding = `Tất cả ${langModules.length} môn Ngoại ngữ đều đảm bảo tỷ lệ thực hành giao tiếp đạt chuẩn.`;
      langAdjustment = 'Đáp ứng tốt Chuẩn Ngoại ngữ Giao tiếp GDNN 2026.';
    }
  }

  rules.push({
    id: 'rule-foreign-language-2026',
    category: 'foreign_language',
    categoryName: 'Chuẩn Ngoại Ngữ Giao Tiếp 2026',
    title: 'Năng Lực Tiếng Anh / Ngoại Ngữ Ứng Dụng',
    standardAuthority: 'Bộ GD&ĐT / Bộ LĐTBXH',
    status: langStatus,
    scoreImpact: 20,
    earnedScore: langScore,
    description: 'Định hướng 2026 chuyển dịch dạy Ngoại ngữ từ ngữ pháp sang Nghe - Nói - Viết báo cáo kỹ thuật thực tế.',
    currentFinding: langFinding,
    requiredAdjustment: langAdjustment,
    targetModules: langModules.map(m => m.name)
  });

  // ----------------------------------------------------------------------
  // RULE 5: VNF National Qualifications Framework Structure & Exam Cap (Chuẩn Khung VNF 2026)
  // ----------------------------------------------------------------------
  const totalExamRatio = totalHours > 0 ? (totalExam / totalHours) * 100 : 0;
  let vnfStatus: 'passed' | 'warning' | 'failed' = 'passed';
  let vnfScore = 20;
  let vnfFinding = '';
  let vnfAdjustment = '';

  const issues: string[] = [];

  if (totalExamRatio > 10) {
    issues.push(`Giờ thi/kiểm tra (${totalExam}g ~ ${totalExamRatio.toFixed(1)}%) vượt quá 10% tổng số giờ.`);
  }

  if (level === 'cao_dang' && totalCredits < 60) {
    issues.push(`Tổng tín chỉ Cao đẳng (${totalCredits} TC) chưa đạt mức tối thiểu 60 TC.`);
  } else if (level === 'trung_cap' && totalCredits < 35) {
    issues.push(`Tổng tín chỉ Trung cấp (${totalCredits} TC) chưa đạt mức tối thiểu 35 TC.`);
  }

  if (issues.length === 0) {
    vnfStatus = 'passed';
    vnfScore = 20;
    vnfFinding = `Cấu trúc tổng tín chỉ (${totalCredits} TC) và giờ thi (${totalExamRatio.toFixed(1)}%) phù hợp khung VNF 2026.`;
    vnfAdjustment = 'Đạt chuẩn Khung trình độ Quốc gia VNF 2026.';
  } else {
    vnfStatus = 'warning';
    vnfScore = 12;
    vnfFinding = issues.join(' ');
    vnfAdjustment = 'Chuyển bớt số giờ thi tập trung sang đánh giá quá trình (Formative Assessment) và bổ sung số giờ bài tập thực hành.';
  }

  rules.push({
    id: 'rule-vnf-structure-2026',
    category: 'vnf_structure',
    categoryName: 'Cấu Trúc Khung Trình Độ VNF 2026',
    title: 'Khung Trình Độ Quốc Gia & Giảm Tải Thi Kiểm Tra',
    standardAuthority: 'Khung VNF 2026',
    status: vnfStatus,
    scoreImpact: 20,
    earnedScore: vnfScore,
    description: 'Quy định mới kiểm soát thời lượng thi học kỳ không quá 10% tổng thời lượng để tránh gây áp lực quá tải.',
    currentFinding: vnfFinding,
    requiredAdjustment: vnfAdjustment
  });

  // Calculate Overall Score (Sum of earnedScores)
  const totalScore = rules.reduce((sum, r) => sum + r.earnedScore, 0);

  let ratingText: Moet2026AuditResult['ratingText'] = 'Chưa Đạt Chuẩn';
  if (totalScore >= 90) {
    ratingText = 'Đạt Chuẩn Xuất Sắc 2026';
  } else if (totalScore >= 75) {
    ratingText = 'Đạt Chuẩn Cơ Bản';
  } else if (totalScore >= 50) {
    ratingText = 'Cần Điều Chỉnh Bắt Buộc';
  } else {
    ratingText = 'Chưa Đạt Chuẩn';
  }

  return {
    overallScore: Math.min(100, Math.max(0, totalScore)),
    ratingText,
    rules,
    suggested2026Modules,
    suggestedHourAdjustments
  };
}
