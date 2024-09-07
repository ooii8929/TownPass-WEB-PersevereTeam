import { useEffect } from 'react';

/**
 * 用於處理來自 App 的消息的 hook
 * @param cb - 處理來自 App 的數據的回調函數，接收一個包含 data 屬性的事件對象
 */
export const useHandleConnectionData = (cb: (event: { data: string }) => void) => {
    useEffect(() => {
      const handleMessage = (event: MessageEvent) => {
        if (typeof event.data === 'string') {
          cb({ data: event.data });
        }
      };
  
      // @ts-ignore
      if (typeof window.flutterObject !== 'undefined' && window.flutterObject) {
        // @ts-ignore
        window.flutterObject.addEventListener('message', handleMessage);
  
        return () => {
          // @ts-ignore
          window.flutterObject.removeEventListener('message', handleMessage);
        };
      } else {
        console.warn('Flutter object is not available');
      }
    }, [cb]);
  };