# Quizy szkolne – zasady projektu

Statyczny serwis z quizami dla uczniów szkoły podstawowej. Bez serwera, bez kont, bez zbierania danych.
Hostowany na GitHub Pages z gałęzi `main` (katalog główny repozytorium).

## Sposób pracy
1. **Najpierw propozycja, potem kod.** Przy nowym quizie lub dużej zmianie opisz plan (zakres, poziomy, typy zadań, jak wygląda informacja zwrotna) i poczekaj na akceptację.
2. Pisz po polsku: interfejs, komentarze w kodzie, komunikaty, nazwy plików i folderów (bez polskich znaków w nazwach plików).
3. Przed zakończeniem pracy uruchom `npm test`. Nowy quiz z generatorem musi mieć własny plik testów.

## Struktura
```
index.html              strona główna (katalog), czyta katalog.js
katalog.js              lista quizów – każdy nowy quiz dopisz tutaj
manifest.webmanifest    PWA (instalacja na telefonie)
sw.js                   service worker: działanie bez internetu
wspolne/styl.css        wspólne tokeny kolorów i komponenty (panel, chip, btn, fb, steps, badges…)
wspolne/pwa.js          rejestracja service workera – dołącz na każdej stronie
<przedmiot>/<quiz>/     jeden folder na quiz
  index.html            interfejs quizu
  logika.js             (dla generatorów) czysta logika bez DOM – testowana
tests/<quiz>.test.mjs   testy logiki (node:test, bez zależności)
```

## Jak dodać quiz
1. Utwórz folder `<przedmiot>/<nazwa>/` (np. `biologia/komorka/`).
2. W `index.html` quizu dołącz: `../../wspolne/styl.css`, `../../manifest.webmanifest`, ikony z `../../wspolne/`, a na końcu `../../wspolne/pwa.js` (z `defer`). Dodaj link „← Wszystkie quizy” do `../../`.
3. Logikę zadań trzymaj w `logika.js` jako zwykły skrypt (nie moduł), bez odwołań do `document`/`window`. Testy wczytują ją przez `tests/pomocnicze.mjs`.
4. Dopisz wpis w `katalog.js`.
5. Dodaj `tests/<nazwa>.test.mjs` i uruchom `npm test`.

Wzorcem jest `matematyka/ulamki/`.

## Zasady merytoryczne
- **Generatory zamiast stałych list** wszędzie, gdzie się da (matematyka, fizyka, chemia). Zadania losowane według reguł poziomu, odrzucane gdy wynik jest nieładny (ujemny, za duży, nieskończony ułamek dziesiętny). Dzielenie układaj „od końca” (dzielnik × wynik = dzielna).
- **Dokładna arytmetyka**: ułamki jako `{n, d}`, nigdy porównywanie liczb zmiennoprzecinkowych.
- **Banki pytań** (historia, biologia, geografia, języki) jako dane w osobnym pliku, nie w kodzie interfejsu.
- **Każda błędna odpowiedź = rozwiązanie krok po kroku**, wyliczone z liczb danego zadania. Podpowiedź pokazuje pierwszy krok.
- Zapis jak w polskiej szkole: przecinek dziesiętny, „·” mnożenie, „:” dzielenie, „−” odejmowanie, ułamki z kreską poziomą. Zgodność z podstawą programową dla danej klasy.
- Akceptuj odpowiedzi równoważne (np. kropka i przecinek, nieskrócony ułamek na niższych poziomach) i mów, co poprawić.
- Trzy poziomy: Łatwy / Średni / Trudny. Ocena w skali 1–6.

## Zasady techniczne i wygląd
- Styl „zeszyt w kratkę” z `wspolne/styl.css`. Kolory tylko przez tokeny (`var(--accent)` itd.), oba motywy: jasny i ciemny.
- Czcionki z Google Fonts: Baloo 2 (nagłówki), Nunito (tekst), JetBrains Mono (działania w słupku).
- Musi działać na telefonie (szerokość ~375 px), bez poziomego przewijania; duże pola i przyciski.
- Wszystkie ścieżki **względne** (serwis działa pod adresem `/<repozytorium>/` na GitHub Pages).
- `localStorage` tylko w try/catch, klucz z sufiksem wersji (np. `ulamkowy-trening-v1`). Jeśli zapisujesz `{best:{poziom:procent}}`, katalog pokaże najlepszy wynik.
- **Żadnych danych osobowych** poza imieniem/pseudonimem w przeglądarce ucznia. Bez analityki z ciasteczkami. Dane dzieci = RODO, więc backend dopiero po świadomej decyzji.
- Bez bibliotek, jeśli nie są naprawdę potrzebne. Bez kroku budowania.

## Uruchomienie lokalne
`npm start` → http://localhost:8080 (service worker działa tylko przez http, nie z `file://`).
