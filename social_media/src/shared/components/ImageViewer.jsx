// src/components/ImageViewer.jsx
import { useEffect } from 'react';
import { createPortal } from 'react-dom';

export default function ImageViewer({ src, onClose }) {
    // Đóng khi nhấn phím ESC
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    // Portal đưa nội dung ra ngoài root, gắn trực tiếp vào body
    return createPortal(
        <div 
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-sm animate-fade-in"
            onClick={onClose} // Click ra ngoài để đóng
        >
            {/* Nút đóng */}
            <button 
                className="absolute top-4 right-4 p-2 text-white hover:text-gray-300 transition-colors"
                onClick={onClose}
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>

            {/* Ảnh full màn hình */}
            <img 
                src={src} 
                alt="Full screen" 
                className="max-h-[90vh] max-w-[90vw] object-contain rounded-md shadow-2xl"
                onClick={(e) => e.stopPropagation()} // Ngăn click vào ảnh thì bị đóng modal
            />
        </div>,
        document.body
    );
}