import streamlit as st
import os
import time
import numpy as np
import tensorflow as tf
from streamlit_autorefresh import st_autorefresh
from datetime import datetime

try:
    import cv2
except ImportError:
    try:
        import subprocess
        subprocess.check_call(["pip", "install", "opencv-python-headless==4.8.0.74"])
        import cv2
    except Exception as e:
        st.error(f"Failed to import OpenCV: {e}")
        st.stop()

st.set_page_config(
    page_title="AMBER",
    page_icon="🔬",
    layout="wide",
    initial_sidebar_state="collapsed"
)

# ─────────────────────────────────────────────
#  GLOBAL CSS — Professional Scientific Theme
# ─────────────────────────────────────────────
st.markdown("""
<style>
@import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=DM+Sans:wght@300;400;500;600&display=swap');

/* ── Base ── */
:root {
    --bg:        #050c10;
    --surface:   #0a1a22;
    --surface2:  #0f2330;
    --border:    #1a3a4a;
    --cyan:      #00d4ff;
    --cyan-dim:  #007a99;
    --cyan-glow: rgba(0,212,255,0.15);
    --green:     #00e676;
    --red:       #ff4d4d;
    --purple:    #b06ef3;
    --white:     #e8f4f8;
    --muted:     #4a7a8a;
    --mono:      'Space Mono', monospace;
    --sans:      'DM Sans', sans-serif;
}

html, body, [class*="css"] {
    background-color: var(--bg) !important;
    color: var(--white) !important;
    font-family: var(--sans) !important;
}

/* Hide Streamlit chrome */
#MainMenu, footer, header { visibility: hidden; }
.block-container { padding: 1.5rem 2rem 1rem 2rem !important; }

/* ── Top header bar ── */
.amber-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 24px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 12px;
    margin-bottom: 20px;
}
.amber-logo {
    font-family: var(--mono);
    font-size: 22px;
    font-weight: 700;
    color: var(--cyan);
    letter-spacing: 4px;
}
.amber-logo span {
    color: var(--muted);
    font-size: 14px;
    font-weight: 400;
    display: block;
    letter-spacing: 2px;
    margin-top: 2px;
}
.amber-status {
    display: flex;
    align-items: center;
    gap: 8px;
    font-family: var(--mono);
    font-size: 14px;
    color: var(--muted);
}
.status-dot {
    width: 8px; height: 8px;
    border-radius: 50%;
    background: var(--green);
    box-shadow: 0 0 6px var(--green);
    animation: pulse 2s infinite;
}
@keyframes pulse {
    0%,100% { opacity:1; } 50% { opacity:0.4; }
}

/* ── Cards ── */
.card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 20px;
    margin-bottom: 16px;
}
.card-title {
    font-family: var(--mono);
    font-size: 13px;
    letter-spacing: 2px;
    color: var(--cyan-dim);
    text-transform: uppercase;
    margin-bottom: 14px;
    padding-bottom: 10px;
    border-bottom: 1px solid var(--border);
}

/* ── KPI tiles ── */
.kpi-tile {
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 14px 16px;
    text-align: center;
}
.kpi-value {
    font-family: var(--mono);
    font-size: 28px;
    font-weight: 700;
    line-height: 1;
    margin-bottom: 4px;
}
.kpi-label {
    font-size: 13px;
    color: var(--muted);
    letter-spacing: 1px;
    text-transform: uppercase;
}

/* ── Prediction badge ── */
.pred-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 10px 22px;
    border-radius: 8px;
    font-family: var(--mono);
    font-size: 16px;
    font-weight: 700;
    letter-spacing: 2px;
}
.pred-center { text-align:center; margin: 12px 0; }

/* ── Stat rows ── */
.stat-bar-wrap { margin: 6px 0; }
.stat-bar-header {
    display: flex;
    justify-content: space-between;
    font-size: 15px;
    margin-bottom: 4px;
}
.stat-bar-track {
    height: 6px;
    background: var(--surface2);
    border-radius: 4px;
    overflow: hidden;
}
.stat-bar-fill {
    height: 100%;
    border-radius: 4px;
    transition: width 0.6s ease;
}

/* ── Timeline entry ── */
.timeline-entry {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 8px 10px;
    border-radius: 8px;
    background: var(--surface2);
    margin-bottom: 6px;
    font-size: 14px;
}
.tl-dot {
    width: 8px; height: 8px;
    border-radius: 50%;
    flex-shrink: 0;
}
.tl-time {
    color: var(--muted);
    font-family: var(--mono);
    font-size: 13px;
}
.tl-pred {
    font-weight: 600;
    margin-left: auto;
    font-family: var(--mono);
    font-size: 14px;
}

/* ── Upload zone ── */
div[data-testid="stFileUploader"] {
    background: var(--surface2) !important;
    border: 1px dashed var(--cyan-dim) !important;
    border-radius: 10px !important;
    padding: 12px !important;
}
div[data-testid="stFileUploader"] label {
    color: var(--cyan) !important;
    font-family: var(--mono) !important;
    font-size: 13px !important;
}

/* ── Image display ── */
div[data-testid="stImage"] img {
    border-radius: 10px;
    border: 1px solid var(--border);
    max-width: 100% !important;
}

/* ── Buttons ── */
.stButton > button {
    background: transparent !important;
    border: 1px solid var(--cyan-dim) !important;
    color: var(--cyan) !important;
    font-family: var(--mono) !important;
    font-size: 13px !important;
    letter-spacing: 1px !important;
    border-radius: 8px !important;
    padding: 8px 18px !important;
    transition: all 0.2s !important;
}
.stButton > button:hover {
    background: var(--cyan-glow) !important;
    border-color: var(--cyan) !important;
}

/* ── Sidebar ── */
section[data-testid="stSidebar"] {
    background: var(--surface) !important;
    border-right: 1px solid var(--border) !important;
}
section[data-testid="stSidebar"] * { color: var(--white) !important; }

/* ── Confidence label ── */
.conf-label {
    font-family: var(--mono);
    font-size: 14px;
    color: var(--muted);
    text-align: center;
    margin-top: 4px;
}

/* ── Divider ── */
.divider { border:none; border-top:1px solid var(--border); margin:16px 0; }

/* ── Model accuracy ── */
.acc-row {
    display:flex;
    justify-content:space-between;
    align-items:center;
    font-size: 15px;
    padding: 6px 0;
    border-bottom: 1px solid var(--border);
}
.acc-row:last-child { border-bottom: none; }
.acc-val { font-family: var(--mono); color: var(--cyan); font-weight:700; }

/* ── Section heading ── */
h3 { font-family: var(--mono) !important; font-size:13px !important; letter-spacing:2px !important;
     color: var(--muted) !important; text-transform:uppercase !important; }
</style>
""", unsafe_allow_html=True)

