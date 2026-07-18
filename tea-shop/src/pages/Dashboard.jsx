import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';

// ---------------------------------------------------------------------------
// Dashboard — today's sales, total bills, total revenue, best seller,
// and a list of recent bills (requirement #1).
// ---------------------------------------------------------------------------
export default function Dashboard() {
  const { dashboardStats, settings } = useApp();
  const { todaysSales, todaysBillCount, totalBills, totalRevenue, bestSellingItem, bestQty, recentBills } = dashboardStats;

  return (
    <div className="page">
      <header className="page__header">
        <div>
          <h1>Welcome back 👋</h1>
          <p className="page__subtitle">Here's how {settings.shopName} is doing today.</p>
        </div>
        <Link to="/billing" className="btn btn--primary">+ New Bill</Link>
      </header>

      <section className="stat-grid">
        <div className="stat-card glass stat-card--brown">
          <span className="stat-card__label">Today's Sales</span>
          <span className="stat-card__value">₹{todaysSales.toFixed(2)}</span>
          <span className="stat-card__sub">{todaysBillCount} bill{todaysBillCount !== 1 ? 's' : ''} today</span>
        </div>
        <div className="stat-card glass stat-card--green">
          <span className="stat-card__label">Total Bills</span>
          <span className="stat-card__value">{totalBills}</span>
          <span className="stat-card__sub">All-time generated</span>
        </div>
        <div className="stat-card glass stat-card--gold">
          <span className="stat-card__label">Total Revenue</span>
          <span className="stat-card__value">₹{totalRevenue.toFixed(2)}</span>
          <span className="stat-card__sub">All-time earnings</span>
        </div>
        <div className="stat-card glass stat-card--cream">
          <span className="stat-card__label">Best Selling Item</span>
          <span className="stat-card__value stat-card__value--text">{bestSellingItem}</span>
          <span className="stat-card__sub">{bestQty} sold</span>
        </div>
      </section>

      <section className="panel glass">
        <div className="panel__header">
          <h2>Recent Bills</h2>
          <Link to="/history" className="link">View all →</Link>
        </div>

        {recentBills.length === 0 ? (
          <div className="empty-state">
            <p>No bills yet. Generate your first bill from the Billing screen.</p>
          </div>
        ) : (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Bill No.</th>
                  <th>Date</th>
                  <th>Items</th>
                  <th>Payment</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {recentBills.map((bill) => (
                  <tr key={bill.id}>
                    <td>{bill.billNumber}</td>
                    <td>{new Date(bill.date).toLocaleString()}</td>
                    <td>{bill.items.reduce((s, i) => s + i.qty, 0)} items</td>
                    <td><span className="pill">{bill.paymentMethod}</span></td>
                    <td className="data-table__amount">₹{bill.grandTotal.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
