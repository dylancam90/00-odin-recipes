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
  }

  render() {
    this.innerHTML = `
      <nav>
        <h1>Odin Recipes</h1>
        <ul>
          <li><a id="home" href=${ROOT_PATH + "index.html"}>Home</a></li>
          <li><a id="about" href=${ROOT_PATH + "about.html"}>About</a></li>
          <li><a id="about" href=${ROOT_PATH + "config.html"}>Configure</a></li>
        </ul>
        <button id="refresh-recipes">Refresh recipes</button>
      </nav>
    `;
  }
}

customElements.define("recipe-navbar", RecipeNavbar);
