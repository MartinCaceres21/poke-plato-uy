import './style.css';
import { ingredients } from './data/ingredients.js';
import { mealTargets, dietMealTargets } from './data/targets.js';
import { completePlates } from './data/completePlates.js';
import reference from './reference/reference.json';

function formatNumber(n) {
  return new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 }).format(n);
}

function findById(list, id) {
  return list.find((x) => x.id === id) ?? null;
}

function sumMacros(items) {
  return items.reduce(
    (acc, item) => {
      acc.kcal += item.kcal;
      acc.p += item.p;
      acc.c += item.c;
      acc.f += item.f;
      return acc;
    },
    { kcal: 0, p: 0, c: 0, f: 0 }
  );
}

function optionLabel(i) {
  return `${i.name} · ${i.serving} · ${i.kcal} kcal`;
}

function classify(value, range) {
  if (value < range.min) return 'low';
  if (value > range.max) return 'high';
  return 'ok';
}

function getTargetsForGoal(goal) {
  if (goal === 'diet') return dietMealTargets;
  return mealTargets;
}

function evaluatePlate(perPortion, goal) {
  const t = getTargetsForGoal(goal);

  const kcalClass = classify(perPortion.kcal, t.kcal);
  const pClass = classify(perPortion.p, t.protein);
  const cClass = classify(perPortion.c, t.carbs);
  const fClass = classify(perPortion.f, t.fat);

  const notes = [];

  if (pClass === 'low') notes.push('Poca proteína para una comida principal.');
  if (pClass === 'high') notes.push('Proteína alta: puede ser útil en fases de ganancia muscular.');

  if (cClass === 'low') notes.push('Pocos carbohidratos: puede sentirse poco energético si es comida fuerte.');
  if (cClass === 'high') notes.push('Carbohidratos altos: revisar si encaja con tu actividad física.');

  if (fClass === 'low') notes.push('Grasas muy bajas: podrías añadir algo de grasa saludable.');
  if (fClass === 'high') notes.push('Grasas altas: vigilar calorías totales del día.');

  if (kcalClass === 'low') notes.push('Plato algo bajo en calorías; podría quedarse corto como única comida.');
  if (kcalClass === 'high') notes.push('Plato calórico; quizá mejor para después de entrenar o dividir en 2 raciones.');

  let level = 'ok';
  if (kcalClass === 'high' || cClass === 'high' || fClass === 'high') level = 'high';
  if (kcalClass === 'low' || pClass === 'low') level = level === 'high' ? 'mixed' : 'low';

  let summary;
  if (pClass === 'ok' && cClass === 'ok' && fClass === 'ok' && kcalClass === 'ok') {
    summary = 'Plato equilibrado dentro de rangos estándar para una comida.';
  } else if (pClass === 'low') {
    summary = 'Plato algo flojo en proteína o energía.';
  } else if (kcalClass === 'high') {
    summary = 'Plato denso en calorías; úsalo con intención (ej. post-entreno).';
  } else {
    summary = 'Plato aceptable, con detalles a ajustar según tus objetivos.';
  }

  return {
    level,
    summary,
    notes,
    targets: t
  };
}

