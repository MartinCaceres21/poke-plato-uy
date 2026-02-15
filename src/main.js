import './style.css';
import { ingredients } from './data/ingredients.js';
import { mealTargets } from './data/targets.js';
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

function evaluatePlate(perPortion) {
  const kcalClass = classify(perPortion.kcal, mealTargets.kcal);
  const pClass = classify(perPortion.p, mealTargets.protein);
  const cClass = classify(perPortion.c, mealTargets.carbs);
  const fClass = classify(perPortion.f, mealTargets.fat);

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
    notes
  };
}

function renderApp() {
  document.querySelector('#app').innerHTML = `
    <div class="shell">
      <header class="header">
        <div>
          <h1>Poke Plato UY</h1>
          <p class="muted">Arma tu plato eligiendo exactamente 3 ingredientes (1 proteína, 1 carbohidrato, 1 grasa). Se calculan calorías y macros en vivo.</p>
        </div>
        <div class="chip">PDF: marco de referencia compacto</div>
      </header>

      <main class="grid">
        <section class="panel">
          <h2>Ingredientes</h2>
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
            <label for="servings">Cantidad de porciones (estándar)</label>
            <input id="servings" type="number" min="1" max="4" step="1" value="1" />
          </div>
        </section>

        <section class="panel">
          <h2>Plato</h2>
          <div id="plate" class="plate"></div>
          <div id="totals" class="totals"></div>
          <p class="hint">Valores aproximados por porción definida en cada ingrediente.</p>
        </section>
      </main>

      <section class="panel ref">
        <h2>Marco de referencia (PDF resumido)</h2>
        <p class="muted">Se generan extractos cortos desde tu PDF local: <span class="mono">${reference?.source?.file ?? '—'}</span>.</p>
        <div class="refBox" id="refBox">
          ${(reference?.items ?? []).map((it) => `<div class="refItem">${it.text}</div>`).join('') || '<div class="muted">Aún no hay referencia. Ejecuta: <span class="mono">npm run ref:pdf:kw</span></div>'}
        </div>
      </section>
    </div>
  `;
}

function updateComputed() {
  const proteinId = document.querySelector('#protein').value;
  const carbId = document.querySelector('#carb').value;
  const fatId = document.querySelector('#fat').value;
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

  const plate = document.querySelector('#plate');
  const totals = document.querySelector('#totals');

  if (selected.length !== 3) {
    plate.innerHTML = `
      <div class="empty">
        <div class="muted">Selecciona 1 ingrediente por categoría.</div>
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

  const evaluation = evaluatePlate(perPlate);

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
        Rangos de referencia: ${mealTargets.kcal.min}-${mealTargets.kcal.max} kcal · proteína ${mealTargets.protein.min}-${mealTargets.protein.max} g · HC ${mealTargets.carbs.min}-${mealTargets.carbs.max} g · grasas ${mealTargets.fat.min}-${mealTargets.fat.max} g.
      </div>
    </div>
  `;
}

renderApp();
document.querySelector('#protein').addEventListener('change', updateComputed);
document.querySelector('#carb').addEventListener('change', updateComputed);
document.querySelector('#fat').addEventListener('change', updateComputed);
document.querySelector('#servings').addEventListener('input', updateComputed);
updateComputed();
