# CMS API Documentation

Complete reference for all REST API endpoints. Base URL: `http://localhost:8080/api`

---

## Components

### GET /components
**Purpose:** Retrieve all active components (excludes soft-deleted ones)

**Request:**
```
GET /api/components
```

**Response:** `200 OK`
```json
[
  {
    "id": "uuid",
    "name": "Hero",
    "description": "Full-width hero section",
    "schema": "{...}",
    "hooks": {
      "BEFORE_SAVE": "groovy script",
      "AFTER_FETCH": "groovy script"
    },
    "rendererSource": "jsx code (optional)",
    "createdAt": "2025-04-11T10:30:00",
    "updatedAt": "2025-04-11T10:30:00",
    "deletedAt": null
  }
]
```

---

### GET /components/deleted
**Purpose:** Retrieve all soft-deleted components (for restoration)

**Request:**
```
GET /api/components/deleted
```

**Response:** `200 OK`
```json
[
  {
    "id": "uuid",
    "name": "OldComponent",
    "description": "This was deleted",
    "schema": "{...}",
    "hooks": {},
    "rendererSource": null,
    "createdAt": "2025-04-10T10:30:00",
    "updatedAt": "2025-04-10T10:30:00",
    "deletedAt": "2025-04-11T15:45:30"
  }
]
```

---

### GET /components/{id}
**Purpose:** Retrieve a specific component by ID

**Request:**
```
GET /api/components/5ba5fb2c-ef14-463d-94e5-0d9c97b87050
```

**Response:** `200 OK`
```json
{
  "id": "5ba5fb2c-ef14-463d-94e5-0d9c97b87050",
  "name": "Hero",
  "description": "Full-width hero section",
  "schema": "{\"headline\": \"string\"}",
  "hooks": {},
  "rendererSource": null,
  "createdAt": "2025-04-11T10:30:00",
  "updatedAt": "2025-04-11T10:30:00",
  "deletedAt": null
}
```

**Error:** `404 Not Found` if component doesn't exist or is deleted

---

### POST /components
**Purpose:** Create a new component

**Request:**
```
POST /api/components
Content-Type: application/json

{
  "name": "CustomCard",
  "description": "A reusable card component",
  "schema": "{\"title\": \"string\", \"image\": \"url\"}",
  "hooks": {
    "BEFORE_SAVE": "// validation logic"
  },
  "rendererSource": "export default function..."
}
```

**Response:** `201 Created`
```json
{
  "id": "new-uuid",
  "name": "CustomCard",
  "description": "A reusable card component",
  "schema": "{\"title\": \"string\", \"image\": \"url\"}",
  "hooks": {
    "BEFORE_SAVE": "// validation logic"
  },
  "rendererSource": "export default function...",
  "createdAt": "2025-04-11T10:30:00",
  "updatedAt": "2025-04-11T10:30:00",
  "deletedAt": null
}
```

**Error:** `400 Bad Request` if component with that name already exists

---

### PUT /components/{id}
**Purpose:** Update an existing component

**Request:**
```
PUT /api/components/5ba5fb2c-ef14-463d-94e5-0d9c97b87050
Content-Type: application/json

{
  "name": "Hero",
  "description": "Updated description",
  "schema": "{...}",
  "hooks": {
    "BEFORE_SAVE": "updated groovy code"
  },
  "rendererSource": "updated jsx"
}
```

**Response:** `200 OK`
```json
{
  "id": "5ba5fb2c-ef14-463d-94e5-0d9c97b87050",
  "name": "Hero",
  "description": "Updated description",
  "schema": "{...}",
  "hooks": {
    "BEFORE_SAVE": "updated groovy code"
  },
  "rendererSource": "updated jsx",
  "createdAt": "2025-04-11T10:30:00",
  "updatedAt": "2025-04-11T11:00:00",
  "deletedAt": null
}
```

---

