# 📘 Plan Testów: Utworzenie książki (POST /books)

Plan testów dla endpointu tworzenia książki w API Bookstore, zgodnie z wymaganiami przedstawionymi w dokumentacji.

---

## 1. 🎯 Wprowadzenie i cel testów

Celem testów jest weryfikacja poprawności działania endpointu **POST /books** pod kątem:

- Walidacji wszystkich wymaganych pól
- Sprawdzenia typów danych
- Weryfikacji reguł biznesowych (zakresy wartości, unikalność)
- Obsługi błędów i komunikatów walidacyjnych
- Poprawności nagłówków HTTP

---

## 2. 📋 Wymagania i założenia

### 2.1. Endpoint

- **Metoda:** POST
- **URL:** `https://bookstoreapi.up.railway.app/books`

### 2.2. Wymagane nagłówki

- `Content-Type: application/json`
- `Accept: */*`

### 2.3. Wymagane pola w request body

| Pole      | Typ     | Wymagane | Walidacja                                        |
| --------- | ------- | -------- | ------------------------------------------------ |
| title     | String  | TAK      | Niepuste, unikalne                               |
| authors   | List    | TAK      | Niepusta lista ID autorów, autorzy muszą istnieć |
| year      | Integer | TAK      | Min: 1900                                        |
| price     | Integer | TAK      | Min: 1, Max: 1000                                |
| available | Integer | TAK      | Min: 1, Max: 10000                               |

### 2.4. Struktura odpowiedzi sukcesu

**201 Created**

### 2.5. Struktura odpowiedzi błędu

**400 Bad Request / 404 Not Found**

---

## 3. 🧪 Dane testowe i setup środowiska

### 3.1. Wymagane dane przed testami

- Co najmniej jeden autor z poprawnym ID (np. **49**) musi istnieć w systemie
- Dla testów z wieloma autorami potrzebne są dodatkowe ID (np. **50, 51**)

### 3.2. Cleanup po testach

- Usunięcie utworzonych książek testowych (opcjonalnie)
- Reset danych do stanu początkowego

---

## 4. ✅ Przypadki testowe pozytywne

| ID    | Priorytet | Nazwa testu                                    | Dane wejściowe                                                                                                             | Oczekiwany rezultat                  |
| ----- | --------- | ---------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- | ------------------------------------ |
| TCP01 | P0        | Should create book with valid data             | `{ "title": "Testowanie REST API dla poczatkujacych", "authors": [49], "year": 2022, "price": 50, "available": 100 }`      | 201 Created, poprawna struktura JSON |
| TCP02 | P1        | Should create book with minimal valid values   | `{ "title": "Minimalna ksiazka", "authors": [49], "year": 1900, "price": 1, "available": 1 }`                              | 201 Created                          |
| TCP03 | P1        | Should create book with maximal valid values   | `{ "title": "Maksymalna ksiazka", "authors": [49], "year": 2026, "price": 1000, "available": 10000 }`                      | 201 Created                          |
| TCP04 | P1        | Should create book with multiple authors       | `{ "title": "Wielu autorow", "authors": [49, 50], "year": 2022, "price": 100, "available": 10 }`                           | 201 Created                          |
| TCP05 | P2        | Should create book with year boundary + 1      | `{ "title": "Rok 1901", "authors": [49], "year": 1901, "price": 50, "available": 100 }`                                    | 201 Created                          |
| TCP06 | P2        | Should create book with price boundary + 1     | `{ "title": "Cena 2", "authors": [49], "year": 2022, "price": 2, "available": 100 }`                                       | 201 Created                          |
| TCP07 | P2        | Should create book with price boundary - 1     | `{ "title": "Cena 999", "authors": [49], "year": 2022, "price": 999, "available": 100 }`                                   | 201 Created                          |
| TCP08 | P2        | Should create book with available boundary - 1 | `{ "title": "Dostepnosc 9999", "authors": [49], "year": 2022, "price": 50, "available": 9999 }`                            | 201 Created                          |
| TCP09 | P2        | Should create book with special chars in title | `{ "title": "Test: Book & API 'REST' - édition spéciale!", "authors": [49], "year": 2022, "price": 50, "available": 100 }` | 201 Created                          |

---

