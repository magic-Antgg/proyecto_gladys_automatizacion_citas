import {
  useEffect,
  useState
} from 'react';

import {
  useNavigate
} from 'react-router-dom';

import {
  obtenerMisCitas
} from '../services/misCitas.service';

import '../styles/styles.css';

const MisCitas = () => {

  const navigate =
    useNavigate();

  const [citas, setCitas] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const usuario =
    JSON.parse(
      localStorage.getItem(
        'usuario'
      )
    );

  useEffect(() => {

    cargarCitas();

  }, []);

  const cargarCitas =
    async () => {

      try {

        const response =
          await obtenerMisCitas(
            usuario.id
          );

        setCitas(
          response.data || []
        );

      } catch (error) {

        console.log(error);

        alert(
          'Error cargando citas'
        );

      } finally {

        setLoading(false);

      }

    };

  const colorEstado =
    (estado) => {

      const colores = {

        pendiente:
          '#f6e05e',

        confirmada:
          '#68d391',

        cancelada:
          '#fc8181',

        completada:
          '#90cdf4'

      };

      return (
        colores[
          estado?.toLowerCase()
        ] || '#CBD5E0'
      );

    };

  return (

    <div className="container">

      <div className="top"></div>

      <div className="content">

        <h2>
          Mis Citas
        </h2>

        <p className="subtitle">
          Historial de citas del paciente
        </p>

        {

          loading && (

            <p>
              Cargando...
            </p>

          )

        }

        {

          !loading &&
          citas.length === 0 && (

            <p className="subtitle">
              No tienes citas registradas
            </p>

          )

        }

        {

          citas.map((cita) => (

            <div
              key={cita.id}
              className="card"
              style={{
                marginBottom: '15px',
                textAlign: 'left'
              }}
            >

              <h3>
                {
                  cita.pacientes?.nombre
                }
              </h3>

              <p>
                📅 {cita.fecha}
              </p>

              <p>
                🕐 {cita.hora_inicio}
              </p>

              <p>

                Estado:{' '}

                <span
                  style={{

                    background:
                      colorEstado(
                        cita.estado
                      ),

                    padding:
                      '4px 10px',

                    borderRadius:
                      '12px',

                    fontSize:
                      '12px',

                    fontWeight:
                      'bold'

                  }}
                >

                  {cita.estado}

                </span>

              </p>

            </div>

          ))

        }

        <button
          onClick={() =>
            navigate('/servicios')
          }
        >

          Nueva cita

        </button>

      </div>

    </div>

  );

};

export default MisCitas;