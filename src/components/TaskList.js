import React from 'react';
import { motion } from 'framer-motion';
import './TaskList.css'; // Arquivo de estilo para a lista de tarefas

function TaskList({ tasks, setTasks }) {
  // Função para marcar a tarefa como concluída
  const toggleTaskCompletion = (index) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].completed = !updatedTasks[index].completed;
    setTasks(updatedTasks);
  };

  // Função para excluir a tarefa com animação de deslizar
  const deleteTask = (index) => {
    const updatedTasks = tasks.filter((task, i) => i !== index);
    setTasks(updatedTasks);
  };

  return (
    <div className="task-list">
      {tasks.map((task, index) => (
        <motion.div
          key={index}
          className={`task-item ${task.completed ? 'completed' : ''}`}
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 100 }}
          transition={{ duration: 0.4 }}
          whileHover={{ scale: 1.05, rotateY: 5 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="task-content">
            <h3 className="task-title">{task.text}</h3>
            <div className="task-actions">
              <button onClick={() => toggleTaskCompletion(index)}>
                {task.completed ? 'Desmarcar' : 'Concluir'}
              </button>
              <button onClick={() => deleteTask(index)}>Excluir</button>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export default TaskList;



