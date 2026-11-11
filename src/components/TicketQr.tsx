import QRCode from 'react-qr-code';
export default function TicketQr({ value }: { value: string }) {
  if (value.startsWith('data:')) {
    if (!/^data:image\/png;base64,[A-Za-z0-9+/]+=*$/.test(value))
      return <p>QR histórico no disponible. Contactá al soporte.</p>;
    return (
      <img src={value} width={128} height={128} alt="Código QR de la entrada" />
    );
  }
  if (!value || value === 'generating...')
    return <p>QR no disponible. Contactá al soporte.</p>;
  return (
    <QRCode value={value} size={128} bgColor="#FFFFFF" fgColor="#111827" />
  );
}