function renderApp() {
  document.querySelector('#app').innerHTML = `
    <div class="shell">
      <header class="header">
        <div>
          <h1>Poke Plato UY</h1>
          <p class="muted">Platos balanceados según la guía de alimentación uruguaya.</p>
        </div>
        <div class="chip">PDF: marco de referencia compacto</div>
      </header>

      <nav class="tabNav">
        <button class="tabBtn active" data-tab="complete">Platos Completos</button>
        <button class="tabBtn" data-tab="hypothyroidism">Hipotiroidismo</button>
        <button class="tabBtn" data-tab="planner">Planificador Semanal</button>
        <button class="tabBtn" data-tab="custom">Armar tu plato</button>
      </nav>

      <div class="tabContent" id="tabComplete">
        <section class="panel">
          <h2>Platos Completos</h2>
          <p class="muted">Recetas pre-armadas según la guía. Hacé clic en una para personalizarla en "Armar tu plato".</p>
          <div class="completeList" id="completeList">
            ${completePlates.map((plate) => `
              <div class="completeCard" data-plate-id="${plate.id}">
                <div class="completeCardHeader">
                  <div class="completeName">${plate.name}</div>
                  <div class="completeGoalTag">${plate.goal === 'diet' ? 'Dieta' : 'Equilibrado'}</div>
                  ${plate.healthTags?.includes('hipotiroidismo') ? '<div class="completeGoalTag healthy">❤️ Hipotiroidismo</div>' : ''}
                </div>
                <div class="completeDesc small muted">${plate.description}</div>
                <button class="btnLoadPlate" data-plate-id="${plate.id}">Cargar y personalizar</button>
                <details class="completeVariations">
                  <summary class="small">Ver variaciones</summary>
                  <ul class="variationList small">
                    ${plate.variations.map((v) => `<li>${v}</li>`).join('')}
                  </ul>
                </details>
              </div>
            `).join('')}
          </div>
        </section>
      </div>

      <div class="tabContent hidden" id="tabHypothyroidism">
        <section class="panel special-diet">
          <div class="diet-header">
            <h2>🧬 Dieta para Hipotiroidismo y Triglicéridos Altos</h2>
            <div class="diet-info">
              <p class="muted">Platos especialmente seleccionados para personas con hipotiroidismo y triglicéridos elevados.</p>
              <details class="diet-guidelines">
                <summary class="small"><strong>Ver recomendaciones nutricionales</strong></summary>
                <div class="guidelines-content small">
                  <h4>Recomendaciones clave:</h4>
                  <ul>
                    <li>✔️ <strong>Proteínas magras:</strong> Pescados (atún, salmón), pollo sin piel, tofu, lentejas</li>
                    <li>✔️ <strong>Carbohidratos de bajo índice glucémico:</strong> Quinoa, batata, fideos integrales</li>
                    <li>✔️ <strong>Grasas saludables en moderación:</strong> Omega-3 (pescados, semillas), aguacate, aceite de oliva (poco)</li>
                    <li>✔️ <strong>Alta en fibra:</strong> Verduras al vapor, legumbres</li>
                    <li>✔️ <strong>Selenio y zinc:</strong> Importantes para la función tiroidea (presente en pescados, nueces)</li>
                    <li>❌ <strong>Evitar:</strong> Grasas saturadas en exceso, azúcares refinados, alimentos ultraprocesados</li>
                  </ul>
                  <p class="muted"><em>Nota: Consultá con tu médico o nutricionista antes de hacer cambios en tu dieta.</em></p>
                </div>
              </details>
            </div>
          </div>
          <div class="completeList" id="hypothyroidismList">
            ${completePlates
              .filter(plate => {
                // Filtrar platos apropiados: pescados magros, pollo, tofu, lentejas, verduras
                const goodProteins = ['atun', 'salmon', 'pollo', 'tofu', 'lentejas', 'omelette'];
                const goodCarbs = ['quinoa', 'batata', 'fideos_integrales', 'pure_bonato'];
                const goodFats = ['semillas_mix', 'aceite_oliva', 'nueces', 'almendras', 'tahini'];
                
                return goodProteins.includes(plate.ingredients.protein) &&
                       goodCarbs.includes(plate.ingredients.carb) &&
                       goodFats.includes(plate.ingredients.fat);
              })
              .map((plate) => `
                <div class="completeCard" data-plate-id="${plate.id}">
                  <div class="completeCardHeader">
                    <div class="completeName">${plate.name}</div>
                    <div class="completeGoalTag">${plate.goal === 'diet' ? 'Dieta' : 'Equilibrado'}</div>
                    <div class="completeGoalTag healthy">❤️ Hipotiroidismo</div>
                  </div>
                  <div class="completeDesc small muted">${plate.description}</div>
                  <button class="btnLoadPlate" data-plate-id="${plate.id}">Cargar y personalizar</button>
                  <details class="completeVariations">
                    <summary class="small">Ver variaciones</summary>
                    <ul class="variationList small">
                      ${plate.variations.map((v) => `<li>${v}</li>`).join('')}
                    </ul>
                  </details>
                </div>
              `).join('')}
          </div>
        </section>
      </div>

      <div class="tabContent hidden" id="tabPlanner">
        <section class="panel">
          <h2>Planificador Semanal (5 días)</h2>
          <p class="muted">Organizá tus comidas de la semana. Seleccioná un plato completo o armá uno personalizado para cada día.</p>
          <div class="weekPlan" id="weekPlan">
            ${['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'].map((day, index) => `
              <div class="dayCard" data-day="${index}">
                <div class="dayHeader">
                  <h3 class="dayName">${day}</h3>
                  <button class="btnSelectPlate" data-day="${index}">Elegir plato</button>
                </div>
                <div class="dayContent" id="dayContent${index}">
                  <div class="emptyDay">Sin planificar</div>
                </div>
              </div>
            `).join('')}
          </div>
          <div class="weekActions">
            <button class="btnExportWeek" id="btnExportWeek">Copiar plan semanal</button>
            <button class="btnShareWeek" id="btnShareWeek">Compartir por WhatsApp</button>
            <button class="btnClearWeek" id="btnClearWeek">Limpiar todo</button>
          </div>
        </section>

        <!-- Modal para seleccionar plato -->
        <div class="modal hidden" id="plateModal">
          <div class="modalContent">
            <div class="modalHeader">
              <h3 id="modalTitle">Seleccionar plato para Lunes</h3>
              <button class="btnCloseModal" id="btnCloseModal">&times;</button>
            </div>
            <div class="modalBody">
              <div class="plateGrid" id="plateGrid">
                ${completePlates.map((plate) => `
                  <div class="plateOption" data-plate-id="${plate.id}">
                    <div class="plateOptionName">${plate.name}</div>
                    <div class="plateOptionDesc small muted">${plate.description}</div>
                    <div class="plateOptionTags">
                      <div class="plateOptionTag">${plate.goal === 'diet' ? 'Dieta' : 'Equilibrado'}</div>
                      ${plate.healthTags?.includes('hipotiroidismo') ? '<div class="plateOptionTag healthy">❤️ Hipotiroidismo</div>' : ''}
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="tabContent hidden" id="tabCustom">
      <main class="grid">
        <section class="panel">
          <h2>Ingredientes</h2>
          <div class="field">
            <label for="goal">Objetivo</label>
            <select id="goal">
              <option value="balanced">Equilibrado (mantener)</option>
              <option value="diet">Dieta (bajar calorías)</option>
            </select>
          </div>
          <div class="field">
            <label for="protein">Proteína</label>
            <select id="protein">
              <option value="">Elige una…</option>
              ${ingredients.protein.map((i) => `<option value="${i.id}">${optionLabel(i)}</option>`).join('')}
            </select>
          </div>
          <div class="field">
            <label for="carb">Carbohidrato</label>
            <select id="carb">
              <option value="">Elige uno…</option>
              ${ingredients.carb.map((i) => `<option value="${i.id}">${optionLabel(i)}</option>`).join('')}
            </select>
          </div>
          <div class="field">
            <label for="fat">Grasa</label>
            <select id="fat">
              <option value="">Elige una…</option>
              ${ingredients.fat.map((i) => `<option value="${i.id}">${optionLabel(i)}</option>`).join('')}
            </select>
          </div>
          <div class="field">
            <label for="vegetable">Verduras (opcional, recomendado)</label>
            <select id="vegetable">
              <option value="">Sin verduras</option>
              ${ingredients.verduras.map((i) => `<option value="${i.id}">${optionLabel(i)}</option>`).join('')}
            </select>
          </div>
          <div class="field">
            <label for="servings">Cantidad de porciones (estándar)</label>
            <input id="servings" type="number" min="1" max="4" step="1" value="1" />
          </div>
        </section>

        <section class="panel">
          <h2>Plato</h2>
          <div id="plate" class="plate"></div>
          <div id="totals" class="totals"></div>
          <div class="actionButtons" id="actionButtons" style="display: none;">
            <button class="btnExport" id="btnExportText">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              Copiar lista
            </button>
            <button class="btnShare" id="btnShareWhatsApp">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              Compartir por WhatsApp
            </button>
          </div>
          <p class="hint">Valores aproximados por porción definida en cada ingrediente.</p>
        </section>
        </main>

      <section class="panel ref">
        <h2>Marco de referencia (Guía Alimentaria Uruguaya)</h2>
        <p class="muted">Extractos relevantes del PDF: <span class="mono">${reference?.source?.file ?? '—'}</span></p>
        <div class="refBox" id="refBox">
          <div class="refItem"><strong>Alimentos naturales recomendados:</strong></div>
          <div class="refItem">• <strong>Verduras y frutas:</strong> frescas, envasadas, refrigeradas, congeladas o deshidratadas como pasas y orejones.</div>
          <div class="refItem">• <strong>Legumbres:</strong> porotos, lentejas, garbanzos, chauchas, habas y arvejas.</div>
          <div class="refItem">• <strong>Carbohidratos:</strong> papas, arroz (blanco, integral o parbolizado), avena, harinas, pastas simples (frescas o secas).</div>
          <div class="refItem">• <strong>Carnes:</strong> vaca, cerdo, cordero, aves, pescados y otras, frescas o congeladas.</div>
          <div class="refItem">• <strong>Huevos</strong></div>
          <div class="refItem">• <strong>Leche:</strong> pasteurizada, ultrapasteurizada o larga vida, o en polvo; yogur natural sin agregado de azúcar.</div>
          <div class="refItem">• <strong>Semillas y frutos secos:</strong> nueces, maníes, almendras, castañas y otras semillas sin agregado de sal ni azúcar.</div>
          <div class="refItem"><strong>Principio clave:</strong></div>
          <div class="refItem">Combinar alimentos de origen vegetal —como verduras, frutas, porotos, lentejas y garbanzos, fideos, arroz o polenta— con alimentos de origen animal —como huevos y leche, y cantidades moderadas de carnes— se obtiene una alimentación nutricionalmente equilibrada.</div>
          <div class="refItem"><strong>Objetivo nutricional:</strong></div>
          <div class="refItem">Basá tu alimentación en alimentos naturales y evitá el consumo de productos ultraprocesados en el día a día, con excesiva cantidad de grasas, azúcar y sal.</div>
        </div>
      </section>
      </div>
    </div>
  `;
}

function updateComputed() {
  const proteinId = document.querySelector('#protein').value;
  const carbId = document.querySelector('#carb').value;
  const fatId = document.querySelector('#fat').value;
  const vegetableId = document.querySelector('#vegetable')?.value;
  const goal = document.querySelector('#goal')?.value ?? 'balanced';
  const servingsRaw = document.querySelector('#servings')?.value ?? '1';
  let servings = Number.parseInt(servingsRaw, 10);
  if (!Number.isFinite(servings) || servings < 1) servings = 1;
  if (servings > 4) servings = 4;
  if (document.querySelector('#servings') && document.querySelector('#servings').value !== String(servings)) {
    document.querySelector('#servings').value = String(servings);
  }

  const selected = [
    findById(ingredients.protein, proteinId),
    findById(ingredients.carb, carbId),
    findById(ingredients.fat, fatId)
  ].filter(Boolean);

  // Verduras opcionales
  const vegetable = vegetableId ? findById(ingredients.verduras, vegetableId) : null;
  if (vegetable) selected.push(vegetable);

  const plate = document.querySelector('#plate');
  const totals = document.querySelector('#totals');

  if (selected.length < 3) {
    plate.innerHTML = `
      <div class="empty">
        <div class="muted">Selecciona al menos 1 proteína, 1 carbohidrato y 1 grasa.</div>
      </div>
    `;
    totals.innerHTML = '';
    return;
  }

  const perPlate = sumMacros(selected);
  const total = {
    kcal: perPlate.kcal * servings,
    p: perPlate.p * servings,
    c: perPlate.c * servings,
    f: perPlate.f * servings
  };

  plate.innerHTML = `
    <div class="plateList">
      ${selected
        .map(
          (i) => `
            <div class="plateRow">
              <div>
                <div class="name">${i.name}</div>
                <div class="muted small">${i.serving}</div>
              </div>
              <div class="muted small">${i.kcal} kcal</div>
            </div>
          `
        )
        .join('')}
    </div>
  `;

  const evaluation = evaluatePlate(perPlate, goal);

  totals.innerHTML = `
    <div class="kpiRow">
      <div class="kpi">
        <div class="kpiLabel">Calorías</div>
        <div class="kpiValue">${formatNumber(total.kcal)} kcal</div>
        <div class="muted small">(${formatNumber(perPlate.kcal)} kcal por porción × ${servings})</div>
      </div>
      <div class="kpi">
        <div class="kpiLabel">Proteínas</div>
        <div class="kpiValue">${formatNumber(total.p)} g</div>
        <div class="muted small">${formatNumber(perPlate.p)} g por porción</div>
      </div>
      <div class="kpi">
        <div class="kpiLabel">Carbohidratos</div>
        <div class="kpiValue">${formatNumber(total.c)} g</div>
        <div class="muted small">${formatNumber(perPlate.c)} g por porción</div>
      </div>
      <div class="kpi">
        <div class="kpiLabel">Grasas</div>
        <div class="kpiValue">${formatNumber(total.f)} g</div>
        <div class="muted small">${formatNumber(perPlate.f)} g por porción</div>
      </div>
    </div>
    <div class="evalBox eval-${evaluation.level}">
      <div class="evalTitle">Evaluación del plato (por porción estándar)</div>
      <div class="small">${evaluation.summary}</div>
      ${evaluation.notes.length
        ? `<ul class="evalList">${evaluation.notes.map((n) => `<li>${n}</li>`).join('')}</ul>`
        : ''}
      <div class="evalRange small muted">
        Objetivo: ${goal === 'diet' ? 'Dieta (bajar calorías)' : 'Equilibrado (mantener)'} · rangos: ${evaluation.targets.kcal.min}-${evaluation.targets.kcal.max} kcal · proteína ${evaluation.targets.protein.min}-${evaluation.targets.protein.max} g · HC ${evaluation.targets.carbs.min}-${evaluation.targets.carbs.max} g · grasas ${evaluation.targets.fat.min}-${evaluation.targets.fat.max} g.
      </div>
    </div>
  `;

  // Mostrar botones de acción cuando hay plato completo
  const actionButtons = document.querySelector('#actionButtons');
  if (actionButtons) {
    actionButtons.style.display = 'flex';
  }
}

function generateShoppingList() {
  const proteinId = document.querySelector('#protein').value;
  const carbId = document.querySelector('#carb').value;
  const fatId = document.querySelector('#fat').value;
  const vegetableId = document.querySelector('#vegetable')?.value;
  const servings = Number.parseInt(document.querySelector('#servings')?.value ?? '1', 10);

  const selected = [
    findById(ingredients.protein, proteinId),
    findById(ingredients.carb, carbId),
    findById(ingredients.fat, fatId)
  ].filter(Boolean);

  const vegetable = vegetableId ? findById(ingredients.verduras, vegetableId) : null;
  if (vegetable) selected.push(vegetable);

  if (selected.length < 3) return null;

  const lines = [
    '🍽️ *Lista de Ingredientes - Poke Plato UY*',
    '',
    `Porciones: ${servings}`,
    ''
  ];

  selected.forEach((item) => {
    lines.push(`• ${item.name}: ${item.serving}`);
  });

  lines.push('');
  lines.push('📊 *Totales*');
  const perPlate = sumMacros(selected);
  const total = {
    kcal: perPlate.kcal * servings,
    p: perPlate.p * servings,
    c: perPlate.c * servings,
    f: perPlate.f * servings
  };
  lines.push(`Calorías: ${formatNumber(total.kcal)} kcal`);
  lines.push(`Proteínas: ${formatNumber(total.p)} g`);
  lines.push(`Carbohidratos: ${formatNumber(total.c)} g`);
  lines.push(`Grasas: ${formatNumber(total.f)} g`);

  return lines.join('\n');
}

function copyToClipboard() {
  const text = generateShoppingList();
  if (!text) return;

  navigator.clipboard.writeText(text).then(() => {
    const btn = document.querySelector('#btnExportText');
    const originalText = btn.innerHTML;
    btn.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
      ¡Copiado!
    `;
    btn.classList.add('success');
    setTimeout(() => {
      btn.innerHTML = originalText;
      btn.classList.remove('success');
    }, 2000);
  }).catch(() => {
    alert('No se pudo copiar al portapapeles');
  });
}

