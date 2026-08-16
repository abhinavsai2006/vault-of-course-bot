'use client';

import React, { useState, useRef, useEffect } from 'react';
import { FaCommentDots, FaTimes, FaPaperPlane, FaWhatsapp } from 'react-icons/fa';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import styles from './Chatbot.module.css';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'model', content: 'Hi there! I am the VaultOfCourse support assistant. How can I help you today?' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (text = inputValue) => {
    if (!text.trim()) return;

    const userMessage = { role: 'user', content: text };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMessage] })
      });
      
      const data = await response.json();
      
      if (data.reply) {
        setMessages((prev) => [...prev, { role: 'model', content: data.reply }]);
      } else {
        setMessages((prev) => [...prev, { role: 'model', content: 'Sorry, I encountered an error. Please try again.' }]);
      }
    } catch (error) {
      setMessages((prev) => [...prev, { role: 'model', content: 'Sorry, unable to connect to the server.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickActions = [
    { label: '🎓 Explore Courses', text: 'What courses are available?' },
    { label: '💼 Internship Info', text: 'Tell me about internships.' },
    { label: '📜 Verify Certificate', text: 'How can I verify my certificate?' },
    { label: '❓ General Help', text: 'I need general help.' },
  ];

  return (
    <div className={styles.chatbotContainer}>
      {!isOpen && (
        <button className={styles.chatButton} onClick={() => setIsOpen(true)}>
          <FaCommentDots />
        </button>
      )}

      {isOpen && (
        <div className={styles.chatWindow}>
          <div className={styles.chatHeader}>
            <span>VaultOfCourse Support</span>
            <button className={styles.closeButton} onClick={() => setIsOpen(false)}>
              <FaTimes />
            </button>
          </div>

          <div className={styles.chatBody}>
            {messages.map((msg, idx) => (
              <div key={idx} className={`${styles.message} ${msg.role === 'user' ? styles.userMessage : styles.botMessage}`}>
                {msg.content.includes('ESCALATE_TO_WHATSAPP') ? (
                  <div>
                    <p>{msg.content.replace('ESCALATE_TO_WHATSAPP:', '').trim()}</p>
                    <div className={styles.escalationBox}>
                      <a href="https://wa.me/1234567890?text=I%20need%20support" target="_blank" rel="noopener noreferrer" className={styles.whatsappButton}>
                        <FaWhatsapp size={20} /> Contact Support
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className={styles.markdownContent}>
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {msg.content}
                    </ReactMarkdown>
                  </div>
                )}
              </div>
            ))}
            
            {isLoading && (
              <div className={`${styles.message} ${styles.botMessage}`}>
                <div className={styles.loading}>
                  <div className={styles.dot}></div>
                  <div className={styles.dot}></div>
                  <div className={styles.dot}></div>
                </div>
              </div>
            )}
            
            {messages.length === 1 && !isLoading && (
              <div className={styles.quickActions}>
                {quickActions.map((action, idx) => (
                  <button key={idx} className={styles.actionChip} onClick={() => handleSend(action.text)}>
                    {action.label}
                  </button>
                ))}
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className={styles.inputArea}>
            <input
              type="text"
              className={styles.inputField}
              placeholder="Type your message..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              disabled={isLoading}
            />
            <button className={styles.sendButton} onClick={() => handleSend()} disabled={!inputValue.trim() || isLoading}>
              <FaPaperPlane />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
