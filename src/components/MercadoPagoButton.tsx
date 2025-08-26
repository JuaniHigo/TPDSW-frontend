import { Wallet } from '@mercadopago/sdk-react';

interface Props {
    preferenceId: string;
}

const MercadoPagoButton = ({ preferenceId }: Props) => {
    // FIX: Eliminamos la prop 'customization' para resolver el error de tipado.
    return (
        <Wallet initialization={{ preferenceId: preferenceId }} />
    );
};

export default MercadoPagoButton;