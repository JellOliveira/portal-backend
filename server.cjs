// 1. Importar as ferramentas
const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const axios = require('axios');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path'); // Módulo para lidar com caminhos de arquivos

// 2. Configurações
const app = express();
const PORT = 3000;
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;
const N8N_WEBHOOK_URL_CAMPANHA = process.env.N8N_WEBHOOK_URL_CAMPANHA;

// 3. Middlewares
app.use(cors({
  origin: 'https://portaldeenvio.flowconnect.shop', // Permite comunicação com o frontend
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// 6. Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor de API rodando em http://localhost:${PORT}`);
});