import React, { useState } from 'react';
import './meucss.css';

export default function OficinaForm() {
    const [formData, setFormData] = useState({
        nome: '',
        email: '',
        matricula: '',
        telefone: '',
        dataNascimento: ''
    });

    const [alunoDados, setAlunoDados] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setAlunoDados(formData);
        setFormData({
            nome: '',
            email: '',
            matricula: '',
            telefone: '',
            dataNascimento: ''
        });
    };

    return (
        <div className="gradiente"  style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
            <h1>Formulário de Aluno</h1>
            
            <form onSubmit={handleSubmit} style={{ marginBottom: '30px' }}>
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="nome">Nome: </label>
                    <input
                        type="text"
                        id="nome"
                        name="nome"
                        value={formData.nome}
                        onChange={handleChange}
                        required
                        style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                    />
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="email">Email: </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                    />
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="matricula">Matrícula: </label>
                    <input
                        type="text"
                        id="matricula"
                        name="matricula"
                        value={formData.matricula}
                        onChange={handleChange}
                        required
                        style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                    />
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="telefone">Telefone: </label>
                    <input
                        type="tel"
                        id="telefone"
                        name="telefone"
                        value={formData.telefone}
                        onChange={handleChange}
                        style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                    />
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="dataNascimento">Data de Nascimento: </label>
                    <input
                        type="date"
                        id="dataNascimento"
                        name="dataNascimento"
                        value={formData.dataNascimento}
                        onChange={handleChange}
                        style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                    />
                </div>

                <button 
                    type="submit"
                    style={{
                        padding: '10px 20px',
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontSize: '16px'
                    }}
                >
                    Submeter
                </button>
            </form>

            {alunoDados && (
                <div style={{
                    backgroundColor: '#f5f5f5',
                    padding: '20px',
                    borderRadius: '5px',
                    border: '1px solid #ddd'
                }}>
                    <h2>Dados do Aluno</h2>
                    <p><strong>Nome:</strong> {alunoDados.nome}</p>
                    <p><strong>Email:</strong> {alunoDados.email}</p>
                    <p><strong>Matrícula:</strong> {alunoDados.matricula}</p>
                    <p><strong>Telefone:</strong> {alunoDados.telefone || 'Não informado'}</p>
                    <p><strong>Data de Nascimento:</strong> {alunoDados.dataNascimento || 'Não informada'}</p>
                </div>
            )}
        </div>
    );
}