'use client';
import { useState } from 'react';
import { FiSend, FiLoader } from 'react-icons/fi';
import { BsRobot, BsPerson, BsLightbulb } from 'react-icons/bs';

export default function ChatBox() {
    const [prompt, setPrompt] = useState('');
    const [response, setResponse] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!prompt.trim()) return;

        setLoading(true);
        setResponse('');

        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                body: JSON.stringify({ prompt }),
                headers: { 'Content-Type': 'application/json' },
            });

            const data = await res.json();

            if (!res.ok) {
                setResponse(data.error || 'حدث خطأ ما');
            } else {
                setResponse(data.response);
            }
        } catch (err) {
            console.error('خطأ:', err);
            setResponse("خطأ في الاتصال مع الخادم");
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e: any) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-4 h-full flex flex-col rounded-xl shadow-lg" dir="rtl">
            <h1 className="text-2xl font-bold text-center mb-6 text-blue-800 flex items-center justify-center gap-2">
                <BsRobot className="text-blue-600" /> مساعد الذكاء الاصطناعي
            </h1>

            <div className="flex-1 overflow-y-auto mb-4 space-y-4">
                {response ? (
                    <div className="flex gap-3">
                        <div className="flex-shrink-0 mt-1">
                            <BsRobot className="text-blue-600 text-2xl" />
                        </div>
                        <div className="bg-blue-100 rounded-xl p-4 text-blue-900 flex-1 border border-blue-200 shadow-sm text-right">
                            {response}
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-64 text-center p-6 bg-blue-50 rounded-xl border border-blue-100">
                        <BsLightbulb className="text-blue-400 text-4xl mb-3" />
                        <h2 className="text-xl font-semibold text-blue-800">كيف يمكنني مساعدتك؟</h2>
                        <p className="text-blue-600 mt-2">اطرح علي سؤالاً وسأبذل قصارى جهدي للإجابة عليه</p>
                    </div>
                )}
            </div>

            <div className="border-t border-blue-200 pt-4">
                <div className="relative">
                    <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="اكتب رسالتك هنا..."
                        className="w-full p-4 pr-12 border-2 border-blue-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-blue-900 bg-white resize-none placeholder-blue-400 text-right"
                        rows={3}
                        disabled={loading}
                    />
                    <button
                        onClick={handleSubmit}
                        disabled={loading || !prompt.trim()}
                        className={`absolute left-3 bottom-3 p-2 rounded-full ${loading || !prompt.trim() ? 'bg-gray-300 text-gray-500' : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md'} transition-all duration-200`}
                        aria-label="إرسال الرسالة"
                    >
                        {loading ? (
                            <FiLoader className="animate-spin text-lg" />
                        ) : (
                            <FiSend className="text-lg" />
                        )}
                    </button>
                </div>

                <div className="mt-3 text-sm text-blue-700 flex items-start gap-2 bg-blue-50 p-2 rounded-lg text-right">
                    <BsPerson className="text-blue-500 mt-0.5 flex-shrink-0" />
                    <span>قد تحتوي الإجابات على أخطاء. يرجى التحقق من المعلومات المهمة.</span>
                </div>
            </div>
        </div>
    );
}