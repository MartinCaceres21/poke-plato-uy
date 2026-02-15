import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { PDFParse } from 'pdf-parse';

function parseArgs(argv) {
	const args = {
		input: null,
		out: null,
		maxItems: 80,
		maxExcerptChars: 220,
		minLineLen: 18,
		keywords: [],
		dumpText: null,
	};

	for (let i = 0; i < argv.length; i++) {
		const a = argv[i];
		if (a === '--in') args.input = argv[++i];
		else if (a === '--out') args.out = argv[++i];
		else if (a === '--maxItems') args.maxItems = Number(argv[++i]);
		else if (a === '--maxExcerptChars') args.maxExcerptChars = Number(argv[++i]);
		else if (a === '--minLineLen') args.minLineLen = Number(argv[++i]);
		else if (a === '--keywords') args.keywords = String(argv[++i] ?? '').split(',').map(s => s.trim()).filter(Boolean);
		else if (a === '--dumpText') args.dumpText = argv[++i];
		else if (a === '--help' || a === '-h') args.help = true;
	}

	return args;
}

function normalizeLine(line) {
	return line
		.replace(/\s+/g, ' ')
		.replace(/[\u0000-\u001F]/g, '')
		.trim();
}

function isLikelyHeading(line) {
	if (line.length < 6 || line.length > 90) return false;
	// Headings tend to be title-case / uppercase and not end with a period.
	const endsWithPeriod = /[.]$/.test(line);
	if (endsWithPeriod) return false;

	const letters = (line.match(/[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]/g) ?? []).length;
	if (letters < 6) return false;

	const upper = (line.match(/[A-ZÁÉÍÓÚÜÑ]/g) ?? []).length;
	const ratio = upper / Math.max(letters, 1);
	return ratio > 0.35;
}

function shortHash(s) {
	let h = 2166136261;
	for (let i = 0; i < s.length; i++) {
		h ^= s.charCodeAt(i);
		h = Math.imul(h, 16777619);
	}
	return (h >>> 0).toString(16);
}

function takeExcerpt(line, maxChars) {
	if (line.length <= maxChars) return line;
	return `${line.slice(0, maxChars - 1).trim()}…`;
}

function selectReferenceLines(lines, { maxItems, maxExcerptChars, minLineLen, keywords }) {
	const cleaned = lines
		.map(normalizeLine)
		.filter(Boolean)
		.filter(l => l.length >= minLineLen)
		// Drop obvious page artifacts
		.filter(l => !/^\d+\s*(de|\/|-)\s*\d+$/i.test(l))
		.filter(l => !/^p\.?\s*\d+$/i.test(l));

	const uniq = [];
	const seen = new Set();
	for (const l of cleaned) {
		const key = l.toLowerCase();
		if (seen.has(key)) continue;
		seen.add(key);
		uniq.push(l);
	}

	const keywordSet = new Set(keywords.map(k => k.toLowerCase()));
	const scored = uniq.map((l, idx) => {
		let score = 0;
		if (isLikelyHeading(l)) score += 6;
		if (/[0-9][0-9.,]*\s*(kcal|calor[ií]as|g\b|gramos|mg\b)/i.test(l)) score += 3;
		if (/(porci[oó]n|raci[oó]n|tamañ[oó]|equivalen|recomendad|objetivo|gu[ií]a|tabla)/i.test(l)) score += 2;
		if (keywordSet.size) {
			for (const k of keywordSet) {
				if (k && l.toLowerCase().includes(k)) score += 4;
			}
		}
		// earlier lines slightly preferred
		score += Math.max(0, 1.5 - idx / 800);
		return { l, score };
	});

	scored.sort((a, b) => b.score - a.score);

	const selected = [];
	const selectedKeys = new Set();
	for (const { l } of scored) {
		const ex = takeExcerpt(l, maxExcerptChars);
		const key = ex.toLowerCase();
		if (selectedKeys.has(key)) continue;
		selectedKeys.add(key);
		selected.push({ id: shortHash(ex), text: ex });
		if (selected.length >= maxItems) break;
	}

	return selected;
}

async function main() {
	const args = parseArgs(process.argv.slice(2));
	if (args.help || !args.input) {
		console.log(`Uso:\n  node scripts/parse-pdf-reference.mjs --in "C:\\ruta\\archivo.pdf" --out "src\\reference\\reference.json"\n\nOpciones:\n  --maxItems 80\n  --maxExcerptChars 220\n  --minLineLen 18\n  --keywords "kcal,porción,proteína"\n  --dumpText "src\\reference\\raw.txt"`);
		process.exit(args.help ? 0 : 1);
	}

	const inputPath = path.resolve(args.input);
	const outPath = path.resolve(args.out ?? 'src/reference/reference.json');
	const dumpTextPath = args.dumpText ? path.resolve(args.dumpText) : null;

	const dataBuffer = await fs.readFile(inputPath);

	const parser = new PDFParse({ data: dataBuffer });
	let totalPages = null;
	let text = '';
	try {
		const info = await parser.getInfo({ parsePageInfo: false });
		totalPages = info?.total ?? null;

		const textResult = await parser.getText();
		text = String(textResult?.text ?? '');
	} finally {
		await parser.destroy();
	}

	if (dumpTextPath) {
		await fs.mkdir(path.dirname(dumpTextPath), { recursive: true });
		await fs.writeFile(dumpTextPath, text, 'utf8');
	}

	const lines = text.split(/\r?\n/);

	const items = selectReferenceLines(lines, args);
	const payload = {
		source: {
			file: path.basename(inputPath),
			pages: totalPages,
			generatedAt: new Date().toISOString(),
		},
		// This is an intentionally compact, excerpted index for local reference.
		items,
	};

	await fs.mkdir(path.dirname(outPath), { recursive: true });
	await fs.writeFile(outPath, JSON.stringify(payload, null, 2), 'utf8');
	console.log(`OK: referencia generada en ${outPath} (items: ${items.length})`);
}

main().catch((err) => {
	console.error('ERROR:', err);
	process.exit(1);
});
