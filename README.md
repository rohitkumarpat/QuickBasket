# 🛒 QuickBasket

**QuickBasket** is a full-stack grocery delivery platform that provides a complete online grocery shopping and delivery experience. Users can browse products, manage their cart, place orders, track deliveries in real time, and communicate with delivery partners.

The platform includes dedicated workflows for **Customers, Delivery Partners, and Admins**, with real-time updates powered by Socket.io and live map tracking using Leaflet.

## ✨ Features

### 👤 Customer

* Secure authentication with NextAuth
* Browse grocery products
* Product search and shopping cart
* Complete checkout and order placement
* Cash on Delivery and online payment support
* View order history and order status
* Real-time delivery status updates
* Live delivery location tracking
* View assigned delivery partner
* AI-powered chat using Gemini API
* Responsive UI for desktop and mobile

### 🚴 Delivery Partner

* Delivery partner authentication
* View available delivery assignments
* Receive new delivery assignments in real time
* Accept or reject delivery orders
* Update delivery status
* Share live location
* Real-time communication with customers
* View customer delivery details

### 🛠️ Admin

* Admin dashboard
* View and manage customer orders
* Update order status
* Assign nearby delivery partners
* Monitor delivery assignments
* View assigned delivery partner details
* Manage grocery products
* Real-time order status updates

## 🏗️ Architecture

QuickBasket follows a **full-stack Next.js architecture** with MongoDB as the primary database and Socket.io for real-time communication.

```text
                         ┌──────────────────────┐
                         │       Customer       │
                         │      Web Client      │
                         └──────────┬───────────┘
                                    │
                                    │ HTTPS / REST
                                    ▼
┌──────────────────┐       ┌──────────────────────┐
│      Admin       │──────▶│     Next.js App      │
│   Dashboard      │       │   App Router/API     │
└──────────────────┘       └──────────┬───────────┘
                                      │
┌──────────────────┐                  │
│ Delivery Partner │──────────────────┤
│     Dashboard    │                  │
└────────┬─────────┘                  │
         │                            │
         │ Socket.io                  │
         ▼                            ▼
┌──────────────────┐        ┌──────────────────────┐
│  Real-Time      │        │      MongoDB         │
│ Socket Server   │        │                      │
│                 │        │ Users                │
│ • Assignments   │        │ Products             │
│ • Locations     │        │ Orders               │
│ • Chat          │        │ Assignments          │
│ • Notifications │        │                      │
└────────┬─────────┘        └──────────────────────┘
         │
         ▼
┌──────────────────┐
│     Leaflet      │
│   Live Maps      │
└──────────────────┘


```

### Request Flow

```text
Customer
   │
   ▼
Next.js Frontend
   │
   ▼
Next.js API Routes
   │
   ├── Authentication ──▶ NextAuth
   │
   ├── Orders ───────────▶ MongoDB
   │
   ├── Products ─────────▶ MongoDB
   │
   └── Delivery ─────────▶ Delivery Assignment
                                  │
                                  ▼
                              Socket.io
                                  │
                    ┌─────────────┴─────────────┐
                    ▼                           ▼
             Delivery Partner              Customer
                    │                           │
                    └──────────┬────────────────┘
                               ▼
                         Live Location
                               │
                               ▼
                            Leaflet
```

## 🔄 Delivery Workflow

```text
Customer places order
        │
        ▼
Admin receives order
        │
        ▼
Admin changes status
to "Out for Delivery"
        │
        ▼
Find nearby available
delivery partners
        │
        ▼
Broadcast assignment
through Socket.io
        │
        ▼
Delivery partner accepts
        │
        ▼
Assignment → Assigned
        │
        ▼
Delivery partner ID saved
to the order
        │
        ▼
Customer sees assigned
delivery partner
        │
        ▼
Live location tracking
        │
        ▼
Order delivered
```

## ⚡ Real-Time Architecture

Socket.io is used for real-time communication between customers, delivery partners, and the application.

### Real-Time Events

* `new-delivery-assignment`
* `order-status-updated`
* `update-delivery-boy-location`
* `new-order`
* `new-delivery-assignment`
* `send-message`

This allows the application to update delivery assignments, order status, location, and chat without repeatedly refreshing the page.

## 🗺️ Live Delivery Tracking

QuickBasket uses **Leaflet** for map visualization and **Socket.io** for real-time location updates.

```text
Delivery Partner
       │
       │ GPS Location
       ▼
Socket.io
       │
       ▼
Backend
       │
       ▼
Customer Dashboard
       │
       ▼
Leaflet Map
       │
       ▼
Live Delivery Marker
```

## 🤖 AI Integration

QuickBasket includes an AI-powered chat feature using the **Google Gemini API**.

The AI functionality is used for communication between customers and delivery partners, providing an integrated conversational experience inside the platform.

## 🛠️ Tech Stack

### Frontend

* Next.js
* React
* TypeScript
* Tailwind CSS
* Framer Motion
* Leaflet

### Backend

* Next.js App Router
* Next.js API Routes
* Node.js
* Socket.io

### Database

* MongoDB
* Mongoose

### Authentication

* NextAuth

### AI

* Google Gemini API

### Real-Time Communication

* Socket.io

### Maps

* Leaflet
* React Leaflet

### Deployment

* Vercel

## 📂 Project Structure

```text
QuickBasket/
│
├── app/
│   ├── api/
│   │   ├── admin/
│   │   ├── delivery/
│   │   ├── user/
│   │   └── chat/
│   │
│   ├── component/
│   ├── frontend/
│   │   ├── admin/
│   │   ├── delivery/
│   │   └── user/
│   │
│   ├── lib/
│   ├── model/
│   └── ...
│
├── public/
│
├── socket-server/
│
├── package.json
├── next.config.js
└── README.md
```

## 🔐 Environment Variables

Create a `.env.local` file:

```env
MONGODB_URI=your_mongodb_connection_string

NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000

GEMINI_API_KEY=your_gemini_api_key

# Add your Socket.io server URL if required
NEXT_PUBLIC_SOCKET_URL=your_socket_server_url
```

Do not commit `.env.local` to GitHub.

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/rohitkumarpat/QuickBasket.git
cd QuickBasket
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create:

```text
.env.local
```

and add the required credentials.

### 4. Start the development server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## 🌐 Deployment

QuickBasket is deployed using **Vercel**.

Deployment flow:

```text
GitHub Repository
       │
       ▼
     Vercel
       │
       ▼
Production Build
       │
       ▼
QuickBasket
```

## 🔒 Security

* Session-based authentication
* Protected API routes
* Role-based access for Admin and Delivery Partner functionality
* Environment variables for sensitive credentials
* Server-side database operations
* Authentication checks before protected operations

## 📌 Key Highlights

* Full-stack grocery delivery workflow
* Customer, Admin, and Delivery Partner dashboards
* Real-time order and delivery updates
* Live delivery location tracking
* Delivery assignment system based on nearby delivery partners
* AI-powered communication
* MongoDB-based order and product management
* Responsive and animated user interface
* Production deployment with Vercel

## 📸 Demo

**Live Demo:**
https://quick-basket-nine.vercel.app

**GitHub:**
https://github.com/rohitkumarpat/QuickBasket

## 👨‍💻 Author

**Rohit Kumar**

Computer Science & Engineering
IIIT Nagpur

* GitHub: https://github.com/rohitkumarpat
* LinkedIn: https://linkedin.com/in/rohit-singh-aba9ab282/
