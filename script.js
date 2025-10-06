const username = "brunoengineer"; // Replace with your GitHub username if different
const repoList = document.getElementById("repo-list");
const lastUpdated = document.getElementById("last-updated");

async function getGitHubPagesRepos() {
    try {
        let allRepos = [];
        let page = 1;
        let hasMore = true;
        // Fetch all pages until no more repos
        while (hasMore) {
            const response = await fetch(`https://api.github.com/users/${username}/repos?per_page=100&page=${page}&timestamp=${Date.now()}`, {
                headers: {
                    'Accept': 'application/vnd.github.v3+json'
                }
            });
            if (!response.ok) {
                throw new Error(`GitHub API error: ${response.status} - ${response.statusText}`);
            }
            const repos = await response.json();
            allRepos = allRepos.concat(repos);
            if (repos.length < 100) {
                hasMore = false;
            } else {
                page++;
            }
        }

        const pagesRepos = allRepos
            .filter(repo => repo.has_pages && repo.name !== "myGitHubPages")
            .map(repo => ({
                name: repo.name,
                url: `https://${username}.github.io/${repo.name}/`,
                description: repo.description || "No description available"
            }));

        repoList.innerHTML = "";
        if (pagesRepos.length > 0) {
            pagesRepos.forEach(repo => {
                const listItem = document.createElement("li");
                listItem.innerHTML = `
                    <a href="${repo.url}" target="_blank">${repo.name}</a>
                    <p class="description">${repo.description}</p>
                `;
                repoList.appendChild(listItem);
            });
        } else {
            repoList.innerHTML = "<li>No GitHub Pages sites found for this user.</li>";
        }
        lastUpdated.textContent = new Date().toLocaleString();
    } catch (error) {
        repoList.innerHTML = `<li>⚠️ Error loading repositories: ${error.message}</li>`;
        lastUpdated.textContent = "Failed to update";
        console.error("Fetch error:", error);
    }
}

// Fetch data immediately
getGitHubPagesRepos();

// Optional: Refresh every 5 minutes (300,000 ms) to keep it updated
setInterval(getGitHubPagesRepos, 300000);
