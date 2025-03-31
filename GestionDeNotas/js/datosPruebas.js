// datosPrueba.js
const materiasExamen = [
  {
      id: 101,
      nombre: "Matemática II",
      estado: "Cursando",
      mesas: [
          { id: 1, tipo: "Regular", fecha: "15/11/2023", horario: "09:00", aula: "Aula 10" },
          { id: 2, tipo: "Regular", fecha: "20/12/2023", horario: "14:00", aula: "Aula 5" }
      ]
  },
  {
      id: 102,
      nombre: "Programación I",
      estado: "Cursando",
      mesas: [
          { id: 3, tipo: "Regular", fecha: "18/11/2023", horario: "10:00", aula: "Aula 8" },
          { id: 4, tipo: "Libre", fecha: "05/12/2023", horario: "16:00", aula: "Aula 3" }
      ]
  }
];

function obtenerMateriasExamen() {
  return materiasExamen;
}

function obtenerMesasPorMateria(materiaId) {
  const materia = materiasExamen.find(m => m.id == materiaId);
  return materia ? materia.mesas : [];
}