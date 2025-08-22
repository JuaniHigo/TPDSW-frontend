//A desarrollar seleccion del sector del estadio correspondiente al partido
import React from "react";
import { useParams } from "react-router-dom";

export const SectorEstadio: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div>
      <h1>Selecciona el sector para el partido {id}</h1>
      {/* Aquí puedes agregar la lógica para mostrar los sectores del estadio */}
    </div>
  );
};

export default SectorEstadio;