# ─────────────────────────────────────────────
#  CONSTANTS & MODEL
# ─────────────────────────────────────────────
CAPTURE_FOLDER = "data/raw/real/CAPTURE_FOLDER"
LABELS = {0: 'Pure', 1: 'Glucose', 2: 'Adulterated', 3: 'Pathogens'}
COLORS = {
    "Pure":        ("#00e676", "#000"),
    "Adulterated": ("#ff4d4d", "#fff"),
    "Pathogens":   ("#b06ef3", "#fff"),
    "Glucose":     ("#e8f4f8", "#000"),
}
DOT_COLORS = {
    "Pure": "#00e676", "Adulterated": "#ff4d4d",
    "Pathogens": "#b06ef3", "Glucose": "#aaaaaa",
}

@st.cache_resource
def load_model():
    return tf.keras.models.load_model(os.path.join('models', 'milk_classifier_cnn.keras'))

model = load_model()


# ─────────────────────────────────────────────
#  HELPERS
# ─────────────────────────────────────────────
def preprocess_image(image_path):
    img = cv2.imread(image_path)
    img = cv2.resize(img, (128, 128))
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    img = img.astype('float32') / 255.0
    return np.expand_dims(img, axis=0)

def predict(image_path):
    features = preprocess_image(image_path)
    preds = model.predict(features, verbose=0)
    idx = np.argmax(preds[0])
    return LABELS[idx], float(preds[0][idx])

def predict_array(img_array):
    img = cv2.resize(img_array, (128, 128))
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    img = img.astype('float32') / 255.0
    img = np.expand_dims(img, axis=0)
    preds = model.predict(img, verbose=0)
    idx = np.argmax(preds[0])
    return LABELS[idx], float(preds[0][idx])

