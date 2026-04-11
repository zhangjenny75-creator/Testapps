# GEO Tool — Generative Engine Optimization for Social Media

Make your Facebook and Instagram posts **discoverable by LLMs** like ChatGPT,
Claude, Perplexity, and Gemini.

SEO = get found on Google. **GEO** = get cited by AI.

## What it does

Paste any social media caption and the tool will:

1. **Score** it on 9 GEO factors (0–100 overall score + letter grade)
2. **Explain** which factors are hurting your discoverability
3. **Generate** an optimized rewrite template
4. **Produce** JSON-LD schema markup you can paste onto any webpage you link
   from your posts — this is the single biggest lever for LLM citation

## GEO factors scored

| Factor            | Weight | Why it matters                                          |
|-------------------|--------|---------------------------------------------------------|
| Clarity           | 15     | LLMs prefer short, precise sentences                    |
| Entity density    | 15     | Named people/brands/places link to knowledge graphs     |
| Factual claims    | 15     | Numbers & stats make content citable                    |
| Q&A structure     | 10     | LLMs retrieve question→answer patterns heavily          |
| Structured format | 10     | Lists & bullets parse cleanly                           |
| Quotability       | 10     | Short, self-contained sentences get quoted verbatim     |
| Topic signals     | 10     | Repeated niche keywords categorize your content         |
| Hashtag quality   | 8      | Descriptive hashtags act as topic tags for LLMs         |
| Call to action    | 7      | Engagement → popularity signals → training pipelines    |

## Running locally

```bash
cd geo-tool
npm install
npm start
```

Then open <http://localhost:3000>.

## API endpoints

- `POST /api/analyze` — `{ text, platform }` → full GEO analysis
- `POST /api/optimize` — `{ text, platform }` → rewrite template
- `POST /api/schema` — `{ text, options }` → JSON-LD structured data
- `GET  /api/health` — health check

## Tech stack

- Node.js + Express (no build step, no framework bloat)
- Vanilla HTML/CSS/JS frontend
- Pure JS scoring engine in `src/geo-analyzer.js`
