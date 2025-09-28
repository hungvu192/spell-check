
import React from 'react';
import { Change } from 'diff';

interface DiffViewerProps {
  originalText: string;
  correctedText: string;
  diff: Change[];
  fontSizeClass: string;
}

const DiffViewer: React.FC<DiffViewerProps> = ({ diff, fontSizeClass }) => {

  const renderDiff = (part: Change, type: 'original' | 'corrected') => {
    const isAdded = part.added;
    const isRemoved = part.removed;
    let style = 'opacity-70';
    
    if (type === 'original' && isRemoved) {
        style = 'bg-red-900/60 text-red-200';
    } else if (type === 'corrected' && isAdded) {
        style = 'bg-green-900/60 text-green-200';
    } else if (!isAdded && !isRemoved) {
        style = 'text-slate-300';
    }
    
    return <span className={`px-1 rounded transition-colors duration-300 ${style}`}>{part.value}</span>;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-grow mt-4">
      <div className="bg-slate-800/50 rounded-lg p-4 shadow-lg overflow-auto">
        <h2 className="text-xl font-semibold mb-3 pb-2 border-b border-slate-700 text-slate-200">Văn bản gốc</h2>
        <pre className={`whitespace-pre-wrap font-mono ${fontSizeClass} leading-relaxed`}>
          {diff.map((part, index) => !part.added && <React.Fragment key={index}>{renderDiff(part, 'original')}</React.Fragment>)}
        </pre>
      </div>
      <div className="bg-slate-800/50 rounded-lg p-4 shadow-lg overflow-auto">
        <h2 className="text-xl font-semibold mb-3 pb-2 border-b border-slate-700 text-slate-200">Văn bản đã sửa</h2>
        <pre className={`whitespace-pre-wrap font-mono ${fontSizeClass} leading-relaxed`}>
          {diff.map((part, index) => !part.removed && <React.Fragment key={index}>{renderDiff(part, 'corrected')}</React.Fragment>)}
        </pre>
      </div>
    </div>
  );
};

export default DiffViewer;
