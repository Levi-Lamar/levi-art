import React, { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  orderBy 
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import { useError, ERROR_TYPES } from '../context/ErrorContext';

const OrderHistory = () => {
  const { user } = useAuth();
  const { handleError } = useError();
  const [orders, setOrders] = useState([]);
  const [commissions, setCommissions] = useState([]);
  const [activeTab, setActiveTab] = useState('purchases');

  useEffect(() => {
    const fetchOrderHistory = async () => {
      if (!user) {
        handleError({
          type: ERROR_TYPES.AUTHENTICATION,
          message: 'Please log in to view order history'
        });
        return;
      }

      try {
        // Fetch purchase orders
        const ordersQuery = query(
          collection(db, 'orders'),
          where('userId', '==', user.uid),
          orderBy('createdAt', 'desc')
        );

        // Fetch commission requests
        const commissionsQuery = query(
          collection(db, 'commissionRequests'),
          where('userId', '==', user.uid),
          orderBy('timestamp', 'desc')
        );

        const [ordersSnapshot, commissionsSnapshot] = await Promise.all([
          getDocs(ordersQuery),
          getDocs(commissionsQuery)
        ]);

        setOrders(ordersSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })));

        setCommissions(commissionsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })));
      } catch (error) {
        handleError({
          type: ERROR_TYPES.NETWORK,
          message: 'Failed to fetch order history',
          details: error
        });
      }
    };

    fetchOrderHistory();
  }, [user]);

  const generateReceiptPDF = (order) => {
    // Mock PDF generation - in a real app, you'd use a PDF library
    const receiptContent = `
      Levi.art - Purchase Receipt
      
      Order ID: ${order.id}
      Date: ${new Date(order.createdAt.seconds * 1000).toLocaleString()}
      
      Items:
      ${order.items.map(item => `
        ${item.name} - $${item.price.toFixed(2)} x ${item.quantity}
      `).join('\n')}
      
      Total: $${order.total.toFixed(2)}
    `;

    // Create a Blob with the receipt content
    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    
    // Create a link and trigger download
    const link = document.createElement('a');
    link.href = url;
    link.download = `receipt_${order.id}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderOrderHistory = () => {
    const currentHistory = activeTab === 'purchases' ? orders : commissions;

    return (
      <div className="space-y-4">
        {currentHistory.length === 0 ? (
          <div className="text-center text-gray-500 p-8">
            No {activeTab} found
          </div>
        ) : (
          currentHistory.map(item => (
            <div 
              key={item.id} 
              className="bg-dark-card p-4 rounded-lg flex justify-between items-center"
            >
              <div>
                <h3 className="text-lg font-bold text-brand-orange">
                  {activeTab === 'purchases' 
                    ? `Order #${item.id.slice(0,8)}` 
                    : `Commission #${item.id.slice(0,8)}`}
                </h3>
                <p className="text-white">
                  {activeTab === 'purchases'
                    ? `Total: $${item.total.toFixed(2)}`
                    : `Status: ${item.status}`}
                </p>
                <p className="text-gray-400">
                  {new Date(
                    (item.createdAt?.seconds || item.timestamp?.seconds) * 1000
                  ).toLocaleString()}
                </p>
              </div>
              <div className="space-x-2">
                {activeTab === 'purchases' && (
                  <button
                    onClick={() => generateReceiptPDF(item)}
                    className="bg-brand-orange text-white px-3 py-1 rounded"
                  >
                    Download Receipt
                  </button>
                )}
                <button
                  className="bg-dark-bg text-white px-3 py-1 rounded"
                  onClick={() => {/* View Details Modal */}}
                >
                  Details
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    );
  };

  return (
    <div className="p-6 bg-dark-bg text-white">
      <h1 className="text-3xl font-bold mb-6 text-brand-orange">
        Order History
      </h1>

      <div className="mb-4 flex space-x-4">
        {['purchases', 'commissions'].map(tab => (
          <button
            key={tab}
            className={`px-4 py-2 rounded ${
              activeTab === tab 
                ? 'bg-brand-orange text-white' 
                : 'bg-dark-card text-gray-300'
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {renderOrderHistory()}
    </div>
  );
};

export default OrderHistory;
