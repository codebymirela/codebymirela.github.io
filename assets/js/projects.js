let allProjects = [];

const hiddenTopics = [
    "portfolio",
    "featured"
];


/*
---------------------------------------
LOAD PROJECT DATA
---------------------------------------
*/

async function getProjects() {
    const response = await fetch("./data/projects.json");

    if (!response.ok) {
        throw new Error(
            `HTTP ${response.status} - ${response.statusText}`
        );
    }

    return await response.json();
}


/*
---------------------------------------
HELPERS
---------------------------------------
*/

function getVisibleTopics(repo) {
    if (!Array.isArray(repo.topics)) {
        return [];
    }

    return repo.topics.filter(
        topic => !hiddenTopics.includes(topic)
    );
}


function formatDate(dateString) {
    if (!dateString) {
        return "unknown";
    }

    return new Date(dateString)
        .toLocaleDateString("pt-BR");
}


/*
---------------------------------------
CREATE PROJECT CARD
---------------------------------------
*/

function createProjectCard(repo) {
    const project = document.createElement("article");

    project.className = "project";

    const visibleTopics = getVisibleTopics(repo);

    const topicsHTML = visibleTopics
        .map(topic =>
            `<span class="topic">${topic}</span>`
        )
        .join("");

    const liveDemo = repo.homepage
        ? `
            <a
                href="${repo.homepage}"
                target="_blank"
                rel="noopener noreferrer"
            >
                [ live demo ]
            </a>
        `
        : "";

    project.innerHTML = `
        <h3>${repo.name}</h3>

        <p>
            ${repo.description || "no description available"}
        </p>

        ${
            visibleTopics.length > 0
                ? `
                    <div class="project-topics">
                        ${topicsHTML}
                    </div>
                `
                : ""
        }

        <p class="project-meta">
            language: ${repo.language || "unknown"}
        </p>

        <p class="project-meta">
            last update: ${formatDate(repo.updated_at)}
        </p>

        <div class="project-links">
            <a
                href="${repo.html_url}"
                target="_blank"
                rel="noopener noreferrer"
            >
                [ source code ]
            </a>

            ${liveDemo}
        </div>
    `;

    return project;
}


/*
---------------------------------------
HOME — FEATURED PROJECTS
---------------------------------------
*/

function renderFeaturedProjects(repos) {
    const container =
        document.getElementById("featured-projects");

    if (!container) {
        return;
    }

    const featured = repos.filter(repo =>
        Array.isArray(repo.topics) &&
        repo.topics.includes("featured")
    );

    container.innerHTML = "";

    if (featured.length === 0) {
        container.innerHTML = `
            <p>no featured projects yet.</p>
        `;
        return;
    }

    featured.forEach(repo => {
        container.appendChild(
            createProjectCard(repo)
        );
    });
}


/*
---------------------------------------
BUILD DYNAMIC FILTERS
---------------------------------------
*/

function getAllFilterTopics(repos) {
    const topicSet = new Set();

    repos.forEach(repo => {
        const visibleTopics = getVisibleTopics(repo);

        visibleTopics.forEach(topic => {
            topicSet.add(topic.toLowerCase());
        });
    });

    return Array.from(topicSet).sort();
}


function renderFilterButtons(repos) {
    const filterContainer =
        document.getElementById("project-filters");

    if (!filterContainer) {
        return;
    }

    const topics = getAllFilterTopics(repos);

    filterContainer.innerHTML = "";

    const allButton = document.createElement("button");
    allButton.className = "filter-button active";
    allButton.dataset.filter = "all";
    allButton.textContent = "[ all ]";

    filterContainer.appendChild(allButton);

    topics.forEach(topic => {
        const button = document.createElement("button");

        button.className = "filter-button";
        button.dataset.filter = topic;
        button.textContent = `[ ${topic} ]`;

        filterContainer.appendChild(button);
    });
}


/*
---------------------------------------
PROJECT ARCHIVE
---------------------------------------
*/

function renderProjectArchive(repos, filter = "all") {
    const container =
        document.getElementById("project-archive");

    if (!container) {
        return;
    }

    let filteredProjects = repos;

    if (filter !== "all") {
        filteredProjects = repos.filter(repo => {
            const topics = getVisibleTopics(repo)
                .map(topic => topic.toLowerCase());

            return topics.includes(filter);
        });
    }

    const counter =
        document.getElementById("filtered-project-count");

    if (counter) {
        counter.textContent = filteredProjects.length;
    }

    container.innerHTML = "";

    if (filteredProjects.length === 0) {
        container.innerHTML = `
            <p>
                no projects found for "${filter}".
            </p>
        `;
        return;
    }

    filteredProjects.forEach(repo => {
        container.appendChild(
            createProjectCard(repo)
        );
    });
}


/*
---------------------------------------
FILTER EVENTS
---------------------------------------
*/

function configureFilters() {
    const buttons =
        document.querySelectorAll(".filter-button");

    buttons.forEach(button => {
        button.addEventListener("click", () => {
            buttons.forEach(btn => {
                btn.classList.remove("active");
            });

            button.classList.add("active");

            const filter = button.dataset.filter;

            renderProjectArchive(allProjects, filter);
        });
    });
}


/*
---------------------------------------
INITIALIZATION
---------------------------------------
*/

async function loadProjects() {
    try {
        allProjects = await getProjects();

        console.log("Projects loaded:", allProjects);

        const count =
            document.getElementById("project-count");

        if (count) {
            count.textContent = allProjects.length;
        }

        renderFeaturedProjects(allProjects);

        renderFilterButtons(allProjects);

        renderProjectArchive(allProjects, "all");

        configureFilters();

    } catch (error) {
        console.error("PROJECT ERROR:", error);

        const featured =
            document.getElementById("featured-projects");

        const archive =
            document.getElementById("project-archive");

        const filters =
            document.getElementById("project-filters");

        const errorMessage = `
            <p>couldn't connect to project archive :(</p>
            <p class="project-meta">${error.message}</p>
        `;

        if (featured) {
            featured.innerHTML = errorMessage;
        }

        if (archive) {
            archive.innerHTML = errorMessage;
        }

        if (filters) {
            filters.innerHTML = `
                <p class="project-meta">
                    couldn't load filters
                </p>
            `;
        }
    }
}

loadProjects();