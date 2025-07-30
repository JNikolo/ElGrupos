# Chrome Tab and Tab Group Reordering Implementation

## Overview

This implementation adds drag-and-drop functionality to reorder both individual tabs within groups and entire tab groups using the @dnd-kit library.

## Features Implemented

### 1. Tab Drag and Drop (Within Groups)

- **Visual Drag Handle**: Each tab now shows a grip icon (⋮⋮) that users can click and drag
- **Smooth Animations**: Uses Material Design-inspired transitions for smooth drag operations
- **Visual Feedback**: Dragged items show visual states (opacity, border changes)
- **Drag Overlay**: Shows a preview of the item being dragged

### 2. Tab Group Drag and Drop

- **Group Reordering**: Entire tab groups can be dragged and reordered
- **Chrome Integration**: Groups are actually reordered in Chrome browser
- **Visual Feedback**: Groups show visual states during dragging and reordering
- **Loading States**: Disabled state while reordering is in progress

### 3. Chrome API Integration

- **Real-time Reordering**: Both tabs and groups are reordered in Chrome when dropped
- **Error Handling**: Graceful fallback if Chrome API calls fail
- **Optimistic Updates**: UI updates immediately for responsive feel
- **Complex Group Moving**: Handles moving entire groups with all their tabs

### 4. User Experience Enhancements

- **Loading States**: Visual indicators when reordering is in progress
- **Accessibility**: Keyboard support for drag operations via @dnd-kit
- **Tooltips**: Helpful hints for drag functionality
- **Responsive Design**: Works within the existing Material Design system

## Technical Implementation

### Files Modified/Created

1. **`src/utils/tabUtils.ts`** (NEW)

   - `reorderTabsInGroup()`: Handles Chrome API calls for tab reordering within groups
   - `reorderTabGroups()`: Uses Chrome Tab Groups API (`chrome.tabGroups.move()`) for proper group reordering
   - `getSortedTabGroups()`: Gets tab groups sorted by their actual browser position
   - `moveTabInGroup()`: Low-level tab movement utility
   - `getTabIndexInGroup()`: Helper for index calculations

2. **`src/components/TabItem.tsx`**

   - Added drag handle with grip icon
   - Integrated @dnd-kit/sortable hooks
   - Added visual states for dragging and reordering

3. **`src/components/TabList.tsx`**

   - Wrapped tab list in DndContext
   - Added SortableContext for vertical list sorting
   - Implemented drag event handlers
   - Added DragOverlay for better UX

4. **`src/components/TabGroup.tsx`**
   - Added callback handler for tab reordering
   - Passed reorder callback to TabList component

### Key Libraries Used

- **@dnd-kit/core**: Core drag and drop functionality
- **@dnd-kit/sortable**: Sortable list implementation
- **@dnd-kit/utilities**: CSS transform utilities

### Chrome API Usage

- `chrome.tabs.query()`: Get tabs in a group
- `chrome.tabs.move()`: Reorder tabs in Chrome
- Required permissions: `"tabs"`, `"tabGroups"`

## How It Works

1. **User Interaction**: User drags a tab or tab group using the grip handle
2. **Optimistic Update**: UI immediately reflects the new order
3. **Chrome API Call**: Background call to `chrome.tabs.move()`
4. **State Sync**: Local state updates with actual Chrome order using sorted query
5. **Error Handling**: Reverts to original order if API call fails

## Usage

- **Tab Groups**: Drag entire groups up or down using the grip handles (⋮⋮) on the left
- **Individual Tabs**:
  - Expand any tab group by clicking the chevron
  - Drag tabs up or down using the grip handles within the group
- All reordering is reflected both in the extension and in Chrome browser

## Error Handling

- Network/permission errors are logged to console
- UI reverts to original order on errors
- Visual feedback shows when reordering operations are in progress

## Technical Notes

- **Group Position Sync**: Tab groups are sorted by the position of their first tab to ensure the extension reflects the actual browser order
- **Optimistic Updates**: UI updates immediately for responsiveness, then syncs with Chrome API results
- **Proper Group Moving**: Uses Chrome's native `chrome.tabGroups.move()` API to ensure tabs stay properly grouped and maintain integrity
- **Bidirectional Reordering**: Fixed logic ensures both upward and downward group movements work correctly
- **API Compliance**: Leverages the official Chrome Tab Groups API for reliable group operations without manual tab manipulation
