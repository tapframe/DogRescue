import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// The secret code to access admin panel
const SECRET_CODE = '815787';

const KeyboardShortcutListener = () => {
  const [keysPressed, setKeysPressed] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    // Reset keys pressed after 2 seconds of inactivity
    const resetTimeout = setTimeout(() => {
      if (keysPressed.length > 0) {
        setKeysPressed('');
      }
    }, 2000);

    return () => clearTimeout(resetTimeout);
  }, [keysPressed]);

  useEffect(() => {
    // Check if the entered sequence matches the secret code
    if (keysPressed === SECRET_CODE) {
      navigate('/admin-login-7a91b523e61');
      setKeysPressed('');
    }
  }, [keysPressed, navigate]);

  useEffect(() => {
    // Handler for keydown events
    const handleKeyDown = (event: KeyboardEvent) => {
      // Only detect number keys (0-9)
      if (/^\d$/.test(event.key)) {
        setKeysPressed(prev => (prev + event.key).slice(-SECRET_CODE.length));
      }
    };

    // Add event listener
    window.addEventListener('keydown', handleKeyDown);

    // Clean up
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // This component doesn't render anything visually
  return null;
};

export default KeyboardShortcutListener; 