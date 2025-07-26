import { Cache } from "./cache.js";
import { loadConfig } from "./loadConfig.js";

const ROOT_PATH = "http://localhost:5500/projects/00-odin-recipes/";
const API_URL = "https://www.themealdb.com/api/json/v1/1/random.php";

const config = await loadConfig(ROOT_PATH + "assets/config.json");
console.log("Config options: ", config, "Date", new Date());

const recipeCache = new Cache(config?.recipeRefreshIntervalMs);
// console.log("initialized cache: ", recipeCache);

async function requestRecipe() {
  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      console.log("BAD REQUEST");
      throw new Error(
        `API returned status ${response.status}, debug trace: requestRecipe()`
      );
    }

    const json = await response.json();
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
    if (value === "" || value === " " || value === null) {
      delete meal[key];
    }
  }
  return meal;
}

// Make n number of requests to the API and append the response to recipes
async function getRecipes(recipeNum = 3) {
  const recipes = [];

  for (let i = 0; i < recipeNum; i++) {
    const fetched = await requestRecipe();
    const meal = fetched?.meals?.[0];

    // Maybe here you can break or restart the request if it fails with some base condition so it doesnt run forever
    if (!meal) {
      console.warn(`No meal found for ${i + 1}`);
      recipes.push([]);
    } else {
      const sanatizedRecipe = await sanatizeMeal(meal);
      recipes.push(sanatizedRecipe);
    }
  }

  return recipes;
}

// Temp function until I can figure out whats going on
function foundDuplicates(recipes) {
  if (!recipes) return false;

  const ids = new Set();

  for (const recipe of recipes) {
    if (!recipe?.idMeal) continue;
    if (ids.has(recipe?.idMeal)) return true;
    ids.add(recipe.idMeal);
  }

  return false;
}

async function main() {
  try {
    let cachedRecipes = recipeCache.getData();
    const isEmpty =
      !cachedRecipes || Object.entries(cachedRecipes).length === 0;

    // TEMPORARY to test dupes in localstorage
    const hasDuplicates = !isEmpty && foundDuplicates(cachedRecipes);
    console.log("hasDuplicates: ", hasDuplicates);

    // If no cached recipes make a request for them and cache them
    // ADDED HASDUPLICATES
    if (isEmpty || hasDuplicates) {
      /// TEST
      if (hasDuplicates) console.warn("Duplicates found, refreshing data");

      console.log("No cached results, retrieving more...");
      const recipes = await getRecipes(config?.recipeNum || 3);
      recipeCache.setData(recipes);
      cachedRecipes = recipes;
    } else {
      console.log("There are recipes cached already");
    }
  } catch (error) {
    console.error("Unexpected error in main:", error.message);
  }
}

main();

export { recipeCache, getRecipes, ROOT_PATH, config, main };
