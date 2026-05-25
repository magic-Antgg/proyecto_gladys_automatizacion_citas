import { useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import {
  obtenerServicios
} from '../services/servicios.service';

import '../styles/styles.css';

function Servicios() {

  const navigate = useNavigate();

  const [servicios, setServicios] =
    useState([]);

  const [seleccionados, setSeleccionados] =
    useState([]);

  /*
  |--------------------------------------------------------------------------
  | Cargar servicios desde API
  |--------------------------------------------------------------------------
  */

  useEffect(() => {

    cargarServicios();

  }, []);

const cargarServicios = async () => {

  try {

    const data =
      await obtenerServicios();

    setServicios(data);

  } catch (error) {

    console.log(error);

  }

};

  /*
  |--------------------------------------------------------------------------
  | Seleccionar servicio
  |--------------------------------------------------------------------------
  */

  const toggleServicio = (servicio) => {

    const existe =
      seleccionados.find(
        (s) => s.id === servicio.id
      );

    if (existe) {

      setSeleccionados(

        seleccionados.filter(
          (s) => s.id !== servicio.id
        )
      );

    } else {

      setSeleccionados([
        ...seleccionados,
        servicio
      ]);

    }

  };

  /*
  |--------------------------------------------------------------------------
  | Continuar
  |--------------------------------------------------------------------------
  */

  const continuar = () => {

    if (seleccionados.length === 0) {

      alert(
        'Selecciona al menos un servicio'
      );

      return;
    }

    localStorage.setItem(
      'servicios',
      JSON.stringify(seleccionados)
    );

    navigate('/informacion');
  };

  return (

    <div className="container">

      <div className="top"></div>

      <div className="content">

        <h2>
          Crear nueva cita Dental
        </h2>

        <p className="subtitle">
          Elige tus servicios
        </p>

        <div className="nav">

          <div className="active">
            SERVICIOS
          </div>

          <div className="inactive">
            INFORMACIÓN
          </div>

          <div className="inactive">
            RESUMEN
          </div>

        </div>

        <h3>Servicios</h3>

        <div className="grid">

          {
            servicios.map((servicio) => {

              const seleccionado =
                seleccionados.find(
                  (s) => s.id === servicio.id
                );

              return (

                <div
                  key={servicio.id}

                  className={`card ${
                    seleccionado
                      ? 'selected'
                      : ''
                  }`}

                  onClick={() =>
                    toggleServicio(servicio)
                  }
                >

                  {servicio.nombre}

                  <br />

                  <span className="small">

                    $
                    {servicio.precio}

                  </span>

                </div>
              );

            })
          }

        </div>

        <button onClick={continuar}>
          Siguiente
        </button>

        <button className="btn-regresar" onClick={() => navigate('/')}>
          ← Regresar
        </button>

      </div>

    </div>
  );
}

export default Servicios;