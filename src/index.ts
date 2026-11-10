import { filterJobs } from "./services/jobFilter.js";
import { fetchJobs } from "./services/jobServices.js";

async function main() {
  console.log("🔍 Starting job search...\n");

  const jobs = await fetchJobs();

  console.log(`\nTotal unique jobs: ${jobs.length}`);

  const relevantJobs = filterJobs(jobs);

  console.log(`Relevant jobs: ${relevantJobs.length}\n`);

  for (const job of relevantJobs) {
    console.log(`💼 ${job.title}`);
    console.log(`🏢 ${job.company}`);
    console.log(`📍 ${job.location}`);
    console.log(`🏠 Remote: ${job.remote ? "Yes" : "No"}`);
    console.log(`🔗 ${job.url}`);
    console.log("-----------------------------");
  }
}

main().catch((error) => {
  console.error("Job search failed:", error);
  process.exitCode = 1;
});