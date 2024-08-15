let jsonObject = {};

/**
 * Get the JSON data containing the current table of workable items
 */
async function getFileData() {
    await fetch('project-list.json')
        .then((response) => response.json())
        .then((jsonObj) => {
            jsonObject = jsonObj;
        })
        .catch((error) => {
            console.log('Could not fetch JSON:', error)
        });
}

/**
 * Generate the individual project element.
 * @param projectData 
 * @returns projectBlock
 */
function getProjectElement(projectData, categoryIndex, projectIndex) {
    // Create full block for the project
    let projectBlock = document.createElement("div");
    projectBlock.className = `project-block project-block-${categoryIndex}-${projectIndex}`;

    // Create element that holds the task's title
    let titleElement = document.createElement("div");
    titleElement.className = "project-block-title project-block-center";
    titleElement.innerHTML = `Title: ${projectData.title}`;
    projectBlock.appendChild(titleElement);

    // Create element that holds both the project title and priority
    let projectPriorityGroupElement = document.createElement("div");
    projectPriorityGroupElement.className = "project-block-project-priority-group";

    // Create element that holds the project title
    let projectAssociationElement = document.createElement("span");
    projectAssociationElement.className = "project-block-project-association";
    projectAssociationElement.innerText = `Project: ${projectData.projectRepository ? "" : projectData.projectAssociation}`;

    // Add the repository as a link, if applicable
    let projectRepositoryElement = null
    if (projectData.projectRepository) {
        projectRepositoryElement = document.createElement("a");
        projectRepositoryElement.href = projectData.projectRepository;
        projectRepositoryElement.target = "_";
        projectRepositoryElement.innerText = projectData.projectAssociation;
        projectRepositoryElement.className = "project-block-project-repository";
        projectAssociationElement.appendChild(projectRepositoryElement);
    } 

    projectPriorityGroupElement.appendChild(projectAssociationElement);

    // Create element that holds the priority
    let priorityElement = document.createElement("span");
    priorityElement.className = "project-block-priority";
    priorityElement.innerText = ` | Priority: ${projectData.priority}`;
    projectPriorityGroupElement.appendChild(priorityElement);

    projectBlock.appendChild(projectPriorityGroupElement);

    // Create element that holds the date the task was proposed
    let dateProposedElement = document.createElement("div");
    dateProposedElement.className = "project-block-date-proposed project-block-center";
    dateProposedElement.innerText = `Date Proposed: ${projectData.dateProposed}`;
    projectBlock.appendChild(dateProposedElement);

    // Create element that holds the date the task was completed, if applicable
    if (projectData.dateCompleted) {
        let dateCompletedElement = document.createElement("div");
        dateCompletedElement.className = `project-block-date-completed project-block-hidden-component project-block-hideable-component-${categoryIndex}-${projectIndex}`;
        dateCompletedElement.innerText = `Date Completed: ${projectData.dateCompleted}`;
        projectBlock.appendChild(dateCompletedElement);
    }

    // Create elements that hold the date dropped and the reason for dropping the task, if applicable
    if (projectData.dateDropped) {
        let dateDroppedElement = document.createElement("div");
        dateDroppedElement.className = `project-block-date-dropped project-block-hidden-component project-block-hideable-component-${categoryIndex}-${projectIndex}`;
        dateDroppedElement.innerText = `Date Dropped: ${projectData.dateDropped}`;
        projectBlock.appendChild(dateDroppedElement);

        let reasonElement = document.createElement("div");
        reasonElement.className = `project-block-dropped-reason project-block-hidden-component project-block-hideable-component-${categoryIndex}-${projectIndex}`;
        reasonElement.innerText = `Reason: ${projectData.reason}`;
        projectBlock.appendChild(reasonElement);
    }

    // Create element that holds the expanded details of the task
    let descriptionElement = document.createElement("div");
    descriptionElement.className = `project-block-description project-block-hidden-component project-block-hideable-component-${categoryIndex}-${projectIndex}`;
    descriptionElement.innerText = `Description:\n${projectData.description}`;
    projectBlock.appendChild(descriptionElement);

    // Creates element that holds the main objectives or goals of the task
    let criteriaTitleElement = document.createElement("div");
    criteriaTitleElement.className = `project-block-criteria project-block-hidden-component project-block-hideable-component-${categoryIndex}-${projectIndex}`;
    criteriaTitleElement.innerText = "Criteria:";
    projectBlock.appendChild(criteriaTitleElement);

    // Creates the list elements that contain individual objectives or goals that will be added to the criteria list
    let criteriaListElement = document.createElement("ul");
    criteriaListElement.className = `project-block-criteria-list project-block-hidden-component project-block-hideable-component-${categoryIndex}-${projectIndex}`;

    for (let i = 0; i < projectData.criteria.length; i++) {
        let criteriaListItemElement = document.createElement("li");
        criteriaListItemElement.className = "project-block-criteria-list-item";
        criteriaListItemElement.innerText = projectData.criteria[i];
        criteriaListElement.appendChild(criteriaListItemElement);
    }

    projectBlock.appendChild(criteriaListElement);

    // Creates function that triggers the visibility of the project's further details
    projectBlock.addEventListener("click", () => {
        let togglableElements = document.getElementsByClassName(`project-block-hideable-component-${categoryIndex}-${projectIndex}`);
        for (let i = 0; i < togglableElements.length; i++) {
            togglableElements[i].classList.toggle("project-block-hidden-component");
            togglableElements[i].classList.toggle("project-block-visible-component");
        }
    });

    return projectBlock;
}

/**
 * Generates the list of projects for an individual category.
 * @param categoryData 
 * @returns projectElementsList
 */
function getProjectElementList(categoryData, categoryIndex) {
    let projectElementsList = [];
    for (let i = 0; i < categoryData.length; i++) {
        projectElementsList.push(getProjectElement(categoryData[i], categoryIndex, i));
    }
    return projectElementsList;
}

/**
 * Takes the jsonObject data and renders it into the DOM.
 */
function displayAllProjects() {
    let allProjectsBlock = document.getElementById("all-projects-block");

    Object.keys(jsonObject).forEach((categoryName, categoryIndex) => {
        let categoryGroupElement  = document.createElement("div");
        categoryGroupElement.className = "category-block-group";

        let categoryTitleElement = document.createElement("h3");
        categoryTitleElement.className = "category-block-title";
        categoryTitleElement.innerHTML = categoryName.toUpperCase().replace("-", " ");
        categoryGroupElement.appendChild(categoryTitleElement);

        let categoryContentElement = document.createElement("div");
        categoryContentElement.className = "category-block-content category-" + categoryName + "-block-content";
        getProjectElementList(jsonObject[categoryName], categoryIndex).forEach((projectElement) => {
            categoryContentElement.appendChild(projectElement);
        });
        categoryGroupElement.appendChild(categoryContentElement);

        allProjectsBlock.appendChild(categoryGroupElement);
    });
}

await getFileData().then(() => {
    displayAllProjects();
});
