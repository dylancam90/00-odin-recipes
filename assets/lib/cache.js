// remove the "export class Cache" and uncomment the window.Cache when your done
// 300000
export class Cache {
  constructor(duration = 300000) {
    this.duration = duration;
  }

  /* 
  | If you instad want the recipes to be removed when the browser is closed or the tab is closed
  | swap out localstorage for session storage
  |
   */

  // Check to see if the allotted time has expired
  isValid() {
    const timestamp = localStorage.getItem("recipes_timestamp");
    const isValid = timestamp && Date.now() - Number(timestamp) < this.duration;
    console.log("Is data valid?", isValid);
    return isValid;
  }

  // If timestamp is good return data, else return null
  getData() {
    if (!this.isValid()) return null;
    const json = localStorage.getItem("recipes");
    console.log("ITEMS IN LOCALSTORAGE", JSON.parse(json));
    return json ? JSON.parse(json) : null;
  }

  // Set data and timestamp
  setData(data) {
    localStorage.setItem("recipes", JSON.stringify(data));
    localStorage.setItem("recipes_timestamp", Date.now());
  }

  // Clear Cache
  clearCache() {
    localStorage.removeItem("recipes");
    localStorage.removeItem("recipes_timestamp");
  }
}
