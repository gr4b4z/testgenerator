// Lista quizów pokazywanych na stronie głównej.
// Nowy quiz = nowy wpis tutaj (patrz CLAUDE.md → „Jak dodać quiz”).
//   przedmiot   – nazwa przedmiotu (grupuje kafelki)
//   tytul       – nazwa quizu
//   klasy       – dla których klas, np. "kl. 5–6"
//   opis        – jedno zdanie, co się ćwiczy
//   sciezka     – folder quizu względem strony głównej (z ukośnikiem na końcu)
//   znak        – krótki symbol na kafelku (1–4 znaki)
//   pamiec      – klucz localStorage quizu; jeśli zapisuje {best:{poziom:procent}}, katalog pokaże najlepszy wynik
window.KATALOG = [
  {
    przedmiot: 'Matematyka',
    tytul: 'Ułamkowy Trening',
    klasy: 'kl. 5–6',
    opis: 'Dodawanie, odejmowanie, mnożenie i dzielenie ułamków zwykłych i dziesiętnych.',
    sciezka: 'matematyka/ulamki/',
    znak: '¾',
    pamiec: 'ulamkowy-trening-v1',
  },
];
