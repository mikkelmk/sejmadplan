import { useMemo, useState } from "react";
import "./App.css";
import { defaultRecipesForThisWeek } from "./random.ts";

import { Item, recipeMap, recipeNames } from "./recipes.ts";

function App() {
  const [selectedRecipes, setSelectedRecipes] = useState<string[]>(() =>
    defaultRecipesForThisWeek(recipeNames)
  );

  const totalItems = useMemo(() => {
    const stats: Record<string, Record<string, number>> = {};
    const nonAmountItems: string[] = [];

    for (const recipeName of selectedRecipes) {
      for (const item of recipeMap[recipeName].items) {
        if (item.amount && item.unit) {
          if (!stats[item.name]) {
            stats[item.name] = {};
          }
          if (!stats[item.name][item.unit]) {
            stats[item.name][item.unit] = 0;
          }
          stats[item.name][item.unit] += item.amount;
        } else {
          nonAmountItems.push(item.name);
        }
      }
    }

    const r: Item[] = [];
    for (const name in stats) {
      for (const unit in stats[name]) {
        r.push({
          name,
          amount: stats[name][unit],
          unit,
        });
      }
    }
    for (const name of nonAmountItems) {
      r.push({
        name,
      });
    }
    return r;
  }, [selectedRecipes]);

  return (
    <div className="app-container">
      <div className="madplan">
        <h3>Tilpas</h3>
        {recipeNames.map((recipeName) => (
          <div className="recipe-select">
            <p>{recipeName}</p>
            <input
              type="checkbox"
              checked={selectedRecipes.includes(recipeName)}
              onChange={() => {
                if (!selectedRecipes.includes(recipeName)) {
                  setSelectedRecipes([...selectedRecipes, recipeName]);
                } else {
                  setSelectedRecipes(
                    selectedRecipes.filter((r) => r !== recipeName)
                  );
                }
              }}
            />
          </div>
        ))}
        <h3>Ugens Menu</h3>
        {selectedRecipes.map((recipeName) => (
          <p>{recipeName}</p>
        ))}
        <h3>Samlet Indkøbsliste</h3>
        {totalItems.map((item) => (
          <p>
            {item.amount} {item.unit} {item.name}
          </p>
        ))}
        <h3>Opskrifter</h3>
        {selectedRecipes.map((recipeName, i) => {
          const recipe = recipeMap[recipeName];
          return (
            <div className="recipe-details">
              <h4>
                {i + 1}) {recipeName}
              </h4>
              {recipe.items.map((item) => (
                <p>
                  {item.amount} {item.unit} {item.name}
                </p>
              ))}
              <ol>
                {recipe.steps.map((step) => (
                  <li>{step}</li>
                ))}
              </ol>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;
