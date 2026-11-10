import type { Job } from "../types.js";

const keywords = [
  "react",
  "typescript",
  "next.js",
  "frontend",
  "fullstack",
  "ai developer",
];

const locations = ["berlin", "potsdam", "remote"];

export function filterJobs(jobs: Job[]): Job[] {
  return jobs.filter((job) => {
    const title = job.title.toLowerCase();
    const location = job.location.toLowerCase();

    const matchesKeyword = keywords.some((keyword) =>
      title.includes(keyword)
    );

    const matchesLocation = locations.some((city) =>
      location.includes(city)
    );

    return matchesKeyword && matchesLocation;
  });
}