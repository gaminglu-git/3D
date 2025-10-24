# Snapping & Transform Enhancement Features

## Overview

This document describes the comprehensive snapping system, connection prompts, and enhanced transform visualizations implemented in the 3D Building Viewer.

## 1. Snapping System

### Wall-to-Wall Endpoint Snapping

- **Visual Indicators**: Blue glowing spheres appear at wall endpoints when cursor is nearby (within 0.3m)
- **Active Snap**: Green pulsing sphere shows when actively snapped to a point
- **Automatic Connection**: When snapping to wall endpoints, walls connect precisely

### Angle Snapping

- **Standard Angles**: Walls snap to 0°, 45°, 90°, 135°, 180°, 225°, 270°, 315°
- **Threshold**: 5° tolerance for angle snapping
- **Visual Guides**: Green guide lines show available angle constraints from start point
- **Perpendicular/Parallel**: Automatically detects and snaps perpendicular or parallel to existing walls

### Grid Snapping

- **Grid Size**: 0.1m snap grid
- **Always Active**: Falls back to grid snapping when no wall endpoints nearby

### Snap Point Types

- **Wall Endpoints** (Blue): Primary connection points
- **Angle Guides** (Green): Directional constraints
- **Active Snap** (Green Pulsing): Currently snapped point

## 2. Connection & Merging System

### Connection Prompt Dialog

When a new wall is placed near an existing wall, a dialog appears with three options:

1. **Zusammenführen (Merge)**
   - Combines two collinear walls into a single wall
   - Only available when walls are parallel and aligned
   - Preserves openings and materials

2. **Verbinden (Connect)**
   - Marks walls as connected (for T-junctions or corners)
   - Keeps walls separate but linked
   - Useful for non-collinear walls

3. **Getrennt lassen (Keep Separate)**
   - No connection made
   - Walls remain independent

### Connection Logic

- **Threshold**: 0.3m distance for connection detection
- **Types**: Endpoint connections, T-junctions, corner connections
- **Tracking**: Connected elements store references to each other

### Merging Logic

- **Requirements**:
  - Same rotation (parallel)
  - Same thickness and height
  - Collinear alignment
- **Result**: Single wall with combined length
- **Metadata**: Tracks original wall IDs in merged wall

## 3. Enhanced Transform Controls

### Improved Gizmo Visualization

- **Larger Size**: 1.5x default size for better visibility
- **Custom Colors**: Brighter, more distinct axis colors
- **Y-Axis Control**: Hidden for translation (keeps objects on ground)
- **Snap Values**:
  - Translation: 0.1m snap
  - Rotation: 15° (π/12) snap
  - Scale: 0.1 units

### Transform Feedback Overlay

Displays real-time information during object manipulation:

- **Position**: Current X, Z coordinates (in meters)
- **Delta Distance**: Distance moved from start (Δ 2.45m)
- **Rotation Angle**: Degrees rotated (∠ 45°)
- **Location**: Top-center overlay, non-intrusive

### Transform States

- **onTransformStart**: Captures initial position
- **onTransformChange**: Updates position during drag
- **onTransformEnd**: Finalizes transform

## 4. Collision Detection & Warnings

### Collision Detection

- **Method**: Bounding box intersection (AABB)
- **Exclusions**: Connected elements are not flagged
- **Real-time**: Checks during object movement

### Visual Warnings

#### 3D Indicators

- **Red Sphere**: 0.3m radius warning sphere at collision point
- **Pulsing Ring**: Animated ring around collision
- **Emissive Effect**: Glowing red for high visibility

#### 2D Overlay

- **Warning Badge**: Bottom-center alert
- **Count Display**: Shows number of colliding objects
- **Icon**: Alert triangle for attention

## 5. Implementation Details

### New Files Created

```
src/lib/utils/snapping.ts           - Core snapping algorithms
src/lib/utils/connections.ts        - Connection and merging logic
src/lib/utils/geometry.ts          - Enhanced geometry utilities
src/components/ui/ConnectionPromptDialog.tsx
src/components/ui/TransformFeedback.tsx
src/components/viewer/EnhancedTransformControls.tsx
src/components/viewer/CollisionWarning.tsx
src/components/viewer/SnapIndicators.tsx
```

### Modified Files