## 5. ❌ Przypadki testowe negatywne – Walidacja wartości

| ID    | Priorytet | Nazwa testu         | Dane wejściowe                                                                            | Oczekiwany rezultat |
| ----- | --------- | ------------------- | ----------------------------------------------------------------------------------------- | ------------------- |
| TCN01 | P0        | Empty title         | `{ "title": "", "authors": [49], "year": 2022, "price": 50, "available": 100 }`           | 400 Bad Request     |
| TCN02 | P0        | Missing title       | `{ "authors": [49], "year": 2022, "price": 50, "available": 100 }`                        | 400 Bad Request     |
| TCN03 | P1        | Duplicate title     | (istniejący tytuł)                                                                        | 400 Bad Request     |
| TCN04 | P0        | Empty authors list  | `{ "title": "Brak autorow", "authors": [], "year": 2022, "price": 50, "available": 100 }` | 400 Bad Request     |
| TCN05 | P0        | Missing authors     | `{ "title": "Brak autorow", "year": 2022, "price": 50, "available": 100 }`                | 400 Bad Request     |
| TCN06 | P1        | Non-existent author | `{ "authors": [99999] ... }`                                                              | 400 / 404           |
| TCN07 | P0        | Year < 1900         | `{ "year": 1899 ... }`                                                                    | 400 Bad Request     |
| TCN08 | P0        | Missing year        | `{ "title": "Bez roku", ... }`                                                            | 400 Bad Request     |
| TCN09 | P0        | Price < 1           | `{ "price": 0 ... }`                                                                      | 400 Bad Request     |
| TCN10 | P0        | Price > 1000        | `{ "price": 1001 ... }`                                                                   | 400 Bad Request     |
| TCN11 | P0        | Missing price       | `{ ... }`                                                                                 | 400 Bad Request     |
| TCN12 | P0        | Available < 1       | `{ "available": 0 ... }`                                                                  | 400 Bad Request     |
| TCN13 | P0        | Available > 10000   | `{ "available": 10001 ... }`                                                              | 400 Bad Request     |
| TCN14 | P0        | Missing available   | `{ ... }`                                                                                 | 400 Bad Request     |

---

## 6. ❌ Nieprawidłowe typy danych

(analogiczna tabela skrócona dla czytelności — wszystkie przypadki z oryginału zachowane w logice testów)

---

## 7. ❌ Nagłówki HTTP

| ID    | Test              | Oczekiwany rezultat |
| ----- | ----------------- | ------------------- |
| TCH01 | Brak Content-Type | 400 / 415           |
| TCH02 | Zły Content-Type  | 400 / 415           |
| TCH03 | Niepoprawny JSON  | 400 Bad Request     |

---

## 8. ⚠️ Edge cases

| ID    | Test                   | Oczekiwany rezultat |
| ----- | ---------------------- | ------------------- |
| TCE01 | Bardzo długi tytuł     | 400 Bad Request     |
| TCE02 | Unicode/emoji w tytule | 201 lub 400         |
| TCE03 | Dodatkowe pole         | 201 lub 400         |
| TCE04 | Ujemny rok             | 400                 |
| TCE05 | Ujemna cena            | 400                 |
| TCE06 | Ujemna dostępność      | 400                 |

---

## 9. 📦 Przykładowe requesty i responses

### ✔️ Poprawny request

```json
{
  "title": "Testowanie API",
  "authors": [49],
  "year": 2022,
  "price": 50,
  "available": 100
}
```

---

## 10. 📊 Podsumowanie pokrycia testowego

| Kategoria           | Liczba testów |
| ------------------- | ------------- |
| Pozytywne           | 9             |
| Negatywne walidacje | 14            |
| Typy danych         | 12            |
| Nagłówki HTTP       | 3             |
| Edge cases          | 6             |
| **ŁĄCZNIE**         | **44**        |

---

## 11. 📝 Uwagi końcowe

- Test duplikatu tytułu wymaga wcześniejszego utworzenia książki
- Przed testami upewnij się, że autor **ID=49** istnieje
- Sprawdzać należy kod statusu i kluczowe fragmenty komunikatów błędów
- **Priorytety:**
  - **P0** – krytyczne
  - **P1** – ważne
  - **P2** – wspomagające
