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
    <div className="w-full max-w-2xl mx-auto mt-6 p-8 rounded-2xl" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-card)' }}>
      <h2 className="font-sans font-bold text-xl text-amber-primary flex items-center gap-3 border-b border-gray-100 pb-4">
        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
           <UploadCloud size={20} />
        </div>
        Upload Sample for AI Analysis
      </h2>
      
      <div className="flex flex-col items-center gap-6 pt-6">
        <label className="border-2 border-dashed w-full h-56 flex flex-col items-center justify-center rounded-2xl cursor-pointer transition-all group"
          style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border)' }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = '#3A7DFF'; e.currentTarget.style.backgroundColor = 'rgba(58,125,255,0.05)'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.backgroundColor = 'var(--bg-secondary)'; }}
        >
          <UploadCloud size={48} className="text-gray-400 group-hover:text-blue-500 mb-4 transition-colors" />
          <span className="font-sans font-bold text-sm text-amber-primary">Click or drag image file here</span>
          <span className="font-sans font-medium text-xs text-gray-500 mt-2">Supports JPG, PNG, BMP</span>
          <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
        </label>

        {preview && (
          <div className="w-full flex flex-col sm:flex-row gap-6 mt-4 p-6 rounded-2xl" style={{ border: '1px solid var(--border)', backgroundColor: 'var(--bg-card)', boxShadow: 'var(--shadow-card)' }}>
            <img src={preview} alt="Sample Preview" className="h-48 w-full sm:w-48 object-cover rounded-xl" style={{ backgroundColor: 'var(--bg-secondary)' }} />
            
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-amber-primary font-sans font-bold text-lg truncate max-w-[250px]">{file.name}</h3>
                <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mt-1">Ready for classification</p>
              </div>
              
              {!result && !loading && (
                <button onClick={handleUpload} className="bg-blue-600 hover:bg-blue-700 text-white font-sans font-bold py-3.5 rounded-xl w-full mt-4 flex justify-center items-center gap-2 shadow-md hover:shadow-lg transition-all tracking-wide uppercase">
                  <CheckCircle size={18}/> Initialize Scan
                </button>
              )}

              {loading && (
                <div className="flex flex-col items-center justify-center h-full text-blue-500 font-sans font-bold animate-pulse gap-3 text-sm tracking-wide uppercase">
                  <UploadCloud className="animate-bounce" size={28}/>
                  Analyzing with AI Model...
                </div>
              )}

              {error && (
                <div className="text-amber-red font-sans font-semibold text-sm flex items-center gap-2 mt-4 p-4 border border-amber-red/30 rounded-xl bg-[#FDECEE] shadow-sm">
                  <AlertCircle size={18}/> {error}
                </div>
              )}

              {result && (
                <div className="mt-4 flex flex-col items-center p-5 rounded-xl" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
                  <div className={`pred-badge ${badgeClass(result.prediction_label)} text-xl px-8 py-3 w-full justify-center shadow-sm`}>
                    {result.prediction_label}
                  </div>
                  <div className="w-full mt-5">
                    <div className="flex justify-between font-sans font-bold text-[10px] text-gray-500 mb-2 uppercase tracking-widest">
                      <span>Confidence Score</span>
                      <span className="text-blue-600 text-sm">{(result.confidence * 100).toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div 
                        className="bg-blue-500 h-2 rounded-full transition-all duration-1000" 
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
