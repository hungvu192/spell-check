import React, { useState, useCallback, useEffect } from 'react';
import { Change } from 'diff';
import FileUpload from './components/FileUpload';
import DiffViewer from './components/DiffViewer';
import ActionBar from './components/ActionBar';
import WhitelistModal from './components/WhitelistModal';
import AbbreviationModal from './components/AbbreviationModal';
import { correctTextWithGemini } from './utils/geminiCorrector';
import { generateDocx } from './utils/docxGenerator';

const FONT_SIZES = ['text-sm', 'text-base', 'text-lg', 'text-xl'];

export default function App(): React.ReactElement {
  const [originalText, setOriginalText] = useState<string>('');
  const [correctedText, setCorrectedText] = useState<string>('');
  const [diff, setDiff] = useState<Change[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [fontSizeIndex, setFontSizeIndex] = useState<number>(1);
  
  const [whitelist, setWhitelist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('app_whitelist');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error("Failed to load whitelist from localStorage", error);
      return [];
    }
  });

  const [abbreviations, setAbbreviations] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem('app_abbreviations');
      return saved ? JSON.parse(saved) : {};
    } catch (error) {
      console.error("Failed to load abbreviations from localStorage", error);
      return {};
    }
  });

  const [isWhitelistModalOpen, setIsWhitelistModalOpen] = useState<boolean>(false);
  const [isAbbreviationModalOpen, setIsAbbreviationModalOpen] = useState<boolean>(false);

  useEffect(() => {
    try {
      localStorage.setItem('app_whitelist', JSON.stringify(whitelist));
    } catch (error) {
      console.error("Failed to save whitelist to localStorage", error);
    }
  }, [whitelist]);

  useEffect(() => {
    try {
      localStorage.setItem('app_abbreviations', JSON.stringify(abbreviations));
    } catch (error) {
      console.error("Failed to save abbreviations to localStorage", error);
    }
  }, [abbreviations]);

  const runCorrection = useCallback(async (text: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const corrected = await correctTextWithGemini(text, whitelist, abbreviations);
      const differences = window.Diff.diffWords(text, corrected);
      setCorrectedText(corrected);
      setDiff(differences);
    } catch (err) {
      console.error('Lỗi xử lý tệp:', err);
      const errorMessage = err instanceof Error ? err.message : 'Lỗi không xác định khi sửa văn bản.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [whitelist, abbreviations]);

  const processFile = useCallback(async (file: File) => {
    if (!file) return;

    if (!file.name.endsWith('.docx')) {
      setError('Vui lòng chỉ tải lên tệp .docx.');
      return;
    }
    
    setOriginalText('');
    setCorrectedText('');
    setDiff([]);
    setFileName(file.name.replace(/\.docx$/, ''));

    try {
      const arrayBuffer = await file.arrayBuffer();
      const result = await window.mammoth.extractRawText({ arrayBuffer });
      const original = result.value;
      setOriginalText(original);
      await runCorrection(original);
    } catch (err) {
       console.error('Lỗi đọc tệp:', err);
       setError('Không thể đọc tệp .docx. Tệp có thể bị hỏng.');
       setIsLoading(false);
    }
  }, [runCorrection]);
  
  const handleRecheck = useCallback(() => {
    if(originalText) {
      runCorrection(originalText);
    }
  }, [originalText, runCorrection]);

  const handleDownload = useCallback(() => {
    if (!correctedText) return;
    generateDocx(correctedText, `${fileName}_corrected.docx`);
  }, [correctedText, fileName]);
  
  const handleCopy = useCallback(() => {
    if (!correctedText) return;
    navigator.clipboard.writeText(correctedText).then(() => {
        alert('Đã sao chép vào clipboard!');
    }).catch(err => {
        console.error('Không thể sao chép: ', err);
        alert('Sao chép thất bại.');
    });
  }, [correctedText]);
  
  const handleAddWhitelistWord = (word: string) => {
    const trimmedWord = word.trim();
    if (trimmedWord && !whitelist.includes(trimmedWord)) {
      setWhitelist(prev => [...prev, trimmedWord]);
    }
  };

  const handleRemoveWhitelistWord = (wordToRemove: string) => {
    setWhitelist(prev => prev.filter(word => word !== wordToRemove));
  };
  
  const handleAddAbbreviation = (abbr: string, expansion: string) => {
    const trimmedAbbr = abbr.trim();
    const trimmedExpansion = expansion.trim();
    if (trimmedAbbr && trimmedExpansion) {
      setAbbreviations(prev => ({ ...prev, [trimmedAbbr]: trimmedExpansion }));
    }
  };

  const handleRemoveAbbreviation = (abbrToRemove: string) => {
    setAbbreviations(prev => {
      const newAbbrs = { ...prev };
      delete newAbbrs[abbrToRemove];
      return newAbbrs;
    });
  };

  const increaseFontSize = () => setFontSizeIndex(prev => Math.min(prev + 1, FONT_SIZES.length - 1));
  const decreaseFontSize = () => setFontSizeIndex(prev => Math.max(prev - 1, 0));
  
  const currentFontSizeClass = FONT_SIZES[fontSizeIndex];
  
  const resetApp = () => {
    setOriginalText('');
    setCorrectedText('');
    setDiff([]);
    setError(null);
  };

  return (
    <div className="min-h-screen flex flex-col p-4 sm:p-6 lg:p-8 bg-slate-900 text-slate-200 font-sans">
      <WhitelistModal 
        isOpen={isWhitelistModalOpen}
        onClose={() => setIsWhitelistModalOpen(false)}
        whitelist={whitelist}
        onAddWord={handleAddWhitelistWord}
        onRemoveWord={handleRemoveWhitelistWord}
      />
      <AbbreviationModal
        isOpen={isAbbreviationModalOpen}
        onClose={() => setIsAbbreviationModalOpen(false)}
        abbreviations={abbreviations}
        onAddAbbreviation={handleAddAbbreviation}
        onRemoveAbbreviation={handleRemoveAbbreviation}
      />
      <header className="text-center mb-6">
        <h1 className="text-4xl font-bold text-white">📝 Trình kiểm tra chính tả DOCX</h1>
        <p className="text-slate-400 mt-2">Tải lên tệp .docx để tự động sửa lỗi và xem so sánh.</p>
      </header>
      
      <main className="flex-grow flex flex-col">
        {originalText && !error && (
          <ActionBar
            onDownload={handleDownload}
            onCopy={handleCopy}
            onIncreaseFont={increaseFontSize}
            onDecreaseFont={decreaseFontSize}
            onNewFile={resetApp}
            onOpenWhitelist={() => setIsWhitelistModalOpen(true)}
            onOpenAbbreviationModal={() => setIsAbbreviationModalOpen(true)}
            onRecheck={handleRecheck}
          />
        )}

        {isLoading ? (
          <div className="flex-grow flex items-center justify-center">
            <div className="text-center">
                <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-sky-400 mx-auto"></div>
                <p className="mt-4 text-lg">AI đang kiểm tra chính tả...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex-grow flex items-center justify-center">
            <div className="bg-red-900/50 border border-red-500 text-red-300 px-4 py-3 rounded-lg text-center max-w-xl" role="alert">
                <strong className="font-bold text-lg">Đã xảy ra lỗi!</strong>
                <span className="block mt-2">{error}</span>
                <button 
                  onClick={resetApp} 
                  className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-md transition-colors"
                >
                  Thử lại với tệp khác
                </button>
            </div>
          </div>
        ) : originalText ? (
          <DiffViewer 
            originalText={originalText} 
            correctedText={correctedText} 
            diff={diff} 
            fontSizeClass={currentFontSizeClass}
          />
        ) : (
          <div className="flex-grow flex items-center justify-center">
            <FileUpload onFileSelect={processFile} />
          </div>
        )}
      </main>
      <footer className="text-center mt-8 text-slate-500 text-sm">
        <p>Sửa lỗi chính tả và ngữ pháp được hỗ trợ bởi Gemini.</p>
      </footer>
    </div>
  );
}