### DELETE /components/{id}
**Purpose:** Soft-delete a component (marks as deleted, doesn't remove from DB)

**Request:**
```
DELETE /api/components/5ba5fb2c-ef14-463d-94e5-0d9c97b87050
```

**Response:** `204 No Content`

---

### PUT /components/{id}/restore
**Purpose:** Restore a soft-deleted component

**Request:**
```
PUT /api/components/5ba5fb2c-ef14-463d-94e5-0d9c97b87050/restore
```

**Response:** `200 OK`
```json
{
  "id": "5ba5fb2c-ef14-463d-94e5-0d9c97b87050",
  "name": "Hero",
  "description": "Full-width hero section",
  "schema": "{...}",
  "hooks": {},
  "rendererSource": null,
  "createdAt": "2025-04-11T10:30:00",
  "updatedAt": "2025-04-11T10:30:00",
  "deletedAt": null
}
```

---

### POST /components/sync
**Purpose:** Auto-discover and seed components from the filesystem (called by frontend on startup)

**Request:**
```
POST /api/components/sync
Content-Type: application/json

{
  "components": [
    {
      "name": "Hero",
      "description": "Full-width hero section",
      "schema": "{...}"
    }
  ]
}
```

**Response:** `200 OK`

---

### POST /components/{id}/execute
**Purpose:** Execute the ON_REQUEST hook for a component (custom logic)

**Request:**
```
POST /api/components/5ba5fb2c-ef14-463d-94e5-0d9c97b87050/execute
Content-Type: application/json

{
  "context": {
    "userId": "user-123",
    "name": "John"
  }
}
```

**Response:** `200 OK`
```json
{
  "result": "value from ON_REQUEST hook",
  "customField": "any data returned by the hook"
}
```

---

## Pages

### GET /pages
**Purpose:** Retrieve all active pages

**Request:**
```
GET /api/pages
```

**Response:** `200 OK`
```json
[
  {
    "id": "uuid",
    "name": "Home",
    "slug": "/",
    "blocks": "[{\"id\": \"uuid\", \"columns\": [...]}]",
    "createdAt": "2025-04-11T10:30:00",
    "updatedAt": "2025-04-11T10:30:00"
  }
]
```

---

### GET /pages/{id}
**Purpose:** Retrieve a specific page and execute AFTER_FETCH hook

**Request:**
```
GET /api/pages/abc-def-123
```

**Response:** `200 OK`
```json
{
  "id": "abc-def-123",
  "name": "Home",
  "slug": "/",
  "blocks": "[{\"id\": \"uuid\", \"componentName\": \"Hero\", \"columns\": [...]}]",
  "createdAt": "2025-04-11T10:30:00",
  "updatedAt": "2025-04-11T10:30:00"
}
```

**Note:** The AFTER_FETCH hook of each component is executed before returning

---

### POST /pages
**Purpose:** Create a new page

**Request:**
```
POST /api/pages
Content-Type: application/json

{
  "name": "About",
  "slug": "/about",
  "blocks": "[{\"id\": \"uuid\", \"columns\": [{\"componentName\": \"Hero\", \"data\": \"{...}\"}]}]"
}
```

**Response:** `201 Created`
```json
{
  "id": "new-uuid",
  "name": "About",
  "slug": "/about",
  "blocks": "[...]",
  "createdAt": "2025-04-11T10:30:00",
  "updatedAt": "2025-04-11T10:30:00"
}
```

**Error:** `400 Bad Request` if slug already exists

---

### PUT /pages/{id}
**Purpose:** Update a page and execute BEFORE_SAVE, AFTER_SAVE hooks

**Request:**
```
PUT /api/pages/abc-def-123
Content-Type: application/json

{
  "name": "About Us",
  "slug": "/about",
  "blocks": "[...]"
}
```

**Response:** `200 OK`
```json
{
  "id": "abc-def-123",
  "name": "About Us",
  "slug": "/about",
  "blocks": "[...]",
  "createdAt": "2025-04-11T10:30:00",
  "updatedAt": "2025-04-11T11:00:00"
}
```

**Note:** BEFORE_SAVE and AFTER_SAVE hooks for each component are executed

---

### DELETE /pages/{id}
**Purpose:** Delete a page permanently

**Request:**
```
DELETE /api/pages/abc-def-123
```

**Response:** `204 No Content`

---

### POST /pages/{id}/preview
**Purpose:** Render a page without saving it to database (for preview functionality)

**Request:**
```
POST /api/pages/abc-def-123/preview
Content-Type: application/json

{
  "name": "Draft Page",
  "slug": "/draft",
  "blocks": "[...]"
}
```

**Response:** `200 OK`
```json
{
  "html": "<div>rendered page html</div>",
  "blocks": "[...]"
}
```

---

## Content Entries

Content entries are individual content pieces for a specific component. For example, if you have a "BlogPost" component, each blog post is a content entry.

### GET /components/{componentId}/entries
**Purpose:** Retrieve all content entries for a component

**Request:**
```
GET /api/components/5ba5fb2c-ef14-463d-94e5-0d9c97b87050/entries
```

**Response:** `200 OK`
```json
[
  {
    "id": "entry-uuid-1",
    "componentId": "5ba5fb2c-ef14-463d-94e5-0d9c97b87050",
    "data": "{\"title\": \"First Post\", \"body\": \"...content...\"}",
    "createdAt": "2025-04-11T10:30:00",
    "updatedAt": "2025-04-11T10:30:00"
  }
]
```

---

### GET /components/{componentId}/entries/{id}
**Purpose:** Retrieve a specific content entry and execute AFTER_FETCH hook

**Request:**
```
GET /api/components/5ba5fb2c-ef14-463d-94e5-0d9c97b87050/entries/entry-uuid-1
```

**Response:** `200 OK`
```json
{
  "id": "entry-uuid-1",
  "componentId": "5ba5fb2c-ef14-463d-94e5-0d9c97b87050",
  "data": "{\"title\": \"First Post\", \"body\": \"...content...\"}",
  "createdAt": "2025-04-11T10:30:00",
  "updatedAt": "2025-04-11T10:30:00"
}
```

---

### POST /components/{componentId}/entries
**Purpose:** Create a new content entry and execute BEFORE_SAVE, AFTER_SAVE hooks

**Request:**
```
POST /api/components/5ba5fb2c-ef14-463d-94e5-0d9c97b87050/entries
Content-Type: application/json

{
  "data": "{\"title\": \"New Post\", \"body\": \"...content...\"}"
}
```

**Response:** `201 Created`
```json
{
  "id": "new-entry-uuid",
  "componentId": "5ba5fb2c-ef14-463d-94e5-0d9c97b87050",
  "data": "{\"title\": \"New Post\", \"body\": \"...content...\"}",
  "createdAt": "2025-04-11T10:30:00",
  "updatedAt": "2025-04-11T10:30:00"
}
```

---

### PUT /components/{componentId}/entries/{id}
**Purpose:** Update a content entry and execute BEFORE_SAVE, AFTER_SAVE hooks

**Request:**
```
PUT /api/components/5ba5fb2c-ef14-463d-94e5-0d9c97b87050/entries/entry-uuid-1
Content-Type: application/json

{
  "data": "{\"title\": \"Updated Post\", \"body\": \"...updated content...\"}"
}
```

**Response:** `200 OK`
```json
{
  "id": "entry-uuid-1",
  "componentId": "5ba5fb2c-ef14-463d-94e5-0d9c97b87050",
  "data": "{\"title\": \"Updated Post\", \"body\": \"...updated content...\"}",
  "createdAt": "2025-04-11T10:30:00",
  "updatedAt": "2025-04-11T11:00:00"
}
```

---

### DELETE /components/{componentId}/entries/{id}
**Purpose:** Delete a content entry permanently

**Request:**
```
DELETE /api/components/5ba5fb2c-ef14-463d-94e5-0d9c97b87050/entries/entry-uuid-1
```

**Response:** `204 No Content`

---

## Error Responses

All endpoints return errors in this format:

### 400 Bad Request
```json
{
  "error": "Validation failed",
  "message": "Component with name 'Hero' already exists"
}
```

### 404 Not Found
```json
{
  "error": "Not found",
  "message": "Component not found: 5ba5fb2c-ef14-463d-94e5-0d9c97b87050"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error",
  "message": "Groovy script validation failed: syntax error"
}
```

---

## Hook Execution Flow

When you create/update content or pages, hooks execute in this order:

### On Create/Update:
1. **BEFORE_SAVE** — validate and transform data
2. **Database persist**
3. **AFTER_SAVE** — side effects (webhooks, indexing, etc.)

### On Fetch:
1. **Database retrieve**
2. **AFTER_FETCH** — hydrate, enrich data

### On Page Request:
- **ON_REQUEST** hook executes with custom context

---

## Notes for API Consumers

- **Soft Deletes:** Components and entries marked `deletedAt IS NOT NULL` are automatically filtered out from GET requests
- **Timestamps:** All timestamps are ISO-8601 format in UTC
- **UUIDs:** All IDs are UUID v4
- **Content Format:** `blocks`, `data`, and `schema` fields are JSON strings, not objects
- **Authentication:** Currently no auth required (add JWT/OAuth in production)
- **CORS:** Configured for frontend on `localhost:5173`

---

*Last updated: 2025-04-11*
