import axios from "axios"
import { clearAuthData } from "../service/userService.js"

// Função para verificar se a rota é pública (não precisa de autenticação)
const isPublicRoute = (url) => {
    const publicRoutes = [
        '/decoracoes',
        '/fornadas',
        '/bolos'
    ];
    
    return publicRoutes.some(route => url.includes(route));
};

// Função para verificar se a rota é de autenticação (precisa de cookies)
const isAuthRoute = (url) => {
    const authRoutes = [
        '/usuarios/login',
        '/usuarios/logout',
        '/usuarios/logOut'
    ];
    
    return authRoutes.some(route => url.includes(route));
};

export const axiosApi = axios.create(
    {
        baseURL: "http://localhost:8080",
        headers: {
            "Content-Type": "application/json",
        },
        withCredentials: true
    }
)

// Interceptor para configurar cookies corretamente
axiosApi.interceptors.request.use(
    (config) => {
        // Para rotas públicas (decoracoes, fornadas, bolos), não enviar cookies
        if (isPublicRoute(config.url)) {
            config.withCredentials = false;
        } 
        // Para rotas de autenticação (login, logout), sempre enviar cookies
        else if (isAuthRoute(config.url)) {
            config.withCredentials = true;
        }
        // Para outras rotas (protegidas), enviar cookies
        else {
            config.withCredentials = true;
        }
        
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
)

// Interceptor para lidar com erros de autenticação
axiosApi.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Se receber erro 401 (Unauthorized), verificar o tipo de rota
        if (error.response && error.response.status === 401) {
            const currentPath = window.location.pathname;
            const requestUrl = error.config?.url || '';
            const publicPaths = ['/login', '/', '/register', '/carambolos'];
            const isPublicPage = publicPaths.some(path => currentPath.startsWith(path));
            const isPublicRequest = isPublicRoute(requestUrl);
            const isAuthRequest = isAuthRoute(requestUrl);
            
            // Se for uma rota pública, não fazer nada (erro esperado)
            if (isPublicRequest) {
                console.log(`ℹ️ Rota pública ${requestUrl} retornou 401 (esperado para usuários não logados)`);
                return Promise.reject(error);
            }
            
            // Se for uma rota de autenticação, mostrar erro específico
            if (isAuthRequest) {
                console.error(`❌ Erro de autenticação em ${requestUrl}:`, error.response?.data?.message || 'Credenciais inválidas');
                return Promise.reject(error);
            }
            
            // Para outras rotas protegidas, limpar dados e redirecionar
            console.warn("🔒 Token inválido ou expirado. Limpando dados de autenticação...");
            clearAuthData();
            
            // Só redirecionar se não estiver em páginas públicas
            if (!isPublicPage) {
                console.log("🔄 Redirecionando para login...");
                window.location.href = '/login';
            }
        }
        
        return Promise.reject(error);
    }
)