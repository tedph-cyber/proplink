# Hamburger Menu Debugging Guide

## Issue Fixed

**Problem:** Hamburger menu wasn't opening when clicked

**Root Cause:** Z-index stacking context conflict
- Header: `z-50`
- Backdrop: `z-40` (too low)
- Menu: `z-50` (same as header, conflict)

**Solution Applied:**
- Backdrop: Changed to `z-[60]`
- Menu Panel: Changed to `z-[70]`
- Added `max-height` and `overflow-y-auto` for scrolling
- Added smooth animation

## How to Test

### 1. Start Dev Server
```bash
cd /home/tedph/dev/proplink
npm run dev
```

### 2. Open Browser
Navigate to: `http://localhost:3000`

### 3. Test Mobile View
1. Press `F12` to open DevTools
2. Press `Ctrl+Shift+M` for device toolbar
3. Select "iPhone 12 Pro" or set width < 768px

### 4. Test Hamburger Menu

**Expected Behavior:**

1. **Click Hamburger Icon (☰)**
   - Console should log: "Toggle menu clicked, current state: false"
   - Icon should change from ☰ to ✕
   - Dark backdrop should appear (dimmed screen)
   - Menu should slide down from top
   - Menu should be above everything (z-70)

2. **Menu Should Show:**
   - Browse Properties
   - Login 🔐 (if not logged in)
   - Create Account ✨ (if not logged in)
   - OR Dashboard/My Properties/etc (if logged in)

3. **Click ✕ Icon**
   - Console should log: "Toggle menu clicked, current state: true"
   - Menu should close
   - Backdrop should disappear
   - Icon changes back to ☰

4. **Click Backdrop (dark area)**
   - Menu should close
   - Return to normal view

5. **Click Any Menu Link**
   - Navigate to that page
   - Menu should auto-close

## Debugging Steps

### If Menu Still Doesn't Open:

#### Step 1: Check Console
```javascript
// Open browser console (F12)
// Click hamburger menu
// Should see: "Toggle menu clicked, current state: false"
```

If you don't see the console log:
- onClick handler isn't firing
- Check if button is being blocked by another element

#### Step 2: Check React State
```javascript
// In browser console, type:
React.useState

// OR use React DevTools:
// 1. Install React DevTools extension
// 2. Open Components tab
// 3. Find <MobileNav>
// 4. Check "isOpen" hook value
// 5. Click hamburger, watch it toggle
```

#### Step 3: Check Element Visibility
```javascript
// In browser console:
document.querySelector('[aria-label="Toggle menu"]')
// Should return the button element

// Check if menu exists when open:
document.querySelector('nav.container')
// Should return null when closed, element when open
```

#### Step 4: Check Z-Index
```javascript
// In browser console:
const backdrop = document.querySelector('.fixed.inset-0.bg-black\\/50')
const menu = document.querySelector('.fixed.top-16')

console.log('Backdrop z-index:', window.getComputedStyle(backdrop).zIndex)
console.log('Menu z-index:', window.getComputedStyle(menu).zIndex)

// Should show:
// Backdrop: 60
// Menu: 70
```

#### Step 5: Check CSS Classes
Right-click hamburger button → Inspect → Check classes:
```
✅ Should have: md:hidden
✅ Should have: inline-flex, items-center, justify-center
✅ Should have: p-2
```

Right-click menu when open → Inspect → Check classes:
```
✅ Should have: fixed, top-16
✅ Should have: z-[70]
✅ Should have: bg-[var(--background)]
```

### If Menu Opens But Is Hidden:

Check z-index stacking:
```css
/* Header should be: */
z-index: 50

/* Backdrop should be: */
z-index: 60

/* Menu should be: */
z-index: 70
```

### If Click Does Nothing:

1. **Check if dev server is running:**
```bash
lsof -ti:3000
# Should return a process ID
```

2. **Check browser console for errors:**
- Press F12
- Go to Console tab
- Look for red errors
- Common issues:
  - "Cannot read property of undefined"
  - "Module not found"
  - "Unexpected token"

3. **Clear browser cache:**
```
Ctrl+Shift+Delete
Clear cache and reload
```

4. **Restart dev server:**
```bash
# Kill the process
pkill -f "next dev"

# Start again
npm run dev
```

## Visual Debugging

### Add Temporary Background Colors

Edit `mobile-nav.tsx` temporarily:

```tsx
{/* Backdrop - make it more visible */}
<div
  className="fixed inset-0 bg-red-500/80 z-[60]"  // Changed to red
  onClick={closeMenu}
/>

{/* Menu Panel - make it obvious */}
<div className="fixed top-16 right-0 left-0 z-[70] bg-blue-500 ...">  // Changed to blue
```

Now when you click:
- You should see RED backdrop
- You should see BLUE menu

If you don't see these, there's a rendering issue.

## Common Fixes

### Fix 1: Button Not Clickable
```tsx
// Make sure button is on top
<button
  onClick={toggleMenu}
  className="... relative z-[51]"  // Add relative and z-index
>
```

### Fix 2: Menu Behind Header
Already fixed with z-[70], but if still an issue:
```tsx
<div className="fixed top-16 right-0 left-0 z-[100] ...">
```

### Fix 3: State Not Updating
```tsx
// Change from:
const toggleMenu = () => setIsOpen(!isOpen)

// To:
const toggleMenu = () => {
  setIsOpen(prev => !prev)  // Use functional update
}
```

### Fix 4: Hydration Mismatch
If you see "Text content does not match" error:
```tsx
// Add this to mobile-nav.tsx
'use client'
import { useState, useEffect } from 'react'

export function MobileNav({ user, isAdmin }: MobileNavProps) {
  const [mounted, setMounted] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null  // Prevent SSR issues
  
  // ... rest of component
}
```

## Success Checklist

After applying fixes, verify:

- [ ] Console shows "Toggle menu clicked" when clicking
- [ ] Hamburger icon changes from ☰ to ✕
- [ ] Dark backdrop appears (covers screen)
- [ ] Menu slides down from top
- [ ] Menu is visible and clickable
- [ ] Menu closes when clicking X
- [ ] Menu closes when clicking backdrop
- [ ] Menu closes when clicking a link
- [ ] No console errors
- [ ] Works on mobile viewport (< 768px)
- [ ] Hidden on desktop viewport (>= 768px)

## Still Not Working?

1. **Check file saved:** Make sure `mobile-nav.tsx` changes are saved
2. **Check hot reload:** Dev server should auto-refresh
3. **Hard refresh:** Ctrl+Shift+R or Cmd+Shift+R
4. **Restart everything:**
   ```bash
   pkill -f "next dev"
   rm -rf .next
   npm run dev
   ```

5. **Check TypeScript errors:**
   ```bash
   npx tsc --noEmit
   ```

## Contact for Help

If still stuck, provide:
1. Browser console output
2. React DevTools screenshot of MobileNav component
3. Network tab showing if page loaded correctly
4. Any error messages

---

**After Fix Applied:**
The menu should now open properly with correct z-index stacking (z-60 backdrop, z-70 menu panel).
