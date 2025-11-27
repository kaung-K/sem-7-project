# Healthcare Facts Applicationn

A modern React application featuring a facts page with medical experts, photos, and subscription functionality.

## Features

### Facts Page (`/facts`)
- **Navigation Bar**: Modern responsive navigation with gradient styling
- **Creator Profiles**: 6 medical experts with:
  - Professional photos (circular, bordered)
  - Names and specialties
  - Subscriber counts
  - Key health facts for each expert
  - Subscribe/Unsubscribe buttons with visual feedback
- **Contact Information**: Comprehensive footer with:
  - Email, phone, and address
  - Quick links to different pages
  - Social media links
  - Copyright information

### Homepage (`/`)
- Hero section with healthcare messaging
- Services showcase
- Recent articles section (with API integration)
- FAQ section
- Responsive design

## Getting Started

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Project Structure

```
src/
├── components/
│   ├── FactsPage.js          # Main facts page with creator profiles
│   ├── FactsPage.css         # Styling for facts page
│   ├── Homepage.js           # Homepage component
│   ├── Homepage.css          # Homepage styling
│   ├── Navbar.js             # Navigation component
│   ├── Navbar.css            # Navigation styling
│   ├── Footer.js             # Footer with contact info
│   └── Footer.css            # Footer styling
├── App.js                    # Main app component with routing
├── App.css                   # App-level styling
├── index.js                  # Application entry point
└── index.css                 # Global styles
```

## Key Features

### Creator Cards
Each creator card includes:
- Professional photo (120px circular with border)
- Name and medical specialty
- Subscriber count
- 3 key health facts
- Interactive subscribe button

### Subscribe Functionality
- Click to subscribe/unsubscribe
- Visual feedback with color changes
- State management for subscription status

### Responsive Design
- Mobile-friendly layout
- Grid system that adapts to screen size
- Touch-friendly buttons and interactions

### Modern Styling
- Gradient backgrounds
- Smooth hover animations
- Card-based layout
- Professional color scheme

## API Integration

The application is set up to integrate with a backend API for articles. The current configuration expects:
- Backend running on `http://localhost:3002`
- Articles endpoint: `/api/article/all`
- Image endpoint: `/api/article/image/{imageUrl}`

## Customization

### Adding More Creators
Edit the `creators` array in `FactsPage.js` to add more medical experts.

### Changing Contact Information
Update the contact details in `Footer.js`.

### Modifying Styles
All CSS files are modular and can be easily customized to match your brand colors and design preferences.

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm run build` - Builds the app for production
- `npm test` - Launches the test runner
- `npm run eject` - Ejects from Create React App (not recommended)

## Technologies Used

- React 18
- React Router DOM
- CSS3 with modern features
- Axios for API calls
- Create React App 