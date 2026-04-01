"""
Evaluate model: compute accuracy, precision, recall, F1, ROC/AUC, PR, confusion matrices,
calibration and other metrics + generate plots. Save metrics to CSV/JSON and figures to out_dir.

Usage examples:
python scripts\evaluate_model.py --y_true data/processed/y_test.npy --probs outputs/preds_probs.npy --class_names "Pure,Glucose,Adulterated,Pathogens" --out_dir eval_out
python scripts\evaluate_model.py --y_true data/processed/y_test.npy --y_pred outputs/preds_labels.npy --out_dir eval_out
"""
import os
import argparse
import json
from pathlib import Path

import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

# Safe seaborn import with matplotlib fallback
try:
    import seaborn as sns
    has_seaborn = True
except ImportError:
    has_seaborn = False

# Use a safe style
plt.style.use('default')

from sklearn.metrics import (
    accuracy_score, balanced_accuracy_score, precision_recall_fscore_support,
    confusion_matrix, classification_report, roc_auc_score, average_precision_score,
    cohen_kappa_score, matthews_corrcoef
)
from sklearn.preprocessing import label_binarize
from sklearn.calibration import calibration_curve

def load_npy(path):
    return np.load(path)


def ensure_dir(p):
    Path(p).mkdir(parents=True, exist_ok=True)


def compute_basic_metrics(y_true, y_pred, labels):
    acc = accuracy_score(y_true, y_pred)
    bal_acc = balanced_accuracy_score(y_true, y_pred)
    kappa = cohen_kappa_score(y_true, y_pred)
    mcc = matthews_corrcoef(y_true, y_pred)
    p, r, f1, support = precision_recall_fscore_support(y_true, y_pred, labels=labels, zero_division=0)
    report = classification_report(y_true, y_pred, labels=labels, zero_division=0, output_dict=True)
    cm = confusion_matrix(y_true, y_pred, labels=labels)
    return {
        "accuracy": acc,
        "balanced_accuracy": bal_acc,
        "cohen_kappa": kappa,
        "matthews_corrcoef": mcc,
        "per_class_precision": p.tolist(),
        "per_class_recall": r.tolist(),
        "per_class_f1": f1.tolist(),
        "per_class_support": support.tolist(),
        "classification_report": report,
        "confusion_matrix": cm.tolist()
    }, cm


def compute_prob_metrics(y_true, probs, labels, label_names):
    # y_true: shape (n,), probs: shape (n, n_classes)
    n_classes = probs.shape[1]
    y_true_bin = label_binarize(y_true, classes=labels)
    # ROC AUC (ovr) and average precision per class
    roc_auc = {}
    avg_prec = {}
    for i, name in enumerate(label_names):
        try:
            roc_auc[name] = float(roc_auc_score(y_true_bin[:, i], probs[:, i]))
        except Exception:
            roc_auc[name] = None
        try:
            avg_prec[name] = float(average_precision_score(y_true_bin[:, i], probs[:, i]))
        except Exception:
            avg_prec[name] = None
    # macro/micro AUC
    try:
        roc_auc["macro"] = float(roc_auc_score(y_true_bin, probs, average="macro", multi_class="ovr"))
        roc_auc["micro"] = float(roc_auc_score(y_true_bin, probs, average="micro", multi_class="ovr"))
    except Exception:
        roc_auc["macro"], roc_auc["micro"] = None, None
    return roc_auc, avg_prec


