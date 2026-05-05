import React, { useState } from 'react';
import './Oficina.css';

export default function Oficina() {
  const [expandedDay, setExpandedDay] = useState(null);

  const workshops = [
    {
      id: 1,
      title: 'Web Design Moderno',
      time: '10:00 - 12:00',
      instructor: 'Prof. Ana Silva',
      level: 'Intermediário',
      description: 'Aprenda as tendências mais atuais em design web responsivo.',
      participants: 24,
      category: 'Design',
      color: '#FF6B6B'
    },
    {
      id: 2,
      title: 'React Avançado',
      time: '14:00 - 16:30',
      instructor: 'Prof. Carlos Santos',
      level: 'Avançado',
      description: 'Domine hooks, context API e otimização de performance.',
      participants: 18,
      category: 'Programação',
      color: '#4ECDC4'
    },
    {
      id: 3,
      title: 'UX/UI Essentials',
      time: '16:30 - 18:00',
      instructor: 'Prof. Marina Costa',
      level: 'Iniciante',
      description: 'Princípios fundamentais de experiência e interface do usuário.',
      participants: 32,
      category: 'Design',
      color: '#95E1D3'
    }
  ];

  return (
    <div className="oficina-container">
      {/* Header */}
      <div className="oficina-header">
        <div className="header-content">
          <h1 className="header-title">
            <span className="title-icon">📚</span>
            Oficinas de Hoje
          </h1>
          <p className="header-subtitle">Desenvolva suas habilidades com nossos especialistas</p>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="stats-bar">
        <div className="stat-item">
          <span className="stat-number">{workshops.length}</span>
          <span className="stat-label">Oficinas</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{workshops.reduce((acc, w) => acc + w.participants, 0)}</span>
          <span className="stat-label">Participantes</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">6h</span>
          <span className="stat-label">Duração Total</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="oficina-content">
        <div className="workshops-grid">
          {workshops.map((workshop) => (
            <div
              key={workshop.id}
              className={`workshop-card ${expandedDay === workshop.id ? 'expanded' : ''}`}
              onClick={() => setExpandedDay(expandedDay === workshop.id ? null : workshop.id)}
            >
              {/* Card Header with Color */}
              <div className="card-header" style={{ backgroundColor: workshop.color }}>
                <div className="category-badge">{workshop.category}</div>
                <div className="level-badge">{workshop.level}</div>
              </div>

              {/* Card Body */}
              <div className="card-body">
                <h2 className="workshop-title">{workshop.title}</h2>
                
                <div className="workshop-info">
                  <div className="info-item">
                    <span className="info-icon">⏰</span>
                    <span className="info-text">{workshop.time}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-icon">👨‍🏫</span>
                    <span className="info-text">{workshop.instructor}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-icon">👥</span>
                    <span className="info-text">{workshop.participants} inscritos</span>
                  </div>
                </div>

                {expandedDay === workshop.id && (
                  <div className="workshop-details">
                    <p className="description">{workshop.description}</p>
                    <button className="btn-inscrever">
                      <span className="btn-text">Inscrever-me</span>
                      <span className="btn-icon">→</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Card Footer */}
              {expandedDay !== workshop.id && (
                <div className="card-footer">
                  <span className="expand-indicator">Clique para mais detalhes</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Footer Info */}
      <div className="oficina-footer">
        <div className="footer-content">
          <h3>💡 Dicas para aproveitar ao máximo</h3>
          <div className="tips-grid">
            <div className="tip-item">
              <span className="tip-icon">✓</span>
              <p>Chegue 10 minutos antes para se acomodar</p>
            </div>
            <div className="tip-item">
              <span className="tip-icon">✓</span>
              <p>Traga seu notebook e carregador</p>
            </div>
            <div className="tip-item">
              <span className="tip-icon">✓</span>
              <p>Participe ativamente das atividades</p>
            </div>
            <div className="tip-item">
              <span className="tip-icon">✓</span>
              <p>Networking com outros alunos</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}