```
src/lib/types/building.ts          - Added connection types
src/lib/store/buildingStore.ts     - Connection prompt state
src/components/tools/WallTool.tsx  - Integrated snapping
src/components/tools/ToolManager.tsx
src/components/viewer/ViewerScene.tsx
```

### Key Functions

#### Snapping

- `findNearbyWallEndpoints()` - Detects snap points
- `snapToWallEndpoint()` - Performs snap operation
- `snapToAngle()` - Angle constraint snapping
- `getAngleGuides()` - Generates guide lines

#### Connections

- `canConnect()` - Checks if elements can connect
- `connectWalls()` - Marks walls as connected
- `canMergeWalls()` - Validates merge possibility
- `mergeWalls()` - Combines two walls

#### Collision

- `checkObjectCollision()` - Bounding box intersection
- `calculateElementBoundingBox()` - Generates AABB

## 6. User Workflow

### Creating Connected Walls

1. Select Wall Tool
2. Click to place first point
   - Angle guide lines appear (green)
3. Move cursor to second point
   - Blue spheres show at nearby wall endpoints
   - Green sphere when cursor snaps to endpoint
   - Wall preview snaps to angles
4. Click to place wall
5. Connection prompt appears if near existing wall
6. Choose merge, connect, or keep separate

### Moving Objects

1. Select object with Select Tool
2. Transform gizmo appears (larger, more visible)
3. Drag object
   - Transform feedback shows distance/position
   - Collision warnings appear if overlapping
4. Release to finalize
   - Snaps to grid (0.1m increments)

## 7. Configuration Constants

```typescript
SNAP_DISTANCE = 0.3 // meters
ANGLE_SNAP_THRESHOLD = 5 // degrees
SNAP_ANGLES = [0, 45, 90, 135, 180, 225, 270, 315] // degrees
CONNECTION_THRESHOLD = 0.3 // meters
GRID_SIZE = 0.1 // meters
```

## 8. Visual Feedback Summary

| Feature            | Color     | Shape          | Animation   |
| ------------------ | --------- | -------------- | ----------- |
| Wall Endpoint Snap | Blue      | Sphere (0.15m) | Static      |
| Active Snap        | Green     | Sphere (0.2m)  | Pulsing     |
| Angle Guide        | Green     | Line           | Static      |
| Start Point        | Blue      | Cylinder       | Static      |
| Collision Warning  | Red       | Sphere + Ring  | Pulsing     |
| Transform Gizmo    | RGB (XYZ) | Arrows/Rings   | Interactive |

## 9. Performance Considerations

- **Throttling**: Snap detection throttled in pointer move handlers
- **Memoization**: Collision checks memoized for selected elements
- **Conditional Rendering**: Visual indicators only shown when relevant
- **Frameloop**: Canvas frameloop optimized (demand mode when not dragging)

## 10. Future Enhancements

Potential improvements:

- Multi-wall selection and batch connection
- Snap to wall surfaces (not just endpoints)
- Magnetic snapping with spring animation
- Snap history/undo for connections
- Custom snap distance per object type
- Snap preview ghost objects
- Audio feedback for snaps
- Snap statistics (snap count, types used)

## 11. Testing

### Manual Testing Checklist

- [x] Wall-to-wall endpoint snapping works
- [x] Angle snapping to standard angles
- [x] Connection prompt appears after placing near wall
- [x] Merge functionality combines collinear walls
- [x] Connect functionality links walls
- [x] Transform controls visible and functional
- [x] Collision detection identifies overlaps
- [x] Visual indicators appear correctly
- [x] No console errors
- [x] Performance acceptable

## 12. Troubleshooting

### Snap Points Not Appearing

- Check SNAP_DISTANCE constant
- Verify wall has endpoints calculated
- Ensure building state is loaded

### Connection Prompt Not Showing

- Check CONNECTION_THRESHOLD
- Verify canConnect() returns true
- Ensure both elements are walls

### Collision Warning Always Showing

- Check if elements are properly connected
- Verify bounding box calculations
- Review CONNECTION_THRESHOLD

## Conclusion

The snapping and transform enhancement system provides professional-grade CAD-like functionality for the 3D Building Viewer. Users can now create precise, connected building models with visual feedback at every step. The system is extensible, performant, and follows established UI/UX patterns from industry-standard CAD software.
