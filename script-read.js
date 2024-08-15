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
function getProjectElement(projectData) {
    let projectBlock = document.createElement("div");
    projectBlock.className = "project-block";

    let titleElement = document.createElement("div");
    titleElement.className = "project-block-title";
    titleElement.innerHTML = "Title: " + projectData.title;
    projectBlock.appendChild(titleElement);

    let projectAssociationElement = document.createElement("div");
    projectAssociationElement.className = "project-block-project-association";
    projectAssociationElement.innerHTML = "Project: " + projectData.projectAssociation;
    projectBlock.appendChild(projectAssociationElement);

    let dateProposedElement = document.createElement("div");
    dateProposedElement.className = "project-block-date-proposed";
    dateProposedElement.innerHTML = "Date Proposed: " + projectData.dateProposed;
    projectBlock.appendChild(dateProposedElement);

    if (projectData.dateCompleted) {
        let dateCompletedElement = document.createElement("div");
        dateCompletedElement.className = "project-block-date-completed";
        dateCompletedElement.innerHTML = "Date Completed: " + projectData.dateCompleted;
        projectBlock.appendChild(dateCompletedElement);
    }

    if (projectData.dateDropped) {
        let dateDroppedElement = document.createElement("div");
        dateDroppedElement.className = "project-block-date-completed";
        dateDroppedElement.innerHTML = "Date Dropped: " + projectData.dateDropped;
        projectBlock.appendChild(dateDroppedElement);

        let reasonElement = document.createElement("div");
        reasonElement.className = "project-block-date-completed";
        reasonElement.innerHTML = "Reason: " + projectData.reason;
        projectBlock.appendChild(reasonElement);
    }

    let priorityElement = document.createElement("div");
    priorityElement.className = "project-block-priority";
    priorityElement.innerHTML = "Priority: " + projectData.priority;
    projectBlock.appendChild(priorityElement);

    let descriptionElement = document.createElement("div");
    descriptionElement.className = "project-block-description";
    descriptionElement.innerHTML = "Description:\n" + projectData.description;
    projectBlock.appendChild(descriptionElement);

    let criteriaTitleElement = document.createElement("div");
    criteriaTitleElement.className = "project-block-criteria";
    criteriaTitleElement.innerHTML = "Criteria:";
    projectBlock.appendChild(criteriaTitleElement);

    let criteriaListElement = document.createElement("ul");
    criteriaListElement.className = "project-block-criteria-list";

    for (let i = 0; i < projectData.criteria.length; i++) {
        let criteriaListItemElement = document.createElement("li");
        criteriaListItemElement.className = "project-block-criteria-list-item";
        criteriaListItemElement.innerHTML = projectData.criteria[i];
        criteriaListElement.appendChild(criteriaListItemElement);
    }

    projectBlock.appendChild(criteriaListElement);

    return projectBlock;
}

/**
 * Generates the list of projects for an individual category.
 * @param categoryData 
 * @returns projectElementsList
 */
function getProjectElementList(categoryData) {
    let projectElementsList = [];
    for (let i = 0; i < categoryData.length; i++) {
        projectElementsList.push(getProjectElement(categoryData[i]));
    }
    return projectElementsList;
}

/**
 * Takes the jsonObject data and renders it into the DOM.
 */
function displayAllProjects() {
    let allProjectsBlock = document.getElementById("all-projects-block");

    Object.keys(jsonObject).forEach((categoryName) => {
        let categoryGroupElement  = document.createElement("div");
        categoryGroupElement.className = "category-block-group";

        let categoryTitleElement = document.createElement("h3");
        categoryTitleElement.className = "category-block-title";
        categoryTitleElement.innerHTML = categoryName.toUpperCase().replace("-", " ");
        categoryGroupElement.appendChild(categoryTitleElement);

        let categoryContentElement = document.createElement("div");
        categoryContentElement.className = "category-block-content category-" + categoryName + "-block-content";
        getProjectElementList(jsonObject[categoryName]).forEach((projectElement) => {
            categoryContentElement.appendChild(projectElement);
        });
        categoryGroupElement.appendChild(categoryContentElement);

        allProjectsBlock.appendChild(categoryGroupElement);
    });
}

await getFileData().then(() => {
    displayAllProjects();
});