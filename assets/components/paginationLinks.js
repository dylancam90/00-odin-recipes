import { ROOT_PATH } from "../lib/queryRecipes.js";

// const paginationTemplate = document.createElement("template");
// paginationTemplate.innerHTML = `
//   <style>${PaginationLinks.css}</style>
//   <ul id="pagination">

//   </ul>
// `;

class PaginationLinks extends HTMLElement {
  static css = `
    :root {
      --chevron-w: 2px;
      --chevron-h: 2px;
    }
    ul {
      display: flex;
      justify-content: center;
      gap: 1em;

      list-style-type: none;
    }
    a.current {
      font-weight: bold;
      color: #007bff;
    }
  `;
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.recipeId = this.getAttribute("data-recipe-id");
    this.recipes = JSON.parse(localStorage.getItem("recipes"));
    this.currentIndex = Number(this.recipeId) || 0;
  }

  connectedCallback() {
    this.render();
    this.shadowRoot
      .querySelector("#prev-btn")
      ?.addEventListener("click", () => this.goToPrevious());
    this.shadowRoot
      .querySelector("#next-btn")
      ?.addEventListener("click", () => this.goToNext());
    // this.shadowRoot.innerHTML = `
    //   <style>${PaginationLinks.css}</style>
    //   <ul id="pagination">
    //     <button type="button"><</button>
    //      ${Object.entries(this.recipes)
    //        .map(
    //          ([index, recipe]) => `
    //           <li>
    //             <a
    //               href="${ROOT_PATH}recipes/recipe.html?id=${index}"
    //               ${index === this.recipeId ? "class='current'" : ""}
    //             >
    //               ${Number(index) + 1}
    //             </a>
    //           </li>
    //         `
    //        )
    //        .join("")}
    //     <button type="button">></button>
    //   </ul>
    // `;
  }

  goToPrevious() {
    if (this.currentIndex > 0) {
      console.log("HELLO");
      const newIndex = this.currentIndex - 1;
      window.location.href = `${ROOT_PATH}recipes/recipe.html?id=${newIndex}`;
    }
  }

  goToNext() {
    const recipesLen = Object.keys(this.recipes).length;

    if (this.currentIndex < recipesLen - 1) {
      const newIndex = this.currentIndex + 1;
      window.location.href = `${ROOT_PATH}recipes/recipe.html?id=${newIndex}`;
    }
  }

  render() {
    this.shadowRoot.innerHTML = `
    <style>${PaginationLinks.css}</style>
    <ul id="pagination">
      <button id="prev-btn" type="button">&lt;</button>
       ${Object.entries(this.recipes)
         .map(
           ([index, recipe]) => `
            <li>
              <a 
                href="${ROOT_PATH}recipes/recipe.html?id=${index}"
                ${Number(index) === this.currentIndex ? "class='current'" : ""}
              >
                ${Number(index) + 1}
              </a>
            </li>
          `
         )
         .join("")}
      <button id="next-btn" type="button">&gt;</button>
    </ul>
  `;
  }
}

customElements.define("pagination-links", PaginationLinks);
