import { waitForRecipes } from "./lib/helpers.js";

const cardContainer = document.querySelector("#recipes");

async function createLinks() {
  try {
    const recipes = await waitForRecipes();
    recipes.forEach((recipe, index) => {
      const recipeCard = document.createElement("recipe-card");
      // DEBUG
      recipeCard.recipe = recipe;
      // DEBUG
      recipeCard.setAttribute("data-recipe-id", index);
      cardContainer.appendChild(recipeCard);
    });
  } catch (error) {
    console.error(error);
  }
}

window.onload = createLinks();
