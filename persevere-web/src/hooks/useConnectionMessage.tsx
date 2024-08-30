import { useEffect, useCallback } from 'react';

// 使用 flutterObject 作為全局對象名稱
declare global {
  interface Window {
    flutterObject?: {
      postMessage: (message: string) => void;
      addEventListener: (event: string, callback: (event: MessageEvent) => void) => void;
      removeEventListener: (event: string, callback: (event: MessageEvent) => void) => void;
    };
  }
}

/**
 * 用於向 App 發送消息的 hook
 */
export const useConnectionMessage = () => {
  const sendMessage = useCallback((name: string, data: any) => {
    // @ts-ignore
    if (typeof window.flutterObject !== 'undefined' && window.flutterObject) {
      const postInfo = JSON.stringify({ name, data });
      // @ts-ignore
      window.flutterObject.postMessage(postInfo);
    } else {
      console.warn('Flutter object is not available');
    }
  }, []);

  return sendMessage;
};

