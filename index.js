const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());

// Chave secreta para assinar os tokens JWT (geralmente, esta chave deve ser mantida em ambiente seguro)
const secretKey = 'suaChaveSecreta';

// Usuário de teste (apenas para fins de demonstração)
const testUser = {
  username: 'usuario',
  password: 'senha123'
};

// Rota de login
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Verifica se as credenciais correspondem ao usuário de teste
  if (username === testUser.username && password === testUser.password) {
    // Gera um token JWT com um payload contendo o nome de usuário
    const token = jwt.sign({ username }, secretKey, { expiresIn: '1h' });

    res.json({ token });
  } else {
    res.status(401).json({ message: 'Credenciais inválidas' });
  }
});

// Rota protegida que requer o token JWT para acesso
app.get('/protegido', verifyToken, (req, res) => {
  res.json({ message: 'Você acessou a rota protegida!' });
});

// Função middleware para verificar o token JWT
function verifyToken(req, res, next) {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(403).json({ message: 'Token não fornecido' });
  }

  jwt.verify(token.split(' ')[1], secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Token inválido' });
    }

    req.username = decoded.username;
    next();
  });
}

// Inicia o servidor na porta 3000
app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});
