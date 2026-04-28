# 🔌 API

## /api/alimentacao

**GET** `?date=yyyy-MM-dd`
- retorna refeições completadas no dia

**POST** `{ date, meal_index }`
- marca refeição como feita
- upsert com onConflict `(date, meal_index)`

**DELETE** `{ date, meal_index }`
- desmarca refeição

---

## /api/exercise-weights

**GET** `?name=<exercise_name>`
- retorna histórico de pesos do exercício
- ordenado por `logged_at desc`, limit 60

**POST** `{ exercise_name, weight_kg, logged_at }`
- salva peso do dia
- upsert com onConflict `(exercise_name, logged_at)`

---

## /api/postura

**POST** `{ exercise_1, exercise_2, exercise_3, exercise_4, exercise_5, pain_level }`
- salva checklist do dia + nível de dor
- upsert com onConflict `(logged_at)`

---

## /api/peso

**POST** `{ weight_kg, logged_at, notes? }`
- registra peso corporal

---

## /api/fotos

**POST** multipart/form-data `{ file, angle, taken_at }`
- upload para Supabase Storage
- insere registro em `progress_photos`

---

## Padrão

- sempre verificar `response.ok` no client
- retornar `{ error }` com status 4xx/5xx em caso de falha
- retornar `{ data }` com status 200 em caso de sucesso
- validar campos obrigatórios antes de persistir
