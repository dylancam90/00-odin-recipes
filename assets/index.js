const recipes = JSON.parse(localStorage.getItem("recipes"));
const cardContainer = document.querySelector("#recipes");

function createLinks() {
  console.log(recipes);
  if (!isEmpty(recipes)) {
    recipes.forEach((recipe, index) => {
      const recipeCard = document.createElement("recipe-card");
      recipeCard.setAttribute("data-index", index);
      cardContainer.appendChild(recipeCard);
    });
  } else {
    // Handle case where recipes are empty
  }
}

function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}

// const button = document.querySelector("#refresh-recipes");

// button.addEventListener("click", async () => {
//   // Defined in queryRecipes.js
//   recipeCache.clearCache();

//   const newRecipes = await getRecipes(3);
//   recipeCache.setData(newRecipes);

//   // Manually reload window
//   location.reload();
// });

createLinks();
