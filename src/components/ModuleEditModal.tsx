import React, { useState, useEffect } from 'react';
import { X, Save, Plus, AlertCircle } from 'lucide-react';
import { CurriculumModule, ModuleStatus, KnowledgeBlock } from '../types';

interface ModuleEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (module: CurriculumModule) => void;
  editingModule: CurriculumModule | null;
}

export const ModuleEditModal: React.FC<ModuleEditModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingModule
}) => {
  const [formData, setFormData] = useState<Partial<CurriculumModule>>({
    code: '',
    name: '',
    credits: 3,
    totalHours: 60,
    theoryHours: 20,
    practiceHours: 38,
    examHours: 2,
    semester: 1,
    block: 'Chuyên môn',
    status: 'Đang biên soạn',
    author: '',
    notes: ''
  });

  useEffect(() => {
    if (editingModule) {
      setFormData(editingModule);
    } else {
      setFormData({
        id: `mod-${Date.now()}`,
        code: `MĐ${Math.floor(Math.random() * 90) + 10}`,
        name: '',
        credits: 3,
        totalHours: 60,
        theoryHours: 20,
        practiceHours: 38,
        examHours: 2,
        semester: 1,
        block: 'Chuyên môn',
        status: 'Đang biên soạn',
        author: '',
        notes: ''
      });
    }
  }, [editingModule, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.code) return;

    onSave(formData as CurriculumModule);
    onClose();
  };

  const handleHourChange = (field: 'theoryHours' | 'practiceHours' | 'examHours', val: number) => {
    const newLT = field === 'theoryHours' ? val : (formData.theoryHours || 0);
    const newTH = field === 'practiceHours' ? val : (formData.practiceHours || 0);
    const newExam = field === 'examHours' ? val : (formData.examHours || 0);

    const autoTotal = newLT + newTH + newExam;

    setFormData(prev => ({
      ...prev,
      [field]: val,
      totalHours: autoTotal
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-xl w-full overflow-hidden my-8">
        
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <h3 className="text-sm font-bold flex items-center gap-2">
            {editingModule ? 'Chỉnh Sửa Mô-đun Đào Tạo' : 'Thêm Môn Học / Mô-đun Mới'}
          </h3>
          <button 
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-2xs font-semibold text-slate-700 uppercase mb-1">Mã Mô-đun *</label>
              <input
                type="text"
                required
                value={formData.code || ''}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                className="w-full px-3 py-1.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 font-mono font-bold"
                placeholder="MH01 / MĐ05"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-2xs font-semibold text-slate-700 uppercase mb-1">Tên Môn Học / Mô-đun *</label>
              <input
                type="text"
                required
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-1.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 font-semibold"
                placeholder="Nhập tên môn học..."
              />
            </div>
          </div>

          <div className="grid grid-cols-4 gap-3">
            <div>
              <label className="block text-2xs font-semibold text-slate-700 uppercase mb-1">Số Tín Chỉ</label>
              <input
                type="number"
                min="0"
                step="1"
                value={formData.credits || 0}
                onChange={(e) => setFormData({ ...formData, credits: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-1.5 border border-slate-300 rounded-lg font-bold text-slate-900"
              />
            </div>

            <div>
              <label className="block text-2xs font-semibold text-slate-700 uppercase mb-1">Lý Thuyết (g)</label>
              <input
                type="number"
                min="0"
                value={formData.theoryHours || 0}
                onChange={(e) => handleHourChange('theoryHours', parseInt(e.target.value, 10) || 0)}
                className="w-full px-3 py-1.5 border border-slate-300 rounded-lg font-semibold text-blue-700"
              />
            </div>

            <div>
              <label className="block text-2xs font-semibold text-slate-700 uppercase mb-1">Thực Hành (g)</label>
              <input
                type="number"
                min="0"
                value={formData.practiceHours || 0}
                onChange={(e) => handleHourChange('practiceHours', parseInt(e.target.value, 10) || 0)}
                className="w-full px-3 py-1.5 border border-slate-300 rounded-lg font-bold text-emerald-700"
              />
            </div>

            <div>
              <label className="block text-2xs font-semibold text-slate-700 uppercase mb-1">Thi / KT (g)</label>
              <input
                type="number"
                min="0"
                value={formData.examHours || 0}
                onChange={(e) => handleHourChange('examHours', parseInt(e.target.value, 10) || 0)}
                className="w-full px-3 py-1.5 border border-slate-300 rounded-lg font-semibold text-amber-700"
              />
            </div>
          </div>

          <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-2xs font-semibold text-slate-700">
            <span>Tự động tính Tổng Thời Lượng:</span>
            <span className="text-sm font-black text-slate-900">{formData.totalHours || 0} giờ</span>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-2xs font-semibold text-slate-700 uppercase mb-1">Học Kỳ</label>
              <select
                value={formData.semester || 1}
                onChange={(e) => setFormData({ ...formData, semester: parseInt(e.target.value, 10) || 1 })}
                className="w-full px-3 py-1.5 border border-slate-300 rounded-lg font-medium"
              >
                <option value={1}>Học kỳ 1</option>
                <option value={2}>Học kỳ 2</option>
                <option value={3}>Học kỳ 3</option>
                <option value={4}>Học kỳ 4</option>
                <option value={5}>Học kỳ 5</option>
                <option value={6}>Học kỳ 6</option>
              </select>
            </div>

            <div>
              <label className="block text-2xs font-semibold text-slate-700 uppercase mb-1">Khối Kiến Thức</label>
              <select
                value={formData.block || 'Chuyên môn'}
                onChange={(e) => setFormData({ ...formData, block: e.target.value as KnowledgeBlock })}
                className="w-full px-3 py-1.5 border border-slate-300 rounded-lg font-medium"
              >
                <option value="Môn học chung">Môn học chung</option>
                <option value="Cơ sở ngành">Cơ sở ngành</option>
                <option value="Chuyên môn">Chuyên môn</option>
                <option value="Thực tập / Tốt nghiệp">Thực tập / Tốt nghiệp</option>
                <option value="Tự chọn">Tự chọn</option>
              </select>
            </div>

            <div>
              <label className="block text-2xs font-semibold text-slate-700 uppercase mb-1">Trạng Thái Biên Soạn</label>
              <select
                value={formData.status || 'Đang biên soạn'}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as ModuleStatus })}
                className="w-full px-3 py-1.5 border border-slate-300 rounded-lg font-bold"
              >
                <option value="Đã hoàn thành">Đã hoàn thành</option>
                <option value="Đang biên soạn">Đang biên soạn</option>
                <option value="Cần nghiệm thu">Cần nghiệm thu</option>
                <option value="Cần chỉnh sửa">Cần chỉnh sửa</option>
                <option value="Chưa thực hiện">Chưa thực hiện</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-2xs font-semibold text-slate-700 uppercase mb-1">Người Phụ Trách / Tác Giả</label>
            <input
              type="text"
              value={formData.author || ''}
              onChange={(e) => setFormData({ ...formData, author: e.target.value })}
              className="w-full px-3 py-1.5 border border-slate-300 rounded-lg"
              placeholder="VD: TS. Nguyễn Văn A / Khoa CNTT"
            />
          </div>

          <div>
            <label className="block text-2xs font-semibold text-slate-700 uppercase mb-1">Ghi Chú</label>
            <textarea
              rows={2}
              value={formData.notes || ''}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-3 py-1.5 border border-slate-300 rounded-lg resize-none"
              placeholder="Nhập thông tin ghi chú giáo trình..."
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-bold inline-flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>{editingModule ? 'Lưu Thay Đổi' : 'Thêm Mới'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
