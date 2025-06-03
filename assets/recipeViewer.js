class RecipeViewer extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = "<h2>TEST</h2>";
  }

  connectedCallback() {
    const index = this.getAttribute("data-index");
    const recipes = JSON.parse(localStorage.getItem("recipes"));
    console.log(recipes);
    const recipe = recipes?.[index];

    if (!recipe) {
      this.innerHTML = "<p>Recipe not found</p>";
      return;
    }
  }
}

customElements.define("recipe-viewer", RecipeViewer);
