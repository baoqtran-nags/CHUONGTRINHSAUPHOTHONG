import * as XLSX from 'xlsx';
import { CurriculumModule, SheetData, ProgramCurriculum, ProgramLevel, ModuleStatus, KnowledgeBlock } from '../types';

export function findColumnByKeywords(headers: string[], keywords: string[]): string | null {
  for (const header of headers) {
    const lowerHeader = header.toLowerCase().trim();
    if (keywords.some(kw => lowerHeader.includes(kw.toLowerCase()))) {
      return header;
    }
  }
  return null;
}

export function normalizeStatus(rawStatus: any): ModuleStatus {
  if (!rawStatus) return 'Chưa thực hiện';
  const str = String(rawStatus).toLowerCase().trim();
  
  if (str.includes('hoàn thành') || str.includes('đạt') || str.includes('xong') || str.includes('đã duyệt') || str.includes('passed')) {
    return 'Đã hoàn thành';
  }
  if (str.includes('chỉnh sửa') || str.includes('sửa') || str.includes('bổ sung') || str.includes('fix')) {
    return 'Cần chỉnh sửa';
  }
  if (str.includes('nghiệm thu') || str.includes('chờ duyệt') || str.includes('duyệt')) {
    return 'Cần nghiệm thu';
  }
  if (str.includes('đang') || str.includes('soạn') || str.includes('biên') || str.includes('draft') || str.includes('dự thảo')) {
    return 'Đang biên soạn';
  }
  return 'Chưa thực hiện';
}

export function normalizeKnowledgeBlock(rawBlock: any, moduleName: string = ''): KnowledgeBlock {
  if (rawBlock) {
    const str = String(rawBlock).toLowerCase().trim();
    if (str.includes('chung') || str.includes('đại cương') || str.includes('cơ bản')) return 'Môn học chung';
    if (str.includes('cơ sở')) return 'Cơ sở ngành';
    if (str.includes('chuyên ngành') || str.includes('chuyên môn') || str.includes('nghiệp vụ')) return 'Chuyên môn';
    if (str.includes('thực tập') || str.includes('tốt nghiệp') || str.includes('đồ án')) return 'Thực tập / Tốt nghiệp';
    if (str.includes('tự chọn') || str.includes('lựa chọn')) return 'Tự chọn';
  }

  // Fallback by module name hints
  const nameStr = moduleName.toLowerCase();
  if (nameStr.includes('thực tập') || nameStr.includes('tốt nghiệp') || nameStr.includes('đồ án')) {
    return 'Thực tập / Tốt nghiệp';
  }
  if (nameStr.includes('chính trị') || nameStr.includes('pháp luật') || nameStr.includes('thể chất') || nameStr.includes('quốc phòng') || nameStr.includes('tin học cơ bản') || nameStr.includes('tiếng anh')) {
    return 'Môn học chung';
  }
  return 'Chuyên môn';
}

