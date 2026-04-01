"""
Load a saved Keras model and produce predictions for a test set.
Supports either a directory organized for flow_from_directory or pre-saved .npy arrays.

Examples:
# directory-based (recommended; requires classes as subfolders and shuffle=False)
python scripts\predict_and_save.py --model models\milk_classifier_cnn.keras --test_dir data\raw\real --target_size 128 128 --batch_size 32 --out_dir outputs

# numpy-based (preprocessed arrays)
python scripts\predict_and_save.py --model models\milk_classifier_cnn.keras --x_test data\processed/X_test.npy --y_true data\processed/y_test.npy --out_dir outputs
"""
import os
import argparse
from pathlib import Path

import numpy as np
from tensorflow import keras
from tensorflow.keras.preprocessing.image import ImageDataGenerator

def ensure_dir(p):
    Path(p).mkdir(parents=True, exist_ok=True)

def predict_from_npy(model, x_path, y_path, out_dir):
    X = np.load(x_path)
    y = np.load(y_path) if y_path else None
    probs = model.predict(X, verbose=1)
    preds = np.argmax(probs, axis=1)
    np.save(os.path.join(out_dir, "preds_probs.npy"), probs)
    np.save(os.path.join(out_dir, "preds_labels.npy"), preds)
    if y is not None:
        np.save(os.path.join(out_dir, "y_true.npy"), y)
    print("Saved preds and probs to", out_dir)

def predict_from_dir(model, test_dir, target_size, batch_size, out_dir):
    datagen = ImageDataGenerator(rescale=1.0/255.0)
    gen = datagen.flow_from_directory(
        test_dir,
        target_size=tuple(target_size),
        color_mode="rgb",
        batch_size=batch_size,
        class_mode="categorical",
        shuffle=False
    )
    probs = model.predict(gen, verbose=1)
    preds = np.argmax(probs, axis=1)
    y_true = gen.classes
    # Save mapping and arrays
    np.save(os.path.join(out_dir, "preds_probs.npy"), probs)
    np.save(os.path.join(out_dir, "preds_labels.npy"), preds)
    np.save(os.path.join(out_dir, "y_true.npy"), y_true)
    # save class indices mapping
    with open(os.path.join(out_dir, "class_indices.json"), "w") as f:
        import json
        json.dump(gen.class_indices, f, indent=2)
    print("Saved preds/probs/y_true and class_indices to", out_dir)

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--model", required=True, help="Path to saved Keras model (.keras or .h5)")
    parser.add_argument("--test_dir", help="Directory with test images organized by class subfolders")
    parser.add_argument("--x_test", help="Path to X_test.npy (optional alternative to test_dir)")
    parser.add_argument("--y_true", help="Path to y_test.npy (required if using --x_test)")
    parser.add_argument("--batch_size", type=int, default=32)
    parser.add_argument("--target_size", nargs=2, type=int, default=[128,128], help="Width Height")
    parser.add_argument("--out_dir", default="outputs")
    args = parser.parse_args()

    ensure_dir(args.out_dir)
    model = keras.models.load_model(args.model)

    if args.x_test:
        if not args.y_true:
            raise SystemExit("When using --x_test you must provide --y_true")
        predict_from_npy(model, args.x_test, args.y_true, args.out_dir)
    elif args.test_dir:
        predict_from_dir(model, args.test_dir, args.target_size, args.batch_size, args.out_dir)
    else:
        raise SystemExit("Provide either --test_dir or --x_test/--y_true")

if __name__ == "__main__":
    main()