function shareWhatsApp() {
  const text = generateShoppingList();
  if (!text) return;

  const encodedText = encodeURIComponent(text);
  const whatsappUrl = `https://wa.me/?text=${encodedText}`;
  window.open(whatsappUrl, '_blank');
}

// Planificador semanal
const weeklyPlan = {
  days: [null, null, null, null, null] // 5 días: Lunes a Viernes
};

let currentDaySelecting = null;

function openPlateModal(dayIndex) {
  currentDaySelecting = dayIndex;
  const dayNames = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
  document.querySelector('#modalTitle').textContent = `Seleccionar plato para ${dayNames[dayIndex]}`;
  document.querySelector('#plateModal').classList.remove('hidden');
}

function closePlateModal() {
  document.querySelector('#plateModal').classList.add('hidden');
  currentDaySelecting = null;
}

function selectPlateForDay(plateId) {
  if (currentDaySelecting === null) return;
  
  const plate = completePlates.find((p) => p.id === plateId);
  if (!plate) return;

  weeklyPlan.days[currentDaySelecting] = plate;
  renderDayContent(currentDaySelecting);
  closePlateModal();
}

function renderDayContent(dayIndex) {
  const plate = weeklyPlan.days[dayIndex];
  const dayContent = document.querySelector(`#dayContent${dayIndex}`);
  
  if (!plate) {
    dayContent.innerHTML = '<div class="emptyDay">Sin planificar</div>';
    return;
  }

  // Calcular macros del plato
  const selected = [
    findById(ingredients.protein, plate.ingredients.protein),
    findById(ingredients.carb, plate.ingredients.carb),
    findById(ingredients.fat, plate.ingredients.fat)
  ].filter(Boolean);

  if (plate.ingredients.vegetable) {
    const veg = findById(ingredients.verduras, plate.ingredients.vegetable);
    if (veg) selected.push(veg);
  }

  const macros = sumMacros(selected);

  dayContent.innerHTML = `
    <div class="dayPlate">
      <div class="dayPlateName">${plate.name}</div>
      <div class="dayPlateIngredients small muted">
        ${selected.map(i => i.name).join(' • ')}
      </div>
      <div class="dayPlateMacros small">
        ${Math.round(macros.kcal)} kcal • ${Math.round(macros.p)}g P • ${Math.round(macros.c)}g C • ${Math.round(macros.f)}g G
      </div>
      <button class="btnRemoveDay" data-day="${dayIndex}">Quitar</button>
    </div>
  `;

  // Event listener para quitar
  dayContent.querySelector('.btnRemoveDay').addEventListener('click', (e) => {
    const day = parseInt(e.target.dataset.day);
    weeklyPlan.days[day] = null;
    renderDayContent(day);
  });
}