def badge_html(label, center=True, size="16px"):
    bg, txt = COLORS.get(label, ("#444", "#fff"))
    html = f"""<div class="pred-badge" style="background:{bg};color:{txt};font-size:{size};">{label}</div>"""
    if center:
        return f'<div class="pred-center">{html}</div>'
    return html

def stat_bar(label, count, total, color):
    pct = (count / total * 100) if total else 0
    return f"""
    <div class="stat-bar-wrap">
      <div class="stat-bar-header">
        <span style="color:#e8f4f8">{label}</span>
        <span style="color:{color};font-family:'Space Mono',monospace;font-size:15px">
          {count} &nbsp;<span style="color:#4a7a8a;font-size:13px">({pct:.0f}%)</span>
        </span>
      </div>
      <div class="stat-bar-track">
        <div class="stat-bar-fill" style="width:{pct}%;background:{color}"></div>
      </div>
    </div>"""

<<<<<<< HEAD

with st.sidebar.expander("Manage Captures", expanded=False):
    st.markdown('<div style="font-size:12px">', unsafe_allow_html=True)
    st.write("Safe Delete")
    # Prepare-delete preview (existing behavior)
    if st.button("Prepare delete", key="prepare_delete"):
        try:
            names = sorted(os.listdir(CAPTURE_FOLDER))
            deletables = []
            for name in names:
                path = os.path.join(CAPTURE_FOLDER, name)
                # skip directories (including 'thumbnail') to be safe
                if os.path.isdir(path):
                    continue
                # only include common image types
                if name.lower().endswith(('.png', '.jpg', '.jpeg', '.bmp', '.tiff', '.gif')):
                    deletables.append(name)
            st.session_state._delete_preview = deletables
        except Exception as e:
            st.error(f"Error preparing delete: {e}")
            st.session_state._delete_preview = []

    if st.session_state.get("_delete_preview"):
        preview = st.session_state["_delete_preview"]
        st.write(f"Files to delete ({len(preview)}):")
        # truncated listing
        for fn in preview[:50]:
            st.markdown(f"- {fn}", unsafe_allow_html=True)
        if len(preview) > 50:
            st.write("... (truncated)")
        if st.button("Confirm delete", key="confirm_delete"):
            deleted = 0
            errors = []
            for name in preview:
                p = os.path.join(CAPTURE_FOLDER, name)
                try:
                    os.remove(p)
                    deleted += 1
                except Exception as e:
                    errors.append((name, str(e)))
            st.success(f"Deleted {deleted} files.")
            if errors:
                st.error(f"Errors deleting {len(errors)} files.")
                for n, err in errors[:10]:
                    st.write(f"- {n}: {err}")
            # clear preview and reset session markers
            st.session_state._delete_preview = []
            st.session_state.last_file = None
            if hasattr(st, "experimental_rerun"):
                st.experimental_rerun()
            else:
                st.experimental_set_query_params(_refresh=str(time.time()))

    st.markdown("---")
    # Immediate delete-all action (skips directories)
    st.write("Force Delete")
    if st.button("Delete all images", key="delete_all_images"):
        deleted = 0
        errors = []
        try:
            for name in os.listdir(CAPTURE_FOLDER):
                p = os.path.join(CAPTURE_FOLDER, name)
                if os.path.isdir(p):
                    continue
                if name.lower().endswith(('.png', '.jpg', '.jpeg', '.bmp', '.tiff', '.gif')):
                    try:
                        os.remove(p)
                        deleted += 1
                    except Exception as e:
                        errors.append((name, str(e)))
            st.success(f"Deleted {deleted} files.")
            if errors:
                st.error(f"Errors deleting {len(errors)} files.")
        except Exception as e:
            st.error(f"Failed to delete files: {e}")
        # reset state and refresh UI
        st.session_state.last_file = None
        st.session_state.history = []
        if hasattr(st, "experimental_rerun"):
            st.experimental_rerun()
        else:
            st.experimental_set_query_params(_refresh=str(time))
    st.markdown('</div>', unsafe_allow_html=True)
#
st.title("AMBER: AI-driven Milk Bio-purity Evaluation Resource")
st.write("Waiting for new captures in CAPTURE_FOLDER...")

# Add show_conf definition here
show_conf = st.sidebar.checkbox("Show confidence values", value=False, key="show_conf_main")

