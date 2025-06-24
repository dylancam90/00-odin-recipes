import { recipeCache, getRecipes, ROOT_PATH } from "../lib/queryRecipes.js";

const navTemplate = document.createElement("template");
navTemplate.innerHTML = `
  <nav>
    <h1>Odin Recipes</h1>
    <ul>
      <li><a id="home" href="/index.html">Home</a></li>
      <li><a id="about" href="/about.html">About</a></li>
    </ul>
    <button id="refresh-recipes">Refresh recipes</button>
  </nav>
`;

class RecipeNavbar extends HTMLElement {
  constructor() {
    super();
  }

  async connectedCallback() {
    const content = navTemplate.content.cloneNode(true);
    this.append(content);

    this.querySelector("#home").href = ROOT_PATH + "index.html";
    this.querySelector("#about").href = ROOT_PATH + "about.html";

    const button = document.querySelector("#refresh-recipes");
    button.addEventListener("click", async () => {
      // Defined in queryRecipes.js
      recipeCache.clearCache();

      const newRecipes = await getRecipes(3);
      recipeCache.setData(newRecipes);

      // Manually reload window
      location.reload();
    });
  }
}

customElements.define("recipe-navbar", RecipeNavbar);