function generateWeeklyPlan() {
  const dayNames = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
  const lines = [
    '📅 *Plan Semanal - Poke Plato UY*',
    ''
  ];

  let totalKcal = 0;
  let totalP = 0;
  let totalC = 0;
  let totalF = 0;
  let daysPlanned = 0;

  weeklyPlan.days.forEach((plate, index) => {
    lines.push(`*${dayNames[index]}*`);
    
    if (!plate) {
      lines.push('Sin planificar');
    } else {
      lines.push(`${plate.name}`);
      
      const selected = [
        findById(ingredients.protein, plate.ingredients.protein),
        findById(ingredients.carb, plate.ingredients.carb),
        findById(ingredients.fat, plate.ingredients.fat)
      ].filter(Boolean);

      if (plate.ingredients.vegetable) {
        const veg = findById(ingredients.verduras, plate.ingredients.vegetable);
        if (veg) selected.push(veg);
      }

      const macros = sumMacros(selected);
      lines.push(`  • ${selected.map(i => i.name).join(', ')}`);
      lines.push(`  • ${Math.round(macros.kcal)} kcal | ${Math.round(macros.p)}g P | ${Math.round(macros.c)}g C | ${Math.round(macros.f)}g G`);
      
      totalKcal += macros.kcal;
      totalP += macros.p;
      totalC += macros.c;
      totalF += macros.f;
      daysPlanned++;
    }
    
    lines.push('');
  });

  if (daysPlanned > 0) {
    lines.push(`📊 *Totales semanales (${daysPlanned} días)*`);
    lines.push(`Calorías: ${Math.round(totalKcal)} kcal`);
    lines.push(`Proteínas: ${Math.round(totalP)} g`);
    lines.push(`Carbohidratos: ${Math.round(totalC)} g`);
    lines.push(`Grasas: ${Math.round(totalF)} g`);
    lines.push('');
    lines.push(`Promedio diario: ${Math.round(totalKcal / daysPlanned)} kcal`);
  }

  return lines.join('\n');
}

