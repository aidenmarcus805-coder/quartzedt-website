"use client";

import { useEffect, useState } from "react";
import { Mic, MicOff } from "lucide-react";

export const OwnerVoiceCommander = () => {
    const [listening, setListening] = useState(false);
    const [transcript, setTranscript] = useState("");

    useEffect(() => {
        // Native browser web speech API - No external deps
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            console.warn("Speech recognition not supported in this browser.");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
            setListening(true);
        };

        recognition.onresult = (event: any) => {
            let interimTranscript = '';
            let finalTranscript = '';

            for (let i = event.resultIndex; i < event.results.length; ++i) {
                const res = event.results[i];
                if (!res || !res[0]) continue;
                
                if (res.isFinal) {
                    finalTranscript += res[0].transcript;
                } else {
                    interimTranscript += res[0].transcript;
                }
            }

            if (finalTranscript) {
                 setTranscript(finalTranscript);
                 processVoiceCommand(finalTranscript.toLowerCase());
            }
        };

        recognition.onerror = (event: any) => {
            console.error("Speech Recognition Error", event.error);
            setListening(false);
        };

        recognition.onend = () => {
             // Basic auto-restart logic keeping the mic hot
             if (listening) {
                 try { recognition.start(); } catch(e){}
             }
        };

        if (listening) {
             try { recognition.start(); } catch(e){}
        } else {
             recognition.stop();
        }

        return () => {
            recognition.stop();
        };

    }, [listening]);

    const processVoiceCommand = async (command: string) => {
         // Example local intent parsing. In production, this would hit logic handling
         if (command.includes("claw") || command.includes("agent")) {
             
             if (command.includes("show marketing drafts") || command.includes("priority marketing")) {
                 window.location.href = "/dashboard/owner/marketing";
             } else if (command.includes("approve top")) {
                 console.log("Mocking: Approving top feed outputs via Voice.");
             } else {
                 // Push the command to the swarm chat natively
                 try {
                     await fetch("/api/claws/command", {
                         method: "POST",
                         headers: { "Content-Type": "application/json" },
                         body: JSON.stringify({ 
                             channelId: "global-swarm-main", 
                             content: `(Voice Intel) ${command}` 
                         })
                     });
                 } catch(err) {
                    console.error(err);
                 }
             }
         }
    };

    return (
        <button 
           onClick={() => setListening(!listening)}
           className={`fixed bottom-6 right-6 p-4 rounded-full shadow-2xl transition-all duration-300 z-50 flex items-center justify-center 
              ${listening ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse' : 'bg-slate-800 hover:bg-slate-900 text-white'}
           `}
           title="Toggle KiloClaw Voice Command"
        >
            {listening ? <Mic size={20} /> : <MicOff size={20} />}
        </button>
    );
};
