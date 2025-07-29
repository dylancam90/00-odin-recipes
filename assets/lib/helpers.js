export async function waitForRecipes(timeout = 5000) {
  const interval = 100;
  let elapsed = 0;

  return new Promise((resolve, reject) => {
    const check = () => {
      const data = JSON.parse(localStorage.getItem("recipes"));
      if (!isEmpty(data)) {
        resolve(data);
      } else if (elapsed >= timeout) {
        reject(new Error("Timeout: recipes not found in localStorage"));
      } else {
        elapsed += interval;
        setTimeout(check, interval);
      }
    };
    check();
  });
}

export function foundDuplicates(recipes) {
  if (!recipes) return false;

  const ids = new Set();

  for (const recipe of recipes) {
    if (!recipe?.idMeal) continue;
    if (ids.has(recipe?.idMeal)) return true;
    ids.add(recipe.idMeal);
  }

  return false;
}

function isEmpty(obj) {
  return !obj || Object.keys(obj).length === 0;
}
