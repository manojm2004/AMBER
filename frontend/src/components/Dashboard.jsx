import { useEffect, useState } from 'react';
import { getHistory, getStats, deleteHistory } from '../api';
import { BarChart3, Activity, Clock, FileWarning, ShieldCheck, Download, Trash2, X, Image as ImageIcon, Settings } from 'lucide-react';

export default function Dashboard() {
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Specific Row Modal States
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [histRes, statRes] = await Promise.all([getHistory(), getStats()]);
      setHistory(histRes.data);
      setStats(statRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDeleteRecord = async () => {
    if (!selectedRecord) return;
    setIsDeleting(true);
    try {
      await deleteHistory(selectedRecord.id);
      setSelectedRecord(null);
      fetchData(); // Refresh history and KPI counts
    } catch (err) {
      console.error("Failed to delete record:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const exportCSV = () => {
    if (!history.length) return;
    const token = localStorage.getItem('amber_token');
    
    // Open the direct API file stream in a new hidden tab safely
    const url = `http://localhost:8000/api/predictions/export_csv?token=${token}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  if (loading) return <div className="text-amber-cyan font-mono animate-pulse mt-10">EXTRACTING DATA...</div>;

  return (
    <div className="w-full relative">
      
      {/* HARDWARE VERIFICATION MODAL */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-[2px] animate-fade-in">
          <div className="bg-white border border-gray-200 w-full max-w-2xl rounded-2xl shadow-xl flex flex-col overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-gray-100 bg-gray-50">
              <h3 className="font-sans font-bold text-amber-primary text-sm tracking-wide flex items-center gap-2">
                <ImageIcon size={16}/> Record Inspection
              </h3>
              <button 
                onClick={() => setSelectedRecord(null)}
                className="text-gray-400 hover:text-amber-primary transition-colors"
              >
                <X size={20}/>
              </button>
            </div>
            
            <div className="p-6">
               <div className="flex flex-col md:flex-row gap-6">
                 <div className="w-full md:w-1/2 rounded-xl border border-gray-200 bg-gray-50 overflow-hidden relative aspect-square flex items-center justify-center shadow-inner">
                    <img 
                      src={`http://localhost:8000/api/predictions/image/${selectedRecord.filename}`} 
                      alt="Sample"
                      className="w-full h-full object-cover opacity-95 hover:opacity-100 transition-opacity"
                      onError={(e) => { 
                         e.target.style.display='none'; 
                         e.target.nextSibling.style.display='flex'; 
                      }}
                    />
                    <div className="hidden absolute inset-0 flex flex-col items-center justify-center text-gray-400 font-sans font-medium text-xs">
                       <FileWarning size={24} className="mb-2 opacity-50"/>
                       Image file missing
                    </div>
                 </div>
                 
                 <div className="w-full md:w-1/2 flex flex-col justify-center">
                    <p className="font-sans font-bold text-[10px] text-gray-400 uppercase tracking-widest mb-1">Filename</p>
                    <p className="font-sans font-medium text-sm text-amber-primary mb-6 truncate">{selectedRecord.filename}</p>

                    <p className="font-sans font-bold text-[10px] text-gray-400 uppercase tracking-widest mb-1">Timestamp</p>
                    <p className="font-sans font-medium text-sm text-amber-primary mb-6">{formatDate(selectedRecord.timestamp)}</p>

                    <p className="font-sans font-bold text-[10px] text-gray-400 uppercase tracking-widest mb-1">AI Classification</p>
                    <div className={`px-4 py-2 inline-block rounded-md font-sans font-bold tracking-wide text-xs mb-6 max-w-max shadow-sm ${selectedRecord.prediction_label === 'Pure' ? 'bg-[#E8F8EE] text-[#28C76F] border border-[#28C76F]/30' : selectedRecord.prediction_label === 'Glucose' ? 'bg-gray-100 text-gray-600 border border-gray-300' : selectedRecord.prediction_label === 'Pathogens' ? 'bg-[#F4EFFF] text-[#8B5CF6] border border-[#8B5CF6]/30' : 'bg-[#FDECEE] text-[#EA5455] border border-[#EA5455]/30'}`}>
                      {selectedRecord.prediction_label}
                    </div>

                    <p className="font-sans font-bold text-[10px] text-gray-400 uppercase tracking-widest mb-1">Confidence Score</p>
                    <div className="flex items-center gap-3">
                       <span className="font-sans font-bold text-lg text-amber-cyan">{(selectedRecord.confidence * 100).toFixed(1)}%</span>
                       <div className="h-1.5 flex-1 bg-gray-200 rounded-full overflow-hidden">
                         <div className="h-full bg-amber-cyan" style={{width: `${selectedRecord.confidence * 100}%`}}></div>
                       </div>
                    </div>
                 </div>
               </div>
            </div>
            
            <div className="p-5 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
               <span className="font-sans font-medium text-[11px] text-gray-400">ID: {selectedRecord.id}</span>
               
               <button 
                  onClick={handleDeleteRecord}
                  disabled={isDeleting}
                  className="px-4 py-2 bg-white hover:bg-[#FDECEE] text-amber-red border border-gray-300 hover:border-amber-red rounded-lg font-sans text-xs font-bold transition-all flex items-center gap-2 disabled:opacity-50 shadow-sm"
               >
                 <Trash2 size={14}/> {isDeleting ? 'Erasing...' : 'Delete Record'}
               </button>
            </div>
          </div>
        </div>
      )}

      {/* 5-Column KPIs Matching app.py */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <div className="flex flex-col items-center justify-center p-5 bg-white border border-gray-200 rounded-2xl shadow-sm">
          <div className="font-sans text-2xl text-blue-500 font-extrabold leading-none mb-2">{stats?.total || 0}</div>
          <h3 className="font-sans text-[11px] font-bold text-gray-400 uppercase tracking-wider">Total Samples</h3>
        </div>
        <div className="flex flex-col items-center justify-center p-5 bg-white border border-gray-200 rounded-2xl shadow-sm">
          <div className="font-sans text-2xl text-[#28C76F] font-extrabold leading-none mb-2">{stats?.breakdown?.Pure || 0}</div>
          <h3 className="font-sans text-[11px] font-bold text-gray-400 uppercase tracking-wider">Pure Milk</h3>
        </div>
        <div className="flex flex-col items-center justify-center p-5 bg-white border border-gray-200 rounded-2xl shadow-sm">
          <div className="font-sans text-2xl text-[#EA5455] font-extrabold leading-none mb-2">{stats?.breakdown?.Adulterated || 0}</div>
          <h3 className="font-sans text-[11px] font-bold text-gray-400 uppercase tracking-wider">Adulterated</h3>
        </div>
        <div className="flex flex-col items-center justify-center p-5 bg-white border border-gray-200 rounded-2xl shadow-sm">
          <div className="font-sans text-2xl text-gray-500 font-extrabold leading-none mb-2">{stats?.breakdown?.Glucose || 0}</div>
          <h3 className="font-sans text-[11px] font-bold text-gray-400 uppercase tracking-wider">Glucose</h3>
        </div>
        <div className="flex flex-col items-center justify-center p-5 bg-white border border-gray-200 rounded-2xl shadow-sm">
          <div className="font-sans text-2xl text-[#8B5CF6] font-extrabold leading-none mb-2">{stats?.breakdown?.Pathogens || 0}</div>
          <h3 className="font-sans text-[11px] font-bold text-gray-400 uppercase tracking-wider">Pathogens</h3>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Table Area */}
        <div className="w-full lg:w-2/3">
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm h-full flex flex-col overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50">
              <div className="flex flex-col">
                 <h2 className="font-sans font-bold text-lg text-amber-primary flex items-center gap-2">
                   <Clock size={18} className="text-blue-500" /> Recent Timeline
                 </h2>
                 <span className="font-sans font-medium text-[11px] text-gray-400 mt-1">Select a row to inspect or delete</span>
              </div>
              <button onClick={exportCSV} disabled={!history.length} className="flex items-center gap-2 py-1.5 px-4 bg-white border border-gray-200 text-amber-primary hover:border-blue-400 hover:text-blue-500 font-sans font-semibold text-xs rounded-lg shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                 <Download size={14}/> Export CSV
              </button>
            </div>

            <div className="overflow-x-auto flex-1">
              <table className="w-full text-left font-sans text-sm">
                <thead className="bg-white border-b border-gray-100 text-gray-500 uppercase text-[10px] font-bold tracking-wider">
                  <tr>
                    <th className="px-6 py-4">Timestamp</th>
                    <th className="px-6 py-4">Filename</th>
                    <th className="px-6 py-4">Prediction</th>
                    <th className="px-6 py-4">Confidence</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-amber-primary font-medium">
                  {history.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="text-center py-12 text-gray-400">No records found in the archive.</td>
                    </tr>
                  ) : history.slice(0, 15).map((row) => (
                    <tr 
                      key={row.id} 
                      onClick={() => setSelectedRecord(row)}
                      className="hover:bg-blue-50/50 cursor-pointer transition-colors group"
                    >
                      <td className="px-6 py-4 text-gray-500 group-hover:text-amber-primary transition-colors text-xs">{formatDate(row.timestamp)}</td>
                      <td className="px-6 py-4 truncate max-w-[150px] text-xs">{row.filename}</td>
                      <td className="px-6 py-4 text-xs font-bold">
                        <span className={`inline-block w-2.5 h-2.5 rounded-full mr-2 ${row.prediction_label === 'Pure' ? 'bg-[#28C76F]' : row.prediction_label === 'Glucose' ? 'bg-gray-400' : row.prediction_label === 'Pathogens' ? 'bg-[#8B5CF6]' : 'bg-[#EA5455]'}`}></span>
                        {row.prediction_label}
                      </td>
                      <td className="px-6 py-4 flex items-center gap-3">
                        <span className="font-bold text-xs text-blue-500">
                          {(row.confidence * 100).toFixed(1)}%
                        </span>
                        <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden hidden sm:block">
                          <div className="h-full bg-blue-500" style={{ width: `${row.confidence * 100}%` }}></div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {history.length > 15 && <div className="text-center text-gray-400 text-xs font-sans font-medium py-4 bg-gray-50 border-t border-gray-100">+ {history.length - 15} older records available in CSV export</div>}
            </div>
          </div>
        </div>

        {/* Right Sidebar: Model Performance matching app.py */}
        <div className="w-full lg:w-1/3 flex flex-col gap-8">
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
            <h2 className="font-sans font-bold text-lg text-amber-primary flex items-center gap-2 mb-6 pb-4 border-b border-gray-100">
              <Settings size={18} className="text-blue-500" /> Model Parameters
            </h2>
            <div className="flex flex-col gap-1">
              <div className="flex justify-between items-center py-3">
                <span className="font-sans font-semibold text-xs text-gray-500">Validation Accuracy</span>
                <span className="font-sans text-sm text-amber-cyan font-bold bg-blue-50 px-2 py-1 rounded">86.81%</span>
              </div>
              <div className="flex justify-between items-center py-3">
                <span className="font-sans font-semibold text-xs text-gray-500">Training Accuracy</span>
                <span className="font-sans text-sm text-green-500 font-bold bg-[#E8F8EE] px-2 py-1 rounded">99.13%</span>
              </div>
              <div className="flex justify-between items-center py-3">
                <span className="font-sans font-semibold text-xs text-gray-500">Parameters</span>
                <span className="font-sans text-sm text-amber-primary font-bold">17.1M</span>
              </div>
              <div className="flex justify-between items-center py-3">
                <span className="font-sans font-semibold text-xs text-gray-500">Input Size</span>
                <span className="font-sans text-sm text-amber-primary font-bold">128 × 128</span>
              </div>
              <div className="flex justify-between items-center py-3">
                <span className="font-sans font-semibold text-xs text-gray-500">Classes</span>
                <span className="font-sans text-sm text-amber-primary font-bold">4</span>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 text-center flex flex-col justify-center items-center">
            <Activity size={28} className="text-blue-400 mb-3"/>
            <span className="font-sans font-bold text-[11px] text-gray-500 uppercase tracking-widest">Inference engine online</span>
          </div>
        </div>
      </div>
    </div>
  );
}
