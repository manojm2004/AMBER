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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-amber-surface border border-amber-border w-full max-w-2xl rounded-lg shadow-[0_0_30px_rgba(0,188,212,0.15)] flex flex-col overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-amber-border/50 bg-black/40">
              <h3 className="font-mono text-amber-cyan text-sm tracking-widest flex items-center gap-2">
                <ImageIcon size={16}/> RECORD INSPECTION
              </h3>
              <button 
                onClick={() => setSelectedRecord(null)}
                className="text-amber-muted hover:text-white transition-colors"
              >
                <X size={20}/>
              </button>
            </div>
            
            <div className="p-6">
               <div className="flex flex-col md:flex-row gap-6">
                 <div className="w-full md:w-1/2 rounded border border-amber-border/50 bg-black overflow-hidden relative aspect-square flex items-center justify-center">
                    <img 
                      src={`http://localhost:8000/api/predictions/image/${selectedRecord.filename}`} 
                      alt="Sample"
                      className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity"
                      onError={(e) => { 
                         e.target.style.display='none'; 
                         e.target.nextSibling.style.display='flex'; 
                      }}
                    />
                    <div className="hidden absolute inset-0 flex flex-col items-center justify-center text-amber-muted font-mono text-xs">
                       <FileWarning size={24} className="mb-2 opacity-50"/>
                       IMAGE FILE NO LONGER ON DISK
                    </div>
                 </div>
                 
                 <div className="w-full md:w-1/2 flex flex-col justify-center">
                    <p className="font-mono text-[10px] text-amber-muted tracking-widest mb-1">FILENAME</p>
                    <p className="font-mono text-sm text-amber-white mb-6 truncate">{selectedRecord.filename}</p>

                    <p className="font-mono text-[10px] text-amber-muted tracking-widest mb-1">TIMESTAMP</p>
                    <p className="font-mono text-sm text-amber-white mb-6">{formatDate(selectedRecord.timestamp)}</p>

                    <p className="font-mono text-[10px] text-amber-muted tracking-widest mb-1">AI DETECTED</p>
                    <div className={`px-4 py-2 inline-block rounded font-mono font-bold tracking-widest text-sm mb-6 max-w-max shadow-md ${selectedRecord.prediction_label === 'Pure' ? 'bg-amber-green text-black' : selectedRecord.prediction_label === 'Glucose' ? 'bg-[#aaaaaa] text-black' : selectedRecord.prediction_label === 'Pathogens' ? 'bg-amber-purple text-white' : 'bg-red-500 text-white'}`}>
                      {selectedRecord.prediction_label}
                    </div>

                    <p className="font-mono text-[10px] text-amber-muted tracking-widest mb-1">CONFIDENCE</p>
                    <div className="flex items-center gap-3">
                       <span className="font-mono text-lg text-amber-cyan">{(selectedRecord.confidence * 100).toFixed(1)}%</span>
                       <div className="h-1.5 flex-1 bg-black rounded-full overflow-hidden">
                         <div className="h-full bg-amber-cyan" style={{width: `${selectedRecord.confidence * 100}%`}}></div>
                       </div>
                    </div>
                 </div>
               </div>
            </div>
            
            <div className="p-4 bg-black/40 border-t border-amber-border/50 flex justify-between items-center">
               <span className="font-mono text-[10px] text-amber-muted">ID: {selectedRecord.id}</span>
               
               <button 
                  onClick={handleDeleteRecord}
                  disabled={isDeleting}
                  className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/50 hover:border-red-500 rounded font-mono text-xs font-bold tracking-widest transition-all flex items-center gap-2 disabled:opacity-50"
               >
                 <Trash2 size={14}/> {isDeleting ? 'ERASING...' : 'DELETE RECORD FOREVER'}
               </button>
            </div>
          </div>
        </div>
      )}

      {/* 5-Column KPIs Matching app.py */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        <div className="sci-card flex flex-col items-center justify-center p-4 bg-black/50 border-amber-border">
          <div className="font-mono text-2xl text-amber-cyan font-bold leading-none mb-1">{stats?.total || 0}</div>
          <h3 className="font-mono text-[11px] text-amber-muted uppercase tracking-widest">Total Samples</h3>
        </div>
        <div className="sci-card flex flex-col items-center justify-center p-4 bg-black/50 border-amber-border">
          <div className="font-mono text-2xl text-amber-green font-bold leading-none mb-1">{stats?.breakdown?.Pure || 0}</div>
          <h3 className="font-mono text-[11px] text-amber-muted uppercase tracking-widest">Pure Milk</h3>
        </div>
        <div className="sci-card flex flex-col items-center justify-center p-4 bg-black/50 border-amber-border">
          <div className="font-mono text-2xl text-red-500 font-bold leading-none mb-1">{stats?.breakdown?.Adulterated || 0}</div>
          <h3 className="font-mono text-[11px] text-amber-muted uppercase tracking-widest">Adulterated</h3>
        </div>
        <div className="sci-card flex flex-col items-center justify-center p-4 bg-black/50 border-amber-border">
          <div className="font-mono text-2xl text-[#aaaaaa] font-bold leading-none mb-1">{stats?.breakdown?.Glucose || 0}</div>
          <h3 className="font-mono text-[11px] text-amber-muted uppercase tracking-widest">Glucose</h3>
        </div>
        <div className="sci-card flex flex-col items-center justify-center p-4 bg-black/50 border-amber-border">
          <div className="font-mono text-2xl text-amber-purple font-bold leading-none mb-1">{stats?.breakdown?.Pathogens || 0}</div>
          <h3 className="font-mono text-[11px] text-amber-muted uppercase tracking-widest">Pathogens</h3>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main Table Area */}
        <div className="w-full lg:w-2/3">
          <div className="sci-card bg-black/40 h-full">
            <div className="flex justify-between items-center mb-6">
              <div className="flex flex-col">
                 <h2 className="sci-title border-none m-0 p-0 flex items-center gap-2 text-amber-cyan-dim">
                   <Clock size={16} /> RECENT TIMELINE
                 </h2>
                 <span className="font-mono text-[10px] text-amber-muted tracking-widest mt-1">CLICK ANY ROW TO VIEW AND DELETE</span>
              </div>
              <button onClick={exportCSV} disabled={!history.length} className="sci-btn flex items-center gap-2 py-1 text-xs px-3 disabled:opacity-50 disabled:cursor-not-allowed">
                 <Download size={14}/> EXPORT CSV
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-sm">
                <thead className="text-amber-cyandim border-b border-amber-border uppercase text-xs tracking-wider">
                  <tr>
                    <th className="px-4 py-3">Timestamp</th>
                    <th className="px-4 py-3">Filename</th>
                    <th className="px-4 py-3">Prediction</th>
                    <th className="px-4 py-3">Confidence</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-amber-border/50 text-amber-white">
                  {history.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="text-center py-8 text-amber-muted">NO DATA FOUND IN ARCHIVE</td>
                    </tr>
                  ) : history.slice(0, 15).map((row) => (
                    <tr 
                      key={row.id} 
                      onClick={() => setSelectedRecord(row)}
                      className="hover:bg-amber-cyan/10 cursor-pointer transition-colors group"
                    >
                      <td className="px-4 py-3 text-amber-muted group-hover:text-amber-white transition-colors text-xs">{formatDate(row.timestamp)}</td>
                      <td className="px-4 py-3 truncate max-w-[150px] text-xs">{row.filename}</td>
                      <td className="px-4 py-3 text-xs">
                        <span className={`inline-block w-2 h-2 rounded-full mr-2 ${row.prediction_label === 'Pure' ? 'bg-amber-green' : row.prediction_label === 'Glucose' ? 'bg-[#aaaaaa]' : row.prediction_label === 'Pathogens' ? 'bg-amber-purple' : 'bg-red-500'}`}></span>
                        {row.prediction_label}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className={`${row.confidence > 0.9 ? 'text-amber-cyan' : 'text-amber-muted group-hover:text-amber-cyan'} transition-colors text-xs`}>
                            {(row.confidence * 100).toFixed(1)}%
                          </span>
                          <div className="w-12 h-1 bg-black rounded-full overflow-hidden hidden sm:block">
                            <div className="h-full bg-amber-cyan" style={{ width: `${row.confidence * 100}%` }}></div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {history.length > 15 && <div className="text-center text-amber-muted text-xs font-mono mt-4 pt-4 border-t border-amber-border/50">+ {history.length - 15} Older Records Hidden</div>}
            </div>
          </div>
        </div>

        {/* Right Sidebar: Model Performance matching app.py */}
        <div className="w-full lg:w-1/3 flex flex-col gap-6">
          <div className="sci-card bg-black/40 h-max">
            <h2 className="sci-title border-b border-amber-border pb-3 m-0 flex items-center gap-2 text-amber-cyan-dim">
              <Settings size={16} /> MODEL PERFORMANCE
            </h2>
            <div className="flex flex-col mt-4">
              <div className="flex justify-between items-center py-3 border-b border-amber-border/50">
                <span className="font-mono text-xs text-amber-white">Validation Accuracy</span>
                <span className="font-mono text-sm text-amber-cyan font-bold">86.81%</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-amber-border/50">
                <span className="font-mono text-xs text-amber-white">Training Accuracy</span>
                <span className="font-mono text-sm text-amber-cyan font-bold">99.13%</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-amber-border/50">
                <span className="font-mono text-xs text-amber-white">Parameters</span>
                <span className="font-mono text-sm text-amber-cyan font-bold">17.1M</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-amber-border/50">
                <span className="font-mono text-xs text-amber-white">Input Size</span>
                <span className="font-mono text-sm text-amber-cyan font-bold">128 × 128</span>
              </div>
              <div className="flex justify-between items-center py-3">
                <span className="font-mono text-xs text-amber-white">Classes</span>
                <span className="font-mono text-sm text-amber-cyan font-bold">4</span>
              </div>
            </div>
          </div>
          
          {/* We can place the visual breakdowns here too maybe? Or keep it simple. */}
          <div className="sci-card bg-amber-cyan/5 border-amber-cyan/30 text-center h-full flex flex-col justify-center border-dashed">
            <Activity size={24} className="mx-auto text-amber-muted opacity-50 mb-2"/>
            <span className="font-mono text-[10px] text-amber-muted tracking-widest">AMBER ML ENGINE ACTIVE</span>
          </div>
        </div>
      </div>
    </div>
  );
}