# Update the file upload section with simpler code
st.markdown("### 📤 Upload Image for Classification")
uploaded_file = st.file_uploader("Choose an image file", type=['jpg', 'jpeg', 'png', 'bmp'])

# Update the prediction section in the upload handler
if uploaded_file is not None:
    try:
        # Read file directly from memory
        file_bytes = np.asarray(bytearray(uploaded_file.read()), dtype=np.uint8)
        image = cv2.imdecode(file_bytes, cv2.IMREAD_COLOR)
        
        # Preprocessing (without debug prints)
        img = cv2.resize(image, (128, 128))
        img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        img = img.astype('float32') / 255.0
        img = np.expand_dims(img, axis=0)
        
        # Make prediction
        predictions = model.predict(img, verbose=0)
        pred_idx = np.argmax(predictions[0])
        confidence = float(predictions[0][pred_idx])
        pred_label = labels[pred_idx]
        
        # Updated display section with better styling
        st.markdown('<div class="upload-prediction-container">', unsafe_allow_html=True)
        
        # Image container
        st.markdown('<div class="upload-image-container">', unsafe_allow_html=True)
        st.image(image, use_container_width=False)
        st.markdown('</div>', unsafe_allow_html=True)
        
        # Custom prediction badge
        colors = {
            "Adulterated": "#ff4b4b",
            "Pure": "#00e676",
            "Pathogens": "#9c27b0",
            "Glucose": "#ffffff"
        }
        bg = colors.get(pred_label, "#666666")
        txt_color = "#000000" if bg == "#ffffff" else "#ffffff"
        
        st.markdown(
            f"""<div class="prediction-badge-upload" style="background:{bg};color:{txt_color};">
                {pred_label}
            </div>""", 
            unsafe_allow_html=True
        )
        
        # Show confidence if enabled
        if show_conf:
            st.markdown('<div class="confidence-container">', unsafe_allow_html=True)
            conf_pct = int(confidence * 100)
            st.markdown(f'Confidence: {conf_pct}%', unsafe_allow_html=True)
            st.progress(confidence)
            st.markdown('</div>', unsafe_allow_html=True)
            
        st.markdown('</div>', unsafe_allow_html=True)
            
    except Exception as e:
        st.error(f"Error processing image: {e}")

# Auto-refresh in browser every 2000 ms (2s)
st_autorefresh(interval=2000, key="autorefresh")

# Initialize persistent UI state
if "last_file" not in st.session_state:
    st.session_state.last_file = None
if "history" not in st.session_state:
    # history: list of dicts {file, timestamp, prediction}
    st.session_state.history = []

# Safe listing of files (recomputed each rerun)
try:
    all_files = sorted(
        [f for f in os.listdir(CAPTURE_FOLDER) if os.path.isfile(os.path.join(CAPTURE_FOLDER, f))],
        key=lambda x: os.path.getmtime(os.path.join(CAPTURE_FOLDER, x)), reverse=True
    )
except Exception:
    st.error(f"Cannot access capture folder: {CAPTURE_FOLDER}")
    st.stop()

# Determine which new files to process (those newer than last_file)
to_process = []
if all_files:
    # If first run, only process the latest file (avoid backlog)
    if st.session_state.last_file is None:
        to_process = [all_files[0]]
    else:
        # collect files until we reach last_file (all_files sorted newest->oldest)
        for fname in all_files:
            full = os.path.join(CAPTURE_FOLDER, fname)
            if full == st.session_state.last_file:
                break
            to_process.append(fname)
    # process in chronological order (oldest first)
    to_process = list(reversed(to_process))

# Helper to check file stability (small wait to avoid reading partial writes)
=======
>>>>>>> 998c3d3 (chore: sync latest changes before Render deployment)
def is_stable(path, wait=0.2):
    try:
        s1 = os.path.getsize(path)
        time.sleep(wait)
        s2 = os.path.getsize(path)
        return s1 == s2 and s1 > 0
    except Exception:
        return False

def fmt_time(time_str):
    """Convert stored '%Y-%m-%d %H:%M:%S' to display-friendly 12hr format."""
    try:
        return datetime.strptime(time_str, "%Y-%m-%d %H:%M:%S").strftime("%d %b  %I:%M %p")
    except Exception:
        return time_str

