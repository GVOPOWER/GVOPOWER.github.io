# Planning Guide

A game morning event management tool for schools that helps organizers manage checklists, participant groups, attendance tracking, and event notes through a collaborative multi-user interface with authentication and group-based permissions.

**Experience Qualities**:
1. **Collaborative** - Users can create groups, invite others, and manage game morning activities together
2. **Organized** - Sidebar navigation for groups with clear tab-based sections for different management areas
3. **Secure** - Login system with group ownership and invitation-based access control

**Complexity Level**: Light Application (multiple features with basic state)
  - Multiple interconnected features (login, groups, checklists, attendance, notes, invitations) with user authentication, group permissions, and persistent state across sessions

## Essential Features

### User Authentication
- **Functionality**: Simple username-based login system to identify users
- **Purpose**: Enable multi-user collaboration and group ownership tracking
- **Trigger**: User visits the app without being logged in
- **Progression**: Enter username → Click login → Access group management interface
- **Success criteria**: Username persists between sessions, users can log out and switch accounts

### Group Management (Sidebar)
- **Functionality**: Create groups, view owned/member groups, invite users, switch between groups
- **Purpose**: Organize multiple game morning events and control access to each
- **Trigger**: User clicks "Groep Maken" button in sidebar
- **Progression**: Enter group name → Create group → Group appears in sidebar → Click group to select → Invite button → Enter username → Send invitation
- **Success criteria**: Groups persist, clear visual indication of selected group, owner badge displayed, groups can be deleted by owner

### Invitation System
- **Functionality**: Send and receive group invitations, accept or decline access requests
- **Purpose**: Allow group owners to invite collaborators to help manage game morning events
- **Trigger**: Group owner clicks "Uitnodigen" on a group card
- **Progression**: Enter invitee username → Send invitation → Invitee sees notification badge → Opens invitations tab → Accept/Decline → Becomes group member on accept
- **Success criteria**: Invitation count badge visible, invitations persist, accepted invitations add user to group members, declined invitations are marked

### Checklist Management
- **Functionality**: Create, complete, and delete preparation tasks per group
- **Purpose**: Track necessary preparations before and during the event for each specific group
- **Trigger**: User selects a group and clicks "Add Item" in checklist tab
- **Progression**: Select group → Click add → Enter task text → Press enter → Item appears → Check to complete → Delete to remove
- **Success criteria**: Tasks are group-specific, persist between sessions, completed items visually distinct

### Attendance Tracking
- **Functionality**: Mark participants as present or absent with visual indicators
- **Purpose**: Keep track of who attended the game morning for administrative records
- **Trigger**: User clicks on participant name or checkbox in attendance view
- **Progression**: View participant list → Click to toggle present/absent status → See visual confirmation of status change → View attendance summary
- **Success criteria**: All participants from groups appear in attendance list, status changes are immediate and persistent

### Notes/Report Section
- **Functionality**: Add timestamped notes and observations per group during the event
- **Purpose**: Document important moments, issues, or highlights from the game morning
- **Trigger**: User selects group and clicks "Add Note" button
- **Progression**: Select group → Click add note → Enter text → Save → Note appears with timestamp → View chronologically → Delete if needed
- **Success criteria**: Notes are group-specific, timestamped, ordered chronologically, persist between sessions

## Edge Case Handling

- **Empty States**: Show helpful placeholder text with icons when no groups/items/notes exist, guiding users to create first entry
- **Unauthenticated Access**: Show login screen when user is not logged in, block all features until authenticated
- **No Group Selected**: Show welcome message prompting user to select or create a group from sidebar
- **Duplicate Usernames**: Allow duplicate participant names within groups, but usernames for login/invitations are case-sensitive
- **Invalid Invitations**: Prevent self-invitations, allow duplicate invitations (user can receive multiple invites to same group)
- **Group Deletion**: When owner deletes group, automatically deselect if currently selected
- **Data Isolation**: All checklists and notes are scoped to specific groups, users only see data for groups they're members of
- **Persistent Sessions**: User login state, group memberships, and all data automatically save using useKV

