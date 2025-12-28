# AI Stylist – Semantic Fashion Search & Recommendation

> A modern e-commerce demo showcasing **AI-powered semantic search and outfit recommendations**, built with **Next.js, tRPC, Drizzle ORM, pgvector, and LangChain**.

This project explores how natural language understanding can replace rigid filters in fashion discovery — letting users search for things like *"formal outfit for an office meeting"* and receive **context-aware product suggestions**, grouped by category, with human-like explanations.

---

## 🧠 What This Project Does

Traditional e-commerce search relies on keywords and filters. This project goes further by:

* Understanding **intent**, not just words
* Mapping user prompts to **semantic embeddings**
* Validating product relevance using an **AI stylist agent**
* Grouping results by category with **human-readable reasoning**

In short: it behaves like a knowledgeable in-store stylist, not a search box.

---

## ✨ Key Features

### 🔍 Semantic Product Search

* Product catalog embedded using **OpenAI embeddings**
* Similarity search powered by **pgvector**
* Cosine distance–based ranking

### 🤖 AI Stylist Agent

* LangChain-based agent that:

  * Interprets user intent
  * Validates product suitability (strict, non-generous)
  * Explains *why* a product fits, in a salesman-like tone

### ⚡ Modern Full-Stack Setup

* **Next.js App Router**
* **tRPC** for fully type-safe APIs
* **Drizzle ORM** with PostgreSQL
* A mix of **Server Actions** and **Client Side tRPC calls** effecient UI rendering

---

## 🗂️ Tech Stack

| Layer    | Technology                          |
| -------- | ----------------------------------- |
| Frontend | Next.js, React, Tailwind            |
| Backend  | tRPC, Server Actions                |
| ORM      | Drizzle ORM                         |
| Database | PostgreSQL + pgvector               |
| AI       | OpenAI Embeddings, LangChain        |
| Search   | Vector similarity (cosine distance) |

---

## 📦 Database Design

<img alt="image" src="https://github.com/user-attachments/assets/276e9c71-ce21-4656-8d29-31403cdb1a16" />

---

## 🔁 AI Decision Flow

This project follows a **deterministic, inspectable AI pipeline** rather than a black-box recommendation system.

A visual flowchart of this process is included in the repository as an image (PNG) and should be read top-to-bottom:

<img alt="image" src="https://github.com/user-attachments/assets/dd08cf70-8640-43da-8680-1c47fa4859fd" />

### Flow Overview

1. **User Prompt** is received from the AI Stylist modal
2. **Categories are fetched dynamically** from the database
3. An **LLM maps the prompt to relevant categories** (single or multiple)
4. If no category is relevant → a safe *"not found"* response is returned
5. The prompt is embedded using OpenAI embeddings
6. **Vector search is executed only within the selected category IDs**
7. If no products are found → a safe *"no matching products"* response is returned
8. A second **LLM pass strictly filters and explains** each product
9. Results are **grouped by category**, formatted, and returned to the UI

This guarantees:

* No hardcoded categories (e.g. shirts / pants / shoes)
* No guessing based on string matching
* Clear failure modes at every step

---

## 🧪 Example Prompt

> *"I need a formal outfit for an office presentation"*

The system may return:

* **Category: Shirts**

  * Reason: Crisp, neutral-toned shirts align with professional settings
  * Products: Oxford shirt, slim-fit white shirt

* **Category: Trousers**

  * Reason: Tailored trousers complete a formal silhouette

Each product includes a short, human explanation — not AI fluff.
