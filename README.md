# Own Bazar - Modern E-Commerce Platform

A full-stack dropshipping website built with **Next.js 14**, **TypeScript**, **Tailwind CSS**, **PostgreSQL**, **Prisma ORM**, and **Stripe**.

## 🚀 Features

- **Product Management**: Browse, search, and filter products by category
- **Shopping Cart**: Add/remove items, manage quantities, real-time calculations
- **User Authentication**: Register, login, and user profile management
- **Stripe Integration**: Secure payment processing with webhook support
- **Order Management**: Place orders, track status, payment history
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Admin Dashboard**: Manage products, orders, and inventory
- **Database**: PostgreSQL with Prisma ORM for type-safe queries
- **API**: RESTful APIs for all major operations

## 📋 Prerequisites

- **Node.js** 18+ and npm
- **PostgreSQL** database
- **Stripe** account (for payment processing)
- A code editor (VS Code recommended)

## 🛠️ Installation

### 1. Clone and Setup
```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Update .env.local with your credentials
```

### 2. Database Setup
```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Open Prisma Studio (optional)
npm run db:studio
```

### 3. Environment Variables

Update your `.env.local` file with:

```
DATABASE_URL="postgresql://user:password@localhost:5432/dropshipping_store"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXTAUTH_SECRET=your_secret_key
NEXTAUTH_URL=http://localhost:3000
```

## 🚀 Running the Project

### Development
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build & Production
```bash
npm run build
npm run start
```

## 📁 Project Structure

```
src/
├── app/
│   ├── api/              # API routes
│   │   ├── products/     # Product endpoints
│   │   ├── cart/         # Shopping cart
│   │   ├── orders/       # Order management
│   │   ├── auth/         # Authentication
│   │   └── stripe/       # Payment webhook
│   ├── products/         # Product pages
│   ├── cart/             # Cart page
│   ├── auth/             # Auth pages
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home page
├── components/           # Reusable components
│   ├── Header.tsx
│   └── Footer.tsx
├── lib/                  # Utility functions
├── styles/               # Global styles
│   └── globals.css
└── types/                # TypeScript types

prisma/
└── schema.prisma         # Database schema

public/                   # Static assets
```

## 🗄️ Database Models

### Core Models
- **User**: Customer accounts and authentication
- **Product**: Product catalog with inventory
- **Cart**: Shopping cart management
- **Order**: Order tracking and history
- **OrderItem**: Individual items in orders

### Enums
- **OrderStatus**: PENDING, CONFIRMED, PROCESSING, SHIPPED, DELIVERED, CANCELLED
- **PaymentStatus**: PENDING, COMPLETED, FAILED, REFUNDED

## 🔐 Security Features

- Password hashing with bcryptjs
- JWT token authentication
- Secure Stripe payment processing
- CORS headers configured
- Environment variable protection
- SQL injection prevention with Prisma

## 💳 Payment Integration

Stripe integration handles:
- Secure payment processing
- Card tokenization
- Webhook for payment notifications
- Refund management
- PCI compliance

## 🎨 Styling

Built with **Tailwind CSS** featuring:
- Mobile-first responsive design
- Custom color scheme
- Utility-first approach
- Dark mode ready

## 📝 API Endpoints

### Products
- `GET /api/products` - List products
- `GET /api/products?category=Electronics` - Filter by category
- `GET /api/products?search=headphones` - Search products
- `POST /api/products` - Create product (admin)

### Cart
- `GET /api/cart?userId=123` - Get user cart
- `POST /api/cart` - Create/update cart

### Orders
- `GET /api/orders?userId=123` - Get user orders
- `POST /api/orders` - Create new order

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user

### Payments
- `POST /api/stripe/webhook` - Handle Stripe webhooks

## 🧪 Testing

```bash
# Run linting
npm run lint

# Build for production
npm run build
```

## 📦 Dependencies

- **Next.js 14**: React framework with App Router
- **TypeScript**: Type safety
- **Tailwind CSS**: Utility-first CSS
- **Prisma**: ORM for database
- **PostgreSQL**: Relational database
- **Stripe**: Payment processing
- **Next-Auth**: Authentication
- **bcryptjs**: Password hashing
- **jsonwebtoken**: JWT tokens
- **axios**: HTTP client
- **zod**: Schema validation

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Docker
```bash
docker build -t dropship-store .
docker run -p 3000:3000 dropship-store
```

## 📚 Documentation

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [Stripe Documentation](https://stripe.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## 🐛 Troubleshooting

### Database Connection Issues
```bash
# Check PostgreSQL is running
# Update DATABASE_URL in .env.local
# Run: npm run db:push
```

### Stripe Integration Issues
- Verify webhook secret is correct
- Check API keys in .env.local
- Test with Stripe Test Mode

### Build Errors
- Clear `.next` folder: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Rebuild: `npm run build`

## 📄 License

This project is open source and available under the MIT License.

## 👨‍💻 Contributing

Contributions are welcome! Please feel free to submit issues and enhancement requests.

## 📧 Support

For support, email ai.gamer.ff99@gmail.com or call +92 330 1958546

---

**Happy coding! 🎉**