## Design Direction

The design should feel collaborative yet organized - like a shared digital workspace for event planning. A clean sidebar for navigation combined with focused content areas helps users manage multiple groups while maintaining clarity about which event they're currently working on.

## Color Selection

Triadic color scheme to visually distinguish different sections while maintaining harmony, with added emphasis on user identity and group ownership.

- **Primary Color**: Deep Blue (oklch(0.45 0.15 250)) - Conveys trust, organization, and professionalism appropriate for educational settings
- **Secondary Colors**: 
  - Warm Teal (oklch(0.65 0.12 200)) for groups section - Collaborative and team-oriented
  - Soft Purple (oklch(0.55 0.12 290)) for attendance tracking - Calm and methodical
- **Accent Color**: Vibrant Orange (oklch(0.68 0.18 45)) - Energetic and playful, perfect for game morning theme, used for CTAs, selected states, and owner badges
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
  - H1 (Page Titles): Inter Semibold/24px/tight letter-spacing for selected group name
  - H2 (Section Headers): Inter Semibold/20px for tab section headers
  - H3 (Group Names): Inter Medium/16px for sidebar group cards
  - Body (Items/Names): Inter Regular/15px/relaxed line-height for comfortable reading
  - Small (Timestamps/Meta): Inter Regular/13px/muted color for supporting information
  - Button Text: Inter Medium/14px for clear action labels
  - Badge Text: Inter Medium/12px for counts and status indicators

## Animations

Purposeful animations that provide immediate feedback for collaborative actions - quick confirmations for invitations, group selections, and state changes.

- **Purposeful Meaning**: Smooth group selection transitions in sidebar; gentle check animations for attendance/tasks; notification badge pulse for new invitations; fade-in for invitation cards
- **Hierarchy of Movement**: Primary focus on navigation (group switching 200ms); secondary on state changes (check/uncheck 150ms); tertiary on list updates (fade 200ms); no page-level animations to keep collaborative workflows snappy

## Component Selection

- **Components**: 
  - Sidebar (custom component for group navigation and user profile)
  - Tabs (content sections: checklist, attendance, notes, invitations)
  - Card (login form, group cards in sidebar, content containers, invitation cards)
  - Input (username entry, group creation, task/note entry, participant invitation)
  - Button (create group, logout, accept/decline invitations, CRUD actions)
  - Badge (participant counts, member counts, invitation notification counter, owner crown icon)
  - ScrollArea (sidebar group list, long content lists)
  - Separator (visual division in cards)
  
- **Customizations**: 
  - Custom sidebar with fixed width (320px), user profile header, logout button
  - Group cards with selection state (accent border/background when selected)
  - Invitation cards with dual-action buttons (accept/decline)
  - Login page with centered card layout
  - Notification badge with count on invitations tab
  - Owner badge (crown icon) on group cards
  
- **States**: 
  - Buttons: scale on press, accent hover for primary actions, destructive color for logout/delete
  - Group cards: distinct selected state with accent colors, hover for unselected
  - Inputs: focused border with accent, keyboard shortcuts (Enter to submit)
  - Tabs: notification badge for pending invitations
  
- **Icon Selection**: 
  - User (login/profile), SignOut (logout), Crown (group owner)
  - Plus (create/add), Trash (delete), UserPlus (invite)
  - ListChecks (checklist), UserCheck (attendance), ClipboardText (notes), Envelope (invitations)
  - Check (accept), X (decline)
  
- **Spacing**: 
  - Sidebar: p-4 sections, gap-2 for group cards
  - Main content: max-w-4xl container, p-8 vertical, p-4 horizontal
  - Cards: p-3 for sidebar cards, p-4 for content cards
  - Form elements: gap-2 for inline inputs/buttons
  
- **Mobile**: 
  - Sidebar collapses or becomes drawer on mobile (<768px)
  - Tabs remain horizontal with icon-only labels on mobile
  - Single column layout for all content
  - Larger touch targets (min 44px) for all interactive elements
  - Fixed position for primary action buttons on mobile
