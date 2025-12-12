# 🛍️ Mini Marketplace

A modern, responsive Single Page Application (SPA) for browsing products and managing shopping cart.

## 👤 Developer Information

**Name:** Mini Marketplace Project

**Development Time:** 2-3 hours

**Libraries Used:**
- React 19.2.0
- Next.js 16.0.3
- Redux Toolkit 2.10.1 (State Management)
- Axios 1.13.2 (API Calls)
- Tailwind CSS 4 (Styling)
- TypeScript 5
- React Spinners 0.17.0 (Loading States)

## 🚀 Features

### ✅ Completed Functionality

1. **Product List View**
   - Displays all products from [FakeStoreAPI](https://fakestoreapi.com/products)
   - Product cards show: name, price, image, rating, and "Add to Cart" button
   - Category filtering functionality
   - Responsive grid layout (4 columns desktop, 2 columns tablet, 1 column mobile)

2. **Product Details**
   - Individual product view with full details
   - Quantity selector
   - Add to cart functionality
   - Responsive design

3. **Shopping Cart**
   - Add products to cart
   - Remove products from cart
   - Update product quantity (+/- buttons)
   - Display total number of products
   - Display total price (sum of all items)
   - Cart badge in header shows item count
   - Clear entire cart option

4. **State Persistence**
   - Cart state persisted in localStorage
   - Cart data survives page refreshes

5. **Responsive Design**
   - Two-column layout on desktop (Products + Cart summary)
   - Stacked layout on mobile devices
   - Hover and active states for interactive elements
   - Modern gradient design with smooth transitions

6. **Technical Implementation**
   - React components with proper separation of concerns
   - Redux for state management
   - localStorage for cart persistence
   - TypeScript for type safety
   - Flex/Grid layouts throughout

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation Steps

1. **Clone the repository**
```bash
git clone <repository-url>
cd e-commerce
```

2. **Install dependencies**
```bash
npm install
```

3. **Run the development server**
```bash
npm run dev
```

4. **Open in browser**
```
http://localhost:3000
```

## 📦 Build for Production

```bash
npm run build
npm start
```

## 🏗️ Project Structure

```
e-commerce/
├── app/
│   ├── page.tsx                    # Main products page
│   ├── cart/
│   │   └── page.tsx               # Shopping cart page
│   ├── products/
│   │   └── [id]/
│   │       └── page.tsx           # Product details page
│   ├── layout.tsx                 # Root layout
│   └── globals.css                # Global styles
├── components/
│   ├── header.tsx                 # Header component
│   └── ui/
│       ├── product-card.tsx       # Product card component
│       ├── providers.tsx          # Redux provider
│       └── toast-provider.tsx     # Toast notifications
├── lib/
│   ├── api.ts                     # API functions
│   ├── store.ts                   # Redux store & slices
│   └── types.ts                   # TypeScript types
└── public/                        # Static assets
```

## 🎨 Design Features

- Modern gradient backgrounds (blue to purple theme)
- Card-based UI with shadow effects
- Smooth hover animations and transitions
- Responsive navigation with mobile menu
- Toast notifications for user feedback
- Loading spinners for async operations

## 🌐 API Integration

Data is fetched from the [Fake Store API](https://fakestoreapi.com):
- `GET /products` - Fetch all products
- `GET /products/{id}` - Fetch single product
- `GET /products/categories` - Fetch categories

## 📱 Responsive Breakpoints

- Mobile: < 768px (1 column)
- Tablet: 768px - 1023px (2 columns)
- Desktop: 1024px+ (3-4 columns)

## 🔄 State Management

Redux Toolkit is used for centralized state management:
- **Cart State**: Items, quantities, and product details
- **LocalStorage Sync**: Automatic persistence of cart data

## 💾 Data Persistence

The shopping cart uses localStorage to persist data:
- Cart items saved on every change
- Data restored on page load
- Survives browser refresh and close/reopen

## 🎯 User Experience

- Instant feedback with toast notifications
- Loading indicators for async operations
- Smooth page transitions
- Intuitive cart management
- Mobile-first responsive design

## 📄 License

This project is created as a test assignment.

---

**Live Demo:** (Add your deployment URL here)

**Repository:** (Add your GitHub repository URL here)
