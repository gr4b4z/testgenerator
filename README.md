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

## Publikacja na GitHub Pages (jednorazowo)
1. Wyślij kod na GitHuba (`git push`).
2. Na stronie repozytorium: **Settings → Pages**.
3. W **Build and deployment → Source** wybierz **Deploy from a branch**, gałąź **main**, folder **/ (root)**, i kliknij **Save**.
4. Po 1–2 minutach serwis będzie pod adresem `https://<nazwa-użytkownika>.github.io/<nazwa-repozytorium>/`.

Każdy kolejny `git push` na `main` publikuje nową wersję automatycznie. Testy uruchamiają się przy każdym pushu (zakładka **Actions**).

Uwaga: GitHub Pages w darmowym planie wymaga **publicznego** repozytorium.

## Dodawanie quizów
Zasady i struktura są w [CLAUDE.md](CLAUDE.md). W skrócie: nowy folder `<przedmiot>/<quiz>/`, wpis w `katalog.js`, testy w `tests/`.

## Prywatność
Serwis nie ma kont i nie wysyła żadnych danych. Imię, wyniki i odznaki są zapisywane wyłącznie w przeglądarce ucznia.
