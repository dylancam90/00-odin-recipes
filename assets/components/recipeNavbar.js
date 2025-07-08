import { recipeCache, getRecipes, ROOT_PATH } from "../lib/queryRecipes.js";
import { loadConfig } from "../lib/loadConfig.js";

const navTemplate = document.createElement("template");
navTemplate.innerHTML = `
  <nav>
    <h1>Odin Recipes</h1>
    <ul>
      <li><a id="home" href=${ROOT_PATH + "index.html"}>Home</a></li>
      <li><a id="about" href=${ROOT_PATH + "index.html"}>About</a></li>
    </ul>
    <button id="refresh-recipes">Refresh recipes</button>
  </nav>
`;

class RecipeNavbar extends HTMLElement {
  constructor() {
    super();
  }

  async connectedCallback() {
    this.render();

    const button = document.querySelector("#refresh-recipes");
    button.addEventListener("click", async () => {
      // Load config
      const config = await loadConfig(ROOT_PATH + "assets/config.json");

      // Clear cache
      recipeCache.clearCache();
      // Query new random recipes
      const newRecipes = await getRecipes(config?.recipeNum || 3);
      // Load new cache
      recipeCache.setData(newRecipes);
      // Refresh page
      location.reload();
    });
  }

  render() {
    this.innerHTML = `
      <nav>
        <h1>Odin Recipes</h1>
        <ul>
          <li><a id="home" href=${ROOT_PATH + "index.html"}>Home</a></li>
          <li><a id="about" href=${ROOT_PATH + "index.html"}>About</a></li>
        </ul>
        <button id="refresh-recipes">Refresh recipes</button>
      </nav>
    `;
  }
}

customElements.define("recipe-navbar", RecipeNavbar);
