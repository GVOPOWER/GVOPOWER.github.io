# Planning Guide

A game morning event management tool for schools that helps organizers manage checklists, participant groups, attendance tracking, and event notes in one streamlined interface.

**Experience Qualities**:
1. **Efficient** - Quick access to all essential functions without unnecessary navigation or complexity
2. **Organized** - Clear visual separation between different management areas (checklists, groups, attendance, notes)
3. **Practical** - Focused on real-world event coordination needs with straightforward interactions

**Complexity Level**: Light Application (multiple features with basic state)
  - Multiple interconnected features (checklists, groups, attendance, notes) that work together to manage a single event, with persistent state across sessions

## Essential Features

### Checklist Management
- **Functionality**: Create, complete, and delete preparation tasks for the game morning
- **Purpose**: Track all necessary preparations before and during the event
- **Trigger**: User clicks "Add Item" button in checklist section
- **Progression**: Click add → Enter task text → Press enter or save → Item appears in list → Click checkbox to mark complete → Click delete to remove
- **Success criteria**: Tasks persist between sessions, completed items are visually distinct, and users can quickly add/remove items

### Group Management
- **Functionality**: Create teams/groups with names and assign participants
- **Purpose**: Organize students into game teams for the morning activities
- **Trigger**: User clicks "Add Group" button
- **Progression**: Click add group → Enter group name → Add participant names to group → View all groups with their members → Edit or delete groups as needed
- **Success criteria**: Groups persist, multiple participants per group, clear visual distinction between groups

### Attendance Tracking
- **Functionality**: Mark participants as present or absent with visual indicators
- **Purpose**: Keep track of who attended the game morning for administrative records
- **Trigger**: User clicks on participant name or checkbox in attendance view
- **Progression**: View participant list → Click to toggle present/absent status → See visual confirmation of status change → View attendance summary
- **Success criteria**: All participants from groups appear in attendance list, status changes are immediate and persistent

### Notes/Report Section
- **Functionality**: Add timestamped notes and observations during the event
- **Purpose**: Document important moments, issues, or highlights from the game morning
- **Trigger**: User clicks "Add Note" button
- **Progression**: Click add note → Enter text in textarea → Save → Note appears with timestamp → View all notes chronologically → Delete notes if needed
- **Success criteria**: Notes are timestamped, ordered chronologically, persist between sessions

## Edge Case Handling

- **Empty States**: Show helpful placeholder text with icons when no items/groups/notes exist yet, guiding users to add their first entry
- **Duplicate Names**: Allow duplicate participant or group names as different teams might use common names
- **Data Persistence**: All data automatically saves using useKV, ensuring no data loss on page refresh
- **Long Lists**: Use scroll areas for long lists of participants or notes to maintain clean layout
- **Quick Actions**: Provide keyboard shortcuts (Enter to save) for faster data entry during busy event moments

## Design Direction

The design should feel organized, calm, and purposeful - like a well-prepared teacher's planner. A clean, structured interface with clear sections and generous spacing helps users focus on one task at a time without feeling overwhelmed during the busy game morning.

## Color Selection

Triadic color scheme to visually distinguish different sections (checklist, groups, attendance, notes) while maintaining harmony.

- **Primary Color**: Deep Blue (oklch(0.45 0.15 250)) - Conveys trust, organization, and professionalism appropriate for educational settings
- **Secondary Colors**: 
  - Warm Teal (oklch(0.65 0.12 200)) for groups section - Collaborative and team-oriented
  - Soft Purple (oklch(0.55 0.12 290)) for attendance tracking - Calm and methodical
- **Accent Color**: Vibrant Orange (oklch(0.68 0.18 45)) - Energetic and playful, perfect for game morning theme, used for CTAs and highlights
- **Foreground/Background Pairings**:
  - Background (White oklch(0.98 0 0)): Dark text oklch(0.2 0 0) - Ratio 13.5:1 ✓
  - Card (Light Gray oklch(0.96 0 0)): Dark text oklch(0.2 0 0) - Ratio 12.8:1 ✓
  - Primary (Deep Blue oklch(0.45 0.15 250)): White text oklch(0.98 0 0) - Ratio 8.2:1 ✓
  - Secondary (Warm Teal oklch(0.65 0.12 200)): Dark text oklch(0.2 0 0) - Ratio 5.1:1 ✓
  - Accent (Orange oklch(0.68 0.18 45)): Dark text oklch(0.2 0 0) - Ratio 5.8:1 ✓
  - Muted (Light Gray oklch(0.94 0 0)): Muted text oklch(0.5 0 0) - Ratio 4.9:1 ✓

## Font Selection

Clean, highly legible sans-serif typography that feels modern and organized, using Inter for its excellent readability and professional appearance in educational tools.

- **Typographic Hierarchy**:
  - H1 (Section Titles): Inter Semibold/24px/tight letter-spacing for main sections
  - H2 (Group Names): Inter Medium/18px/normal spacing for subsection headers
  - Body (Items/Names): Inter Regular/15px/relaxed line-height for comfortable reading
  - Small (Timestamps/Meta): Inter Regular/13px/muted color for supporting information
  - Button Text: Inter Medium/14px for clear action labels

## Animations

Subtle and purposeful animations that provide feedback without slowing down the user during event management - quick confirmations rather than decorative flourishes.

- **Purposeful Meaning**: Gentle check animations when marking attendance or completing tasks communicate success; smooth height transitions when adding/removing items maintain spatial awareness
- **Hierarchy of Movement**: Primary focus on state changes (checked/unchecked, present/absent) with 150ms micro-interactions; secondary focus on list additions with 200ms fade-ins; minimal page-level animation to keep interactions snappy

## Component Selection

- **Components**: 
  - Tabs (navigation between sections: checklist, groups, attendance, notes)
  - Card (container for each section and individual groups)
  - Checkbox (checklist items and attendance toggles)
  - Input (quick text entry for tasks, names, notes)
  - Button (primary actions with Phosphor icons: Plus, Trash, Users, ClipboardText)
  - ScrollArea (for long lists of participants or notes)
  - Separator (visual division between groups and list items)
  - Badge (participant count indicators, attendance summary)
  
- **Customizations**: 
  - Custom group card component with header and participant list
  - Timestamped note component with formatted date display
  - Attendance list item with visual present/absent indicator (colored dot or icon)
  
- **States**: 
  - Buttons: subtle scale on press, orange accent hover for primary actions
  - Checkboxes: smooth check animation with primary color fill
  - Inputs: focused border with accent color, subtle shadow
  - List items: hover background for better touch/click targeting
  
- **Icon Selection**: 
  - Plus (add items), Trash (delete), Check (complete/present), X (remove/absent)
  - ListChecks (checklist tab), Users (groups tab), ClipboardText (notes tab), UserCheck (attendance tab)
  
- **Spacing**: 
  - Container padding: p-6
  - Card spacing: gap-4 between sections, p-4 within cards
  - List items: gap-2 for compact lists, py-2 for touch targets
  - Section margins: space-y-6 for clear visual separation
  
- **Mobile**: 
  - Tabs remain horizontal but with compact labels on mobile
  - Single column layout for all content
  - Larger touch targets (min 44px) for checkboxes and buttons
  - Bottom-fixed "Add" button on mobile for thumb accessibility
  - ScrollArea with touch-friendly scrolling for long lists
