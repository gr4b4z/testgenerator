import { test } from 'node:test';
import assert from 'node:assert/strict';
import { wczytajLogike } from './pomocnicze.mjs';

const L = wczytajLogike('../matematyka/ulamki/logika.js', [
  'F', 'calc', 'fEq', 'isTerm', 'decStr', 'decPlaces', 'genFrac', 'genDec', 'genMix', 'stepsFor', 'hintFor', 'opH',
]);
const OPS = ['+', '-', '·', ':'];
const GENS = { frac: L.genFrac, dec: L.genDec, mix: L.genMix };
const PROB = 1500; // zadań na każdą kombinację poziom × działanie × rodzaj

test('arytmetyka ułamków jest dokładna', () => {
  assert.ok(L.fEq(L.calc('+', L.F(1, 10), L.F(2, 10)), L.F(3, 10)));
  assert.ok(L.fEq(L.calc(':', L.F(3, 4), L.F(3, 8)), L.F(2)));
  assert.equal(L.decStr(L.F(275, 100)), '2,75');
  assert.equal(L.decStr(L.F(5, 2), 2), '2,50');
  assert.equal(L.decPlaces(L.F(1, 3)), -1);
});

for (const [cat, gen] of Object.entries(GENS)) {
  for (const level of [1, 2, 3]) {
    for (const op of OPS) {
      test(`${cat}, poziom ${level}, działanie ${op}: poprawne zadania i rozwiązania`, () => {
        for (let i = 0; i < PROB; i++) {
          const q = gen(op, level);
          const opis = JSON.stringify({ a: q.a, b: q.b, r: q.r });
          assert.ok(L.fEq(L.calc(q.op, q.a.v, q.b.v), q.r), `zły wynik: ${opis}`);
          assert.ok(q.r.n >= 0, `ujemny wynik: ${opis}`);
          if (cat !== 'frac') assert.ok(L.isTerm(q.r), `wynik nie jest skończonym ułamkiem dziesiętnym: ${opis}`);
          for (const o of [q.a, q.b]) if (o.form === 'dec') assert.ok(L.isTerm(o.v), `liczba dziesiętna nieskończona: ${opis}`);
          const tekst = L.stepsFor(q).join(' ') + L.hintFor(q) + L.opH(q.a) + L.opH(q.b);
          assert.doesNotMatch(tekst, /undefined|NaN|Infinity/, `błąd w tekście rozwiązania: ${opis}`);
        }
      });
    }
  }
}
