export async function getConfig(path) {
  try {
    const response = await fetch(path);
    console.log(response);
    const json = await response.json();
    return json;
  } catch (error) {
    console.error("The config.json file has failed to load");
    return null;
  }
}
