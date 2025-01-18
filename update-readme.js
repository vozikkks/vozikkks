require('dotenv').config(); // Load environment variables from .env

const fs = require('fs'); // File system module to read and write files
const { Octokit } = require('@octokit/rest'); // GitHub API client

// GitHub token will be passed through environment variables
const GITHUB_TOKEN = process.env.PERSONAL_ACCESS_TOKEN;
const USERNAME = 'vozikkks';

// Create an instance of the Octokit client with authentication
const octokit = new Octokit({ auth: GITHUB_TOKEN });

async function updateReadMe() {
    // Fetch the list of repositories for the user
    const { data: repos } = await octokit.repos.listForUser({
        username: USERNAME, // GitHub username
        per_page: 100, // Number of repositories to fetch (maximum 100 per request)
    });

    // Filter repositories by a specific identifier in their name (e.g., "showcase")
    const showcaseRepos = repos
        .filter(repo => repo.name.includes('showcase')) // Check if the repo name includes "showcase"
        //.filter(repo => true) // to test without the key word
        .map(repo => `- [${repo.name}](${repo.html_url})`) // Format each repo as a Markdown link
        .join('\n'); // Combine all links into a single string

    const readmePath = './README.md'; // Path to the README file
    const readmeContent = fs.readFileSync(readmePath, 'utf-8'); // Read the current content of README.md

    // Replace the content between <!-- SHOWCASE START --> and <!-- SHOWCASE END -->
    const updatedContent = readmeContent.replace(
        /<!-- SHOWCASE START -->([\s\S]*?)<!-- SHOWCASE END -->/,
        `<!-- SHOWCASE START -->\n${showcaseRepos}\n<!-- SHOWCASE END -->`
    );

    // Write the updated content back to the README file
    fs.writeFileSync(readmePath, updatedContent, 'utf-8');
}

// Run the function and catch any errors
updateReadMe().catch(err => {
    console.error(err); // Log the error
    process.exit(1); // Exit the script with an error code
});