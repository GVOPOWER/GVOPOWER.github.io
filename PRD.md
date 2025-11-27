# Planning Guide

A game morning event management tool for schools that helps organizers manage checklists with executor tracking, participant groups with custom roles, date-based attendance tracking, and event notes with file attachments through a collaborative multi-user interface with email/password authentication, user profiles with photos, and group-based permissions.

**Experience Qualities**:
1. **Secure** - Email/password authentication system with unique username validation prevents duplicate accounts, persistent login state across sessions
2. **Collaborative** - Users can create groups, assign roles to participants, create custom roles, invite others, track task executors, and manage game morning activities together
3. **Organized** - Sidebar navigation with profile photo for groups with clear tab-based sections including dedicated profile page for managing invitations and personal settings

**Complexity Level**: Light Application (multiple features with basic state)
  - Multiple interconnected features (email/password authentication with persistent login, groups with settings dialog, participant custom roles, checklists with executor tracking, date-based attendance, notes with file attachments, invitations, profile management with photo upload, display name editing) with user authentication, group permissions, and persistent state across sessions

## Essential Features

### User Authentication with Email & Password
- **Functionality**: Secure account creation and login system with email and password validation, persistent login state
- **Purpose**: Enable multi-user collaboration with secure access control and unique user identification that survives page refreshes
- **Trigger**: User visits the app without being logged in
- **Progression**: Enter email and password → Choose Register or Login → Validate credentials → Access group management interface → Login state persists on refresh
- **Success criteria**: Email addresses are unique (case-insensitive), passwords minimum 6 characters, accounts persist between sessions, login state persists on page refresh, users can log out and switch accounts, successful login shows toast notification

### Profile Management Page with Photo & Display Name
- **Functionality**: Dedicated profile page showing user profile photo, editable display name, email, pending invitations with accept/decline actions, and overview of owned and member groups
- **Purpose**: Centralized location for users to manage their identity, invitations, and group memberships
- **Trigger**: User clicks Profile tab or clicks their profile photo in sidebar
- **Progression**: View profile → Upload profile photo (max 5MB) → Edit display name → See pending invitations → Accept/Decline invitations → View owned groups and member groups
- **Success criteria**: Profile photo upload works with image files under 5MB, photo displays in sidebar and profile page, display name can be edited inline, all pending invitations visible, accept/decline actions work immediately, groups categorized by ownership vs membership

### Group Management with Settings Dialog
- **Functionality**: Create groups, access group settings via gear icon, view owned/member groups, invite users by email, manage members, create custom roles, switch between groups
- **Purpose**: Organize multiple game morning events and control access, roles, and members for each group
- **Trigger**: User clicks "Groep Maken" button in sidebar or gear icon on existing group
- **Progression**: Enter group name → Create group → Group appears in sidebar → Click gear icon → Open settings dialog → Invite users → Add/remove members → Create custom roles with colors → Manage group
- **Success criteria**: Groups persist, settings dialog accessible via gear icon for owners only, clear visual indication of selected group, owner badge displayed, groups can be deleted by owner, email-based invitations, member management in settings, custom roles with color pickers

### Participant Role Management with Custom Roles
- **Functionality**: Assign standard roles (Deelnemer, Leider, Organisator) and custom roles to each participant with visual role indicators including colored badges
- **Purpose**: Define participant responsibilities with flexible custom roles beyond the standard hierarchy
- **Trigger**: User adds participant or selects role dropdown
- **Progression**: Create custom role in group settings → Add participant → Select standard role → Optionally select custom role → Both role types displayed with visual indicators → Change roles as needed
- **Success criteria**: Three standard role types available, unlimited custom roles can be created with names and colors, custom roles displayed as colored badges, role changes persist, visual indicators (icons, colors, badges) clearly distinguish roles

### Checklist with Executor Tracking
- **Functionality**: Create, complete, and delete preparation tasks per group, assign multiple executors to each task from group members
- **Purpose**: Track necessary preparations and accountability by recording who executed each task
- **Trigger**: User selects a group and clicks "Add Item" in checklist tab or executor icon on task
- **Progression**: Select group → Click add → Enter task text → Press enter → Item appears → Click executor icon → Select members who executed it → Multiple executors shown as badges → Check to complete → Delete to remove
- **Success criteria**: Tasks are group-specific, multiple executors can be assigned per task, executors displayed as badges below task, executor assignment persists, completed items visually distinct

### Date-based Attendance Tracking
- **Functionality**: Create multiple attendance dates and mark participant presence/absence per specific date
- **Purpose**: Track attendance across multiple game morning sessions with historical records
- **Trigger**: User adds date in attendance tab
- **Progression**: Select date → Add date → Date appears in list → Select date → Mark participants present/absent → Attendance saved for that specific date
- **Success criteria**: Multiple dates can be created, each date has independent attendance records, dates are selectable, attendance persists per date, visual summary shows present/total counts

### Notes with File Attachments
- **Functionality**: Add timestamped notes with optional file attachments (max 5MB per file)
- **Purpose**: Document observations with supporting files like photos, documents, or reports
- **Trigger**: User clicks "Bestand Toevoegen" or "Notitie Toevoegen"
- **Progression**: Enter note text → Optionally select files → Files shown with name and size → Submit note → Note appears with attachments → Click attachment to download
- **Success criteria**: Files under 5MB accepted, multiple files per note supported, file metadata (name, size) displayed, files downloadable, notes with only attachments (no text) allowed

### Invitation System
- **Functionality**: Send and receive group invitations, accept or decline access requests
- **Purpose**: Allow group owners to invite collaborators to help manage game morning events
- **Trigger**: Group owner clicks "Uitnodigen" on a group card
- **Progression**: Enter invitee username → Send invitation → Invitee sees notification badge → Opens invitations tab → Accept/Decline → Becomes group member on accept
- **Success criteria**: Invitation count badge visible, invitations persist, accepted invitations add user to group members, declined invitations are marked

### Checklist Management
- **Functionality**: Create, complete, and delete preparation tasks per group with executor tracking
- **Purpose**: Track necessary preparations before and during the event for each specific group with accountability
- **Trigger**: User selects a group and clicks "Add Item" in checklist tab
- **Progression**: Select group → Click add → Enter task text → Press enter → Item appears → Assign executors → Check to complete → Delete to remove
- **Success criteria**: Tasks are group-specific, executors can be assigned, persist between sessions, completed items visually distinct

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
- **Persistent Sessions**: User login state, profile data, group memberships, and all data automatically save using useKV and persist across page refreshes

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
  - User (login/profile), SignOut (logout), Crown (group owner), Camera (photo upload), Pencil (edit name)
  - Plus (create/add), Trash (delete), UserPlus (invite), Gear (group settings), UserCheck (executor assignment)
  - ListChecks (checklist), UserCheck (attendance), ClipboardText (notes), Envelope (invitations)
  - Check (accept), X (decline/remove)
  
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
