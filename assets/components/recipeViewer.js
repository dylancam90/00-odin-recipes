const template = document.createElement("template");
template.innerHTML = `
  <header>
    <h1 id="recipe-name"></h1>
    <div class="links">
      <a href="../index.html">Go Home</a>
      <button type="button" id="reset-recipes">Reset Recipes</button>
    </div>
  </header>
  <article>
      <h3>Origin: 
        <span id="recipe-area"></span>
      </h3>
      <img id="recipe-image">
      <p id="recipe-instructions"></p>
  </article>

  <br/>
  <h2>TODO:</h2>
  <p> ADD VIDEO HERE: </p>
  <p> ADD INSTRUCTIONS HERE </p>
`;

class RecipeViewer extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    // Grab id param out of URL and set data-index
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    const recipe = JSON.parse(localStorage.getItem("recipes"))?.[id];

    if (!recipe) {
      this.innerHTML = "<p>Recipe not found</p>";
      return;
    }

    // Clone and append the template
    const content = template.content.cloneNode(true);
    this.appendChild(content);

    // Grab all necessary tags
    const recipeName = this.querySelector("#recipe-name");
    const recipeArea = this.querySelector("#recipe-area");
    const recipeImage = this.querySelector("#recipe-image");
    const recipeInstructions = this.querySelector("#recipe-instructions");

    // Set tags to recipe info
    recipeName.textContent = recipe?.strMeal;
    recipeArea.textContent = recipe?.strArea || "Unknown";
    recipeImage.src = recipe?.strMealThumb;
    recipeInstructions.textContent =
      recipe?.strInstructions || "Instructions not available";

    document.title = recipe?.strMeal || `Recipe ${id}`;

    const resetRecipes = this.querySelector("#reset-recipes");
    resetRecipes.addEventListener("click", (e) => {
      // TODO
      console.log(
        "TODO: queryRecipes.js file is already linked. You just need to call the resetRecipes() function here to purge recipes and timestamps from localhost and query a new batch"
      );
    });

    /* DEBUG */
    console.log(recipe);
  }
}

customElements.define("recipe-viewer", RecipeViewer);
