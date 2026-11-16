# Quizy szkolne

Ćwiczenia dla uczniów szkoły podstawowej, które za każdym razem losują nowe zadania i po błędzie pokazują rozwiązanie krok po kroku.
Działają w przeglądarce, na telefonie można je zainstalować jak aplikację, a otwarte wcześniej quizy działają bez internetu.

| Przedmiot | Quiz | Klasy |
|---|---|---|
| Matematyka | [Ułamkowy Trening](matematyka/ulamki/) – działania na ułamkach zwykłych i dziesiętnych | 5–6 |

## Uruchomienie na komputerze
```bash
npm start
```
Otwórz http://localhost:8080. Testy generatorów zadań:
```bash
npm test
```
Nie trzeba niczego instalować poza Node.js (do testów) i Pythonem (do lokalnego serwera; jest na macOS).

## Publikacja
Serwis: **https://testmaniak.3asg.eu/**

Każdy `git push` na `main` uruchamia w GitHub Actions testy, a gdy przejdą, publikuje stronę na GitHub Pages
(plik `.github/workflows/publikacja.yml`, postęp w zakładce **Actions**). Gdy testy nie przejdą, na stronie zostaje poprzednia wersja.

Ustawienia w **Settings → Pages**: Source = **GitHub Actions**, domena `testmaniak.3asg.eu`, zaznaczone **Enforce HTTPS**
(bez HTTPS nie działa tryb offline i instalacja na telefonie).

## Dodawanie quizów
Zasady i struktura są w [CLAUDE.md](CLAUDE.md). W skrócie: nowy folder `<przedmiot>/<quiz>/`, wpis w `katalog.js`, testy w `tests/`.

## Prywatność
Serwis nie ma kont i nie wysyła żadnych danych. Imię, wyniki i odznaki są zapisywane wyłącznie w przeglądarce ucznia.
