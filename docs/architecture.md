# Application Architecture

This document explains the structure of the Recipe & Meal Planner application, the responsibilities of its major layers, and how data moves throughout the system.

## Overview

The application uses a layered architecture that separates:

- User-interface
- Feature and asynchronous state
- Shared application state
- API communication
- Local data persistence

This separation of responsibilities keeps the application modular and simpler to add and change features in the future for possible expansion of the application 
## Architecture Diagram

docs/diagrams/SystemArchitecture.drawio.svg

## Layer Responsibilities

### Screens

Screens represent complete application views, including:

- Home
- Search
- Category results
- Meal details
- Favorites
- Weekly planner

Screens display data, respond to user interaction, and navigate to other screens. They utilize reusable interface elements, components, and feature behavior to custom hooks or contexts.

### Components

Components contain reusable pieces of the interface, such as:

- Meal cards
- Category cards
- Day and meal-slot cards
- Today’s meal-plan summary
- Shared buttons

Components receive data and event handlers through props. They do not directly access TheMealDB or AsyncStorage.

### Custom Hooks

Custom hooks manage feature-specific behavior and asynchronous state.

project hooks include:

- `useMealSearch`
- `useMealDetails`
- `useCategories`
- `useCategoryMeals`
- `useFavoritesManager`
- `useMealPlanManager`

Their responsibilities include:

- Starting API requests
- Tracking loading state
- Storing successful results
- Handling empty responses
- Handling request failures
- Coordinating feature actions

This keeps most business logic and asynchronous logic outside the screen components.

### Context Providers

Context providers make shared state available throughout the application.

The application uses contexts for:

- Favorite meals
- Weekly meal plans

The providers allow multiple screens to access the same state without passing it through every intermediate component.

 Hooks contain most feature behavior, while contexts expose the resulting state and actions to the component.

### API Service

`mealDbApi.ts` contains communication with TheMealDB.

Its responsibilities include:

- Building endpoint URLs
- Sending HTTP requests
- Checking response status
- Parsing JSON responses
- Converting raw responses into typed application models
- Returning predictable values to hooks

Keeping API access in one module prevents screens from depending directly on endpoint details.

### Storage Services

The storage layer contains separate services for favorites and meal plans.

Its responsibilities include:

- Serializing application data into JSON
- Saving JSON with AsyncStorage
- Reading saved values
- Parsing stored JSON
- Returning safe default values when no saved data exists

Separating storage from contexts and screens makes persistence behavior easier to maintain, change and test.

## Navigation

The application combines a native root stack with a bottom-tab navigator.

docs/diagrams/NavigationDiagram.drawio.svg

The bottom tabs provide access to the four primary areas of the application:

- Home
- Search
- Favorites
- Weekly Plan

`MealDetails` and `CategoryMeals` are root-stack screens. They open above the tab navigator because they can be reached from multiple parts of the application.


## Data Flow

The application handles two main kinds of data:

1. Recipe data retrieved from TheMealDB
2. Favorites and meal plans stored locally

docs/diagrams/SystemArchitecture.drawio.svg

### Recipe Data Flow

When recipe information is requested:

1. The user performs an action, such as submitting a search.
2. The screen calls a custom hook action.
3. The hook changes its state to loading.
4. The hook calls the MealDB API service.
5. The service requests and parses JSON from TheMealDB.
6. The service transforms the raw response into application models.
7. The hook stores the result or an error.
8. React rerenders the screen with the new state.

This pattern is used for:

- Searching by meal name
- Loading categories
- Loading meals from a category
- Loading complete meal details

### Local Data Flow

When favorites or meal plans change:

1. The user performs an action from a screen.
2. The screen calls an action exposed by the appropriate context.
3. The manager hook calculates the updated state.
4. The context publishes the updated state to subscribed components.
5. The storage service serializes and saves the state with AsyncStorage.

When the application starts:

1. The storage service reads the saved JSON.
2. The JSON is parsed into application data.
3. The manager initializes the feature state.
4. Components using the context receive the restored data.

## API Data Normalization

TheMealDB returns ingredients and measurements using numbered properties:

```text
strIngredient1
strMeasure1
strIngredient2
strMeasure2
...
strIngredient20
strMeasure20
```

The API layer converts those properties into an application-friendly array:

```ts
type Ingredient = {
  name: string;
  measure: string;
};
```

The normalized meal model can therefore contain:

```ts
ingredients: Ingredient[];
```

This provides several benefits:

- Screens do not need to loop through numbered property names.
- Empty ingredient values can be removed in one place.
- Ingredient rendering becomes simpler.
- The application is less dependent on TheMealDB’s response format.
- The model can support a future combined grocery-list feature.

## State Management

The application uses different state-management approaches depending on the scope of the data.

### Local Screen State

Screen-specific and request-specific state is managed through custom hooks and React state.

Examples include:

- Search results
- Search terms
- Loading indicators
- Request errors
- Whether a search has been submitted
- Meal detail data
- Category results


### Shared Application State

Favorites and meal plans are shared across multiple screens, so they are exposed through Context.

Examples include:

- A favorite indicator on the Meal Details screen
- The complete list on the Favorites screen
- Planned meals on the Weekly Plan screen
- Today’s planned meals on the Home screen

### Persistent State

Favorites and meal plans must survive application restarts. To do this their state is shared with AsyncStorage through dedicated storage services.

## Meal-Plan Model

The weekly planner organizes meals by:

- Day of the week
- Breakfast
- Lunch
- Dinner

Each slot may contain a meal summary or remain empty.

A meal summary contains only the fields required to identify and display a planned meal, such as its identifier, name, and image. Full recipe details are requested only when the user opens the Meal Details screen.

This prevents unnecessary full recipe objects from being duplicated throughout the weekly plan.

## Asynchronous UI States

API-driven features account for four primary states:

- Loading
- Success
- Empty
- Error

Custom hooks manage these states, while screens decide how each state should be presented.

For example, a search screen may:

- Display an activity indicator during a request
- Display meal cards after a successful request
- Display an empty-state message when no meals match
- Display an error message when the request fails

Using explicit asynchronous states prevents failed or empty requests from appearing as blank screens and serves as a form of error handling.

## Error Handling

Errors from external requests are caught inside the appropriate custom hooks.

When a request fails:

1. The error is logged for development purposes.
2. invalid results are cleared when appropriate.
3. The hook stores a user-friendly error message.
4. The screen displays the error state.
5. Loading state is cleared. 


## Project Structure

```text
src/
├── api/          # TheMealDB requests and response transformation
├── components/   # Reusable interface components
├── context/      # Shared favorites and meal-plan state
├── hooks/        # Feature logic and asynchronous state
├── models/       # TypeScript application models
├── navigation/   # Root-stack and bottom-tab configuration
├── screens/      # Complete application screens
├── storage/      # AsyncStorage access
├── theme/        # Shared colors, spacing, and typography
└── utils/        # General utility functions
```

## Architectural Benefits

The current structure provides the following benefits:

- Screens remain focused on presentation.
- Reusable components reduce duplicated interface code.
- Custom hooks isolate feature behavior.
- Context makes shared state available where it is needed.
- API details are isolated from the interface.
- Storage details are isolated from feature state.
- Individual layers can be changed with less impact on unrelated code.

## Related Documentation

- [Testing](testing.md)
- [Project README](../README.md)
