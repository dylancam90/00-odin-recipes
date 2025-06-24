export async function getConfig(path) {
  console.log(window.location.href);
  try {
    console.log("RUNNING");
    const response = await fetch(path);
    console.log(response);
    const json = await response.json();
    return json;
  } catch (error) {
    console.error("The config.json file has failed to load");
    return null;
  }
}
