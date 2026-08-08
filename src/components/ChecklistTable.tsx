import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  Edit2, 
  Trash2, 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  BookOpen, 
  User, 
  ArrowUpDown,
  MoreHorizontal
} from 'lucide-react';
import { CurriculumModule, ModuleStatus, KnowledgeBlock } from '../types';

interface ChecklistTableProps {
  modules: CurriculumModule[];
  onAddModule: () => void;
  onEditModule: (module: CurriculumModule) => void;
  onDeleteModule: (moduleId: string) => void;
  onQuickStatusChange: (moduleId: string, newStatus: ModuleStatus) => void;
}

export const ChecklistTable: React.FC<ChecklistTableProps> = ({
  modules,
  onAddModule,
  onEditModule,
  onDeleteModule,
  onQuickStatusChange
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [semesterFilter, setSemesterFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [blockFilter, setBlockFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<keyof CurriculumModule>('code');
  const [sortAsc, setSortAsc] = useState(true);

  // Filter & Search logic
  const filteredModules = useMemo(() => {
    return modules.filter(m => {
      const matchSearch = 
        m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (m.author && m.author.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchSemester = semesterFilter === 'all' || m.semester.toString() === semesterFilter;
      const matchStatus = statusFilter === 'all' || m.status === statusFilter;
      const matchBlock = blockFilter === 'all' || m.block === blockFilter;

      return matchSearch && matchSemester && matchStatus && matchBlock;
    }).sort((a, b) => {
      const valA = a[sortField] ?? '';
      const valB = b[sortField] ?? '';
      if (valA < valB) return sortAsc ? -1 : 1;
      if (valA > valB) return sortAsc ? 1 : -1;
      return 0;
    });
  }, [modules, searchTerm, semesterFilter, statusFilter, blockFilter, sortField, sortAsc]);

  // Aggregates for filtered list
  const filteredCredits = filteredModules.reduce((sum, m) => sum + m.credits, 0);
  const filteredHours = filteredModules.reduce((sum, m) => sum + m.totalHours, 0);

  const toggleSort = (field: keyof CurriculumModule) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const getStatusBadge = (status: ModuleStatus) => {
    switch (status) {
      case 'Đã hoàn thành':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Đang biên soạn':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Cần chỉnh sửa':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Cần nghiệm thu':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Chưa thực hiện':
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getBlockBadge = (block: KnowledgeBlock) => {
    switch (block) {
      case 'Môn học chung':
        return 'bg-slate-100 text-slate-800 border-slate-200';
      case 'Cơ sở ngành':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'Chuyên môn':
        return 'bg-teal-50 text-teal-800 border-teal-200';
      case 'Thực tập / Tốt nghiệp':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-50 text-slate-600 border-slate-200';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
      
      {/* Table Toolbar */}
      <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
        
        {/* Search Field */}
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm theo tên môn, mã MĐ, giảng viên..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-slate-800 placeholder-slate-400 shadow-2xs"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center flex-wrap gap-2 text-xs">
          
          {/* Semester Filter */}
          <select
            value={semesterFilter}
            onChange={(e) => setSemesterFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-700 focus:ring-emerald-500 shadow-2xs"
          >
            <option value="all">Tất cả học kỳ</option>
            <option value="1">Học kỳ 1</option>
            <option value="2">Học kỳ 2</option>
            <option value="3">Học kỳ 3</option>
            <option value="4">Học kỳ 4</option>
            <option value="5">Học kỳ 5</option>
            <option value="6">Học kỳ 6</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-700 focus:ring-emerald-500 shadow-2xs"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="Đã hoàn thành">Đã hoàn thành</option>
            <option value="Đang biên soạn">Đang biên soạn</option>
            <option value="Cần nghiệm thu">Cần nghiệm thu</option>
            <option value="Cần chỉnh sửa">Cần chỉnh sửa</option>
            <option value="Chưa thực hiện">Chưa thực hiện</option>
          </select>

          {/* Knowledge Block Filter */}
          <select
            value={blockFilter}
            onChange={(e) => setBlockFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-700 focus:ring-emerald-500 shadow-2xs"
          >
            <option value="all">Tất cả khối kiến thức</option>
            <option value="Môn học chung">Môn học chung</option>
            <option value="Cơ sở ngành">Cơ sở ngành</option>
            <option value="Chuyên môn">Chuyên môn</option>
            <option value="Thực tập / Tốt nghiệp">Thực tập / Tốt nghiệp</option>
            <option value="Tự chọn">Tự chọn</option>
          </select>

          {/* Add Module Button */}
          <button
            onClick={onAddModule}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Thêm Mô-đun</span>
          </button>
        </div>

      </div>

      {/* Main Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-700 font-semibold uppercase tracking-wider">
              <th className="py-3 px-3 w-12 text-center">STT</th>
              <th 
                className="py-3 px-3 cursor-pointer hover:bg-slate-200/50"
                onClick={() => toggleSort('code')}
              >
                <div className="flex items-center gap-1">
                  <span>Mã MĐ</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th 
                className="py-3 px-3 cursor-pointer hover:bg-slate-200/50 min-w-[200px]"
                onClick={() => toggleSort('name')}
              >
                <div className="flex items-center gap-1">
                  <span>Tên Môn Học / Mô-đun</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th className="py-3 px-2 text-center w-16">Tín Chỉ</th>
              <th className="py-3 px-2 text-center w-20">Tổng Giờ</th>
              <th className="py-3 px-3 text-center">Phân Bổ Giờ (LT / TH / Thi)</th>
              <th className="py-3 px-2 text-center w-20">Học Kỳ</th>
              <th className="py-3 px-3">Khối Kiến Thức</th>
              <th className="py-3 px-3">Trạng Thái</th>
              <th className="py-3 px-3">Người Phụ Trách</th>
              <th className="py-3 px-3 text-right">Thao Tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-slate-800">
            {filteredModules.length === 0 ? (
              <tr>
                <td colSpan={11} className="py-12 text-center text-slate-500">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <AlertCircle className="w-8 h-8 text-slate-400" />
                    <p className="font-medium text-slate-600">Không tìm thấy môn/mô-đun nào phù hợp với bộ lọc.</p>
                    <p className="text-2xs text-slate-400">Thử thay đổi từ khóa tìm kiếm hoặc làm mới bộ lọc.</p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredModules.map((m, idx) => {
                const hourMismatch = m.totalHours > 0 && Math.abs((m.theoryHours + m.practiceHours + m.examHours) - m.totalHours) > 1 && (m.theoryHours > 0 || m.practiceHours > 0);
                const practicalPercent = m.totalHours > 0 ? Math.round((m.practiceHours / m.totalHours) * 100) : 0;

                return (
                  <tr key={m.id} className="hover:bg-slate-50/80 transition-colors group">
                    
                    {/* Index */}
                    <td className="py-2.5 px-3 text-center font-mono text-slate-400 font-medium">
                      {idx + 1}
                    </td>

                    {/* Code */}
                    <td className="py-2.5 px-3 font-mono font-bold text-slate-900">
                      {m.code}
                    </td>

                    {/* Module Name */}
                    <td className="py-2.5 px-3 font-medium text-slate-900">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-semibold text-slate-900">{m.name}</span>
                          {m.deliveryMode && (
                            <span className={`px-1.5 py-0.2 text-[10px] font-bold rounded ${
                              m.deliveryMode === 'Online 100%' 
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                                : m.deliveryMode === 'Blended Learning'
                                ? 'bg-indigo-100 text-indigo-800 border border-indigo-200'
                                : 'bg-slate-100 text-slate-700 border border-slate-200'
                            }`}>
                              {m.deliveryMode}
                            </span>
                          )}
                        </div>
                        {m.notes && (
                          <span className="text-2xs text-slate-500 italic mt-0.5 line-clamp-1">{m.notes}</span>
                        )}
                        {hourMismatch && (
                          <span className="inline-flex items-center gap-1 text-2xs text-amber-700 font-semibold mt-0.5">
                            <AlertCircle className="w-3 h-3 text-amber-500" /> Sai lệch tổng giờ (LT+TH+Thi ≠ {m.totalHours}g)
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Credits */}
                    <td className="py-2.5 px-2 text-center">
                      <span className="inline-block px-2 py-0.5 font-bold text-slate-900 bg-slate-100 rounded">
                        {m.credits}
                      </span>
                    </td>

                    {/* Total Hours */}
                    <td className="py-2.5 px-2 text-center font-mono font-semibold text-slate-800">
                      {m.totalHours}g
                    </td>

                    {/* LT / TH / Exam Split */}
                    <td className="py-2.5 px-3 text-center">
                      <div className="flex items-center justify-center gap-1.5 font-mono text-2xs">
                        <span className="px-1.5 py-0.5 bg-blue-50 text-blue-700 rounded font-medium" title="Lý thuyết">
                          LT: {m.theoryHours}
                        </span>
                        <span className="px-1.5 py-0.5 bg-emerald-50 text-emerald-800 rounded font-bold" title="Thực hành">
                          TH: {m.practiceHours} ({practicalPercent}%)
                        </span>
                        {m.examHours > 0 && (
                          <span className="px-1.5 py-0.5 bg-amber-50 text-amber-800 rounded" title="Thi">
                            Thi: {m.examHours}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Semester */}
                    <td className="py-2.5 px-2 text-center">
                      <span className="px-2 py-0.5 text-2xs font-bold rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                        HK {m.semester}
                      </span>
                    </td>

                    {/* Knowledge Block */}
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <span className={`px-2 py-0.5 text-2xs font-semibold rounded-md border ${getBlockBadge(m.block)}`}>
                        {m.block}
                      </span>
                    </td>

                    {/* Status Dropdown */}
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <select
                        value={m.status}
                        onChange={(e) => onQuickStatusChange(m.id, e.target.value as ModuleStatus)}
                        className={`text-2xs font-bold px-2 py-1 rounded-lg border focus:ring-1 focus:ring-emerald-500 cursor-pointer ${getStatusBadge(m.status)}`}
                      >
                        <option value="Đã hoàn thành">Đã hoàn thành</option>
                        <option value="Đang biên soạn">Đang biên soạn</option>
                        <option value="Cần nghiệm thu">Cần nghiệm thu</option>
                        <option value="Cần chỉnh sửa">Cần chỉnh sửa</option>
                        <option value="Chưa thực hiện">Chưa thực hiện</option>
                      </select>
                    </td>

                    {/* Author */}
                    <td className="py-2.5 px-3 text-slate-600 truncate max-w-[140px]">
                      {m.author ? (
                        <span className="flex items-center gap-1 text-2xs text-slate-700 font-medium">
                          <User className="w-3 h-3 text-slate-400" /> {m.author}
                        </span>
                      ) : (
                        <span className="text-2xs text-slate-400 italic">Chưa phân công</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-2.5 px-3 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1 opacity-90 group-hover:opacity-100">
                        <button
                          onClick={() => onEditModule(m)}
                          className="p-1 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          title="Sửa môn học"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteModule(m.id)}
                          className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Xóa môn học"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>

                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Table Footer Summary Bar */}
      <div className="p-3 bg-slate-100/90 border-t border-slate-200 text-xs font-semibold text-slate-700 flex flex-wrap items-center justify-between gap-4">
        <div>
          <span>Hiển thị: </span>
          <span className="text-emerald-700 font-bold">{filteredModules.length}</span> / {modules.length} mô-đun
        </div>
        <div className="flex items-center gap-4">
          <div>
            <span>Tổng tín chỉ chọn: </span>
            <span className="text-blue-700 font-bold">{filteredCredits} TC</span>
          </div>
          <div>
            <span>Tổng thời lượng: </span>
            <span className="text-emerald-700 font-bold">{filteredHours} giờ</span>
          </div>
        </div>
      </div>

    </div>
  );
};
