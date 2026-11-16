// Wczytuje plik logiki quizu (zwykły skrypt przeglądarkowy) do odizolowanego kontekstu
// i zwraca wskazane funkcje. Dzięki temu logika nie musi znać Node ani modułów.
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

export function wczytajLogike(sciezka, nazwy) {
  const kod = readFileSync(new URL(sciezka, import.meta.url), 'utf8');
  const ctx = vm.createContext({ Math, console });
  return vm.runInContext(`${kod}\n;({${nazwy.join(',')}})`, ctx, { filename: sciezka });
}
