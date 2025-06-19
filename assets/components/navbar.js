import { recipeCache, getRecipes } from "../queryRecipes.js";

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

  connectedCallback() {
    console.log("connected");
    const content = navTemplate.content.cloneNode(true);
    this.append(content);

    const path = "/projects/00-odin-recipes/";
    const home = document.getElementById("home");
    const about = document.getElementById("about");

    home.href = path + "index.html";
    about.href = path + "about.html";

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
