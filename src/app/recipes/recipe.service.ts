import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { Recipe } from './recipe.model';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list/shopping-list.service';

@Injectable({
  providedIn: 'root'
})

export class RecipeService {
  recipesChanged = new Subject<Recipe[]>();

  constructor(private slService: ShoppingListService) { }

  // private recipes: Recipe[] = [
  //   new Recipe(
  //     'Tasty Schnitzel',
  //     'A super-tasty Schnitzel - just awesome!',
  //     'https://upload.wikimedia.org/wikipedia/commons/7/72/Schnitzel.JPG',
  //     [
  //       new Ingredient('Meat', 1),
  //       new Ingredient('French Fries', 20)
  //     ]),
  //   new Recipe('Big Fat Burger',
  //     'What else you need to say?',
  //     'https://upload.wikimedia.org/wikipedia/commons/b/be/Burger_King_Angus_Bacon_%26_Cheese_Steak_Burger.jpg',
  //     [
  //       new Ingredient('Buns', 2),
  //       new Ingredient('Meat', 1)
  //     ])
  // ];

  // setRecipes(recipes: Recipe[]) {
  //   console.log("Type of recipes:", typeof this.recipes);
  //   this.recipes = recipes;
  //   console.log(this.recipes);
  //   this.recipesChanged.next(this.recipes.slice());
  // }

  private recipes: Recipe[] = [];

  //setRecipes(recipesData: { [key: string]: Recipe[] }) {
  setRecipes(recipesData: Recipe[] ) {
    // Extracting the array of recipes from the object
    //Notes at the bottom of the file.
    const recipeIds = Object.keys(recipesData);
    const recipes = recipeIds.reduce((acc: Recipe[], key: string) => {
      return acc.concat(recipesData[key]);
    }, []);
  
    //console.log("Type of recipes:", typeof recipes);
    this.recipes = recipes;
    //console.log(this.recipes);
    this.recipesChanged.next(this.recipes.slice());
  }

  getRecipes() {
    return this.recipes.slice();
  }

  getRecipe(index: number) {
    return this.recipes[index];
  }

  addIngredientsToShoppingList(ingredients: Ingredient[]) {
    this.slService.addIngredients(ingredients);
  }

  addRecipe(recipe: Recipe) {
    this.recipes.push(recipe);
    this.recipesChanged.next(this.recipes.slice());
  }

  updateRecipe(index: number, newRecipe: Recipe) {
    this.recipes[index] = newRecipe;
    this.recipesChanged.next(this.recipes.slice());
  }

  deleteRecipe(index: number) {
    this.recipes.splice(index, 1);
    this.recipesChanged.next(this.recipes.slice());
  }
}







/*notes: in 
const recipeIds = Object.keys(recipesData);
Here, Object.keys() is a JavaScript method that returns an array of a given object's own enumerable property names. In this case, recipesData is the object we're interested in. So, recipeIds will contain an array of keys (property names) from the recipesData object.

in - 

const recipes = recipeIds.reduce((acc: Recipe[], key: string) => {
  return acc.concat(recipesData[key]);
}, []);
Now, reduce() is another method in JavaScript that applies a function against an accumulator and each element in the array (from left to right) to reduce it to a single value. In this case, recipeIds is the array we're reducing.

The function passed to reduce() takes two arguments: acc (the accumulator) and key (the current element being processed). acc starts as an empty array ([]).
Inside the function, acc.concat(recipesData[key]) is used to concatenate the current array in the accumulator (acc) with the value of the property corresponding to the current key in recipesData. This effectively merges all the recipe arrays into a single array.
The result of concat() becomes the new value of the accumulator for the next iteration.
Finally, since we provided an empty array as the initial value for the accumulator ([]), reduce() returns an array containing all the concatenated recipe arrays.
In simple terms, this code takes an object where each property contains an array of recipes (recipesData). It extracts the keys (property names) of this object, then iterates over these keys and combines all the recipe arrays into a single array (recipes). This is done using the reduce() method, which gradually accumulates all the recipe arrays into one. So, recipes will be an array containing all the recipes from the recipesData object.*/
