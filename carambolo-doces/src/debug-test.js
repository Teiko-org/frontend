// Arquivo de teste para debugar as APIs
// Execute este código no console do navegador (F12)

import { axiosApi } from './provider/AxiosApi.js';

// Função para testar todas as APIs
async function testarAPIs() {
    console.log('🧪 Iniciando testes das APIs...');
    
    try {
        // Teste 1: Fornadas
        console.log('📋 Testando API de fornadas...');
        const fornadas = await axiosApi.get('/fornadas');
        console.log('✅ Fornadas:', fornadas.data);
        console.log('📊 Total de fornadas:', fornadas.data.length);
        
        // Teste 2: Produtos de fornada
        console.log('🍰 Testando API de produtos de fornada...');
        const produtos = await axiosApi.get('/fornadas/produto-fornada');
        console.log('✅ Produtos:', produtos.data);
        console.log('📊 Total de produtos:', produtos.data.length);
        
        // Teste 3: Bolos
        console.log('🎂 Testando API de bolos...');
        const bolos = await axiosApi.get('/bolos/detalhe');
        console.log('✅ Bolos:', bolos.data);
        console.log('📊 Total de bolos:', bolos.data.length);
        
        // Teste 4: Fornada da vez
        if (fornadas.data.length > 0) {
            const primeiraFornada = fornadas.data[0];
            console.log('🔍 Testando produtos da fornada ID:', primeiraFornada.id);
            const produtosFornada = await axiosApi.get(`/fornadas/da-vez/produtos/${primeiraFornada.id}`);
            console.log('✅ Produtos da fornada:', produtosFornada.data);
        }
        
    } catch (error) {
        console.error('❌ Erro ao testar APIs:', error);
        console.error('📝 Detalhes do erro:', {
            message: error.message,
            status: error.response?.status,
            data: error.response?.data,
            config: error.config
        });
    }
}

// Função para testar uma API específica
async function testarAPI(endpoint) {
    try {
        console.log(`🧪 Testando ${endpoint}...`);
        const response = await axiosApi.get(endpoint);
        console.log(`✅ ${endpoint}:`, response.data);
        return response.data;
    } catch (error) {
        console.error(`❌ Erro em ${endpoint}:`, error);
        return null;
    }
}

// Função para verificar configuração do Axios
function verificarConfiguracao() {
    console.log('⚙️ Configuração do Axios:');
    console.log('Base URL:', axiosApi.defaults.baseURL);
    console.log('Headers:', axiosApi.defaults.headers);
    console.log('With Credentials:', axiosApi.defaults.withCredentials);
}

// Exportar funções para uso no console
window.debugAPIs = {
    testarTodas: testarAPIs,
    testar: testarAPI,
    config: verificarConfiguracao
};

console.log('🔧 Debug APIs carregado! Use:');
console.log('- window.debugAPIs.testarTodas() para testar todas as APIs');
console.log('- window.debugAPIs.testar("/endpoint") para testar uma API específica');
console.log('- window.debugAPIs.config() para verificar configuração do Axios');
