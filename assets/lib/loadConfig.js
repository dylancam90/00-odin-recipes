// Used to load config.json into queryRecipes.js making it easier to change main functionality without digging through code
export async function loadConfig(path) {
  const localConfig = JSON.parse(localStorage.getItem("config"));

  if (localConfig) {
    return localConfig;
  }

  try {
    const response = await fetch(path);

    if (!response.ok) {
      console.warn("No config file, trace loadConfig.js");
    }

    const json = await response.json();
    localStorage.setItem("config", JSON.stringify(json));

    return JSON.parse(localStorage.getItem("config"));

    // return json;
  } catch (error) {
    console.error("The config.json file has failed to load");
    return null;
  }
}
