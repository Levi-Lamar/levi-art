import React, { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  getDocs, 
  updateDoc, 
  doc, 
  deleteDoc 
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import { useError, ERROR_TYPES } from '../context/ErrorContext';

const AdminDashboard = () => {
  const { user } = useAuth();
  const { handleError } = useError();
  const [activeTab, setActiveTab] = useState('artwork');
  const [artworks, setArtworks] = useState([]);
  const [merchandise, setMerchandise] = useState([]);
  const [commissions, setCommissions] = useState([]);
  const [orders, setOrders] = useState([]);

  // Check if user is an admin
  useEffect(() => {
    if (user?.role !== 'admin') {
      handleError({
        type: ERROR_TYPES.AUTHENTICATION,
        message: 'Access Denied: Admin privileges required'
      });
    }
  }, [user]);

  // Fetch data for different sections
  useEffect(() => {
    const fetchData = async () => {
      try {
        const artworkQuery = query(collection(db, 'artworks'));
        const merchandiseQuery = query(collection(db, 'merchandise'));
        const commissionsQuery = query(collection(db, 'commissionRequests'));
        const ordersQuery = query(collection(db, 'orders'));

        const [artworkSnapshot, merchandiseSnapshot, commissionsSnapshot, ordersSnapshot] = 
          await Promise.all([
            getDocs(artworkQuery),
            getDocs(merchandiseQuery),
            getDocs(commissionsQuery),
            getDocs(ordersQuery)
          ]);

        setArtworks(artworkSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        setMerchandise(merchandiseSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        setCommissions(commissionsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        setOrders(ordersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        handleError({
          type: ERROR_TYPES.NETWORK,
          message: 'Failed to fetch admin data',
          details: error
        });
      }
    };

    if (user?.role === 'admin') {
      fetchData();
    }
  }, [user]);

  const handleUpdateInventory = async (collection, itemId, updates) => {
    try {
      const itemRef = doc(db, collection, itemId);
      await updateDoc(itemRef, updates);
      
      // Update local state
      if (collection === 'artworks') {
        setArtworks(prev => 
          prev.map(item => 
            item.id === itemId ? { ...item, ...updates } : item
          )
        );
      } else if (collection === 'merchandise') {
        setMerchandise(prev => 
          prev.map(item => 
            item.id === itemId ? { ...item, ...updates } : item
          )
        );
      }
    } catch (error) {
      handleError({
        type: ERROR_TYPES.GENERAL,
        message: 'Failed to update inventory',
        details: error
      });
    }
  };

  const handleUpdateCommissionStatus = async (commissionId, status) => {
    try {
      const commissionRef = doc(db, 'commissionRequests', commissionId);
      await updateDoc(commissionRef, { status });

      setCommissions(prev => 
        prev.map(commission => 
          commission.id === commissionId 
            ? { ...commission, status } 
            : commission
        )
      );
    } catch (error) {
      handleError({
        type: ERROR_TYPES.GENERAL,
        message: 'Failed to update commission status',
        details: error
      });
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'artwork':
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4 text-brand-orange">Artwork Inventory</h2>
            <table className="w-full bg-dark-card">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="p-2">Title</th>
                  <th className="p-2">Price</th>
                  <th className="p-2">Available</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {artworks.map(artwork => (
                  <tr key={artwork.id} className="border-b border-gray-700">
                    <td className="p-2">{artwork.title}</td>
                    <td className="p-2">${artwork.price}</td>
                    <td className="p-2">
                      <input 
                        type="checkbox"
                        checked={artwork.isAvailable}
                        onChange={(e) => handleUpdateInventory(
                          'artworks', 
                          artwork.id, 
                          { isAvailable: e.target.checked }
                        )}
                      />
                    </td>
                    <td className="p-2">
                      <button 
                        className="bg-brand-orange text-white px-2 py-1 rounded"
                        onClick={() => {/* Open edit modal */}}
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case 'commissions':
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4 text-brand-orange">Commission Requests</h2>
            <table className="w-full bg-dark-card">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="p-2">Name</th>
                  <th className="p-2">Email</th>
                  <th className="p-2">Status</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {commissions.map(commission => (
                  <tr key={commission.id} className="border-b border-gray-700">
                    <td className="p-2">{commission.name}</td>
                    <td className="p-2">{commission.email}</td>
                    <td className="p-2">
                      <select
                        value={commission.status}
                        onChange={(e) => handleUpdateCommissionStatus(
                          commission.id, 
                          e.target.value
                        )}
                        className="bg-black text-white p-1 rounded"
                      >
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="p-2">
                      <button 
                        className="bg-brand-orange text-white px-2 py-1 rounded"
                        onClick={() => {/* View commission details */}}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case 'orders':
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4 text-brand-orange">Recent Orders</h2>
            <table className="w-full bg-dark-card">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="p-2">Order ID</th>
                  <th className="p-2">Total</th>
                  <th className="p-2">Date</th>
                  <th className="p-2">Status</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order.id} className="border-b border-gray-700">
                    <td className="p-2">{order.id}</td>
                    <td className="p-2">${order.total.toFixed(2)}</td>
                    <td className="p-2">
                      {new Date(order.createdAt.seconds * 1000).toLocaleDateString()}
                    </td>
                    <td className="p-2">{order.status}</td>
                    <td className="p-2">
                      <button 
                        className="bg-brand-orange text-white px-2 py-1 rounded"
                        onClick={() => {/* View order details */}}
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      default:
        return null;
    }
  };

  if (user?.role !== 'admin') {
    return (
      <div className="text-center text-red-500 p-8">
        Access Denied: Admin Privileges Required
      </div>
    );
  }

  return (
    <div className="p-6 bg-dark-bg text-white">
      <h1 className="text-3xl font-bold mb-6 text-brand-orange">Admin Dashboard</h1>
      
      <div className="mb-4 flex space-x-4">
        {['artwork', 'commissions', 'orders'].map(tab => (
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

      <div className="bg-dark-card p-4 rounded">
        {renderContent()}
      </div>
    </div>
  );
};

export default AdminDashboard;
