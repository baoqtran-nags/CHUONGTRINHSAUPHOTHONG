import React, { useState } from 'react';
import { Sparkles, Send, Copy, Check, Bot, AlertCircle, RefreshCw, BookOpen } from 'lucide-react';
import { ProgramCurriculum, CurriculumMetrics, SheetData } from '../types';

interface AiCurriculumAdvisorProps {
  program: ProgramCurriculum;
  metrics: CurriculumMetrics;
}

export const AiCurriculumAdvisor: React.FC<AiCurriculumAdvisorProps> = ({
  program,
  metrics
}) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const presetQueries = [
    'Đánh giá tính cân đối giữa lý thuyết và thực hành theo chuẩn GDNN.',
    'Gợi ý bổ sung môn học công nghệ mới (AI, Cloud, IoT) cho học kỳ 3-4.',
    'Đề xuất phân bổ lại số tín chỉ các học kỳ để tránh quá tải.',
    'Kiểm tra tiến độ biên soạn giáo trình và nhắc nhở môn còn thiếu tác giả.'
  ];

  const handleAskAi = async (customText?: string) => {
    const textToSend = customText || query || presetQueries[0];
    setLoading(true);
    setError(null);

    try {
      // Get sample of modules across sheets
      const allModules = (Object.values(program.sheets) as SheetData[]).flatMap(s => s.modules);

      const response = await fetch('/api/curriculum-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          programName: program.name,
          level: program.level,
          metrics,
          modulesSample: allModules.map(m => ({
            code: m.code,
            name: m.name,
            credits: m.credits,
            hours: m.totalHours,
            theory: m.theoryHours,
            practice: m.practiceHours,
            semester: m.semester,
            block: m.block,
            status: m.status
          })),
          userQuery: textToSend
        })
      });

      const data = await response.json();

      if (data.success && data.text) {
        setResult(data.text);
      } else {
        setError(data.error || 'Không thể tạo phản hồi từ Gemini AI. Vui lòng thử lại.');
      }
    } catch (err: any) {
      setError('Lỗi kết nối máy chủ backend. Vui lòng kiểm tra lại dịch vụ Gemini API.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (result) {
      navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-indigo-100 shadow-2xs overflow-hidden space-y-6 p-6">
      
      {/* Header Banner */}
      <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-5">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-600 text-white rounded-2xl shadow-xs">
            <Sparkles className="w-6 h-6 text-amber-300" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight">Trợ Lý Thẩm Định Khung Chương Trình Gemini AI</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Đánh giá tự động tính hợp lý, cân đối tín chỉ và chuẩn đầu ra theo Bộ Luật Giáo Dục Nghề Nghiệp.
            </p>
          </div>
        </div>

        <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-2xs font-bold rounded-full border border-indigo-200">
          Powered by Gemini 2.5 Flash
        </span>
      </div>

      {/* Preset Query Chips */}
      <div className="space-y-2">
        <span className="text-2xs font-bold text-slate-500 uppercase tracking-wider block">Gợi ý câu hỏi kiểm định nhanh:</span>
        <div className="flex flex-wrap gap-2">
          {presetQueries.map((q, idx) => (
            <button
              key={idx}
              onClick={() => {
                setQuery(q);
                handleAskAi(q);
              }}
              disabled={loading}
              className="px-3 py-1.5 text-xs font-medium bg-slate-50 text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 border border-slate-200 rounded-xl transition-all text-left shadow-2xs disabled:opacity-50"
            >
              💡 {q}
            </button>
          ))}
        </div>
      </div>

      {/* Input Box */}
      <div className="space-y-2">
        <div className="relative">
          <textarea
            rows={3}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Nhập yêu cầu tư vấn cụ thể (VD: 'Hãy phân tích số giờ thực hành môn Mạng máy tính xem đã đạt chuẩn kỹ năng chưa...')"
            className="w-full p-3 pr-24 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-800 placeholder-slate-400"
          />
          <button
            onClick={() => handleAskAi()}
            disabled={loading || (!query.trim() && !result)}
            className="absolute right-3 bottom-3 px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-lg hover:bg-indigo-700 transition-colors inline-flex items-center gap-1.5 disabled:opacity-50"
          >
            {loading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            <span>{loading ? 'Đang Phân Tích...' : 'Gửi AI'}</span>
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-800 text-xs flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Result Output Area */}
      {result && (
        <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3 relative">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <div className="flex items-center gap-2 font-bold text-indigo-900 text-xs">
              <Bot className="w-4 h-4 text-indigo-600" />
              <span>Kết Quả Thẩm Định Của Gemini AI</span>
            </div>

            <button
              onClick={handleCopy}
              className="px-2.5 py-1 bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 rounded-lg text-2xs font-semibold inline-flex items-center gap-1 shadow-2xs"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Đã Sao Chép' : 'Sao Chép'}</span>
            </button>
          </div>

          <div className="text-xs text-slate-800 leading-relaxed whitespace-pre-wrap font-sans">
            {result}
          </div>
        </div>
      )}

    </div>
  );
};