def conf_bar_html(pct, align="center"):
    """Unified confidence label + bar — no st.progress, single HTML block."""
    return f"""
    <div style="margin-top:10px;">
      <div style="font-family:'Space Mono',monospace;font-size:14px;
                  color:#4a7a8a;margin-bottom:6px;text-align:{align};">
        Confidence: {pct}%
      </div>
      <div style="height:6px;background:#0f2330;border-radius:4px;overflow:hidden;">
        <div style="width:{pct}%;height:100%;background:#00d4ff;border-radius:4px;"></div>
      </div>
    </div>"""


# ─────────────────────────────────────────────
#  SESSION STATE
# ─────────────────────────────────────────────
if "last_file" not in st.session_state:
    st.session_state.last_file = None
if "history" not in st.session_state:
    st.session_state.history = []


# ─────────────────────────────────────────────
#  SIDEBAR
# ─────────────────────────────────────────────
with st.sidebar:
    st.markdown("""
    <div style="font-family:'Space Mono',monospace;font-size:14px;color:#00d4ff;
                letter-spacing:3px;padding:12px 0 8px 0;border-bottom:1px solid #1a3a4a;
                margin-bottom:16px;">
        AMBER PANEL
    </div>""", unsafe_allow_html=True)

    show_conf = st.checkbox("Show confidence values", value=True)

    with st.expander("🛠  Debug / Diagnostics", expanded=False):
        st.write("Last checked:", datetime.now().strftime("%I:%M:%S %p"))
        st.write("Folder:", CAPTURE_FOLDER)
        try:
            dbg_files = sorted(
                [f for f in os.listdir(CAPTURE_FOLDER)
                 if os.path.isfile(os.path.join(CAPTURE_FOLDER, f))],
                key=lambda x: os.path.getmtime(os.path.join(CAPTURE_FOLDER, x)),
                reverse=True
            )
            for f in dbg_files[:8]:
                st.markdown(f"<span style='font-size:12px;color:#4a7a8a'>{f}</span>",
                            unsafe_allow_html=True)
        except Exception as e:
            st.write("Error:", e)
        if st.button("Force refresh"):
            st.query_params["_r"] = str(time.time())

    with st.expander("🗑  Manage Captures", expanded=False):
        if st.button("Prepare delete"):
            try:
                names = sorted(os.listdir(CAPTURE_FOLDER))
                deletables = [n for n in names
                              if not os.path.isdir(os.path.join(CAPTURE_FOLDER, n))
                              and n.lower().endswith(('.png','.jpg','.jpeg','.bmp','.tiff','.gif'))]
                st.session_state._delete_preview = deletables
            except Exception as e:
                st.error(f"Error: {e}")
                st.session_state._delete_preview = []

        if st.session_state.get("_delete_preview"):
            preview = st.session_state["_delete_preview"]
            st.write(f"{len(preview)} files queued")
            if st.button("✓ Confirm delete"):
                deleted = 0
                for name in preview:
                    try:
                        os.remove(os.path.join(CAPTURE_FOLDER, name))
                        deleted += 1
                    except Exception:
                        pass
                st.success(f"Deleted {deleted} files.")
                st.session_state._delete_preview = []
                st.session_state.last_file = None

        st.markdown("---")
        if st.button("⚠ Delete all images"):
            deleted = 0
            try:
                for name in os.listdir(CAPTURE_FOLDER):
                    p = os.path.join(CAPTURE_FOLDER, name)
                    if not os.path.isdir(p) and name.lower().endswith(
                            ('.png','.jpg','.jpeg','.bmp','.tiff','.gif')):
                        os.remove(p)
                        deleted += 1
                st.success(f"Deleted {deleted} files.")
            except Exception as e:
                st.error(str(e))
            st.session_state.last_file = None
            st.session_state.history = []
            st.rerun()

    with st.expander("📜  History", expanded=False):
        if st.session_state.history:
            for item in reversed(st.session_state.history):
                try:
                    st.image(item["file"], width=80)
                except Exception:
                    pass
                st.markdown(
                    f"<div style='font-size:13px;color:#4a7a8a;font-family:Space Mono'>"
                    f"{fmt_time(item['time'])}</div>"
                    f"{badge_html(item['prediction'], center=False, size='13px')}",
                    unsafe_allow_html=True
                )
                if show_conf and "confidence" in item:
                    st.markdown(conf_bar_html(int(item["confidence"] * 100)), unsafe_allow_html=True)
                st.markdown("<hr style='border-color:#1a3a4a'>", unsafe_allow_html=True)
        else:
            st.markdown("<span style='color:#4a7a8a;font-size:13px'>No history yet.</span>",
                        unsafe_allow_html=True)


