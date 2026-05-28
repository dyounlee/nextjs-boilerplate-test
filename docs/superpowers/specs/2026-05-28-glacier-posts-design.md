# Glacier Posts Design

## Objective

Apply the Glacier visual system across the entire app and add authenticated post CRUD for logged-in users only.

## Scope

In scope:
- Global Glacier theme across all existing screens
- Logged-in-only post creation, editing, and deletion
- Post listing and post detail views inside the authenticated area
- Plain text post body input and rendering
- Post tags as a simple string array

Out of scope:
- Markdown rendering
- Thumbnail or image upload support
- Public post access for anonymous visitors
- Comments, likes, search, pagination, or slugs

## Product Shape

The app remains a small authenticated Next.js boilerplate, but the protected dashboard becomes the home for the post workflow.

Main user paths:
- Sign in with Google
- View a personal dashboard
- Create a post
- Edit a post
- Delete a post
- View a post detail page

## Visual System

The Glacier theme is the single visual language for the app.

Core traits:
- Frosted, translucent panels
- Soft ice-blue background gradients
- Limited tertiary lavender accents
- Light surfaces with subtle borders
- Hover and focus states that use glow sparingly

Typography:
- Inter remains the app font
- Headings use slightly tighter tracking and stronger weight
- Body copy stays regular and highly legible

Layout:
- The root shell uses a layered background with large radial gradients and a subtle atmospheric overlay
- Content sits on frosted cards rather than opaque blocks
- The dashboard uses compact information density, while forms use more breathing room

## Routes

Existing routes remain, but their styling is updated to match Glacier:
- `/`
- `/login`
- `/error`
- `/dashboard`

New protected post routes:
- `/dashboard/posts/new`
- `/dashboard/posts/[id]`
- `/dashboard/posts/[id]/edit`

Route access rules:
- Anonymous users are redirected to `/login`
- Authenticated users can access dashboard and post routes
- Post actions are additionally restricted to the post author

## Data Model

Add a `Post` model to Prisma:

- `id`
- `title`
- `body`
- `tags: string[]`
- `authorId`
- `createdAt`
- `updatedAt`

Relationships:
- `Post.authorId` references `User.id`

Notes:
- Tags are stored as a string array to keep the schema simple
- Body stays plain text, not Markdown
- The title and body are required

## Authorization

Only logged-in users can create posts.

Only the author of a post can edit or delete it.

Authorization checks happen on the server before any database mutation.

## UI Structure

### Dashboard

The dashboard becomes the center of the post workflow.

It shows:
- A welcome header
- A “New Post” action
- A list of the current user’s posts
- Per-post edit and delete actions

Each post card shows:
- Title
- Short body preview
- Tags
- Last updated timestamp

### New and Edit Forms

The create and edit screens reuse the same form structure.

Fields:
- Title input
- Body textarea
- Tags input as comma-separated values

Behavior:
- Edit mode is prefilled with the existing post
- Submit buttons use the same Glacier button treatment
- Validation errors appear inline near the field that caused them

### Detail View

The detail page is a read-only presentation inside the protected area.

It shows:
- Title
- Tags
- Body
- Author metadata
- Edit/Delete actions when the viewer is the author

## Server Actions

Post mutations are handled with server actions.

Actions:
- `createPost`
- `updatePost`
- `deletePost`

Each action:
- Reads the current session on the server
- Rejects unauthenticated requests
- Validates input
- Verifies ownership for update and delete
- Returns a redirect or field-level error state

## Validation

Validation rules:
- `title` must be non-empty and trimmed
- `body` must be non-empty and trimmed
- `tags` are optional but normalized into an array of trimmed non-empty strings

Normalization rules:
- Empty tags are removed
- Duplicate tags are collapsed
- Tag casing is preserved as entered

## Error Handling

Expected failures are handled explicitly.

Cases:
- Missing session redirects to `/login`
- Unauthorized edit/delete returns a safe “not allowed” state
- Missing post returns a not-found state
- Invalid form data returns inline field errors
- Database errors should surface as a generic failure message instead of raw stack traces

The existing `/error` page remains available for auth failures.

## Styling Implementation

Update the app shell and shared components to use the Glacier palette.

Targets:
- `src/app/globals.css`
- `src/app/layout.tsx`
- `src/components/ui/button.tsx`
- post cards and post forms
- auth pages and dashboard pages

The style implementation should preserve readability and avoid overusing blur or transparency on text-heavy surfaces.

## Testing

Add tests for:
- Auth env fallback behavior
- Post ownership checks
- Post creation/update/delete server actions
- Tag normalization
- Protected route redirects

Keep visual regressions low-risk by using the existing component tests where possible.

## Non-Goals

This iteration does not add:
- Image uploads
- External storage
- Markdown formatting
- Public blog SEO pages
- Advanced search or filtering

