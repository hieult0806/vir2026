# Procedural Fish Animation - Technical Documentation

This document explains the mathematical approach used to create realistic procedurally animated fish.

## Three Core Components

### 1. The Spine (Distance Constraints)

**Implementation:** `Segment.follow()` and angle constraints in `update()`

```javascript
// Distance constraint - each segment maintains fixed length
follow(targetX, targetY) {
    const dx = targetX - this.point.x;
    const dy = targetY - this.point.y;
    const angle = Math.atan2(dy, dx);

    // Maintain fixed distance from target
    this.point.x = targetX - Math.cos(angle) * this.length;
    this.point.y = targetY - Math.sin(angle) * this.length;
}
```

**Angle Constraints:** Prevents unrealistic folding

```javascript
// Limit maximum bend between segments
if (Math.abs(angleDiff) > this.maxAngleDelta) {
    curr.angle = prev.angle + Math.sign(angleDiff) * this.maxAngleDelta;
}
```

**Result:** Chain of points that follow each other smoothly while maintaining natural flexibility.

---

### 2. The Body Outline (Parametric Equations)

**Mathematical Formula:**
- `x = r × cos(θ)`
- `y = r × sin(θ)`

**Implementation:** Using perpendicular offset from spine

```javascript
for (let i = 0; i < segments.length; i++) {
    const seg = segments[i];
    const perpAngle = seg.angle + Math.PI / 2;  // 90° rotation
    const width = seg.width;  // Variable radius r

    // Left side of fish
    leftPoints[i] = {
        x: seg.point.x + Math.cos(perpAngle) * width,
        y: seg.point.y + Math.sin(perpAngle) * width
    };

    // Right side of fish
    rightPoints[i] = {
        x: seg.point.x - Math.cos(perpAngle) * width,
        y: seg.point.y - Math.sin(perpAngle) * width
    };
}
```

**Variable Radius:** Creates fish silhouette

```javascript
getSegmentWidth(t) {
    if (t < 0.2) {
        return 12 + 8 * (t / 0.2);        // Rounded head
    } else if (t < 0.7) {
        return 20 - 5 * ((t - 0.2) / 0.5); // Thick body
    } else {
        return 15 * (1 - (t - 0.7) / 0.3); // Tapered tail
    }
}
```

**Result:** Smooth fish outline with proper proportions.

---

### 3. Responsive Fins (Curvature Math)

**Total Curvature Calculation:**

```javascript
getTotalCurvature() {
    let totalCurvature = 0;
    for (let i = 1; i < segments.length; i++) {
        let angleDiff = segments[i].angle - segments[i - 1].angle;

        // Normalize to -π to π
        while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
        while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;

        totalCurvature += Math.abs(angleDiff);
    }
    return totalCurvature;
}
```

**Fin Offsets Based on Curvature:**

```javascript
// Dorsal fin adjusts based on total curvature
const finOffset = curvature * 8;
const finTipX = finBaseX + Math.cos(perpAngle) * (18 + finOffset);
const finTipY = finBaseY + Math.sin(perpAngle) * (18 + finOffset);
```

**Result:** Fins flare out when fish turns sharply, creating realistic movement.

---

## The Update Loop

Each frame follows this sequence:

1. **Move the head** (anchor point)
   ```javascript
   segments[0].point.x += velocityX;
   segments[0].point.y += velocityY;
   ```

2. **Update spine chain** using FABRIK
   ```javascript
   for (let i = 1; i < segments.length; i++) {
       segments[i].follow(segments[i-1].getEndPoint());
   }
   ```

3. **Apply angle constraints**
   ```javascript
   // Prevent sharp bends
   if (Math.abs(angleDiff) > maxAngleDelta) {
       curr.angle = prev.angle + sign(angleDiff) * maxAngleDelta;
   }
   ```

4. **Calculate total curvature**
   ```javascript
   const curvature = getTotalCurvature();
   ```

5. **Calculate body outline** using parametric offsets
   ```javascript
   leftPoints[i] = point + cos(perpAngle) * width;
   rightPoints[i] = point - cos(perpAngle) * width;
   ```

6. **Render fins** with curvature-based offsets
   ```javascript
   drawDorsalFin(ctx, curvature);
   drawPectoralFins(ctx, curvature);
   drawTailFin(ctx);
   ```

---

## Key Mathematical Concepts

### Distance Constraints
- **Vector normalization:** `unit_vector = vector / magnitude`
- **Distance maintenance:** `position = target - unit_vector * length`

### Parametric Circle Equations
- **Perpendicular vector:** Add π/2 to angle
- **Left/Right offset:** ±cos(θ) and ±sin(θ)

### Angle Normalization
- **Wrap to [-π, π]:** Essential for smooth rotation
- **Clamping:** `min(max(value, min), max)` for constraints

### Curvature Calculation
- **Sum of angular differences:** Σ|θᵢ - θᵢ₋₁|
- **Absolute value:** Total bend regardless of direction

---

## Performance Optimizations

1. **Canvas-based rendering** instead of SVG for 60fps
2. **Segment count:** 12 segments = smooth curve without overhead
3. **Minimal calculations:** Only compute what's visible
4. **Request animation frame:** Browser-optimized timing

---

## Result

A completely procedural fish that:
- ✅ Follows targets smoothly
- ✅ Maintains realistic body shape
- ✅ Prevents unrealistic bending
- ✅ Has responsive fins that react to movement
- ✅ Uses no keyframe animation
- ✅ Runs at 60fps with multiple fish

All movement is **algorithmically computed** based on simple mathematical constraints!