# ─────────────────────────────────────────────
#  HEADER BAR
# ─────────────────────────────────────────────
now_str = datetime.now().strftime("%d %b %Y  ·  %I:%M:%S %p")

total_today = sum(
    1 for x in st.session_state.history
    if datetime.strptime(x['time'], "%Y-%m-%d %H:%M:%S").date() == datetime.now().date()
) if st.session_state.history else 0

st.markdown(f"""
<div class="amber-header">
    <div>
        <div class="amber-logo">AMBER<span>AI-driven Milk Bio-purity Evaluation Resource</span></div>
    </div>
    <div class="amber-status">
        <div class="status-dot"></div>
        LIVE &nbsp;·&nbsp; {now_str} &nbsp;·&nbsp; {total_today} samples today
    </div>
</div>
""", unsafe_allow_html=True)


# ─────────────────────────────────────────────
#  AUTO-REFRESH
# ─────────────────────────────────────────────
st_autorefresh(interval=1000, key="autorefresh")


# ─────────────────────────────────────────────
#  PROCESS NEW CAPTURES
# ─────────────────────────────────────────────
try:
    all_files = sorted(
        [f for f in os.listdir(CAPTURE_FOLDER)
         if os.path.isfile(os.path.join(CAPTURE_FOLDER, f))],
        key=lambda x: os.path.getmtime(os.path.join(CAPTURE_FOLDER, x)),
        reverse=True
    )
except Exception:
    st.error(f"Cannot access capture folder: {CAPTURE_FOLDER}")
    st.stop()

to_process = []
if all_files:
    if st.session_state.last_file is None:
        to_process = [all_files[0]]
    else:
        for fname in all_files:
            full = os.path.join(CAPTURE_FOLDER, fname)
            if full == st.session_state.last_file:
                break
            to_process.append(fname)
    to_process = list(reversed(to_process))

for fname in to_process:
    fullpath = os.path.join(CAPTURE_FOLDER, fname)
    if not is_stable(fullpath):
        continue
    try:
        pred_label, pred_conf = predict(fullpath)
    except Exception as e:
        pred_label, pred_conf = f"ERROR: {e}", 0.0
    st.session_state.history.append({
        "file": fullpath,
        "time": datetime.fromtimestamp(os.path.getmtime(fullpath)).strftime("%Y-%m-%d %H:%M:%S"),
        "prediction": pred_label,
        "confidence": pred_conf
    })
    st.session_state.last_file = fullpath

if all_files and not to_process and st.session_state.last_file is None:
    st.session_state.last_file = os.path.join(CAPTURE_FOLDER, all_files[0])


# ─────────────────────────────────────────────
#  KPI ROW
# ─────────────────────────────────────────────
history = st.session_state.history
total      = len(history)
pure_c     = sum(1 for x in history if x['prediction'] == 'Pure')
adult_c    = sum(1 for x in history if x['prediction'] == 'Adulterated')
glucose_c  = sum(1 for x in history if x['prediction'] == 'Glucose')
pathogen_c = sum(1 for x in history if x['prediction'] == 'Pathogens')

st.markdown(f"""
<div style="display:grid; grid-template-columns:repeat(5,1fr); gap:12px; margin-bottom:1rem;">
  <div class="kpi-tile">
    <div class="kpi-value" style="color:#00d4ff">{total}</div>
    <div class="kpi-label">Total Samples</div>
  </div>
  <div class="kpi-tile">
    <div class="kpi-value" style="color:#00e676">{pure_c}</div>
    <div class="kpi-label">Pure</div>
  </div>
  <div class="kpi-tile">
    <div class="kpi-value" style="color:#ff4d4d">{adult_c}</div>
    <div class="kpi-label">Adulterated</div>
  </div>
  <div class="kpi-tile">
    <div class="kpi-value" style="color:#aaaaaa">{glucose_c}</div>
    <div class="kpi-label">Glucose</div>
  </div>
  <div class="kpi-tile">
    <div class="kpi-value" style="color:#b06ef3">{pathogen_c}</div>
    <div class="kpi-label">Pathogens</div>
  </div>
</div>
""", unsafe_allow_html=True)


