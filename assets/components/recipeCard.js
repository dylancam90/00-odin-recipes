class RecipeCard extends HTMLElement {
  constructor() {
    super();
    this.recipeId = this.getAttribute("data-recipe-id");
    this.recipeHref = "recipes/recipe.html?id=" + this.recipeId;
  }

  async connectedCallback() {
    if (this.recipe) {
      this.render();
    } else {
      this.innerHTML = "<p>Loading recipe...</p>";
    }
  }

  #getIngredientCount(recipe) {
    const ingrediemntRegex = new RegExp(/^strIngredient\d+$/);
    const ingredients = [];

    for (const [key, value] of Object.entries(recipe)) {
      if (ingrediemntRegex.test(key)) {
        ingredients.push(value);
      }
    }

    return ingredients.length;
  }

  render() {
    this.innerHTML = `
      ${
        !this.recipe
          ? `<p>No recipe found</p>`
          : `
          <div id="recipes-container">
            <h3 data-field="strMeal">${this.recipe?.strMeal}</h3>
            <img src=${this.recipe?.strMealThumb}></img>
            <h4>
              Ingredients:
              <span id="ingredient-count">
                ${this.#getIngredientCount(this.recipe)}
              </span>
            </h4>
            <a href=${this.recipeHref}>View Page</a>
          </div>
      `
      }
    `;
  }
}

customElements.define("recipe-card", RecipeCard);
