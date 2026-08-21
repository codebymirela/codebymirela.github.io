async function loadProjects() {

    const container =
        document.getElementById("featured-projects");

    try {

        const response =
            await fetch("data/projects.json");

        const repos =
            await response.json();


        const count =
            document.getElementById("project-count");

        if (count) {
            count.textContent = repos.length;
        }


        if (!container) {
            return;
        }


        container.innerHTML = "";


        repos
            .slice(0, 6)
            .forEach(repo => {

                const project =
                    document.createElement("article");

                project.className = "project";


                const topics =
                    repo.topics
                        ?.map(topic =>
                            `<span class="topic">${topic}</span>`
                        )
                        .join("") || "";


                const date =
                    new Date(repo.updated_at)
                        .toLocaleDateString("pt-BR");


                project.innerHTML = `

                    <h3>
                        ${repo.name}
                    </h3>

                    <p>
                        ${repo.description || "no description available"}
                    </p>

                    <div class="project-topics">
                        ${topics}
                    </div>

                    <p class="project-meta">
                        language:
                        ${repo.language || "unknown"}
                    </p>

                    <p class="project-meta">
                        last update:
                        ${date}
                    </p>

                    <a
                        href="${repo.html_url}"
                        target="_blank"
                    >
                        [ source code ]
                    </a>

                `;


                container.appendChild(project);

            });


    } catch (error) {

        console.error(error);

        if (container) {

            container.innerHTML =
                "<p>couldn't connect to project archive :(</p>";

        }

    }

}


loadProjects();