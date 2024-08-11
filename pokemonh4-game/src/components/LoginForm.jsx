import React, { useState } from 'react';
import { login } from '../api';
import jwtDecode from 'jwt-decode';

const LoginForm = ({ setUserInfo }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const { data } = await login({ email, password });
            const decoded = jwtDecode(data.token);
            setUserInfo({ token: data.token, uuid: decoded.uuid });
            localStorage.setItem('token', data.token);
        } catch (err) {
            setError('Login failed');
        }
    };

    return (
        <form onSubmit={handleLogin}>
            <h1>Login</h1>
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            <button type="submit">Login</button>
            {error && <p>{error}</p>}
        </form>
    );
};

export default LoginForm;
