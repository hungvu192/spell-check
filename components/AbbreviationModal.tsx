import React, { useState } from 'react';

interface AbbreviationModalProps {
  isOpen: boolean;
  onClose: () => void;
  abbreviations: Record<string, string>;
  onAddAbbreviation: (abbr: string, expansion: string) => void;
  onRemoveAbbreviation: (abbr: string) => void;
}

const AbbreviationModal: React.FC<AbbreviationModalProps> = ({ isOpen, onClose, abbreviations, onAddAbbreviation, onRemoveAbbreviation }) => {
  const [newAbbr, setNewAbbr] = useState('');
  const [newExpansion, setNewExpansion] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (newAbbr.trim() && newExpansion.trim()) {
      onAddAbbreviation(newAbbr.trim(), newExpansion.trim());
      setNewAbbr('');
      setNewExpansion('');
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-slate-800 rounded-lg shadow-xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-slate-700">
          <h2 className="text-xl font-semibold text-white">Từ điển viết tắt</h2>
          <p className="text-sm text-slate-400 mt-1">AI sẽ thay thế các từ viết tắt bằng dạng đầy đủ của chúng.</p>
        </div>
        
        <div className="p-6 max-h-[40vh] overflow-y-auto">
          {Object.keys(abbreviations).length === 0 ? (
            <p className="text-slate-500 text-center py-4">Chưa có từ viết tắt nào.</p>
          ) : (
            <ul className="space-y-2">
              {Object.entries(abbreviations).map(([abbr, expansion]) => (
                <li key={abbr} className="flex justify-between items-center bg-slate-700/50 p-2 rounded-md">
                  <div>
                    <span className="font-bold text-sky-400">{abbr}</span>
                    <span className="text-slate-400 mx-2">→</span>
                    <span className="text-slate-200">{expansion}</span>
                  </div>
                  <button onClick={() => onRemoveAbbreviation(abbr)} className="text-red-400 hover:text-red-300 font-bold text-xl">&times;</button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="p-6 border-t border-slate-700">
          <form onSubmit={handleAdd} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-11 gap-2 items-end">
                <div className="sm:col-span-5">
                    <label htmlFor="abbr-input" className="block text-sm font-medium text-slate-300 mb-1">
                        Từ viết tắt
                    </label>
                    <input
                        id="abbr-input"
                        type="text"
                        value={newAbbr}
                        onChange={e => setNewAbbr(e.target.value)}
                        placeholder="VD: TP"
                        className="w-full bg-slate-900 border border-slate-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                </div>

                <div className="text-center text-slate-400 text-2xl pb-1 hidden sm:block font-sans">→</div>

                <div className="sm:col-span-5">
                    <label htmlFor="expansion-input" className="block text-sm font-medium text-slate-300 mb-1">
                        Dạng đầy đủ
                    </label>
                    <input
                        id="expansion-input"
                        type="text"
                        value={newExpansion}
                        onChange={e => setNewExpansion(e.target.value)}
                        placeholder="VD: thành phố"
                        className="w-full bg-slate-900 border border-slate-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                </div>
            </div>
            <button type="submit" className="w-full bg-sky-600 hover:bg-sky-500 text-white font-bold py-2 px-4 rounded-md transition-colors">Thêm</button>
          </form>
        </div>
        
        <div className="p-4 bg-slate-900/50 rounded-b-lg text-right">
             <button onClick={onClose} className="px-4 py-2 bg-slate-600 hover:bg-slate-500 text-white font-semibold rounded-md transition-colors">Đóng</button>
        </div>
      </div>
    </div>
  );
};

export default AbbreviationModal;