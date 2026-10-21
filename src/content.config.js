import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const cases = defineCollection({
  loader: glob({ pattern: '*/{ru,en}.md', base: './src/content/cases' }),
  schema: z.object({
    order: z.number().optional(),
    group: z.string().optional(),
    format: z.enum(['md', 'html']).optional(),
    cover: z.string().optional(),
    stops: z.array(z.number()).optional(),
    live: z.array(z.enum(['rack', 'form', 'ai'])).optional(),
    schema: z.enum(['fic', 'mango', 'qm']).optional(),
    here: z.array(z.number()).optional(),
    marks: z.array(z.string()).optional(),
    meta: z.string().optional(),
    kicker: z.string().optional(),
    chip: z.string().optional(),
    tag: z.string().optional(),
    note: z.string().optional(),
    schemaCaption: z.string().optional(),
    figures: z.array(z.tuple([z.string(), z.string()])).optional(),
  }),
});

export const collections = { cases };
