import { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import carrierService from '@services/carrierService';

const AdminCreateCarrierPage = () => {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const isEditMode = !!id;

    // Estado do formulário
    const [formData, setFormData] = useState({
        name: ''
    });

    // Buscar dados da categoria se estiver editando
    const { data: carrier, isLoading: loadingCarrying } = useQuery({
        queryKey: ['carrier', id],
        queryFn: () => carrierService.getCarryingById(id),
        enabled: isEditMode,
        onSuccess: (data) => {
            setFormData({
                name: data.name || ''
            });
        },
        onError: (error) => {
            toast.error(`Erro ao carregar categoria: ${error.message}`);
            navigate('/admin/carriers');
        }
    });

    // Usar dados do state da navegação se disponíveis
    useEffect(() => {
        if (location.state?.carrier) {
            setFormData({
                name: location.state.carrier.name || ''
            });
        }
    }, [location.state]);

    // Mutação para criar/atualizar categoria
    const saveMutation = useMutation({
        mutationFn: (data) => {
            return isEditMode
                ? carrierService.updateCarrying(id, data)
                : carrierService.createCarrying(data);
        },
        onSuccess: () => {
            toast.success(
                isEditMode ? 'Categoria atualizada com sucesso!' : 'Categoria criada com sucesso!',
                { icon: '✅' }
            );
            queryClient.invalidateQueries(['carrier']);
            navigate('/admin/carriers');
        },
        onError: (error) => {
            toast.error(`Erro: ${error.message}`, { icon: '❌' });
        }
    });

    // Lidar com envio do formulário
    const handleSubmit = (e) => {
        e.preventDefault();
        // Validação simples
        if (!formData.name) {
            toast.error('O nome da transportadora é obrigatório');
            return;
        }
        saveMutation.mutate(formData);
    };

    // Lidar com mudanças no formulário
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <div className="row justify-content-center">
            <div className="col-md-8 col-lg-6">
                <div className="card">
                    <div className="card-header text-bg-light py-3">
                        <h2 className="card-title mb-0">
                            {isEditMode ? 'Editar Transportadora' : 'Nova Transportadora'}
                        </h2>
                    </div>
                    <div className="card-body p-4">
                        {loadingCarrying ? (
                            <div className="text-center my-5">
                                <div className="spinner-border" role="status"></div>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="name" className="form-label">
                                        Nome da Trasnportadora *
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="d-flex gap-2 mt-4">
                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        disabled={saveMutation.isPending}>
                                        {saveMutation.isPending ? (
                                            <>
                                                <span
                                                    className="spinner-border spinner-border-sm me-2"
                                                    role="status"
                                                    aria-hidden="true"></span>
                                                Salvando...
                                            </>
                                        ) : (
                                            'Salvar Transportadora'
                                        )}
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-outline-secondary"
                                        onClick={() => navigate('/admin/carriers')}>
                                        Cancelar
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminCreateCarrierPage; 