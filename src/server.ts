import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Pool } from 'pg';
import OpenAI from 'openai';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

app.post('/api/analyze', async (req: Request, res: Response) => {
  try {
    const { idea } = req.body;
    if (!idea || idea.length < 20) {
      return res.status(400).json({ error: 'Idea must be at least 20 characters' });
    }

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-2024-08-06',
      messages: [
        {
          role: 'system',
          content: `You are a sharp, skeptical startup advisor performing an adversarial "pre-mortem" on a startup idea. Your job is to find the risks most likely to kill this idea before the market does. Be specific, not generic. Return ONLY valid JSON matching this exact structure, no markdown, no commentary:
{
  "summary": "one crisp paragraph describing what the startup does and its core bet",
  "risks": [
    {
      "title": "a sharp, specific risk title (not generic like 'market risk')",
      "severity": "critical" | "high" | "medium" | "low",
      "description": "1-2 sentences explaining why this is a risk for THIS specific idea",
      "evidence": "1-2 sentences of concrete reasoning or signal that supports this risk",
      "mitigation": "one concrete, actionable first step to reduce this risk"
    }
  ]
}
Return exactly 5 risks, ordered from most to least severe, with a realistic mix of severities (not all critical) reflecting genuine risk assessment.`,
        },
        {
          role: 'user',
          content: `Run a pre-mortem on this startup idea: ${idea}`,
        },
      ],
      temperature: 1,
    });

    const text = response.choices[0].message.content || '';
    const report = JSON.parse(text);
    const slug = Math.random().toString(36).substring(2, 10);

    // Save to database, but don't fail the request if this errors
    try {
      await pool.query(
        'INSERT INTO reports (slug, idea, report) VALUES ($1, $2, $3)',
        [slug, idea, JSON.stringify(report)]
      );
    } catch (dbError) {
      console.warn('Database save failed (proceeding anyway):', dbError);
    }

    res.json({ slug, report });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: String(error) });
  }
});

app.get('/api/reports/:slug', async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const result = await pool.query('SELECT idea, report FROM reports WHERE slug = $1', [slug]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Report not found' });
    }
    res.json({ slug, idea: result.rows[0].idea, report: result.rows[0].report });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to fetch report' });
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
