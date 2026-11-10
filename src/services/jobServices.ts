import type { Job } from "../types.js";

const API_URL = "https://www.arbeitnow.com/api/job-board-api";
const REQUEST_TIMEOUT = 15000;
const MAX_PAGES = 20;

interface ArbeitnowJob {
  slug: string;
  company_name: string;
  title: string;
  description: string;
  remote: boolean;
  url: string;
  location: string;
  created_at: number;
}

interface ArbeitnowResponse {
  data: ArbeitnowJob[];
  links?: {
    next?: string | null;
  };
  meta?: {
    current_page?: number;
    last_page?: number;
  };
}

function normalizeJob(job: ArbeitnowJob): Job {
  return {
    id: job.slug,
    title: job.title,
    company: job.company_name,
    location: job.location,
    remote: job.remote,
    url: job.url,
    description: job.description,
    publishedAt: new Date(job.created_at * 1000).toISOString(),
  };
}

export async function fetchJobs(): Promise<Job[]> {
  const allJobs = new Map<string, Job>();

  let page = 1;

  while (page <= MAX_PAGES) {
    console.log(`Fetching page ${page}...`);

    const response = await fetch(`${API_URL}?page=${page}`, {
      signal: AbortSignal.timeout(REQUEST_TIMEOUT),
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch page ${page}: HTTP ${response.status}`
      );
    }

    const result = (await response.json()) as ArbeitnowResponse;

    if (!Array.isArray(result.data)) {
      throw new Error(`Invalid API response on page ${page}`);
    }

    if (result.data.length === 0) {
      break;
    }

    for (const apiJob of result.data) {
      const job = normalizeJob(apiJob);

      allJobs.set(job.id, job);
    }

    console.log(
      `Page ${page}: ${result.data.length} jobs, ${allJobs.size} unique`
    );

    // Stop if the API explicitly reports the final page.
    if (
      result.meta?.last_page !== undefined &&
      page >= result.meta.last_page
    ) {
      break;
    }

    // Stop if the API explicitly reports no next page.
    if (result.links && !result.links.next) {
      break;
    }

    page++;
  }

  return [...allJobs.values()];
}