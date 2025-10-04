# Moni-Aari - Traditional Aari Work & Custom Embroidery

A fully responsive, luxury embroidery website showcasing traditional Aari work and custom embroidery services.

## Features

- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Multiple Pages**: Home, Portfolio, Services, About, Contact, and Login/Signup
- **Authentication System**: LocalStorage-based user authentication
- **Telegram Integration**: Order notifications and auth tracking via Telegram bots
- **Smooth Animations**: Fade-in effects and scroll-based animations
- **Luxury Design**: Elegant color palette with ivory background, dark red accents, and gold highlights

## Tech Stack

- Pure HTML5
- CSS3 (with custom properties and animations)
- Vanilla JavaScript (no frameworks)
- Google Fonts (Playfair Display & Inter)

## Color Palette

- Background: `#fffaf3` (Soft Ivory)
- Primary Accent: `#A60000` (Rich Dark Red)
- Secondary Accent: `#D4AF37` (Elegant Gold)
- Text: Charcoal Gray / Dark Brown

## Pages

1. **Home (index.html)**: Hero section with call-to-action and feature highlights
2. **Portfolio (portfolio.html)**: Showcase of 8+ embroidery projects with images
3. **Services (services.html)**: 10+ embroidery services with pricing
4. **About (about.html)**: Company story, mission, values, and process
5. **Contact (contact.html)**: Order form with Telegram integration
6. **Login (login.html)**: Authentication page with login/signup functionality

## Setup & Deployment

### Local Development

1. Clone or download the repository
2. Open `index.html` in a web browser
3. Or use a local server:
   ```bash
   npm install
   npm run dev
   ```

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` folder.

### Deployment

This website is ready to deploy on:
- **GitHub Pages**: Push to a GitHub repository and enable Pages
- **Netlify**: Drag and drop the project folder or connect via Git
- **Vercel**: Import the project and deploy

## Features Overview

### Authentication
- Signup with name, email, and password
- Login with email and password
- LocalStorage-based session management
- Logout functionality
- Protected contact form (login required)

### Telegram Integration
- Order submissions sent to Telegram
- Login attempts tracked
- New signups notified

### Animations
- Fade-in effects on page load
- Scroll-based animations
- Smooth hover transitions
- Mobile menu animations

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Project Structure

```
moni-aari/
├── index.html
├── portfolio.html
├── services.html
├── about.html
├── contact.html
├── login.html
├── assets/
│   ├── css/
│   │   └── style.css
│   └── js/
│       └── script.js
├── package.json
└── README.md
```

## License

© 2025 Moni-Aari. All rights reserved.