export function parseExcelFile(fileData: ArrayBuffer, fileName: string): ProgramCurriculum {
  const workbook = XLSX.read(fileData, { type: 'array' });
  const sheets: Record<string, SheetData> = {};

  const level: ProgramLevel = fileName.toLowerCase().includes('trung cấp') || fileName.toLowerCase().includes('trung cap') 
    ? 'trung_cap' 
    : fileName.toLowerCase().includes('cao đẳng') || fileName.toLowerCase().includes('cao dang')
    ? 'cao_dang'
    : 'custom';

  for (const sheetName of workbook.SheetNames) {
    const worksheet = workbook.Sheets[sheetName];
    // Convert to json array of objects
    const jsonData = XLSX.utils.sheet_to_json<Record<string, any>>(worksheet, { defval: '' });

    if (!jsonData || jsonData.length === 0) continue;

    // Get all column headers
    const rawColumns = Object.keys(jsonData[0] || {}).map(c => c.trim());

    // Dynamically locate key columns by keywords (similar to Python script logic)
    const colCode = findColumnByKeywords(rawColumns, ['mã', 'stt', 'code', 'id']);
    const colName = findColumnByKeywords(rawColumns, ['tên môn', 'môn học', 'mô đun', 'tên mô đun', 'tên học phần', 'subject']);
    const colCredits = findColumnByKeywords(rawColumns, ['tín chỉ', 'stc', 'tc', 'credits']);
    const colHours = findColumnByKeywords(rawColumns, ['tổng số giờ', 'số giờ', 'giờ', 'hours', 'tổng số']);
    const colTheory = findColumnByKeywords(rawColumns, ['lý thuyết', 'lt', 'theory']);
    const colPractice = findColumnByKeywords(rawColumns, ['thực hành', 'th', 'btl', 'bài tập', 'practice']);
    const colExam = findColumnByKeywords(rawColumns, ['thi', 'kiểm tra', 'kt', 'exam']);
    const colSemester = findColumnByKeywords(rawColumns, ['học kỳ', 'hk', 'semester', 'kỳ']);
    const colBlock = findColumnByKeywords(rawColumns, ['khối kiến thức', 'khối', 'nhóm', 'loại']);
    const colStatus = findColumnByKeywords(rawColumns, ['trạng thái', 'tình trạng', 'tiến độ', 'đạt', 'status']);
    const colAuthor = findColumnByKeywords(rawColumns, ['người phụ trách', 'tác giả', 'biên soạn', 'giảng viên', 'phụ trách']);
    const colNotes = findColumnByKeywords(rawColumns, ['ghi chú', 'lưu ý', 'note']);

    const modules: CurriculumModule[] = [];

    jsonData.forEach((row, idx) => {
      const nameVal = colName ? String(row[colName] || '').trim() : '';
      if (!nameVal || nameVal.toLowerCase().includes('tổng cộng') || nameVal.toLowerCase().includes('cộng')) {
        return; // Skip total row or empty rows
      }

      const creditsNum = colCredits ? parseFloat(row[colCredits]) || 0 : 0;
      const hoursNum = colHours ? parseFloat(row[colHours]) || 0 : 0;
      const theoryNum = colTheory ? parseFloat(row[colTheory]) || 0 : 0;
      const practiceNum = colPractice ? parseFloat(row[colPractice]) || 0 : 0;
      const examNum = colExam ? parseFloat(row[colExam]) || 0 : 0;

      // Auto-calc missing total hours if theory & practice exist
      const computedTotalHours = hoursNum > 0 ? hoursNum : (theoryNum + practiceNum + examNum);

      const semVal = colSemester ? parseInt(String(row[colSemester]).replace(/\D/g, ''), 10) || 1 : 1;

      modules.push({
        id: `mod-${sheetName.replace(/\s+/g, '-')}-${idx + 1}`,
        code: colCode ? String(row[colCode] || `MĐ${idx + 1}`).trim() : `MĐ${idx + 1}`,
        name: nameVal,
        credits: creditsNum,
        totalHours: computedTotalHours,
        theoryHours: theoryNum,
        practiceHours: practiceNum,
        examHours: examNum,
        semester: semVal > 0 && semVal <= 8 ? semVal : 1,
        block: normalizeKnowledgeBlock(colBlock ? row[colBlock] : null, nameVal),
        status: normalizeStatus(colStatus ? row[colStatus] : null),
        author: colAuthor ? String(row[colAuthor] || '').trim() : undefined,
        notes: colNotes ? String(row[colNotes] || '').trim() : undefined,
        rawRowData: row
      });
    });

    sheets[sheetName] = {
      sheetName,
      modules,
      rawColumns
    };
  }

  const sheetKeys = Object.keys(sheets);
  const activeSheet = sheetKeys[0] || 'Sheet1';

  return {
    id: `custom-${Date.now()}`,
    name: fileName.replace(/\.[^/.]+$/, ''),
    level,
    fileName,
    sheets,
    activeSheet,
    updatedAt: new Date().toISOString()
  };
}

export function exportProgramToExcel(program: ProgramCurriculum): void {
  const wb = XLSX.utils.book_new();

  for (const sheetName in program.sheets) {
    const sheetData = program.sheets[sheetName];
    const exportRows = sheetData.modules.map(m => ({
      'Mã môn/Mô-đun': m.code,
      'Tên môn học/Mô-đun': m.name,
      'Số tín chỉ': m.credits,
      'Tổng số giờ': m.totalHours,
      'Lý thuyết': m.theoryHours,
      'Thực hành/Bài tập': m.practiceHours,
      'Thi/Kiểm tra': m.examHours,
      'Học kỳ': `Học kỳ ${m.semester}`,
      'Khối kiến thức': m.block,
      'Trạng thái': m.status,
      'Người phụ trách': m.author || '',
      'Ghi chú': m.notes || ''
    }));

    const ws = XLSX.utils.json_to_sheet(exportRows);
    XLSX.utils.book_append_sheet(wb, ws, sheetName.substring(0, 31));
  }

  XLSX.writeFile(wb, `${program.name.replace(/\s+/g, '_')}_Checklist.xlsx`);
}
