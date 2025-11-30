import React, { useState } from 'react';
import Button from '../shared/Button';
import Input from '../shared/Input';
import LoadingSpinner from '../shared/LoadingSpinner';

interface AuthPageProps {
  isLogin: boolean;
  onLogin: (email: string, password: string) => Promise<boolean>;
  onRegister: (name: string, email: string, password: string) => Promise<boolean>;
  onSwitchToRegister: () => void;
  onSwitchToLogin: () => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ isLogin, onLogin, onRegister, onSwitchToRegister, onSwitchToLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (isLogin) {
      const success = await onLogin(email, password);
      if (!success) {
        setError('Email/Usuário ou senha incorretos.');
      }
    } else {
      if (password !== confirmPassword) {
        setError('As senhas não coincidem.');
        setLoading(false);
        return;
      }
      const success = await onRegister(name, email, password);
      if (!success) {
        setError('Erro ao registrar. O email pode já estar em uso.');
      }
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 p-4">
      <div className="bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-md border border-gray-700">
        <h2 className="text-3xl font-bold text-center text-white mb-6">
          {isLogin ? 'Entrar' : 'Criar Conta'}
        </h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <Input
              id="name"
              label="Nome"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          )}
          <Input
            id="email"
            label={isLogin ? "Email ou Usuário" : "Email"}
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            id="password"
            label="Senha"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {!isLogin && (
            <Input
              id="confirmPassword"
              label="Confirmar Senha"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          )}
          <Button type="submit" fullWidth className="mt-6" disabled={loading}>
            {loading ? <LoadingSpinner size="sm" color="border-white" /> : (isLogin ? 'Entrar' : 'Registrar')}
          </Button>
        </form>
        <p className="text-center text-gray-400 mt-6">
          {isLogin ? 'Não tem uma conta?' : 'Já tem uma conta?'}{' '}
          <button
            onClick={isLogin ? onSwitchToRegister : onSwitchToLogin}
            className="text-blue-400 hover:text-blue-300 font-semibold focus:outline-none"
          >
            {isLogin ? 'Registre-se' : 'Entrar'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthPage;