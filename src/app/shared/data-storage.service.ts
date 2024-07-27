import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RecipeService } from '../recipes/recipe.service';
import { Recipe } from '../recipes/recipe.model';
import { exhaustMap, map, take, tap } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class DataStorageService {

  constructor(
    private http: HttpClient,
    private recipeService: RecipeService,
    private authService: AuthService) { }

  storeRecipes() {
    const recipes = this.recipeService.getRecipes();
    this.http
      .put("https://ng-recipe-library-default-rtdb.firebaseio.com/recipes.json", recipes)
      .subscribe(response => {
        alert("Data has been saved.");
        console.log(response);
      });
  }

  // fetchRecipes() {
  //   return this.http
  //     .get<{ [key: string]: Recipe[] }>("https://ng-recipe-library-default-rtdb.firebaseio.com/recipes.json")
  //     .pipe(
  //       map(data => data.recipes),
  //       tap(recipes => {
  //         this.recipeService.setRecipes(recipes);
  //       })
  //     );
  // }

  fetchRecipes() {
    return this.http
      .get<{ [key: string]: Recipe[] }>("https://ng-recipe-library-default-rtdb.firebaseio.com/recipes.json?")
      .pipe(map(data => {
        // Extract arrays of recipes from each key in the response object
        const recipesArrays = Object.values(data);
        // Merge arrays into a single array
        return recipesArrays.reduce((acc, curr) => acc.concat(curr), []);
      }),
        tap(recipes => {
          // Set the recipes using the extracted array
          this.recipeService.setRecipes(recipes);
        }));
  }
}
// fetchRecipes() {
//   this.http
//     .get<{ [key: string]: Recipe[] }>("https://ng-recipe-library-default-rtdb.firebaseio.com/recipes.json")
//     .pipe(
//       map(data => {
//         // Extract the array of recipes from the key-value pairs
//         const recipesArray: Recipe[] = [];
//         for (const key in data) {
//           if (data.hasOwnProperty(key)) {
//             recipesArray.push(...data[key]);
//           }
//         }
//         return recipesArray;
//       })
//     )
//     .subscribe(recipes => {
//       this.recipeService.setRecipes(recipes);
//     });
// }

