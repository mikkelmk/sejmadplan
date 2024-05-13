import { SHA512 } from "crypto-js";

const DEFAULT_RECIPES_PER_WEEK = 3;

export const defaultRecipesForThisWeek = (recipeNames: string[]): string[] => {
  // Get latest sunday and use as seed
  const d = new Date();
  d.setDate(d.getDate() - d.getDay());
  const seed = d.toDateString();

  const randomNumbers = scuffedRandomNumbers(seed);

  const pickableRecipes = [...recipeNames];
  const pickedRecipes = [];
  for (const r of randomNumbers) {
    const index = r % pickableRecipes.length;
    pickedRecipes.push(pickableRecipes[index]);
    pickableRecipes.splice(index, 1);
    if (pickedRecipes.length >= DEFAULT_RECIPES_PER_WEEK) {
      break;
    }
  }

  return pickedRecipes;
};

// Given a string as seed, generates 32 deterministic random numbers between 0 and 65535
const scuffedRandomNumbers = (seed: string): number[] => {
  const hash = SHA512(seed).toString();
  return [...Array(32).keys()].map((i) => {
    const hashSlice = hash.slice(i * 4, (i + 1) * 4);
    return parseInt(hashSlice, 16);
  });
};
