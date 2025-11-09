import React, { useState, useEffect, useContext } from "react";
import { FaFileAlt, FaTimes } from "react-icons/fa";
import { useFormContext } from 'react-hook-form';
import { FormContext } from '../../contexts/FormContext';

const InputImage = React.forwardRef(({ name }, ref) => {
  const { setValue, watch } = useFormContext();
  const { formData, setFormData } = useContext(FormContext);
  const [files, setFiles] = useState([]);

  useEffect(() => {
    if (formData?.imagens && Array.isArray(formData.imagens) && formData.imagens.length > 0) {
      const imagensFormatadas = formData.imagens.map((img) => {
        if (img.preview) {
          return img;
        }
        if (img instanceof File) {
          return {
            file: img,
            name: img.name,
            preview: URL.createObjectURL(img),
          };
        }
        if (img.file instanceof File) {
          return {
            file: img.file,
            name: img.file.name,
            preview: URL.createObjectURL(img.file),
          };
        }
        return null;
      }).filter(Boolean);
      
      setFiles(imagensFormatadas);
      const fileObjects = imagensFormatadas.map(f => f.file || f);
      setValue(name, fileObjects);
    } else {
      setFiles([]);
      setValue(name, []);
    }
  }, []);

  const handleImageChange = (event) => {
    const newFiles = Array.from(event.target.files);
    const uniqueFiles = newFiles.filter(
      (file) => !files.some((f) => {
        const existingFile = f.file || f;
        return existingFile.name === file.name && existingFile.size === file.size;
      })
    );

    const newFilesWithPreview = uniqueFiles.map((file) => ({
      file,
      name: file.name,
      preview: URL.createObjectURL(file),
    }));

    const updatedFiles = [...files, ...newFilesWithPreview];
    setFiles(updatedFiles);

    const fileObjects = updatedFiles.map(f => f.file || f);
    setValue(name, fileObjects);
    
    if (setFormData) {
      setFormData(fileObjects, 'imagens');
    }
    
    event.target.value = '';
  };

  const handleRemoveImage = (indexToRemove) => {
    const fileToRemove = files[indexToRemove];
    if (fileToRemove?.preview) {
      URL.revokeObjectURL(fileToRemove.preview);
    }

    const updatedFiles = files.filter((_, index) => index !== indexToRemove);
    setFiles(updatedFiles);

    const fileObjects = updatedFiles.map(f => f.file || f);
    setValue(name, fileObjects);
    
    if (setFormData) {
      setFormData(fileObjects, 'imagens');
    }
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
        ref={ref}
      />
      <div className="block border-2 border-gold rounded-lg p-4 w-full mt-2 h-auto text-center bg-white" style={{ width: '100%', minHeight: '8rem' }}>
        {files.length === 0 ? (
          <label
            htmlFor="file-upload"
            className="flex items-center gap-2 pt-4 flex-col font-bold text-gold cursor-pointer"
          >
            <FaFileAlt className="text-4xl"/>
            Clique aqui para adicionar imagem(s).
          </label>
        ) : (
          <div className="flex gap-4 flex-wrap">
            {files.map((file, index) => (
              <div key={index} className="relative text-center group">
                <div className="relative inline-block">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleRemoveImage(index);
                    }}
                    className="absolute -top-2 -right-2 bg-white rounded-full w-7 h-7 flex items-center justify-center hover:bg-gray-100 transition-all z-50 shadow-lg opacity-0 group-hover:opacity-100 border-2 border-red-500"
                    title="Remover imagem"
                  >
                    <FaTimes className="text-sm font-bold text-red-600" />
                  </button>
                  <img src={file.preview} alt={file.name} className="h-20 w-20 object-cover rounded-lg mb-2 group-hover:opacity-75 transition-opacity" />
                </div>
                <span className="text-blue text-sm block">{file.name}</span>
              </div>
            ))}
            <label
              htmlFor="file-upload"
              className="flex items-center justify-center h-20 w-20 border-2 border-dashed border-gold rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
              title="Adicionar mais imagens"
            >
              <span className="text-gold text-2xl">+</span>
            </label>
          </div>
        )}
      </div>
      <p className="text-blue mt-2">
        Não tem ideias para decoração?{" "}
        <a href="#" className="text-gold font-bold underline">
          Clique Aqui
        </a>
      </p>
    </div>
  );
});

export default InputImage;