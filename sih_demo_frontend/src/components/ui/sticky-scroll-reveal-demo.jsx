'use client';
import React from 'react';
import { StickyScroll } from '@/components/ui/sticky-scroll-reveal';

const content = [
  {
    title: 'Step 1: Ask a Question',
    description:
      'Initiate your exploration by posing a question in plain, natural language. The system is designed to understand conversational requests, eliminating the need for complex syntax or coding. For the most accurate results, provide clear context such as a specific time range (e.g., "from 2020 to 2023"), a geographical area (e.g., "in the North Atlantic Ocean"), the scientific variables of interest (e.g., "temperature and salinity"), and the desired output format (e.g., "show me a map" or "plot the data").',
    content: (
      <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(to_bottom_right,#e0f2fe,#bfdbfe)] text-slate-900">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-xl font-bold shadow">
            1
          </span>
          <span className="text-sm font-semibold">Ask a Question</span>
        </div>
      </div>
    ),
  },
  {
    title: 'Step 2: AI Interpretation',
    description:
      'Once a question is submitted, our advanced Large Language Model (LLM) parses the text to discern intent and extract key parameters. It validates requested variables against our data dictionary, automatically resolves units (e.g., converting feet to meters), and applies the necessary filters. The AI then intelligently selects the most efficient data sources and constructs a precise, structured query (e.g., SQL) that the database can execute, effectively translating human language into machine-readable instructions.',
    content: (
      <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(to_bottom_right,#ede9fe,#ddd6fe)] text-slate-900">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-xl font-bold shadow">
            2
          </span>
          <span className="text-sm font-semibold">AI Interpretation</span>
        </div>
      </div>
    ),
  },
  {
    title: 'Step 3: Data Retrieval',
    description:
      'The machine-readable query is executed against our optimized data infrastructure, which utilizes PostgreSQL for fast metadata lookups and Parquet for high-performance analytical queries on large-scale datasets. To ensure speed and reliability, queries are intelligently paginated to handle large results, and a caching layer stores recent results for near-instantaneous retrieval on repeat requests. The system automatically joins the raw data with relevant metadata, enriching it with context to ensure the final output is both accurate and complete.',
    content: (
      <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(to_bottom_right,#dcfce7,#bbf7d0)] text-slate-900">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-xl font-bold shadow">
            3
          </span>
          <span className="text-sm font-semibold">Data Retrieval</span>
        </div>
      </div>
    ),
  },
  {
    title: 'Step 4: Visualize Insights',
    description:
      'The retrieved data is transformed into clear, actionable insights. Results are rendered as fully interactive visualizations, such as dynamic maps and rich profile charts, allowing you to explore the data intuitively. Alongside visuals, the AI provides a concise summary of the key findings in natural language. For further analysis, you can export the generated views or the underlying datasets to common formats like CSV or the scientific standard NetCDF with a single click.',
    content: (
      <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(to_bottom_right,#fee2e2,#fecaca)] text-slate-900">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-xl font-bold shadow">
            4
          </span>
          <span className="text-sm font-semibold">Visualize Insights</span>
        </div>
      </div>
    ),
  },
];

export default function StickyScrollRevealDemo() {
  return (
    <div className="w-full py-4">
      <StickyScroll content={content} />
    </div>
  );
}
