import { useState, useEffect, useRef } from 'react';
import { uploadImage, getHistory } from '../api';
import { Camera, Activity, Aperture, AlertTriangle, Settings } from 'lucide-react';

export default function LiveCapture() {
  const [liveHistory, setLiveHistory] = useState([]);
  const [latestScan, setLatestScan] = useState(null);
  const [cameraError, setCameraError] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  
  // Camera Selection State
  const [cameras, setCameras] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState("");
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  // Fetch media devices
  const loadDevices = async () => {
    try {
      // Request base permission first to get hardware labels
      await navigator.mediaDevices.getUserMedia({ video: true });
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoInputs = devices.filter(device => device.kind === 'videoinput');
      
      setCameras(videoInputs);
      
      // Look strictly for a guaranteed microscope or USB device
      let explicitMicroscope = videoInputs.find(d => 
        d.label.toLowerCase().includes('microscope') || 
        d.label.toLowerCase().includes('usb') ||
        d.label.toLowerCase().includes('external')
      );
      
      if (explicitMicroscope) {
        setSelectedDeviceId(explicitMicroscope.deviceId);
        startCamera(explicitMicroscope.deviceId);
      } else {
        // DO NOT auto-start the laptop camera. 
        setCameraError("MICROSCOPE NOT CONFIRMED: Please select your digital microscope from the dropdown above.");
        setSelectedDeviceId(""); // Clear selection so it doesn't auto-boot the wrong one
        if (videoRef.current) {
           videoRef.current.srcObject = null;
        }
      }
    } catch (err) {
      setCameraError("Unable to access recording devices or permissions denied.");
    }
  };

  // Initialize history and available cameras
  useEffect(() => {
    getHistory().then(res => {
      const hist = res.data.slice(0, 10);
      setLiveHistory(hist);
      if (hist.length > 0) setLatestScan(hist[0]);
    }).catch(err => console.error("Initial load failed", err));
    
    loadDevices();

    // Cleanup camera feed on dismount
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // When dropdown changes, restart camera
  useEffect(() => {
    if (selectedDeviceId) {
      startCamera(selectedDeviceId);
    }
  }, [selectedDeviceId]);

  // Listen for physical Microscope Snap Button (simulated as keypresses)
  useEffect(() => {
    const handleSnap = (e) => {
      if (document.activeElement && (document.activeElement.tagName === "INPUT" || document.activeElement.tagName === "TEXTAREA")) return;
      
      // USB Microscopes often simulate Enter, Space, or special Camera media keys
      if (e.code === 'Space' || e.code === 'Enter' || e.key === 'Camera' || e.key === 'MediaPlayPause') {
        e.preventDefault();
        const btn = document.getElementById('hardware-snap-btn');
        if (btn && !btn.disabled) btn.click();
      }
    };
    window.addEventListener('keydown', handleSnap);
    return () => window.removeEventListener('keydown', handleSnap);
  }, []);

  const startCamera = async (deviceId) => {
    try {
      // Stop old stream if running
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      
      const constraints = { 
        video: { 
          deviceId: deviceId ? { exact: deviceId } : undefined,
          width: { ideal: 1920 }, 
          height: { ideal: 1080 }
        } 
      };
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCameraError(null);
    } catch (err) {
      console.error("Camera access denied or missing", err);
      setCameraError("Unable to access the selected Microscope Camera.");
    }
  };

  const handleCapture = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    setIsScanning(true);
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(async (blob) => {
      if (!blob) {
        setIsScanning(false);
        return;
      }

      const file = new File([blob], `microscope_capture_${new Date().getTime()}.jpg`, { type: 'image/jpeg' });
      
      try {
        const res = await uploadImage(file);
        const newRecord = res.data;
        
        setLiveHistory(prev => [newRecord, ...prev].slice(0, 10));
        setLatestScan(newRecord);
      } catch (err) {
        console.error("Prediction failed:", err);
      } finally {
        setIsScanning(false);
      }
    }, 'image/jpeg', 0.95);
  };

  const badgeClass = (label) => {
    switch(label) {
      case 'Pure': return 'bg-amber-green text-black';
      case 'Adulterated': return 'bg-red-500 text-white';
      case 'Glucose': return 'bg-gray-400 text-black';
      case 'Pathogens': return 'bg-amber-purple text-white';
      default: return 'bg-gray-600 text-white';
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleString();
  };

  return (
    <div className="flex flex-col md:flex-row gap-8">
      {/* LEFT COLUMN: Hardware Camera Feed */}
      <div className="flex-1">
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 min-h-[400px]">
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
            <h2 className="font-sans font-bold text-amber-primary text-sm tracking-wide uppercase flex items-center gap-2">
              <Camera size={20} className="text-blue-500"/> Digital Microscope Feed
            </h2>
            <div className="flex items-center gap-4">
               {/* Hardware Selection Dropdown */}
               {cameras.length > 0 && (
                 <div className="flex items-center gap-2">
                   <Settings size={16} className="text-gray-400" />
                   <select 
                     className="bg-gray-50 border border-gray-200 text-amber-primary text-xs font-sans font-medium rounded-md px-3 py-1.5 outline-none focus:border-blue-400 transition-colors"
                     value={selectedDeviceId}
                     onChange={(e) => setSelectedDeviceId(e.target.value)}
                   >
                     {cameras.map((cam, idx) => (
                       <option key={cam.deviceId} value={cam.deviceId}>
                         {cam.label || `USB Camera ${idx + 1}`}
                       </option>
                     ))}
                   </select>
                 </div>
               )}
               <div className="flex items-center gap-2 text-xs font-sans font-bold text-gray-500 border-l border-gray-200 pl-4 uppercase tracking-wider">
                 <div className={`w-2.5 h-2.5 rounded-full ${cameraError ? 'bg-amber-red shadow-sm' : 'bg-amber-green animate-pulse shadow-[0_0_8px_#28C76F]'}`}></div> 
                 {cameraError ? 'Hardware Error' : 'Streaming Live'}
               </div>
            </div>
          </div>
          
          <div className="flex flex-col items-center">
            
            {/* The Actual Video Feed */}
            <div className="w-full relative bg-gray-900 border border-gray-200 rounded-xl overflow-hidden flex items-center justify-center mb-6 aspect-video shadow-inner">
               <div className="absolute inset-0 bg-blue-500/5 border-2 border-blue-500/20 m-3 rounded-lg pointer-events-none z-10"></div>
               
               {/* Targeting Crosshairs UI element overlay */}
               <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20 opacity-70">
                 <div className="w-8 h-8 md:w-16 md:h-16 border-2 border-dashed border-white/50 rounded-full"></div>
                 <div className="w-1 h-2 md:h-4 bg-white/50 absolute top-1/2 -mt-1 md:-mt-2 left-1/4"></div>
                 <div className="w-1 h-2 md:h-4 bg-white/50 absolute top-1/2 -mt-1 md:-mt-2 right-1/4"></div>
                 <div className="w-2 md:w-4 h-1 bg-white/50 absolute top-1/4 left-1/2 -ml-1 md:-ml-2"></div>
                 <div className="w-2 md:w-4 h-1 bg-white/50 absolute bottom-1/4 left-1/2 -ml-1 md:-ml-2"></div>
               </div>

               {cameraError ? (
                 <div className="flex flex-col items-center text-amber-red font-sans font-medium text-sm max-w-sm text-center p-6 bg-[#FDECEE] border border-amber-red/30 rounded-xl z-30 shadow-lg">
                   <AlertTriangle className="mb-3" size={36} />
                   <span>{cameraError}</span>
                   <button onClick={() => loadDevices()} className="mt-5 px-5 py-2.5 bg-white border border-gray-300 rounded-lg hover:border-amber-red hover:text-amber-red text-amber-primary font-bold transition-colors shadow-sm">
                     RESCAN HARDWARE PORTS
                   </button>
                 </div>
               ) : (
                 <video 
                   ref={videoRef} 
                   autoPlay 
                   playsInline 
                   muted 
                   className={`w-full h-full object-cover transition-opacity duration-300 ${isScanning ? 'opacity-50 blur-sm' : 'opacity-100'}`} 
                 />
               )}
            </div>
            
            {/* Hidden Canvas used for snapping the picture accurately */}
            <canvas ref={canvasRef} className="hidden" />
            
            {/* Capture Action Bar */}
            <div className="w-full flex items-center gap-4">
              <button 
                 id="hardware-snap-btn"
                 onClick={handleCapture}
                 disabled={!!cameraError || isScanning}
                 className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-sans font-bold py-4 rounded-xl flex justify-center items-center gap-3 transition-colors shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wide"
              >
                 <Aperture className={isScanning ? "animate-spin" : ""} size={20}/> 
                 {isScanning ? 'Processing inference model...' : 'Capture & Analyze Sample'}
              </button>
            </div>

            {/* Below Camera: The latest result breakdown */}
            {latestScan && (
              <div className="w-full mt-6 bg-gray-50 border border-gray-200 rounded-xl p-5 flex items-center justify-between shadow-sm">
                <div>
                  <div className="font-sans font-bold text-gray-400 text-[10px] tracking-wider uppercase mb-2">Last Capture Result</div>
                  <div className={`px-4 py-1.5 inline-flex rounded-md font-sans font-bold tracking-wide text-sm shadow-sm ${badgeClass(latestScan.prediction_label)}`}>
                    {latestScan.prediction_label}
                  </div>
                </div>
                <div className="text-right ml-8 min-w-[150px]">
                  <div className="font-sans font-bold text-gray-400 text-[10px] tracking-wider uppercase mb-1">Confidence Score</div>
                  <div className="flex items-center justify-end gap-3">
                    <span className="font-sans font-bold text-blue-600 text-lg">{(latestScan.confidence * 100).toFixed(1)}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mt-1">
                    <div className="h-full bg-blue-500 transition-all duration-500" style={{width: `${latestScan.confidence * 100}%`}}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: Timeline */}
      <div className="w-full md:w-1/3 flex flex-col gap-6">
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 flex flex-col h-full">
           <h2 className="font-sans font-bold text-lg text-amber-primary flex items-center gap-2 mb-6 pb-4 border-b border-gray-100">
             <Activity size={18} className="text-blue-500" /> Recent Captures
           </h2>
           <div className="flex flex-col gap-3 flex-1 overflow-y-auto pr-2">
             {liveHistory.map((rec, index) => (
                <div key={rec.id || index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-blue-200 transition-all shadow-sm">
                  <div className={`w-2.5 h-2.5 rounded-full ${rec.prediction_label === 'Pure' ? 'bg-[#28C76F]' : 'bg-[#EA5455]'}`}></div>
                  <div className="flex-1 overflow-hidden">
                     <div className="font-sans font-bold text-[10px] text-gray-400 uppercase tracking-wider mb-1">{formatDate(rec.timestamp)}</div>
                     <div className="font-sans font-bold text-sm text-amber-primary truncate">{rec.filename}</div>
                  </div>
                  <div className={`font-sans font-bold text-xs uppercase tracking-wide ${rec.prediction_label === 'Pure' ? 'text-[#28C76F]' : 'text-[#EA5455]'}`}>
                    {rec.prediction_label}
                  </div>
                </div>
             ))}
             {liveHistory.length === 0 && (
                <div className="text-center font-sans font-medium text-sm text-gray-400 mt-8">No recent captures available.</div>
             )}
           </div>
        </div>
      </div>
    </div>
  );
}
