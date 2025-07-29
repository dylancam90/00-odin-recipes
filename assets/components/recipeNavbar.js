import {
  recipeCache,
  getRecipes,
  ROOT_PATH,
  config,
} from "../lib/queryRecipes.js";

class RecipeNavbar extends HTMLElement {
  constructor() {
    super();
  }

  async connectedCallback() {
    this.render();

    const button = document.querySelector("#refresh-recipes");
    const hamburger = document.querySelector(".hamburger");
    const dropdown = document.querySelector(".dropdown");
    const nav = document.querySelector("nav");

    // DELETE AFTER STYLING
    // dropdown.classList.add("open");

    button.addEventListener("click", async () => {
      if (!config) {
        throw new Error("Config file does not exist");
      }

      // Clear cache
      recipeCache.clearCache();
      // Query new random recipes
      const newRecipes = await getRecipes(config?.recipeNum || 3);
      // Load new cache
      recipeCache.setData(newRecipes);
      // Refresh page
      location.reload();
    });

    hamburger.addEventListener("click", (e) => {
      dropdown.classList.toggle("open");
    });

    const adjustNavSpacing = () => {
      if (dropdown.classList.contains("open")) {
        const dropdownHeight = dropdown.offsetHeight;
        nav.style.marginBottom = `${dropdownHeight}px`;
      } else {
        nav.style.marginBottom = "0";
      }
    };

    // Calculate margin bottom of dropdown everytime the window width is changed
    // window.addEventListener("resize", () => adjustNavSpacing());
    const observer = new ResizeObserver(adjustNavSpacing);
    observer.observe(dropdown);
  }

  #renderLinks() {
    return `
      <li>
        <a 
          class="link" 
          id="home" 
          href=${ROOT_PATH + "index.html"}
        >
          Home
        </a>
      </li>
      <li>
        <a 
          class="link" 
          id="about" 
          href=${ROOT_PATH + "about.html"}
        >
          About
        </a>
      </li>
      <li>
        <a 
          class="link" 
          id="about" 
          href=${ROOT_PATH + "config.html"}
        >
          Configure
        </a>
      </li>
    `;
  }

  #renderButton() {
    return `
      <button id="refresh-recipes">Refresh recipes</button>
    `;
  }

  render() {
    this.innerHTML = `
      <nav>
        <h1 class="nav-header">Odin Recipes</h1>
        <ul class="nav-links">
          ${this.#renderLinks()}
        </ul>

        <div class="nav-container">
          <button id="hamburger" class="hamburger">
            ☰
          </button>
        </div>

        <div class="refresh-btn">
          ${this.#renderButton()}
        </div>

        <div class="dropdown">
          <div class="nav-links-mobile">
            ${this.#renderLinks()}
          </div>
          <hr>
          <div class="nav-btn-mobile">
            ${this.#renderButton()}
          </div>
        </div>
      </nav>
    `;
  }
}

customElements.define("recipe-navbar", RecipeNavbar);

/* 
          <li><a id="home" href=${ROOT_PATH + "index.html"}>Home</a></li>
          <li><a id="about" href=${ROOT_PATH + "about.html"}>About</a></li>
          <li><a id="about" href=${ROOT_PATH + "config.html"}>Configure</a></li>
*/

/* 
          <button id="refresh-recipes">Refresh recipes</button>
*/
