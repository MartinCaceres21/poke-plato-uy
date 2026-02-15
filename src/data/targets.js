// Perfil de referencia: adultos 30–40 años con un gasto
// aproximado cercano a 2000 kcal/día y 3 comidas principales.
// Estos rangos son por comida principal (1 plato completo).
export const mealTargets = {
  // ~500–700 kcal por comida fuerte (3 comidas ~1500–2100 kcal).
  kcal: { min: 500, max: 700 },
  // Proteína suficiente para saciedad y mantenimiento muscular.
  protein: { min: 20, max: 35 },
  // Carbohidratos como principal fuente de energía del plato.
  carbs: { min: 40, max: 70 },
  // Grasas totales, priorizando fuentes de buena calidad.
  fat: { min: 10, max: 25 }
};

// Perfil "dieta": mismos adultos pero buscando déficit moderado.
// Plato algo más bajo en kcal, manteniendo buena proteína.
export const dietMealTargets = {
  kcal: { min: 350, max: 550 },
  protein: { min: 23, max: 40 },
  carbs: { min: 25, max: 55 },
  fat: { min: 8, max: 22 }
};
