import React from 'react';
import { DownloadIcon, ClipboardCopyIcon, FontSizeIcon, PlusIcon, MinusIcon, FilePlusIcon, ShieldCheckIcon, RerunIcon, DictionaryIcon } from './icons/Icons';

interface ActionBarProps {
  onDownload: () => void;
  onCopy: () => void;
  onIncreaseFont: () => void;
  onDecreaseFont: () => void;
  onNewFile: () => void;
  onOpenWhitelist: () => void;
  onOpenAbbreviationModal: () => void;
  onRecheck: () => void;
}

const ActionButton: React.FC<{ onClick: () => void; children: React.ReactNode, title: string }> = ({ onClick, children, title }) => (
  <button
    title={title}
    onClick={onClick}
    className="flex items-center gap-2 px-3 py-2 bg-slate-700 hover:bg-sky-600 rounded-md transition-colors duration-200 text-sm font-medium text-slate-100"
  >
    {children}
  </button>
);

const ActionBar: React.FC<ActionBarProps> = ({ onDownload, onCopy, onIncreaseFont, onDecreaseFont, onNewFile, onOpenWhitelist, onOpenAbbreviationModal, onRecheck }) => {
  return (
    <div className="bg-slate-800 p-3 rounded-lg shadow-md mb-4 flex flex-wrap items-center justify-center gap-2 md:justify-between">
       <div className="flex flex-wrap items-center justify-center gap-2">
         <ActionButton onClick={onNewFile} title="Tải lên tệp mới">
            <FilePlusIcon />
            <span>Tệp mới</span>
         </ActionButton>
         <ActionButton onClick={onRecheck} title="Kiểm tra lại văn bản với các từ điển">
            <RerunIcon />
            <span>Sửa lại</span>
         </ActionButton>
         <ActionButton onClick={onDownload} title="Tải xuống tệp .docx đã sửa">
            <DownloadIcon />
            <span>Tải xuống</span>
         </ActionButton>
         <ActionButton onClick={onCopy} title="Sao chép văn bản đã sửa">
            <ClipboardCopyIcon />
            <span>Sao chép</span>
         </ActionButton>
         <ActionButton onClick={onOpenWhitelist} title="Quản lý Whitelist (Từ điển cá nhân)">
            <ShieldCheckIcon />
            <span>Whitelist</span>
         </ActionButton>
         <ActionButton onClick={onOpenAbbreviationModal} title="Quản lý từ điển viết tắt">
            <DictionaryIcon />
            <span>Viết tắt</span>
         </ActionButton>
       </div>
       <div className="flex items-center gap-2">
            <span className="flex items-center text-slate-400 mr-2"><FontSizeIcon /></span>
            <ActionButton onClick={onDecreaseFont} title="Giảm cỡ chữ">
                <MinusIcon />
            </ActionButton>
            <ActionButton onClick={onIncreaseFont} title="Tăng cỡ chữ">
                <PlusIcon />
            </ActionButton>
       </div>
    </div>
  );
};

export default ActionBar;