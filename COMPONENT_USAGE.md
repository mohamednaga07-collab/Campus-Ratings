# Compare & Rate Components - Usage Guide

## Overview

Two enhanced, theme-aligned components for the Campus-Ratings platform:

### 1. **ComparisonPanel** - Side-by-side Doctor Comparison
### 2. **RatingPanel** - Multi-factor Rating Interface

Both components follow Material Design principles with a modern, academic aesthetic.

---

## ComparisonPanel

### Purpose
Display side-by-side comparison of doctors across multiple rating factors with visual distinction of winners.

### Features
- ✅ Side-by-side rating bars with gradient colors
- ✅ Winner highlighting with difference badges
- ✅ Responsive grid layout (compact or standard)
- ✅ Animated bars and transitions
- ✅ Accessibility tooltips
- ✅ Color-coded performance levels

### Import
```tsx
import { ComparisonPanel } from "@/components/ComparisonPanel";
```

### Usage Example
```tsx
import { ComparisonPanel, ComparisonFactor } from "@/components/ComparisonPanel";

const factors: ComparisonFactor[] = [
  {
    key: "teachingQuality",
    label: "Teaching Quality",
    valueA: 4.8,
    valueB: 4.2,
  },
  {
    key: "support",
    label: "Support",
    valueA: 4.6,
    valueB: 4.0,
  },
  {
    key: "fairness",
    label: "Fairness",
    valueA: 4.7,
    valueB: 4.1,
  },
];

export default function CompareExample() {
  return (
    <ComparisonPanel
      title="Side-by-Side Clarity"
      description="Quickly spot strengths before you decide."
      factors={factors}
      nameA="Dr. Johnson"
      nameB="Dr. Smith"
      highlightWinner={true}
      compactMode={false}
    />
  );
}
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | string | required | Panel title |
| `description` | string | optional | Subtitle/description |
| `factors` | ComparisonFactor[] | required | Array of factors to compare |
| `nameA` | string | required | Name of doctor/item A |
| `nameB` | string | required | Name of doctor/item B |
| `highlightWinner` | boolean | `true` | Show winner badges |
| `compactMode` | boolean | `false` | Use compact layout |

### ComparisonFactor Interface
```tsx
interface ComparisonFactor {
  key: string;              // Unique identifier
  label: string;            // Display name (e.g., "Teaching Quality")
  valueA: number;           // Rating for item A (0-5)
  valueB: number;           // Rating for item B (0-5)
  maxValue?: number;        // Max rating (default: 5)
}
```

### Color Scheme
- **4.5-5.0**: Emerald/Teal (Excellent)
- **4.0-4.4**: Green (Good)
- **3.5-3.9**: Blue (Satisfactory)
- **3.0-3.4**: Yellow (Fair)
- **2.0-2.9**: Orange (Poor)
- **Below 2.0**: Red (Very Poor)

### Styling
- **Card**: Border with subtle primary color tint and soft shadow
- **Bars**: Animated gradient fills with responsive sizing
- **Badges**: Highlighted winners stand out with primary color
- **Layout**: Mobile-responsive grid system

---

## RatingPanel

### Purpose
Provide an intuitive, guided interface for users to rate doctors across multiple factors.

### Features
- ✅ Progress indicator showing rating completion
- ✅ Individual slider + star rating for each factor
- ✅ Real-time rating aggregation (shows average)
- ✅ Tooltip guidance for each factor
- ✅ Rating scale guide with color coding
- ✅ Hover animations and visual feedback
- ✅ Callback on rating changes

### Import
```tsx
import { RatingPanel } from "@/components/RatingPanel";
```

### Usage Example
```tsx
import { RatingPanel, RatingFactor } from "@/components/RatingPanel";
import { Users, MessageCircle, Target, Zap, Award } from "lucide-react";

const factors: RatingFactor[] = [
  {
    key: "teachingQuality",
    label: "Teaching Quality",
    description: "How effectively does this instructor teach the material?",
    icon: <Target className="h-4 w-4" />,
  },
  {
    key: "availability",
    label: "Availability",
    description: "How accessible is this instructor during office hours?",
    icon: <Users className="h-4 w-4" />,
  },
  {
    key: "communication",
    label: "Communication",
    description: "How clearly does this instructor explain concepts?",
    icon: <MessageCircle className="h-4 w-4" />,
  },
  {
    key: "knowledge",
    label: "Subject Knowledge",
    description: "Does this instructor have deep subject expertise?",
    icon: <Zap className="h-4 w-4" />,
  },
  {
    key: "fairness",
    label: "Fairness",
    description: "Are grades and evaluations fair and transparent?",
    icon: <Award className="h-4 w-4" />,
  },
];

