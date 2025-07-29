import { waitForRecipes, foundDuplicates } from "./lib/helpers.js";

const cardContainer = document.querySelector("#recipes");

async function createLinks() {
  try {
    const recipes = await waitForRecipes();

    const hasDuplicates = foundDuplicates(recipes);

    if (hasDuplicates) {
      console.warn("DUPLICATES FOUND IN INDEX.js");
      // window.location.reload();
      // return;
    }

    recipes.forEach((recipe, index) => {
      const recipeCard = document.createElement("recipe-card");
      recipeCard.recipe = recipe;

      recipeCard.setAttribute("data-recipe-id", index);
      cardContainer.appendChild(recipeCard);
    });
  } catch (error) {
    console.error(error);
  }
}

window.onload = createLinks();
