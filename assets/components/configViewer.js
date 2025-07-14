import { config, ROOT_PATH } from "../lib/queryRecipes.js";

class ConfigViewer extends HTMLElement {
  constructor() {
    super();
    this.config = config || null;
  }

  async connectedCallback() {
    this.render();
    this.#formHandler();
  }

  #formHandler() {
    const form = this.querySelector("#config-form");
    const status = this.querySelector("#save-status");

    form?.addEventListener("submit", (e) => {
      e.preventDefault();
      const formData = new FormData(form);

      const recipeNum = Number(formData.get("recipeNum"));
      const recipeIntervalMin = Number(formData.get("recipeRefreshIntervalMs"));

      // Turn minute field back into milliseconds
      const recipeIntervalMs = this.#minToMilli(recipeIntervalMin);

      const updatedConfig = {
        recipeNum: recipeNum,
        recipeRefreshIntervalMs: recipeIntervalMs,
      };

      localStorage.removeItem("config");
      localStorage.setItem("config", JSON.stringify(updatedConfig));

      status.innerHTML = `
        Config successfully updated, go 
        <a href="${ROOT_PATH}/index.html">
          Home?
        </a>
      `;
      /* DEBUG */
      // console.log(
      //   "Form data in min: ",
      //   recipeIntervalMin,
      //   "\tConversion back to ms: ",
      //   recipeIntervalMs
      // );
      // console.log("Recipe Num: ", recipeNum);
    });
  }

  #milliToMin(milliseconds) {
    return milliseconds / 60000;
  }

  #minToMilli(minutes) {
    return minutes * 60000;
  }

  render() {
    console.log(this.#milliToMin(this.config?.recipeRefreshIntervalMs));

    this.innerHTML = `
      ${
        !this.config
          ? `<p>Config not loaded</p>`
          : `
            <h1>Configure Website</h1>
            <form id="config-form">
              <label>
                Number of Recipes:
                <input 
                  type="number"
                  name="recipeNum"
                  value="${this.config?.recipeNum}"
                  min="1"
                  max="10"
                />
              </label>

              <label>
                Refresh Interval (min):
                <input
                  type="number"
                  name="recipeRefreshIntervalMs"
                  value="${this.#milliToMin(
                    this.config?.recipeRefreshIntervalMs
                  )}"
                  min="3"
                />
              </label>      
              
              <button type="submit">Save Config</button>
              <p id="save-status" style="color: green;"></p>
            </form>
          `
      }
    `;
  }
}

// value = "${this.config?.recipeRefreshIntervalMs}";

customElements.define("config-viewer", ConfigViewer);
