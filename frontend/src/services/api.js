const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

async function handleResponse(response) {
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    const data = await response.json();
    if (!response.ok) {
      const errorMsg = data.message || (data.errors ? Object.values(data.errors).join(', ') : 'API Request Failed');
      throw new Error(errorMsg);
    }
    return data.data !== undefined ? data.data : data;
  }
  if (!response.ok) {
    throw new Error(`HTTP Error ${response.status}: ${response.statusText}`);
  }
  return null;
}

export const productService = {
  async getAll(params = {}) {
    const query = new URLSearchParams();
    if (params.shopId && params.shopId !== 'ALL') query.append('shopId', params.shopId);
    if (params.query) query.append('query', params.query);
    
    const url = `${API_BASE_URL}/products${query.toString() ? `?${query.toString()}` : ''}`;
    const res = await fetch(url);
    return handleResponse(res);
  },

  async getById(id) {
    const res = await fetch(`${API_BASE_URL}/products/${id}`);
    return handleResponse(res);
  },

  async getByBarcode(barcode) {
    const res = await fetch(`${API_BASE_URL}/products/barcode/${barcode}`);
    return handleResponse(res);
  },

  async getByProductId(productId) {
    const res = await fetch(`${API_BASE_URL}/products/code/${productId}`);
    return handleResponse(res);
  },

  async create(productData) {
    const res = await fetch(`${API_BASE_URL}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData)
    });
    return handleResponse(res);
  },

  async update(id, productData) {
    const res = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData)
    });
    return handleResponse(res);
  },

  async delete(id) {
    const res = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'DELETE'
    });
    return handleResponse(res);
  }
};

export const supplierService = {
  async getAll() {
    const res = await fetch(`${API_BASE_URL}/suppliers`);
    return handleResponse(res);
  },

  async create(supplierData) {
    const res = await fetch(`${API_BASE_URL}/suppliers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(supplierData)
    });
    return handleResponse(res);
  },

  async update(id, supplierData) {
    const res = await fetch(`${API_BASE_URL}/suppliers/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(supplierData)
    });
    return handleResponse(res);
  },

  async delete(id) {
    const res = await fetch(`${API_BASE_URL}/suppliers/${id}`, {
      method: 'DELETE'
    });
    return handleResponse(res);
  }
};

export const shopService = {
  async getAll() {
    const res = await fetch(`${API_BASE_URL}/shops`);
    return handleResponse(res);
  },

  async create(shopData) {
    const res = await fetch(`${API_BASE_URL}/shops`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(shopData)
    });
    return handleResponse(res);
  },

  async update(id, shopData) {
    const res = await fetch(`${API_BASE_URL}/shops/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(shopData)
    });
    return handleResponse(res);
  },

  async delete(id) {
    const res = await fetch(`${API_BASE_URL}/shops/${id}`, {
      method: 'DELETE'
    });
    return handleResponse(res);
  }
};
