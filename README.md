# PortfolioHub

PortfolioHub is a comprehensive, full-stack Progressive Web App (PWA) designed to help investors track and manage their cryptocurrency and stock portfolios in real-time. Built with a modern React stack, it features secure cloud synchronization, dynamic charts, and a highly customizable user experience.

## Features

* **Real-Time Market Data:** Live quotes for top cryptocurrencies (via CoinPaprika) and major tech stocks (via Finnhub).
* **Advanced Dashboard:** Automatically calculates total investment, current balance, and overall profit/loss with a dynamic area chart visualizing your portfolio's evolution.
* **Transaction Management:** Seamlessly log buy/sell orders with historical date selection, a visual asset picker modal, and advanced sorting/filtering capabilities.
* **Detailed Asset Analytics:** Dive deep into individual assets with dedicated pages featuring 30-day performance charts and a live news feed for stocks.
* **Personalization:** Global toggle for Light/Dark mode and Multi-Currency support (USD / EUR).
* **Progressive Web App (PWA):** Fully installable on iOS and Android devices for a native app-like experience.
* **Secure Authentication:** User registration and session management powered by Supabase Auth.
* **Cloud Database:** All transactions and user data are securely stored and synced via Supabase PostgreSQL.

## Tech Stack

* **Frontend:** React 18, TypeScript, Vite
* **Styling:** Tailwind CSS, Lucide React (Icons)
* **Charts:** Recharts
* **Notifications:** React Hot Toast
* **Backend as a Service:** Supabase (Auth & PostgreSQL database)
* **APIs:** Finnhub (Stocks & News), CoinPaprika (Cryptocurrency)

## Getting Started

### Prerequisites

Make sure you have [Node.js](https://nodejs.org/) installed on your machine. You will also need active accounts on **Supabase** and **Finnhub** to generate the required API keys.

### Installation

1. **Clone the repository:**
```bash
git clone [https://github.com/bernam07/portfolio-hub.git](https://github.com/bernam07/portfolio-hub.git)
cd portfolio-hub
```

2. **Install dependencies:**
```bash
npm install
```

3. **Configure Environment Variables:**
Create a `.env.local` file in the root directory and add your API keys:
```env
VITE_SUPABASE_URL=[https://your-project-id.supabase.co](https://your-project-id.supabase.co)
VITE_SUPABASE_PUBLISHABLE_KEY=your-supabase-publishable-key
VITE_FINNHUB_API_KEY=your-finnhub-api-key
```

4. **Database Setup:**
Run the following SQL snippet in your Supabase SQL Editor to create the transactions table and apply security policies:
```sql
CREATE TABLE transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  "assetId" TEXT NOT NULL,
  symbol TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  "purchasePrice" NUMERIC NOT NULL,
  date TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can only access their own transactions"
  ON transactions FOR ALL
  USING (auth.uid() = user_id);
```

5. **Start the Development Server:**
```bash
npm run dev
```

### Building for Production

To build the app and generate the PWA service workers, run:
```bash
npm run build
```

## PWA Installation

Once deployed or running locally over HTTPS, you can install the app directly to your device's home screen by opening the browser menu and selecting **"Add to Home Screen"** or **"Install App"**.

## License

This project is licensed under the MIT License.