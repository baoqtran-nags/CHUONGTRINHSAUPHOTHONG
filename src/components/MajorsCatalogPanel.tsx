import React, { useState } from 'react';
import { 
  GraduationCap, 
  BookOpen, 
  Search, 
  Filter, 
  Award, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  Layers, 
  Laptop, 
  Building2, 
  ChevronRight,
  ChevronDown,
  Download,
  Zap,
  Info,
  X,
  FileSpreadsheet,
  ShieldCheck
} from 'lucide-react';
import { MajorInfo, MAJORS_LIST, convertMajorToProgram } from '../data/majorsList';
import { ProgramCurriculum, CurriculumModule } from '../types';

interface MajorsCatalogPanelProps {
  onSelectMajorToLoad: (program: ProgramCurriculum) => void;
  onSwitchToTab: (tab: 'checklist' | 'moet_2026' | 'lms_online' | 'analytics' | 'comparison' | 'ai_advisor') => void;
}

export const MajorsCatalogPanel: React.FC<MajorsCatalogPanelProps> = ({
  onSelectMajorToLoad,
  onSwitchToTab
}) => {
  const [selectedLevel, setSelectedLevel] = useState<'all' | 'cao_dang' | 'trung_cap'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedMajorDetail, setSelectedMajorDetail] = useState<MajorInfo | null>(MAJORS_LIST[0]);
  const [semesterFilter, setSemesterFilter] = useState<number | 'all'>('all');
  const [blockFilter, setBlockFilter] = useState<string>('all');
  const [moduleSearch, setModuleSearch] = useState<string>('');
  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);

  // Filtered Majors List
  const filteredMajors = MAJORS_LIST.filter(m => {
    const matchesLevel = selectedLevel === 'all' || m.level === selectedLevel;
    const matchesSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          m.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          m.department.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesLevel && matchesSearch;
  });

  // Action: Load major into system
  const handleLoadMajor = (major: MajorInfo) => {
    const program = convertMajorToProgram(major);
    onSelectMajorToLoad(program);
    setNotificationMsg(`Đã nạp thành công ngành "${major.name}" vào hệ thống để rà soát!`);
    setTimeout(() => setNotificationMsg(null), 4000);
  };

  const handleLoadAndNavigate = (major: MajorInfo, targetTab: 'checklist' | 'moet_2026' | 'lms_online') => {
    const program = convertMajorToProgram(major);
    onSelectMajorToLoad(program);
    onSwitchToTab(targetTab);
  };

  // Filtered modules for the currently viewed detail major
  const currentModules = selectedMajorDetail ? selectedMajorDetail.modules.filter(mod => {
    const matchesSem = semesterFilter === 'all' || mod.semester === semesterFilter;
    const matchesBlk = blockFilter === 'all' || mod.block === blockFilter;
    const matchesQ = mod.name.toLowerCase().includes(moduleSearch.toLowerCase()) ||
                     mod.code.toLowerCase().includes(moduleSearch.toLowerCase());
    return matchesSem && matchesBlk && matchesQ;
  }) : [];

  return (
    <div className="space-y-6">

      {/* Success Banner */}
      {notificationMsg && (
        <div className="p-3 bg-emerald-100 border border-emerald-300 text-emerald-950 rounded-lg text-xs font-semibold flex items-center justify-between shadow-xs animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
            <span>{notificationMsg}</span>
          </div>
          <button onClick={() => setNotificationMsg(null)} className="text-emerald-700 font-bold">✕</button>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-[#0F172A] text-white rounded-xl p-5 border border-slate-800 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[10px] font-bold uppercase tracking-wider rounded flex items-center gap-1">
                <GraduationCap className="w-3.5 h-3.5" /> Danh Mục Ngành Đào Tạo GDNN
              </span>
              <span className="px-2 py-0.5 bg-slate-800 text-slate-300 text-[10px] font-mono rounded">
                Chuẩn Khung Bộ LĐTBXH & Bộ GD&ĐT 2026
              </span>
            </div>
            <h2 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
              <span>Danh Sách Ngành Đào Tạo & Khung Chương Trình Chi Tiết</span>
            </h2>
            <p className="text-xs text-slate-300 max-w-2xl">
              Liệt kê đầy đủ các ngành đào tạo Trung cấp & Cao đẳng hiện có. Chọn bất kỳ ngành nào để xem danh sách các môn học/mô-đun theo từng học kỳ hoặc nạp vào hệ thống để rà soát chuẩn 2026.
            </p>
          </div>

          <div className="bg-[#1E293B] p-3.5 rounded-xl border border-slate-700 flex items-center gap-4 text-xs min-w-[220px]">
            <div className="w-10 h-10 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center font-bold text-blue-400 text-base">
              {MAJORS_LIST.length}
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Ngành Đào Tạo</p>
              <p className="font-bold text-white mt-0.5">
                {MAJORS_LIST.filter(m => m.level === 'cao_dang').length} Cao Đẳng • {MAJORS_LIST.filter(m => m.level === 'trung_cap').length} Trung Cấp
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Catalog List, Right Detailed Subjects View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        {/* LEFT COLUMN: Majors List Selector (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Filters & Search */}
          <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs space-y-3">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Tìm theo tên ngành, mã ngành hoặc khoa..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Level Selector Tabs */}
            <div className="flex items-center gap-1.5 text-2xs font-semibold">
              <button
                onClick={() => setSelectedLevel('all')}
                className={`flex-1 py-1.5 px-2 rounded-md transition-colors ${
                  selectedLevel === 'all'
                    ? 'bg-slate-900 text-white font-bold'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Tất cả ({MAJORS_LIST.length})
              </button>
              <button
                onClick={() => setSelectedLevel('cao_dang')}
                className={`flex-1 py-1.5 px-2 rounded-md transition-colors ${
                  selectedLevel === 'cao_dang'
                    ? 'bg-blue-600 text-white font-bold'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Cao Đẳng ({MAJORS_LIST.filter(m => m.level === 'cao_dang').length})
              </button>
              <button
                onClick={() => setSelectedLevel('trung_cap')}
                className={`flex-1 py-1.5 px-2 rounded-md transition-colors ${
                  selectedLevel === 'trung_cap'
                    ? 'bg-emerald-600 text-white font-bold'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Trung Cấp ({MAJORS_LIST.filter(m => m.level === 'trung_cap').length})
              </button>
            </div>
          </div>

          {/* Major Cards List */}
          <div className="space-y-2.5 max-h-[680px] overflow-y-auto pr-1">
            {filteredMajors.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-xl border border-slate-200 text-xs text-slate-500">
                Không tìm thấy ngành đào tạo nào phù hợp.
              </div>
            ) : (
              filteredMajors.map((major) => {
                const isSelected = selectedMajorDetail?.id === major.id;
                return (
                  <div
                    key={major.id}
                    onClick={() => setSelectedMajorDetail(major)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer text-xs space-y-2.5 relative ${
                      isSelected
                        ? 'bg-blue-50/90 border-blue-500 shadow-xs ring-1 ring-blue-500'
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-2xs'
                    }`}
                  >
                    {/* Header line */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-0.5">
                        <span className={`inline-block px-2 py-0.5 text-[10px] font-bold rounded ${
                          major.level === 'cao_dang'
                            ? 'bg-blue-100 text-blue-800 border border-blue-200'
                            : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        }`}>
                          Mã {major.code} • {major.levelText}
                        </span>
                        <h3 className="font-bold text-slate-900 text-xs leading-snug mt-1">
                          {major.name}
                        </h3>
                      </div>
                      
                      {isSelected && (
                        <span className="shrink-0 w-5 h-5 bg-blue-600 text-white rounded-full flex items-center justify-center text-[10px]">
                          ✓
                        </span>
                      )}
                    </div>

                    <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                      {major.description}
                    </p>

                    {/* Stats pill */}
                    <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-[11px] text-slate-600 font-medium">
                      <span className="flex items-center gap-1 font-mono">
                        <BookOpen className="w-3 h-3 text-slate-400" />
                        <strong>{major.modules.length}</strong> môn ({major.totalCredits} TC)
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <strong>{major.totalHours}g</strong> (Thực hành {major.practiceRatioPercentage}%)
                      </span>
                    </div>

                    {/* Action Bar */}
                    <div className="pt-1 flex items-center justify-between gap-2">
                      <span className="text-[10px] text-slate-400 italic">
                        {major.department}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLoadMajor(major);
                        }}
                        className="px-2.5 py-1 bg-slate-900 hover:bg-blue-600 text-white font-bold rounded text-[10px] transition-colors inline-flex items-center gap-1 shadow-2xs"
                      >
                        <Zap className="w-3 h-3 text-amber-300" />
                        <span>Nạp Vào Hệ Thống</span>
                      </button>
                    </div>

                  </div>
                );
              })
            )}
          </div>

        </div>

        {/* RIGHT COLUMN: Detailed Subjects Viewer (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
          
          {selectedMajorDetail ? (
            <div className="divide-y divide-slate-200">
              
              {/* Detail Header Banner */}
              <div className="p-5 bg-gradient-to-r from-slate-900 to-slate-800 text-white space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 bg-blue-500/20 text-blue-300 border border-blue-400/30 text-[10px] font-bold rounded uppercase">
                      {selectedMajorDetail.levelText} • Mã: {selectedMajorDetail.code}
                    </span>
                    <span className="px-2 py-0.5 bg-slate-700 text-slate-300 text-[10px] font-mono rounded">
                      {selectedMajorDetail.degreeText}
                    </span>
                  </div>

                  <span className="text-xs text-slate-300 font-semibold flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-blue-400" />
                    {selectedMajorDetail.durationText}
                  </span>
                </div>

                <div>
                  <h2 className="text-base font-bold text-white leading-tight">
                    {selectedMajorDetail.name}
                  </h2>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    {selectedMajorDetail.description}
                  </p>
                </div>

                {/* Major Metrics Summary Bar */}
                <div className="pt-2 grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                  <div className="p-2 bg-slate-800/80 rounded-lg border border-slate-700">
                    <p className="text-[10px] text-slate-400">Tổng Số Môn</p>
                    <p className="font-bold text-white text-sm mt-0.5">{selectedMajorDetail.modules.length} Môn</p>
                  </div>
                  <div className="p-2 bg-slate-800/80 rounded-lg border border-slate-700">
                    <p className="text-[10px] text-slate-400">Tổng Tín Chỉ</p>
                    <p className="font-bold text-white text-sm mt-0.5">{selectedMajorDetail.totalCredits} TC</p>
                  </div>
                  <div className="p-2 bg-slate-800/80 rounded-lg border border-slate-700">
                    <p className="text-[10px] text-slate-400">Tổng Số Giờ</p>
                    <p className="font-bold text-white text-sm mt-0.5">{selectedMajorDetail.totalHours} Giờ</p>
                  </div>
                  <div className="p-2 bg-slate-800/80 rounded-lg border border-slate-700">
                    <p className="text-[10px] text-slate-400">Tỷ Lệ Thực Hành</p>
                    <p className="font-bold text-emerald-400 text-sm mt-0.5">{selectedMajorDetail.practiceRatioPercentage}%</p>
                  </div>
                </div>

                {/* Action Toolbar */}
                <div className="pt-2 flex flex-wrap items-center justify-between gap-2">
                  <span className="text-2xs text-slate-400 font-mono">
                    Đơn vị đào tạo: {selectedMajorDetail.department}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleLoadAndNavigate(selectedMajorDetail, 'checklist')}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded transition-colors inline-flex items-center gap-1.5 shadow-2xs"
                    >
                      <Zap className="w-3.5 h-3.5 text-amber-300" />
                      <span>Rà Soát Ngành Này Trên Checklist</span>
                    </button>

                    <button
                      onClick={() => handleLoadAndNavigate(selectedMajorDetail, 'moet_2026')}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded transition-colors inline-flex items-center gap-1.5 shadow-2xs"
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Đối Soát Chuẩn 2026</span>
                    </button>
                  </div>
                </div>

              </div>

              {/* Subject Search & Filter Bar */}
              <div className="p-3 bg-slate-50 flex flex-wrap items-center justify-between gap-2 text-xs">
                
                <div className="relative flex-1 min-w-[180px]">
                  <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Tìm tên môn học/mô-đun..."
                    value={moduleSearch}
                    onChange={(e) => setModuleSearch(e.target.value)}
                    className="w-full pl-8 pr-2 py-1 text-xs bg-white border border-slate-300 rounded text-slate-800 focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                {/* Semester Selector */}
                <div className="flex items-center gap-1">
                  <span className="text-[11px] text-slate-500 font-medium">Học kỳ:</span>
                  <select
                    value={semesterFilter}
                    onChange={(e) => setSemesterFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                    className="py-1 px-2 text-xs bg-white border border-slate-300 rounded font-semibold text-slate-800"
                  >
                    <option value="all">Tất cả học kỳ</option>
                    <option value={1}>Học kỳ 1</option>
                    <option value={2}>Học kỳ 2</option>
                    <option value={3}>Học kỳ 3</option>
                    <option value={4}>Học kỳ 4</option>
                    <option value={5}>Học kỳ 5</option>
                    <option value={6}>Học kỳ 6</option>
                  </select>
                </div>

              </div>

              {/* Detailed Subjects Table */}
              <div className="overflow-x-auto max-h-[480px]">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-100 text-slate-700 font-semibold uppercase text-[10px] tracking-wider sticky top-0 z-10 border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3 w-10 text-center">HK</th>
                      <th className="py-2.5 px-3 w-20 font-mono">Mã Môn</th>
                      <th className="py-2.5 px-3">Tên Môn Học / Mô-đun</th>
                      <th className="py-2.5 px-2 text-center w-12">TC</th>
                      <th className="py-2.5 px-2 text-center w-20">Tổng Giờ</th>
                      <th className="py-2.5 px-3 text-center">Khối Kiến Thức</th>
                      <th className="py-2.5 px-3 text-center">Hình Thức LMS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-slate-800">
                    {currentModules.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-slate-400">
                          Không tìm thấy môn học nào phù hợp với bộ lọc.
                        </td>
                      </tr>
                    ) : (
                      currentModules.map((m) => (
                        <tr key={m.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-2.5 px-3 text-center font-bold text-blue-700 bg-blue-50/30">
                            HK{m.semester}
                          </td>

                          <td className="py-2.5 px-3 font-mono font-bold text-slate-900 text-2xs">
                            {m.code}
                          </td>

                          <td className="py-2.5 px-3">
                            <p className="font-semibold text-slate-900">{m.name}</p>
                            {m.notes && (
                              <p className="text-[10px] text-slate-500 italic mt-0.5">{m.notes}</p>
                            )}
                          </td>

                          <td className="py-2.5 px-2 text-center font-mono font-bold text-slate-800">
                            {m.credits}
                          </td>

                          <td className="py-2.5 px-2 text-center font-mono text-2xs">
                            <span className="font-bold">{m.totalHours}g</span>
                            <span className="block text-[9px] text-slate-400">{m.theoryHours}g LT / {m.practiceHours}g TH</span>
                          </td>

                          <td className="py-2.5 px-3 text-center">
                            <span className="inline-block px-2 py-0.5 text-[10px] font-medium bg-slate-100 text-slate-700 rounded border border-slate-200">
                              {m.block}
                            </span>
                          </td>

                          <td className="py-2.5 px-3 text-center">
                            {m.deliveryMode ? (
                              <span className={`inline-block px-2 py-0.5 text-[10px] font-bold rounded ${
                                m.deliveryMode === 'Online 100%'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : m.deliveryMode === 'Blended Learning'
                                  ? 'bg-indigo-100 text-indigo-800'
                                  : 'bg-slate-100 text-slate-700'
                              }`}>
                                {m.deliveryMode}
                              </span>
                            ) : (
                              <span className="text-slate-400 text-[10px]">-</span>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Footer info */}
              <div className="p-3 bg-slate-50 text-2xs text-slate-500 flex items-center justify-between">
                <span>Đang hiển thị <strong>{currentModules.length}</strong> môn học thuộc ngành {selectedMajorDetail.name}</span>
                <button
                  onClick={() => handleLoadMajor(selectedMajorDetail)}
                  className="text-blue-700 font-bold hover:underline"
                >
                  Nạp ngành này vào hệ thống chính →
                </button>
              </div>

            </div>
          ) : (
            <div className="p-12 text-center text-slate-400 text-xs">
              Vui lòng chọn một ngành đào tạo ở danh sách bên trái để xem chi tiết môn học.
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