function copyWeeklyPlan() {
  const text = generateWeeklyPlan();
  
  navigator.clipboard.writeText(text).then(() => {
    const btn = document.querySelector('#btnExportWeek');
    const originalText = btn.textContent;
    btn.textContent = '¡Copiado!';
    btn.classList.add('success');
    setTimeout(() => {
      btn.textContent = originalText;
      btn.classList.remove('success');
    }, 2000);
  }).catch(() => {
    alert('No se pudo copiar al portapapeles');
  });
}

function shareWeeklyPlan() {
  const text = generateWeeklyPlan();
  const encodedText = encodeURIComponent(text);
  const whatsappUrl = `https://wa.me/?text=${encodedText}`;
  window.open(whatsappUrl, '_blank');
}

function clearWeeklyPlan() {
  if (!confirm('¿Seguro que querés limpiar todo el plan semanal?')) return;
  
  weeklyPlan.days = [null, null, null, null, null];
  weeklyPlan.days.forEach((_, index) => renderDayContent(index));
}

function switchTab(tabName) {
  document.querySelectorAll('.tabBtn').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.tab === tabName);
  });
  document.querySelectorAll('.tabContent').forEach((content) => {
    content.classList.toggle('hidden', content.id !== `tab${tabName.charAt(0).toUpperCase() + tabName.slice(1)}`);
  });
}

