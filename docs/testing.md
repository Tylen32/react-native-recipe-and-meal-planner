# Testing

## Manual Test Checklist

| Feature | Test | Expected result | Status |
| --- | --- | --- | --- |
| Search | Search for a valid meal | Matching meals appear | Pass |
| Search | Search for an unknown meal | Empty-state message appears | Pass |
| Categories | Select a category | Meals from that category appear | Pass |
| Meal details | Open a meal | Image, ingredients and instructions appear | Pass |
| Favorites | Add and remove a favorite | Favorites screen updates | Pass |
| Favorites | Restart the application | Saved favorites remain | Pass |
| Weekly plan | Add a meal to a slot | Meal appears in the selected slot | Pass |
| Weekly plan | Replace an occupied slot | New meal replaces the previous meal | Pass |
| Weekly plan | Remove a planned meal | Slot becomes empty | Pass |
| Weekly plan | Restart the application | Planned meals remain | Pass |
| Home | Add a meal for today | Meal appears under today’s plan | Pass |
| Navigation | Move between tabs and details | Correct screens open without errors | Pass |
| Error handling | Disconnect from the network and search | Error state appears | Pass |

## Test Environment

- Platform: iOS Simulator and physical device
- Framework: Expo
- TypeScript check: `npx tsc --noEmit`
- Date tested: Add the actual testing date