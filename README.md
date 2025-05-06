APTOS COFFEE
![photo_2025-05-06 11 29 04](https://github.com/user-attachments/assets/5be9dcc6-1ba9-481d-b85a-3225f9126bd9)

---

## Smart Contract (Move)

- **Location:** `move/sources/simplified_coffee_shop.move`
- **Key Functions:**
  - `buy_coffee`: Accepts APT, updates on-chain shop funds.
  - `withdraw`: Allows admin to withdraw funds.
  - `get_balance`: Returns shop's on-chain balance.
- **Security:** Only the admin address can withdraw.
- **Deployment:** Deployed to Aptos testnet. Module address is set in `.env` and used by both backend and frontend.

---

## Backend (NestJS + Postgres)

- **Location:** `server/src/`
- **Key Modules:**
  - `coffees/`: CRUD for coffee products (admin only for updates).
  - `orders/`: Records all paid orders, links to on-chain tx.
  - `funds.controller.ts`: Exposes shop funds endpoint.
  - `withdraw.controller.ts`: Handles withdrawal requests.
- **Endpoints:**
  - `GET /api/coffees`: List all coffees.
  - `GET /api/orders`: List all orders.
  - `PATCH /api/coffees/:id`: Update coffee price/availability.
  - `PATCH /api/coffees/:id/stock`: Update coffee stock.
  - `GET /api/shop-funds`: Get on-chain shop funds.
- **Database:** PostgreSQL (orders, coffees, admin users).
- **Security:** Only admin wallet can update products or withdraw.

---

## Frontend (Next.js + React)

- **Location:** `frontend/src/`
- **Key Components:**
  - `CoffeeShop`: Main menu, coffee cards, buy flow.
  - `OrderHistory`: User's order history.
  - `Sidebar`: Navigation, wallet connect, logo.
  - `AdminDashboard`: Admin panel with tabs (Inventory, Orders, Funds).
  - `CoffeeCard`, `CoffeeItem`, `WithdrawFunds`: UI elements.
- **Styling:** TailwindCSS, daisyUI, custom color palette.
- **Wallet Integration:** Aptos wallet adapter, Petra, etc.
- **Routing:** `/` (shop), `/admin` (admin dashboard).

---

## Admin Panel

- **Access:** Only the admin wallet (address in `.env`) can access `/admin`.
- **Tabs:**
  - **Inventory:** Edit price, stock, availability for each coffee.
  - **Orders:** View all orders (with on-chain tx links).
  - **Funds:** View shop balance (APT & Octas), withdraw all funds.
- **UI:** Modern, responsive, Figma-inspired.

---

## Wallet Integration

- **Supported Wallets:** Petra, Martian, and any Aptos-compatible wallet.
- **Connect/Disconnect:** Top left in sidebar.
- **On-chain Actions:** All payments and withdrawals require wallet signature.

---

## API Reference

### Coffees

- `GET /api/coffees`  
  List all available coffees.

- `PATCH /api/coffees/:id`  
  Update coffee price or availability (admin only).

- `PATCH /api/coffees/:id/stock`  
  Update coffee stock (admin only).

### Orders

- `GET /api/orders`  
  List all orders (admin), or user orders (user).

### Funds

- `GET /api/shop-funds?address=<admin_address>`  
  Get on-chain shop funds for the admin.

- `POST /api/withdraw`  
  Withdraw funds to admin wallet (admin only).

---

## Local Development

### Prerequisites

- Node.js 18+
- npm
- Docker (for Postgres, optional)
- Aptos CLI (for Move contract, optional)

### 1. Clone the repo

```bash
git clone https://github.com/MihRazvan/aptos-coffee-store.git
cd aptos-coffee-store
```

### 2. Setup Environment Variables

- Copy `.env.example` to `.env` in both `frontend/` and `server/`.
- Set:
  - `NEXT_PUBLIC_API_URL`
  - `NEXT_PUBLIC_MODULE_ADDRESS`
  - `NEXT_PUBLIC_ADMIN_ADDRESS`
  - `DATABASE_URL` (for backend)
  - `APTOS_NODE_URL` (for backend/contract)

### 3. Start Postgres (if local)

```bash
docker run --name aptos-coffee-db -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres
```

### 4. Start Backend

```bash
cd server
npm install
npm run start:dev
```

### 5. Start Frontend

```bash
cd frontend
npm install
npm run dev
```

### 6. (Optional) Deploy/Update Move Contract

```bash
cd move
aptos move publish --profile dev
```

---

## Deployment

- **Frontend:** [Vercel](https://aptos-coffee-store.vercel.app/)
- **Backend:** [Render](https://aptos-coffee-shop-api.onrender.com/)
- **Move Contract:** Aptos testnet

---

## Environment Variables

- `NEXT_PUBLIC_API_URL` — Backend API URL for frontend.
- `NEXT_PUBLIC_MODULE_ADDRESS` — Move contract address.
- `NEXT_PUBLIC_ADMIN_ADDRESS` — Admin wallet address.
- `DATABASE_URL` — Postgres connection string (backend).
- `APTOS_NODE_URL` — Aptos node URL (backend/contract).

---

## Testing

- **Backend:**  
  `cd server && npm run test`
- **Frontend:**  
  (Add your preferred React/Next.js testing framework)
- **Move:**  
  `cd move && aptos move test`

---

## Security & Resilience

- All critical actions (buy, withdraw, admin updates) are on-chain or server-side.
- Orders are never lost or duplicated, even on backend restart.
- Only the admin wallet can access sensitive endpoints or withdraw funds.
- No sensitive logic is trusted to the client.

---

## Known Issues & Limitations

- Only one admin wallet is supported.
- No email/password login (wallet-based only).
- No refunds or order cancellation (demo purpose).
- Move contract is simplified for demo; production use would require more checks.

---

## License

MIT

---

## Credits

- [Aptos](https://aptos.dev/)
- [Next.js](https://nextjs.org/)
- [NestJS](https://nestjs.com/)
- [daisyUI](https://daisyui.com/)
- [Petra Wallet](https://petra.app/)
- Figma design inspiration by [your designer/friend]

---

## Live Demo

- [Frontend](https://aptos-coffee-store.vercel.app/)
- [Backend API](https://aptos-coffee-shop-api.onrender.com/)

---

**Enjoy your coffee on Aptos! ☕️**
