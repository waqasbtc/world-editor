import React, { useState } from 'react';

export default function MinecraftImportWizard() {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleImport = async () => {
    if (!file) {
      alert("Please select a .zip file first!");
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/import', {
        method: 'POST',
        body: formData
      });

      const result = await response.text();
      alert(result);
    } catch (error) {
      alert("Error uploading file!");
    }
  };

  return (
    <div>
      <h2>Minecraft Import Wizard</h2>
      <input type="file" accept=".zip" onChange={handleFileChange} />
      <button onClick={handleImport}>Import</button>
    </div>
  );
}