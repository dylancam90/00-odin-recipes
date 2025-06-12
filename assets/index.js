// // Query recipes from localStorage
// const recipes = JSON.parse(localStorage.getItem("recipes"));
// // Select the links container
// const linksContainer = document.querySelector("#recipes");

// // Create the links and append them to the document
// function createLinks() {
//   // DEBUG
//   console.log(recipes);

//   if (!isEmpty(recipes)) {
//     recipes.forEach((recipe, index) => {
//       const recipeLink = document.createElement("a");
//       recipeLink.href = `recipes/recipe.html?id=${index}`;
//       recipeLink.textContent = recipe?.strMeal;
//       linksContainer.appendChild(recipeLink);
//     });
//   } else {
//     // Handle event where localStorage is empty
//   }
// }

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

createLinks();
