async function loadProjects() {
    const container = document.getElementById("featured-projects");
    const count = document.getElementById("project-count");

    try {
        const response = await fetch("./data/projects.json");

        if (!response.ok) {
            throw new Error(
                `HTTP ${response.status} - ${response.statusText}`
            );
        }

        const repos = await response.json();

        console.log("Projects loaded:", repos);

        if (count) {
            count.textContent = repos.length;
        }

        if (!container) {
            return;
        }

        container.innerHTML = "";

        if (repos.length === 0) {
            container.innerHTML = `
                <p>no portfolio projects found yet.</p>
            `;
            return;
        }

        repos.forEach(repo => {
            const project = document.createElement("article");

            project.className = "project";

            const topics = Array.isArray(repo.topics)
                ? repo.topics
                    .map(topic => `<span class="topic">${topic}</span>`)
                    .join("")
                : "";

            const date = repo.updated_at
                ? new Date(repo.updated_at).toLocaleDateString("pt-BR")
                : "unknown";

            project.innerHTML = `
                <h3>${repo.name}</h3>

                <p>
                    ${repo.description || "no description available"}
                </p>

                <div class="project-topics">
                    ${topics}
                </div>

                <p class="project-meta">
                    language: ${repo.language || "unknown"}
                </p>

                <p class="project-meta">
                    last update: ${date}
                </p>

                <a
                    href="${repo.html_url}"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    [ source code ]
                </a>
            `;

            container.appendChild(project);
        });

    } catch (error) {
        console.error("PROJECT ERROR:", error);

        if (container) {
            container.innerHTML = `
                <p>couldn't connect to project archive :(</p>
                <p class="project-meta">
                    ${error.message}
                </p>
            `;
        }
    }
}

loadProjects();