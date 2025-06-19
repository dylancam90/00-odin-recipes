const template = document.createElement("template");
/* 
      <nav>
      <h1>Odin Recipes</h1>
      <ul>
        <li><a href="./index.html">Home</a></li>
        <li><a href="./about.html">About</a></li>
      </ul>
      <button id="refresh-recipes">Refresh recipes</button>
    </nav>

*/
template.innerHTML = `
  <header>
    <h2>Name: <span id="recipe-name"></span></h2>
    <h3>Origin:
        <span id="recipe-area"></span>
    </h3>
    <img id="recipe-image">
  </header>

  <article>

      <section class="ingredient-container">
        <h3> Instructions: </h3>
        <p id="recipe-instructions"></p>  
      </section>

      <section class="ingredient-container">
        <h3> Ingredients: </h3>
        <ul id="recipe-ingredients"></ul>
      </section>

      <section class="video-container">
        <h3>Video Tutorial</h3>
      </section>

  </article>
`;

class RecipeViewer extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    // Grab id param out of URL and set data-index
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    const recipe = JSON.parse(localStorage.getItem("recipes"))?.[id];

    if (!recipe) {
      this.innerHTML = "<p>Recipe not found</p>";
      return;
    }

    // Clone and append the template
    const content = template.content.cloneNode(true);
    this.appendChild(content);

    // Set the title of the page
    document.title = recipe?.strMeal || `Recipe ${id}`;

    // Set all Elements to their values
    this.querySelector("#recipe-name").textContent =
      recipe?.strMeal || "name not found";
    this.querySelector("#recipe-area").textContent =
      recipe?.strArea || "Unkown";
    this.querySelector("#recipe-image").src = recipe?.strMealThumb;
    this.querySelector("#recipe-instructions").textContent =
      recipe?.strInstructions || "Instructions not available";

    // Get ingredients list
    const ingredients = this.getIngredients(recipe);
    // Create the ingredients element
    this.createIngredientsElement(
      ingredients,
      this.querySelector("#recipe-ingredients")
    );

    // Create video element
    this.createVideoElement(recipe);

    /* DEBUG */
    console.log(recipe);
  }

  // Grabs the ingredients and measurments and combines them into a object
  getIngredients(recipe) {
    const ingrediemntRegex = new RegExp(/^strIngredient\d+$/);
    const measuringsRegex = new RegExp(/^strMeasure\d+$/);

    const ingredients = [];
    const measurements = [];

    for (const [key, value] of Object.entries(recipe)) {
      if (ingrediemntRegex.test(key)) {
        ingredients.push(value);
      }

      if (measuringsRegex.test(key)) {
        measurements.push(value);
      }
    }

    /*
     *  TODO -----------------------
     *
     *  Although I havent seen a mismatch between the amount of ingredients and the amount of measurements
     *  there still may be a discrepancy and might need to be handled
     */
    const combined = {};

    ingredients.forEach((value, index) => {
      combined[value] = measurements[index];
    });

    return combined;
  }

  // Create the li elements and add them to the DOM
  createIngredientsElement(ingredientList, ingredientElement) {
    for (const [key, value] of Object.entries(ingredientList)) {
      const li = document.createElement("li");
      li.textContent = `${key} - ${value}`;
      ingredientElement.appendChild(li);
    }
  }

  createVideoElement(recipe) {
    const VIDEO_WIDTH = 580;
    const VIDEO_HEIGHT = 315;

    const ytVideo = recipe?.strYoutube;
    const vidoeContainer = this.querySelector(".video-container");

    if (!ytVideo) {
      const videoErrMessage = document.createElement("p");
      videoErrMessage.textContent = `No video found for ${recipe?.strMeal}`;
      vidoeContainer?.appendChild(videoErrMessage);
      return;
    }

    /*
     *  Needed to change the url from a watch to an embeded
     *                  Example:
     *  Convert: https://www.youtube.com/watch?v=UVAMAoA2_WU
     *  To: https://www.youtube.com/embed/UVAMAoA2_WU
     */

    const videoId = new URL(ytVideo).searchParams.get("v");
    const embedUrl = `https://www.youtube.com/embed/${videoId}`;

    const iframe = document.createElement("iframe");
    iframe.width = VIDEO_WIDTH.toLocaleString();
    iframe.height = VIDEO_HEIGHT.toLocaleString();
    iframe.src = embedUrl;
    iframe.title = `${recipe?.strMeal} video tutorial`;
    iframe.border = "0";
    iframe.allow =
      "accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
    iframe.allowFullscreen = true;

    vidoeContainer.appendChild(iframe);
  }
}

customElements.define("recipe-viewer", RecipeViewer);