# ─────────────────────────────────────────────
#  MAIN COLUMNS
# ─────────────────────────────────────────────
col_live, col_dash = st.columns([3, 2], gap="large")

# ── LEFT: Live Capture ──
with col_live:
    # Upload section
    st.markdown('<div class="card">', unsafe_allow_html=True)
    st.markdown('<div class="card-title">📤 Upload Image for Classification</div>', unsafe_allow_html=True)
    uploaded_file = st.file_uploader("", type=['jpg', 'jpeg', 'png', 'bmp'],
                                     label_visibility="collapsed")
    if uploaded_file:
        try:
            file_bytes = np.asarray(bytearray(uploaded_file.read()), dtype=np.uint8)
            image = cv2.imdecode(file_bytes, cv2.IMREAD_COLOR)
            pred_label, confidence = predict_array(image)

            uc1, uc2 = st.columns([1, 1])
            with uc1:
                st.image(image, channels="BGR", use_container_width=True)
            with uc2:
                st.markdown("<div style='height:30px'></div>", unsafe_allow_html=True)
                st.markdown(badge_html(pred_label, center=True), unsafe_allow_html=True)
                if show_conf:
                    st.markdown(conf_bar_html(int(confidence * 100), align="center"),
                                unsafe_allow_html=True)
        except Exception as e:
            st.error(f"Error: {e}")
    st.markdown('</div>', unsafe_allow_html=True)

    # Live capture section
    st.markdown('<div class="card">', unsafe_allow_html=True)
    st.markdown('<div class="card-title">🔴 Latest Capture</div>', unsafe_allow_html=True)
    if history:
        latest = history[-1]
        lc1, lc2 = st.columns([1, 1])
        with lc1:
            st.image(latest["file"], use_container_width=True,
                     caption=os.path.basename(latest["file"]))
        with lc2:
            conf_pct = int(latest.get("confidence", 0) * 100)
            st.markdown(f"""
            <div style="padding:12px 0">
              <div style="font-family:'Space Mono',monospace;font-size:13px;
                          color:#4a7a8a;margin-bottom:12px">{fmt_time(latest['time'])}</div>
            </div>
            """, unsafe_allow_html=True)
            st.markdown(badge_html(latest["prediction"], center=False), unsafe_allow_html=True)
            if show_conf and "confidence" in latest:
                st.markdown(conf_bar_html(conf_pct, align="left"), unsafe_allow_html=True)
    else:
        st.markdown("""
        <div style="text-align:center;color:#4a7a8a;padding:40px 0;
                    font-family:'Space Mono',monospace;font-size:13px;">
            Waiting for captures...
        </div>""", unsafe_allow_html=True)
    st.markdown('</div>', unsafe_allow_html=True)


