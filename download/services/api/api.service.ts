import axios from 'axios';
import { Auction } from '@/services/types/Auction'; // Ajusta la ruta según tu estructura de carpetas

const API_URL = 'https://api.wow-cms.com';

// Crea una instancia de Axios con la API Key incluida en los headers
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'api-key': '72b5bfe9-4847-43a1-9a52-eb4deddc96ec', // Reemplaza con tu API Key real
  },
});

// Get insanity coins for user
export const getInsanityCoins = async (userId: number) => {
  try {
    const response = await apiClient.get(`/users/${userId}/getData`, {
      params: { data: 'dhracmas' }
    });
    return response.data;
  } catch (error) {
    console.error('Error obteniendo los Insanity Coins:', error);
    throw error;
  }
};

export const getAuctions = async (): Promise<Auction[]> => {
  try {
    const response = await apiClient.get('/auction');
    return response.data; // Directamente retornamos el array de subastas
  } catch (error) {
    console.error('Error obteniendo los datos de subastas:', error);
    throw error;
  }
};

export const getClanData = async () => {
  try {
    const response = await apiClient.get('/clan/getData'); // Llamada a la API sin parámetros
    const { membersCount } = response.data; // Se espera que la API devuelva los datos con el conteo de miembros
    
    return {
      membersCount,
    };
  } catch (error) {
    console.error('Error obteniendo los datos del clan:', error);
    throw error;
  }
};

export const updateBid = async (auctionId: string, bidAmount: number, userId: number) => {
  try {
    const response = await apiClient.put(`/auction/${auctionId}/bid`, {
      newBidAmount: bidAmount,
      userId: userId
    });
    return response.data;
  } catch (error) {
    console.error('Error actualizando la apuesta:', error);
    throw error;
  }
};

export const getBid = async (bidId: string) => {
  try {
      const response = await apiClient.get(`/auction/history/${bidId}`);
      return response.data; // Retorna todos los datos de la puja, incluyendo subasta y usuario
  } catch (error) {
      console.error('Error obteniendo la puja:', error);
      throw error;
  }
};

export const getUsers = async () => {
  try {
    const response = await apiClient.get(`/users`);
    return response.data; // Retorna todos los datos de la puja, incluyendo subasta y usuario
} catch (error) {
    console.error('Error obteniendo los usuarios:', error);
    throw error;
}
};


export const loginUser = async (discordId: string, username: string, roles: string) => {
  try {
    const response = await apiClient.post('/users/create-or-find', {
      discordId,
      username,
      roles,
    });
    return response.data;
  } catch (error) {
    console.error('Error durante el login:', error);
    throw error;
  }
};
