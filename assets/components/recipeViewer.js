const template = document.createElement("template");
template.innerHTML = `
  <header>
    <h2>Name: <span data-field="strMeal"></span></h2>
    <h3>Origin:
        <span data-field="strArea"></span>
    </h3>
    <img data-src="strMealThumb">
  </header>

  <article>

      <section class="ingredient-container">
        <h3> Instructions: </h3>
        <p data-field="strInstructions"></p>  
      </section>

      <section class="ingredient-container">
        <h3> Ingredients: </h3>
        <ul data-list="ingredients"></ul>
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
    const recipeId = this.getAttribute("data-recipe-id");
    const recipe = JSON.parse(localStorage.getItem("recipes"))?.[recipeId];

    if (!recipe) {
      this.innerHTML = "<p>Recipe not found</p>";
      return;
    }

    // Clone and append the template
    const content = template.content.cloneNode(true);
    this.appendChild(content);

    // Set the title of the page
    // document.title = recipe?.strMeal || `Recipe ${id}`;
    document.title = recipe?.strMeal || `Recipe ${recipeId}`;

    // Set all Elements to their values
    this.querySelectorAll("[data-field]").forEach((el) => {
      const field = el.dataset.field;
      el.textContent = recipe?.[field] || "Not available";
    });

    // Set value for image
    this.querySelectorAll("[data-src]").forEach((el) => {
      const field = el.dataset.src;
      if (el.tagName === "IMG") el.src = recipe?.[field] || "";
    });

    // Get ingredients list
    const ingredients = this.getIngredients(recipe);
    const ul = this.querySelector("[data-list='ingredients'");
    // Create the ingredients element
    this.createIngredientsElement(ingredients, ul);

    // Create video element
    this.createVideoElement(recipe);

    /* DEBUG */
    // console.log(recipe);
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
      li.textContent = `${key} - ${value || "QTY not specified"}`;
      ingredientElement.appendChild(li);
    }
  }

  async createVideoElement(recipe) {
    const VIDEO_WIDTH = 580;
    const VIDEO_HEIGHT = 315;

    const ytVideo = recipe?.strYoutube;
    const videoContainer = this.querySelector(".video-container");

    if (!ytVideo) {
      this.#createVideoErrorMessage(videoContainer, recipe?.strMeal);
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

    const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;

    // Check if thumbnail loads (will fail if video is deleted)
    const thumbOk = await this.#checkThumbnail(thumbnailUrl);

    if (!thumbOk) {
      this.#createVideoErrorMessage(videoContainer, recipe?.strMeal);
      return;
    }

    const iframe = document.createElement("iframe");
    iframe.width = VIDEO_WIDTH.toLocaleString();
    iframe.height = VIDEO_HEIGHT.toLocaleString();
    iframe.src = embedUrl;
    iframe.title = `${recipe?.strMeal} video tutorial`;
    iframe.border = "0";
    iframe.allow =
      "accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
    iframe.allowFullscreen = true;

    videoContainer.appendChild(iframe);
  }

  #checkThumbnail(thumbnailUrl) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        // YouTube returns a generic image (120x90 px) when the video doesn't exist
        const isPlaceholder = img.width === 120 && img.height === 90;
        resolve(!isPlaceholder);
      };
      img.onerror = () => resolve(false); // Network error / bad image
      img.src = thumbnailUrl;
    });
  }

  #createVideoErrorMessage(videoContainer, meal) {
    if (videoContainer) {
      const videoErrMessage = document.createElement("p");
      videoErrMessage.textContent = `Video appears to be unavailable or deleted for ${meal}`;
      videoContainer?.appendChild(videoErrMessage);
      return;
    }
  }
}

customElements.define("recipe-viewer", RecipeViewer);
