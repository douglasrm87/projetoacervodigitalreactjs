import React, { useEffect, useState } from "react";
import {
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
  LineChart, Line, Legend, ResponsiveContainer
} from "recharts";
import { supabase } from '../../infra/supabase/supabaseClient';

const COLORS = ["#6C63FF", "#FF9800", "#4CAF50", "#2196F3", "#E91E63"];

const Dashboard = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    buscarDados();
  }, []);

  const buscarDados = async () => {
    const { data, error } = await supabase
      .from("Lancamento_Nucleo_Extensao")
      .select("*");

    if (error) {
      console.error("Erro ao buscar dados:", error);
    } else {
      setData(data);
    }
  };

  // ==============================
  // PROCESSAMENTO DOS DADOS
  // ==============================

  const totalRegistros = data.length;

  const totalCarga = data.reduce(
    (acc, item) => acc + (item.carga_horaria || 0),
    0
  );

  const porTipo = Object.values(
    data.reduce((acc, item) => {
      const tipo = item.tipo || "Não informado";
      acc[tipo] = acc[tipo] || { name: tipo, value: 0 };
      acc[tipo].value += 1;
      return acc;
    }, {})
  );

  const porCurso = Object.values(
    data.reduce((acc, item) => {
      const curso = item.curso || "Não informado";
      acc[curso] = acc[curso] || { name: curso, total: 0 };
      acc[curso].total += 1;
      return acc;
    }, {})
  );

  const porMes = Object.values(
    data.reduce((acc, item) => {
      const mes = item.mes || "N/A";
      acc[mes] = acc[mes] || { mes, total: 0 };
      acc[mes].total += 1;
      return acc;
    }, {})
  );

  return (
    <div className="dashboard">

      <div className="container">
          <div className="header">
            <h1>Dashboard Executivo Trial</h1>
          </div>

          {/* KPIs */}
          <div className="kpi-container">
            <div className="kpi-card">
              <p>Lançamentos</p>
              <h2 style={{ marginLeft: "15px" }}>{totalRegistros}</h2>
            </div>

            <div className="kpi-card">
              <p>Carga Horária Total</p>
              <h2 style={{ marginLeft: "15px" }}>{totalCarga}</h2>
            </div>

            <div className="kpi-card">
              <p>Cursos</p>
              <h2 style={{ marginLeft: "15px" }}>{porCurso.length}</h2>
            </div>

            <div className="kpi-card">
              <p>Tipos</p>
              <h2 style={{ marginLeft: "15px" }}>{porTipo.length}</h2>
              
            </div>
          </div>

          {/* GRÁFICOS */}
          <div className="charts">
            {/* Pizza */}
            <div className="chart-card">
              <h3>Distribuição por Tipo</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={porTipo} dataKey="value" outerRadius={100} label>
                    {porTipo.map((entry, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Barra */}
            <div className="chart-card">
              <h3>Lançamentos por Curso</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={porCurso}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="total" fill="#6C63FF" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Linha */}
            <div className="chart-card full">
              <h3>Evolução Mensal</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={porMes}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="total" stroke="#FF9800" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

      </div>  
    </div>
  );
};

export default Dashboard;