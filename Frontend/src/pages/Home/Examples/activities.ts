export const exampleActivities = [
  {
    name: "A",
    precedents: [],
    optimist: 2,
    probable: 3,
    pessimist: 4,
    cost: 3000000,
    acceleration: 1,
    acceleration_cost: 1200000,
  }, // levantamiento de requerimientos
  {
    name: "B",
    precedents: ["A"],
    optimist: 3,
    probable: 4,
    pessimist: 6,
    cost: 5500000,
    acceleration: 1.5,
    acceleration_cost: 1800000,
  }, // diseño funcional y técnico
  {
    name: "C",
    precedents: ["B"],
    optimist: 4,
    probable: 6,
    pessimist: 8,
    cost: 12000000,
    acceleration: 2,
    acceleration_cost: 3500000,
  }, // desarrollo backend
  {
    name: "D",
    precedents: ["B"],
    optimist: 3,
    probable: 5,
    pessimist: 7,
    cost: 10000000,
    acceleration: 2,
    acceleration_cost: 3000000,
  }, // desarrollo frontend
  {
    name: "E",
    precedents: ["C", "D"],
    optimist: 2,
    probable: 3,
    pessimist: 5,
    cost: 4500000,
    acceleration: 1,
    acceleration_cost: 1500000,
  }, // integración frontend-backend
  {
    name: "F",
    precedents: ["E"],
    optimist: 2,
    probable: 3,
    pessimist: 4,
    cost: 3500000,
    acceleration: null,
    acceleration_cost: null,
  }, // pruebas funcionales
  {
    name: "G",
    precedents: ["E"],
    optimist: 1,
    probable: 2,
    pessimist: 3,
    cost: 2500000,
    acceleration: null,
    acceleration_cost: null,
  }, // pruebas de seguridad
  {
    name: "H",
    precedents: ["F", "G"],
    optimist: 1,
    probable: 2,
    pessimist: 3,
    cost: 3000000,
    acceleration: null,
    acceleration_cost: null,
  }, // corrección de defectos
  {
    name: "I",
    precedents: ["H"],
    optimist: 1,
    probable: 2,
    pessimist: 3,
    cost: 2800000,
    acceleration: 1,
    acceleration_cost: 900000,
  }, // despliegue en producción
  {
    name: "J",
    precedents: ["I"],
    optimist: 1,
    probable: 1.5,
    pessimist: 2,
    cost: 2200000,
    acceleration: null,
    acceleration_cost: null,
  }, // capacitación usuarios
];
