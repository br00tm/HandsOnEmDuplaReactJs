import { toast } from 'react-hot-toast';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import carrierService from '@services/carrierService';
import Pagination from '@components/Pagination';



const AdminCarrierPage = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    // Lista de transportadora
    const {
        data,
        isLoading: loadingcarriers,
        isError,
        error,
    } = useQuery({
        queryKey: ['carriers', currentPage],
        queryFn: () => carrierService.getCarrierByPage(currentPage),
        keepPreviousData: true,
    });    

    // Manipulador para mudança de página
    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
        // Rolar para o topo da página
        window.scrollTo(0, 0);
    };

    // Mutação para excluir categoria
    const deleteMutation = useMutation({
        mutationFn: carrierService.deletecarriers,
        onSuccess: () => {
            toast.success('carriers excluída', { icon: '🗑️' });
            queryClient.invalidateQueries(['carriers']);
        },
        onError: (err) => toast.error(`Erro: ${err.message}`, { icon: '❌' }),
    });

    // Função para excluir categoria
    const handleDelete = (id) => {
        if (window.confirm('Excluir transportadora? Esta ação é irreversível.')) {
            deleteMutation.mutate(id);
        }
    };

    // Função para editar categoria
    const handleEdit = (carriers) => {
        navigate(`/admin/carriers/edit/${carriers.id}`, { state: { carriers } });
    };

    if (isError) {
        return (
            <div className="alert alert-danger mt-4">
                Erro ao carregar transportadora: {error.message}
            </div>
        );
    }

    return (
        <div className="row justify-content-center">
            <div className="col-12 mb-3">
                <div className="card">
                    <div className="card-header text-bg-light d-flex justify-content-between align-items-center py-3">
                        <h2 className="mb-0">Transportadoras</h2>
                        <button
                            className="btn btn-success"
                            onClick={() => navigate('/admin/carriers/new')}>
                            Adicionar Transportadora
                        </button>
                    </div>
                    <div className="card-body p-0">
                        {loadingcarriers ? (
                            <div className="text-center my-5">
                                <div className="spinner-border" role="status"></div>
                            </div>
                        ) : (
                            <div className="table-responsive">
                                <table className="table table-striped align-middle mb-0">
                                    <thead className="table-dark">
                                        <tr>
                                            <th>Nome</th>
                                            <th className="text-center">Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data?.carriers?.length === 0 && (
                                            <tr>
                                                <td colSpan={3} className="text-center py-4">
                                                    Nenhuma transportadora encontrada.
                                                </td>
                                            </tr>
                                        )}
                                        {data?.carriers && data.carriers.map((carriers) => (
                                            <tr key={carriers.id}>
                                                <td>{carriers.name}</td>
                                                <td className="text-center one-line-cell px-3">
                                                    <button
                                                        className="btn btn-sm btn-outline-warning me-2"
                                                        onClick={() => handleEdit(carriers)}>
                                                        Alterar
                                                    </button>
                                                    <button
                                                        className="btn btn-sm btn-outline-danger"
                                                        onClick={() => handleDelete(carriers.id)}>
                                                        Excluir
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            {data?.totalPages > 1 && (
                <>
                    <div className="d-flex justify-content-center mb-2">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={data?.totalPages}
                            onPageChange={handlePageChange} />
                    </div>
                    <p className="small text-center m-0">
                        Mostrando página {currentPage} de {data?.totalPages}
                    </p>
                </>
            )}
        </div>
    );
};

export default AdminCarrierPage; 