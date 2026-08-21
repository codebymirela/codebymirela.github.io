let allProjects = [];


/*
---------------------------------------
LOAD PROJECT DATA
---------------------------------------
*/

async function getProjects() {

    const response =
        await fetch("./data/projects.json");

    if (!response.ok) {

        throw new Error(
            `HTTP ${response.status} - ${response.statusText}`
        );

    }

    return await response.json();
}


/*
---------------------------------------
CREATE PROJECT CARD
---------------------------------------
*/

function createProjectCard(repo) {

    const project =
        document.createElement("article");

    project.className = "project";


    /*
    Hide internal control topics
    */

    const hiddenTopics = [
        "portfolio",
        "featured"
    ];


    const visibleTopics =
        Array.isArray(repo.topics)

            ? repo.topics
                .filter(
                    topic =>
                        !hiddenTopics.includes(topic)
                )

            : [];


    const topicsHTML =
        visibleTopics

            .map(
                topic =>
                    `<span class="topic">${topic}</span>`
            )

            .join("");


    /*
    Last update
    */

    const date =
        repo.updated_at

            ? new Date(
                repo.updated_at
            ).toLocaleDateString("pt-BR")

            : "unknown";


    /*
    Live demo button
    */

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


    project.innerHTML = `

        <h3>
            ${repo.name}
        </h3>

        <p>
            ${
                repo.description
                ||
                "no description available"
            }
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
            language:
            ${repo.language || "unknown"}
        </p>

        <p class="project-meta">
            last update:
            ${date}
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
        document.getElementById(
            "featured-projects"
        );


    if (!container) {
        return;
    }


    const featured =
        repos.filter(
            repo =>
                Array.isArray(repo.topics)
                &&
                repo.topics.includes("featured")
        );


    container.innerHTML = "";


    if (featured.length === 0) {

        container.innerHTML = `
            <p>
                no featured projects yet.
            </p>
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
PROJECT ARCHIVE
---------------------------------------
*/

function renderProjectArchive(
    repos,
    filter = "all"
) {

    const container =
        document.getElementById(
            "project-archive"
        );


    if (!container) {
        return;
    }


    let filteredProjects = repos;


    /*
    Apply selected filter
    */

    if (filter !== "all") {

        filteredProjects =
            repos.filter(repo => {

                const topics =
                    Array.isArray(repo.topics)

                        ? repo.topics.map(
                            topic =>
                                topic.toLowerCase()
                        )

                        : [];


                const language =
                    repo.language
                        ?.toLowerCase();


                /*
                Match either:
                GitHub topic OR main language
                */

                return (
                    topics.includes(filter)
                    ||
                    language === filter
                );

            });

    }


    /*
    Update counter
    */

    const counter =
        document.getElementById(
            "filtered-project-count"
        );


    if (counter) {

        counter.textContent =
            filteredProjects.length;

    }


    container.innerHTML = "";


    if (filteredProjects.length === 0) {

        container.innerHTML = `

            <p>
                no projects found for
                "${filter}".
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
FILTER BUTTONS
---------------------------------------
*/

function configureFilters() {

    const buttons =
        document.querySelectorAll(
            ".filter-button"
        );


    buttons.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                /*
                Remove active state
                */

                buttons.forEach(btn => {

                    btn.classList.remove(
                        "active"
                    );

                });


                /*
                Mark clicked button
                */

                button.classList.add(
                    "active"
                );


                /*
                Get filter
                */

                const filter =
                    button.dataset.filter;


                /*
                Re-render archive
                */

                renderProjectArchive(
                    allProjects,
                    filter
                );

            }
        );

    });

}


/*
---------------------------------------
INITIALIZATION
---------------------------------------
*/

async function loadProjects() {

    try {

        allProjects =
            await getProjects();


        console.log(
            "Projects loaded:",
            allProjects
        );


        /*
        Sidebar counter
        */

        const count =
            document.getElementById(
                "project-count"
            );


        if (count) {

            count.textContent =
                allProjects.length;

        }


        /*
        Home
        */

        renderFeaturedProjects(
            allProjects
        );


        /*
        Projects page
        */

        renderProjectArchive(
            allProjects
        );


        /*
        Filters
        */

        configureFilters();


    } catch (error) {

        console.error(
            "PROJECT ERROR:",
            error
        );


        const featured =
            document.getElementById(
                "featured-projects"
            );


        const archive =
            document.getElementById(
                "project-archive"
            );


        const errorMessage = `

            <p>
                couldn't connect to
                project archive :(
            </p>

            <p class="project-meta">
                ${error.message}
            </p>

        `;


        if (featured) {

            featured.innerHTML =
                errorMessage;

        }


        if (archive) {

            archive.innerHTML =
                errorMessage;

        }

    }

}


loadProjects();