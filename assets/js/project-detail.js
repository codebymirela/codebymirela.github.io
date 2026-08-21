async function loadProject() {
    const params =
        new URLSearchParams(
            window.location.search
        );

    const repoName =
        params.get("repo");


    const title =
        document.getElementById(
            "project-title"
        );


    const container =
        document.getElementById(
            "project-detail"
        );


    if (!repoName) {
        title.textContent =
            "PROJECT NOT FOUND";

        container.innerHTML = `
            <section class="box">
                <p>
                    missing repository parameter.
                </p>
            </section>
        `;

        return;
    }


    try {
        const response =
            await fetch(
                "/data/projects.json"
            );


        if (!response.ok) {
            throw new Error(
                `HTTP ${response.status}`
            );
        }


        const repos =
            await response.json();


        const repo =
            repos.find(
                project =>
                    project.name === repoName
            );


        if (!repo) {
            title.textContent =
                "PROJECT NOT FOUND";

            container.innerHTML = `
                <section class="box">
                    <p>
                        repository "${repoName}"
                        was not found.
                    </p>
                </section>
            `;

            return;
        }


        renderProject(repo);

    } catch (error) {
        console.error(error);

        title.textContent =
            "PROJECT ERROR";

        container.innerHTML = `
            <section class="box">

                <p>
                    couldn't load project :(
                </p>

                <p class="project-meta">
                    ${error.message}
                </p>

            </section>
        `;
    }
}


function renderProject(repo) {
    const title =
        document.getElementById(
            "project-title"
        );


    const container =
        document.getElementById(
            "project-detail"
        );


    title.textContent =
        repo.name;


    document.title =
        `${repo.name} | Mirela`;


    const hiddenTopics = [
        "portfolio",
        "featured"
    ];


    const visibleTopics =
        Array.isArray(repo.topics)
            ? repo.topics.filter(
                topic =>
                    !hiddenTopics.includes(topic)
            )
            : [];


    const topics =
        visibleTopics
            .map(topic =>
                `<span class="topic">${topic}</span>`
            )
            .join("");


    const updateDate =
        repo.updated_at
            ? new Date(
                repo.updated_at
            ).toLocaleDateString("pt-BR")
            : "unknown";


    const createdDate =
        repo.created_at
            ? new Date(
                repo.created_at
            ).toLocaleDateString("pt-BR")
            : "unknown";


    const liveDemo =
        repo.homepage
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


    container.innerHTML = `

        <section class="box project-hero">

            <p class="project-meta">
                PROJECT FILE
            </p>

            <h2>
                ${repo.name}
            </h2>

            <p>
                ${
                    repo.description
                    ||
                    "no description available"
                }
            </p>

            <div class="project-topics">
                ${topics}
            </div>

        </section>


        <section class="box">

            <h2>project metadata</h2>

            <p>
                <strong>language:</strong>
                ${repo.language || "unknown"}
            </p>

            <p>
                <strong>created:</strong>
                ${createdDate}
            </p>

            <p>
                <strong>last update:</strong>
                ${updateDate}
            </p>

            <p>
                <strong>stars:</strong>
                ${repo.stargazers_count ?? 0}
            </p>

            <p>
                <strong>forks:</strong>
                ${repo.forks_count ?? 0}
            </p>

        </section>


        <section class="box">

            <h2>repository access</h2>

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

        </section>


        <section class="box">

            <h2>project notes</h2>

            <p>
                detailed documentation
                coming soon...
            </p>

        </section>

    `;
}


loadProject();