import React, { useState, useEffect, useRef } from "react";
import { Mic, MicOff, Loader2 } from "lucide-react";

interface VoiceTextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  value: string;
  onValueChange: (value: string) => void;
  label?: string;
  helperText?: string;
  containerClassName?: string;
}

export const VoiceTextArea: React.FC<VoiceTextAreaProps> = ({
  value,
  onValueChange,
  label,
  helperText,
  containerClassName = "",
  placeholder = "Type or speak your thoughts...",
  className = "",
  rows = 3,
  ...props
}) => {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onresult = (event: any) => {
        let transcript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            transcript += event.results[i][0].transcript;
          }
        }

        if (transcript) {
          const trimmedNew = transcript.trim();
          onValueChange(value ? `${value} ${trimmedNew}` : trimmedNew);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn("Speech recognition error:", event.error);
        setIsListening(false);
        if (event.error === "not-allowed") {
          setErrorMessage("Microphone access denied.");
        } else if (event.error === "no-speech") {
          // ignore transient quietness
        } else {
          setErrorMessage(`Voice input error: ${event.error}`);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    } catch (err) {
      console.error("Speech recognition initialization failed:", err);
      setIsSupported(false);
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          // ignore
        }
      }
    };
  }, [value, onValueChange]);

  const toggleListening = () => {
    if (!isSupported) {
      alert("Voice input is not supported in this browser. Please try Chrome, Edge, or Safari.");
      return;
    }

    setErrorMessage(null);

    if (isListening) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          // ignore
        }
      }
      setIsListening(false);
    } else {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
          setIsListening(true);
        } catch (err) {
          console.error("Failed to start speech recognition:", err);
          setIsListening(false);
        }
      }
    }
  };

  return (
    <div className={`flex flex-col gap-1.5 relative ${containerClassName}`}>
      {label && (
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-200">{label}</label>
          {isListening && (
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-[#FF002B]/20 border border-[#FF002B] rounded-full text-[10px] font-mono font-bold text-[#FF002B] animate-pulse">
              <span className="w-2 h-2 rounded-full bg-[#FF002B] animate-ping" />
              Listening...
            </span>
          )}
        </div>
      )}

      <div className="relative group">
        <textarea
          value={value}
          onChange={(e) => onValueChange(e.target.value)}
          rows={rows}
          placeholder={placeholder}
          className={`w-full p-3.5 pr-12 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-[#C1FF00] transition-all resize-y ${className}`}
          {...props}
        />

        {/* Voice-to-Text Dictation Button */}
        <button
          type="button"
          onClick={toggleListening}
          title={
            !isSupported
              ? "Voice input not supported in this browser"
              : isListening
              ? "Stop Voice Dictation"
              : "Start Voice-to-Text Dictation"
          }
          className={`absolute top-3 right-3 p-2 rounded-lg transition-all flex items-center justify-center ${
            isListening
              ? "bg-[#FF002B] text-white shadow-lg shadow-[#FF002B]/50 animate-bounce"
              : "bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-[#C1FF00] border border-slate-700 hover:border-[#C1FF00]/50"
          }`}
        >
          {isListening ? (
            <Mic className="w-4 h-4 stroke-[2.5]" />
          ) : (
            <Mic className="w-4 h-4" />
          )}
        </button>
      </div>

      {helperText && <p className="text-[11px] text-slate-400">{helperText}</p>}
      {errorMessage && (
        <p className="text-[11px] text-[#FF002B] font-medium">{errorMessage}</p>
      )}
    </div>
  );
};
