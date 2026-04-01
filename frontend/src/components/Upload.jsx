import { useState } from 'react';
import { uploadImage } from '../api';
import { UploadCloud, CheckCircle, AlertCircle } from 'lucide-react';

export default function Upload() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
      setResult(null);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    try {
      const res = await uploadImage(file);
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.detail || "Prediction failed");
    } finally {
      setLoading(false);
    }
  };

  const badgeClass = (label) => {
    switch(label) {
      case 'Pure': return 'pred-pure';
      case 'Adulterated': return 'pred-adulterated';
      case 'Glucose': return 'pred-glucose';
      case 'Pathogens': return 'pred-pathogens';
      default: return 'pred-default';
    }
  };

  return (
    <div className="sci-card w-full max-w-2xl mx-auto mt-6">
      <h2 className="sci-title flex items-center gap-2"><UploadCloud /> Upload Sample for AI Analysis</h2>
      
      <div className="flex flex-col items-center gap-6 py-6">
        <label className="border-2 border-dashed border-amber-cyandim w-full h-48 flex flex-col items-center justify-center rounded-xl cursor-pointer hover:bg-amber-cyandim/10 transition-colors">
          <UploadCloud size={48} className="text-amber-cyandim mb-4" />
          <span className="font-mono text-sm text-amber-cyan">Click or drag image file here</span>
          <span className="font-sans text-xs text-amber-muted mt-2">Supports JPG, PNG, BMP</span>
          <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
        </label>

        {preview && (
          <div className="w-full flex gap-4 mt-6 p-4 border border-amber-border rounded-lg bg-black/30">
            <img src={preview} alt="Sample Preview" className="h-48 object-contain bg-black rounded" />
            
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-amber-cyan font-mono text-xl">{file.name}</h3>
                <p className="text-amber-muted text-sm mt-1">Ready for classification</p>
              </div>
              
              {!result && !loading && (
                <button onClick={handleUpload} className="sci-btn-primary py-3 w-full mt-4 flex justify-center items-center gap-2">
                  <CheckCircle size={18}/> INITIALIZE SCAN
                </button>
              )}

              {loading && (
                <div className="flex flex-col items-center justify-center h-full text-amber-cyan font-mono animate-pulse gap-2">
                  <UploadCloud className="animate-bounce" size={32}/>
                  ANALYZING WITH TENSORFLOW...
                </div>
              )}

              {error && (
                <div className="text-red-500 font-mono text-sm flex items-center gap-2 mt-4 p-3 border border-red-500 rounded bg-red-500/10">
                  <AlertCircle size={16}/> {error}
                </div>
              )}

              {result && (
                <div className="mt-4 flex flex-col items-center p-4 bg-amber-surface2 rounded-lg border border-amber-border">
                  <div className={`pred-badge ${badgeClass(result.prediction_label)} text-xl px-8 py-3 w-full justify-center`}>
                    {result.prediction_label}
                  </div>
                  <div className="w-full mt-4">
                    <div className="flex justify-between font-mono text-xs text-amber-muted mb-1">
                      <span>CONFIDENCE</span>
                      <span className="text-amber-cyan">{(result.confidence * 100).toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-black rounded-full h-2 overflow-hidden border border-amber-border">
                      <div 
                        className="bg-amber-cyan h-2 rounded-full transition-all duration-1000" 
                        style={{ width: `${result.confidence * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
