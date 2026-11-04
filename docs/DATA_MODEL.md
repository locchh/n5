# Data model

## The idea

- **Written per lesson**: one JSON file per lesson, so adding a lesson = adding one file.
- **Used per kind**: each kind of knowledge has its own fixed shape, so items from different lessons can be mixed into one deck (e.g. vocab from L4 + L5 + L6, or a mixed test).

```
data/
  topics.json      ← list of vocab topics
  lessons/
    4.json
    5.json
    ...
```

## Rules for all data

- **No romaji.** Japanese is written in kana/kanji only.
- **Readings in hiragana** (父 → ちち).
- **Meanings in Vietnamese.**
- Every list in a lesson file is **optional**. Missing = empty.

## The 8 kinds

| Kind | What it is | Lesson file key |
|---|---|---|
| Vocab | A word and its meaning (numbers too) | `vocab` |
| Grammar | A pattern with examples | `grammar` |
| Kanji | A character with example words | `kanji` |
| Sentence | A sentence to learn by heart | `sentences` |
| Note | A usage note or comparison (phân biệt) | `notes` |
| Passage | A reading text or a dialogue | `passages` |
| Sound | Similar sounds to tell apart by ear | `sounds` |
| Resource | A useful link | `resources` |

## Shared shape: Item

The smallest building block. Used inside other kinds.

```
Item { jp, meaning }
```

| Field | Required | Meaning |
|---|---|---|
| `jp` | yes | Japanese text |
| `meaning` | yes | Vietnamese meaning |

## 1. Vocab

```
Vocab { jp, meaning, topics? }
```

| Field | Required | Meaning |
|---|---|---|
| `jp` | yes | The word |
| `meaning` | yes | Vietnamese meaning |
| `topics` | no | List of topic ids from `data/topics.json`. A word can have several. |

```json
{ "jp": "かぞく", "meaning": "Gia đình", "topics": ["family"] }
{ "jp": "ひるごはん", "meaning": "Bữa trưa", "topics": ["food", "time"] }
{ "jp": "はたち", "meaning": "20 tuổi", "topics": ["numbers", "family"] }
{ "jp": "よじ ろっぷん", "meaning": "4:06", "topics": ["numbers", "time"] }
```

Numbers are vocab with the `numbers` topic. A numbers drill is just vocab flashcards filtered by that topic.

### Topics list

All topics live in one file, `data/topics.json`:

```
Topic { id, label }
```

| Field | Required | Meaning |
|---|---|---|
| `id` | yes | Short English name used in lesson files, e.g. `"food"` |
| `label` | yes | Vietnamese name shown in the app, e.g. `"Đồ ăn, đồ uống"` |

```json
[
  { "id": "family",  "label": "Gia đình" },
  { "id": "food",    "label": "Đồ ăn, đồ uống" },
  { "id": "numbers", "label": "Số đếm" },
  { "id": "time",    "label": "Thời gian" },
  { "id": "house",   "label": "Nhà cửa" },
  { "id": "places",  "label": "Địa điểm" }
]
```

- The engine checks every word's topics against this list. A typo like `"foods"` shows an error instead of quietly creating a new group.
- New topic = add one line here.

### Choosing a deck

Before starting vocab flashcards, I tap to pick:

- **Lessons**: one or several (e.g. L4, L5, L6)
- **Topics**: one or several, or none = all topics

The deck is every word that matches both. A word with several topics appears only once in the deck.

## 2. Grammar

```
Grammar { pattern, meaning, examples: Example[] }
Example { jp, meaning, blank?, choices?, chunks? }
```

| Field | Required | Meaning |
|---|---|---|
| `pattern` | yes | The structure, e.g. `S1は Nです → S2も Nです` |
| `meaning` | yes | What it means / when to use it |
| `examples` | yes | At least one example |

**Example**

| Field | Required | Meaning |
|---|---|---|
| `jp` | yes | Example sentence |
| `meaning` | yes | Vietnamese meaning |
| `blank` | no | The part to hide in fill-the-blank |
| `choices` | no | 4 options for fill-the-blank (must include `blank`) |
| `chunks` | no | The sentence cut into pieces, in the right order, for build-the-sentence |

If `blank` + `choices` are missing, fill-the-blank skips this example. If `chunks` is missing, build-the-sentence skips it.

Number rules (like "Số + さい, but 1 tuổi = いっさい") are grammar.

```json
{
  "pattern": "S1は Nです → S2も Nです",
  "meaning": "S2 cũng là N",
  "examples": [
    {
      "jp": "Hieuさんもベトナムじんです。",
      "meaning": "Hieu cũng là người Việt Nam.",
      "blank": "も",
      "choices": ["は", "も", "が", "を"],
      "chunks": ["Hieuさん", "も", "ベトナムじん", "です。"]
    }
  ]
}
```

## 3. Kanji

```
Kanji     { char, hanviet, words: KanjiWord[] }
KanjiWord { jp, reading, meaning }
```