def plot_confusion(cm, labels, outpath, normalize=False, cmap="Blues"):
    if normalize:
        cmn = cm.astype("float") / cm.sum(axis=1)[:, np.newaxis]
        data = cmn
        title = "Normalized confusion matrix"
        fmt = ".2f"
    else:
        data = cm
        title = "Confusion matrix"
        fmt = "d"
        
    plt.figure(figsize=(8, 6))
    
    # Use seaborn if available, otherwise matplotlib
    if has_seaborn:
        import seaborn as sns
        sns.heatmap(data, annot=True, fmt=fmt, xticklabels=labels, yticklabels=labels, cmap=cmap)
    else:
        im = plt.imshow(data, interpolation='nearest', cmap=cmap)
        plt.colorbar(im)
        plt.xticks(range(len(labels)), labels, rotation=45, ha='right')
        plt.yticks(range(len(labels)), labels)
        
        # Add text annotations
        for i in range(data.shape[0]):
            for j in range(data.shape[1]):
                plt.text(j, i, format(data[i, j], fmt),
                        ha="center", va="center")
    
    plt.ylabel("True")
    plt.xlabel("Predicted")
    plt.title(title)
    plt.tight_layout()
    plt.savefig(outpath)
    plt.close()


def plot_roc_pr(y_true, probs, labels, label_names, outdir):
    n_classes = probs.shape[1]
    y_true_bin = label_binarize(y_true, classes=labels)
    # ROC curves
    plt.figure(figsize=(8, 6))
    for i in range(n_classes):
        try:
            fpr, tpr, _ = roc_curve_safe(y_true_bin[:, i], probs[:, i])
            plt.plot(fpr, tpr, label=f"{label_names[i]} (AUC={roc_auc_score_safe(y_true_bin[:, i], probs[:, i]):.3f})")
        except Exception:
            continue
    plt.plot([0, 1], [0, 1], "k--", alpha=0.4)
    plt.xlabel("False Positive Rate")
    plt.ylabel("True Positive Rate")
    plt.title("ROC curves (one-vs-rest)")
    plt.legend(loc="lower right")
    plt.tight_layout()
    plt.savefig(os.path.join(outdir, "roc_curves.png"))
    plt.close()

    # Precision-Recall curves
    plt.figure(figsize=(8, 6))
    for i in range(n_classes):
        try:
            precision, recall, _ = pr_curve_safe(y_true_bin[:, i], probs[:, i])
            ap = average_precision_score_safe(y_true_bin[:, i], probs[:, i])
            plt.plot(recall, precision, label=f"{label_names[i]} (AP={ap:.3f})")
        except Exception:
            continue
    plt.xlabel("Recall")
    plt.ylabel("Precision")
    plt.title("Precision-Recall curves")
    plt.legend(loc="lower left")
    plt.tight_layout()
    plt.savefig(os.path.join(outdir, "pr_curves.png"))
    plt.close()


def roc_auc_score_safe(y_true, scores):
    try:
        return roc_auc_score(y_true, scores)
    except Exception:
        return float("nan")


def roc_curve_safe(y_true, scores):
    from sklearn.metrics import roc_curve
    return roc_curve(y_true, scores)


def pr_curve_safe(y_true, scores):
    from sklearn.metrics import precision_recall_curve
    return precision_recall_curve(y_true, scores)


def average_precision_score_safe(y_true, scores):
    try:
        return average_precision_score(y_true, scores)
    except Exception:
        return float("nan")


def plot_calibration(y_true, probs, label_names, outdir, n_bins=10):
    # reliability diagram per class (prob vs fraction)
    y_true_bin = label_binarize(y_true, classes=list(range(probs.shape[1])))
    for i, name in enumerate(label_names):
        try:
            prob = probs[:, i]
            true_bin = y_true_bin[:, i]
            frac_pos, mean_pred = calibration_curve(true_bin, prob, n_bins=n_bins, strategy="uniform")
            plt.figure(figsize=(6, 6))
            plt.plot(mean_pred, frac_pos, "s-", label=name)
            plt.plot([0, 1], [0, 1], "k--", alpha=0.4)
            plt.xlabel("Mean predicted probability")
            plt.ylabel("Fraction of positives")
            plt.title(f"Calibration plot: {name}")
            plt.legend()
            plt.tight_layout()
            plt.savefig(os.path.join(outdir, f"calibration_{i}_{name}.png"))
            plt.close()
        except Exception:
            continue


