# Testing Guide - Snapping & Transform Enhancements

## Quick Start Testing

The development server is running at: **http://localhost:3000**

## Test Scenarios

### 1. Test Wall-to-Wall Snapping

**Steps:**

1. Open the application
2. Create a new project or load demo
3. Select the Wall Tool from toolbar
4. Click to place first wall endpoint
5. Move cursor around - you should see:
   - Green angle guide lines from the start point
   - Preview wall following your cursor
6. Click to place the wall
7. Start creating a second wall near the endpoint of the first wall
8. **Expected**: Blue sphere appears at the endpoint when you get close
9. **Expected**: Sphere turns green and pulsates when snapped
10. Click to place the second wall at the snapped point

**Success Criteria:**

- ✓ Blue snap indicators visible
- ✓ Green active snap when close enough
- ✓ Walls connect precisely at endpoints

### 2. Test Connection Prompt

**Steps:**

1. Create two walls that are close to each other (within 0.3m)
2. **Expected**: Dialog appears asking "Objekte verbinden?"
3. Dialog should show three options:
   - "Zusammenführen" (Merge) - if walls are collinear
   - "Verbinden" (Connect)
   - "Getrennt lassen" (Keep Separate)
4. Try each option

**Success Criteria:**

- ✓ Dialog appears automatically
- ✓ Merge option only available for collinear walls
- ✓ Connect option marks walls as connected
- ✓ Keep Separate dismisses dialog

### 3. Test Angle Snapping

**Steps:**

1. Create a wall at any angle
2. Start creating a second wall from the endpoint of the first
3. Move the cursor around
4. **Expected**: Wall snaps to 45° increments (0°, 45°, 90°, 135°, 180°, etc.)
5. **Expected**: Green guide lines show available angles
6. Try creating a perpendicular wall (90°)
7. Try creating a 45° angle wall

**Success Criteria:**

- ✓ Green angle guide lines visible
- ✓ Wall preview snaps to standard angles
- ✓ 90° perpendicular walls easy to create
- ✓ Smooth snapping behavior (5° threshold)

### 4. Test Enhanced Transform Controls

**Steps:**

1. Select the Select Tool
2. Click on any wall or object
3. **Expected**: Larger transform gizmo appears with colored axes
4. Drag the red arrow (X-axis)
5. **Expected**: Object moves along X-axis with 0.1m snapping
6. Try dragging along Z-axis (blue arrow)
7. Switch to rotation mode (if implemented with keyboard shortcut)

**Success Criteria:**

- ✓ Gizmo is larger and more visible than before
- ✓ Movement snaps to 0.1m grid
- ✓ Y-axis hidden for translation (objects stay on ground)
- ✓ Smooth, responsive controls

### 5. Test Transform Feedback

**Steps:**

1. Select an object with Select Tool
2. Start dragging it
3. **Expected**: Overlay appears at top-center showing:
   - Current position (X, Z coordinates)
   - Distance moved (Δ value)
4. Move the object around
5. **Expected**: Values update in real-time
6. Release the object

**Success Criteria:**

- ✓ Feedback overlay appears during transform
- ✓ Position updates in real-time
- ✓ Delta distance accurate
- ✓ Overlay disappears when not transforming

### 6. Test Collision Detection

**Steps:**

1. Create two walls
2. Use Select Tool to move one wall into the other
3. **Expected**: Red collision warning appears:
   - Red glowing sphere at collision point
   - Red pulsing ring
   - Warning message at bottom: "Kollision erkannt: 1 Objekt"
4. Move the wall away
5. **Expected**: Warning disappears

**Success Criteria:**

- ✓ 3D collision indicator visible
- ✓ 2D warning message appears
- ✓ Warning accurate (shows correct count)
- ✓ Connected walls don't trigger false positives

### 7. Test Wall Merging

**Steps:**

1. Create a horizontal wall (left to right)
2. Create another horizontal wall starting from the endpoint of the first
   - Should be collinear (same angle)
3. **Expected**: Connection prompt shows "Zusammenführen" button with green background
4. Click "Zusammenführen"
5. **Expected**: Two walls become one longer wall

**Success Criteria:**

- ✓ Merge button appears for collinear walls
- ✓ Merged wall has correct length
- ✓ Only one wall exists after merge
- ✓ Original wall IDs tracked in metadata

## Visual Verification Checklist

### Colors

- [ ] Blue spheres for snap points
- [ ] Green sphere for active snap (pulsing)
- [ ] Green lines for angle guides
- [ ] Red spheres/rings for collisions
- [ ] RGB (Red/Green/Blue) for transform gizmo axes

### Animations

- [ ] Snap points pulse when active
- [ ] Collision indicators pulse
- [ ] Smooth transitions between states

### UI Elements

- [ ] Connection dialog styled consistently with app
- [ ] Transform feedback overlay readable
- [ ] Warning messages clear and non-intrusive
- [ ] All German text correct

## Performance Checks

1. **FPS**: Should remain smooth (≥30 FPS) during:
   - Wall preview with many snap points
   - Object transformation
   - Collision detection with multiple objects

2. **Responsiveness**:
   - Snap indicators appear instantly
   - Connection prompt appears immediately after wall placement
   - No lag during cursor movement

3. **Memory**:
   - No memory leaks after creating/deleting many walls
   - Smooth operation after 10+ walls created

## Known Limitations

1. **Snap Distance**: 0.3m - may need adjustment based on UX
2. **Angle Threshold**: 5° - might snap too easily/hard depending on use case
3. **Y-Axis**: Currently hidden for translation to keep objects on ground
4. **Multi-Selection**: Transform feedback only shows for single selection

## Keyboard Shortcuts (Existing)

- `W` - Wall Tool
- `S` - Select Tool
- `Esc` - Clear selection / Cancel tool
- `Delete` / `Backspace` - Delete selected element
- `Ctrl/Cmd + Z` - Undo
- `Ctrl/Cmd + Shift + Z` - Redo

## Troubleshooting

### Snap Points Not Appearing

- Make sure you're in Wall Tool mode
- Verify at least one wall exists
- Check cursor is within 0.3m of wall endpoint

### Connection Prompt Not Showing

- Ensure walls are within 0.3m of each other
- Both objects must be walls
- Connection may be prevented if already connected

### Transform Controls Not Visible

- Switch to Select Tool
- Click on an object to select it
- Only works with single selection

### Server Issues

```bash
# Restart server
npm run dev
```

## Success Summary

If all tests pass, you should have:

- ✅ Professional CAD-like snapping system
- ✅ Intelligent wall connection and merging
- ✅ Enhanced, visible transform controls
- ✅ Real-time collision detection
- ✅ Clear visual feedback at all stages
- ✅ Smooth, responsive user experience

## Next Steps

After testing, consider:

1. Adjusting snap distances based on feel
2. Adding more snap point types (wall surfaces, midpoints)
3. Implementing snap history/undo
4. Adding audio feedback for snaps
5. Extending to other element types (roofs, floors)

---

**Happy Testing! 🎉**

For questions or issues, refer to `SNAPPING_TRANSFORM_FEATURES.md` for detailed documentation.
