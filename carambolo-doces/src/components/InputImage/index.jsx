import React, { useState } from "react";
import { FaFileAlt } from "react-icons/fa";

const InputImage = () => {
  const [files, setFiles] = useState([]);

  const handleImageChange = (event) => {
    const newFiles = Array.from(event.target.files);
    const newFilesWithPreview = newFiles.map((file) => ({
      name: file.name,
      preview: URL.createObjectURL(file),
    }));

    setFiles((prev) => [...prev, ...newFilesWithPreview]);
  };

  return (
    <div className="mb-4">
      <h2 className="font-semibold tracking-wider text-lg text-blue">REFERÊNCIAS</h2>
      <span className="text-blue text-sm">Insira no campo abaixo imagens de referência de como você quer o seu Carambolo</span>
      <input
        type="file"
        id="file-upload"
        className="hidden"
        accept=".png, .jpeg"
        multiple
        onChange={handleImageChange}
      />
      <label
        htmlFor="file-upload"
        className="block border-2 border-gold rounded-lg p-4 w-full mt-2 h-auto text-center cursor-pointer bg-white"
        style={{ width: '100%', minHeight: '8rem' }}
      >
        {files.length === 0 ? (
          <span className="flex items-center gap-2 pt-4 flex-col font-bold text-gold">
            <FaFileAlt className="text-4xl"/>
            Clique aqui para adicionar imagem(s).
          </span>
        ) : (
          <div className="flex gap-4 flex-wrap">
            {files.map((file, index) => (
              <div key={index} className="text-center">
                <img src={file.preview} alt={file.name} className="h-20 w-20 object-cover rounded-lg mb-2" />
                <span className="text-blue text-sm block">{file.name}</span>
              </div>
            ))}
          </div>
        )}
      </label>
      <p className="text-blue mt-2">
        Não tem ideias para decoração?{" "}
        <a href="#" className="text-gold font-bold underline">
          Clique Aqui
        </a>
      </p>
    </div>
  );
};

export default InputImage;