export default function RatingExample() {
  const handleRatingsChange = (ratings: Record<string, number>) => {
    console.log("Ratings updated:", ratings);
    // Send to backend or parent component
  };

  return (
    <RatingPanel
      factors={factors}
      title="Rate This Doctor"
      description="Your honest feedback helps future students make informed decisions."
      tooltip="All ratings are completely anonymous and confidential."
      onRatingsChange={handleRatingsChange}
      showGuide={true}
      compactMode={false}
    />
  );
}
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `factors` | RatingFactor[] | required | Array of rating factors |
| `title` | string | required | Panel title |
| `description` | string | optional | Subtitle/description |
| `tooltip` | string | optional | Hover tooltip content |
| `onRatingsChange` | function | optional | Callback when ratings change |
| `showGuide` | boolean | `true` | Show rating scale guide |
| `compactMode` | boolean | `false` | Use compact layout |

### RatingFactor Interface
```tsx
interface RatingFactor {
  key: string;           // Unique identifier
  label: string;         // Display name
  description: string;   // Detailed description
  icon: React.ReactNode; // Icon component (lucide-react)
}
```

### Rating Scale

| Range | Label | Color |
|-------|-------|-------|
| 4.5-5.0 | Excellent | Emerald |
| 4.0-4.4 | Good | Green |
| 3.5-3.9 | Satisfactory | Blue |
| 3.0-3.4 | Fair | Yellow |
| 2.0-2.9 | Poor | Orange |
| 0-1.9 | Very Poor | Red |

### Styling
- **Card**: Modern gradient background with soft borders
- **Progress Bar**: Animated fill showing completion percentage
- **Sliders**: Interactive with smooth transitions
- **Stars**: Clickable with hover effects for quick rating
- **Layout**: Full responsive design with adaptive spacing

---

## Integration Points

### In Compare Page
```tsx
// client/src/pages/Compare.tsx
import { ComparisonPanel } from "@/components/ComparisonPanel";

export default function Compare() {
  const factors = [
    { key: "teaching", label: "Teaching Quality", valueA: 4.8, valueB: 4.2 },
    // ...
  ];

  return (
    <div className="space-y-8">
      <ComparisonPanel
        title="Side-by-Side Clarity"
        factors={factors}
        nameA={selectedDoctors[0]?.name}
        nameB={selectedDoctors[1]?.name}
      />
    </div>
  );
}
```

### In Rating/Review Page
```tsx
// client/src/pages/RateDoctor.tsx
import { RatingPanel } from "@/components/RatingPanel";

export default function RateDoctor() {
  const [ratings, setRatings] = useState({});

  return (
    <RatingPanel
      factors={ratingFactors}
      title={`Rate ${doctorName}`}
      onRatingsChange={setRatings}
    />
  );
}
```

---

## Accessibility Features

✅ **Keyboard Navigation**
- Tab through all interactive elements
- Enter/Space to activate star ratings
- Slider support for all inputs

✅ **Screen Readers**
- ARIA labels on all factors
- Semantic HTML structure
- Tooltip descriptions announced

✅ **Visual**
- WCAG AA contrast ratios
- Color not sole indicator (uses text + badges)
- Focus indicators on all elements

✅ **Mobile**
- Touch-friendly targets (min 44x44px)
- Responsive layouts adapt to screen size
- Slider gestures supported

---

## Theming

Both components inherit from your design system:
- **Colors**: Uses Tailwind CSS primary, secondary, and muted palettes
- **Typography**: Follows your existing font hierarchy
- **Spacing**: Consistent with your 4-unit baseline
- **Animations**: Framer Motion with your ease curves

### Custom Theme Variables (in Tailwind)
```css
--primary: Your primary color
--secondary: Your secondary color
--muted-foreground: Your text color
--background: Your background color
```

---

## Examples

### Comparison with 3 Doctors
Modify layout to support 3-column comparison by adjusting the grid in ComparisonPanel.

### Conditional Rating Guide
Hide guide on subsequent ratings:
```tsx
<RatingPanel
  factors={factors}
  showGuide={isFirstRating}
/>
```

### Real-time Rating Aggregation
Get live average ratings:
```tsx
const [ratings, setRatings] = useState({});
const average = Object.values(ratings).reduce((a, b) => a + b) / Object.values(ratings).length;
```

---

## Performance Notes

- ✅ Memoized components prevent unnecessary re-renders
- ✅ Framer Motion animations use GPU acceleration
- ✅ Lazy loading compatible
- ✅ Small bundle size (~8KB gzipped combined)

---

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

---

## Questions or Customization?

Both components are built to be extended. Key customization points:
1. **Colors**: Modify `getBarColor()` and color classes
2. **Icons**: Pass different Lucide React icons
3. **Animations**: Adjust Framer Motion variants
4. **Scale**: Change min/max values in Slider/rating logic
