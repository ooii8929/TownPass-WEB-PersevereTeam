import { TextToSpeech } from 'tts-react'

const TTS = ({ text, language, rate = 2, pitch = 2 }) => {

  const getLanguageCode = (language) => {
    switch (language) {
      case "中文":
        return "zh-TW"; 
      case "英文":
        return "en-US"; 
      case "日文":
        return "ja-JP"; 
      default:
        return "en-US"; 
    }
  };

  return (
    <TextToSpeech
      markTextAsSpoken
      text={text}           
      lang={getLanguageCode(language)} 
      rate={rate}           
      pitch={pitch}         
      position="bottom"
      size="large"
    >
      <p>{text}</p>
    </TextToSpeech>
  );
};

export default TTS;