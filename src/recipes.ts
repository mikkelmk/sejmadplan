import recipesJson from "./recipes.json";

interface RecipeRaw {
  name: string;
  items: string[];
  steps: string[];
}

export interface Item {
  name: string;
  amount?: number;
  unit?: string;
}

export interface Recipe {
  name: string;
  items: Item[];
  steps: string[];
}

const isValidNumber = (str: string) => {
  return /^\d+$|^\d+\.\d+$/.test(str);
};

const parseItems = (itemsRaw: string[]) => {
  const items = [];

  for (const item of itemsRaw) {
    const itemArr = item.split(" ");
    if (isValidNumber(itemArr[0])) {
      if (itemArr.length < 2) {
        throw new Error(`Unable to parse item: ${item}`);
      }
      items.push({
        name: itemArr.slice(2).join(" "),
        amount: parseFloat(itemArr[0]),
        unit: itemArr[1],
      });
    } else {
      items.push({
        name: item,
      });
    }
  }

  if (new Set(items.map((item) => item.name)).size !== items.length) {
    throw new Error("Duplicate items in recipe");
  }

  return items;
};

const parseRecipes = (): Recipe[] => {
  const recipesRaw = recipesJson as RecipeRaw[];

  const recipes = [];

  for (const recipeRaw of recipesRaw) {
    recipes.push({
      name: recipeRaw.name,
      items: parseItems(recipeRaw.items),
      steps: recipeRaw.steps,
    });
  }

  if (new Set(recipes.map((recipe) => recipe.name)).size !== recipes.length) {
    throw new Error("Duplicate recipe");
  }

  return recipes.sort((a, b) => a.name.localeCompare(b.name));
};

export const recipes = parseRecipes();
export const recipeNames = recipes.map((recipe) => recipe.name);
export const recipeMap = Object.fromEntries(
  recipes.map((recipe) => [recipe.name, recipe])
);
