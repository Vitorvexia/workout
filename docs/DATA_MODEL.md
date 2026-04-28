# 💾 Modelo de Dados

## weight_logs
| campo | tipo | desc |
|-------|------|------|
| id | uuid | PK |
| weight_kg | numeric(5,2) | peso corporal |
| logged_at | date | data do registro |
| notes | text | observações |

---

## meal_completions
| campo | tipo | desc |
|-------|------|------|
| id | uuid | PK |
| date | date | data |
| meal_index | int (0–5) | qual das 6 refeições |

Unique: `(date, meal_index)`

---

## exercise_weights
| campo | tipo | desc |
|-------|------|------|
| id | uuid | PK |
| exercise_name | text | nome do exercício |
| weight_kg | numeric(5,2) | carga usada |
| logged_at | date | data |

Unique: `(exercise_name, logged_at)`

---

## posture_checklist
| campo | tipo | desc |
|-------|------|------|
| id | uuid | PK |
| logged_at | date | data (unique) |
| exercise_1–5 | boolean | exercícios feitos |
| pain_level | int (0–10) | nível de dor |

---

## supplement_weekly
| campo | tipo | desc |
|-------|------|------|
| id | uuid | PK |
| logged_at | date | data |
| supplement | text | creatina/whey/hipercalorico |
| count | int | quantidade |

Unique: `(logged_at, supplement)`

---

## ficha_completions
| campo | tipo | desc |
|-------|------|------|
| id | uuid | PK |
| day_letter | text (A–E) | dia do treino |
| exercise_name | text | exercício |
| completed_at | date | data |

---

## progress_photos
| campo | tipo | desc |
|-------|------|------|
| id | uuid | PK |
| angle | text | frente/lado/costas |
| photo_url | text | URL no storage |
| taken_at | date | data da foto |

---

## Observações

- sem `user_id` — single user
- sem soft delete — dados nunca removidos
- todas as datas em `date` (não `timestamptz`) para simplicidade
