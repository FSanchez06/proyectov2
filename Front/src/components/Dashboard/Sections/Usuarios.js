import React, { useEffect } from 'react';
import $ from 'jquery';
import 'datatables.net';

const Users = () => {
  useEffect(() => {
    // Inicializar DataTable
    $('#usersTable').DataTable({
      ajax: {
        url: 'http://localhost:9000/api/usuarios/', // Endpoint de tu API
        dataSrc: '',
      },
      columns: [
        { title: "ID", data: "ID_Usuario" },
        { title: "Nombre", data: "Nombre" },
        { title: "Email", data: "Email" },
        { title: "Teléfono", data: "Telefono" },
        { title: "Ciudad", data: "Ciudad" },
        { title: "Rol", data: "ID_Rol" }, // Puedes hacer un mapeo para mostrar el nombre del rol
      ],
      pagingType: 'full_numbers', // Estilo de paginación
      language: {
        paginate: {
          first: 'Primero',
          last: 'Último',
          next: 'Siguiente',
          previous: 'Anterior'
        }
      }
    });
  }, []);

  return (
    <div className="p-4">
      <h2 className='text-2xl mb-4 font-bold'>Lista de Usuarios</h2>
      <table id="usersTable" className="display min-w-full bg-white border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 border">ID</th>
            <th className="px-4 py-2 border">Nombre</th>
            <th className="px-4 py-2 border">Email</th>
            <th className="px-4 py-2 border">Teléfono</th>
            <th className="px-4 py-2 border">Ciudad</th>
            <th className="px-4 py-2 border">Rol</th>
          </tr>
        </thead>
      </table>
    </div>
  );
}

export default Users;