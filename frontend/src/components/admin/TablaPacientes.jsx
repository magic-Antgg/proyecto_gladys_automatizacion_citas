import { useEffect, useState } from 'react';

import axios from 'axios';

function TablaPacientes() {

  const [pacientes, setPacientes] =
    useState([]);

  /*
  |--------------------------------------------------
  | NUEVO PACIENTE
  |--------------------------------------------------
  */

  const [nuevoPaciente, setNuevoPaciente] =
    useState({
      nombre: '',
      telefono: '',
      correo: '',
      fecha_nacimiento: ''
    });

  /*
  |--------------------------------------------------
  | OBTENER PACIENTES
  |--------------------------------------------------
  */

  const obtenerPacientes = async () => {

    try {

      const res = await axios.get(
        'http://localhost:3000/api/pacientes'
      );

      setPacientes(res.data.data);

    } catch (error) {

      console.error(error);
    }
  };

  useEffect(() => {

    obtenerPacientes();

  }, []);

  /*
  |--------------------------------------------------
  | CREAR PACIENTE
  |--------------------------------------------------
  */

  const crearPaciente = async () => {

    try {

      await axios.post(
        'http://localhost:3000/api/pacientes',
        nuevoPaciente
      );

      obtenerPacientes();

      setNuevoPaciente({
        nombre: '',
        telefono: '',
        correo: '',
        fecha_nacimiento: ''
      });

    } catch (error) {

      console.error(error);
    }
  };

  /*
  |--------------------------------------------------
  | ELIMINAR
  |--------------------------------------------------
  */

  const eliminarPaciente = async (id) => {

    const confirmar =
      window.confirm(
        '¿Eliminar paciente?'
      );

    if (!confirmar) return;

    try {

      await axios.delete(
        `http://localhost:3000/api/pacientes/${id}`
      );

      obtenerPacientes();

    } catch (error) {

      console.error(error);
    }
  };

  /*
  |--------------------------------------------------
  | EDITAR
  |--------------------------------------------------
  */

  const editarPaciente = async (paciente) => {

    const nombre =
      prompt(
        'Nuevo nombre',
        paciente.nombre
      );

    const telefono =
      prompt(
        'Nuevo teléfono',
        paciente.telefono
      );

    const correo =
      prompt(
        'Nuevo correo',
        paciente.correo
      );

    if (
      !nombre ||
      !telefono ||
      !correo
    ) return;

    try {

      await axios.put(
        `http://localhost:3000/api/pacientes/${paciente.id}`,
        {
          nombre,
          telefono,
          correo
        }
      );

      obtenerPacientes();

    } catch (error) {

      console.error(error);
    }
  };

  /*
  |--------------------------------------------------
  | RENDER
  |--------------------------------------------------
  */

  return (

    <div>

      <h2 className="section-title">
        👥 Pacientes
      </h2>

      {/* =========================
          FORMULARIO
      ========================= */}

      <div
        className="admin-card"
        style={{
          marginBottom: '25px'
        }}
      >

        <h3
          style={{
            marginBottom: '15px'
          }}
        >
          Nuevo Paciente
        </h3>

        <input
          className="login-input"
          type="text"
          placeholder="Nombre"
          value={nuevoPaciente.nombre}
          onChange={(e) =>
            setNuevoPaciente({
              ...nuevoPaciente,
              nombre: e.target.value
            })
          }
        />

        <br />
        <br />

        <input
          className="login-input"
          type="text"
          placeholder="Teléfono"
          value={nuevoPaciente.telefono}
          onChange={(e) =>
            setNuevoPaciente({
              ...nuevoPaciente,
              telefono: e.target.value
            })
          }
        />

        <br />
        <br />

        <input
          className="login-input"
          type="email"
          placeholder="Correo"
          value={nuevoPaciente.correo}
          onChange={(e) =>
            setNuevoPaciente({
              ...nuevoPaciente,
              correo: e.target.value
            })
          }
        />

        <br />
        <br />

        <input
          className="login-input"
          type="date"
          value={
            nuevoPaciente.fecha_nacimiento
          }
          onChange={(e) =>
            setNuevoPaciente({
              ...nuevoPaciente,
              fecha_nacimiento:
                e.target.value
            })
          }
        />

        <button
          className="login-btn"
          style={{
            marginTop: '15px'
          }}
          onClick={crearPaciente}
        >
          Crear Paciente
        </button>

      </div>

      {/* =========================
          TABLA
      ========================= */}

      <table className="tabla">

        <thead>

          <tr>

            <th>Nombre</th>
            <th>Teléfono</th>
            <th>Correo</th>
            <th>Acciones</th>

          </tr>

        </thead>

        <tbody>

          {
            pacientes.map((paciente) => (

              <tr key={paciente.id}>

                <td>
                  {paciente.nombre}
                </td>

                <td>
                  {paciente.telefono}
                </td>

                <td>
                  {paciente.correo}
                </td>

                <td>

                  <button
                    className="btn-editar"
                    onClick={() =>
                      editarPaciente(
                        paciente
                      )
                    }
                    style={{
                      marginRight: '10px'
                    }}
                  >
                    Editar
                  </button>

                  <button
                    className="btn-cancelar"
                    onClick={() =>
                      eliminarPaciente(
                        paciente.id
                      )
                    }
                  >
                    Eliminar
                  </button>

                </td>

              </tr>
            ))
          }

        </tbody>

      </table>

    </div>
  );
}

export default TablaPacientes;