/**
 * Onloading the page this event is triggered
 */
document.addEventListener('DOMContentLoaded', () => {

    /**
     * Getting the element of input form
     */
    const recipeForm = document.getElementById('recipe-form');

    /**
     * Getting the element of recipe list
     */
    const recipeList = document.getElementById('recipe-list');

    /**
     * Getting the element of search bar
     */
    const searchBar = document.getElementById('search-bar');

    /**
     * Getting the element of steps container or which contains the steps of the recipe
     */
    const stepsContainer = document.getElementById('steps-container');

    /**
     * Getting the element of add step button in the form
     */
    const addStepBtn = document.getElementById('add-step-btn');

    /**
     * Getting the element of modal displayed after clicking the view button
     */
    const recipeModal = document.getElementById('recipe-modal');

    /**
     * Getting the element of recipe name in the modal
     */
    const modalRecipeName = document.getElementById('modal-recipe-name');

    /**
     * Getting the element of recipe image in the modal
     */
    const modalRecipeImage = document.getElementById('modal-recipe-image');

    /**
     * Getting the element of ingredients in the modal
     */
    const modalIngredients = document.getElementById('modal-ingredients');

    /**
     * Getting the element of modal steps in the modal
     */
    const modalSteps = document.getElementById('modal-steps');

    /**
     * Getting the element of moadal category in the modal
     */
    const modalCategory = document.getElementById('modal-category');

    /**
     * Getting the element of search bar
     */
    const closeModal = document.querySelector('.close');

    /**
     * Getting the JSON data of recipes from the local storage
     */
    let recipes = JSON.parse(localStorage.getItem('recipes')) || [];

    //Making sure in that certain area step is only array
    recipes.forEach(recipe => {
        if (!Array.isArray(recipe.steps)) {
            recipe.steps = [];
        }
    });


    /**
     * Renders the given recipes in the recipe list
     * @param {array} recipesToRender - The recipes to be rendered
     */
    function renderRecipes(recipesToRender) {
        recipeList.innerHTML = '';
        recipesToRender.forEach((recipe, index) => {
            const li = document.createElement('li');
            li.className = 'recipe-item';
            li.innerHTML = `
                <h3>${recipe.name}</h3>
                <p><strong>Ingredients:</strong> ${recipe.ingredients}</p>
                <p><strong>Steps:</strong> ${recipe.steps.join(', ')}</p>
                <p><strong>Category:</strong> ${recipe.category}</p>
                <button class="edit-btn" data-index="${index}">Edit</button>
                <button class="delete-btn" data-index="${index}">Delete</button>
                <button class="view-btn" data-index="${index}">View</button>
            `;
            recipeList.appendChild(li);
        });

        //For deletion of the recipe
        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', deleteRecipe);
        });

        //for editing the recipe
        document.querySelectorAll('.edit-btn').forEach(button => {
            button.addEventListener('click', editRecipe);
        });

        //for viewing the recipe
        document.querySelectorAll('.view-btn').forEach(button => {
            button.addEventListener('click', viewRecipe);
        });
    }

    /**
     * Saves the recipes to local storage
     */
    function saveToLocalStorage() {
        localStorage.setItem('recipes', JSON.stringify(recipes));
    }

    // Add a new step textarea when the user clicks the button
    addStepBtn.addEventListener('click', () => {
        const newStep = document.createElement('textarea');
        newStep.className = 'cooking-step';
        newStep.placeholder = 'Cooking Step';
        stepsContainer.appendChild(newStep);
    });

    /*
     * Handle the form submission
     * And push the data in the local storage
     * Also Handling the case when no image is uploaded or image is uploaded
     * 
     */
    recipeForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const recipeName = document.getElementById('recipe-name').value;
        const ingredients = document.getElementById('ingredients').value;
        const cookingSteps = Array.from(document.querySelectorAll('.cooking-step')).map(step => step.value);
        const category = document.getElementById('category').value;
        const imageFile = document.getElementById('recipe-image').files[0];

        const reader = new FileReader();
        reader.onload = function (event) {
            const newRecipe = {
                name: recipeName,
                ingredients: ingredients,
                steps: cookingSteps.length > 0 ? cookingSteps : [],
                category: category,
                image: event.target.result
            };

            recipes.push(newRecipe);
            saveToLocalStorage();
            renderRecipes(recipes);
            recipeForm.reset();
            stepsContainer.innerHTML = '<textarea class="cooking-step" placeholder="Cooking Step"></textarea>'; // Reset steps
        };
        if (imageFile) {
            reader.readAsDataURL(imageFile); // Read the image file
        } else {
            // Handle case where no image is uploaded
            const newRecipe = {
                name: recipeName,
                ingredients: ingredients,
                steps: cookingSteps.length > 0 ? cookingSteps : [],
                category: category,
                image: '' // No image
            };
            recipes.push(newRecipe);
            saveToLocalStorage();
            recipeForm.reset();
            stepsContainer.innerHTML = '<textarea class="cooking-step" placeholder="Cooking Step"></textarea>';
            renderRecipes(recipes);

        }
    });


    /**
     * Deletes the recipe at the given index from the recipes array
     * Then saves to local storage and renders the recipes list
     * @param {Event} e - The event object, containing the index of the recipe to delete
     */
    function deleteRecipe(e) {
        const index = e.target.dataset.index;
        recipes.splice(index, 1);
        saveToLocalStorage();
        renderRecipes(recipes);
    }

    /**
     * Edit the recipe of the given index, handles in the form
     * @param {Event} e - The event object, containing the index of the recipe to edit
     */
    function editRecipe(e) {
        const index = e.target.dataset.index;
        const recipe = recipes[index];

        document.getElementById('recipe-name').value = recipe.name;
        document.getElementById('ingredients').value = recipe.ingredients;
        stepsContainer.innerHTML = '';

        //for steps to render in their respective boxes
        recipe.steps.forEach(step => {
            const stepTextarea = document.createElement('textarea');
            stepTextarea.className = 'cooking-step';
            stepTextarea.value = step;
            stepsContainer.appendChild(stepTextarea);
        });

        document.getElementById('category').value = recipe.category;

        // remove the recipe from the list to avoid duplication
        recipes.splice(index, 1);
        saveToLocalStorage();
        renderRecipes(recipes);
    }

    /**
     * Displays the recipe details in the modal
     * @param {Event} e - The event object, containing the index of the recipe to view
     */
    function viewRecipe(e) {
        const index = e.target.dataset.index;
        const recipe = recipes[index];

        modalRecipeName.textContent = recipe.name;
        modalRecipeImage.src = recipe.image || 'default-image.png'; // Use a default image if none is uploaded
        modalIngredients.textContent = recipe.ingredients;
        modalSteps.textContent = recipe.steps.join(', ');
        modalCategory.textContent = recipe.category;

        // Setting modal to the visible
        recipeModal.style.display = 'block';
    }

    // Close the modal when the user clicks on close button
    closeModal.onclick = function () {
        recipeModal.style.display = 'none';
    }

    // close the modal when the user click anywhere outside of the modal
    window.onclick = function (event) {
        if (event.target === recipeModal) {
            recipeModal.style.display = 'none';
        }
    }

    // Search functionality by name and category
    searchBar.addEventListener('input', () => {
        const searchTerm = searchBar.value.toLowerCase();
        const filteredRecipes = recipes.filter(recipe =>
            recipe.name.toLowerCase().includes(searchTerm) ||
            recipe.ingredients.toLowerCase().includes(searchTerm) ||
            recipe.category.toLowerCase().includes(searchTerm)
        );
        //rendering the filtered results
        renderRecipes(filteredRecipes);
    });

    renderRecipes(recipes);
});