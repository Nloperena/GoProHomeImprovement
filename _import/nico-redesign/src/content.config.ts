import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro:schema';

const services = defineCollection({
	loader: glob({ pattern: '**/*.md', base: './src/content/services' }),
	schema: z.object({
		title: z.string(),
		shortTitle: z.string(),
		excerpt: z.string(),
		heroImage: z.string(),
		heroAlt: z.string(),
		primaryKeyword: z.string().optional(),
		metaTitle: z.string(),
		metaDescription: z.string().max(160),
		processSteps: z
			.array(
				z.object({
					title: z.string(),
					body: z.string(),
				})
			)
			.optional()
			.default([]),
		includes: z.array(z.string()).optional().default([]),
		excludes: z.array(z.string()).optional().default([]),
		startingPrice: z.string().nullable().optional(),
		typicalDuration: z.string().optional(),
		faq: z
			.array(
				z.object({
					question: z.string(),
					body: z.string(),
				})
			)
			.optional()
			.default([]),
		relatedServices: z.array(z.string()).optional().default([]),
		ogImage: z.string().optional(),
	}),
});

const projects = defineCollection({
	loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
	schema: z.object({
		title: z.string(),
		location: z.string(),
		excerpt: z.string(),
		heroImage: z.string(),
		gallery: z.array(z.string()).optional().default([]),
		challenge: z.string().optional(),
		approach: z.string().optional(),
		outcome: z.string().optional(),
		metaTitle: z.string(),
		metaDescription: z.string().max(160),
	}),
});

const serviceAreas = defineCollection({
	loader: glob({ pattern: '**/*.md', base: './src/content/service-areas' }),
	schema: z.object({
		title: z.string(),
		city: z.string(),
		metaTitle: z.string(),
		metaDescription: z.string().max(160),
	}),
});

const posts = defineCollection({
	loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
	schema: z.object({
		title: z.string(),
		date: z.date(),
		excerpt: z.string(),
		heroImage: z.string(),
		metaTitle: z.string(),
		metaDescription: z.string().max(160),
		author: z.string().default('Go Pro Home Improvements'),
	}),
});

export const collections = {
	services,
	projects,
	'service-areas': serviceAreas,
	posts,
};
