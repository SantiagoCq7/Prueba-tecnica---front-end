import React, { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Input, Alert } from '../ui';
import { CreateActionRequest } from '../../types/actions';

// Esquema de validación para el formulario de creación
const createActionSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido').max(100, 'Máximo 100 caracteres'),
  description: z.string().min(1, 'La descripción es requerida').max(500, 'Máximo 500 caracteres'),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Ingresa un color HEX válido (ej: #FF5733)'),
  status: z.boolean(), // true = activo (1), false = inactivo (0)
});

type CreateActionFormData = z.infer<typeof createActionSchema>;

interface CreateActionFormProps {
  onSubmit: (data: CreateActionRequest) => Promise<boolean>;
  onCancel: () => void;
  isLoading?: boolean;
  error?: string | null;
}

export const CreateActionForm: React.FC<CreateActionFormProps> = ({
  onSubmit,
  onCancel,
  isLoading = false,
  error,
}) => {
  // Estados locales para manejar el archivo
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Configuración del formulario
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<CreateActionFormData>({
    resolver: zodResolver(createActionSchema),
    defaultValues: {
      name: '',
      description: '',
      color: '#3B82F6', // Color azul por defecto
      status: true,
    },
  });

  const colorValue = watch('color');

  // Función para manejar la selección de archivo
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validamos que sea una imagen
      if (!file.type.startsWith('image/')) {
        alert('Por favor selecciona un archivo de imagen válido');
        return;
      }
      // Validamos el tamaño (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('El archivo no debe superar los 5MB');
        return;
      }
      setSelectedFile(file);
      
      // Creamos una URL temporal para mostrar la previsualización
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Función que se ejecuta al enviar el formulario
  const handleFormSubmit = async (data: CreateActionFormData) => {
    setSubmitSuccess(false);
    setFileError(null);

    // Validar manualmente que se haya seleccionado un archivo
    if (!selectedFile) {
      setFileError('El icono es requerido');
      return;
    }

    // Preparamos los datos para enviarlos al padre
    const actionData: CreateActionRequest = {
      name: data.name,
      description: data.description,
      color: data.color,
      icon: selectedFile,
      status: data.status ? 1 : 0, // Convertimos boolean a number (1 o 0)
    };
    
    // Llamamos a la función onSubmit que nos pasaron por props
    const success = await onSubmit(actionData);
    
    // Si todo salió bien, mostramos mensaje de éxito y cerramos el modal
    if (success) {
      setSubmitSuccess(true);
      setTimeout(() => {
        onCancel();
      }, 1500);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
      {/* Mensaje de éxito */}
      {submitSuccess && (
        <Alert type="success" message="¡Acción creada exitosamente!" />
      )}

      {/* Mensaje de error general */}
      {error && <Alert type="error" message={error} />}

      {/* Input Nombre */}
      <Input
        label="Nombre de la categoría"
        placeholder="Escribe el nombre de la buena acción"
        error={errors.name?.message}
        required
        {...register('name')}
      />

      {/* Textarea Descripción */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Descripción de la buena acción <span className="text-red-500">*</span>
        </label>
        <textarea
          className={`w-full px-4 py-2.5 border rounded-lg text-gray-900 transition-colors duration-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
            errors.description ? 'border-red-500' : 'border-gray-300'
          }`}
          rows={3}
          placeholder="Agrega descripción"
          {...register('description')}
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
        )}
      </div>

      {/* Upload de Logo */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Logo <span className="text-red-500">*</span>
        </label>
        <div className="flex items-center gap-4">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className={`px-4 py-2 border rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2 ${
              fileError ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Cargar archivo
          </button>
          {filePreview && (
            <div className="relative">
              <img
                src={filePreview}
                alt="Preview"
                className="w-12 h-12 object-cover rounded-lg border"
              />
              <button
                type="button"
                onClick={() => {
                  setSelectedFile(null);
                  setFilePreview(null);
                }}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
              >
                ×
              </button>
            </div>
          )}
        </div>
        <p className="mt-1 text-xs text-gray-500">
          Formatos permitidos: JPG, PNG, GIF. Máximo 5MB.
        </p>
        {fileError && (
          <p className="mt-1 text-sm text-red-600">{fileError}</p>
        )}
      </div>

      {/* Color */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Color <span className="text-red-500">*</span>
        </label>
        <div className="flex items-center gap-3">
          <input
            type="color"
            {...register('color')}
            className="w-10 h-10 p-1 border border-gray-300 rounded cursor-pointer"
          />
          <Input
            placeholder="Registra color código HEX"
            className="flex-1"
            error={errors.color?.message}
            {...register('color')}
          />
        </div>
        {colorValue && (
          <div className="mt-2 flex items-center gap-2">
            <span className="text-sm text-gray-500">Vista previa:</span>
            <div
              className="w-6 h-6 rounded border"
              style={{ backgroundColor: colorValue }}
            />
          </div>
        )}
      </div>

      {/* Active Toggle */}
      <div className="flex items-center gap-3">
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            {...register('status')}
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
        </label>
        <span className="text-sm font-medium text-gray-700">Activo</span>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="flex-1"
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          isLoading={isLoading}
          disabled={submitSuccess}
          className="flex-1"
        >
          Crear
        </Button>
      </div>
    </form>
  );
};