| Field | Required | Meaning |
|---|---|---|
| `char` | yes | The kanji, e.g. `父` |
| `hanviet` | yes | Hán Việt, e.g. `Phụ` |
| `words` | yes | Words using this kanji |

**KanjiWord**

| Field | Required | Meaning |
|---|---|---|
| `jp` | yes | The word in kanji, e.g. `お父さん` |
| `reading` | yes | Hiragana reading, e.g. `おとうさん` |
| `meaning` | yes | Vietnamese meaning |

```json
{
  "char": "父",
  "hanviet": "Phụ",
  "words": [
    { "jp": "父", "reading": "ちち", "meaning": "Bố mình" },
    { "jp": "お父さん", "reading": "おとうさん", "meaning": "Bố (người khác)" }
  ]
}
```

## 4. Sentence

```
Sentence = Item { jp, meaning }
```

```json
{ "jp": "お父さんはおいくつですか。", "meaning": "Bố của bạn bao nhiêu tuổi?" }
```

## 5. Note

```
Note { title, explain, compare: Item[], examples?: Item[] }
```

| Field | Required | Meaning |
|---|---|---|
| `title` | yes | What's being compared, e.g. `ちち vs おとうさん` |
| `explain` | yes | Short explanation |
| `compare` | yes | The things being compared, each with its meaning |
| `examples` | no | Example sentences |

```json
{
  "title": "ちち vs おとうさん",
  "explain": "ちち: nói về bố mình với người khác. おとうさん: bố của người khác, hoặc gọi bố mình.",
  "compare": [
    { "jp": "ちち", "meaning": "Bố mình" },
    { "jp": "おとうさん", "meaning": "Bố người khác" }
  ],
  "examples": [
    { "jp": "ちちは ごじゅっさいです。", "meaning": "Bố tôi 50 tuổi." }
  ]
}
```

## 6. Passage

```
Passage { title, type, lines: Line[] }
Line    { speaker?, jp, meaning }
```

| Field | Required | Meaning |
|---|---|---|
| `title` | yes | Title, e.g. `ミラーさんの毎日` |
| `type` | yes | `"reading"` or `"dialogue"` |
| `lines` | yes | The text, one line per sentence |

**Line**

| Field | Required | Meaning |
|---|---|---|
| `speaker` | no | Who says it (dialogues only), e.g. `A`, `てんいん` |
| `jp` | yes | The line |
| `meaning` | yes | Vietnamese meaning |

```json
{
  "title": "ミラーさんの毎日",
  "type": "reading",
  "lines": [
    { "jp": "ミラーさんは 毎朝 7時に 起きます。", "meaning": "Anh Miller mỗi sáng dậy lúc 7 giờ." }
  ]
}
```

## 7. Sound

```
Sound { title, explain, words: Item[] }
```

| Field | Required | Meaning |
|---|---|---|
| `title` | yes | e.g. `つ vs す` |
| `explain` | yes | How to tell them apart |
| `words` | yes | Words to listen to (at least 2) |

The app plays one word (browser speech) and I tap which one I heard. Browser speech can't show pitch accent, so this covers similar sounds only.

```json
{
  "title": "つ vs す",
  "explain": "つ: lưỡi chạm răng trên rồi bật ra. す: lưỡi không chạm, hơi thoát ra liên tục.",
  "words": [
    { "jp": "つき", "meaning": "Mặt trăng" },
    { "jp": "すき", "meaning": "Thích" }
  ]
}
```

## 8. Resource

```
Resource { title, url, note? }
```

| Field | Required | Meaning |
|---|---|---|
| `title` | yes | Name of the link |
| `url` | yes | The link |
| `note` | no | Why it's useful |

No activity. Resources are just listed on the lesson page.

```json
{ "title": "Từ điển Accent", "url": "https://accentjiten.com/", "note": "Tra trọng âm" }
```

## Full lesson file

```json
{
  "id": 4,
  "title": "かぞくは よにんです。",
  "vocab": [],
  "grammar": [],
  "kanji": [],
  "sentences": [],
  "notes": [],
  "passages": [],
  "sounds": [],
  "resources": []
}
```

| Field | Required | Meaning |
|---|---|---|
| `id` | yes | Lesson number, same as the file name |
| `title` | yes | Lesson title in Japanese |
| the 8 lists | no | Missing = empty |

## What the engine adds (I don't write these)

When loading, the engine adds two things to every item:

- **`lesson`**: the lesson id it came from, so items can be mixed across lessons.
- **`key`**: a stable id for saving progress (Got it / Again). Made from the kind + its main text, so reordering the file doesn't break progress:

| Kind | Key |
|---|---|
| Vocab | `vocab:` + `jp` |
| Grammar | `grammar:` + `pattern` |
| Kanji | `kanji:` + `char` |
| Sentence | `sentence:` + `jp` |
| Note | `note:` + `title` |
| Passage | `passage:` + `title` |
| Sound | `sound:` + `title` |
| Resource | `resource:` + `url` |
