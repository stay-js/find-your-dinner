# Find Your Dinner. - Tesztelési jegyzőkönyv

<br>

## Tartalomjegyzék

- [API tesztek](#api-tesztek)
  - [/api/categories](#apicategories)
  - [/api/ingredients](#apiingredients)
  - [/api/units](#apiunits)
  - [/api/recipe-data/[id]/verify](#apirecipe-dataidverify)
  - [/api/recipes](#apirecipes)
  - [/api/user/default-ingredients](#apiuserdefault-ingredients)
  - [/api/user/is-admin](#apiuseris-admin)
  - [/api/user/recipes](#apiuserrecipes)
  - [/api/user/saved-recipes](#apiusersaved-recipes)
- [Unit tesztek](#unit-tesztek)
  - [createDateOnlyString](#createdateonlystring)
  - [Zod segédfüggvények és sémák](#zod-segédfüggvények-és-sémák)
- [E2E tesztek](#e2e-tesztek)
  - [Autentikáció](#autentikáció)
  - [Dashboard](#dashboard)
- [Manuális tesztek](#manuális-tesztek)
  - [Autentikáció](#autentikáció-1)
  - [Receptek](#receptek)
  - [Adminisztráció](#adminisztráció)
  - [Recept mentés](#recept-mentés)
  - [Keresés oldal](#keresés-oldal)
  - [Alapértelmezett hozzávalók](#alapértelmezett-hozzávalók)

<br>
<br>

## API tesztek

### /api/categories

**Fájl:** `web/tests/api/categories.test.ts`

#### GET /api/categories

| #   | Teszteset                                                    | Első futtatás időpontja | Utolsó futtatás időpontja | Utoljára futtatta | Eredmény |
| --- | ------------------------------------------------------------ | ----------------------- | ------------------------- | ----------------- | -------- |
| 1   | returns 200 with empty array when no categories exist        | 2026.04.21. 14:34       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |
| 2   | returns seeded categories with canBeDeleted field            | 2026.04.21. 14:34       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |
| 3   | returns canBeDeleted false when category is used by a recipe | 2026.04.21. 14:34       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |
| 4   | filters by query param                                       | 2026.04.21. 14:34       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |

#### POST /api/categories

| #   | Teszteset                                    | Első futtatás időpontja | Utolsó futtatás időpontja | Utoljára futtatta | Eredmény |
| --- | -------------------------------------------- | ----------------------- | ------------------------- | ----------------- | -------- |
| 5   | returns 401 when unauthenticated             | 2026.04.21. 14:34       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |
| 6   | returns 403 when authenticated but not admin | 2026.04.21. 14:34       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |
| 7   | returns 201 when admin creates category      | 2026.04.21. 14:34       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |
| 8   | returns 409 for duplicate name               | 2026.04.21. 14:34       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |
| 9   | returns 400 for empty name                   | 2026.04.21. 14:34       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |

#### PUT /api/categories/[id]

| #   | Teszteset                               | Első futtatás időpontja | Utolsó futtatás időpontja | Utoljára futtatta | Eredmény |
| --- | --------------------------------------- | ----------------------- | ------------------------- | ----------------- | -------- |
| 10  | returns 401 when unauthenticated        | 2026.04.21. 14:34       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |
| 11  | returns 403 when not admin              | 2026.04.21. 14:34       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |
| 12  | returns 204 when admin updates category | 2026.04.21. 14:34       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |
| 13  | returns 404 for non-existent category   | 2026.04.21. 14:34       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |
| 14  | returns 409 for duplicate name          | 2026.04.21. 14:34       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |
| 15  | returns 400 for invalid id              | 2026.04.25. 12:49       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |
| 16  | returns 400 for invalid body            | 2026.04.21. 14:34       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |

#### DELETE /api/categories/[id]

| #   | Teszteset                               | Első futtatás időpontja | Utolsó futtatás időpontja | Utoljára futtatta | Eredmény |
| --- | --------------------------------------- | ----------------------- | ------------------------- | ----------------- | -------- |
| 17  | returns 401 when unauthenticated        | 2026.04.21. 14:34       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |
| 18  | returns 403 when not admin              | 2026.04.21. 14:34       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |
| 19  | returns 204 when admin deletes category | 2026.04.21. 14:34       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |
| 20  | returns 404 for non-existent category   | 2026.04.21. 14:34       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |
| 21  | returns 400 for invalid id              | 2026.04.21. 14:34       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |

<br>

### /api/ingredients

**Fájl:** `web/tests/api/ingredients.test.ts`

#### GET /api/ingredients

| #   | Teszteset                                                                 | Első futtatás időpontja | Utolsó futtatás időpontja | Utoljára futtatta | Eredmény |
| --- | ------------------------------------------------------------------------- | ----------------------- | ------------------------- | ----------------- | -------- |
| 1   | returns 200 with empty array when no ingredients exist                    | 2026.04.21. 14:57       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |
| 2   | returns seeded ingredients with canBeDeleted field                        | 2026.04.21. 14:57       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |
| 3   | returns canBeDeleted false when ingredient is used by a recipe            | 2026.04.21. 14:57       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |
| 4   | returns canBeDeleted false when ingredient is used in default ingredients | 2026.04.21. 14:57       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |
| 5   | filters by query param                                                    | 2026.04.21. 14:57       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |

#### POST /api/ingredients

| #   | Teszteset                                    | Első futtatás időpontja | Utolsó futtatás időpontja | Utoljára futtatta | Eredmény |
| --- | -------------------------------------------- | ----------------------- | ------------------------- | ----------------- | -------- |
| 6   | returns 401 when unauthenticated             | 2026.04.21. 14:57       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |
| 7   | returns 403 when authenticated but not admin | 2026.04.21. 14:57       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |
| 8   | returns 201 when admin creates ingredient    | 2026.04.21. 14:57       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |
| 9   | returns 409 for duplicate name               | 2026.04.21. 14:57       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |
| 10  | returns 400 for empty name                   | 2026.04.21. 14:57       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |

#### PUT /api/ingredients/[id]

| #   | Teszteset                                 | Első futtatás időpontja | Utolsó futtatás időpontja | Utoljára futtatta | Eredmény |
| --- | ----------------------------------------- | ----------------------- | ------------------------- | ----------------- | -------- |
| 11  | returns 401 when unauthenticated          | 2026.04.21. 14:57       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |
| 12  | returns 403 when not admin                | 2026.04.21. 14:57       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |
| 13  | returns 204 when admin updates ingredient | 2026.04.21. 14:57       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |
| 14  | returns 404 for non-existent ingredient   | 2026.04.21. 14:57       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |
| 15  | returns 409 for duplicate name            | 2026.04.21. 14:57       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |
| 16  | returns 400 for invalid id                | 2026.04.25. 12:49       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |
| 17  | returns 400 for invalid body              | 2026.04.21. 14:57       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |

#### DELETE /api/ingredients/[id]

| #   | Teszteset                                 | Első futtatás időpontja | Utolsó futtatás időpontja | Utoljára futtatta | Eredmény |
| --- | ----------------------------------------- | ----------------------- | ------------------------- | ----------------- | -------- |
| 18  | returns 401 when unauthenticated          | 2026.04.21. 14:57       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |
| 19  | returns 403 when not admin                | 2026.04.21. 14:57       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |
| 20  | returns 204 when admin deletes ingredient | 2026.04.21. 14:57       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |
| 21  | returns 404 for non-existent ingredient   | 2026.04.21. 14:57       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |
| 22  | returns 400 for invalid id                | 2026.04.25. 12:49       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |

<br>

### /api/units

**Fájl:** `web/tests/api/units.test.ts`

#### GET /api/units

| #   | Teszteset                                                | Első futtatás időpontja | Utolsó futtatás időpontja | Utoljára futtatta | Eredmény |
| --- | -------------------------------------------------------- | ----------------------- | ------------------------- | ----------------- | -------- |
| 1   | returns 200 with empty array when no units exist         | 2026.04.21. 15:34       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |
| 2   | returns seeded units with canBeDeleted field             | 2026.04.21. 15:34       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |
| 3   | returns canBeDeleted false when unit is used by a recipe | 2026.04.21. 15:34       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |
| 4   | filters by query param                                   | 2026.04.21. 15:34       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |

#### POST /api/units

| #   | Teszteset                                    | Első futtatás időpontja | Utolsó futtatás időpontja | Utoljára futtatta | Eredmény |
| --- | -------------------------------------------- | ----------------------- | ------------------------- | ----------------- | -------- |
| 5   | returns 401 when unauthenticated             | 2026.04.21. 15:34       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |
| 6   | returns 403 when authenticated but not admin | 2026.04.21. 15:34       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |
| 7   | returns 201 when admin creates unit          | 2026.04.21. 15:34       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |
| 8   | returns 409 for duplicate name               | 2026.04.21. 15:34       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |
| 9   | returns 400 for empty name                   | 2026.04.21. 15:34       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |

#### PUT /api/units/[id]

| #   | Teszteset                           | Első futtatás időpontja | Utolsó futtatás időpontja | Utoljára futtatta | Eredmény |
| --- | ----------------------------------- | ----------------------- | ------------------------- | ----------------- | -------- |
| 10  | returns 401 when unauthenticated    | 2026.04.21. 15:34       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |
| 11  | returns 403 when not admin          | 2026.04.21. 15:34       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |
| 12  | returns 204 when admin updates unit | 2026.04.21. 15:34       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |
| 13  | returns 404 for non-existent unit   | 2026.04.21. 15:34       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |
| 14  | returns 409 for duplicate name      | 2026.04.21. 15:34       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |
| 15  | returns 400 for invalid id          | 2026.04.25. 12:49       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |
| 17  | returns 400 for invalid body        | 2026.04.21. 15:34       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |

#### DELETE /api/units/[id]

| #   | Teszteset                           | Első futtatás időpontja | Utolsó futtatás időpontja | Utoljára futtatta | Eredmény |
| --- | ----------------------------------- | ----------------------- | ------------------------- | ----------------- | -------- |
| 17  | returns 401 when unauthenticated    | 2026.04.21. 15:34       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |
| 18  | returns 403 when not admin          | 2026.04.21. 15:34       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |
| 19  | returns 204 when admin deletes unit | 2026.04.21. 15:34       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |
| 20  | returns 404 for non-existent unit   | 2026.04.21. 15:34       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |
| 21  | returns 400 for invalid id          | 2026.04.21. 15:34       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |

<br>

### /api/recipe-data/[id]/verify

**Fájl:** `web/tests/api/recipe-data.test.ts`

#### POST /api/recipe-data/[id]/verify

| #   | Teszteset                                              | Első futtatás időpontja | Utolsó futtatás időpontja | Utoljára futtatta | Eredmény |
| --- | ------------------------------------------------------ | ----------------------- | ------------------------- | ----------------- | -------- |
| 1   | returns 401 when unauthenticated                       | 2026.04.21. 16:09       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |
| 2   | returns 403 when authenticated but not admin           | 2026.04.21. 16:09       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |
| 3   | returns 400 for invalid id                             | 2026.04.21. 16:09       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |
| 4   | returns 404 for non-existent recipe data               | 2026.04.21. 16:09       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |
| 5   | returns 409 when recipe data is already verified       | 2026.04.21. 16:09       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |
| 6   | returns 204 when admin verifies unverified recipe data | 2026.04.21. 16:09       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |

<br>

### /api/recipes

**Fájl:** `web/tests/api/recipes.test.ts`

#### GET /api/recipes

| #   | Teszteset                                                                        | Első futtatás időpontja | Utolsó futtatás időpontja | Utoljára futtatta | Eredmény |
| --- | -------------------------------------------------------------------------------- | ----------------------- | ------------------------- | ----------------- | -------- |
| 1   | returns 200 with empty data and pagination meta when no recipes exist            | 2026.04.21. 19:27       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |
| 2   | returns verified recipes with pagination meta                                    | 2026.04.21. 19:27       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |
| 3   | does not return unverified recipes by default                                    | 2026.04.21. 19:27       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |
| 4   | returns 401 when unauthenticated and allow-unverified is set                     | 2026.04.21. 19:27       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |
| 5   | returns 403 when non-admin and allow-unverified is set                           | 2026.04.21. 19:27       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |
| 6   | returns unverified recipes when admin and allow-unverified is set                | 2026.04.21. 19:27       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |
| 7   | returns 401 when unauthenticated and only-awaiting-verification is set           | 2026.04.21. 19:27       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |
| 8   | returns 403 when non-admin and only-awaiting-verification is set                 | 2026.04.21. 19:27       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |
| 9   | returns only unverified recipes when admin and only-awaiting-verification is set | 2026.04.21. 19:27       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |
| 10  | filters recipes by category                                                      | 2026.04.21. 19:27       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |
| 11  | filters recipes by ingredients                                                   | 2026.04.21. 19:27       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |
| 12  | filters recipes by search query                                                  | 2026.04.21. 19:27       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |
| 13  | paginates results correctly                                                      | 2026.04.21. 19:27       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |

#### POST /api/recipes

| #   | Teszteset                                                       | Első futtatás időpontja | Utolsó futtatás időpontja | Utoljára futtatta | Eredmény |
| --- | --------------------------------------------------------------- | ----------------------- | ------------------------- | ----------------- | -------- |
| 14  | returns 401 when unauthenticated                                | 2026.04.21. 19:27       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |
| 15  | returns 201 and recipeId when authenticated user creates recipe | 2026.04.21. 19:27       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |
| 16  | returns 400 for missing required fields                         | 2026.04.21. 19:27       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |
| 17  | returns 400 for empty title                                     | 2026.04.21. 19:27       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |
| 18  | returns 400 for empty categories array                          | 2026.04.21. 19:27       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |
| 19  | returns 400 for empty ingredients array                         | 2026.04.21. 19:27       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |
| 20  | returns 400 for non-https previewImageUrl                       | 2026.04.21. 19:27       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |
| 21  | returns 400 for negative cookTimeMinutes                        | 2026.04.21. 19:27       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |
| 22  | returns 400 for zero servings                                   | 2026.04.21. 19:27       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |

#### GET /api/recipes/[id]

| #   | Teszteset                                                        | Első futtatás időpontja | Utolsó futtatás időpontja | Utoljára futtatta | Eredmény |
| --- | ---------------------------------------------------------------- | ----------------------- | ------------------------- | ----------------- | -------- |
| 23  | returns 200 with full recipe data for a verified recipe          | 2026.04.21. 19:27       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |
| 24  | returns 404 for non-existent recipe                              | 2026.04.21. 19:27       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |
| 25  | returns 400 for invalid id                                       | 2026.04.21. 19:27       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |
| 26  | returns 404 for unverified recipe without allow-unverified flag  | 2026.04.21. 19:27       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |
| 27  | returns 401 when unauthenticated and allow-unverified is set     | 2026.04.21. 19:27       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |
| 28  | returns 403 when non-admin and allow-unverified is set           | 2026.04.21. 19:27       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |
| 29  | returns unverified recipe when admin and allow-unverified is set | 2026.04.21. 19:27       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |

#### PUT /api/recipes/[id]

| #   | Teszteset                                                 | Első futtatás időpontja | Utolsó futtatás időpontja | Utoljára futtatta | Eredmény |
| --- | --------------------------------------------------------- | ----------------------- | ------------------------- | ----------------- | -------- |
| 30  | returns 401 when unauthenticated                          | 2026.04.21. 19:27       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |
| 31  | returns 400 for invalid id                                | 2026.04.21. 19:27       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |
| 32  | returns 404 for non-existent recipe                       | 2026.04.21. 19:27       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |
| 33  | returns 403 when user tries to update another user recipe | 2026.04.21. 19:27       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |
| 34  | returns 400 for invalid body                              | 2026.04.21. 19:27       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |
| 35  | returns 204 when owner updates own recipe                 | 2026.04.21. 19:27       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |
| 36  | returns 204 when admin updates any recipe                 | 2026.04.21. 19:27       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |

#### DELETE /api/recipes/[id]

| #   | Teszteset                                                 | Első futtatás időpontja | Utolsó futtatás időpontja | Utoljára futtatta | Eredmény |
| --- | --------------------------------------------------------- | ----------------------- | ------------------------- | ----------------- | -------- |
| 37  | returns 401 when unauthenticated                          | 2026.04.21. 19:27       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |
| 38  | returns 400 for invalid id                                | 2026.04.21. 19:27       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |
| 39  | returns 404 for non-existent recipe                       | 2026.04.21. 19:27       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |
| 40  | returns 403 when user tries to delete another user recipe | 2026.04.21. 19:27       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |
| 41  | returns 204 when owner deletes own recipe                 | 2026.04.21. 19:27       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |
| 42  | returns 204 when admin deletes any recipe                 | 2026.04.21. 19:27       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |

<br>

### /api/user/default-ingredients

**Fájl:** `web/tests/api/user/default-ingredients.test.ts`

#### GET /api/user/default-ingredients

| #   | Teszteset                                                         | Első futtatás időpontja | Utolsó futtatás időpontja | Utoljára futtatta | Eredmény |
| --- | ----------------------------------------------------------------- | ----------------------- | ------------------------- | ----------------- | -------- |
| 1   | returns 401 when unauthenticated                                  | 2026.04.21. 20:07       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |
| 2   | returns 204 with empty array when user has no default ingredients | 2026.04.21. 20:07       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |
| 3   | returns ingredient ids for the authenticated user                 | 2026.04.21. 20:07       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |
| 4   | returns only the authenticated user's default ingredients         | 2026.04.21. 20:07       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |

#### PUT /api/user/default-ingredients

| #   | Teszteset                                                               | Első futtatás időpontja | Utolsó futtatás időpontja | Utoljára futtatta | Eredmény |
| --- | ----------------------------------------------------------------------- | ----------------------- | ------------------------- | ----------------- | -------- |
| 5   | returns 401 when unauthenticated                                        | 2026.04.21. 20:07       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |
| 6   | returns 400 for invalid body                                            | 2026.04.21. 20:07       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |
| 7   | returns 400 for negative ingredient ids                                 | 2026.04.21. 20:07       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |
| 8   | returns 400 for non-integer ingredient ids                              | 2026.04.21. 20:07       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |
| 9   | returns 204 and sets default ingredients                                | 2026.04.21. 20:07       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |
| 10  | returns 204 and clears default ingredients when empty array is provided | 2026.04.21. 20:07       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |
| 11  | returns 204 and replaces existing default ingredients                   | 2026.04.21. 20:07       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |

<br>

### /api/user/is-admin

**Fájl:** `web/tests/api/user/is-admin.test.ts`

#### GET /api/user/is-admin

| #   | Teszteset                                | Első futtatás időpontja | Utolsó futtatás időpontja | Utoljára futtatta | Eredmény |
| --- | ---------------------------------------- | ----------------------- | ------------------------- | ----------------- | -------- |
| 1   | returns 401 when unauthenticated         | 2026.04.21. 20:17       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |
| 2   | returns isAdmin false for a regular user | 2026.04.21. 20:17       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |
| 3   | returns isAdmin true for an admin user   | 2026.04.21. 20:17       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |

<br>

### /api/user/recipes

**Fájl:** `web/tests/api/user/recipes.test.ts`

#### GET /api/user/recipes

| #   | Teszteset                                                 | Első futtatás időpontja | Utolsó futtatás időpontja | Utoljára futtatta | Eredmény |
| --- | --------------------------------------------------------- | ----------------------- | ------------------------- | ----------------- | -------- |
| 1   | returns 401 when unauthenticated                          | 2026.04.21. 20:47       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |
| 2   | returns 200 with empty data when user has no recipes      | 2026.04.21. 20:47       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |
| 3   | returns only the authenticated user's recipes             | 2026.04.21. 20:47       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |
| 4   | returns both verified and unverified recipes for the user | 2026.04.21. 20:47       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |
| 5   | filters recipes by category                               | 2026.04.21. 20:47       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |
| 6   | filters recipes by ingredients                            | 2026.04.21. 20:47       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |
| 7   | filters recipes by search query                           | 2026.04.21. 20:47       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |
| 8   | paginates results correctly                               | 2026.04.21. 20:47       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |
| 9   | does not return recipes from other users when filtering   | 2026.04.21. 20:47       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |

<br>

### /api/user/saved-recipes

**Fájl:** `web/tests/api/user/saved-recipes.test.ts`

#### GET /api/user/saved-recipes

| #   | Teszteset                                            | Első futtatás időpontja | Utolsó futtatás időpontja | Utoljára futtatta | Eredmény |
| --- | ---------------------------------------------------- | ----------------------- | ------------------------- | ----------------- | -------- |
| 1   | returns 401 when unauthenticated                     | 2026.04.21. 21:22       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |
| 2   | returns empty array when user has no saved recipes   | 2026.04.21. 21:22       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |
| 3   | returns saved recipe ids and timestamps for the user | 2026.04.21. 21:22       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |
| 4   | returns only the authenticated user's saved recipes  | 2026.04.21. 21:22       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |

#### GET /api/user/saved-recipes?include=recipe

| #   | Teszteset                                                  | Első futtatás időpontja | Utolsó futtatás időpontja | Utoljára futtatta | Eredmény |
| --- | ---------------------------------------------------------- | ----------------------- | ------------------------- | ----------------- | -------- |
| 5   | returns 401 when unauthenticated                           | 2026.04.21. 21:22       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |
| 6   | returns 200 with empty data when user has no saved recipes | 2026.04.21. 21:22       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |
| 7   | returns saved recipes with full recipe data                | 2026.04.21. 21:22       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |
| 8   | does not return unsaved recipes                            | 2026.04.21. 21:22       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |
| 9   | does not return unverified saved recipes                   | 2026.04.21. 21:22       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |
| 10  | does not return other users' saved recipes                 | 2026.04.21. 21:22       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |
| 11  | filters saved recipes by category                          | 2026.04.21. 21:22       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |
| 12  | filters saved recipes by ingredients                       | 2026.04.21. 21:22       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |
| 13  | filters saved recipes by search query                      | 2026.04.21. 21:22       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |
| 14  | paginates saved recipes correctly                          | 2026.04.21. 21:22       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |

#### POST /api/user/saved-recipes

| #   | Teszteset                                | Első futtatás időpontja | Utolsó futtatás időpontja | Utoljára futtatta | Eredmény |
| --- | ---------------------------------------- | ----------------------- | ------------------------- | ----------------- | -------- |
| 15  | returns 401 when unauthenticated         | 2026.04.21. 21:22       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |
| 16  | returns 400 for missing recipeId         | 2026.04.21. 21:22       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |
| 17  | returns 400 for invalid recipeId         | 2026.04.21. 21:22       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |
| 18  | returns 400 for non-integer recipeId     | 2026.04.21. 21:22       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |
| 19  | returns 201 and saves the recipe         | 2026.04.21. 21:22       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |
| 20  | returns 409 when recipe is already saved | 2026.04.21. 21:22       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |

#### DELETE /api/user/saved-recipes/[id]

| #   | Teszteset                                              | Első futtatás időpontja | Utolsó futtatás időpontja | Utoljára futtatta | Eredmény |
| --- | ------------------------------------------------------ | ----------------------- | ------------------------- | ----------------- | -------- |
| 21  | returns 401 when unauthenticated                       | 2026.04.21. 21:22       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |
| 22  | returns 400 for a non-numeric id                       | 2026.04.21. 21:22       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |
| 23  | returns 400 for a non-positive id                      | 2026.04.21. 21:22       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |
| 24  | returns 204 when the saved recipe is deleted           | 2026.04.21. 21:22       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |
| 25  | returns 204 even when the recipe was not saved         | 2026.04.21. 21:22       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |
| 26  | does not delete saved recipes belonging to other users | 2026.04.21. 21:22       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |

<br>
<br>

## Unit tesztek

### createDateOnlyString

**Fájl:** `web/tests/unit/create-date-only-string.test.ts`

| #   | Teszteset                                  | Első futtatás időpontja | Utolsó futtatás időpontja | Utoljára futtatta | Eredmény |
| --- | ------------------------------------------ | ----------------------- | ------------------------- | ----------------- | -------- |
| 1   | formats a date as YYYY-MM-DD               | 2026.04.25. 13:35       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |
| 2   | pads single-digit month and day with zeros | 2026.04.25. 13:35       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |
| 3   | handles December 31                        | 2026.04.25. 13:35       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |
| 4   | handles January 1                          | 2026.04.25. 13:35       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |

<br>

### Zod segédfüggvények és sémák

**Fájl:** `web/tests/unit/zod/helpers-and-schemas.test.ts`

#### parseCultureInvariantFloat

| #   | Teszteset                                        | Első futtatás időpontja | Utolsó futtatás időpontja | Utoljára futtatta | Eredmény |
| --- | ------------------------------------------------ | ----------------------- | ------------------------- | ----------------- | -------- |
| 1   | returns null for null                            | 2026.04.25. 13:35       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |
| 2   | returns null for undefined                       | 2026.04.25. 13:35       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |
| 3   | returns null for empty string                    | 2026.04.25. 13:35       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |
| 4   | returns null for whitespace-only string          | 2026.04.25. 13:35       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |
| 5   | parses dot-separated float                       | 2026.04.25. 13:35       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |
| 6   | parses comma-separated float (culture-invariant) | 2026.04.25. 13:35       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |
| 7   | parses integer string                            | 2026.04.25. 13:35       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |
| 8   | parses negative float                            | 2026.04.25. 13:35       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |
| 9   | parses float with surrounding whitespace         | 2026.04.25. 13:35       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |
| 10  | returns NaN for non-numeric string               | 2026.04.25. 13:35       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |

#### isCultureInvariantFloatString

| #   | Teszteset                                | Első futtatás időpontja | Utolsó futtatás időpontja | Utoljára futtatta | Eredmény |
| --- | ---------------------------------------- | ----------------------- | ------------------------- | ----------------- | -------- |
| 1   | returns true for dot-separated float     | 2026.04.25. 13:35       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |
| 2   | returns true for comma-separated float   | 2026.04.25. 13:35       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |
| 3   | returns true for integer string          | 2026.04.25. 13:35       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |
| 4   | returns true for negative float string   | 2026.04.25. 13:35       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |
| 5   | returns false for non-numeric string     | 2026.04.25. 13:35       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |
| 6   | returns false for empty string           | 2026.04.25. 13:35       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |
| 7   | returns false for whitespace-only string | 2026.04.25. 13:35       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |

#### isIntegerString

| #   | Teszteset                                | Első futtatás időpontja | Utolsó futtatás időpontja | Utoljára futtatta | Eredmény |
| --- | ---------------------------------------- | ----------------------- | ------------------------- | ----------------- | -------- |
| 1   | returns true for positive integer string | 2026.04.25. 13:35       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |
| 2   | returns true for zero                    | 2026.04.25. 13:35       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |
| 3   | returns true for negative integer string | 2026.04.25. 13:35       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |
| 4   | returns false for float string           | 2026.04.25. 13:35       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |
| 5   | returns false for empty string           | 2026.04.25. 13:35       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |
| 6   | returns false for non-numeric string     | 2026.04.25. 13:35       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |

#### isNonNegativeIntegerString

| #   | Teszteset                            | Első futtatás időpontja | Utolsó futtatás időpontja | Utoljára futtatta | Eredmény |
| --- | ------------------------------------ | ----------------------- | ------------------------- | ----------------- | -------- |
| 1   | returns true for zero                | 2026.04.25. 13:35       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |
| 2   | returns true for positive integer    | 2026.04.25. 13:35       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |
| 3   | returns false for negative integer   | 2026.04.25. 13:35       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |
| 4   | returns false for float string       | 2026.04.25. 13:35       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |
| 5   | returns false for empty string       | 2026.04.25. 13:35       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |
| 6   | returns false for non-numeric string | 2026.04.25. 13:35       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |

#### isPositiveIntegerString

| #   | Teszteset                               | Első futtatás időpontja | Utolsó futtatás időpontja | Utoljára futtatta | Eredmény |
| --- | --------------------------------------- | ----------------------- | ------------------------- | ----------------- | -------- |
| 1   | returns true for positive integer       | 2026.04.25. 13:35       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |
| 2   | returns true for large positive integer | 2026.04.25. 13:35       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |
| 3   | returns false for zero                  | 2026.04.25. 13:35       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |
| 4   | returns false for negative integer      | 2026.04.25. 13:35       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |
| 5   | returns false for float string          | 2026.04.25. 13:35       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |
| 6   | returns false for empty string          | 2026.04.25. 13:35       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |
| 7   | returns false for non-numeric string    | 2026.04.25. 13:35       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |

#### idArraySearchSchema

| #   | Teszteset                                            | Első futtatás időpontja | Utolsó futtatás időpontja | Utoljára futtatta | Eredmény |
| --- | ---------------------------------------------------- | ----------------------- | ------------------------- | ----------------- | -------- |
| 1   | parses valid JSON array of positive integers         | 2026.04.25. 13:35       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |
| 2   | returns empty array for null                         | 2026.04.25. 13:35       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |
| 3   | returns empty array for empty string                 | 2026.04.25. 13:35       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |
| 4   | returns empty array for invalid JSON                 | 2026.04.25. 13:35       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |
| 5   | returns empty array for JSON with non-integer values | 2026.04.25. 13:35       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |
| 6   | returns empty array for JSON with negative integers  | 2026.04.25. 13:35       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |
| 7   | returns empty array for JSON array of strings        | 2026.04.25. 13:35       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |
| 8   | returns empty array for a JSON non-array             | 2026.04.25. 13:35       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |
| 9   | parses a single-element array                        | 2026.04.25. 13:35       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |

#### boolFlagSearchSchema

| #   | Teszteset                          | Első futtatás időpontja | Utolsó futtatás időpontja | Utoljára futtatta | Eredmény |
| --- | ---------------------------------- | ----------------------- | ------------------------- | ----------------- | -------- |
| 1   | returns true for "1"               | 2026.04.25. 13:35       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |
| 2   | returns true for "true"            | 2026.04.25. 13:35       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |
| 3   | returns false for "0"              | 2026.04.25. 13:35       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |
| 4   | returns false for "false"          | 2026.04.25. 13:35       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |
| 5   | returns false for null             | 2026.04.25. 13:35       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |
| 6   | returns false for empty string     | 2026.04.25. 13:35       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |
| 7   | returns false for arbitrary string | 2026.04.25. 13:35       | 2026.04.25. 13:35         | Nagy Zétény       | Sikeres  |

<br>
<br>

## E2E tesztek

### Autentikáció

**Fájl:** `web/tests/e2e/auth.spec.ts`

#### Azonosítatlan állapot (Nem bejelentkezett felhasználó)

| #   | Teszteset                         | Első futtatás időpontja | Utolsó futtatás időpontja | Utoljára futtatta | Eredmény |
| --- | --------------------------------- | ----------------------- | ------------------------- | ----------------- | -------- |
| 1   | shows sign in and sign up buttons | 2026.04.24. 10:23       | 2026.04.24. 14:26         | Nagy Zétény       | Sikeres  |
| 2   | does not show user button         | 2026.04.24. 10:23       | 2026.04.24. 14:26         | Nagy Zétény       | Sikeres  |

#### Azonosított állapot (Bejelentkezett felhasználó)

| #   | Teszteset                                                           | Első futtatás időpontja | Utolsó futtatás időpontja | Utoljára futtatta | Eredmény |
| --- | ------------------------------------------------------------------- | ----------------------- | ------------------------- | ----------------- | -------- |
| 1   | signs in successfully via email and password                        | 2026.04.24. 12:24       | 2026.04.24. 14:26         | Nagy Zétény       | Sikeres  |
| 2   | signs in successfully via clerk helper                              | 2026.04.24. 12:24       | 2026.04.24. 14:26         | Nagy Zétény       | Sikeres  |
| 3   | hides sign in and sign up buttons                                   | 2026.04.24. 12:59       | 2026.04.24. 14:26         | Nagy Zétény       | Sikeres  |
| 4   | shows dashboard link                                                | 2026.04.24. 13:04       | 2026.04.24. 14:26         | Nagy Zétény       | Sikeres  |
| 5   | sign out via ui redirects to "/"                                    | 2026.04.24. 12:59       | 2026.04.24. 14:26         | Nagy Zétény       | Sikeres  |
| 6   | sign out via clerk helper redirects to "/"                          | 2026.04.24. 12:59       | 2026.04.24. 14:26         | Nagy Zétény       | Sikeres  |
| 7   | should redirect the user back to the previous page after signing in | 2026.04.24. 13:15       | 2026.04.24. 14:26         | Nagy Zétény       | Sikeres  |

<br>

### Dashboard

**Fájl:** `web/tests/e2e/dashboard.spec.ts`

#### Azonosítatlan állapot (Nem bejelentkezett felhasználó)

| #   | Teszteset                                              | Első futtatás időpontja | Utolsó futtatás időpontja | Utoljára futtatta | Eredmény |
| --- | ------------------------------------------------------ | ----------------------- | ------------------------- | ----------------- | -------- |
| 1   | redirects "/dashboard" to sign in when unauthenticated | 2026.04.24. 14:16       | 2026.04.24. 14:26         | Nagy Zétény       | Sikeres  |

#### Normál felhasználó (Regular user)

| #   | Teszteset                                                 | Első futtatás időpontja | Utolsó futtatás időpontja | Utoljára futtatta | Eredmény |
| --- | --------------------------------------------------------- | ----------------------- | ------------------------- | ----------------- | -------- |
| 1   | does not show admin nav section in dashboard sidebar      | 2026.04.24. 14:16       | 2026.04.24. 14:26         | Nagy Zétény       | Sikeres  |
| 2   | does not show admin nav section in dashboard landing page | 2026.04.24. 14:16       | 2026.04.24. 14:26         | Nagy Zétény       | Sikeres  |
| 3   | shows forbidden page when accessing admin routes          | 2026.04.24. 14:16       | 2026.04.24. 14:26         | Nagy Zétény       | Sikeres  |

#### Adminisztrátor felhasználó (Admin user)

| #   | Teszteset                                         | Első futtatás időpontja | Utolsó futtatás időpontja | Utoljára futtatta | Eredmény |
| --- | ------------------------------------------------- | ----------------------- | ------------------------- | ----------------- | -------- |
| 1   | shows admin nav section in dashboard sidebar      | 2026.04.24. 14:16       | 2026.04.24. 14:26         | Nagy Zétény       | Sikeres  |
| 2   | shows admin nav section in dashboard landing page | 2026.04.24. 14:16       | 2026.04.24. 14:26         | Nagy Zétény       | Sikeres  |
| 3   | can access admin routes                           | 2026.04.24. 14:16       | 2026.04.24. 14:26         | Nagy Zétény       | Sikeres  |

<br>
<br>

## Manuális tesztek

### Autentikáció

| #   | Teszteset                                | Első futtatás időpontja | Utolsó futtatás időpontja | Utoljára futtatta | Eredmény |
| --- | ---------------------------------------- | ----------------------- | ------------------------- | ----------------- | -------- |
| 1   | sign-up with email and password succeeds |                         |                           |                   |          |
| 2   | sign-up with Google OAuth succeeds       |                         |                           |                   |          |
| 3   | sign-in with email and password succeeds |                         |                           |                   |          |
| 4   | sign-in with Google OAuth succeeds       |                         |                           |                   |          |

<br>

### Receptek

| #   | Teszteset                                                                                                  | Első futtatás időpontja | Utolsó futtatás időpontja | Utoljára futtatta | Eredmény |
| --- | ---------------------------------------------------------------------------------------------------------- | ----------------------- | ------------------------- | ----------------- | -------- |
| 1   | creating, editing, and deleting a recipe works end-to-end                                                  |                         |                           |                   |          |
| 2   | recipe creation form redirects to "/dashboard/recipes" on success                                          |                         |                           |                   |          |
| 3   | admin can edit any user's recipe                                                                           |                         |                           |                   |          |
| 4   | user cannot access the edit page of another user's recipe                                                  |                         |                           |                   |          |
| 5   | edit button on admin routes points to the admin edit page, even when the current user is the recipe author |                         |                           |                   |          |
| 6   | user recipe edit form redirects to "/dashboard/recipes" on success                                         |                         |                           |                   |          |
| 7   | admin recipe edit form redirects to "/dashboard/admin/recipes" on success                                  |                         |                           |                   |          |
| 8   | user recipes page only shows recipes belonging to the current user                                         |                         |                           |                   |          |
| 9   | public recipes page only displays verified recipes                                                         |                         |                           |                   |          |
| 10  | public recipe page returns 404 for unverified recipes                                                      |                         |                           |                   |          |
| 11  | filters work correctly on the public, user, user saved and admin recipe pages                              |                         |                           |                   |          |

<br>

### Adminisztráció

| #   | Teszteset                                                                     | Első futtatás időpontja | Utolsó futtatás időpontja | Utoljára futtatta | Eredmény |
| --- | ----------------------------------------------------------------------------- | ----------------------- | ------------------------- | ----------------- | -------- |
| 1   | creating, editing, and deleting a category works end-to-end                   |                         |                           |                   |          |
| 2   | creating, editing, and deleting an ingredient works end-to-end                |                         |                           |                   |          |
| 3   | creating, editing, and deleting a unit works end-to-end                       |                         |                           |                   |          |
| 4   | search filter works correctly on the categories, ingredients, and units pages |                         |                           |                   |          |
| 5   | approving a pending recipe marks it as verified and makes it publicly visible |                         |                           |                   |          |

<br>

### Recept mentés

| #   | Teszteset                                                      | Első futtatás időpontja | Utolsó futtatás időpontja | Utoljára futtatta | Eredmény |
| --- | -------------------------------------------------------------- | ----------------------- | ------------------------- | ----------------- | -------- |
| 1   | saving and unsaving a recipe updates the saved state correctly |                         |                           |                   |          |
| 2   | saved recipes are displayed correctly on the user's dashboard  |                         |                           |                   |          |
| 3   | saved recipes page only displays verified recipes              |                         |                           |                   |          |

<br>

### Keresés oldal

| #   | Teszteset                                                                                | Első futtatás időpontja | Utolsó futtatás időpontja | Utoljára futtatta | Eredmény |
| --- | ---------------------------------------------------------------------------------------- | ----------------------- | ------------------------- | ----------------- | -------- |
| 1   | filter stage correctly narrows the recipe pool based on selected criteria                |                         |                           |                   |          |
| 2   | swipe stage allows dismissing and selecting recipes                                      |                         |                           |                   |          |
| 3   | tournament stage correctly determines the winning recipe                                 |                         |                           |                   |          |
| 4   | swipe and tournament stages are skipped when only one recipe matches the applied filters |                         |                           |                   |          |

<br>

### Alapértelmezett hozzávalók

| #   | Teszteset                                                                                                                   | Első futtatás időpontja | Utolsó futtatás időpontja | Utoljára futtatta | Eredmény |
| --- | --------------------------------------------------------------------------------------------------------------------------- | ----------------------- | ------------------------- | ----------------- | -------- |
| 1   | updating default ingredients saves the new selection correctly                                                              |                         |                           |                   |          |
| 2   | the "Feltöltés alapértelmezett hozzávalókkal" button is only shown in the filters when the user has default ingredients set |                         |                           |                   |          |
