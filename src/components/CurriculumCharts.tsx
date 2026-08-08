import React from 'react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip, 
  Legend, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid,
  LabelList
} from 'recharts';
import { CurriculumMetrics } from '../types';

interface CurriculumChartsProps {
  metrics: CurriculumMetrics;
}

const COLORS_HOURS = ['#3B82F6', '#10B981', '#F59E0B']; // Theory (Blue), Practice (Emerald), Exam (Amber)

const STATUS_COLORS: Record<string, string> = {
  'Đã hoàn thành': '#10B981', // Emerald
  'Đang biên soạn': '#3B82F6', // Blue
  'Cần chỉnh sửa': '#F59E0B', // Amber
  'Cần nghiệm thu': '#8B5CF6', // Purple
  'Chưa thực hiện': '#94A3B8'  // Slate
};

export const CurriculumCharts: React.FC<CurriculumChartsProps> = ({ metrics }) => {
  
  // Data for Theory vs Practice vs Exam Pie Chart
  const hourDistributionData = [
    { name: 'Lý thuyết (LT)', value: metrics.totalTheoryHours },
    { name: 'Thực hành / Bài tập (TH)', value: metrics.totalPracticeHours },
    { name: 'Thi / Kiểm tra', value: metrics.totalExamHours }
  ].filter(d => d.value > 0);

  // Data for Module Status Donut Chart
  const statusData = Object.entries(metrics.statusBreakdown)
    .map(([status, count]) => ({
      name: status,
      value: count as number,
      color: STATUS_COLORS[status] || '#64748B'
    }))
    .filter(d => d.value > 0);

  // Data for Semester Bar Chart
  const semesterData = Object.entries(metrics.semesterBreakdown)
    .map(([sem, data]) => {
      const d = data as { credits: number; hours: number; modulesCount: number };
      return {
        semester: `Học kỳ ${sem}`,
        credits: d.credits,
        hours: d.hours,
        count: d.modulesCount
      };
    })
    .filter(d => d.count > 0);

  // Data for Knowledge Block Bar Chart
  const blockData = Object.entries(metrics.blockBreakdown)
    .map(([block, data]) => {
      const d = data as { credits: number; hours: number; modulesCount: number };
      return {
        block,
        credits: d.credits,
        hours: d.hours,
        count: d.modulesCount
      };
    });

  return (
    <div className="space-y-6">
      
      {/* Row 1: Hour Split & Status Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart 1: Theory vs Practice Ratio */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Cơ Cấu Phân Bổ Giờ Giảng</h3>
              <p className="text-xs text-slate-500">Tỷ lệ giờ Lý thuyết vs Thực hành / Bài tập lớn</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-lg">
              Tỷ lệ TH: {metrics.practicalRatio.toFixed(1)}%
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={hourDistributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={4}
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {hourDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS_HOURS[index % COLORS_HOURS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(val: number) => [`${val} giờ`, 'Thời lượng']}
                  contentStyle={{ backgroundColor: '#0F172A', color: '#FFF', borderRadius: '8px', fontSize: '12px' }}
                />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Module Status Breakdown */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Trạng Thái Biên Soạn Giáo Trình</h3>
              <p className="text-xs text-slate-500">Thống kê tình trạng tiến độ các mô-đun</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg">
              Tổng: {metrics.totalModules} mô-đun
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`status-cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(val: number) => [`${val} môn/mô-đun`, 'Số lượng']}
                  contentStyle={{ backgroundColor: '#0F172A', color: '#FFF', borderRadius: '8px', fontSize: '12px' }}
                />
                <Legend verticalAlign="bottom" height={36} iconType="square" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Row 2: Semester Load & Knowledge Block Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart 3: Semester Credit & Hour Load */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Phân Bổ Tín Chỉ & Thời Lượng Theo Học Kỳ</h3>
              <p className="text-xs text-slate-500">Đánh giá độ nặng khối lượng học tập qua từng học kỳ</p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={semesterData} margin={{ top: 20, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="semester" tick={{ fontSize: 12, fill: '#475569' }} />
                <YAxis yAxisId="left" orientation="left" stroke="#3B82F6" tick={{ fontSize: 12 }} />
                <YAxis yAxisId="right" orientation="right" stroke="#10B981" tick={{ fontSize: 12 }} />
                <Tooltip contentStyle={{ backgroundColor: '#0F172A', color: '#FFF', borderRadius: '8px', fontSize: '12px' }} />
                <Legend verticalAlign="bottom" height={36} />
                <Bar yAxisId="left" dataKey="credits" name="Số tín chỉ" fill="#3B82F6" radius={[4, 4, 0, 0]}>
                  <LabelList dataKey="credits" position="top" style={{ fontSize: '11px', fill: '#1E40AF', fontWeight: 'bold' }} />
                </Bar>
                <Bar yAxisId="right" dataKey="hours" name="Tổng giờ" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Knowledge Block Split */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Phân Bổ Theo Khối Kiến Thức</h3>
              <p className="text-xs text-slate-500">Cơ cấu Môn chung, Cơ sở ngành, Chuyên môn & Thực tập</p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={blockData} margin={{ top: 10, right: 30, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E2E8F0" />
                <XAxis type="number" tick={{ fontSize: 12 }} />
                <YAxis dataKey="block" type="category" tick={{ fontSize: 11, fill: '#334155' }} width={110} />
                <Tooltip contentStyle={{ backgroundColor: '#0F172A', color: '#FFF', borderRadius: '8px', fontSize: '12px' }} />
                <Legend verticalAlign="bottom" height={36} />
                <Bar dataKey="credits" name="Số Tín Chỉ" fill="#8B5CF6" radius={[0, 4, 4, 0]}>
                  <LabelList dataKey="credits" position="right" style={{ fontSize: '11px', fill: '#6D28D9', fontWeight: 'bold' }} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
};
