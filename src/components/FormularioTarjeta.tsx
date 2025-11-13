import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { usePurchase } from '../hooks/usePurchase';
import './FormularioTarjeta.css';

const schema = z.object({
    numero: z.string().regex(/^\d{16}$/, 'Debe tener 16 dígitos.'),
    nombre: z.string().min(3, 'El nombre es requerido.'),
    expiracion: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, 'Formato MM/AA inválido.'),
    cvc: z.string().regex(/^\d{3,4}$/, 'Debe tener 3 o 4 dígitos.')
});

type FormularioTarjetaInputs = z.infer<typeof schema>;

const FormularioTarjeta = () => {
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormularioTarjetaInputs>({
        resolver: zodResolver(schema)
    });
    const navigate = useNavigate();
    const { purchase } = usePurchase();

    const onSubmit: SubmitHandler<FormularioTarjetaInputs> = async () => {
        try {
            const response = await api.post('/pagos/procesar-tarjeta', {
                eventoId: purchase.eventoId,
                sectorId: purchase.sectorId,
                quantity: purchase.quantity,
            });
            const { id_compra } = response.data;
            // Redirigimos a la página de éxito con el ID de la compra
            navigate(`/compra-exitosa?external_reference=${id_compra}`);
        } catch (error) {
            console.error("Error al procesar el pago con tarjeta:", error);
            alert("No se pudo procesar el pago. Intente de nuevo.");
        }
    };

    return (
        <form className="formulario-tarjeta" onSubmit={handleSubmit(onSubmit)}>
            <div className="form-group">
                <label htmlFor="numero">Número de la Tarjeta</label>
                <input type="text" id="numero" {...register('numero')} maxLength={16} />
                {errors.numero && <span className="error">{errors.numero.message}</span>}
            </div>
            <div className="form-group">
                <label htmlFor="nombre">Nombre del Titular</label>
                <input type="text" id="nombre" {...register('nombre')} />
                {errors.nombre && <span className="error">{errors.nombre.message}</span>}
            </div>
            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="expiracion">Expiración (MM/AA)</label>
                    <input type="text" id="expiracion" {...register('expiracion')} placeholder="MM/AA" />
                    {errors.expiracion && <span className="error">{errors.expiracion.message}</span>}
                </div>
                <div className="form-group">
                    <label htmlFor="cvc">CVC</label>
                    <input type="text" id="cvc" {...register('cvc')} maxLength={4} />
                    {errors.cvc && <span className="error">{errors.cvc.message}</span>}
                </div>
            </div>
            <button type="submit" className="pagar-tarjeta-btn" disabled={isSubmitting}>
                {isSubmitting ? 'Procesando...' : 'Pagar'}
            </button>
        </form>
    );
};

export default FormularioTarjeta;
