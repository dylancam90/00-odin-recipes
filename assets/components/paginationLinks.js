import { ROOT_PATH } from "../lib/queryRecipes.js";

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
  }

  goToPrevious() {
    if (this.currentIndex > 0) {
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

  /*
   *    This handles the logic of how the pagination is rendered based on the current index
   *    and the number of total recipes. It was modeled after:
   *                  https://mui.com/material-ui/react-pagination/
   *
   *    There are still some minor things that could be refined but for now it will work.
   */
  #generatePagination(currentIndex, total) {
    const pages = [];
    const maxSlide = 5;

    if (total <= maxSlide) {
      for (let i = 0; i < total; i++) {
        pages.push(i);
      }
    } else if (currentIndex <= 3) {
      for (let i = 0; i <= 4; i++) {
        pages.push(i);
      }
      pages.push("...", total - 1);
    } else if (currentIndex >= total - 4) {
      pages.push(0, "...");
      for (let i = total - maxSlide; i < total; i++) {
        pages.push(i);
      }
    } else {
      pages.push(0, "...");
      pages.push(currentIndex - 1, currentIndex, currentIndex + 1);
      pages.push("...", total - 1);
    }

    return pages;
  }

  render() {
    const total = Object.keys(this.recipes).length;
    const paginationItems = this.#generatePagination(this.currentIndex, total);
    // Generate template based on paginatonItems
    const listItems = paginationItems
      .map((item) => {
        if (item === "...") {
          return `<li><span>...</span></li>`;
        }

        const pageNum = item + 1;
        const isCurrent = item === this.currentIndex ? "class='current'" : "";
        return `
        <li>
          <a href="${ROOT_PATH}recipes/recipe.html?id=${item}" ${isCurrent}>${pageNum}</a>
        </li>
      `;
      })
      .join("");

    this.shadowRoot.innerHTML = `
      <style>${PaginationLinks.css}</style>
      <ul id="pagination">
        <button id="prev-btn" type="button">&lt;</button>
          ${listItems}
        <button id="next-btn" type="button">&gt;</button>
      </ul>
    `;
  }
}

customElements.define("pagination-links", PaginationLinks);
