import React, { useState } from 'react';

interface WhitelistModalProps {
  isOpen: boolean;
  onClose: () => void;
  whitelist: string[];
  onAddWord: (word: string) => void;
  onRemoveWord: (word: string) => void;
}

const WhitelistModal: React.FC<WhitelistModalProps> = ({ isOpen, onClose, whitelist, onAddWord, onRemoveWord }) => {
  const [newWord, setNewWord] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (newWord.trim()) {
      onAddWord(newWord.trim());
      setNewWord('');
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-slate-800 rounded-lg shadow-xl w-full max-w-md" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-slate-700">
          <h2 className="text-xl font-semibold text-white">Whitelist (Từ điển cá nhân)</h2>
          <p className="text-sm text-slate-400 mt-1">AI sẽ không sửa các từ hoặc cụm từ trong danh sách này.</p>
        </div>
        
        <div className="p-6 max-h-[40vh] overflow-y-auto">
          {whitelist.length === 0 ? (
            <p className="text-slate-500 text-center py-4">Chưa có từ nào trong whitelist.</p>
          ) : (
            <ul className="space-y-2">
              {whitelist.map(word => (
                <li key={word} className="flex justify-between items-center bg-slate-700/50 p-2 rounded-md">
                  <span className="text-slate-200">{word}</span>
                  <button onClick={() => onRemoveWord(word)} className="text-red-400 hover:text-red-300 font-bold text-xl">&times;</button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="p-6 border-t border-slate-700">
          <form onSubmit={handleAdd} className="flex gap-2">
            <input
              type="text"
              value={newWord}
              onChange={e => setNewWord(e.target.value)}
              placeholder="Thêm từ hoặc cụm từ..."
              className="flex-grow bg-slate-900 border border-slate-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
            <button type="submit" className="bg-sky-600 hover:bg-sky-500 text-white font-bold py-2 px-4 rounded-md transition-colors">Thêm</button>
          </form>
        </div>
        
        <div className="p-4 bg-slate-900/50 rounded-b-lg text-right">
             <button onClick={onClose} className="px-4 py-2 bg-slate-600 hover:bg-slate-500 text-white font-semibold rounded-md transition-colors">Đóng</button>
        </div>
      </div>
    </div>
  );
};

export default WhitelistModal;
