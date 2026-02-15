// Platos completos pre-armados por nutricionista según la guía uruguaya.
// Cada plato es equilibrado por defecto, con sugerencias de variación.

export const completePlates = [
	{
		id: 'poke_salmon_clasico',
		name: 'Poke Bowl Clásico',
		description: 'Plato equilibrado estilo poke con salmón y verduras',
		goal: 'balanced',
		ingredients: {
			protein: 'salmon',
			carb: 'arroz',
			fat: 'aguacate',
			vegetable: 'mix_verduras_vapor'
		},
		variations: [
			'Sustituir salmón por atún para menos grasa',
			'Cambiar arroz por quinoa para más proteína',
			'Reemplazar aguacate por aceite de oliva + limón'
		]
	},
	{
		id: 'bowl_bajo_kcal',
		name: 'Bowl Vegetal Ligero',
		description: 'Plato bajo en calorías, alto en fibra',
		goal: 'diet',
		ingredients: {
			protein: 'wok_vegetales',
			carb: 'batata',
			fat: 'tahini'
		},
		variations: [
			'Agregar pollo para más proteína',
			'Cambiar batata por papa si no tenés',
			'Sustituir tahini por aceite de oliva'
		]
	},
	{
		id: 'plato_pollo_energia',
		name: 'Pollo con Carbos',
		description: 'Plato energético para post-entreno o actividad física',
		goal: 'balanced',
		ingredients: {
			protein: 'pollo',
			carb: 'papa',
			fat: 'aceite_oliva'
		},
		variations: [
			'Cambiar pollo por salmón si entrenaste fuerza',
			'Sustituir papa por arroz blanco',
			'Agregar aguacate en vez de aceite para más saciedad'
		]
	},
	{
		id: 'plato_vegano_completo',
		name: 'Vegano Equilibrado',
		description: 'Sin productos animales, completo en nutrientes',
		goal: 'balanced',
		ingredients: {
			protein: 'garbanzos',
			carb: 'quinoa',
			fat: 'nueces'
		},
		variations: [
			'Reemplazar garbanzos por hamburguesa vegetal',
			'Cambiar nueces por aguacate',
			'Sustituir quinoa por arroz integral'
		]
	},
	{
		id: 'atun_dieta',
		name: 'Atún Light',
		description: 'Alto en proteína, bajo en grasa total',
		goal: 'diet',
		ingredients: {
			protein: 'atun',
			carb: 'batata',
			fat: 'aceite_oliva'
		},
		variations: [
			'Cambiar batata por papa normal',
			'Añadir más aceite si necesitás más saciedad',
			'Sustituir atún por pollo al horno'
		]
	},
	{
		id: 'tofu_quinoa',
		name: 'Bowl Tofu + Quinoa',
		description: 'Proteína vegetal completa y carbos integrales',
		goal: 'balanced',
		healthTags: ['hipotiroidismo'],
		ingredients: {
			protein: 'tofu',
			carb: 'quinoa',
			fat: 'aceite_oliva'
		},
		variations: [
			'Reemplazar tofu por wok de vegetales + algo de lentejas',
			'Cambiar quinoa por arroz integral',
			'Agregar aguacate para más grasa saludable'
		]
	},
	{
		id: 'salmon_batata_semillas',
		name: 'Salmón con Batata y Semillas',
		description: 'Alto en omega-3, perfecto para salud cardiovascular',
		goal: 'balanced',
		healthTags: ['hipotiroidismo'],
		ingredients: {
			protein: 'salmon',
			carb: 'batata',
			fat: 'semillas_mix'
		},
		variations: [
			'Cambiar salmón por atún si buscás menos calorías',
			'Sustituir batata por papa común',
			'Reemplazar semillas por almendras picadas'
		]
	},
	{
		id: 'pollo_arroz_almendras',
		name: 'Pollo con Arroz y Almendras',
		description: 'Clásico equilibrado con crunch de almendras',
		goal: 'balanced',
		ingredients: {
			protein: 'pollo',
			carb: 'arroz',
			fat: 'almendras'
		},
		variations: [
			'Cambiar pollo por pavo si encontrás',
			'Sustituir arroz por quinoa para más proteína',
			'Agregar nueces en vez de almendras'
		]
	},
	{
		id: 'hamburguesa_vegetal_fideos',
		name: 'Hamburguesa Vegetal con Fideos',
		description: 'Opción vegana sabrosa y completa',
		goal: 'balanced',
		ingredients: {
			protein: 'hamb_veg',
			carb: 'fideos_arroz',
			fat: 'tahini'
		},
		variations: [
			'Reemplazar hamburguesa por garbanzos especiados',
			'Cambiar fideos de arroz por pasta común integral',
			'Agregar aguacate en vez de tahini'
		]
	},
	{
		id: 'atun_quinoa_mani',
		name: 'Atún con Quinoa y Maní',
		description: 'Rico en proteínas, bajo en grasa saturada',
		goal: 'diet',
		ingredients: {
			protein: 'atun',
			carb: 'quinoa',
			fat: 'mani'
		},
		variations: [
			'Cambiar atún por pollo desmenuzado',
			'Sustituir quinoa por arroz blanco',
			'Reemplazar maní por semillas si sos alérgico'
		]
	},
	{
		id: 'garbanzos_papa_aceite',
		name: 'Garbanzos Especiados con Papa',
		description: 'Proteína vegetal económica y saciante',
		goal: 'balanced',
		ingredients: {
			protein: 'garbanzos',
			carb: 'papa',
			fat: 'aceite_oliva'
		},
		variations: [
			'Agregar especias como comino y pimentón',
			'Cambiar papa por batata para más dulzor',
			'Sustituir garbanzos por lentejas'
		]
	},
	{
		id: 'pollo_quinoa_brocoli',
		name: 'Pollo con Quinoa y Brócoli',
		description: 'Completo y saludable, ideal para almuerzo',
		goal: 'balanced',
		healthTags: ['hipotiroidismo'],
		ingredients: {
			protein: 'pollo',
			carb: 'quinoa',
			fat: 'aceite_oliva',
			vegetable: 'brocoli_vapor'
		},
		variations: [
			'Sustituir brócoli por espinaca salteada',
			'Cambiar pollo por salmón',
			'Agregar semillas en vez de aceite'
		]
	},
	{
		id: 'tofu_batata_zanahoria',
		name: 'Tofu con Batata y Zanahoria',
		description: 'Bowl vegano colorido y nutritivo',
		goal: 'balanced',
		healthTags: ['hipotiroidismo'],
		ingredients: {
			protein: 'tofu',
			carb: 'batata',
			fat: 'semillas_mix',
			vegetable: 'zanahoria_vapor'
		},
		variations: [
			'Cambiar tofu por hamburguesa vegetal',
			'Sustituir zanahoria por zapallo asado',
			'Agregar tahini en vez de semillas'
		]
	},
	{
		id: 'salmon_arroz_espinaca',
		name: 'Salmón con Arroz y Espinaca',
		description: 'Rico en omega-3 y hierro',
		goal: 'balanced',
		ingredients: {
			protein: 'salmon',
			carb: 'arroz',
			fat: 'nueces',
			vegetable: 'espinaca_salteada'
		},
		variations: [
			'Cambiar salmón por atún para menos calorías',
			'Sustituir espinaca por mix de verduras',
			'Agregar almendras en vez de nueces'
		]
	},
	{
		id: 'atun_papa_zapallo',
		name: 'Atún con Papa y Zapallo',
		description: 'Bajo en grasa, alto en fibra',
		goal: 'diet',
		ingredients: {
			protein: 'atun',
			carb: 'papa',
			fat: 'aceite_oliva',
			vegetable: 'zapallo_asado'
		},
		variations: [
			'Cambiar atún por pollo al horno',
			'Sustituir zapallo por zanahoria',
			'Agregar semillas para más textura'
		]
	},
	{
		id: 'churrasco_pure_papa',
		name: 'Churrasco con Puré de Papa',
		description: 'Plato clásico uruguayo, completo y sustancioso',
		goal: 'balanced',
		ingredients: {
			protein: 'churrasco',
			carb: 'pure_papa',
			fat: 'aceite_oliva',
			vegetable: 'mix_verduras_vapor'
		},
		variations: [
			'Cambiar puré de papa por puré de boniato',
			'Sustituir churrasco por pollo a la plancha',
			'Agregar ensalada verde como acompañamiento'
		]
	},
	{
		id: 'omelette_fideos_integrales',
		name: 'Omelette con Fideos Integrales',
		description: 'Desayuno o almuerzo rico en proteína y fibra',
		goal: 'balanced',
		ingredients: {
			protein: 'omelette',
			carb: 'fideos_integrales',
			fat: 'aguacate',
			vegetable: 'zapallitos_revuelto'
		},
		variations: [
			'Agregar queso dentro del omelette',
			'Cambiar fideos por arroz integral',
			'Sustituir aguacate por nueces picadas'
		]
	},
	{
		id: 'lentejas_pure_bonato',
		name: 'Lentejas con Puré de Boniato',
		description: 'Plato económico, rico en hierro y fibra',
		goal: 'balanced',
		healthTags: ['hipotiroidismo'],
		ingredients: {
			protein: 'lentejas',
			carb: 'pure_bonato',
			fat: 'aceite_oliva',
			vegetable: 'zanahoria_vapor'
		},
		variations: [
			'Agregar especias como comino y cúrcuma a las lentejas',
			'Cambiar boniato por papa común',
			'Sustituir lentejas por garbanzos'
		]
	},
	{
		id: 'churrasco_fideos_zapallitos',
		name: 'Churrasco con Fideos y Zapallitos',
		description: 'Plato familiar con buena proteína animal',
		goal: 'balanced',
		ingredients: {
			protein: 'churrasco',
			carb: 'fideos_integrales',
			fat: 'aceite_oliva',
			vegetable: 'zapallitos_revuelto'
		},
		variations: [
			'Cambiar churrasco por milanesa de carne',
			'Sustituir fideos integrales por quinoa',
			'Agregar salsa de tomate casera'
		]
	},
	{
		id: 'omelette_pure_verduras',
		name: 'Omelette con Puré y Mix de Verduras',
		description: 'Comida rápida, nutritiva y saciante',
		goal: 'diet',
		ingredients: {
			protein: 'omelette',
			carb: 'pure_papa',
			fat: 'semillas_mix',
			vegetable: 'brocoli_vapor'
		},
		variations: [
			'Agregar vegetales dentro del omelette',
			'Cambiar puré por batata hervida',
			'Sustituir brócoli por espinaca'
		]
	},
	{
		id: 'lentejas_fideos_espinaca',
		name: 'Lentejas con Fideos y Espinaca',
		description: 'Plato vegano completo, alto en hierro',
		goal: 'balanced',
		healthTags: ['hipotiroidismo'],
		ingredients: {
			protein: 'lentejas',
			carb: 'fideos_integrales',
			fat: 'tahini',
			vegetable: 'espinaca_salteada'
		},
		variations: [
			'Agregar curry a las lentejas',
			'Cambiar fideos por arroz integral',
			'Sustituir tahini por almendras laminadas'
		]
	},
	{
		id: 'atun_batata_semillas',
		name: 'Atún con Batata y Semillas',
		description: 'Alto en omega-3 y fibra, ideal para triglicéridos',
		goal: 'diet',
		healthTags: ['hipotiroidismo'],
		ingredients: {
			protein: 'atun',
			carb: 'batata',
			fat: 'semillas_mix',
			vegetable: 'brocoli_vapor'
		},
		variations: [
			'Cambiar atún por salmón si preferís',
			'Sustituir batata por puré de boniato',
			'Agregar espinaca en vez de brócoli'
		]
	},
	{
		id: 'salmon_quinoa_almendras',
		name: 'Salmón con Quinoa y Almendras',
		description: 'Rico en selenio y omega-3 para función tiroidea',
		goal: 'balanced',
		healthTags: ['hipotiroidismo'],
		ingredients: {
			protein: 'salmon',
			carb: 'quinoa',
			fat: 'almendras',
			vegetable: 'espinaca_salteada'
		},
		variations: [
			'Cambiar salmón por atún light',
			'Sustituir quinoa por fideos integrales',
			'Agregar nueces en vez de almendras'
		]
	},
	{
		id: 'pollo_batata_nueces',
		name: 'Pollo con Batata y Nueces',
		description: 'Proteína magra con carbohidrato complejo y grasas saludables',
		goal: 'balanced',
		healthTags: ['hipotiroidismo'],
		ingredients: {
			protein: 'pollo',
			carb: 'batata',
			fat: 'nueces',
			vegetable: 'zanahoria_vapor'
		},
		variations: [
			'Cambiar pollo por tofu para versión vegana',
			'Sustituir batata por pure de boniato',
			'Agregar semillas de chía en vez de nueces'
		]
	}
];
