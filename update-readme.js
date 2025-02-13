const fs = require('fs');  // File system module to read and write files
const { Octokit } = require('@octokit/rest');  // GitHub API client

const GITHUB_TOKEN = process.env.PERSONAL_ACCESS_TOKEN;  // Get PAT from the environment
const USERNAME = 'vozikkks';  // Replace with your GitHub username

// Create an Octokit instance with authentication
const octokit = new Octokit({ auth: GITHUB_TOKEN });

async function updateReadMe() {
    let allRepos = [];
    let page = 1;

    // Fetch repositories with pagination (if you have more than 100)
    while (true) {
        const { data: repos } = await octokit.repos.listForUser({
            username: USERNAME,
            per_page: 100,
            page: page,  // Pagination
        });

        if (repos.length === 0) break; // Exit if no more repos
        allRepos = allRepos.concat(repos); // Add repos from current page
        page++; // Move to next page
    }

    // Filter repositories that contain 'showcase' in their name
    const showcaseRepos = allRepos
        .filter(repo => repo.name.includes('showcase'))  // Filter by 'showcase'
        .map(repo => `- [${repo.name}](${repo.html_url})`)  // Format as Markdown links
        .join('\n');  // Join the links as a single string

    const readmePath = './README.md';  // Path to your README file
    const readmeContent = fs.readFileSync(readmePath, 'utf-8');  // Read the current README

    // Replace content between <!-- SHOWCASE START --> and <!-- SHOWCASE END -->
    const updatedContent = readmeContent.replace(
        /<!-- SHOWCASE START -->([\s\S]*?)<!-- SHOWCASE END -->/,
        `<!-- SHOWCASE START -->\n${showcaseRepos}\n<!-- SHOWCASE END -->`
    );

    // Write updated content back to README.md
    fs.writeFileSync(readmePath, updatedContent, 'utf-8');
}

// Run the function and catch any errors
updateReadMe().catch(err => {
    console.error(err);  // Log the error
    process.exit(1);  // Exit with error code
});