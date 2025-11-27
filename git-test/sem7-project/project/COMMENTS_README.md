# Nested Comments System

This project now includes a comprehensive nested comment system that can be easily integrated into any page or component. The system supports unlimited nesting levels, likes, editing, deleting, and real-time updates.

## Features

- ✅ **Nested Replies**: Unlimited depth comment threading
- ✅ **Like/Unlike**: Users can like and unlike comments
- ✅ **Edit Comments**: Users can edit their own comments
- ✅ **Delete Comments**: Users can delete their own comments
- ✅ **Collapse/Expand**: Comment threads can be collapsed and expanded
- ✅ **Real-time Updates**: Comment counts update in real-time
- ✅ **Responsive Design**: Works on all screen sizes
- ✅ **Dark Mode Support**: Automatically adapts to your app's theme
- ✅ **User Authentication**: Respects user permissions for editing/deleting

## Quick Start

### 1. Import the CommentsSection Component

```jsx
import CommentsSection from './components/CommentsSection';
```

### 2. Add to Your Component

```jsx
function MyPage() {
  return (
    <div>
      <h1>My Blog Post</h1>
      <p>This is my blog post content...</p>
      
      {/* Add comments section */}
      <CommentsSection 
        postId="unique-post-id" 
        title="Comments" 
      />
    </div>
  );
}
```

### 3. Backend Setup

Make sure your backend API is running. The comment system expects the following endpoints:

- `GET /api/posts/:postId` - Get post with comments
- `POST /api/posts/:postId/comments` - Create new comment
- `PUT /api/comments/:id` - Update comment
- `DELETE /api/comments/:id` - Delete comment
- `POST /api/likes/toggle` - Toggle comment like

## Components Overview

### CommentsSection
The main component that orchestrates the entire comment system.

**Props:**
- `postId` (string, required): Unique identifier for the post/content
- `title` (string, optional): Title for the comments section (default: "Comments")

### Comment
Individual comment component with all interactive features.

### CommentForm
Form component for creating and editing comments.

### CommentList
Container component that renders a list of comments.

### IconBtn
Reusable button component for comment actions (like, reply, edit, delete).

## File Structure

```
src/
├── components/
│   ├── Comment.js              # Individual comment component
│   ├── CommentForm.js          # Comment creation/editing form
│   ├── CommentList.js          # List of comments
│   ├── CommentsSection.js      # Main comments container
│   ├── IconBtn.js              # Reusable icon button
│   ├── CommentsDemo.js         # Demo page showing all features
│   └── comments.css            # Styles for comment components
├── hooks/
│   └── useAsync.js             # Async state management hook
└── services/
    ├── api.js                  # HTTP request utility
    └── comments.js             # Comment-related API calls
```

## Configuration

### Environment Variables

Create a `.env` file in your project root:

```env
REACT_APP_API_URL=http://localhost:3001/api
```

### API Integration

The comment system uses the following API structure:

```javascript
// Create comment
POST /api/posts/:postId/comments
{
  "message": "Comment text",
  "parentId": null, // or parent comment ID for replies
  "user": { "_id": "user123", "name": "User Name" }
}

// Update comment
PUT /api/comments/:id
{
  "message": "Updated comment text",
  "userId": "user123"
}

// Delete comment
DELETE /api/comments/:id
{
  "userId": "user123"
}

// Toggle like
POST /api/likes/toggle
{
  "user": "user123",
  "commentId": "comment456"
}
```

## Styling

The comment system includes comprehensive CSS with support for:

- Light and dark themes
- Responsive design
- Hover effects and transitions
- Nested comment indentation
- Collapsible comment threads

### Customizing Styles

You can customize the appearance by modifying `comments.css` or overriding specific CSS classes:

```css
/* Override comment background */
.comment {
  background: your-custom-color;
  border: your-custom-border;
}

/* Customize button colors */
.btn {
  background: your-primary-color;
}

/* Dark mode customizations */
[data-theme="dark"] .comment {
  background: your-dark-background;
}
```

## Usage Examples

### Basic Usage

```jsx
import CommentsSection from './components/CommentsSection';

function BlogPost({ postId }) {
  return (
    <article>
      <h1>My Blog Post</h1>
      <p>Post content here...</p>
      <CommentsSection postId={postId} />
    </article>
  );
}
```

### With Custom Title

```jsx
<CommentsSection 
  postId="article-123" 
  title="Reader Discussion" 
/>
```

### Multiple Comment Sections

```jsx
function ProductPage({ productId }) {
  return (
    <div>
      <div className="product-info">
        {/* Product details */}
      </div>
      
      {/* Reviews section */}
      <CommentsSection 
        postId={`product-reviews-${productId}`} 
        title="Customer Reviews" 
      />
      
      {/* Q&A section */}
      <CommentsSection 
        postId={`product-qa-${productId}`} 
        title="Questions & Answers" 
      />
    </div>
  );
}
```

## Demo

Visit `/comments-demo` in your application to see a comprehensive demonstration of all comment features.

## Backend Requirements

The comment system requires a backend API that supports:

1. **User Authentication**: Cookie-based or token-based authentication
2. **Comment CRUD Operations**: Create, read, update, delete comments
3. **Nested Comments**: Support for parent-child comment relationships
4. **Like System**: Toggle likes on comments
5. **User Permissions**: Ensure users can only edit/delete their own comments

## Troubleshooting

### Comments Not Loading
- Check that your API server is running
- Verify the `REACT_APP_API_URL` environment variable
- Check browser network tab for API errors

### Styling Issues
- Ensure `comments.css` is imported in your main App component
- Check for CSS conflicts with existing styles
- Verify dark mode data attribute is set correctly

### Authentication Issues
- Ensure user authentication is working
- Check that user data is being passed correctly to the comment system
- Verify API endpoints are protected appropriately

## Contributing

To add new features or modify the comment system:

1. **Adding New Features**: Extend the existing components or create new ones
2. **Styling**: Modify `comments.css` or add new CSS classes
3. **API Integration**: Update `services/comments.js` for new endpoints
4. **State Management**: Extend the state management in `CommentsSection.js`

## License

This comment system is part of the main project and follows the same license terms.