# Filter Testing Guide

## How to Test the Property Search Filters

### 1. **Navigate to Properties Page**
   - Go to `http://localhost:3000/properties`
   - You should see the search bar with a "Show Filters" button

### 2. **Test Filter Button**
   - Click the **"Show Filters"** button
   - A filter panel should slide down showing:
     - Property Type dropdown (House/Land)
     - State dropdown (All Nigerian states)
     - LGA input field
     - City/Area input field
     - Min Price input
     - Max Price input
     - Sort By dropdown
   - The button text should change to **"Hide Filters"**

### 3. **Test Filter Count Badge**
   - Apply any filter (e.g., select "Lagos" as State)
   - Click "Apply Filters"
   - The filter button should now show a number badge indicating active filters
   - Example: "Show Filters (1)" if one filter is active

### 4. **Test Individual Filters**

   **Property Type Filter:**
   ```
   1. Select "House" from Property Type dropdown
   2. Click "Apply Filters"
   3. URL should update: /properties?type=house
   4. Only houses should appear in results
   ```

   **State Filter:**
   ```
   1. Select "Lagos" from State dropdown
   2. Click "Apply Filters"
   3. URL should update: /properties?state=Lagos
   4. Only Lagos properties should appear
   ```

   **Price Range Filter:**
   ```
   1. Enter Min Price: 5000000
   2. Enter Max Price: 10000000
   3. Click "Apply Filters"
   4. URL should update: /properties?minPrice=5000000&maxPrice=10000000
   5. Only properties in that price range should appear
   ```

   **Text Search:**
   ```
   1. Type "Lekki" in the main search bar
   2. Press Enter or click "Search"
   3. URL should update: /properties?q=Lekki
   4. Properties with "Lekki" in title/description/location should appear
   ```

   **Sort Order:**
   ```
   1. Open filters
   2. Select "Price: Low to High" from Sort By
   3. Click "Apply Filters"
   4. URL should update: /properties?sort=price-asc
   5. Properties should be sorted by ascending price
   ```

### 5. **Test Filter Tags (Active Filters Display)**
   - After applying filters, close the filter panel (click "Hide Filters")
   - You should see colored badges showing active filters
   - Each badge should have an "×" button to remove that specific filter
   - Example badges:
     - "Search: Lekki" ×
     - "Lagos" ×
     - "Price: ₦5000000 - ₦10000000" ×

### 6. **Test Filter Removal**
   
   **Remove Individual Filter:**
   ```
   1. Apply multiple filters
   2. Click the "×" on any filter badge
   3. That filter should be removed
   4. URL and results should update immediately
   ```

   **Clear All Filters:**
   ```
   1. Open filter panel with active filters
   2. Click "Clear All" button
   3. All filters should reset
   4. URL should return to /properties
   5. All properties should appear
   ```

### 7. **Test Combined Filters**
   ```
   1. Apply multiple filters together:
      - Property Type: House
      - State: Lagos
      - Min Price: 10000000
      - Search: "duplex"
   2. Click "Apply Filters"
   3. URL should have all parameters: 
      /properties?q=duplex&type=house&state=Lagos&minPrice=10000000
   4. Only properties matching ALL criteria should appear
   ```

### 8. **Test URL Parameters (Direct Access)**
   ```
   1. Manually enter URL with filters:
      http://localhost:3000/properties?type=land&state=Ogun
   2. Filter panel should show these values when opened
   3. Results should be filtered correctly
   4. Filter badges should appear
   ```

## Visual Improvements (Theme System)

### New Theme Features:
- ✅ **Filter Button**: 
  - Shows "Hide Filters" / "Show Filters" text
  - Green badge with count of active filters
  - Smooth transitions

- ✅ **Filter Panel**: 
  - Card background with shadow
  - Theme-aware borders and inputs
  - Slide-in animation

- ✅ **Filter Badges**: 
  - Green tinted background with border
  - Hover effect on remove button (turns red)
  - Capitalized property types

- ✅ **Select Dropdowns**:
  - Theme-aware styling
  - Focus ring matches primary color
  - Smooth transitions

## Common Issues & Solutions

### Issue: Filters not working
**Solution**: Check browser console for errors, ensure Supabase is connected

### Issue: No properties showing
**Solution**: 
- Make sure you have properties in the database with `status='active'`
- Check that properties have the required fields (state, price_min, price_max)

### Issue: Filter panel not showing
**Solution**: 
- Check that React state is updating (open React DevTools)
- Ensure the button onClick handler is firing

### Issue: URL not updating
**Solution**: 
- Check that router.push is being called
- Ensure Next.js router is properly initialized

## Expected Behavior Summary

1. **Filter Button**: Always visible, shows count badge when filters are active
2. **Filter Panel**: Toggles visibility, retains values when closed
3. **Apply Filters**: Updates URL and triggers new property fetch
4. **Filter Badges**: Show below search when filters active and panel closed
5. **Remove Filter**: Clicking × removes that filter and refetches
6. **Clear All**: Resets everything to default state
7. **URL Sync**: All filters reflected in URL for bookmarking/sharing

## Test Database Setup

If you don't have test data, create some properties with varied attributes:

```sql
-- Insert test properties via Supabase SQL Editor
INSERT INTO properties (user_id, title, description, property_type, state, city, price_min, price_max, status) VALUES
('your-user-id', 'Beautiful House in Lekki', 'Modern 4-bedroom duplex', 'house', 'Lagos', 'Lekki', 15000000, 20000000, 'active'),
('your-user-id', 'Land in Ikoyi', 'Prime commercial land', 'land', 'Lagos', 'Ikoyi', 50000000, 60000000, 'active'),
('your-user-id', 'House in Ibadan', '3-bedroom bungalow', 'house', 'Oyo', 'Ibadan', 8000000, 10000000, 'active'),
('your-user-id', 'Land in Abeokuta', 'Residential plot', 'land', 'Ogun', 'Abeokuta', 3000000, 5000000, 'active');
```

Replace `'your-user-id'` with an actual user ID from your `auth.users` table.
