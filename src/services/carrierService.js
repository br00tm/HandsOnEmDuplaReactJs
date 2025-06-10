import supabase from './supabase';

const carrierService = {
  async getCarrierByPage(page = 1, limit = 12) {
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    
    const { data, error, count } = await supabase
      .from('carriers')
      .select('*', { count: 'exact' })
      .range(from, to)
      .order('name', { ascending: true });
    if (error) {
      console.error('Erro ao buscar transportadoras:', error);
      throw error;
    }
    return { 
      carriers: data, 
      total: count,
      totalPages: Math.ceil(count / limit)
    };
  },
  
  async getAllCarrying() {
    const { data, error } = await supabase
      .from('carriers')
      .select('*')
      .order('name', { ascending: true });
    if (error) {
      console.error('Erro ao buscar todas as transportadoras:', error);
      throw error;
    }
    return data;
  },
  
  async getCarryingById(id) {
    const { data, error } = await supabase
      .from('carriers')
      .select('*')
      .eq('id', id)
      .single();
    if (error) {
      console.error('Erro ao buscar categoria:', error);
      throw error;
    }
    return data;
  },
  
  async createCarrying(carriers) {
    const { data, error } = await supabase
      .from('carriers')
      .insert([carriers])
      .select();
    if (error) {
      console.error('Erro ao criar transportadora:', error);
      throw error;
    }
    return data[0];
  },
  
  async updateCarrying(id, carriers) {
    const { data, error } = await supabase
      .from('carriers')
      .update(carriers)
      .eq('id', id)
      .select();
    if (error) {
      console.error('Erro ao atualizar categoria:', error);
      throw error;
    }
    return data[0];
  },

  async deleteCarrying(id) {
    const { error } = await supabase
      .from('carriers')
      .delete()
      .eq('id', id);    
    if (error) {
      console.error('Erro ao deletar transportadora:', error);
      throw error;
    }
    return true;
  }
};

export default carrierService; 