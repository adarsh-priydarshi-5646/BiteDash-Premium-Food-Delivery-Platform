# API Reference

Complete API documentation for BiteDash food delivery platform.

## Base URL

**Production:** `https://food-delivery-full-stack-app-3.onrender.com`  
**Development:** `http://localhost:8000`

## Authentication

I use JWT tokens stored in httpOnly cookies. After successful login, the token is automatically included in subsequent requests.

## Rate Limiting

API requests are limited to **100 requests per 15 minutes** per IP address.

## Response Format

All responses are in JSON format with appropriate HTTP status codes.

---

## Authentication Endpoints

### Sign Up

**POST** `/api/auth/signup`

Register a new user account.

**Request Body:**
```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "mobile": "1234567890",
  "role": "user"
}
```

**Response:**
```json
{
  "message": "User created successfully",
  "user": {
    "_id": "...",
    "fullName": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

---

### Sign In

**POST** `/api/auth/signin`

Login with email and password.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:** Sets httpOnly cookie and returns user data.

---

### Google OAuth

**POST** `/api/auth/google`

Login or register using Google OAuth.

**Request Body:**
```json
{
  "email": "john@example.com",
  "fullName": "John Doe",
  "profilePic": "https://..."
}
```

---

### Get Current User

**GET** `/api/auth/current`

Get currently authenticated user.

**Authentication:** Required

**Response:** Returns user object or 401 if not authenticated.

---

### Logout

**POST** `/api/auth/logout`

Logout and clear authentication cookie.

**Authentication:** Required

---

## Order Endpoints

### Place Order

**POST** `/api/order/place-order`

Create a new order.

**Authentication:** Required

**Request Body:**
```json
{
  "cartItems": [
    {
      "id": "item_id",
      "name": "Pizza",
      "price": 299,
      "quantity": 2,
      "shop": "shop_id"
    }
  ],
  "paymentMethod": "cod",
  "deliveryAddress": {
    "text": "123 Main St",
    "latitude": 28.6139,
    "longitude": 77.2090
  },
  "totalAmount": 598
}
```

---

### Get My Orders

**GET** `/api/order/my-orders`

Get all orders for authenticated user.

**Authentication:** Required

**Response:** Returns array of orders based on user role (customer/owner/delivery).

---

### Update Order Status

**PUT** `/api/order/status/:orderId/:shopId`

Update order status (owner/delivery only).

**Authentication:** Required

**Request Body:**
```json
{
  "status": "preparing"
}
```

**Valid Status Values:**
- `pending` - Order placed
- `accepted` - Restaurant accepted
- `preparing` - Food being prepared
- `ready` - Ready for pickup
- `out of delivery` - Out for delivery
- `delivered` - Delivered to customer
- `cancelled` - Order cancelled

---

### Verify Delivery OTP

**POST** `/api/order/verify-otp`

Verify delivery with OTP.

**Authentication:** Required (delivery partner)

**Request Body:**
```json
{
  "orderId": "...",
  "shopOrderId": "...",
  "otp": "1234"
}
```

---

### Create Stripe Payment

**POST** `/api/order/create-payment`

Create Stripe checkout session.

**Authentication:** Required

**Request Body:**
```json
{
  "amount": 598,
  "orderId": "..."
}
```

**Response:** Returns Stripe session URL for payment.

---

## Shop Endpoints

### Get Shops by City

**GET** `/api/shop/city/:city`

Get all shops in a specific city.

**Example:** `/api/shop/city/Delhi`

**Response:** Returns array of shops with cached results (5 min TTL).

---

### Create Shop

**POST** `/api/shop/create`

Create a new shop (owner only).

**Authentication:** Required (owner role)

**Request Body:** Multipart form data
```
name: "Pizza Palace"
city: "Delhi"
state: "Delhi"
address: "123 Main Street"
image: [file upload]
```

**Note:** Image is uploaded to Cloudinary automatically.

---

### Update Shop

**PUT** `/api/shop/:id`

Update shop details.

**Authentication:** Required (owner only)

---

### Delete Shop

**DELETE** `/api/shop/:id`

Delete a shop.

**Authentication:** Required (owner only)

---

## Item Endpoints

### Get Items by City

**GET** `/api/item/city/:city`

Get all menu items in a city.

**Query Parameters:**
- `search` - Search by item name
- `category` - Filter by category
- `isVeg` - Filter vegetarian items

**Example:** `/api/item/city/Delhi?search=pizza&isVeg=true`

---

### Create Item

**POST** `/api/item/create`

Add new menu item.

**Authentication:** Required (owner only)

**Request Body:** Multipart form data
```
name: "Margherita Pizza"
price: 299
category: "Pizza"
isVeg: true
shop: "shop_id"
image: [file upload]
```

---

### Update Item

**PUT** `/api/item/:id`

Update menu item.

**Authentication:** Required (owner only)

---

### Delete Item

**DELETE** `/api/item/:id`

Remove menu item.

**Authentication:** Required (owner only)

---

## User Endpoints

### Get Current User

**GET** `/api/user/me`

Get current user profile.

**Authentication:** Required

---

### Update Profile

**PUT** `/api/user/update`

Update user profile.

**Authentication:** Required

**Request Body:**
```json
{
  "fullName": "John Doe",
  "mobile": "1234567890"
}
```

---

### Update Location

**PUT** `/api/user/location`

Update user location (delivery partners).

**Authentication:** Required

**Request Body:**
```json
{
  "latitude": 28.6139,
  "longitude": 77.2090
}
```

**Note:** Location is stored with 2dsphere index for geospatial queries.

---

## Error Handling

### HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `429` - Too Many Requests (rate limit exceeded)
- `500` - Internal Server Error

### Error Response Format

```json
{
  "message": "Error description",
  "error": "Detailed error message"
}
```

### Common Errors

**Authentication Error:**
```json
{
  "message": "Authentication required"
}
```

**Validation Error:**
```json
{
  "message": "Validation failed",
  "errors": [
    "Email is required",
    "Password must be at least 6 characters"
  ]
}
```

**Rate Limit Error:**
```json
{
  "message": "Too many requests, please try again later"
}
```

---

## Real-Time Events (Socket.IO)

I implemented Socket.IO for real-time order tracking and notifications.

### Connection

```javascript
const socket = io('https://food-delivery-full-stack-app-3.onrender.com', {
  withCredentials: true
});
```

### Client → Server Events

- `identity` - Register user connection with userId
- `updateLocation` - Update delivery partner location

### Server → Client Events

- `newOrder` - New order notification (restaurant owners)
- `newAssignment` - New delivery assignment (delivery partners)
- `update-status` - Order status update (customers)
- `updateDeliveryLocation` - Delivery partner location update
- `orderDelivered` - Order delivered notification

---

## Testing the API

You can test the API using tools like Postman or curl.

### Example: Login Request

```bash
curl -X POST https://food-delivery-full-stack-app-3.onrender.com/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

### Example: Get Orders (with authentication)

```bash
curl -X GET https://food-delivery-full-stack-app-3.onrender.com/api/order/my-orders \
  -H "Cookie: token=your_jwt_token"
```

---

## Summary

I built this API to handle all operations for the BiteDash food delivery platform. The API follows REST principles and includes:

- JWT authentication with httpOnly cookies
- Rate limiting for security
- Input validation on all endpoints
- Real-time updates via Socket.IO
- Geospatial queries for delivery assignment
- Payment integration with Stripe
- Image uploads to Cloudinary
- Comprehensive error handling

For more details, visit the [GitHub repository](https://github.com/adarsh-priydarshi-5646/Food-Delivery-Full-Stack-App).