function loadCompletePlate(plateId) {
  const plate = completePlates.find((p) => p.id === plateId);
  if (!plate) return;

  // Cambiar a vista de armado
  switchTab('custom');

  document.querySelector('#goal').value = plate.goal;
  document.querySelector('#protein').value = plate.ingredients.protein;
  document.querySelector('#carb').value = plate.ingredients.carb;
  document.querySelector('#fat').value = plate.ingredients.fat;
  document.querySelector('#vegetable').value = plate.ingredients.vegetable || ''; // Sin verduras si no está definido
  document.querySelector('#servings').value = '1';

  updateComputed();

  // Scroll suave al panel de ingredientes
  setTimeout(() => {
    document.querySelector('.grid')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 100);
}

renderApp();

// Event listeners para pestañas
document.querySelectorAll('.tabBtn').forEach((btn) => {
  btn.addEventListener('click', (e) => {
    switchTab(e.target.dataset.tab);
  });
});

// Event listeners para ingredientes
document.querySelector('#protein').addEventListener('change', updateComputed);
document.querySelector('#carb').addEventListener('change', updateComputed);
document.querySelector('#fat').addEventListener('change', updateComputed);
document.querySelector('#vegetable').addEventListener('change', updateComputed);
document.querySelector('#servings').addEventListener('input', updateComputed);
document.querySelector('#goal').addEventListener('change', updateComputed);

// Event listeners para botones de exportar/compartir
document.querySelector('#btnExportText')?.addEventListener('click', copyToClipboard);
document.querySelector('#btnShareWhatsApp')?.addEventListener('click', shareWhatsApp);

// Event listeners para botones de platos completos
document.querySelectorAll('.btnLoadPlate').forEach((btn) => {
  btn.addEventListener('click', (e) => {
    const plateId = e.target.dataset.plateId;
    loadCompletePlate(plateId);
  });
});

// Event listeners para planificador semanal
document.querySelectorAll('.btnSelectPlate').forEach((btn) => {
  btn.addEventListener('click', (e) => {
    const day = parseInt(e.target.dataset.day);
    openPlateModal(day);
  });
});

document.querySelector('#btnCloseModal')?.addEventListener('click', closePlateModal);

document.querySelector('#plateModal')?.addEventListener('click', (e) => {
  if (e.target.id === 'plateModal') closePlateModal();
});

document.querySelectorAll('.plateOption').forEach((option) => {
  option.addEventListener('click', (e) => {
    const plateId = e.currentTarget.dataset.plateId;
    selectPlateForDay(plateId);
  });
});

document.querySelector('#btnExportWeek')?.addEventListener('click', copyWeeklyPlan);
document.querySelector('#btnShareWeek')?.addEventListener('click', shareWeeklyPlan);
document.querySelector('#btnClearWeek')?.addEventListener('click', clearWeeklyPlan);

updateComputed();
