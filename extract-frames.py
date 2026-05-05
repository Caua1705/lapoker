"""
extract_frames.py
-----------------
Extrai N frames do vídeo MP4 e salva como WebP otimizados
na pasta: frames-mobile/

Uso: python extract_frames.py
Requer: pip install opencv-python Pillow
"""

import cv2
import shutil
from pathlib import Path

# ── CONFIG ───────────────────────────────────────────────────────────────────
VIDEO_PATH    = Path(__file__).parent / "video4.mp4"
OUTPUT_DIR    = Path(__file__).parent / "frames-mobile"
TOTAL_FRAMES  = 150        # número de frames extraídos
FRAME_WIDTH   = 1280       # largura de saída, altura proporcional
WEBP_QUALITY  = 82         # qualidade WebP
# ─────────────────────────────────────────────────────────────────────────────


def clean_output_dir():
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    # Apaga tudo dentro da pasta antes de gerar os novos frames
    for item in OUTPUT_DIR.iterdir():
        if item.is_file() or item.is_symlink():
            item.unlink()
        elif item.is_dir():
            shutil.rmtree(item)

    print(f"Pasta limpa: {OUTPUT_DIR}")


def extract():
    clean_output_dir()

    cap = cv2.VideoCapture(str(VIDEO_PATH))
    if not cap.isOpened():
        print(f"ERRO: não foi possível abrir {VIDEO_PATH}")
        return

    total_video_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    fps = cap.get(cv2.CAP_PROP_FPS)

    if total_video_frames <= 0 or fps <= 0:
        print("ERRO: não foi possível ler as informações do vídeo.")
        cap.release()
        return

    duration_s = total_video_frames / fps

    print(f"Vídeo: {total_video_frames} frames | {fps:.1f} fps | {duration_s:.1f}s")
    print(f"Extraindo {TOTAL_FRAMES} frames -> {OUTPUT_DIR}")

    step = total_video_frames / TOTAL_FRAMES

    for i in range(TOTAL_FRAMES):
        frame_index = int(i * step)

        cap.set(cv2.CAP_PROP_POS_FRAMES, frame_index)
        ret, frame = cap.read()

        if not ret:
            print(f"  aviso: frame {frame_index} não lido, pulando")
            continue

        # Redimensiona mantendo proporção
        h, w = frame.shape[:2]
        new_w = FRAME_WIDTH
        new_h = int(h * new_w / w)

        resized = cv2.resize(
            frame,
            (new_w, new_h),
            interpolation=cv2.INTER_AREA
        )

        # Salva como WebP
        out_path = OUTPUT_DIR / f"frame_{i:04d}.webp"

        cv2.imwrite(
            str(out_path),
            resized,
            [cv2.IMWRITE_WEBP_QUALITY, WEBP_QUALITY]
        )

        if i % 20 == 0 or i == TOTAL_FRAMES - 1:
            print(f"  [{i + 1:3d}/{TOTAL_FRAMES}] frame_{i:04d}.webp")

    cap.release()

    total_kb = sum(f.stat().st_size for f in OUTPUT_DIR.glob("*.webp")) / 1024

    print(
        f"\nConcluído! {TOTAL_FRAMES} frames -> "
        f"{total_kb:.0f} KB total ({total_kb / 1024:.1f} MB)"
    )
    print(f"Pasta: {OUTPUT_DIR}")


if __name__ == "__main__":
    extract()