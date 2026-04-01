import uvicorn
import multiprocessing

if __name__ == "__main__":
    # In production, use multithreaded workers to prevent event loop bottlenecks
    # The default math is 2 workers per cpu core + 1. We will use a baseline of 4 for a typical server.
    
    # We strip out 'reload=True' entirely as it causes severe memory leaks in production handling
    workers = max(4, multiprocessing.cpu_count() * 2 + 1)
    
    print(f"--- AMBER PRODUCTION SERVER BOOTING ---")
    print(f"Assigning {workers} Independent Concurrency Workers...")
    
    uvicorn.run(
        "backend.main:app", 
        host="0.0.0.0", 
        port=8000, 
        workers=workers,
        log_level="info",
        proxy_headers=True,
        forwarded_allow_ips="*"
    )
