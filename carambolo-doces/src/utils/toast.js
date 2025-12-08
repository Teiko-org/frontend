// Sistema de Toast customizado
let toastContainer = null;
let toastIdCounter = 0;

const DEFAULT_DURATION = 5000; // 5 segundos

// Criar container de toasts se não existir
const getToastContainer = () => {
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container';
    toastContainer.id = 'toast-container';
    document.body.appendChild(toastContainer);
  }
  return toastContainer;
};

// Remover toast do DOM
const removeToast = (toastElement) => {
  if (toastElement && toastElement.parentNode) {
    toastElement.classList.add('toast-exiting');
    setTimeout(() => {
      if (toastElement.parentNode) {
        toastElement.parentNode.removeChild(toastElement);
      }
    }, 300);
  }
};

// Criar elemento de toast
const createToast = (message, type = 'info', duration = DEFAULT_DURATION) => {
  const container = getToastContainer();
  const toastId = `toast-${toastIdCounter++}`;
  const toast = document.createElement('div');
  toast.id = toastId;
  toast.className = `toast toast-${type}`;
  
  const typeColors = {
    success: { 
      border: '#00D038', 
      bg: '#FFFFFF', 
      text: '#103464',
      iconBg: '#E8F8ED'
    },
    error: { 
      border: '#FF522D', 
      bg: '#FFFFFF', 
      text: '#103464',
      iconBg: '#FFE8E3'
    },
    warn: { 
      border: '#A47032', 
      bg: '#FFFFFF', 
      text: '#103464',
      iconBg: '#FFF4E6'
    },
    info: { 
      border: '#103464', 
      bg: '#FFFFFF', 
      text: '#103464',
      iconBg: '#E8EDF4'
    },
  };

  const colors = typeColors[type] || typeColors.info;

  toast.innerHTML = `
    <div class="toast-content" style="background: ${colors.bg};">
      <div class="toast-icon-wrapper" style="background: ${colors.iconBg};">
        <span class="toast-icon">${type === 'success' ? '✓' : type === 'error' ? '✕' : type === 'warn' ? '⚠' : 'ℹ'}</span>
      </div>
      <span class="toast-message" style="color: ${colors.text};">${message}</span>
      <button class="toast-close" onclick="this.closest('.toast').remove()" style="color: #656565;">×</button>
    </div>
    <div class="toast-progress">
      <div class="toast-progress-bar" style="background: ${colors.border}; animation: progressBar ${duration}ms linear forwards;"></div>
    </div>
  `;

  // Adicionar estilos inline para garantir funcionamento
  toast.style.cssText = `
    min-width: 320px;
    max-width: 480px;
    background: white;
    border-radius: 12px;
    box-shadow: 0 8px 24px rgba(16, 52, 100, 0.15);
    overflow: hidden;
    animation: slideInRight 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    pointer-events: auto;
    position: relative;
    border-left: 4px solid ${colors.border};
    font-family: 'Montserrat', sans-serif;
  `;

  const content = toast.querySelector('.toast-content');
  if (content) {
    content.style.cssText = `
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 18px 20px;
      gap: 14px;
      background: ${colors.bg};
    `;
  }

  const iconWrapper = toast.querySelector('.toast-icon-wrapper');
  if (iconWrapper) {
    iconWrapper.style.cssText = `
      width: 40px;
      height: 40px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      background: ${colors.iconBg};
    `;
  }

  const icon = toast.querySelector('.toast-icon');
  if (icon) {
    icon.style.cssText = `
      font-size: 20px;
      font-weight: 600;
      color: ${colors.border};
      line-height: 1;
    `;
  }

  const messageEl = toast.querySelector('.toast-message');
  if (messageEl) {
    messageEl.style.cssText = `
      flex: 1;
      font-size: 15px;
      font-weight: 500;
      line-height: 1.6;
      color: ${colors.text};
      font-family: 'Montserrat', sans-serif;
      letter-spacing: 0.01em;
    `;
  }

  const closeBtn = toast.querySelector('.toast-close');
  if (closeBtn) {
    closeBtn.style.cssText = `
      background: none;
      border: none;
      font-size: 22px;
      line-height: 1;
      color: #656565;
      cursor: pointer;
      padding: 0;
      width: 28px;
      height: 28px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
      flex-shrink: 0;
      border-radius: 6px;
      font-family: 'Montserrat', sans-serif;
      font-weight: 300;
    `;
    closeBtn.onmouseenter = () => {
      closeBtn.style.color = '#103464';
      closeBtn.style.background = '#F5F5F5';
    };
    closeBtn.onmouseleave = () => {
      closeBtn.style.color = '#656565';
      closeBtn.style.background = 'none';
    };
    closeBtn.onclick = () => removeToast(toast);
  }

  const progress = toast.querySelector('.toast-progress');
  if (progress) {
    progress.style.cssText = `
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: rgba(0, 0, 0, 0.1);
      overflow: hidden;
    `;
  }

  const progressBar = toast.querySelector('.toast-progress-bar');
  if (progressBar) {
    progressBar.style.cssText = `
      height: 100%;
      background: ${colors.border};
      animation: progressBar ${duration}ms linear forwards;
      transform-origin: left;
    `;
  }

  // Adicionar estilos de animação se não existirem
  if (!document.getElementById('toast-styles')) {
    const style = document.createElement('style');
    style.id = 'toast-styles';
    style.textContent = `
      @keyframes slideInRight {
        from {
          transform: translateX(calc(100% + 24px));
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
      @keyframes slideOutRight {
        from {
          transform: translateX(0);
          opacity: 1;
        }
        to {
          transform: translateX(calc(100% + 24px));
          opacity: 0;
        }
      }
      @keyframes progressBar {
        from {
          transform: scaleX(1);
        }
        to {
          transform: scaleX(0);
        }
      }
      .toast-container {
        position: fixed;
        top: 24px;
        right: 24px;
        z-index: 99999;
        display: flex;
        flex-direction: column;
        gap: 14px;
        pointer-events: none;
        font-family: 'Montserrat', sans-serif;
      }
      .toast-exiting {
        animation: slideOutRight 0.3s cubic-bezier(0.4, 0, 1, 1) forwards !important;
      }
    `;
    document.head.appendChild(style);
  }

  container.appendChild(toast);

  // Auto-remover após duração
  setTimeout(() => {
    removeToast(toast);
  }, duration);

  return toast;
};

// API pública do toast
export const toast = {
  success: (message, options = {}) => {
    const duration = options.autoClose || DEFAULT_DURATION;
    return createToast(message, 'success', duration);
  },
  
  error: (message, options = {}) => {
    const duration = options.autoClose || DEFAULT_DURATION;
    return createToast(message, 'error', duration);
  },
  
  warn: (message, options = {}) => {
    const duration = options.autoClose || DEFAULT_DURATION;
    return createToast(message, 'warn', duration);
  },
  
  info: (message, options = {}) => {
    const duration = options.autoClose || DEFAULT_DURATION;
    return createToast(message, 'info', duration);
  },
  
  // Métodos auxiliares para compatibilidade
  isActive: () => false,
  dismiss: () => {},
};

export default toast;

