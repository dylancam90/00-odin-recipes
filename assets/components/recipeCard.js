const cardTemplate = document.createElement("template");
cardTemplate.innerHTML = `
  <div id="recipes-container">
    <h3 data-field="strMeal"></h3>
    <img data-src="strMealThumb"></img>
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
    const recipeId = this.getAttribute("data-recipe-id");
    const recipe = recipes[recipeId];

    console.log("RECIPES", recipe);

    if (!recipe) {
      this.innerHTML = "<p>No recipe found</p>";
      return;
    }

    // Append to DOM
    const content = cardTemplate.content.cloneNode(true);
    this.appendChild(content);

    // Fill in element text and other fields
    this.querySelectorAll("[data-field], [data-src]").forEach((el) => {
      const field = el.dataset.field;
      const src = el.dataset.src;

      if (field) {
        el.textContent = recipe[field] ?? "Not available";
      }

      if (src) {
        el.src = recipe[src] ?? "";
      }
    });

    // Incredient count
    const ingredientCount = this.getIngredientCount(recipe);
    this.querySelector("#ingredient-count").textContent = ingredientCount;

    // Create link to recipe page
    this.createPageLink(recipeId);
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
