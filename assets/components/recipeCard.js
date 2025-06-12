const cardTemplate = document.createElement("template");
cardTemplate.innerHTML = `
  <div id="recipes-container">
    <h3 id="recipe-name"></h3>
    <img id="recipe-image"></img>
    <h4>
      Ingredients:
      <span id="ingredient-count"></span>
    </h4>
  </div>
`;

class RecipeCard extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    const id = this.getAttribute("data-index");
    const recipe = recipes[id];

    if (!recipe) {
      this.innerHTML = "<p>No recipe found</p>";
      return;
    }

    // Append to DOM
    const content = cardTemplate.content.cloneNode(true);
    this.appendChild(content);

    // Incredient count
    const ingredientCount = this.getIngredientCount(recipe);

    // Set recipe text
    this.querySelector("#recipe-name").textContent = recipe?.strMeal;
    this.querySelector("#recipe-image").src = recipe?.strMealThumb;
    this.querySelector("#ingredient-count").textContent = ingredientCount;

    // Create link to recipe page
    this.createPageLink(id);
  }

  createPageLink(id) {
    const recipeHref = "recipes/recipe.html?id=" + id;

    const container = this.querySelector("#recipes-container");
    const linkElement = document.createElement("a");
    linkElement.textContent = "View page";
    linkElement.href = recipeHref;
    container.appendChild(linkElement);
  }

  getIngredientCount(recipe) {
    const ingrediemntRegex = new RegExp(/^strIngredient\d+$/);
    const ingredients = [];

    for (const [key, value] of Object.entries(recipe)) {
      if (ingrediemntRegex.test(key)) {
        ingredients.push(value);
      }
    }

    return ingredients.length;
  }
}

customElements.define("recipe-card", RecipeCard);
