// 1. Importar as ferramentas
const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const axios = require('axios');
const cookieParser = require('cookie-parser');
const cors = require('cors'); // Importa o pacote CORS

// 2. Configurações
const app = express();
const PORT = 3000;
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;
const N8N_WEBHOOK_URL_CAMPANHA = process.env.N8N_WEBHOOK_URL_CAMPANHA;

// --- MUDANÇA CRUCIAL: CONFIGURAÇÃO DO CORS ---
// Permite que o seu frontend (que estará em outro domínio) faça requisições para este backend.
app.use(cors({
  origin: 'https://portaldeenvio.flowconnect.shop', // Coloque aqui a URL exata do seu frontend
  credentials: true // Permite que os cookies de autenticação sejam enviados
}));
// ---------------------------------------------

// 3. Inicializar os clientes
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// 4. Middlewares
app.use(express.json());
app.use(cookieParser());

// --- LÓGICA DE AUTENTICAÇÃO E API ---

// Middleware de verificação
const authMiddleware = async (req, res, next) => {
    const { data: { user } } = await supabase.auth.getUser(req.cookies.access_token);

    if (!user) {
        return res.status(401).json({ message: "Acesso não autorizado." }); // Agora retorna um erro, em vez de redirecionar
    }
    
    req.user = user;
    next();
};

// Rota para o processo de login
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
        return res.status(401).json({ message: 'Email ou senha inválidos.' });
    }
    
    res.cookie('access_token', data.session.access_token, { httpOnly: true, secure: true, expires: 0, sameSite: 'strict' });
    res.cookie('refresh_token', data.session.refresh_token, { httpOnly: true, secure: true, expires: 0, sameSite: 'strict' });
    res.json({ message: 'Login bem-sucedido!' });
});

// Rota para logout
app.post('/api/logout', async (req, res) => {
    await supabase.auth.signOut();
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');
    res.json({ message: 'Logout bem-sucedido!' });
});

// Suas rotas antigas, agora como API e protegidas pelo middleware
app.post('/api/enviar-campanha', authMiddleware, async (req, res) => {
    // ... seu código completo de enviar-campanha aqui ...
});

app.post('/api/agendar-mensagem', authMiddleware, async (req, res) => {
    // ... seu código completo de agendar-mensagem aqui ...
});

// 6. Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor de API rodando em http://localhost:${PORT}`);
});