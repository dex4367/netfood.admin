"use client";

import { useState } from 'react';
import { GoogleMap } from './ui/google-map';

interface Store {
  id: string;
  name: string;
  address: string;
  location: { lat: number; lng: number };
}

export default function StoreLocator() {
  const [stores] = useState<Store[]>([
    {
      id: '1',
      name: "Bob's - Paulista",
      address: 'Av. Paulista, 1000 - São Paulo, SP',
      location: { lat: -23.5621, lng: -46.6542 }
    },
    {
      id: '2',
      name: "Bob's - Centro",
      address: 'Rua da Quitanda, 50 - Rio de Janeiro, RJ',
      location: { lat: -22.9068, lng: -43.1729 }
    }
  ]);

  const [selectedStore, setSelectedStore] = useState<Store | null>(null);

  const markers = stores.map(store => ({
    position: store.location,
    title: store.name
  }));

  return (
    <div className="container mx-auto py-8">
      <h2 className="text-2xl font-bold mb-6">Encontre uma loja Bob's</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="text-lg font-semibold mb-4">Lojas próximas</h3>
            <div className="space-y-4">
              {stores.map(store => (
                <div 
                  key={store.id}
                  className={`p-3 rounded cursor-pointer transition-colors ${
                    selectedStore?.id === store.id 
                      ? 'bg-bobs-red text-white' 
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                  onClick={() => setSelectedStore(store)}
                >
                  <h4 className="font-medium">{store.name}</h4>
                  <p className="text-sm mt-1">{store.address}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <GoogleMap 
              center={selectedStore?.location || { lat: -22.9068, lng: -43.1729 }}
              markers={markers}
              zoom={selectedStore ? 15 : 6}
              height="500px"
            />
          </div>
        </div>
      </div>
    </div>
  );
} 