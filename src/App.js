import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import TaskList from './components/TaskList';
import EmotionDetection from './components/EmotionDetection';
import './App.css'; // Arquivo de estilo

function App() {
  const [emotion, setEmotion] = useState('happy'); // Estado para emoção
  const [tasks, setTasks] = useState([]); // Estado para as tarefas
  const [menuOpen, setMenuOpen] = useState(false); // Estado do menu hambúrguer
  const menuRef = useRef(null); // Referência para o menu hambúrguer

  // Função para alternar o menu
  const toggleMenu = () => setMenuOpen(!menuOpen);

  // Fechar o menu ao clicar fora dele
  useEffect(() => {
    const closeMenuOnClickOutside = (e) => {
      if (menuOpen && menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false); // Fecha o menu
      }
    };

    // Adiciona o event listener
    document.addEventListener('mousedown', closeMenuOnClickOutside);

    // Limpeza do event listener quando o componente for desmontado
    return () => {
      document.removeEventListener('mousedown', closeMenuOnClickOutside);
    };
  }, [menuOpen]); // Dependência de menuOpen, ou seja, se o menu estiver aberto, vamos ouvir cliques fora dele

  const handleEmotionConfirmed = (confirmedEmotion) => {
    setEmotion(confirmedEmotion);

    let newSuggestions;
    if (confirmedEmotion === 'happy') {
      newSuggestions = ['Completar um projeto desafiador', 'Planejar algo criativo e divertido'];
    } else if (confirmedEmotion === 'sad') {
      newSuggestions = ['Organizar a mesa', 'Ler um livro relaxante'];
    } else if (confirmedEmotion === 'angry') {
      newSuggestions = ['Meditar por 10 minutos', 'Escrever sentimentos para desabafar'];
    } else {
      newSuggestions = ['Revisar sua agenda', 'Planejar a semana'];
    }

    const updatedTasks = [
      ...tasks,
      ...newSuggestions.map(suggestion => ({ text: suggestion, completed: false }))
    ];
    setTasks(updatedTasks);
  };

  return (
    <div className="App">
      {/* Menu Hambúrguer */}
      <header className="header">
        <motion.div
          className="menu-toggle"
          onClick={toggleMenu}
          whileTap={{ scale: 0.9 }}
        >
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </motion.div>
        <h1>App de Lista de Tarefas com Detecção de Emoções</h1>

        {/* Memojis ao lado do título */}
        <div className="memojis">
          <img 
            src={`./images/${emotion}.png`} 
            alt={emotion} 
            className="emoji-icon" 
          />
        </div>
      </header>

      {/* Menu Lateral */}
      {menuOpen && (
        <motion.div
          ref={menuRef} // Usando a referência aqui
          className="sidebar"
          initial={{ x: '-100%' }}
          animate={{ x: 0 }}
          exit={{ x: '-100%' }}
          transition={{ duration: 0.3 }}
        >
          <ul>
            <li>Início</li>
            <li>Sobre</li>
            <li>Contato</li>
          </ul>
        </motion.div>
      )}

      {/* Container Principal */}
      <div className="main-container">
        {/* Blocos de Texto ao lado */}
        <div className="text-blocks">
          <div className="left-text-block">
            <h2>Com a sua expressão, podemos garantir uma ótima semana!</h2>
            <p>Sem uma palavra dita, conseguimos entender o que você precisa. Siga as sugestões e tenha uma semana produtiva e equilibrada!</p>
          </div>
          <div className="right-text-block">
            <h2>Compreendemos o que você sente</h2>
            <p>Aqui, você encontra atividades recomendadas para melhorar seu humor. Seja feliz e aproveite o momento!</p>
          </div>
        </div>

        {/* Detecção de Emoção */}
        <div className="emotion-detection-container">
          <EmotionDetection onEmotionConfirmed={handleEmotionConfirmed} />
        </div>

        {/* Lista de Tarefas */}
        <div className="task-list-container">
          <TaskList tasks={tasks} setTasks={setTasks} />
        </div>
      </div>
    </div>
  );
}

export default App;






