import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaTimes, FaCommentMedical, FaAppleAlt, FaPills } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const FloatingActionButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const actions = [
    { 
      icon: <FaCommentMedical />, 
      label: 'Symptoms',
      color: 'from-blue-500 to-blue-600',
      onClick: () => navigate('/symptoms')
    },
    { 
      icon: <FaAppleAlt />, 
      label: 'Diet',
      color: 'from-green-500 to-green-600',
      onClick: () => navigate('/diet')
    },
    { 
      icon: <FaPills />, 
      label: 'Meds',
      color: 'from-pink-500 to-purple-600',
      onClick: () => navigate('/reminders')
    }
  ];

  return (
    <div className="fixed bottom-8 right-8 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="absolute bottom-16 right-0 flex flex-col-reverse items-end space-y-reverse space-y-4 mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            {actions.map((action, index) => (
              <motion.button
                key={index}
                className={`flex items-center space-x-2 p-2 pr-4 rounded-full shadow-lg bg-gradient-to-r ${action.color} text-white`}
                onClick={action.onClick}
                initial={{ opacity: 0, x: 20 }}
                animate={{ 
                  opacity: 1, 
                  x: 0,
                  transition: { delay: 0.1 * index }
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="w-8 h-8 flex items-center justify-center">
                  {action.icon}
                </span>
                <span className="text-sm font-medium">{action.label}</span>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-white ${
          isOpen 
            ? "bg-gray-700" 
            : "bg-gradient-to-r from-indigo-500 to-blue-500"
        }`}
        onClick={toggleMenu}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ 
          type: "spring",
          stiffness: 260,
          damping: 20
        }}
      >
        <motion.div
          animate={{ rotate: isOpen ? 135 : 0 }}
          transition={{ duration: 0.3 }}
          className="text-xl"
        >
          {isOpen ? <FaTimes /> : <FaPlus />}
        </motion.div>
      </motion.button>
    </div>
  );
};

export default FloatingActionButton; 