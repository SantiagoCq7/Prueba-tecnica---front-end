import React, { useEffect, useState } from 'react';
import { Sidebar } from '../components/common';
import { ActionsTable, CreateActionForm } from '../components/actions';
import { Spinner, Alert, Pagination, Modal, Button } from '../components/ui';
import { useActionsStore } from '../store/actionsStore';
import { useAuthStore } from '../store/authStore';
import logoWhite from '../assets/images/logo-white.png';

export const DashboardPage: React.FC = () => {
  const {
    actions,
    totalCount,
    totalPages,
    currentPage,
    pageSize,
    isLoading,
    error,
    fetchActions,
    createAction,
    clearError,
  } = useActionsStore();

  const { user } = useAuthStore();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'categorias' | 'tips' | 'evidencias'>('categorias');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchActions(1, 10);
  }, [fetchActions]);

  const handlePageChange = (page: number) => {
    fetchActions(page, pageSize);
  };

  const handleCreateAction = async (data: any) => {
    const success = await createAction(data);
    return success;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Encabezado Superior */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-[#1B1B4B] flex items-center justify-between px-8 shadow-md z-50">
        <div className="flex items-center">
            <img src={logoWhite} alt="Be Kind Network" className="h-8 w-auto" />
        </div>
        <div className="flex items-center gap-4">
            {/* Avatar de Usuario */}
            <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center text-[#1B1B4B] font-bold border-2 border-white">
              {user?.name?.[0]?.toUpperCase() || 'A'}
            </div>
        </div>
      </header>

      <div className="flex pt-16">
        {/* Barra Lateral */}
        <Sidebar />

        {/* Contenido Principal */}
        <main className="flex-1 p-8">
          {/* Título de la Página */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Categorias</h1>
          </div>

          {/* Pestañas */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100">
            <div className="border-b border-gray-200">
              <nav className="flex -mb-px px-4">
                <button
                  onClick={() => setActiveTab('categorias')}
                  className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'categorias'
                      ? 'border-[#1B1B4B] text-[#1B1B4B]'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Categorias
                </button>
                <button
                  onClick={() => setActiveTab('tips')}
                  className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'tips'
                      ? 'border-[#1B1B4B] text-[#1B1B4B]'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Tipos
                </button>
                <button
                  onClick={() => setActiveTab('evidencias')}
                  className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'evidencias'
                      ? 'border-[#1B1B4B] text-[#1B1B4B]'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Evidencias
                </button>
              </nav>
            </div>
            {/* Barra de Herramientas */}
            <div className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-4 flex-1">
                {/* Buscador */}
                <div className="relative w-full max-w-md">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Buscar"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                
                {/* Botón de Filtros */}
                <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                  Filtros
                </button>
              </div>

              <Button
                onClick={() => setShowCreateModal(true)}
                className="bg-[#1B1B4B] hover:bg-[#2a2a6b] text-white px-6 py-2 rounded-md flex items-center gap-2"
              >
                Crear tipo de categoria
              </Button>
            </div>

            {/* Tabla */}
            <div className="px-6 pb-6">
              {isLoading ? (
                <div className="flex justify-center py-12">
                  <Spinner size="lg" />
                </div>
              ) : error ? (
                <Alert type="error" message={error} onClose={clearError} />
              ) : (
                <ActionsTable
                  actions={actions}
                  onEdit={(action) => console.log('Edit', action)}
                  onDelete={(action) => console.log('Delete', action)}
                />
              )}

              {/* Paginación */}
              <div className="mt-6">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalCount={totalCount}
                  pageSize={pageSize}
                  onPageChange={handlePageChange}
                />
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Modal de Creación */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Crear Nueva Acción"
      >
        <CreateActionForm
          onSubmit={handleCreateAction}
          onCancel={() => setShowCreateModal(false)}
          isLoading={isLoading}
          error={error}
        />
      </Modal>
    </div>
  );
};
