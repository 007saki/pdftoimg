


'use client'
import React, { useState, useRef } from 'react';
import * as Progress from '@radix-ui/react-progress';
import * as Toast from '@radix-ui/react-toast';
import { Button } from '@radix-ui/themes';

const PdfToImage = () => {

  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [success, setSuccess] = useState(false);
  const [openToast, setOpenToast] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setSuccess(false);
    setImages([]);
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      setError(null);
      setSuccess(false);
      setImages([]);
    }
  };

  const handleAreaClick = () => {
    inputRef.current?.click();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    setLoading(true);
    setError(null);
    setSuccess(false);
    setImages([]);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/convert', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Conversion failed.');

      const data = await response.json();
      setImages(data.images || []);
      setSuccess(true);
      setOpenToast(true);
    } catch {
      setError('Something went wrong.');
      setOpenToast(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="w-full max-w-xl mx-auto p-8 bg-white/90 rounded-2xl shadow-2xl border border-gray-100">
        <h2 className="text-3xl font-extrabold mb-8 text-center text-indigo-700 tracking-tight">
          PDF to Image Converter
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div
            className={`transition-all border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer bg-gradient-to-tr from-indigo-50 to-white hover:from-indigo-100 ${
              dragActive ? 'border-indigo-400 bg-indigo-50' : 'border-gray-200'
            }`}
            onClick={handleAreaClick}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              ref={inputRef}
              id="pdf-upload"
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              disabled={loading}
              className="hidden"
            />
            <svg className="w-10 h-10 text-indigo-400 mb-2" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 16v-8m0 0l-3 3m3-3l3 3M20 16v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2" />
            </svg>
            <span className="text-indigo-700 font-medium">
              {file ? (
                <>
                  <span className="text-green-600">Selected:</span> {file.name}
                </>
              ) : (
                <>Drag & drop your PDF here, or <span className="underline">browse</span></>
              )}
            </span>
            <span className="text-xs text-gray-400 mt-1">Only PDF files are supported</span>
          </div>
          <Button
            type="submit"
            disabled={!file || loading}
            className="w-full mt-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-all shadow"
            size="3"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                </svg>
                Converting...
              </span>
            ) : (
              'Convert to Image'
            )}
          </Button>
          {loading && (
            <Progress.Root
              className="relative overflow-hidden bg-gray-200 rounded-full h-2 w-full mt-2"
              value={loading ? 50 : 100}
            >
              <Progress.Indicator
                className="bg-indigo-500 w-full h-full transition-all"
                style={{ width: loading ? '50%' : '100%' }}
              />
            </Progress.Root>
          )}
        </form>
        {error && (
          <div className="mt-6 text-red-600 text-sm text-center">{error}</div>
        )}
        {success && (
          <div className="mt-6 text-green-600 text-sm text-center">Conversion successful!</div>
        )}
        {images.length > 0 && (
          <div className="mt-10">
            <h4 className="font-semibold mb-4 text-indigo-700">Result Images:</h4>
            <div className="flex flex-wrap gap-4 justify-center">
              {images.map((img, idx) => (
                <div key={idx} className="relative group">
                  <img
                    src={img}
                    alt={`Page ${idx + 1}`}
                    className="max-w-[120px] border border-gray-300 rounded-lg shadow transition-transform group-hover:scale-105 cursor-pointer"
                  />
                  <span className="absolute bottom-1 right-2 bg-white/80 text-xs px-2 py-0.5 rounded text-gray-700 shadow">
                    Page {idx + 1}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
        <Toast.Provider swipeDirection="right">
          <Toast.Root open={openToast} onOpenChange={setOpenToast} className="bg-white border border-gray-200 rounded shadow px-4 py-2">
            <Toast.Title>
              {error ? 'Error' : 'Success'}
            </Toast.Title>
            <Toast.Description>
              {error ? error : 'PDF converted successfully!'}
            </Toast.Description>
          </Toast.Root>
          <Toast.Viewport className="fixed bottom-4 right-4 w-80 z-50" />
        </Toast.Provider>
      </div>
    </div>
  );
};

export default PdfToImage