import React, { useState } from 'react';

const PdfToImage = () => {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    // Replace with your deployed AWS Lambda endpoint
    const response = await fetch('/api/convert', {
      method: 'POST',
      body: formData,
    });

    // Handle response (e.g., display images)
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="file" accept="application/pdf" onChange={handleFileChange} />
      <button type="submit">Convert to Image</button>
    </form>
  );
};

export default PdfToImage;