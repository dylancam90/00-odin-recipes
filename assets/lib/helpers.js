export async function waitForRecipes(timeout = 5000) {
  const interval = 100;
  let elapsed = 0;

  return new Promise((resolve, reject) => {
    const check = () => {
      const data = JSON.parse(localStorage.getItem("recipes"));
      if (!isEmpty(data)) {
        resolve(data);
      } else if (elapsed >= timeout) {
        reject(new Error("Timeout: recipes not found in localStorage"));
      } else {
        elapsed += interval;
        setTimeout(check, interval);
      }
    };
    check();
  });
}

function isEmpty(obj) {
  return !obj || Object.keys(obj).length === 0;
}