# ── RIGHT: Dashboard ──
with col_dash:

    # Category breakdown
    st.markdown('<div class="card">', unsafe_allow_html=True)
    st.markdown('<div class="card-title">📊 Category Breakdown</div>', unsafe_allow_html=True)
    if total:
        st.markdown(
            stat_bar("Pure",        pure_c,     total, "#00e676") +
            stat_bar("Adulterated", adult_c,    total, "#ff4d4d") +
            stat_bar("Glucose",     glucose_c,  total, "#aaaaaa") +
            stat_bar("Pathogens",   pathogen_c, total, "#b06ef3"),
            unsafe_allow_html=True
        )
    else:
        st.markdown("<span style='color:#4a7a8a;font-size:14px'>No data yet.</span>",
                    unsafe_allow_html=True)
    st.markdown('</div>', unsafe_allow_html=True)

    # Recent timeline
    st.markdown('<div class="card">', unsafe_allow_html=True)
    st.markdown('<div class="card-title">🕒 Recent Timeline</div>', unsafe_allow_html=True)
    if history:
        recent = list(reversed(history[-8:]))
        entries = ""
        for item in recent:
            dot = DOT_COLORS.get(item['prediction'], '#888')
            entries += f"""
            <div class="timeline-entry">
              <div class="tl-dot" style="background:{dot};box-shadow:0 0 5px {dot}"></div>
              <div>
                <div class="tl-time">{fmt_time(item['time'])}</div>
                <div style="font-size:14px;margin-top:2px">{os.path.basename(item['file'])}</div>
              </div>
              <div class="tl-pred" style="color:{dot}">{item['prediction']}</div>
            </div>"""
        st.markdown(entries, unsafe_allow_html=True)
    else:
        st.markdown("<span style='color:#4a7a8a;font-size:14px'>No entries yet.</span>",
                    unsafe_allow_html=True)
    st.markdown('</div>', unsafe_allow_html=True)

    # Model performance
    st.markdown('<div class="card">', unsafe_allow_html=True)
    st.markdown('<div class="card-title">⚙ Model Performance</div>', unsafe_allow_html=True)
    st.markdown("""
    <div class="acc-row"><span>Validation Accuracy</span><span class="acc-val">86.81%</span></div>
    <div class="acc-row"><span>Training Accuracy</span>  <span class="acc-val">99.13%</span></div>
    <div class="acc-row"><span>Parameters</span>         <span class="acc-val">17.1M</span></div>
    <div class="acc-row"><span>Input Size</span>          <span class="acc-val">128 × 128</span></div>
    <div class="acc-row"><span>Classes</span>             <span class="acc-val">4</span></div>
    """, unsafe_allow_html=True)
    st.markdown('</div>', unsafe_allow_html=True)

    # Export
    st.markdown('<div class="card">', unsafe_allow_html=True)
    st.markdown('<div class="card-title">📥 Export</div>', unsafe_allow_html=True)
    if history:
        if st.button("Generate CSV Report"):
            import io, csv
            output = io.StringIO()
            writer = csv.writer(output)
            writer.writerow(['Timestamp', 'Prediction', 'Confidence', 'Filename'])
            for item in history:
                writer.writerow([
                    fmt_time(item['time']),
                    item['prediction'],
                    f"{int(item.get('confidence', 0)*100)}%",
                    os.path.basename(item['file'])
                ])
            st.download_button(
                label="⬇ Download CSV",
                data=output.getvalue(),
                file_name=f"amber_report_{datetime.now().strftime('%Y%m%d_%I%M%S_%p')}.csv",
                mime='text/csv'
            )
    else:
        st.markdown("<span style='color:#4a7a8a;font-size:14px'>No data to export.</span>",
                    unsafe_allow_html=True)
    st.markdown('</div>', unsafe_allow_html=True)

# ─────────────────────────────────────────────
#  FOOTER
# ─────────────────────────────────────────────
st.markdown("""
<div class="amber-header" style="margin-top:24px; margin-bottom:0;">
    <div style="display:flex; align-items:center; gap:32px;">
        <div>
            <div style="font-family:'Space Mono',monospace; font-size:11px;
                        color:#4a7a8a; letter-spacing:2px; text-transform:uppercase;
                        margin-bottom:4px;">Application</div>
            <div style="font-family:'Space Mono',monospace; font-size:13px;
                        color:#00d4ff;">AMBER &nbsp;<span style="color:#4a7a8a">v1.0.0</span></div>
        </div>
        <div style="width:1px; height:36px; background:#1a3a4a;"></div>
        <div>
            <div style="font-family:'Space Mono',monospace; font-size:11px;
                        color:#4a7a8a; letter-spacing:2px; text-transform:uppercase;
                        margin-bottom:4px;">Model</div>
            <div style="font-family:'Space Mono',monospace; font-size:13px;
                        color:#e8f4f8;">milk_classifier_cnn &nbsp;<span style="color:#4a7a8a">· 86.81% val acc</span></div>
        </div>
        <div style="width:1px; height:36px; background:#1a3a4a;"></div>
        <div>
            <div style="font-family:'Space Mono',monospace; font-size:11px;
                        color:#4a7a8a; letter-spacing:2px; text-transform:uppercase;
                        margin-bottom:4px;">Developer</div>
            <div style="font-family:'Space Mono',monospace; font-size:13px;
                        color:#e8f4f8;">Your Name / Team</div>
        </div>
    </div>
    <div style="width:1px; height:36px; background:#1a3a4a;"></div>
        <div style="font-family:'Space Mono',monospace; font-size:12px; color:#4a7a8a;">
            © 2026 AMBER · All rights reserved
        </div>
    </div>
""", unsafe_allow_html=True)

