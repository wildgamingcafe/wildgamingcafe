"use client";

import { useState } from 'react';
import { CldUploadWidget } from 'next-cloudinary';
import { ImageIcon, X, Check, Loader2 } from 'lucide-react';

interface MediaPickerModalProps {
  isOpen?: boolean;
  onSuccess: (url: string) => void;
  onClose: () => void;
  aspectRatio?: number;
}

export default function MediaPickerModal({ isOpen, onSuccess, onClose, aspectRatio }: MediaPickerModalProps) {
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  if (isOpen === false) return null;

  const handleClose = () => {
    setUploadedUrl(null);
    setErrorMsg(null);
    onClose();
  };
  
  // Base cropping options. Cloudinary handles the UI.
  const croppingOptions = aspectRatio ? {
    cropping: true,
    croppingAspectRatio: aspectRatio,
    showSkipCropButton: true,
    croppingShowDimensions: true,
  } : {
    cropping: true,
    showSkipCropButton: true,
    croppingShowDimensions: true,
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4">
      <div className="bg-surface-100 border border-border w-full max-w-lg rounded-xl shadow-2xl overflow-hidden relative">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-accent" />
            Upload Media
          </h2>
          <button type="button" onClick={(e) => { e.preventDefault(); handleClose(); }} className="p-2 z-10 text-text-secondary hover:text-white rounded-full hover:bg-white/10 transition-colors relative cursor-pointer">
            <X className="w-5 h-5 pointer-events-none" />
          </button>
        </div>

        <div className="p-8 text-center">
          {errorMsg && (
            <div className="bg-red-500/20 text-red-500 p-3 rounded mb-4 text-sm font-semibold">
              {errorMsg}
            </div>
          )}

          {uploadedUrl ? (
            <div className="flex flex-col items-center">
              <div className="w-full max-w-sm aspect-video relative rounded overflow-hidden border border-border mb-6 bg-black flex items-center justify-center">
                <img src={uploadedUrl} alt="Preview" className="max-w-full max-h-full object-contain" />
              </div>
              <p className="text-text-secondary mb-6">Review your image. Click confirm to finalize the upload.</p>
              <div className="flex gap-4">
                <button 
                  onClick={() => setUploadedUrl(null)} 
                  className="px-6 py-2 border border-border text-text-secondary hover:text-white rounded transition-colors uppercase font-bold text-sm"
                >
                  Upload Different Image
                </button>
                <button 
                  onClick={() => {
                    onSuccess(uploadedUrl);
                    setUploadedUrl(null);
                  }} 
                  className="flex items-center gap-2 bg-accent text-black px-6 py-2 rounded hover:bg-yellow-400 transition-colors uppercase font-bold text-sm"
                >
                  <Check className="w-4 h-4" /> Confirm & Save
                </button>
              </div>
            </div>
          ) : (
            <>
              <p className="text-text-secondary mb-6">
                Upload your image here. You will be prompted to crop and preview it before saving.
              </p>

          <CldUploadWidget 
            uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "ml_default"}
            options={{
              ...croppingOptions,
              clientAllowedFormats: ["jpg", "jpeg", "png", "webp", "avif", "mp4", "webm", "mov"],
              maxFileSize: 104857600, // 100MB
              theme: "minimal",
              multiple: false
            }}
            onSuccess={(result, { widget }) => {
              if (result?.info && typeof result.info === 'object' && 'secure_url' in result.info) {
                setUploadedUrl(result.info.secure_url as string);
                widget.close();
              }
            }}
            onError={(error) => {
              console.error("Cloudinary Error:", error);
              if (typeof error === 'string') setErrorMsg(error);
              else if (error && typeof error === 'object' && 'statusText' in error) setErrorMsg(String(error.statusText));
              else setErrorMsg("An error occurred during upload. Check file size limits.");
            }}
          >
            {({ open }) => {
              return (
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    open();
                  }}
                  className="bg-accent text-black font-bold uppercase tracking-wide px-8 py-3 rounded hover:bg-[#E0A300] transition-colors"
                >
                  Select & Crop Image
                </button>
              );
            }}
          </CldUploadWidget>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
