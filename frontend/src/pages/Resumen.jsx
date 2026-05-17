import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/styles.css';

const Resumen = () => {

  const navigate = useNavigate();

  const [cita, setCita] = useState(null);
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {

    const citaGuardada = localStorage.getItem('cita');
    const usuarioGuardado = localStorage.getItem('usuario');

    if (citaGuardada) setCita(JSON.parse(citaGuardada));
    if (usuarioGuardado) setUsuario(JSON.parse(usuarioGuardado));

  }, []);

  /*
  |--------------------------------------------------------------------------
  | Nueva cita — limpiar y volver al inicio
  |--------------------------------------------------------------------------
  */

  const nuevaCita = () => {
    localStorage.removeItem('cita');
    localStorage.removeItem('servicios');
    navigate('/servicios');
  };

  /*
  |--------------------------------------------------------------------------
  | Formatear fecha legible
  |--------------------------------------------------------------------------
  */

  const formatearFecha = (fechaStr) => {
    if (!fechaStr) return '';
    const [anio, mes, dia] = fechaStr.split('-');
    const meses = [
      'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
      'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
    ];
    return `${dia} de ${meses[parseInt(mes, 10) - 1]} de ${anio}`;
  };

  /*
  |--------------------------------------------------------------------------
  | Render
  |--------------------------------------------------------------------------
  */

  return (

    <div className="container">

      <div className="top"></div>

      <div className="content">

        <div className="nav">
          <div className="inactive">SERVICIOS</div>
          <div className="inactive">INFORMACIÓN</div>
          <div className="active">RESUMEN</div>
        </div>

        <div className="resumen-icono">✅</div>

        <h2>¡Cita confirmada!</h2>

        <p className="subtitle">
          Tu cita ha sido registrada exitosamente.
        </p>

        {cita && usuario ? (

          <div className="card resumen-card">

            <div className="resumen-fila">
              <span className="resumen-label">Paciente</span>
              <span className="resumen-valor">{usuario.nombre}</span>
            </div>

            <div className="resumen-fila">
              <span className="resumen-label">Correo</span>
              <span className="resumen-valor">{usuario.correo}</span>
            </div>

            <div className="resumen-fila">
              <span className="resumen-label">Fecha</span>
              <span className="resumen-valor">
                {formatearFecha(cita.fecha)}
              </span>
            </div>

            <div className="resumen-fila">
              <span className="resumen-label">Hora</span>
              <span className="resumen-valor">{cita.hora}</span>
            </div>

            {cita.servicios && cita.servicios.length > 0 && (
              <div className="resumen-fila resumen-servicios">
                <span className="resumen-label">Servicios</span>
                <ul className="resumen-lista">
                  {cita.servicios.map((s) => (
                    <li key={s.id}>
                      {s.nombre}
                      {s.precio && (
                        <span className="small"> — ${s.precio}</span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}

          </div>

        ) : (

          <p className="estado-mensaje">
            No se encontraron datos de la cita.
          </p>

        )}

        <button onClick={nuevaCita}>
          Agendar otra cita
        </button>

      </div>

    </div>

  );

};

export default Resumen;