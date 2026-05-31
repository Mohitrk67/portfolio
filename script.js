const projectTriggers = document.querySelectorAll(".project-trigger");
const projectCard = document.querySelector(".sticky-project-card");
const currentProject = document.getElementById("currentProject");

function updateProject(trigger) {
  const number = trigger.dataset.number;
  const category = trigger.dataset.category;
  const title = trigger.dataset.title;
  const descriptionOne = trigger.dataset.descriptionOne;
  const descriptionTwo = trigger.dataset.descriptionTwo;
  const techList = trigger.dataset.tech.split(",");
  const link = trigger.dataset.link;

  projectCard.classList.add("fade");

  setTimeout(() => {
    currentProject.textContent = number;

    projectCard.innerHTML = `
      <div class="project-category">
        ${category}
      </div>

      <h3>${title}</h3>

      <p>${descriptionOne}</p>

      <p>${descriptionTwo}</p>

      <div class="project-tech">
        ${techList.map(tech => `<span>${tech.trim()}</span>`).join("")}
      </div>

      <div class="project-links">
        <a href="${link}" target="_blank" rel="noopener noreferrer" aria-label="View ${title} on GitHub">
          <i class="fa-brands fa-github"></i> GitHub
        </a>
      </div>
    `;

    projectCard.classList.remove("fade");
  }, 180);
}

const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        updateProject(entry.target);
      }
    });
  },
  {
    threshold: 0.55
  }
);

projectTriggers.forEach(trigger => {
  observer.observe(trigger);
});
