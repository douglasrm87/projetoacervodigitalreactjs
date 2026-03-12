import React, { useState } from 'react';

export default function OficinaComponente() {
    const [oficinas, setOficinas] = useState([
        {
            id: 1,
            titulo: 'Introdução ao React',
            descricao: 'Aprenda os fundamentos do React',
            instrutor: 'João Silva',
            data: '2024-02-15',
            vagas: 30
        },
        {
            id: 2,
            titulo: 'JavaScript Avançado',
            descricao: 'Técnicas avançadas de JavaScript',
            instrutor: 'Maria Santos',
            data: '2024-02-20',
            vagas: 25
        }
    ]);

    return (
        <div className="oficina-container">
            <header className="oficina-header">
                <h1>Oficinas Disponíveis</h1>
                <p>Escolha uma oficina e desenvolva suas habilidades</p>
            </header>

            <main className="oficina-main">
                <div className="oficinas-grid">
                    {oficinas.map(oficina => (
                        <div key={oficina.id} className="oficina-card">
                            <h2>{oficina.titulo}</h2>
                            <p className="descricao">{oficina.descricao}</p>
                            <div className="oficina-info">
                                <span><strong>Instrutor:</strong> {oficina.instrutor}</span>
                                <span><strong>Data:</strong> {new Date(oficina.data).toLocaleDateString('pt-BR')}</span>
                                <span><strong>Vagas:</strong> {oficina.vagas}</span>
                            </div>
                            <button className="btn-inscricao">Inscrever-se</button>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}