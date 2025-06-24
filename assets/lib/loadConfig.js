// Used to load config.json into queryRecipes.js making it easier to change main functionality without digging through code
export async function loadConfig(path) {
  try {
    const response = await fetch(path);
    const json = await response.json();
    return json;
  } catch (error) {
    console.error("The config.json file has failed to load");
    return null;
  }
}
