const URL = "https://www.themealdb.com/api/json/v1/1/random.php";

async function requestRecipe() {
  try {
    const response = await fetch(URL);

    if (!response.ok) {
      throw new Error(
        `API returned status ${response.status}, debug trace: requestRecipe()`
      );
    }

    const json = response.json();
    return json;
  } catch (error) {
    console.error(
      `Error fetching recipe: ${error.message}, debug trace requestRecipe`
    );
    return null;
  }
}

// Remove empty feilds from object
async function sanatizeMeal(meal) {
  for (let [key, value] of Object.entries(meal)) {
    if (value === "" || value === null) {
      delete meal[key];
    }
  }
  return meal;
}

// Make n number of requests to the API and append the response to recipes
async function getRecipes(recipeNum = 3) {
  const recipes = [];

  for (let recipe = 0; recipe < recipeNum; recipe++) {
    const recipe = await requestRecipe();
    const meal = recipe?.meals?.[0];

    let sanatizedRecipe;

    // Maybe here you can break or restart the request if it fails with some base condition so it doesnt run forever
    if (!meal) {
      console.warn(`No meal found for ${i + 1}`);
      recipes.push([]);
    } else {
      sanatizedRecipe = await sanatizeMeal(meal);
      recipes.push(sanatizedRecipe);
    }
  }

  return recipes;
}

async function main() {
  try {
    const recipes = await getRecipes(1);
    console.log(recipes[0]);
  } catch (error) {
    console.error("Unexpected error in main:", error.message);
  }
}

main();
