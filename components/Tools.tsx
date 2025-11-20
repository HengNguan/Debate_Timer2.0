
import React, { useState } from 'react';
import { generateDebateTopics, generateTeamMascot } from '../services/geminiService';
import { AspectRatio, DebateTopic } from '../types';
import { Button } from './Button';
import { Sparkles, Image as ImageIcon, Loader2, RefreshCw, Download } from 'lucide-react';

export const Tools: React.FC = () => {
  // Topic State
  const [topicContext, setTopicContext] = useState('');
  const [topics, setTopics] = useState<DebateTopic[]>([]);
  const [isTopicLoading, setIsTopicLoading] = useState(false);

  // Image State
  const [imagePrompt, setImagePrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>(AspectRatio.SQUARE);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isImageLoading, setIsImageLoading] = useState(false);

  const handleTopicGen = async () => {
    if (!topicContext.trim()) return;
    setIsTopicLoading(true);
    try {
      const results = await generateDebateTopics(topicContext);
      setTopics(results);
    } catch (e) {
      alert("生成辩题失败。请检查 API Key。");
    } finally {
      setIsTopicLoading(false);
    }
  };

  const handleImageGen = async () => {
    if (!imagePrompt.trim()) return;
    setIsImageLoading(true);
    try {
      const url = await generateTeamMascot(imagePrompt, aspectRatio);
      setGeneratedImage(url);
    } catch (e) {
      alert("生成图片失败。请检查 API Key。");
    } finally {
      setIsImageLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-4 md:p-8 max-w-7xl mx-auto w-full">
      
      {/* Topic Generator Section */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 flex flex-col shadow-xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-purple-500/10 rounded-lg">
             <Sparkles className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">辩题生成器</h2>
            <p className="text-slate-400 text-sm">由 Gemini 2.5 Flash 驱动</p>
          </div>
        </div>

        <div className="space-y-4 flex-1">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">主题范围</label>
            <div className="flex gap-2">
              <input 
                type="text" 
                value={topicContext}
                onChange={(e) => setTopicContext(e.target.value)}
                placeholder="例如：人工智能、经济、体育..."
                className="flex-1 bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-purple-500 outline-none"
                onKeyDown={(e) => e.key === 'Enter' && handleTopicGen()}
              />
              <Button onClick={handleTopicGen} disabled={isTopicLoading || !topicContext}>
                {isTopicLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : '生成'}
              </Button>
            </div>
          </div>

          <div className="space-y-3 mt-4">
            {topics.length > 0 ? (
              topics.map((t) => (
                <div key={t.id} className="bg-slate-900 p-4 rounded-lg border border-slate-700 hover:border-purple-500/50 transition-colors">
                  <div className="text-xs font-bold text-purple-400 uppercase tracking-wider mb-1">{t.category}</div>
                  <div className="text-slate-200 font-medium">"{t.topic}"</div>
                </div>
              ))
            ) : (
              <div className="h-48 flex items-center justify-center text-slate-500 border-2 border-dashed border-slate-700 rounded-xl">
                输入主题以查看辩题
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Image Generator Section */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 flex flex-col shadow-xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-pink-500/10 rounded-lg">
             <ImageIcon className="w-6 h-6 text-pink-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">吉祥物生成器</h2>
            <p className="text-slate-400 text-sm">由 Imagen 3 驱动</p>
          </div>
        </div>

        <div className="space-y-4 flex-1">
          <div>
             <label className="block text-sm font-medium text-slate-300 mb-1">队伍名称 / 概念</label>
             <textarea 
               value={imagePrompt}
               onChange={(e) => setImagePrompt(e.target.value)}
               placeholder="例如：一只聪明的猫头鹰站在讲台上与机器人辩论..."
               className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-pink-500 outline-none h-24 resize-none"
             />
          </div>

          <div>
             <label className="block text-sm font-medium text-slate-300 mb-1">长宽比</label>
             <select 
               value={aspectRatio}
               onChange={(e) => setAspectRatio(e.target.value as AspectRatio)}
               className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-pink-500 outline-none"
             >
               <option value={AspectRatio.SQUARE}>正方形 (1:1)</option>
               <option value={AspectRatio.LANDSCAPE}>横屏 (4:3)</option>
               <option value={AspectRatio.PORTRAIT}>竖屏 (3:4)</option>
               <option value={AspectRatio.WIDE}>宽屏 (16:9)</option>
               <option value={AspectRatio.TALL}>快拍 (9:16)</option>
             </select>
          </div>

          <Button 
            onClick={handleImageGen} 
            disabled={isImageLoading || !imagePrompt}
            className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 border-none"
          >
             {isImageLoading ? (
               <><Loader2 className="w-5 h-5 animate-spin mr-2" /> 正在创作...</>
             ) : (
               <><RefreshCw className="w-5 h-5 mr-2" /> 生成吉祥物</>
             )}
          </Button>

          <div className="mt-4 bg-slate-900 rounded-xl overflow-hidden border border-slate-700 min-h-[200px] flex items-center justify-center relative group">
            {generatedImage ? (
              <>
                <img src={generatedImage} alt="Generated Mascot" className="w-full h-full object-contain max-h-[300px]" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <a href={generatedImage} download="mascot.png" className="bg-white text-slate-900 px-4 py-2 rounded-full font-bold flex items-center">
                    <Download className="w-4 h-4 mr-2" /> 下载
                  </a>
                </div>
              </>
            ) : (
              <div className="text-slate-500 text-sm">生成的图片将显示在这里</div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
};