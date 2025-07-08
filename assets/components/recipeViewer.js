class RecipeViewer extends HTMLElement {
  constructor() {
    super();
    this.recipeId = this.getAttribute("data-recipe-id");
    this.recipe = JSON.parse(localStorage.getItem("recipes"))?.[this.recipeId];
    this.ingredients = this.#extractIngredients(this.recipe);

    this.VIDEO_WIDTH = 580;
    this.VIDEO_HEIGHT = 315;
  }

  async connectedCallback() {
    document.title = this.recipe?.strMeal || `Recipe ${this.recipeId}`;
    await this.render();
  }

  // Grabs the ingredients and measurments and combines them into a object
  #extractIngredients(recipe) {
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

  async #createVideoElement(recipe) {
    /*
     *  Needed to change the url from a watch to an embeded
     *                  Example:
     *  Convert: https://www.youtube.com/watch?v=UVAMAoA2_WU
     *  To: https://www.youtube.com/embed/UVAMAoA2_WU
     */
    const ytVideo = recipe?.strYoutube;

    const videoId = new URL(ytVideo).searchParams.get("v");
    const embedUrl = `https://www.youtube.com/embed/${videoId}`;

    const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;

    // Check if thumbnail loads (will fail if video is deleted)
    const thumbOk = await this.#checkThumbnail(thumbnailUrl);

    if (!thumbOk) {
      return this.#createVideoErrorMessage(recipe?.strMeal);
    }

    return `
      <iframe 
        width=${this.VIDEO_WIDTH.toLocaleString()} 
        height=${this.VIDEO_HEIGHT.toLocaleString()}
        src=${embedUrl}
        title="${recipe?.strMeal} video tutorial"
        border="0"
        allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      >

      </iframe>
    `;
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

  #createVideoErrorMessage(meal) {
    return `<p>Video appears to be unavailable or deleted for ${meal}</p>`;
  }

  async render() {
    this.innerHTML = `
      ${
        !this.recipe
          ? `<p>Recipe not found</p>`
          : `
          <header>

            <h2>Name: ${this.recipe?.strMeal}</h2>
            <h3>Origin: ${this.recipe?.strArea}</h3>
            <img src=${this.recipe?.strMealThumb} alt=${this.recipe?.strMeal}>
          </header>

          <article>

              <section class="ingredient-container">
                <h3> Instructions: </h3>
                <p data-field="strInstructions">
                  ${this.recipe?.strInstructions}
                </p>  
              </section>

              <section class="ingredient-container">
                <h3> Ingredients: </h3>
                <ul class="ingredients">
                  ${Object.entries(this.ingredients)
                    .map(
                      ([key, value]) => `
                        <li>
                          ${key} - ${value || "QTY not specified"}
                        </li>
                      `
                    )
                    .join("")}
                </ul>
              </section>

              <section class="video-container">
                <h3>Video Tutorial</h3>
                ${
                  !this.recipe?.strYoutube
                    ? this.#createVideoErrorMessage(this.recipe?.strMeal)
                    : await this.#createVideoElement(this.recipe)
                }
              </section>

          </article>
        `
      }
    `;
  }
}

customElements.define("recipe-viewer", RecipeViewer);