def plot_confidence_hist(probs, y_pred, label_names, outdir):
    # histogram of predicted confidences per predicted class
    confs = probs.max(axis=1)
    preds = y_pred
    df = pd.DataFrame({"pred": preds, "conf": confs})
    plt.figure(figsize=(8, 6))
    sns.histplot(data=df, x="conf", hue="pred", bins=20, element="step", stat="probability")
    plt.xlabel("Prediction confidence")
    plt.title("Confidence distribution per predicted class")
    plt.tight_layout()
    plt.savefig(os.path.join(outdir, "confidence_hist.png"))
    plt.close()


def save_metrics(metrics, outdir):
    Path(outdir).mkdir(parents=True, exist_ok=True)
    with open(os.path.join(outdir, "metrics.json"), "w") as f:
        json.dump(metrics, f, indent=2)
    # Also save a flat CSV for per-class numbers if present
    if "per_class_precision" in metrics:
        df = pd.DataFrame({
            "class": metrics.get("class_names", []),
            "precision": metrics["per_class_precision"],
            "recall": metrics["per_class_recall"],
            "f1": metrics["per_class_f1"],
            "support": metrics["per_class_support"]
        })
        df.to_csv(os.path.join(outdir, "per_class_metrics.csv"), index=False)


def main():
    parser = argparse.ArgumentParser(description="Evaluation and analysis toolkit")
    parser.add_argument("--y_true", required=True, help="Path to numpy .npy with true labels (shape: n, ints)")
    parser.add_argument("--y_pred", help="Path to numpy .npy with predicted labels (shape: n, ints)")
    parser.add_argument("--probs", help="Path to numpy .npy with predicted probabilities (shape: n, n_classes)")
    parser.add_argument("--class_names", help="Comma-separated class names or path to txt file with one name per line")
    parser.add_argument("--out_dir", default="eval_out", help="Directory to write metrics and figures")
    args = parser.parse_args()

    outdir = args.out_dir
    ensure_dir(outdir)

    y_true = load_npy(args.y_true)
    if args.class_names:
        if os.path.exists(args.class_names):
            with open(args.class_names) as f:
                label_names = [l.strip() for l in f if l.strip()]
        else:
            label_names = [s.strip() for s in args.class_names.split(",")]
    else:
        # infer from labels present
        labels_sorted = np.unique(y_true)
        label_names = [str(l) for l in labels_sorted]

    # labels used for ordering (ints)
    labels = np.unique(y_true).tolist()

    probs = None
    y_pred = None
    if args.probs:
        probs = load_npy(args.probs)
        if probs.ndim == 1:
            # single column; treat as predicted probabilities for positive class (binary)
            probs = np.vstack([1 - probs, probs]).T
        # derive predicted labels
        y_pred = np.argmax(probs, axis=1)
    elif args.y_pred:
        y_pred = load_npy(args.y_pred)
    else:
        raise SystemExit("Provide either --probs or --y_pred to evaluate")

    metrics_basic, cm = compute_basic_metrics(y_true, y_pred, labels)
    metrics_basic["class_names"] = label_names
    # If probabilities provided compute additional metrics
    if probs is not None:
        roc_auc, avg_prec = compute_prob_metrics(y_true, probs, labels, label_names)
        metrics_basic["roc_auc"] = roc_auc
        metrics_basic["average_precision"] = avg_prec

    # Save metrics and plots
    save_metrics(metrics_basic, outdir)
    plot_confusion(cm, label_names, os.path.join(outdir, "confusion_matrix.png"), normalize=False)
    plot_confusion(cm, label_names, os.path.join(outdir, "confusion_matrix_normalized.png"), normalize=True)
    if probs is not None:
        plot_roc_pr(y_true, probs, labels, label_names, outdir)
        plot_calibration(y_true, probs, label_names, outdir)
        plot_confidence_hist(probs, y_pred, label_names, outdir)

    # Save a classification report txt for quick reading
    with open(os.path.join(outdir, "classification_report.txt"), "w") as f:
        f.write(pd.DataFrame(metrics_basic["classification_report"]).to_string())

    print(f"Evaluation complete. Results saved to: {outdir}")


if __name__ == "__main__":
    main()